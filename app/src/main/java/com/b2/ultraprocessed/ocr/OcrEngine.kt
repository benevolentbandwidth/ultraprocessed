package com.b2.ultraprocessed.ocr

import android.graphics.Bitmap
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions

object OcrEngine {

    private val recognizer = TextRecognition.getClient(
        TextRecognizerOptions.DEFAULT_OPTIONS
    )

    fun extractText(bitmap: Bitmap, onResult: (OcrResult) -> Unit) {
        val image = InputImage.fromBitmap(bitmap, 0)

        recognizer.process(image)
            .addOnSuccessListener { visionText ->
                val rawText = visionText.text

                if (rawText.isBlank()) {
                    onResult(
                        OcrResult(
                            rawText = "",
                            normalizedText = "",
                            confidence = 0f,
                            success = false,
                            errorMessage = "Couldn't read label. Try again."
                        )
                    )
                    return@addOnSuccessListener
                }

                val confidence = visionText.textBlocks
                    .flatMap { it.lines }
                    .flatMap { it.elements }
                    .mapNotNull { it.confidence }
                    .average()
                    .toFloat()

                val normalizedText = OcrNormalizer.normalize(rawText)

                onResult(
                    OcrResult(
                        rawText = rawText,
                        normalizedText = normalizedText,
                        confidence = confidence,
                        success = true
                    )
                )
            }
            .addOnFailureListener {
                onResult(
                    OcrResult(
                        rawText = "",
                        normalizedText = "",
                        confidence = 0f,
                        success = false,
                        errorMessage = "Couldn't read label. Try again."
                    )
                )
            }
    }
}