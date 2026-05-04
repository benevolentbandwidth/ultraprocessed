package com.b2.ultraprocessed.network.llm

import java.io.IOException
import org.json.JSONArray
import org.json.JSONObject

internal object LlmClassificationParser {
    fun parseNova(json: JSONObject): NovaClassification {
        val novaGroup = json.optInt("novaGroup", -1)
        if (novaGroup !in 1..4) {
            throw IOException("LLM NOVA response missing valid required field 'novaGroup'.")
        }
        val summary = json.optString("summary").trim()
        if (summary.isBlank()) {
            throw IOException("LLM NOVA response missing required field 'summary'.")
        }
        return NovaClassification(
            novaGroup = novaGroup,
            summary = summary,
            confidence = json.optDouble("confidence", 0.0).toFloat().coerceIn(0f, 1f),
            warnings = json.optJSONArray("warnings").toStringList(),
        )
    }

    fun parseIngredientList(json: JSONObject): IngredientListAnalysis {
        val correctedIngredients = json.optJSONArray("correctedIngredients").toStringList()
        if (correctedIngredients.isEmpty()) {
            throw IOException("LLM ingredient-list response missing required field 'correctedIngredients'.")
        }
        return IngredientListAnalysis(
            correctedIngredients = correctedIngredients,
            ultraProcessedIngredients = parseRiskMarkers(json.optJSONArray("ultraProcessedIngredients")),
            warnings = json.optJSONArray("warnings").toStringList(),
            confidence = json.optDouble("confidence", 0.0).toFloat().coerceIn(0f, 1f),
        )
    }

    private fun parseRiskMarkers(array: JSONArray?): List<IngredientRiskMarker> {
        if (array == null) return emptyList()
        return buildList {
            for (index in 0 until array.length()) {
                val item = array.opt(index)
                when (item) {
                    is JSONObject -> {
                        val name = item.optString("name").trim()
                        if (name.isNotBlank()) {
                            add(
                                IngredientRiskMarker(
                                    name = name,
                                    reason = item.optString("reason").trim(),
                                ),
                            )
                        }
                    }
                    is String -> if (item.trim().isNotBlank()) {
                        add(IngredientRiskMarker(name = item.trim(), reason = ""))
                    }
                }
            }
        }
    }
}

internal fun JSONArray?.toStringList(): List<String> {
    if (this == null) return emptyList()
    return buildList {
        for (index in 0 until length()) {
            val value = optString(index).trim()
            if (value.isNotBlank()) add(value)
        }
    }
}
