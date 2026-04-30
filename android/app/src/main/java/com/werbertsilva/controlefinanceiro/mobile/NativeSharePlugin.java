package com.werbertsilva.controlefinanceiro.mobile;

import android.content.ActivityNotFoundException;
import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativeShare")
public class NativeSharePlugin extends Plugin {
    @PluginMethod
    public void share(PluginCall call) {
        String title = call.getString("title", "Compartilhar");
        String text = call.getString("text", "");
        String url = call.getString("url", "");
        String subject = call.getString("subject", title);
        String message = buildMessage(text, url);

        if (message.isEmpty()) {
            call.reject("Nada para compartilhar.");
            return;
        }

        Intent sendIntent = new Intent(Intent.ACTION_SEND);
        sendIntent.setType("text/plain");
        sendIntent.putExtra(Intent.EXTRA_SUBJECT, subject);
        sendIntent.putExtra(Intent.EXTRA_TEXT, message);

        Intent chooserIntent = Intent.createChooser(sendIntent, title);

        try {
            if (getActivity() != null) {
                getActivity().startActivity(chooserIntent);
            } else {
                chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(chooserIntent);
            }

            JSObject result = new JSObject();
            result.put("shared", true);
            call.resolve(result);
        } catch (ActivityNotFoundException error) {
            call.reject("Nenhum aplicativo de compartilhamento encontrado.");
        } catch (Exception error) {
            call.reject("Nao foi possivel abrir o compartilhamento: " + error.getMessage());
        }
    }

    private String buildMessage(String text, String url) {
        String cleanText = text == null ? "" : text.trim();
        String cleanUrl = url == null ? "" : url.trim();

        if (cleanText.isEmpty()) {
            return cleanUrl;
        }

        if (cleanUrl.isEmpty() || cleanText.contains(cleanUrl)) {
            return cleanText;
        }

        return cleanText + "\n" + cleanUrl;
    }
}
