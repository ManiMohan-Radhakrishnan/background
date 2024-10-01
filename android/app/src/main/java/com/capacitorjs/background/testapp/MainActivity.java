package com.capacitorjs.background.testapp;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings;
import androidx.appcompat.app.AlertDialog;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Other initialization code...

        // Check and request to ignore battery optimizations
        requestBatteryOptimizationExemption();
    }

    // Method to request exemption from battery optimizations
    private void requestBatteryOptimizationExemption() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String packageName = getPackageName();
            PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                showBatteryOptimizationDialog(this, packageName);
            }
        }
    }

    // Show a dialog to explain battery optimizations to the user
    private void showBatteryOptimizationDialog(Context context, String packageName) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle("Battery Optimization Warning");
        builder.setMessage("To ensure proper background task execution, please disable battery optimization for this app. "
                + "This will prevent the app from being interrupted when running in the background.");
        
        // Positive button to proceed with disabling battery optimizations
        builder.setPositiveButton("Disable Optimization", (dialog, which) -> {
            Intent intent = new Intent();
            intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
            intent.setData(Uri.parse("package:" + packageName));
            startActivity(intent);
        });
        
        // Negative button to cancel the dialog
        builder.setNegativeButton("Cancel", null);
        
        // Show the dialog
        builder.show();
    }
}
