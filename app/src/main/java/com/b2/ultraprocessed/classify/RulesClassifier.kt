package com.b2.ultraprocessed.classify

class RulesClassifier : Classifier {
    override val id: String = "rules"

    private val nova4Markers = listOf(
        "high fructose corn syrup", "maltodextrin", "artificial flavor",
        "artificial colour", "artificial color", "sodium benzoate",
        "potassium sorbate", "carrageenan", "modified starch",
        "emulsifier", "stabilizer", "xanthan gum", "soy lecithin",
        "mono and diglycerides", "sodium nitrate", "sodium nitrite",
        "bha", "bht", "tbhq", "acesulfame", "aspartame", "sucralose",
        "saccharin", "natural flavor", "color added", "caramel color",
        "partially hydrogenated", "interesterified", "hydrolyzed",
        "autolyzed yeast", "disodium", "monosodium glutamate", "msg"
    )

    private val nova3Markers = listOf(
        "vinegar", "butter", "cream", "cheese", "yeast",
        "baking powder", "corn syrup", "preservative",
        "citric acid", "lactic acid", "cane sugar"
    )

    private val nova1Markers = listOf(
        "water", "milk", "egg", "flour", "oat", "oats",
        "fruit", "vegetable", "meat", "fish", "nuts",
        "seeds", "honey", "olive oil", "coconut oil",
        "almonds", "dates", "banana", "apple", "tomato"
    )

    override suspend fun classify(
        input: IngredientInput,
        context: ClassificationContext,
    ): ClassificationResult {
        val normalized = input.normalizedText.lowercase()
<<<<<<< HEAD

        val detectedNova4 = nova4Markers.filter { normalized.contains(it) }
        val detectedNova3 = nova3Markers.filter { normalized.contains(it) }
        val detectedNova1 = nova1Markers.filter { normalized.contains(it) }

        val novaGroup: Int
        val confidence: Float
        val explanation: String

        when {
            detectedNova4.size >= 3 -> {
                novaGroup = 4
                confidence = 0.92f
                explanation = "Multiple ultra-processing markers detected: ${detectedNova4.take(3).joinToString(", ")}."
            }
            detectedNova4.size >= 1 -> {
                novaGroup = 4
                confidence = 0.78f
                explanation = "Ultra-processing marker detected: ${detectedNova4.joinToString(", ")}."
            }
            detectedNova3.size >= 2 && detectedNova4.isEmpty() -> {
                novaGroup = 3
                confidence = 0.70f
                explanation = "Processed food markers detected: ${detectedNova3.take(3).joinToString(", ")}."
            }
            detectedNova1.isNotEmpty() && detectedNova4.isEmpty() && detectedNova3.size <= 1 -> {
                novaGroup = 1
                confidence = 0.55f
                explanation = "Mostly unprocessed ingredients: ${detectedNova1.take(3).joinToString(", ")}."
            }
            else -> {
                novaGroup = 2
                confidence = 0.55f
                explanation = "Insufficient markers. Likely minimally processed."
            }
=======
        val markers = findUltraProcessedMarkers(normalized)
        val retailHits = findRetailPackagingCues(normalized)
        val processedHeuristic = markers.isEmpty() &&
            retailHits.isEmpty() &&
            matchesProcessedFoodHeuristic(normalized)

        val (novaGroup, confidence, displayMarkers, explanation) = when {
            markers.size >= 2 -> {
                val extra = ((markers.size - 2).coerceAtMost(4)) * 0.02f
                Quad(
                    4,
                    (0.82f + extra).coerceAtMost(0.92f),
                    markers,
                    buildAdditiveExplanation(markers),
                )
            }
            markers.size == 1 -> Quad(
                3,
                0.56f,
                markers,
                buildAdditiveExplanation(markers),
            )
            retailHits.size >= 2 && markers.isEmpty() -> Quad(
                4,
                0.74f,
                retailHits.map { "packaging: $it" },
                buildRetailExplanation(retailHits, strong = true),
            )
            retailHits.size == 1 && markers.isEmpty() -> Quad(
                3,
                0.57f,
                retailHits.map { "packaging: $it" },
                buildRetailExplanation(retailHits, strong = false),
            )
            processedHeuristic -> Quad(
                3,
                0.58f,
                emptyList(),
                "Salt with added cooking oil points to a processed recipe rather than a single unprocessed ingredient.",
            )
            else -> Quad(
                1,
                0.62f,
                emptyList(),
                "No strong ultra-processed additive markers showed up; the list looks closer to whole or simple ingredients.",
            )
>>>>>>> origin/main
        }

        return ClassificationResult(
            novaGroup = novaGroup,
            confidence = confidence,
<<<<<<< HEAD
            markers = detectedNova4 + detectedNova3,
            explanation = explanation,
            highlightTerms = detectedNova4 + detectedNova3,
=======
            markers = displayMarkers,
            explanation = explanation,
            highlightTerms = displayMarkers,
>>>>>>> origin/main
            engine = id,
        )
    }

    private fun buildAdditiveExplanation(markers: List<String>): String = when {
        markers.size >= 2 -> {
            val preview = markers.take(3).joinToString(", ")
            val suffix = if (markers.size > 3) ", …" else ""
            "Several industrial-style additives appear ($preview$suffix), typical of ultra-processed foods."
        }
        else ->
            "One additive linked to industrial formulations (${markers.first()}) suggests more than minimal processing."
    }

    private fun buildRetailExplanation(hits: List<String>, strong: Boolean): String {
        val preview = hits.take(3).joinToString(", ")
        val tail = if (hits.size > 3) ", …" else ""
        val base = "OCR picked up front-of-package or reheating claims ($preview$tail). " +
            "Those lines often describe factory-prepared foods even when the tiny ingredient panel was not read."
        return if (strong) {
            base + " For additive detail, re-scan the ingredient list in sharp light."
        } else {
            base + " Try capturing the ingredient panel only."
        }
    }

    private data class Quad(
        val nova: Int,
        val conf: Float,
        val displayMarkers: List<String>,
        val explanation: String,
    )

    companion object {
        private val ultraProcessedMarkers: List<String> = listOf(
            "high fructose corn syrup",
            "soy protein isolate",
            "whey protein isolate",
            "acesulfame potassium",
            "monosodium glutamate",
            "hydrogenated oil",
            "modified starch",
            "artificial flavor",
            "natural flavor",
            "maltodextrin",
            "sodium benzoate",
            "carrageenan",
            "sucralose",
            "aspartame",
            "polysorbate",
            "emulsifier",
            "stabilizer",
            "color added",
            "flavoring",
        ).sortedByDescending { it.length }

        /**
         * Phrases common on frozen / ready meals and burger boxes. OCR often reads the big panel,
         * not the fine-print ingredients—so we still flag likely ultra-processing.
         */
        private val retailPackagingCues: List<String> = listOf(
            "serving suggestion enlarged",
            "individually wrapped",
            "fully cooked",
            "keep frozen",
            "cheeseburger",
            "flame-broiled",
            "microwave",
        ).sortedByDescending { it.length }

        private val cookingOils = listOf(
            "sunflower oil",
            "palm oil",
            "vegetable oil",
            "canola oil",
            "corn oil",
            "soybean oil",
            "olive oil",
        )

        fun findUltraProcessedMarkers(normalizedLowercase: String): List<String> {
            val found = LinkedHashSet<String>()
            for (marker in ultraProcessedMarkers) {
                if (normalizedLowercase.contains(marker)) {
                    found.add(marker)
                }
            }
            return found.toList()
        }

        fun findRetailPackagingCues(normalizedLowercase: String): List<String> {
            val found = LinkedHashSet<String>()
            for (cue in retailPackagingCues) {
                if (normalizedLowercase.contains(cue)) {
                    found.add(cue)
                }
            }
            return found.toList()
        }

        fun matchesProcessedFoodHeuristic(normalizedLowercase: String): Boolean {
            if (!normalizedLowercase.contains("salt")) return false
            return cookingOils.any { normalizedLowercase.contains(it) }
        }
    }
}
