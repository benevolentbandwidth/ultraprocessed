package com.b2.ultraprocessed.ocr

object `OcrNormalizer` {

    fun normalize(raw: String): String {
        return raw
            .lowercase()
            .replace(Regex("[^a-z0-9,.()/% \n]"), " ")
            .replace(Regex("(?i)ingredients[:\\s]*"), "")
            .replace(Regex("\\s+"), " ")
            .trim()
    }
}