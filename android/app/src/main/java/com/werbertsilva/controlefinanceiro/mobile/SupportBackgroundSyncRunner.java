package com.werbertsilva.controlefinanceiro.mobile;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

final class SupportBackgroundSyncRunner {
    private static final String CAPACITOR_PREFS_NAME = "CapacitorStorage";
    private static final String SUPPORT_LAST_NOTIFIED_MESSAGE_KEY = "cf-support-last-notified-message-v1";
    private static final String SUPPORT_LICENSE_STATUS_KEY = "cf-support-license-status-v1";
    private static final String SUPPORT_REMOTE_MESSAGE_KEY = "cf-support-remote-message-v1";
    private static final String CHANNEL_ID = "support-messages-v2";
    private static final String CHANNEL_NAME = "Mensagens do suporte";
    private static final String CHANNEL_DESCRIPTION = "Avisos quando o suporte responder no chat.";
    private static final int DEFAULT_TIMEOUT_MS = 8000;

    private SupportBackgroundSyncRunner() {}

    static void poll(Context context) {
        Context appContext = context.getApplicationContext();
        SharedPreferences preferences = SupportBackgroundSyncScheduler.getPreferences(appContext);
        SharedPreferences capacitorStorage = appContext.getSharedPreferences(CAPACITOR_PREFS_NAME, Context.MODE_PRIVATE);

        if (!SupportBackgroundSyncScheduler.isConfigured(appContext)) {
            return;
        }

        String supabaseUrl = preferences.getString(SupportBackgroundSyncScheduler.KEY_SUPABASE_URL, "");
        String supabaseAnonKey = preferences.getString(SupportBackgroundSyncScheduler.KEY_SUPABASE_ANON_KEY, "");
        String supportId = preferences.getString(SupportBackgroundSyncScheduler.KEY_SUPPORT_ID, "");
        String deviceToken = preferences.getString(SupportBackgroundSyncScheduler.KEY_DEVICE_TOKEN, "");
        int timeoutMs = (int) Math.max(
            3000L,
            preferences.getLong(SupportBackgroundSyncScheduler.KEY_REQUEST_TIMEOUT_MS, DEFAULT_TIMEOUT_MS)
        );

        try {
            JSONObject result = listSupportMessages(supabaseUrl, supabaseAnonKey, supportId, deviceToken, timeoutMs);
            if (!result.optBoolean("ok", false)) {
                throw new SupportRpcException(result.optString("error", "Falha ao consultar suporte."));
            }

            JSONObject device = result.optJSONObject("device");
            if (device != null) {
                capacitorStorage.edit()
                    .putString(SUPPORT_LICENSE_STATUS_KEY, normalizeLicenseStatus(device.optString("license_status", "free")))
                    .putString(SUPPORT_REMOTE_MESSAGE_KEY, device.optString("remote_message", ""))
                    .apply();
            }

            SupportMessageDigest digest = findLatestUnreadAdminMessage(result.optJSONArray("messages"));
            if (digest != null && hasText(digest.messageId)) {
                String lastNotified = capacitorStorage.getString(SUPPORT_LAST_NOTIFIED_MESSAGE_KEY, "");
                if (!digest.messageId.equals(lastNotified)) {
                    if (showSupportNotification(appContext, digest)) {
                        capacitorStorage.edit().putString(SUPPORT_LAST_NOTIFIED_MESSAGE_KEY, digest.messageId).apply();
                    }
                }
            }

            preferences.edit()
                .putLong(SupportBackgroundSyncScheduler.KEY_LAST_SYNC_AT, System.currentTimeMillis())
                .remove(SupportBackgroundSyncScheduler.KEY_LAST_ERROR)
                .apply();
        } catch (Exception error) {
            preferences.edit()
                .putString(SupportBackgroundSyncScheduler.KEY_LAST_ERROR, error.getMessage() == null ? "Erro desconhecido" : error.getMessage())
                .apply();
        }
    }

    private static JSONObject listSupportMessages(
        String supabaseUrl,
        String supabaseAnonKey,
        String supportId,
        String deviceToken,
        int timeoutMs
    ) throws Exception {
        JSONObject payload = new JSONObject()
            .put("p_support_id", supportId)
            .put("p_device_token", deviceToken)
            .put("p_mark_read", false);

        try {
            return postRpc(supabaseUrl, supabaseAnonKey, "app_list_support_messages", payload, timeoutMs);
        } catch (SupportRpcException error) {
            String message = String.valueOf(error.getMessage()).toLowerCase();
            boolean canRetryWithoutMarkRead = message.contains("p_mark_read")
                || message.contains("schema cache")
                || message.contains("could not find")
                || message.contains("function");

            if (!canRetryWithoutMarkRead) {
                throw error;
            }

            JSONObject fallbackPayload = new JSONObject()
                .put("p_support_id", supportId)
                .put("p_device_token", deviceToken);
            return postRpc(supabaseUrl, supabaseAnonKey, "app_list_support_messages", fallbackPayload, timeoutMs);
        }
    }

    private static JSONObject postRpc(
        String supabaseUrl,
        String supabaseAnonKey,
        String functionName,
        JSONObject payload,
        int timeoutMs
    ) throws Exception {
        String baseUrl = supabaseUrl == null ? "" : supabaseUrl.replaceAll("/+$", "");
        HttpURLConnection connection = (HttpURLConnection) new URL(baseUrl + "/rest/v1/rpc/" + functionName).openConnection();
        connection.setRequestMethod("POST");
        connection.setConnectTimeout(timeoutMs);
        connection.setReadTimeout(timeoutMs);
        connection.setDoOutput(true);
        connection.setRequestProperty("apikey", supabaseAnonKey);
        connection.setRequestProperty("Authorization", "Bearer " + supabaseAnonKey);
        connection.setRequestProperty("Content-Type", "application/json");

        byte[] body = payload.toString().getBytes(StandardCharsets.UTF_8);
        try (OutputStream outputStream = connection.getOutputStream()) {
            outputStream.write(body);
        }

        int statusCode = connection.getResponseCode();
        String responseBody = readResponseBody(statusCode >= 200 && statusCode < 300
            ? connection.getInputStream()
            : connection.getErrorStream());

        if (statusCode < 200 || statusCode >= 300) {
            String errorMessage = responseBody;
            try {
                errorMessage = new JSONObject(responseBody).optString("message", responseBody);
            } catch (JSONException ignored) {}
            throw new SupportRpcException(errorMessage);
        }

        return responseBody.trim().isEmpty() ? new JSONObject() : new JSONObject(responseBody);
    }

    private static String readResponseBody(InputStream stream) throws Exception {
        if (stream == null) {
            return "";
        }

        StringBuilder builder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
        }
        return builder.toString();
    }

    private static SupportMessageDigest findLatestUnreadAdminMessage(JSONArray messages) {
        if (messages == null || messages.length() == 0) {
            return null;
        }

        SupportMessageDigest digest = null;

        for (int index = 0; index < messages.length(); index += 1) {
            JSONObject message = messages.optJSONObject(index);
            if (message == null || !"admin".equals(message.optString("sender", "")) || !isUnread(message)) {
                continue;
            }

            String messageId = message.optString("id", "");
            if (!hasText(messageId)) {
                continue;
            }

            String createdAt = message.optString("created_at", "");
            String preview = getSupportMessagePreview(message);
            if (digest == null) {
                digest = new SupportMessageDigest(messageId, createdAt, preview, 1);
                continue;
            }

            digest.unreadCount += 1;
            if (createdAt.compareTo(digest.createdAt) >= 0) {
                digest.messageId = messageId;
                digest.createdAt = createdAt;
                digest.preview = preview;
            }
        }

        return digest;
    }

    private static boolean isUnread(JSONObject message) {
        return !message.has("read_at") || message.isNull("read_at") || !hasText(message.optString("read_at", ""));
    }

    private static String getSupportMessagePreview(JSONObject message) {
        if ("image".equals(message.optString("message_type", ""))) {
            return "O suporte enviou uma imagem.";
        }

        String value = message.optString("message", "").trim();
        if (value.isEmpty()) {
            value = "Nova resposta do suporte.";
        }

        return value.length() > 180 ? value.substring(0, 180) : value;
    }

    private static boolean showSupportNotification(Context context, SupportMessageDigest digest) {
        NotificationManagerCompat manager = NotificationManagerCompat.from(context);
        if (!manager.areNotificationsEnabled()) {
            return false;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
            && ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            return false;
        }

        createNotificationChannel(context);

        String title = digest.unreadCount > 1
            ? digest.unreadCount + " mensagens do suporte"
            : "Resposta do suporte";
        int notificationId = createSupportNotificationId(digest.messageId);
        PendingIntent contentIntent = buildContentIntent(context, digest.messageId, notificationId);

        Notification notification = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setColor(Color.parseColor("#55d4cb"))
            .setContentTitle(title)
            .setContentText(digest.preview)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(digest.preview).setSummaryText("Falar com suporte"))
            .setSubText("Falar com suporte")
            .setCategory(NotificationCompat.CATEGORY_MESSAGE)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setAutoCancel(true)
            .setOnlyAlertOnce(false)
            .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
            .setContentIntent(contentIntent)
            .build();

        try {
            manager.notify(notificationId, notification);
            return true;
        } catch (SecurityException ignored) {
            return false;
        }
    }

    private static PendingIntent buildContentIntent(Context context, String messageId, int requestCode) {
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (intent == null) {
            intent = new Intent(context, MainActivity.class);
        }

        intent.setAction(MainActivity.ACTION_OPEN_SUPPORT_CHAT);
        intent.putExtra(MainActivity.EXTRA_OPEN_SUPPORT_CHAT, true);
        intent.putExtra(MainActivity.EXTRA_SUPPORT_MESSAGE_ID, messageId);
        intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        return PendingIntent.getActivity(context, requestCode, intent, flags);
    }

    private static void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return;
        }

        NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
        if (notificationManager == null) {
            return;
        }

        NotificationChannel channel = new NotificationChannel(CHANNEL_ID, CHANNEL_NAME, NotificationManager.IMPORTANCE_HIGH);
        channel.setDescription(CHANNEL_DESCRIPTION);
        channel.enableLights(true);
        channel.setLightColor(Color.parseColor("#55d4cb"));
        channel.enableVibration(true);
        channel.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
        notificationManager.createNotificationChannel(channel);
    }

    private static int createSupportNotificationId(String messageId) {
        String source = "support:" + messageId;
        int hash = 0;

        for (int index = 0; index < source.length(); index += 1) {
            hash = ((hash << 5) - hash) + source.charAt(index);
        }

        long unsignedHash = hash & 0xffffffffL;
        return 300000000 + (int) (unsignedHash % 1200000000L);
    }

    private static String normalizeLicenseStatus(String status) {
        if ("trial".equals(status) || "premium".equals(status) || "blocked".equals(status)) {
            return status;
        }

        return "free";
    }

    private static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private static final class SupportMessageDigest {
        String messageId;
        String createdAt;
        String preview;
        int unreadCount;

        SupportMessageDigest(String messageId, String createdAt, String preview, int unreadCount) {
            this.messageId = messageId;
            this.createdAt = createdAt == null ? "" : createdAt;
            this.preview = preview;
            this.unreadCount = unreadCount;
        }
    }

    private static final class SupportRpcException extends Exception {
        SupportRpcException(String message) {
            super(message);
        }
    }
}
