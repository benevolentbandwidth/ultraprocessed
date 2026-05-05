package com.b2.ultraprocessed.network.llm

import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Assert.assertTrue
import org.junit.Test

class LlmClassificationParserTest {
    @Test
    fun parseNova_acceptsNovaOnlyOutput() {
        val partialModelOutput = JSONObject(
            """
            {
              "novaGroup": 4,
              "summary": "Contains formulation markers.",
              "confidence": 0.72
            }
            """.trimIndent(),
        )

        val parsed = LlmClassificationParser.parseNova(partialModelOutput)

        assertEquals(4, parsed.novaGroup)
        assertEquals("Contains formulation markers.", parsed.summary)
        assertTrue(parsed.warnings.isEmpty())
    }

    @Test
    fun parseNova_failsWithoutModelNovaGroup() {
        val partialModelOutput = JSONObject(
            """
            {
              "summary": "Contains formulation markers.",
              "confidence": 0.72
            }
            """.trimIndent(),
        )

        assertThrows(java.io.IOException::class.java) {
            LlmClassificationParser.parseNova(partialModelOutput)
        }
    }

    @Test
    fun parseNova_acceptsNonConsumableFoodMarkerWithoutNovaGroup() {
        val output = JSONObject(
            """
            {
              "containsConsumableFoodItem": false,
              "summary": "Text doesn't contain any consumable food item.",
              "rejectionReason": "Text doesn't contain any consumable food item.",
              "confidence": 0.91,
              "warnings": ["No food ingredient evidence was found."]
            }
            """.trimIndent(),
        )

        val parsed = LlmClassificationParser.parseNova(output)

        assertEquals(0, parsed.novaGroup)
        assertEquals(false, parsed.containsConsumableFoodItem)
        assertEquals("Text doesn't contain any consumable food item.", parsed.rejectionReason)
    }

    @Test
    fun parseIngredientList_readsCorrectedNamesAndUltraProcessedSubset() {
        val output = JSONObject(
            """
            {
              "correctedIngredients": ["Wheat Flour", "Natural Flavor", "Salt"],
              "ultraProcessedIngredients": [
                {"name": "Natural Flavor", "reason": "Flavor system marker."}
              ],
              "confidence": 0.8,
              "warnings": []
            }
            """.trimIndent(),
        )

        val parsed = LlmClassificationParser.parseIngredientList(output)

        assertEquals(listOf("Wheat Flour", "Natural Flavor", "Salt"), parsed.correctedIngredients)
        assertEquals(listOf("Natural Flavor"), parsed.ultraProcessedIngredients.map { it.name })
    }
}
