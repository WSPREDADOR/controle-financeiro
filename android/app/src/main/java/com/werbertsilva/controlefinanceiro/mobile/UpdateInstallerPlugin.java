package com.werbertsilva.controlefinanceiro.mobile;

import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;

import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;

@CapacitorPlugin(name = "UpdateInstaller")
public class UpdateInstallerPlugin extends Plugin {
    private DownloadManager downloadManager;
    private long activeDownloadId = -1L;
    private String activeFileName = "controle-de-dividas-update.apk";
    private BroadcastReceiver downloadReceiver;

    @Override
    public void load() {
        downloadManager = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);

        downloadReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                long downloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1L);

                if (downloadId != activeDownloadId) {
                    return;
                }

                installDownloadedApk();
            }
        };

        ContextCompat.registerReceiver(
            getContext(),
            downloadReceiver,
            new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE),
            ContextCompat.RECEIVER_NOT_EXPORTED
        );
    }

    @Override
    protected void handleOnDestroy() {
        if (downloadReceiver != null) {
            try {
                getContext().unregisterReceiver(downloadReceiver);
            } catch (IllegalArgumentException ignored) {
            }
        }
    }

    @PluginMethod
    public void downloadAndInstall(PluginCall call) {
        String apkUrl = call.getString("apkUrl");
        String version = call.getString("version", "");

        if (apkUrl == null || apkUrl.isEmpty()) {
            call.reject("URL do APK não informada.");
            return;
        }

        if (downloadManager == null) {
            call.reject("DownloadManager indisponível.");
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !getContext().getPackageManager().canRequestPackageInstalls()) {
            JSObject result = new JSObject();
            result.put("started", false);
            result.put("requiresPermission", true);
            result.put("version", version);
            call.resolve(result);
            openInstallSettingsInternal();
            return;
        }

        activeFileName = version.isEmpty()
            ? "controle-de-dividas-update.apk"
            : "controle-de-dividas-" + version + ".apk";

        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(apkUrl));
        request.setTitle("Atualização do Controle de Dívidas");
        request.setDescription("Baixando a versão " + (version.isEmpty() ? "mais recente" : version));
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        request.setMimeType("application/vnd.android.package-archive");
        request.setAllowedOverMetered(true);
        request.setAllowedOverRoaming(true);
        request.setDestinationInExternalFilesDir(getContext(), Environment.DIRECTORY_DOWNLOADS, activeFileName);

        activeDownloadId = downloadManager.enqueue(request);

        JSObject result = new JSObject();
        result.put("started", true);
        result.put("downloadId", activeDownloadId);
        result.put("version", version);
        call.resolve(result);
    }

    @PluginMethod
    public void openInstallSettings(PluginCall call) {
        openInstallSettingsInternal();
        call.resolve();
    }

    @PluginMethod
    public void installApk(PluginCall call) {
        String path = call.getString("path");
        if (path == null || path.isEmpty()) {
            call.reject("Caminho do arquivo não informado.");
            return;
        }

        File apkFile = new File(path);
        if (!apkFile.exists()) {
             if (path.startsWith("file://")) {
                 apkFile = new File(Uri.parse(path).getPath());
             }
        }

        if (!apkFile.exists()) {
            call.reject("Arquivo não encontrado: " + path);
            return;
        }

        try {
            Uri contentUri = FileProvider.getUriForFile(
                getContext(),
                getContext().getPackageName() + ".fileprovider",
                apkFile
            );

            Intent installIntent = new Intent(Intent.ACTION_VIEW);
            installIntent.setDataAndType(contentUri, "application/vnd.android.package-archive");
            installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            getContext().startActivity(installIntent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Erro ao instalar APK: " + e.getMessage());
        }
    }

    private void installDownloadedApk() {
        if (downloadManager == null || activeDownloadId < 0) {
            return;
        }

        DownloadManager.Query query = new DownloadManager.Query().setFilterById(activeDownloadId);

        try (Cursor cursor = downloadManager.query(query)) {
            if (cursor == null || !cursor.moveToFirst()) {
                return;
            }

            int statusIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
            int localUriIndex = cursor.getColumnIndex(DownloadManager.COLUMN_LOCAL_URI);

            if (statusIndex < 0 || localUriIndex < 0) {
                return;
            }

            int status = cursor.getInt(statusIndex);

            if (status != DownloadManager.STATUS_SUCCESSFUL) {
                return;
            }

            String localUriValue = cursor.getString(localUriIndex);

            if (localUriValue == null || localUriValue.isEmpty()) {
                return;
            }

            Uri localUri = Uri.parse(localUriValue);
            File apkFile = new File(localUri.getPath());
            Uri contentUri = FileProvider.getUriForFile(
                getContext(),
                getContext().getPackageName() + ".fileprovider",
                apkFile
            );

            Intent installIntent = new Intent(Intent.ACTION_VIEW);
            installIntent.setDataAndType(contentUri, "application/vnd.android.package-archive");
            installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            getContext().startActivity(installIntent);
        } catch (ActivityNotFoundException ignored) {
        }
    }

    private void openInstallSettingsInternal() {
        Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
        intent.setData(Uri.parse("package:" + getContext().getPackageName()));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);
    }
}
