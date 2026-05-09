package com.werbertsilva.controlefinanceiro.mobile;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SupportBackgroundSyncReceiver extends BroadcastReceiver {
    private static final ExecutorService EXECUTOR = Executors.newSingleThreadExecutor();

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || !SupportBackgroundSyncScheduler.ACTION_POLL.equals(intent.getAction())) {
            return;
        }

        Context appContext = context.getApplicationContext();
        PendingResult pendingResult = goAsync();

        EXECUTOR.execute(() -> {
            try {
                SupportBackgroundSyncRunner.poll(appContext);
            } finally {
                SupportBackgroundSyncScheduler.scheduleNext(
                    appContext,
                    SupportBackgroundSyncScheduler.getIntervalMs(appContext)
                );
                pendingResult.finish();
            }
        });
    }
}
