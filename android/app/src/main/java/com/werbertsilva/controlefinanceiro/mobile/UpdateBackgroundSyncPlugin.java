package com.werbertsilva.controlefinanceiro.mobile;

import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "UpdateBackgroundSync")
public class UpdateBackgroundSyncPlugin extends Plugin {
    private static final long FIRST_SYNC_DELAY_MS = 10000L;

    @PluginMethod
    public void configure(PluginCall call) {
        boolean enabled = Boolean.TRUE.equals(call.getBoolean("enabled", false));
        String currentVersion = call.getString("currentVersion", "");
        String manifestUrl = call.getString("bundleManifestUrl", "");
        String manifestFallbackUrl = call.getString("bundleManifestFallbackUrl", "");
        String releaseApiUrl = call.getString("releaseApiUrl", "");
        long intervalMs = Math.max(
            UpdateBackgroundSyncScheduler.MIN_INTERVAL_MS,
            call.getLong("recheckIntervalMs", UpdateBackgroundSyncScheduler.DEFAULT_INTERVAL_MS)
        );
        long requestTimeoutMs = Math.max(3000L, call.getLong("requestTimeoutMs", 8000L));

        SharedPreferences preferences = UpdateBackgroundSyncScheduler.getPreferences(getContext());
        preferences.edit()
            .putBoolean(UpdateBackgroundSyncScheduler.KEY_ENABLED, enabled)
            .putString(UpdateBackgroundSyncScheduler.KEY_CURRENT_VERSION, normalize(currentVersion))
            .putString(UpdateBackgroundSyncScheduler.KEY_MANIFEST_URL, normalize(manifestUrl))
            .putString(UpdateBackgroundSyncScheduler.KEY_MANIFEST_FALLBACK_URL, normalize(manifestFallbackUrl))
            .putString(UpdateBackgroundSyncScheduler.KEY_RELEASE_API_URL, normalize(releaseApiUrl))
            .putLong(UpdateBackgroundSyncScheduler.KEY_INTERVAL_MS, intervalMs)
            .putLong(UpdateBackgroundSyncScheduler.KEY_REQUEST_TIMEOUT_MS, requestTimeoutMs)
            .apply();

        if (UpdateBackgroundSyncScheduler.isConfigured(getContext())) {
            UpdateBackgroundSyncScheduler.scheduleNext(getContext(), FIRST_SYNC_DELAY_MS);
        } else {
            UpdateBackgroundSyncScheduler.cancel(getContext());
        }

        call.resolve(buildStatus());
    }

    @PluginMethod
    public void syncNow(PluginCall call) {
        if (UpdateBackgroundSyncScheduler.isConfigured(getContext())) {
            UpdateBackgroundSyncScheduler.scheduleNext(getContext(), 1000L);
        }
        call.resolve(buildStatus());
    }

    @PluginMethod
    public void stop(PluginCall call) {
        UpdateBackgroundSyncScheduler.getPreferences(getContext())
            .edit()
            .putBoolean(UpdateBackgroundSyncScheduler.KEY_ENABLED, false)
            .apply();
        UpdateBackgroundSyncScheduler.cancel(getContext());
        call.resolve(buildStatus());
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        call.resolve(buildStatus());
    }

    private JSObject buildStatus() {
        SharedPreferences preferences = UpdateBackgroundSyncScheduler.getPreferences(getContext());
        JSObject result = new JSObject();
        result.put("configured", UpdateBackgroundSyncScheduler.isConfigured(getContext()));
        result.put("enabled", preferences.getBoolean(UpdateBackgroundSyncScheduler.KEY_ENABLED, false));
        result.put("currentVersion", preferences.getString(UpdateBackgroundSyncScheduler.KEY_CURRENT_VERSION, ""));
        result.put("intervalMs", UpdateBackgroundSyncScheduler.getIntervalMs(getContext()));
        result.put("lastSyncAt", preferences.getLong(UpdateBackgroundSyncScheduler.KEY_LAST_SYNC_AT, 0L));
        result.put("lastNotifiedVersion", preferences.getString(UpdateBackgroundSyncScheduler.KEY_LAST_NOTIFIED_VERSION, ""));
        result.put("lastError", preferences.getString(UpdateBackgroundSyncScheduler.KEY_LAST_ERROR, ""));
        return result;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
