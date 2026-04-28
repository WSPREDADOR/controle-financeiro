package com.werbertsilva.controlefinanceiro.mobile;

import android.app.AlarmManager;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;

import androidx.activity.result.ActivityResult;
import androidx.core.app.NotificationManagerCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import android.Manifest;

@CapacitorPlugin(
    name = "NotificationPermissions",
    permissions = {
        @Permission(
            alias = "storage",
            strings = {Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE}
        )
    }
)
public class NotificationPermissionsPlugin extends Plugin {
    @PluginMethod
    public void requestStoragePermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            try {
                Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                intent.setData(Uri.parse("package:" + getContext().getPackageName()));
                getActivity().startActivity(intent);
                call.resolve(buildStatus());
            } catch (Exception e) {
                openAppSettingsInternal();
                call.resolve(buildStatus());
            }
        } else {
            requestPermissionForAlias("storage", call, "storageCallback");
        }
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
        openForResult(call, intent, "batteryOptimizationCallback");
    }

    @PluginMethod
    public void openExactAlarmSettings(PluginCall call) {
        Intent intent;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                .setData(Uri.parse("package:" + getContext().getPackageName()));
        } else {
            intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                .setData(Uri.parse("package:" + getContext().getPackageName()));
        }

        openAndResolve(call, intent);
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
        Intent miuiAutostartIntent = new Intent()
            .setComponent(new ComponentName("com.miui.securitycenter", "com.miui.permcenter.autostart.AutoStartManagementActivity"));

        openFirstAvailable(call, miuiAutostartIntent, buildAppSettingsIntent());
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
        Intent intent;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                .putExtra(Settings.EXTRA_APP_PACKAGE, getContext().getPackageName());
        } else {
            intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                .setData(Uri.parse("package:" + getContext().getPackageName()));
        }

        openAndResolve(call, intent);
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
        result.put("notificationsEnabled", NotificationManagerCompat.from(getContext()).areNotificationsEnabled());
        result.put("batteryOptimizationIgnored", isIgnoringBatteryOptimizations());
        result.put("exactAlarmsAllowed", canScheduleExactAlarms());
        result.put("sdkVersion", Build.VERSION.SDK_INT);
        result.put("manufacturer", Build.MANUFACTURER);
        result.put("brand", Build.BRAND);
        result.put("model", Build.MODEL);
        result.put("hasManufacturerPermissionScreens", hasManufacturerPermissionScreens());
        return result;
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

    private boolean hasManufacturerPermissionScreens() {
        String maker = (Build.MANUFACTURER + " " + Build.BRAND).toLowerCase();
        return maker.contains("xiaomi") || maker.contains("redmi") || maker.contains("poco");
    }

    private String getAppLabel() {
        try {
            return getContext().getApplicationInfo().loadLabel(getContext().getPackageManager()).toString();
        } catch (Exception ignored) {
            return "Controle de Dívidas";
        }
    }
}
