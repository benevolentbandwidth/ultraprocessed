import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SplashScreen } from "./components/splash-screen";
import { ScannerView } from "./components/scanner-view";
import { AnalyzingView } from "./components/analyzing-view";
import { ResultsView } from "./components/results-view";
import { SettingsView } from "./components/settings-view";
import { HistoryView } from "./components/history-view";

type AppState = "splash" | "scanner" | "analyzing" | "results" | "settings" | "history";

export default function App() {
  const [state, setState] = useState<AppState>("splash");
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");

  const handleSplashComplete = useCallback(() => {
    setState("scanner");
  }, []);

  const handleScan = useCallback(() => {
    setState("analyzing");
  }, []);

  const handleAnalysisComplete = useCallback(() => {
    setState("results");
  }, []);

  const handleScanAgain = useCallback(() => {
    setState("scanner");
  }, []);

  const handleOpenSettings = useCallback(() => {
    setState("settings");
  }, []);

  const handleOpenHistory = useCallback(() => {
    setState("history");
  }, []);

  const handleBackToScanner = useCallback(() => {
    setState("scanner");
  }, []);

  // Slide direction helper
  const getTransition = (view: AppState) => {
    switch (view) {
      case "splash":
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0, scale: 0.95 } };
      case "scanner":
        return { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } };
      case "analyzing":
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0, scale: 0.95 } };
      case "results":
        return { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 } };
      case "settings":
        return { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 } };
      case "history":
        return { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 } };
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
    }
  };

  const t = getTransition(state);

  return (
    <div className="size-full flex items-center justify-center bg-[#030306]">
      {/* Android device frame */}
      <div
        className="relative w-full max-w-[400px] h-full max-h-[860px] overflow-hidden bg-[#0a0a0f]"
        style={{
          fontFamily: "Inter, sans-serif",
          borderRadius: "clamp(0px, 2vw, 2.5rem)",
          boxShadow: "0 0 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            className="absolute inset-0"
            initial={t.initial}
            animate={t.animate}
            exit={t.exit}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {state === "splash" && <SplashScreen onComplete={handleSplashComplete} />}
            {state === "scanner" && (
              <ScannerView
                onScan={handleScan}
                onSettings={handleOpenSettings}
                onHistory={handleOpenHistory}
                hasApiKey={!!apiKey}
              />
            )}
            {state === "analyzing" && <AnalyzingView onComplete={handleAnalysisComplete} />}
            {state === "results" && <ResultsView onScanAgain={handleScanAgain} />}
            {state === "settings" && (
              <SettingsView
                onBack={handleBackToScanner}
                apiKey={apiKey}
                onApiKeyChange={setApiKey}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            )}
            {state === "history" && <HistoryView onBack={handleBackToScanner} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
