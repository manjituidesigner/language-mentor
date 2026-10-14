package com.ailanguagementor.app

import android.app.Application
import android.content.res.Configuration
import android.os.Build
import android.util.Log

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactNativeHost

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ExpoReactHostFactory

import java.io.File
import java.io.PrintWriter
import java.io.StringWriter
import java.net.HttpURLConnection
import java.net.URL
import org.json.JSONObject

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
    object : DefaultReactNativeHost(this) {
      override fun getPackages(): List<ReactPackage> =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here
        }

      override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

      override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
    }

  override val reactHost: ReactHost by lazy {
    ExpoReactHostFactory.getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here
        }
    )
  }

  override fun onCreate() {
    super.onCreate()

    // Global Uncaught Exception Handler to capture and report any crash
    val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()
    Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
      try {
        val sw = StringWriter()
        throwable.printStackTrace(PrintWriter(sw))
        val stackTrace = sw.toString()
        Log.e("ALM_FATAL", "FATAL CRASH on thread ${thread.name}: $stackTrace")

        try {
          File(filesDir, "alm_crash.txt").writeText(stackTrace)
          getExternalFilesDir(null)?.let { dir ->
            File(dir, "alm_crash.txt").writeText(stackTrace)
          }
        } catch (_: Throwable) {}

        try {
          val url = URL("https://language-mentor-backend.vercel.app/api/crash-log")
          val conn = url.openConnection() as HttpURLConnection
          conn.requestMethod = "POST"
          conn.doOutput = true
          conn.setRequestProperty("Content-Type", "application/json")
          conn.connectTimeout = 3000
          conn.readTimeout = 3000
          val payload = JSONObject().apply {
            put("error", throwable.javaClass.name + ": " + (throwable.message ?: "Unknown error"))
            put("stack", stackTrace)
            put("device", "${Build.MANUFACTURER} ${Build.MODEL} (Android SDK ${Build.VERSION.SDK_INT})")
          }
          conn.outputStream.use { os ->
            os.write(payload.toString().toByteArray())
          }
          conn.responseCode
        } catch (_: Throwable) {}
      } catch (_: Throwable) {}

      defaultHandler?.uncaughtException(thread, throwable)
    }

    try {
      DefaultNewArchitectureEntryPoint.releaseLevel = try {
        ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
      } catch (e: IllegalArgumentException) {
        ReleaseLevel.STABLE
      }
      loadReactNative(this)
      ApplicationLifecycleDispatcher.onApplicationCreate(this)
    } catch (e: Throwable) {
      Log.e("ALM_INIT_ERR", "Handled exception during MainApplication.onCreate", e)
    }
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    try {
      ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
    } catch (e: Throwable) {
      Log.e("ALM_CONFIG_ERR", "Error onConfigurationChanged", e)
    }
  }
}
