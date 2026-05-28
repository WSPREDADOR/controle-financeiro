package com.werbertsilva.controlefinanceiro.mobile;

import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageInfo;
import android.os.Bundle;
import android.os.Build;
import android.os.Environment;
import android.net.Uri;
import android.provider.Settings;
import android.util.Base64;
import android.webkit.ValueCallback;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import com.getcapacitor.BridgeActivity;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends BridgeActivity {
    public static final String ACTION_OPEN_SUPPORT_CHAT = "com.werbertsilva.controlefinanceiro.mobile.OPEN_SUPPORT_CHAT";
    public static final String EXTRA_OPEN_SUPPORT_CHAT = "cf_open_support_chat";
    public static final String EXTRA_SUPPORT_MESSAGE_ID = "cf_support_message_id";
    private static final String UPDATE_JSON_URL = "https://raw.githubusercontent.com/WSPREDADOR/controle-financeiro/main/update/update.json";
    private static final String UPDATE_JSON_FALLBACK_URL = "https://cdn.jsdelivr.net/gh/WSPREDADOR/controle-financeiro@main/update/update.json";
    private static final int UPDATE_REQUEST_TIMEOUT_MS = 15000;
    private static final int UPDATE_APK_DOWNLOAD_TIMEOUT_MS = 60000;

    private final ExecutorService updateExecutor = Executors.newSingleThreadExecutor();
    private DownloadManager updateDownloadManager;
    private BroadcastReceiver updateDownloadReceiver;
    private long activeUpdateDownloadId = -1L;
    private String activeUpdateFileName = "controle-de-dividas-update.apk";
    private boolean nativeUpdateDialogShowing = false;
    private boolean nativeUpdateCheckStarted = false;
    private UpdateInfo pendingInstallPermissionUpdate;
    private AlertDialog nativeUpdateProgressDialog;
    private ProgressBar nativeUpdateProgressBar;
    private TextView nativeUpdateProgressText;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(UpdateInstallerPlugin.class);
        registerPlugin(NativeSharePlugin.class);
        registerPlugin(NotificationPermissionsPlugin.class);
        registerPlugin(SupportBackgroundSyncPlugin.class);
        registerPlugin(com.capacitorjs.plugins.filesystem.FilesystemPlugin.class);
        registerPlugin(com.capacitorjs.plugins.app.AppPlugin.class);
        registerPlugin(com.capacitorjs.plugins.preferences.PreferencesPlugin.class);
        super.onCreate(savedInstanceState);
        updateDownloadManager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
        registerNativeUpdateDownloadReceiver();
        SupportBackgroundSyncScheduler.scheduleNext(this, 15000L);
        runLegacyWebMigrationIfNeeded();
        handleNotificationIntent(getIntent(), 1800L);
        getWindow().getDecorView().postDelayed(this::checkForNativeUpdates, 2800L);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleNotificationIntent(intent, 450L);
    }

    @Override
    public void onResume() {
        super.onResume();

        if (pendingInstallPermissionUpdate == null) {
            return;
        }

        UpdateInfo update = pendingInstallPermissionUpdate;
        pendingInstallPermissionUpdate = null;

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O || getPackageManager().canRequestPackageInstalls()) {
            installNativeUpdate(update);
            return;
        }

        getWindow().getDecorView().postDelayed(() -> showNativeUpdateDialog(update), 500L);
    }

    @Override
    public void onDestroy() {
        if (updateDownloadReceiver != null) {
            try {
                unregisterReceiver(updateDownloadReceiver);
            } catch (IllegalArgumentException ignored) {
            }
        }

        updateExecutor.shutdownNow();
        super.onDestroy();
    }

    private void runLegacyWebMigrationIfNeeded() {
        SharedPreferences preferences = getSharedPreferences("controle_financeiro", MODE_PRIVATE);
        String migrationKey = "legacy_web_cleanup_" + getInstalledVersionName();

        if (preferences.getBoolean(migrationKey, false)) {
            return;
        }

        preferences.edit().putBoolean(migrationKey, true).apply();
        getBridge().getWebView().clearCache(true);

        getBridge().getWebView().postDelayed(() -> getBridge().getWebView().evaluateJavascript(
            "(function () {" +
                "try {" +
                    "return JSON.stringify({" +
                        "plans: localStorage.getItem('payment-plans-v1') || ''," +
                        "selected: localStorage.getItem('selected-plan-id') || ''" +
                    "});" +
                "} catch (_) {" +
                    "return JSON.stringify({ plans: '', selected: '' });" +
                "}" +
            "})();",
            (ValueCallback<String>) value -> {
                String payload = value == null ? "{\"plans\":\"\",\"selected\":\"\"}" : value;
                String escapedPayload = payload
                    .replace("\\", "\\\\")
                    .replace("'", "\\'");

                getBridge().getWebView().evaluateJavascript(
                    "(async function () {" +
                        "try {" +
                            "const preserved = JSON.parse('" + escapedPayload + "');" +
                            "localStorage.clear();" +
                            "sessionStorage.clear();" +
                            "if (preserved.plans) {" +
                                "localStorage.setItem('payment-plans-v1', preserved.plans);" +
                            "}" +
                            "if (preserved.selected) {" +
                                "localStorage.setItem('selected-plan-id', preserved.selected);" +
                            "}" +
                            "if ('serviceWorker' in navigator) {" +
                                "const registrations = await navigator.serviceWorker.getRegistrations();" +
                                "await Promise.all(registrations.map((registration) => registration.unregister()));" +
                            "}" +
                            "if (window.caches && caches.keys) {" +
                                "const keys = await caches.keys();" +
                                "await Promise.all(keys.map((key) => caches.delete(key)));" +
                            "}" +
                            "location.reload();" +
                        "} catch (_) {" +
                            "location.reload();" +
                        "}" +
                    "})();",
                    null
                );
            }
        ), 1200);
    }

    private String getInstalledVersionName() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
        } catch (Exception ignored) {
            return "unknown";
        }
    }

    private void handleNotificationIntent(Intent intent, long delayMs) {
        if (intent == null) {
            return;
        }

        boolean shouldOpenSupport = ACTION_OPEN_SUPPORT_CHAT.equals(intent.getAction())
            || intent.getBooleanExtra(EXTRA_OPEN_SUPPORT_CHAT, false);

        if (!shouldOpenSupport || getBridge() == null || getBridge().getWebView() == null) {
            return;
        }

        dispatchNotificationIntent(delayMs);
        dispatchNotificationIntent(delayMs + 2400L);
    }

    private void dispatchNotificationIntent(long delayMs) {
        getBridge().getWebView().postDelayed(() -> {
            try {
                String script = "window.__CF_SUPPORT_NOTIFICATION_OPENED__ = Date.now();"
                    + "window.dispatchEvent(new CustomEvent('cf:support-notification-opened'));";
                getBridge().getWebView().evaluateJavascript(script, null);
            } catch (Exception ignored) {}
        }, delayMs);
    }

    private void registerNativeUpdateDownloadReceiver() {
        updateDownloadReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                long downloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1L);
                if (downloadId == activeUpdateDownloadId) {
                    installDownloadedNativeUpdate();
                }
            }
        };

        ContextCompat.registerReceiver(
            this,
            updateDownloadReceiver,
            new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE),
            ContextCompat.RECEIVER_NOT_EXPORTED
        );
    }

    private void checkForNativeUpdates() {
        if (nativeUpdateCheckStarted) {
            return;
        }

        nativeUpdateCheckStarted = true;
        updateExecutor.execute(() -> {
            try {
                UpdateInfo update = fetchLatestNativeUpdate();
                if (update.versionCode > getInstalledVersionCode() && (hasText(update.apkUrl) || hasText(update.apkBase64))) {
                    runOnUiThread(() -> showNativeUpdateDialog(update));
                }
            } catch (Exception ignored) {
                nativeUpdateCheckStarted = false;
            }
        });
    }

    private UpdateInfo fetchLatestNativeUpdate() throws Exception {
        Exception lastError = null;

        for (String url : new String[] { UPDATE_JSON_URL, UPDATE_JSON_FALLBACK_URL }) {
            try {
                JSONObject payload = new JSONObject(httpGet(url + "?native_check=" + System.currentTimeMillis()));
                return new UpdateInfo(
                    payload.optInt("versionCode", 0),
                    payload.optString("versionName", ""),
                    payload.optString("notes", ""),
                    payload.optString("apkUrl", ""),
                    payload.optString("apkBase64", "")
                );
            } catch (Exception error) {
                lastError = error;
            }
        }

        throw lastError == null ? new IllegalStateException("Atualização indisponível.") : lastError;
    }

    private void showNativeUpdateDialog(UpdateInfo update) {
        if (nativeUpdateDialogShowing || isFinishing() || (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1 && isDestroyed())) {
            return;
        }

        nativeUpdateDialogShowing = true;
        StringBuilder message = new StringBuilder("Existe uma nova versão disponível.");
        if (hasText(update.versionName)) {
            message.append("\n\nVersão: ").append(update.versionName);
        }
        if (hasText(update.notes)) {
            message.append("\n\n").append(update.notes);
        }

        new AlertDialog.Builder(this)
            .setTitle("Atualização disponível")
            .setMessage(message.toString())
            .setPositiveButton("Atualizar", (dialog, which) -> {
                nativeUpdateDialogShowing = false;
                installNativeUpdate(update);
            })
            .setNegativeButton("Depois", (dialog, which) -> nativeUpdateDialogShowing = false)
            .setOnCancelListener((dialog) -> nativeUpdateDialogShowing = false)
            .show();
    }

    private void installNativeUpdate(UpdateInfo update) {
        if (!ensureInstallPermission()) {
            pendingInstallPermissionUpdate = update;
            return;
        }

        if (hasText(update.apkBase64)) {
            installEmbeddedNativeUpdate(update);
            return;
        }

        downloadAndInstallNativeUpdate(update);
    }

    private boolean ensureInstallPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O || getPackageManager().canRequestPackageInstalls()) {
            return true;
        }

        Toast.makeText(this, "Permita a instalação por esta fonte para continuar a atualização.", Toast.LENGTH_LONG).show();
        Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
        intent.setData(Uri.parse("package:" + getPackageName()));
        startActivity(intent);
        return false;
    }

    private void installEmbeddedNativeUpdate(UpdateInfo update) {
        showNativeUpdateProgressDialog(update.versionName);
        updateNativeUpdateProgressMessage("Preparando instalador...");

        updateExecutor.execute(() -> {
            try {
                byte[] apkBytes = Base64.decode(update.apkBase64, Base64.DEFAULT);
                File apkFile = new File(getCacheDir(), "controle-de-dividas-update.apk");
                try (FileOutputStream output = new FileOutputStream(apkFile)) {
                    output.write(apkBytes);
                }

                runOnUiThread(() -> {
                    updateNativeUpdateProgressMessage("Abrindo instalador...");
                    getWindow().getDecorView().postDelayed(() -> {
                        hideNativeUpdateProgressDialog();
                        openApkInstaller(apkFile);
                    }, 350L);
                });
            } catch (Exception error) {
                runOnUiThread(() -> {
                    hideNativeUpdateProgressDialog();
                    Toast.makeText(this, "Não foi possível instalar a atualização: " + error.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        });
    }

    private void downloadAndInstallNativeUpdate(UpdateInfo update) {
        if (!hasText(update.apkUrl)) {
            Toast.makeText(this, "Link do APK não informado.", Toast.LENGTH_LONG).show();
            return;
        }

        activeUpdateFileName = hasText(update.versionName)
            ? "controle-de-dividas-" + update.versionName + ".apk"
            : "controle-de-dividas-update.apk";

        showNativeUpdateProgressDialog(update.versionName);

        updateExecutor.execute(() -> {
            try {
                File apkFile = downloadNativeUpdateToCache(update.apkUrl, activeUpdateFileName);
                runOnUiThread(() -> {
                    updateNativeUpdateProgressMessage("Download concluído. Abrindo instalador...");
                    getWindow().getDecorView().postDelayed(() -> {
                        hideNativeUpdateProgressDialog();
                        openApkInstaller(apkFile);
                    }, 450L);
                });
            } catch (Exception error) {
                runOnUiThread(() -> {
                    hideNativeUpdateProgressDialog();
                    Toast.makeText(this, "Não foi possível baixar a atualização: " + error.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        });
    }

    private File downloadNativeUpdateToCache(String apkUrl, String fileName) throws Exception {
        File apkFile = new File(getCacheDir(), fileName);
        if (apkFile.exists() && !apkFile.delete()) {
            throw new IllegalStateException("Não foi possível preparar o arquivo de atualização.");
        }

        HttpURLConnection connection = openNativeDownloadConnection(apkUrl);
        long totalBytes = Build.VERSION.SDK_INT >= Build.VERSION_CODES.N
            ? connection.getContentLengthLong()
            : connection.getContentLength();

        runOnUiThread(() -> updateNativeUpdateProgress(0L, totalBytes));

        try (InputStream input = connection.getInputStream(); FileOutputStream output = new FileOutputStream(apkFile)) {
            byte[] buffer = new byte[64 * 1024];
            long downloadedBytes = 0L;
            long lastUiUpdateAt = 0L;
            int lastPercent = -1;
            int bytesRead;

            while ((bytesRead = input.read(buffer)) != -1) {
                output.write(buffer, 0, bytesRead);
                downloadedBytes += bytesRead;

                int percent = totalBytes > 0L
                    ? (int) Math.min(100L, (downloadedBytes * 100L) / totalBytes)
                    : -1;
                long now = System.currentTimeMillis();

                if (percent != lastPercent || now - lastUiUpdateAt >= 350L) {
                    long currentDownloadedBytes = downloadedBytes;
                    runOnUiThread(() -> updateNativeUpdateProgress(currentDownloadedBytes, totalBytes));
                    lastPercent = percent;
                    lastUiUpdateAt = now;
                }
            }
        } finally {
            connection.disconnect();
        }

        if (!apkFile.exists() || apkFile.length() == 0L) {
            throw new IllegalStateException("Arquivo de atualização vazio.");
        }

        return apkFile;
    }

    private HttpURLConnection openNativeDownloadConnection(String urlText) throws Exception {
        URL url = new URL(urlText);

        for (int redirect = 0; redirect < 5; redirect++) {
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(UPDATE_REQUEST_TIMEOUT_MS);
            connection.setReadTimeout(UPDATE_APK_DOWNLOAD_TIMEOUT_MS);
            connection.setRequestProperty("Accept", "application/vnd.android.package-archive, application/octet-stream, */*");
            connection.setRequestProperty("User-Agent", "ControleDeDividasAndroid/1.0");

            int code = connection.getResponseCode();
            if (code == HttpURLConnection.HTTP_MOVED_PERM
                || code == HttpURLConnection.HTTP_MOVED_TEMP
                || code == HttpURLConnection.HTTP_SEE_OTHER
                || code == 307
                || code == 308) {
                String location = connection.getHeaderField("Location");
                connection.disconnect();
                if (!hasText(location)) {
                    throw new IllegalStateException("Redirecionamento sem destino.");
                }
                url = new URL(url, location);
                continue;
            }

            if (code >= 200 && code < 300) {
                return connection;
            }

            String response = readAll(connection.getErrorStream());
            connection.disconnect();
            throw new IllegalStateException(hasText(response) ? response : "Servidor respondeu " + code + ".");
        }

        throw new IllegalStateException("Muitos redirecionamentos no download.");
    }

    private void showNativeUpdateProgressDialog(String versionName) {
        if (isFinishing() || (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1 && isDestroyed())) {
            return;
        }

        hideNativeUpdateProgressDialog();

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        int padding = dp(22);
        layout.setPadding(padding, dp(12), padding, dp(6));

        nativeUpdateProgressText = new TextView(this);
        nativeUpdateProgressText.setText(hasText(versionName)
            ? "Baixando versão " + versionName + "..."
            : "Baixando atualização...");
        nativeUpdateProgressText.setTextSize(15f);

        nativeUpdateProgressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        nativeUpdateProgressBar.setMax(100);
        nativeUpdateProgressBar.setProgress(0);

        LinearLayout.LayoutParams progressParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        progressParams.setMargins(0, dp(14), 0, 0);
        layout.addView(nativeUpdateProgressText);
        layout.addView(nativeUpdateProgressBar, progressParams);

        nativeUpdateProgressDialog = new AlertDialog.Builder(this)
            .setTitle("Baixando atualização")
            .setView(layout)
            .setCancelable(false)
            .show();
    }

    private void updateNativeUpdateProgress(long downloadedBytes, long totalBytes) {
        if (nativeUpdateProgressBar == null || nativeUpdateProgressText == null) {
            return;
        }

        if (totalBytes <= 0L) {
            nativeUpdateProgressBar.setIndeterminate(true);
            nativeUpdateProgressText.setText("Baixando atualização...");
            return;
        }

        int percent = (int) Math.min(100L, (downloadedBytes * 100L) / totalBytes);
        nativeUpdateProgressBar.setIndeterminate(false);
        nativeUpdateProgressBar.setProgress(percent);
        nativeUpdateProgressText.setText("Baixando atualização... " + percent + "%");
    }

    private void updateNativeUpdateProgressMessage(String message) {
        if (nativeUpdateProgressText != null) {
            nativeUpdateProgressText.setText(message);
        }
    }

    private void hideNativeUpdateProgressDialog() {
        if (nativeUpdateProgressDialog != null) {
            nativeUpdateProgressDialog.dismiss();
        }
        nativeUpdateProgressDialog = null;
        nativeUpdateProgressBar = null;
        nativeUpdateProgressText = null;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private void installDownloadedNativeUpdate() {
        if (updateDownloadManager == null || activeUpdateDownloadId < 0) {
            return;
        }

        DownloadManager.Query query = new DownloadManager.Query().setFilterById(activeUpdateDownloadId);

        try (android.database.Cursor cursor = updateDownloadManager.query(query)) {
            if (cursor == null || !cursor.moveToFirst()) {
                return;
            }

            int statusIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
            int localUriIndex = cursor.getColumnIndex(DownloadManager.COLUMN_LOCAL_URI);
            if (statusIndex < 0 || localUriIndex < 0 || cursor.getInt(statusIndex) != DownloadManager.STATUS_SUCCESSFUL) {
                return;
            }

            String localUriValue = cursor.getString(localUriIndex);
            if (!hasText(localUriValue)) {
                return;
            }

            File apkFile = new File(Uri.parse(localUriValue).getPath());
            openApkInstaller(apkFile);
        } catch (ActivityNotFoundException error) {
            Toast.makeText(this, "Não foi possível abrir o instalador do Android.", Toast.LENGTH_LONG).show();
        }
    }

    private void openApkInstaller(File apkFile) {
        Uri contentUri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", apkFile);
        Intent installIntent = new Intent(Intent.ACTION_VIEW);
        installIntent.setDataAndType(contentUri, "application/vnd.android.package-archive");
        installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        startActivity(installIntent);
    }

    private void openUpdateUrl(String apkUrl) {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(apkUrl));
        startActivity(intent);
    }

    private int getInstalledVersionCode() {
        try {
            PackageInfo packageInfo = getPackageManager().getPackageInfo(getPackageName(), 0);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                return (int) packageInfo.getLongVersionCode();
            }
            return packageInfo.versionCode;
        } catch (Exception ignored) {
            return 0;
        }
    }

    private String httpGet(String urlText) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(urlText).openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(UPDATE_REQUEST_TIMEOUT_MS);
        connection.setReadTimeout(UPDATE_REQUEST_TIMEOUT_MS);
        connection.setRequestProperty("Accept", "application/json");
        connection.setRequestProperty("User-Agent", "ControleDeDividasAndroid/1.0");

        int code = connection.getResponseCode();
        InputStream stream = code >= 200 && code < 300 ? connection.getInputStream() : connection.getErrorStream();
        String response = readAll(stream);
        connection.disconnect();

        if (code < 200 || code >= 300) {
            throw new IllegalStateException(response);
        }

        return response;
    }

    private String readAll(InputStream stream) throws Exception {
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

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private static final class UpdateInfo {
        final int versionCode;
        final String versionName;
        final String notes;
        final String apkUrl;
        final String apkBase64;

        UpdateInfo(int versionCode, String versionName, String notes, String apkUrl, String apkBase64) {
            this.versionCode = versionCode;
            this.versionName = versionName;
            this.notes = notes;
            this.apkUrl = apkUrl;
            this.apkBase64 = apkBase64;
        }
    }
}
