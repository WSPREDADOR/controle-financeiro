package com.werbertsilva.controlefinanceiro.mobile;

import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "SupportBackgroundSync")
public class SupportBackgroundSyncPlugin extends Plugin {
    private static final long FIRST_SYNC_DELAY_MS = 5000L;

    @PluginMethod
    public void configure(PluginCall call) {
        boolean enabled = Boolean.TRUE.equals(call.getBoolean("enabled", false));
        String supabaseUrl = call.getString("supabaseUrl", "");
        String supabaseAnonKey = call.getString("supabaseAnonKey", "");
        String supportId = call.getString("supportId", "");
        String deviceToken = call.getString("deviceToken", "");
        long intervalMs = Math.max(
            SupportBackgroundSyncScheduler.MIN_INTERVAL_MS,
            call.getLong("checkInIntervalMs", SupportBackgroundSyncScheduler.DEFAULT_INTERVAL_MS)
        );
        long requestTimeoutMs = Math.max(3000L, call.getLong("requestTimeoutMs", 8000L));

        SharedPreferences preferences = SupportBackgroundSyncScheduler.getPreferences(getContext());
        preferences.edit()
            .putBoolean(SupportBackgroundSyncScheduler.KEY_ENABLED, enabled)
            .putString(SupportBackgroundSyncScheduler.KEY_SUPABASE_URL, supabaseUrl == null ? "" : supabaseUrl.trim())
            .putString(SupportBackgroundSyncScheduler.KEY_SUPABASE_ANON_KEY, supabaseAnonKey == null ? "" : supabaseAnonKey.trim())
            .putString(SupportBackgroundSyncScheduler.KEY_SUPPORT_ID, supportId == null ? "" : supportId.trim())
            .putString(SupportBackgroundSyncScheduler.KEY_DEVICE_TOKEN, deviceToken == null ? "" : deviceToken.trim())
            .putLong(SupportBackgroundSyncScheduler.KEY_INTERVAL_MS, intervalMs)
            .putLong(SupportBackgroundSyncScheduler.KEY_REQUEST_TIMEOUT_MS, requestTimeoutMs)
            .apply();

        if (SupportBackgroundSyncScheduler.isConfigured(getContext())) {
            SupportBackgroundSyncScheduler.scheduleNext(getContext(), FIRST_SYNC_DELAY_MS);
        } else {
            SupportBackgroundSyncScheduler.cancel(getContext());
        }

        call.resolve(buildStatus());
    }

    @PluginMethod
    public void syncNow(PluginCall call) {
        if (SupportBackgroundSyncScheduler.isConfigured(getContext())) {
            SupportBackgroundSyncScheduler.scheduleNext(getContext(), 1000L);
        }
        call.resolve(buildStatus());
    }

    @PluginMethod
    public void stop(PluginCall call) {
        SupportBackgroundSyncScheduler.getPreferences(getContext())
            .edit()
            .putBoolean(SupportBackgroundSyncScheduler.KEY_ENABLED, false)
            .apply();
        SupportBackgroundSyncScheduler.cancel(getContext());
        call.resolve(buildStatus());
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        call.resolve(buildStatus());
    }

    private JSObject buildStatus() {
        SharedPreferences preferences = SupportBackgroundSyncScheduler.getPreferences(getContext());
        JSObject result = new JSObject();
        result.put("configured", SupportBackgroundSyncScheduler.isConfigured(getContext()));
        result.put("enabled", preferences.getBoolean(SupportBackgroundSyncScheduler.KEY_ENABLED, false));
        result.put("intervalMs", SupportBackgroundSyncScheduler.getIntervalMs(getContext()));
        result.put("lastSyncAt", preferences.getLong(SupportBackgroundSyncScheduler.KEY_LAST_SYNC_AT, 0L));
        result.put("lastError", preferences.getString(SupportBackgroundSyncScheduler.KEY_LAST_ERROR, ""));
        return result;
    }
}
