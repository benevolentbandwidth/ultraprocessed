package com.b2.ultraprocessed.network.bootstrap

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class LlmBootstrapClientTest {
    @Test
    fun parseBootstrapApiKey_readsApiKeyField() {
        val key = LlmBootstrapClient.parseBootstrapApiKey("""{"apiKey":"AIza-test-key"}""")
        assertEquals("AIza-test-key", key)
    }

    @Test
    fun parseBootstrapApiKey_rejectsBlankKey() {
        val result = runCatching {
            LlmBootstrapClient.parseBootstrapApiKey("""{"apiKey":""}""")
        }
        assertTrue(result.isFailure)
    }
}
