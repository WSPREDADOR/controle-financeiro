package com.werbertsilva.controlefinanceiro.mobile;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.webkit.ValueCallback;

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
}
