package com.b2.ultraprocessed.network.bootstrap

import java.util.concurrent.TimeUnit
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject

class LlmBootstrapClient(
    private val bootstrapUrl: String,
    private val authToken: String,
    private val packageName: String,
    private val client: OkHttpClient = defaultClient(),
) {
    suspend fun fetchDefaultApiKey(): Result<String> = withContext(Dispatchers.IO) {
        val url = bootstrapUrl.trim()
        if (url.isBlank()) {
            return@withContext Result.failure(IllegalStateException("Bootstrap URL is not configured."))
        }
        if (!url.startsWith("https://", ignoreCase = true)) {
            return@withContext Result.failure(IllegalStateException("Bootstrap URL must use HTTPS."))
        }

        val requestBuilder = Request.Builder()
            .url(url)
            .get()
            .header("Accept", "application/json")

        val token = authToken.trim()
        if (token.isNotBlank()) {
            requestBuilder.header("Authorization", "Bearer $token")
        }

        val androidPackage = packageName.trim()
        if (androidPackage.isNotBlank()) {
            requestBuilder.header("X-Android-Package", androidPackage)
        }

        runCatching {
            client.newCall(requestBuilder.build()).execute().use { response ->
                val body = response.body?.string().orEmpty()
                if (!response.isSuccessful) {
                    throw IllegalStateException("Bootstrap request failed with HTTP ${response.code}.")
                }
                parseBootstrapApiKey(body)
            }
        }
    }

    companion object {
        fun parseBootstrapApiKey(body: String): String {
            val apiKey = JSONObject(body).optString("apiKey").trim()
            if (apiKey.isBlank()) {
                throw IllegalStateException("Bootstrap response did not include an API key.")
            }
            return apiKey
        }

        private fun defaultClient(): OkHttpClient =
            OkHttpClient.Builder()
                .connectTimeout(5, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .callTimeout(12, TimeUnit.SECONDS)
                .build()
    }
}
