package com.werbertsilva.controlefinanceiro.mobile;

import android.app.AlarmManager;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;

import androidx.activity.result.ActivityResult;
import androidx.core.app.NotificationManagerCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NotificationPermissions")
public class NotificationPermissionsPlugin extends Plugin {
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
    public void openBatteryOptimizationSettings(PluginCall call) {
        Intent intent = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
        openAndResolve(call, intent);
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
            openAppSettings();
            call.resolve(buildStatus());
        }
    }

    private void openAndResolve(PluginCall call, Intent intent) {
        try {
            getActivity().startActivity(intent);
        } catch (ActivityNotFoundException error) {
            openAppSettings();
        }

        call.resolve(buildStatus());
    }

    private void openAppSettings() {
        Intent fallbackIntent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
            .setData(Uri.parse("package:" + getContext().getPackageName()));
        getActivity().startActivity(fallbackIntent);
    }
}
