package com.b2.ultraprocessed.ocr

<<<<<<< HEAD
data class `OcrResult`(
    val rawText: String,
    val normalizedText: String,
    val confidence: Float,
    val success: Boolean,
    val errorMessage: String? = null
)
=======
/**
 * Outcome of on-device text recognition on a label image.
 */
sealed class OcrResult {
    data class Success(val rawText: String) : OcrResult()

    data class Failure(
        val message: String,
        val cause: Throwable? = null,
    ) : OcrResult()
}
>>>>>>> origin/main
