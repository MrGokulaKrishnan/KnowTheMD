package com.knowthemd.mobile;

import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.getcapacitor.BridgeActivity;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "KnowTheMD_FileOpener";
    private static final int MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB safeguard

    private String pendingFileJson = null;

    public class FileOpenerInterface {
        @JavascriptInterface
        public String getPendingFile() {
            return pendingFileJson != null ? pendingFileJson : "{\"hasFile\":false}";
        }

        @JavascriptInterface
        public void clearPendingFile() {
            pendingFileJson = null;
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setupBridgeInterface();
        handleIntent(getIntent());
    }

    @Override
    public void onResume() {
        super.onResume();
        setupBridgeInterface();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntent(intent);
    }

    private void setupBridgeInterface() {
        try {
            if (this.bridge != null && this.bridge.getWebView() != null) {
                this.bridge.getWebView().addJavascriptInterface(new FileOpenerInterface(), "AndroidFileOpener");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to register Javascript interface", e);
        }
    }

    private void handleIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (action == null) return;

        if (Intent.ACTION_VIEW.equals(action) || Intent.ACTION_EDIT.equals(action)) {
            Uri uri = intent.getData();
            if (uri != null) {
                processFileUri(uri);
            }
        } else if (Intent.ACTION_SEND.equals(action)) {
            String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            if (sharedText != null && !sharedText.isEmpty()) {
                deliverFilePayload("Shared_Note.md", sharedText, "intent:shared_text");
            } else {
                Uri streamUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
                if (streamUri != null) {
                    processFileUri(streamUri);
                }
            }
        }
    }

    private void processFileUri(Uri uri) {
        new Thread(() -> {
            try {
                String fileName = queryFileName(uri);
                if (fileName == null || fileName.trim().isEmpty()) {
                    fileName = "Opened_Document.md";
                }

                // Read file content with size safeguard
                InputStream inputStream = getContentResolver().openInputStream(uri);
                if (inputStream == null) {
                    Log.w(TAG, "Could not open input stream for: " + uri);
                    return;
                }

                ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                byte[] data = new byte[8192];
                int nRead;
                int totalRead = 0;
                while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                    totalRead += nRead;
                    if (totalRead > MAX_FILE_SIZE) {
                        Log.w(TAG, "File exceeds maximum size of " + MAX_FILE_SIZE + " bytes");
                        break;
                    }
                    buffer.write(data, 0, nRead);
                }
                inputStream.close();

                String content = new String(buffer.toByteArray(), StandardCharsets.UTF_8);
                deliverFilePayload(fileName, content, uri.toString());
            } catch (Exception e) {
                Log.e(TAG, "Error reading file URI: " + uri, e);
            }
        }).start();
    }

    private String queryFileName(Uri uri) {
        String result = null;
        if ("content".equalsIgnoreCase(uri.getScheme())) {
            Cursor cursor = null;
            try {
                cursor = getContentResolver().query(uri, null, null, null, null);
                if (cursor != null && cursor.moveToFirst()) {
                    int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                    if (nameIndex != -1) {
                        result = cursor.getString(nameIndex);
                    }
                }
            } catch (Exception e) {
                Log.w(TAG, "Failed to query display name from content resolver", e);
            } finally {
                if (cursor != null) cursor.close();
            }
        }
        if (result == null) {
            result = uri.getLastPathSegment();
        }
        return result;
    }

    private void deliverFilePayload(String fileName, String content, String uriString) {
        try {
            JSONObject obj = new JSONObject();
            obj.put("hasFile", true);
            obj.put("name", fileName);
            obj.put("content", content);
            obj.put("uri", uriString);
            String payloadJson = obj.toString();

            this.pendingFileJson = payloadJson;

            // Deliver immediately if WebView is active and ready
            runOnUiThread(() -> {
                try {
                    if (this.bridge != null && this.bridge.getWebView() != null) {
                        // Double check interface is attached
                        this.bridge.getWebView().addJavascriptInterface(new FileOpenerInterface(), "AndroidFileOpener");

                        String quoted = JSONObject.quote(payloadJson);
                        String script = "if (typeof window.onAndroidFileOpened === 'function') { " +
                                "window.onAndroidFileOpened(" + quoted + "); " +
                                "}";
                        this.bridge.getWebView().evaluateJavascript(script, null);
                    }
                } catch (Exception ex) {
                    Log.e(TAG, "Failed to evaluate Javascript file delivery", ex);
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Failed to construct file payload JSON", e);
        }
    }
}

