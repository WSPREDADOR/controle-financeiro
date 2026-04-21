package com.werbertsilva.controlefinanceiro.mobile;

import android.content.SharedPreferences;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(UpdateInstallerPlugin.class);
        super.onCreate(savedInstanceState);
        runLegacyWebMigrationIfNeeded();
    }

    private void runLegacyWebMigrationIfNeeded() {
        SharedPreferences preferences = getSharedPreferences("controle_financeiro", MODE_PRIVATE);
        String migrationKey = "legacy_web_cleanup_" + getInstalledVersionName();

        if (preferences.getBoolean(migrationKey, false)) {
            return;
        }

        preferences.edit().putBoolean(migrationKey, true).apply();

        getBridge().getWebView().postDelayed(() -> getBridge().getWebView().evaluateJavascript(
            "(async function () {" +
                "try {" +
                    "localStorage.removeItem('cf-active-web-bundle');" +
                    "localStorage.removeItem('pending-app-update-version');" +
                    "if ('serviceWorker' in navigator) {" +
                        "const registrations = await navigator.serviceWorker.getRegistrations();" +
                        "await Promise.all(registrations.map((registration) => registration.unregister()));" +
                    "}" +
                    "if (window.caches && caches.keys) {" +
                        "const keys = await caches.keys();" +
                        "await Promise.all(keys.map((key) => caches.delete(key)));" +
                    "}" +
                    "location.reload();" +
                "} catch (_) {}" +
            "})();",
            null
        ), 1200);
    }

    private String getInstalledVersionName() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
        } catch (Exception ignored) {
            return "unknown";
        }
    }
}
