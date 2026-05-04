import { motion } from "motion/react";
import { useState } from "react";
import {
  Key,
  Eye,
  EyeOff,
  Shield,
  Cpu,
  Database,
  Camera,
  ChevronRight,
  Check,
  Trash2,
  Info,
} from "lucide-react";
import { CopyrightFooter } from "./copyright-footer";
import { AppHeader } from "./app-header";

interface SettingsViewProps {
  onBack: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const modelOptions = [
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    desc: "Fast, free tier available",
    badge: "Recommended",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    desc: "Balanced speed & accuracy",
    badge: null,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    desc: "Most accurate, higher cost",
    badge: null,
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    desc: "Strong reasoning, detailed analysis",
    badge: null,
  },
];

export function SettingsView({
  onBack,
  apiKey,
  onApiKeyChange,
  selectedModel,
  onModelChange,
}: SettingsViewProps) {
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);

  const handleSave = () => {
    onApiKeyChange(localKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setLocalKey("");
    onApiKeyChange("");
  };

  const maskedKey = localKey
    ? `${localKey.slice(0, 6)}${"•".repeat(Math.max(0, localKey.length - 10))}${localKey.slice(-4)}`
    : "";

  return (
    <div className="flex flex-col h-full bg-[#1a1b23] text-white">
      <AppHeader variant="back" title="Settings" onBack={onBack} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {/* API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3 mt-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span
              className="text-xs text-white/40 tracking-widest uppercase"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              API Key
            </span>
          </div>

          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 mb-3">
            <p className="text-xs text-white/30 mb-3 leading-relaxed">
              Your API key is stored locally in the Android Keystore and never leaves your device.
              It is used to call the LLM for ingredient classification.
            </p>

            {/* Input field */}
            <div className="relative mb-3">
              <input
                type={showKey ? "text" : "password"}
                value={showKey ? localKey : maskedKey || localKey}
                onChange={(e) => {
                  setLocalKey(e.target.value);
                  setSaved(false);
                }}
                placeholder="sk-... or AIza..."
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                style={{ fontFamily: "monospace" }}
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <motion.button
                onClick={handleSave}
                disabled={!localKey || saved}
                className={`flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                  saved
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : localKey
                    ? "bg-emerald-500 text-black hover:bg-emerald-400"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
                whileTap={localKey && !saved ? { scale: 0.97 } : {}}
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved to Keystore
                  </>
                ) : (
                  "Save Key"
                )}
              </motion.button>
              {localKey && (
                <button
                  onClick={handleClear}
                  className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Model Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3 mt-5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span
              className="text-xs text-white/40 tracking-widest uppercase"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              LLM Model
            </span>
          </div>

          <button
            onClick={() => setShowModelPicker(!showModelPicker)}
            className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 flex items-center justify-between mb-2 hover:bg-white/[0.06] transition-colors"
          >
            <div className="text-left">
              <p className="text-sm text-white/80" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                {modelOptions.find((m) => m.id === selectedModel)?.name || "Select Model"}
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                {modelOptions.find((m) => m.id === selectedModel)?.provider} ·{" "}
                {modelOptions.find((m) => m.id === selectedModel)?.desc}
              </p>
            </div>
            <ChevronRight
              className={`w-4 h-4 text-white/30 transition-transform ${showModelPicker ? "rotate-90" : ""}`}
            />
          </button>

          {showModelPicker && (
            <motion.div
              className="space-y-1 mb-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {modelOptions.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setShowModelPicker(false);
                  }}
                  className={`w-full rounded-xl p-3 flex items-center justify-between transition-all ${
                    selectedModel === model.id
                      ? "bg-emerald-500/10 border border-emerald-500/30"
                      : "bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm ${
                          selectedModel === model.id ? "text-emerald-400" : "text-white/70"
                        }`}
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                      >
                        {model.name}
                      </p>
                      {model.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[0.6rem] tracking-wide uppercase">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/25 mt-0.5">
                      {model.provider} · {model.desc}
                    </p>
                  </div>
                  {selectedModel === model.id && (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Tech Stack Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3 mt-5">
            <Info className="w-4 h-4 text-emerald-400" />
            <span
              className="text-xs text-white/40 tracking-widest uppercase"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Under the Hood
            </span>
          </div>

          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 space-y-3">
            {[
              { icon: Camera, label: "CameraX", desc: "Camera preview & image capture" },
              { icon: Eye, label: "ML Kit Text Recognition v2", desc: "On-device OCR engine" },
              { icon: Database, label: "Room Database", desc: "Local scan history & cached results" },
              { icon: Shield, label: "Android Keystore", desc: "Encrypted API key storage" },
              { icon: Cpu, label: "OkHttp", desc: "Direct HTTPS calls to model APIs" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-emerald-400/70" />
                </div>
                <div>
                  <p className="text-sm text-white/60" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    {item.label}
                  </p>
                  <p className="text-xs text-white/25">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy Note */}
        <motion.div
          className="mt-5 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/10 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-emerald-400/50 shrink-0 mt-0.5" />
            <div>
              <p
                className="text-xs text-emerald-400/60 mb-1"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Privacy-First Design
              </p>
              <p className="text-xs text-white/25 leading-relaxed">
                No sign-in required. No data leaves your device except the ingredient text sent to
                your chosen LLM provider. Scan history stays in local Room DB. API keys are
                encrypted via Android Keystore. DataStore handles preferences.
              </p>
            </div>
          </div>
        </motion.div>

        {/* App info */}
        <div className="mt-6 text-center pb-4">
          <p className="text-white/15 text-xs" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Benevolant Bandwidth
          </p>
          <p className="text-white/10 text-xs mt-1">
            v1.0.0 · Kotlin · Jetpack Compose
          </p>
        </div>
      </div>

      {/* Android navigation bar */}
      <CopyrightFooter />
      <div className="h-5 bg-[#13141a] flex items-center justify-center">
        <div className="w-28 h-1 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}