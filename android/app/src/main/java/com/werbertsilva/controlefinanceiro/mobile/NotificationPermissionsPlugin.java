package com.werbertsilva.controlefinanceiro.mobile;

import android.app.AlarmManager;
import android.Manifest;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.PowerManager;
import android.provider.Settings;

import androidx.activity.result.ActivityResult;
import androidx.core.content.ContextCompat;
import androidx.core.app.NotificationManagerCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(
    name = "NotificationPermissions",
    permissions = {
        @Permission(
            alias = "notifications",
            strings = {Manifest.permission.POST_NOTIFICATIONS}
        ),
        @Permission(
            alias = "storage",
            strings = {Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE}
        ),
        @Permission(
            alias = "storageRead",
            strings = {Manifest.permission.READ_EXTERNAL_STORAGE}
        ),
        @Permission(
            alias = "photos",
            strings = {Manifest.permission.READ_MEDIA_IMAGES}
        ),
        @Permission(
            alias = "videos",
            strings = {Manifest.permission.READ_MEDIA_VIDEO}
        )
    }
)
public class NotificationPermissionsPlugin extends Plugin {
    private static final String NOTIFICATIONS_ALIAS = "notifications";
    private static final String STORAGE_ALIAS = "storage";
    private static final String STORAGE_READ_ALIAS = "storageRead";

    private static final String PREFS_NAME = "notification_permission_prefs";
    private static final String KEY_AUTOSTART_OPENED = "autostart_opened";
    private static final String KEY_LOCKSCREEN_OPENED = "lockscreen_opened";

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU || areNotificationsEnabled()) {
            call.resolve(buildStatus());
            return;
        }

        requestPermissionForAlias(NOTIFICATIONS_ALIAS, call, "notificationCallback");
    }

    @PluginMethod
    public void requestStoragePermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            // No Android 13+, READ_EXTERNAL_STORAGE é no-op.
            // Solicitamos permissões de mídia para disparar o modal nativo, se ainda não houver.
            requestPermissionForAliases(new String[]{"photos", "videos"}, call, "storageCallback");
        } else if (isStorageRuntimePermissionGranted()) {
            call.resolve(buildStatus());
        } else {
            requestPermissionForAlias(getStorageAliasForCurrentSdk(), call, "storageCallback");
        }
    }

    @PluginMethod
    public void openAllFilesAccessSettings(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
            intent.setData(Uri.parse("package:" + getContext().getPackageName()));
            
            try {
                getActivity().startActivity(intent);
                call.resolve(buildStatus());
            } catch (Exception e) {
                // Fallback: abre a lista geral de acesso a todos os arquivos
                try {
                    Intent fallback = new Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION);
                    getActivity().startActivity(fallback);
                    call.resolve(buildStatus());
                } catch (Exception ex) {
                    openAppSettingsInternal();
                    call.resolve(buildStatus());
                }
            }
        } else {
            openAppSettingsInternal();
            call.resolve(buildStatus());
        }
    }

    @PluginMethod
    public void openInstallSettings(PluginCall call) {
        openInstallSettingsInternal();
        call.resolve(buildStatus());
    }

    @PermissionCallback
    private void notificationCallback(PluginCall call) {
        call.resolve(buildStatus());
    }

    @PermissionCallback
    private void storageCallback(PluginCall call) {
        call.resolve(buildStatus());
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        call.resolve(buildStatus());
    }

    @PluginMethod
    public void requestBatteryOptimizationExemption(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M || isIgnoringBatteryOptimizations()) {
            call.resolve(buildStatus());
            return;
        }

        Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
        intent.setData(Uri.parse("package:" + getContext().getPackageName()));
        
        // No Xiaomi, às vezes o dialog não abre. Vamos forçar a abertura da tela se o dialog falhar.
        try {
            getContext().startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
            call.resolve(buildStatus());
        } catch (Exception e) {
            openManufacturerBatterySettings(call);
        }
    }

    @PluginMethod
    public void openExactAlarmSettings(PluginCall call) {
        Intent intent = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                .setData(Uri.parse("package:" + getContext().getPackageName()));
        }

        Intent fallback = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
            .setData(Uri.parse("package:" + getContext().getPackageName()));

        openFirstAvailable(call, intent, fallback);
    }

    @PluginMethod
    public void openBatteryOptimizationSettings(PluginCall call) {
        Intent intent = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
        openAndResolve(call, intent);
    }

    @PluginMethod
    public void openManufacturerBatterySettings(PluginCall call) {
        Intent appBatteryIntent = new Intent()
            .setComponent(new ComponentName("com.miui.powerkeeper", "com.miui.powerkeeper.ui.HiddenAppsConfigActivity"))
            .putExtra("package_name", getContext().getPackageName())
            .putExtra("package_label", getAppLabel());

        Intent batteryListIntent = new Intent()
            .setComponent(new ComponentName("com.miui.powerkeeper", "com.miui.powerkeeper.ui.HiddenAppsContainerManagementActivity"));

        Intent batteryOptimizationIntent = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);

        openFirstAvailable(call, appBatteryIntent, batteryListIntent, batteryOptimizationIntent, buildAppSettingsIntent());
    }

    @PluginMethod
    public void openManufacturerAutostartSettings(PluginCall call) {
        setAutostartOpened(true);
        Intent miuiAutostartIntent = new Intent()
            .setComponent(new ComponentName("com.miui.securitycenter", "com.miui.permcenter.autostart.AutoStartManagementActivity"));

        openFirstAvailable(call, miuiAutostartIntent, buildAppSettingsIntent());
    }

    @PluginMethod
    public void openManufacturerLockScreenSettings(PluginCall call) {
        setLockScreenOpened(true);
        // Tenta abrir a tela de "Outras Permissões" do MIUI onde fica a "Tela de Bloqueio"
        Intent miuiLockScreenIntent = new Intent("miui.intent.action.APP_PERM_EDITOR")
            .setClassName("com.miui.securitycenter", "com.miui.permcenter.permissions.PermissionsEditorActivity")
            .putExtra("extra_pkgname", getContext().getPackageName());

        openFirstAvailable(call, miuiLockScreenIntent, buildAppSettingsIntent());
    }

    @PluginMethod
    public void openManufacturerAppPermissionsSettings(PluginCall call) {
        Intent miuiPermissionsIntent = new Intent()
            .setComponent(new ComponentName("com.miui.securitycenter", "com.miui.permcenter.permissions.PermissionsEditorActivity"))
            .putExtra("extra_pkgname", getContext().getPackageName());

        Intent miuiAppPermissionsIntent = new Intent()
            .setComponent(new ComponentName("com.miui.securitycenter", "com.miui.permcenter.permissions.AppPermissionsEditorActivity"))
            .putExtra("extra_pkgname", getContext().getPackageName());

        openFirstAvailable(call, miuiPermissionsIntent, miuiAppPermissionsIntent, buildAppSettingsIntent());
    }

    @PluginMethod
    public void openAppSettings(PluginCall call) {
        openAppSettingsInternal();
        call.resolve(buildStatus());
    }

    @PluginMethod
    public void openAppNotificationSettings(PluginCall call) {
        Intent intent = new Intent();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            intent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra(Settings.EXTRA_APP_PACKAGE, getContext().getPackageName());
        } else {
            intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
            intent.putExtra("app_package", getContext().getPackageName());
            intent.putExtra("app_uid", getContext().getApplicationInfo().uid);
        }

        openFirstAvailable(call, intent, buildAppSettingsIntent());
    }

    @PluginMethod
    public void openNotificationChannelSettings(PluginCall call) {
        String channelId = call.getString("channelId", "");

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O || channelId.isEmpty()) {
            openAppNotificationSettings(call);
            return;
        }

        Intent intent = new Intent(Settings.ACTION_CHANNEL_NOTIFICATION_SETTINGS)
            .putExtra(Settings.EXTRA_APP_PACKAGE, getContext().getPackageName())
            .putExtra(Settings.EXTRA_CHANNEL_ID, channelId);
        openAndResolve(call, intent);
    }

    @ActivityCallback
    private void batteryOptimizationCallback(PluginCall call, ActivityResult result) {
        call.resolve(buildStatus());
    }

    private JSObject buildStatus() {
        JSObject result = new JSObject();
        result.put("notificationsEnabled", areNotificationsEnabled());
        result.put("notificationPermissionState", getNotificationPermissionState());
        result.put("batteryOptimizationIgnored", isIgnoringBatteryOptimizations());
        result.put("exactAlarmsAllowed", canScheduleExactAlarms());
        result.put("storagePermissionGranted", isStorageRuntimePermissionGranted());
        result.put("storagePermissionState", getStoragePermissionState());
        result.put("allFilesAccessGranted", isAllFilesAccessGranted());
        result.put("requiresAllFilesAccess", Build.VERSION.SDK_INT >= Build.VERSION_CODES.R);
        result.put("canRequestPackageInstalls", canRequestPackageInstalls());
        result.put("isAutostartOpened", wasAutostartOpened()); // Heurística: se o usuário já abriu a tela
        result.put("isLockScreenOpened", wasLockScreenOpened());
        result.put("sdkVersion", Build.VERSION.SDK_INT);
        result.put("manufacturer", Build.MANUFACTURER);
        result.put("brand", Build.BRAND);
        result.put("model", Build.MODEL);
        result.put("hasManufacturerPermissionScreens", hasManufacturerPermissionScreens());
        return result;
    }

    private boolean areNotificationsEnabled() {
        return NotificationManagerCompat.from(getContext()).areNotificationsEnabled();
    }

    private String getNotificationPermissionState() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            return areNotificationsEnabled() ? "granted" : "denied";
        }

        return getPermissionState(NOTIFICATIONS_ALIAS).toString();
    }

    private boolean isStorageRuntimePermissionGranted() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return true;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            return ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_EXTERNAL_STORAGE)
                == android.content.pm.PackageManager.PERMISSION_GRANTED;
        }

        return ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_EXTERNAL_STORAGE)
            == android.content.pm.PackageManager.PERMISSION_GRANTED
            && ContextCompat.checkSelfPermission(getContext(), Manifest.permission.WRITE_EXTERNAL_STORAGE)
            == android.content.pm.PackageManager.PERMISSION_GRANTED;
    }

    private String getStoragePermissionState() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return "granted";
        }

        PermissionState state = getPermissionState(getStorageAliasForCurrentSdk());
        return state.toString();
    }

    private String getStorageAliasForCurrentSdk() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.R ? STORAGE_READ_ALIAS : STORAGE_ALIAS;
    }

    private boolean isAllFilesAccessGranted() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
            return isStorageRuntimePermissionGranted();
        }

        return Environment.isExternalStorageManager();
    }

    private boolean canRequestPackageInstalls() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return true;
        }

        return getContext().getPackageManager().canRequestPackageInstalls();
    }

    private boolean isIgnoringBatteryOptimizations() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return true;
        }

        PowerManager powerManager = (PowerManager) getContext().getSystemService(Context.POWER_SERVICE);
        return powerManager != null && powerManager.isIgnoringBatteryOptimizations(getContext().getPackageName());
    }

    private boolean canScheduleExactAlarms() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            return true;
        }

        AlarmManager alarmManager = (AlarmManager) getContext().getSystemService(Context.ALARM_SERVICE);
        return alarmManager != null && alarmManager.canScheduleExactAlarms();
    }

    private void openForResult(PluginCall call, Intent intent, String callbackName) {
        try {
            startActivityForResult(call, intent, callbackName);
        } catch (ActivityNotFoundException error) {
            openAppSettingsInternal();
            call.resolve(buildStatus());
        }
    }

    private void openAndResolve(PluginCall call, Intent intent) {
        try {
            getActivity().startActivity(intent);
        } catch (ActivityNotFoundException error) {
            openAppSettingsInternal();
        }

        call.resolve(buildStatus());
    }

    private void openFirstAvailable(PluginCall call, Intent... intents) {
        for (Intent intent : intents) {
            if (intent == null) {
                continue;
            }

            try {
                getActivity().startActivity(intent);
                call.resolve(buildStatus());
                return;
            } catch (ActivityNotFoundException ignored) {
            }
        }

        openAppSettingsInternal();
        call.resolve(buildStatus());
    }

    private Intent buildAppSettingsIntent() {
        return new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
            .setData(Uri.parse("package:" + getContext().getPackageName()));
    }

    private void openAppSettingsInternal() {
        getActivity().startActivity(buildAppSettingsIntent());
    }

    private void openInstallSettingsInternal() {
        Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES)
            .setData(Uri.parse("package:" + getContext().getPackageName()));
        openAndResolveWithoutCallback(intent);
    }

    private void openAndResolveWithoutCallback(Intent intent) {
        try {
            getActivity().startActivity(intent);
        } catch (ActivityNotFoundException error) {
            openAppSettingsInternal();
        }
    }

    private boolean hasManufacturerPermissionScreens() {
        String maker = (Build.MANUFACTURER + " " + Build.BRAND).toLowerCase();
        return maker.contains("xiaomi") || maker.contains("redmi") || maker.contains("poco");
    }

    private boolean wasAutostartOpened() {
        return getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getBoolean(KEY_AUTOSTART_OPENED, false);
    }

    private void setAutostartOpened(boolean opened) {
        getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit().putBoolean(KEY_AUTOSTART_OPENED, opened).apply();
    }

    private boolean wasLockScreenOpened() {
        return getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getBoolean(KEY_LOCKSCREEN_OPENED, false);
    }

    private void setLockScreenOpened(boolean opened) {
        getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit().putBoolean(KEY_LOCKSCREEN_OPENED, opened).apply();
    }

    private String getAppLabel() {
        try {
            return getContext().getApplicationInfo().loadLabel(getContext().getPackageManager()).toString();
        } catch (Exception ignored) {
            return "Controle de Dívidas";
        }
    }
}
