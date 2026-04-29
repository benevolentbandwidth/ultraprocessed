package com.b2.ultraprocessed.ui

import android.graphics.BitmapFactory
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.b2.ultraprocessed.classify.ClassificationContext
import com.b2.ultraprocessed.classify.IngredientInput
import com.b2.ultraprocessed.classify.RulesClassifier
import com.b2.ultraprocessed.ocr.OcrEngine
import com.b2.ultraprocessed.ui.theme.DarkBg
import kotlinx.coroutines.launch

data class AppTimingConfig(
    val splashDurationMillis: Long = 4200L,
    /** Keeps the analyzing UI visible long enough to read (demo path is CPU-fast otherwise). */
    val analysisMinimumDisplayMillis: Long = 2600L,
)

@Composable
fun UltraProcessedApp(
    timingConfig: AppTimingConfig = AppTimingConfig(),
    enableLiveCamera: Boolean = true,
) {
    var destination by rememberSaveable { mutableStateOf(AppDestination.Splash) }
    var apiKey by rememberSaveable { mutableStateOf("") }
    var selectedModelId by rememberSaveable {
        mutableStateOf(StubUiData.modelOptions.first().id)
    }
    var lastCapturedPhotoPath by rememberSaveable { mutableStateOf<String?>(null) }
<<<<<<< HEAD
    var lastOcrText by rememberSaveable { mutableStateOf<String?>(null) }
    var lastRealResult by remember { mutableStateOf<ScanResultUi?>(null) }
    val scope = rememberCoroutineScope()
    val classifier = remember { RulesClassifier() }
=======
    var barcodeValue by rememberSaveable { mutableStateOf<String?>(null) }
    var scanSessionId by remember { mutableIntStateOf(0) }
    var demoAssetPath by remember { mutableStateOf<String?>(null) }
    var analysisMode by remember { mutableStateOf(AnalysisMode.LabelImage) }
    var showDemoPicker by remember { mutableStateOf(false) }
    var analysisErrorMessage by remember { mutableStateOf("") }
    var currentScanResult by remember { mutableStateOf<ScanResultUi?>(null) }
>>>>>>> origin/main

    val historyItems = remember {
        mutableStateListOf<HistoryItemUi>().apply {
            addAll(StubUiData.initialHistory())
        }
    }

    LaunchedEffect(destination) {
        if (destination != AppDestination.Scanner) {
            showDemoPicker = false
        }
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = DarkBg,
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            AnimatedContent(
                targetState = destination,
                transitionSpec = { fadeIn() togetherWith fadeOut() },
                label = "destination-animation",
            ) { screen ->
                when (screen) {
                    AppDestination.Splash -> SplashScreen(
                        displayDurationMillis = timingConfig.splashDurationMillis,
                        onComplete = { destination = AppDestination.Scanner },
                    )

<<<<<<< HEAD
                AppDestination.Scanner -> ScannerScreen(
                    hasApiKey = apiKey.isNotBlank(),
                    enableLiveCamera = enableLiveCamera,
                    onScan = { path ->
                        lastCapturedPhotoPath = path
                        // Run real OCR on captured image
                        val bitmap = BitmapFactory.decodeFile(path)
                        if (bitmap != null) {
                            OcrEngine.extractText(bitmap) { ocrResult ->
                                lastOcrText = if (ocrResult.success) ocrResult.normalizedText else null
                                // Run RulesClassifier on OCR output
                                if (ocrResult.success && ocrResult.normalizedText.isNotBlank()) {
                                    scope.launch {
                                        val classResult = classifier.classify(
                                            input = IngredientInput(
                                                rawText = ocrResult.rawText,
                                                normalizedText = ocrResult.normalizedText,
                                            ),
                                            context = ClassificationContext(
                                                allowNetwork = false,
                                                apiFallbackEnabled = false,
                                                preferOnDevice = true,
                                            ),
                                        )
                                        lastRealResult = ScanResultUi(
                                            productName = "Scanned Product",
                                            novaGroup = classResult.novaGroup,
                                            summary = classResult.explanation,
                                            problemIngredients = classResult.markers.map {
                                                ProblemIngredient(it, "Detected by rules engine.")
                                            },
                                            allIngredients = ocrResult.normalizedText
                                                .split(",")
                                                .map { it.trim() },
                                            engineLabel = classResult.engine,
                                        )
                                    }
                                }
                            }
                        }
                        destination = AppDestination.Analyzing
                    },
                    onTryDemo = {
                        lastCapturedPhotoPath = null
                        lastOcrText = null
                        lastRealResult = null
                        destination = AppDestination.Analyzing
                    },
                    onSettings = { destination = AppDestination.Settings },
                    onHistory = { destination = AppDestination.History },
                )

                AppDestination.Analyzing -> AnalyzingScreen(
                    modelName = StubUiData.modelOptions
                        .firstOrNull { it.id == selectedModelId }
                        ?.name ?: selectedModelId,
                    displayDurationMillis = timingConfig.analysisDurationMillis,
                    onComplete = {
                        val result = lastRealResult
                            ?: StubUiData.results[currentResultIndex % StubUiData.results.size]

                        historyItems.add(
                            0,
                            HistoryItemUi(
                                id = "scan-${System.currentTimeMillis()}",
                                productName = result.productName,
                                novaGroup = result.novaGroup,
                                scannedAt = "Just now",
                                summary = result.summary,
                                capturedImagePath = lastCapturedPhotoPath,
                            ),
                        )
                        if (lastRealResult == null) {
                            currentResultIndex = (currentResultIndex + 1) % StubUiData.results.size
                        }
                        destination = AppDestination.Results
                    },
                )

                AppDestination.Results -> ResultsScreen(
                    result = lastRealResult
                        ?: StubUiData.results[
                            (currentResultIndex + StubUiData.results.size - 1) %
                                StubUiData.results.size
                        ],
                    onScanAgain = {
                        lastRealResult = null
                        destination = AppDestination.Scanner
                    },
                    onOpenHistory = { destination = AppDestination.History },
                )

                AppDestination.Settings -> SettingsScreen(
                    apiKey = apiKey,
                    selectedModelId = selectedModelId,
                    modelOptions = StubUiData.modelOptions,
                    onBack = { destination = AppDestination.Scanner },
                    onApiKeySaved = { apiKey = it },
                    onModelSelected = { selectedModelId = it },
                )

                AppDestination.History -> HistoryScreen(
                    historyItems = historyItems,
                    onBack = { destination = AppDestination.Scanner },
                    onClearItem = { item -> historyItems.remove(item) },
                )
=======
                    AppDestination.Scanner -> ScannerScreen(
                        hasApiKey = apiKey.isNotBlank(),
                        enableLiveCamera = enableLiveCamera,
                        onScan = { path ->
                            lastCapturedPhotoPath = path
                            barcodeValue = null
                            demoAssetPath = null
                            analysisMode = AnalysisMode.LabelImage
                            scanSessionId++
                            destination = AppDestination.Analyzing
                        },
                        onBarcodeScanned = { code ->
                            lastCapturedPhotoPath = null
                            barcodeValue = code
                            demoAssetPath = null
                            analysisMode = AnalysisMode.BarcodeValue
                            scanSessionId++
                            destination = AppDestination.Analyzing
                        },
                        onTryDemo = { showDemoPicker = true },
                        onSettings = { destination = AppDestination.Settings },
                        onHistory = { destination = AppDestination.History },
                    )

                    AppDestination.Analyzing -> AnalyzingScreen(
                        scanSessionId = scanSessionId,
                        imagePath = lastCapturedPhotoPath,
                        barcodeValue = barcodeValue,
                        demoAssetPath = demoAssetPath,
                        mode = analysisMode,
                        minimumDisplayMillis = timingConfig.analysisMinimumDisplayMillis,
                        modelName = StubUiData.modelOptions
                            .firstOrNull { it.id == selectedModelId }
                            ?.name
                            ?: selectedModelId,
                        onSuccess = { result ->
                            currentScanResult = result
                            barcodeValue = null
                        historyItems.add(
                            0,
                            result.toHistoryItem(
                                capturedImagePath = result.labelImagePath,
                            ),
                        )
                            destination = AppDestination.Results
                        },
                        onFailure = { message ->
                            analysisErrorMessage = message
                            barcodeValue = null
                            destination = AppDestination.AnalysisError
                        },
                    )

                    AppDestination.Results -> {
                        val result = currentScanResult
                        if (result != null) {
                            ResultsScreen(
                                result = result,
                                onScanAgain = {
                                    demoAssetPath = null
                                    destination = AppDestination.Scanner
                                },
                                onOpenHistory = { destination = AppDestination.History },
                            )
                        } else {
                            LaunchedEffect(Unit) {
                                destination = AppDestination.Scanner
                            }
                        }
                    }

                    AppDestination.AnalysisError -> AnalysisErrorScreen(
                        message = analysisErrorMessage.ifBlank {
                            "Could not read enough ingredient text. Please try again."
                        },
                        onRetry = {
                            analysisErrorMessage = ""
                            demoAssetPath = null
                            destination = AppDestination.Scanner
                        },
                    )

                    AppDestination.Settings -> SettingsScreen(
                        apiKey = apiKey,
                        selectedModelId = selectedModelId,
                        modelOptions = StubUiData.modelOptions,
                        onBack = { destination = AppDestination.Scanner },
                        onApiKeySaved = { apiKey = it },
                        onModelSelected = { selectedModelId = it },
                    )

                    AppDestination.History -> HistoryScreen(
                        historyItems = historyItems,
                        onBack = { destination = AppDestination.Scanner },
                        onClearItem = { item -> historyItems.remove(item) },
                    )
                }
            }

            if (showDemoPicker && destination == AppDestination.Scanner) {
                DemoSamplePickerDialog(
                    onDismiss = { showDemoPicker = false },
                    onSampleSelected = { sample ->
                        showDemoPicker = false
                        demoAssetPath = sample.assetPath
                        lastCapturedPhotoPath = null
                        analysisMode = AnalysisMode.DemoAsset
                        scanSessionId++
                        destination = AppDestination.Analyzing
                    },
                )
>>>>>>> origin/main
            }
        }
    }
}

private fun ScanResultUi.toHistoryItem(capturedImagePath: String?): HistoryItemUi =
    HistoryItemUi(
        id = "scan-${System.currentTimeMillis()}",
        productName = productName,
        novaGroup = novaGroup,
        scannedAt = "Just now",
        summary = summary,
        capturedImagePath = capturedImagePath,
        isBarcodeLookupOnly = isBarcodeLookupOnly,
    )
