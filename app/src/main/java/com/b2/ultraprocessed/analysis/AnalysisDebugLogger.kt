package com.b2.ultraprocessed.analysis

import android.content.Context
import android.util.Log
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object AnalysisDebugLogger {
    private const val TAG = "ZestAnalysisTrace"
    private const val MAX_LOG_BYTES = 512_000L
    private val lock = Any()

    @Volatile
    private var logFile: File? = null

    fun initialize(context: Context) {
        val directory = File(context.filesDir, "zest-debug").apply { mkdirs() }
        logFile = File(directory, "analysis_trace.log")
        AnalysisTelemetry.sink = { line -> log("telemetry", line) }
        log("logger", "initialized path=${logFile?.absolutePath.orEmpty()}")
    }

    fun log(stage: String, message: String) {
        val line = "${timestamp()} [$stage] ${message.take(8_000)}"
        runCatching { Log.d(TAG, line) }
        val file = logFile
        if (file == null) {
            println(line)
            return
        }
        synchronized(lock) {
            if (file.length() > MAX_LOG_BYTES) {
                file.writeText("")
            }
            file.appendText(line + "\n")
        }
    }

    private fun timestamp(): String =
        SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS", Locale.US).format(Date())
}
