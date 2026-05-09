package com.werbertsilva.controlefinanceiro.mobile;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

final class UpdateBackgroundSyncScheduler {
    static final String PREFS_NAME = "cf_update_background_sync";
    static final String ACTION_POLL = "com.werbertsilva.controlefinanceiro.mobile.UPDATE_BACKGROUND_POLL";

    static final String KEY_ENABLED = "enabled";
    static final String KEY_CURRENT_VERSION = "current_version";
    static final String KEY_MANIFEST_URL = "manifest_url";
    static final String KEY_MANIFEST_FALLBACK_URL = "manifest_fallback_url";
    static final String KEY_RELEASE_API_URL = "release_api_url";
    static final String KEY_INTERVAL_MS = "interval_ms";
    static final String KEY_REQUEST_TIMEOUT_MS = "request_timeout_ms";
    static final String KEY_LAST_NOTIFIED_VERSION = "last_notified_version";
    static final String KEY_LAST_SYNC_AT = "last_sync_at";
    static final String KEY_LAST_ERROR = "last_error";

    static final long DEFAULT_INTERVAL_MS = 30L * 60L * 1000L;
    static final long MIN_INTERVAL_MS = 30L * 1000L;

    private static final int REQUEST_CODE = 5508;

    private UpdateBackgroundSyncScheduler() {}

    static SharedPreferences getPreferences(Context context) {
        return context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    static boolean isConfigured(Context context) {
        SharedPreferences preferences = getPreferences(context);
        return preferences.getBoolean(KEY_ENABLED, false)
            && hasText(preferences.getString(KEY_CURRENT_VERSION, ""))
            && (
                hasText(preferences.getString(KEY_MANIFEST_URL, ""))
                || hasText(preferences.getString(KEY_RELEASE_API_URL, ""))
            );
    }

    static long getIntervalMs(Context context) {
        long interval = getPreferences(context).getLong(KEY_INTERVAL_MS, DEFAULT_INTERVAL_MS);
        return Math.max(MIN_INTERVAL_MS, interval);
    }

    static void scheduleNext(Context context, long delayMs) {
        Context appContext = context.getApplicationContext();
        if (!isConfigured(appContext)) {
            cancel(appContext);
            return;
        }

        AlarmManager alarmManager = (AlarmManager) appContext.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            return;
        }

        long safeDelayMs = Math.max(5000L, delayMs);
        long triggerAt = System.currentTimeMillis() + safeDelayMs;
        PendingIntent pendingIntent = buildPendingIntent(appContext, PendingIntent.FLAG_UPDATE_CURRENT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S || alarmManager.canScheduleExactAlarms()) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent);
            } else {
                alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent);
            }
        } else {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAt, pendingIntent);
        }
    }

    static void cancel(Context context) {
        Context appContext = context.getApplicationContext();
        AlarmManager alarmManager = (AlarmManager) appContext.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            return;
        }

        PendingIntent pendingIntent = buildPendingIntent(appContext, PendingIntent.FLAG_NO_CREATE);
        if (pendingIntent != null) {
            alarmManager.cancel(pendingIntent);
            pendingIntent.cancel();
        }
    }

    private static PendingIntent buildPendingIntent(Context context, int baseFlags) {
        Intent intent = new Intent(context, UpdateBackgroundSyncReceiver.class);
        intent.setAction(ACTION_POLL);

        int flags = baseFlags;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        return PendingIntent.getBroadcast(context, REQUEST_CODE, intent, flags);
    }

    private static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
