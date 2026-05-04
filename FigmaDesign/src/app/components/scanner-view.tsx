import { Camera, ImagePlus, Barcode, ScanLine } from "lucide-react";
import { motion } from "motion/react";
import { CopyrightFooter } from "./copyright-footer";
import { AppHeader } from "./app-header";

interface ScannerViewProps {
  onScan: () => void;
  onSettings: () => void;
  onHistory: () => void;
  hasApiKey: boolean;
}

export function ScannerView({ onScan, onSettings, onHistory, hasApiKey }: ScannerViewProps) {
  return (
    <div className="flex flex-col h-full bg-[#1a1b23] text-white relative overflow-hidden">
      <AppHeader
        variant="home"
        onSettings={onSettings}
        onHistory={onHistory}
        hasApiKey={hasApiKey}
      />

      {/* Camera viewfinder */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {/* Simulated camera background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1b23] via-[#1e1f28] to-[#1a1b23]" />

        {/* Viewfinder frame */}
        <motion.div
          className="relative w-72 h-72"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-[3px] border-l-[3px] border-emerald-400 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-[3px] border-r-[3px] border-emerald-400 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-2xl" />

          {/* Scanning line */}
          <motion.div
            className="absolute left-6 right-6 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent, #34d399, transparent)",
              boxShadow: "0 0 20px rgba(52,211,153,0.3)",
            }}
            animate={{ top: ["8%", "92%", "8%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Center focus indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-8 h-8 border border-white/15 rounded-lg"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Inner subtle grid */}
          <div className="absolute inset-8 border border-white/[0.03] rounded-lg" />
        </motion.div>
      </div>

      {/* Bottom instructions */}
      <motion.div
        className="text-center px-6 pb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p
          className="text-white/35 text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Point camera at the ingredient label
        </p>
      </motion.div>

      {/* Upload button */}
      <div className="px-5 pb-2">
        <button
          onClick={onScan}
          className="w-full py-3 bg-white/[0.05] hover:bg-white/[0.08] rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/[0.05]"
        >
          <ImagePlus className="w-4 h-4 text-white/50" />
          <span className="text-white/50" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "0.85rem" }}>
            Upload Photo
          </span>
        </button>
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-3">
        <div className="flex gap-2.5 mb-3">
          <button
            onClick={onScan}
            className="flex-1 py-3 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ScanLine className="w-4 h-4" />
            <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "0.85rem" }}>Ingredient Label</span>
          </button>
          <button
            onClick={onScan}
            className="flex-1 py-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.05] text-white/50 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Barcode className="w-4 h-4" />
            <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "0.85rem" }}>Barcode Scan</span>
          </button>
        </div>

        <motion.button
          onClick={onScan}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-emerald-500/25"
          whileTap={{ scale: 0.98 }}
        >
          <Camera className="w-5 h-5" />
          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600 }}>Scan Label</span>
        </motion.button>
      </div>

      {/* Footer */}
      <CopyrightFooter />
      <div className="h-5 bg-[#13141a] flex items-center justify-center">
        <div className="w-28 h-1 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}