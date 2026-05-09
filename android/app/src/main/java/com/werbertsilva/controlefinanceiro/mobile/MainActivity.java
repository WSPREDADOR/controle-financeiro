package com.werbertsilva.controlefinanceiro.mobile;

import android.content.SharedPreferences;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.ValueCallback;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    public static final String ACTION_OPEN_SUPPORT_CHAT = "com.werbertsilva.controlefinanceiro.mobile.OPEN_SUPPORT_CHAT";
    public static final String ACTION_OPEN_UPDATE = "com.werbertsilva.controlefinanceiro.mobile.OPEN_UPDATE";
    public static final String EXTRA_OPEN_SUPPORT_CHAT = "cf_open_support_chat";
    public static final String EXTRA_SUPPORT_MESSAGE_ID = "cf_support_message_id";
    public static final String EXTRA_OPEN_UPDATE = "cf_open_update";
    public static final String EXTRA_UPDATE_VERSION = "cf_update_version";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(UpdateInstallerPlugin.class);
        registerPlugin(NativeSharePlugin.class);
        registerPlugin(NotificationPermissionsPlugin.class);
        registerPlugin(SupportBackgroundSyncPlugin.class);
        registerPlugin(UpdateBackgroundSyncPlugin.class);
        registerPlugin(com.capacitorjs.plugins.filesystem.FilesystemPlugin.class);
        registerPlugin(com.capacitorjs.plugins.app.AppPlugin.class);
        registerPlugin(com.capacitorjs.plugins.preferences.PreferencesPlugin.class);
        super.onCreate(savedInstanceState);
        SupportBackgroundSyncScheduler.scheduleNext(this, 15000L);
        UpdateBackgroundSyncScheduler.scheduleNext(this, 30000L);
        runLegacyWebMigrationIfNeeded();
        handleNotificationIntent(getIntent(), 1800L);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleNotificationIntent(intent, 450L);
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
        boolean shouldOpenUpdate = ACTION_OPEN_UPDATE.equals(intent.getAction())
            || intent.getBooleanExtra(EXTRA_OPEN_UPDATE, false);

        if ((!shouldOpenSupport && !shouldOpenUpdate) || getBridge() == null || getBridge().getWebView() == null) {
            return;
        }

        dispatchNotificationIntent(shouldOpenSupport, shouldOpenUpdate, delayMs);
        dispatchNotificationIntent(shouldOpenSupport, shouldOpenUpdate, delayMs + 2400L);
    }

    private void dispatchNotificationIntent(boolean shouldOpenSupport, boolean shouldOpenUpdate, long delayMs) {
        getBridge().getWebView().postDelayed(() -> {
            try {
                String script = "";
                if (shouldOpenSupport) {
                    script += "window.__CF_SUPPORT_NOTIFICATION_OPENED__ = Date.now();"
                        + "window.dispatchEvent(new CustomEvent('cf:support-notification-opened'));";
                }
                if (shouldOpenUpdate) {
                    script += "window.__CF_UPDATE_NOTIFICATION_OPENED__ = Date.now();"
                        + "window.dispatchEvent(new CustomEvent('cf:update-notification-opened'));";
                }
                getBridge().getWebView().evaluateJavascript(script, null);
            } catch (Exception ignored) {}
        }, delayMs);
    }
}
