package com.b2.ultraprocessed.network.llm

import com.b2.ultraprocessed.storage.secrets.SecretKeyManager

fun interface LlmApiKeyProvider {
    fun getApiKey(): String
}

class SecretLlmApiKeyProvider(
    private val secretKeyManager: SecretKeyManager,
) : LlmApiKeyProvider {
    override fun getApiKey(): String =
        secretKeyManager.getApiKey(SecretKeyManager.LLM_API_KEY).orEmpty().trim()
}

class DefaultOrSecretLlmApiKeyProvider(
    private val secretKeyManager: SecretKeyManager,
) : LlmApiKeyProvider {
    override fun getApiKey(): String = resolveActiveLlmApiKey(secretKeyManager)
}

fun resolveActiveLlmApiKey(secretKeyManager: SecretKeyManager): String {
    val userKey = secretKeyManager.getApiKey(SecretKeyManager.LLM_API_KEY).orEmpty().trim()
    if (userKey.isNotBlank()) {
        return userKey
    }
    return secretKeyManager.getApiKey(SecretKeyManager.LLM_DEFAULT_API_KEY).orEmpty().trim()
}

fun hasAnyLlmApiKey(secretKeyManager: SecretKeyManager): Boolean =
    resolveActiveLlmApiKey(secretKeyManager).isNotBlank()

