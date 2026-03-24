package com.b2.ultraprocessed.ocr

data class `OcrResult`(
    val rawText: String,
    val normalizedText: String,
    val confidence: Float,
    val success: Boolean,
    val errorMessage: String? = null
)