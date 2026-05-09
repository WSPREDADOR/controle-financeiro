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
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

final class UpdateBackgroundSyncRunner {
    private static final String CHANNEL_ID = "app-updates-v1";
    private static final String CHANNEL_NAME = "Atualizações do app";
    private static final String CHANNEL_DESCRIPTION = "Avisos quando uma nova versão do Controle de Dívidas estiver disponível.";
    private static final String APK_FILE_NAME = "Controle.de.Dividas.apk";
    private static final int DEFAULT_TIMEOUT_MS = 8000;

    private UpdateBackgroundSyncRunner() {}

    static void poll(Context context) {
        Context appContext = context.getApplicationContext();
        SharedPreferences preferences = UpdateBackgroundSyncScheduler.getPreferences(appContext);

        if (!UpdateBackgroundSyncScheduler.isConfigured(appContext)) {
            return;
        }

        String currentVersion = preferences.getString(UpdateBackgroundSyncScheduler.KEY_CURRENT_VERSION, "");
        int timeoutMs = (int) Math.max(
            3000L,
            preferences.getLong(UpdateBackgroundSyncScheduler.KEY_REQUEST_TIMEOUT_MS, DEFAULT_TIMEOUT_MS)
        );

        try {
            List<UpdateCandidate> candidates = new ArrayList<>();
            addManifestCandidate(candidates, preferences.getString(UpdateBackgroundSyncScheduler.KEY_MANIFEST_URL, ""), timeoutMs);
            addManifestCandidate(candidates, preferences.getString(UpdateBackgroundSyncScheduler.KEY_MANIFEST_FALLBACK_URL, ""), timeoutMs);
            addReleaseCandidate(candidates, preferences.getString(UpdateBackgroundSyncScheduler.KEY_RELEASE_API_URL, ""), timeoutMs);

            UpdateCandidate latest = findLatest(candidates);
            if (latest == null || !isRemoteVersionNewer(latest.version, currentVersion)) {
                clearStaleNotifiedVersion(preferences, currentVersion);
                preferences.edit()
                    .putLong(UpdateBackgroundSyncScheduler.KEY_LAST_SYNC_AT, System.currentTimeMillis())
                    .remove(UpdateBackgroundSyncScheduler.KEY_LAST_ERROR)
                    .apply();
                return;
            }

            String lastNotifiedVersion = preferences.getString(UpdateBackgroundSyncScheduler.KEY_LAST_NOTIFIED_VERSION, "");
            if (!latest.version.equals(lastNotifiedVersion) && showUpdateNotification(appContext, latest)) {
                preferences.edit()
                    .putString(UpdateBackgroundSyncScheduler.KEY_LAST_NOTIFIED_VERSION, latest.version)
                    .putLong(UpdateBackgroundSyncScheduler.KEY_LAST_SYNC_AT, System.currentTimeMillis())
                    .remove(UpdateBackgroundSyncScheduler.KEY_LAST_ERROR)
                    .apply();
                return;
            }

            preferences.edit()
                .putLong(UpdateBackgroundSyncScheduler.KEY_LAST_SYNC_AT, System.currentTimeMillis())
                .remove(UpdateBackgroundSyncScheduler.KEY_LAST_ERROR)
                .apply();
        } catch (Exception error) {
            preferences.edit()
                .putString(UpdateBackgroundSyncScheduler.KEY_LAST_ERROR, error.getMessage() == null ? "Erro desconhecido" : error.getMessage())
                .apply();
        }
    }

    private static void addManifestCandidate(List<UpdateCandidate> candidates, String url, int timeoutMs) {
        if (!hasText(url)) {
            return;
        }

        try {
            JSONObject manifest = fetchJson(withNoCache(url), timeoutMs, null);
            String version = manifest.optString("version", "").trim();
            if (!hasText(version)) {
                return;
            }

            candidates.add(new UpdateCandidate(
                version,
                manifest.optString("notes", "").trim(),
                manifest.optString("apkUrl", "").trim(),
                2
            ));
        } catch (Exception ignored) {}
    }

    private static void addReleaseCandidate(List<UpdateCandidate> candidates, String url, int timeoutMs) {
        if (!hasText(url)) {
            return;
        }

        try {
            JSONObject release = fetchJson(withNoCache(url), timeoutMs, "application/vnd.github+json");
            String tagName = release.optString("tag_name", "").trim().replaceFirst("^[vV]", "");
            if (!hasText(tagName)) {
                return;
            }

            String apkUrl = "";
            JSONArray assets = release.optJSONArray("assets");
            if (assets != null) {
                for (int index = 0; index < assets.length(); index += 1) {
                    JSONObject asset = assets.optJSONObject(index);
                    if (asset == null) {
                        continue;
                    }

                    String name = asset.optString("name", "");
                    String downloadUrl = asset.optString("browser_download_url", "");
                    boolean isPreferredApk = APK_FILE_NAME.equals(name) || downloadUrl.endsWith("/" + APK_FILE_NAME);
                    boolean isAnyApk = name.toLowerCase().endsWith(".apk") || downloadUrl.toLowerCase().endsWith(".apk");

                    if (isPreferredApk || (isAnyApk && !hasText(apkUrl))) {
                        apkUrl = downloadUrl;
                        if (isPreferredApk) {
                            break;
                        }
                    }
                }
            }

            if (!hasText(apkUrl)) {
                apkUrl = "https://github.com/WSPREDADOR/controle-financeiro/releases/download/v" + tagName + "/" + APK_FILE_NAME;
            }

            candidates.add(new UpdateCandidate(tagName, release.optString("body", "").trim(), apkUrl, 3));
        } catch (Exception ignored) {}
    }

    private static JSONObject fetchJson(String url, int timeoutMs, String acceptHeader) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(timeoutMs);
        connection.setReadTimeout(timeoutMs);
        connection.setRequestProperty("Accept", hasText(acceptHeader) ? acceptHeader : "application/json");
        connection.setRequestProperty("User-Agent", "ControleDeDividasAndroid/1.0");

        int statusCode = connection.getResponseCode();
        String responseBody = readResponseBody(statusCode >= 200 && statusCode < 300
            ? connection.getInputStream()
            : connection.getErrorStream());

        if (statusCode < 200 || statusCode >= 300) {
            throw new UpdateCheckException("Erro " + statusCode);
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

    private static String withNoCache(String url) {
        String separator = url.contains("?") ? "&" : "?";
        return url + separator + "background_check=" + System.currentTimeMillis();
    }

    private static UpdateCandidate findLatest(List<UpdateCandidate> candidates) {
        UpdateCandidate latest = null;

        for (UpdateCandidate candidate : candidates) {
            if (candidate == null || !hasText(candidate.version)) {
                continue;
            }

            if (latest == null || isRemoteVersionNewer(candidate.version, latest.version)) {
                latest = candidate;
                continue;
            }

            if (candidate.version.equals(latest.version) && candidate.score > latest.score) {
                latest = candidate;
            }
        }

        return latest;
    }

    private static boolean showUpdateNotification(Context context, UpdateCandidate update) {
        NotificationManagerCompat manager = NotificationManagerCompat.from(context);
        if (!manager.areNotificationsEnabled()) {
            return false;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
            && ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            return false;
        }

        createNotificationChannel(context);

        String title = "Nova versão v" + update.version + " disponível";
        String body = getNotificationBody(update);
        int notificationId = createUpdateNotificationId(update.version);
        PendingIntent contentIntent = buildContentIntent(context, update.version, notificationId);

        Notification notification = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setColor(Color.parseColor("#55d4cb"))
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(body).setSummaryText("Atualização"))
            .setSubText("Atualização")
            .setCategory(NotificationCompat.CATEGORY_STATUS)
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

    private static String getNotificationBody(UpdateCandidate update) {
        String notes = update.notes == null ? "" : update.notes.trim().replaceAll("\\s+", " ");
        if (!hasText(notes)) {
            return "Toque para abrir o app e atualizar o Controle de Dívidas.";
        }

        String prefix = "Toque para atualizar. ";
        int maxNotesLength = Math.max(0, 180 - prefix.length());
        if (notes.length() > maxNotesLength) {
            notes = notes.substring(0, maxNotesLength).trim() + "...";
        }

        return prefix + notes;
    }

    private static PendingIntent buildContentIntent(Context context, String version, int requestCode) {
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (intent == null) {
            intent = new Intent(context, MainActivity.class);
        }

        intent.setAction(MainActivity.ACTION_OPEN_UPDATE);
        intent.putExtra(MainActivity.EXTRA_OPEN_UPDATE, true);
        intent.putExtra(MainActivity.EXTRA_UPDATE_VERSION, version);
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

    private static void clearStaleNotifiedVersion(SharedPreferences preferences, String currentVersion) {
        String lastNotifiedVersion = preferences.getString(UpdateBackgroundSyncScheduler.KEY_LAST_NOTIFIED_VERSION, "");
        if (hasText(lastNotifiedVersion) && !isRemoteVersionNewer(lastNotifiedVersion, currentVersion)) {
            preferences.edit().remove(UpdateBackgroundSyncScheduler.KEY_LAST_NOTIFIED_VERSION).apply();
        }
    }

    private static boolean isRemoteVersionNewer(String remoteVersion, String currentVersion) {
        int[] remote = parseVersion(remoteVersion);
        int[] current = parseVersion(currentVersion);
        int maxLength = Math.max(remote.length, current.length);

        for (int index = 0; index < maxLength; index += 1) {
            int remoteValue = index < remote.length ? remote[index] : 0;
            int currentValue = index < current.length ? current[index] : 0;

            if (remoteValue > currentValue) {
                return true;
            }

            if (remoteValue < currentValue) {
                return false;
            }
        }

        return false;
    }

    private static int[] parseVersion(String version) {
        String[] parts = (version == null ? "" : version.trim()).split("\\.");
        int[] values = new int[Math.max(1, parts.length)];

        for (int index = 0; index < values.length; index += 1) {
            try {
                values[index] = Integer.parseInt(parts[index].replaceAll("[^0-9].*$", ""));
            } catch (Exception ignored) {
                values[index] = 0;
            }
        }

        return values;
    }

    private static int createUpdateNotificationId(String version) {
        String source = "update:" + version;
        int hash = 0;

        for (int index = 0; index < source.length(); index += 1) {
            hash = ((hash << 5) - hash) + source.charAt(index);
        }

        long unsignedHash = hash & 0xffffffffL;
        return 1800000000 + (int) (unsignedHash % 200000000L);
    }

    private static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private static final class UpdateCandidate {
        final String version;
        final String notes;
        final String apkUrl;
        final int score;

        UpdateCandidate(String version, String notes, String apkUrl, int score) {
            this.version = version;
            this.notes = notes;
            this.apkUrl = apkUrl;
            this.score = score;
        }
    }

    private static final class UpdateCheckException extends Exception {
        UpdateCheckException(String message) {
            super(message);
        }
    }
}
