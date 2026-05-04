import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { CopyrightFooter } from "./copyright-footer";

interface AnalyzingViewProps {
  onComplete: () => void;
}

const steps = [
  { text: "Capturing image via CameraX...", tech: "CameraX" },
  { text: "Running ML Kit Text Recognition...", tech: "ML Kit v2" },
  { text: "Extracting ingredient list...", tech: "OCR" },
  { text: "Sending to LLM for NOVA classification...", tech: "OkHttp" },
  { text: "Analyzing additives & processing level...", tech: "LLM" },
  { text: "Generating verdict...", tech: "Done" },
];

export function AnalyzingView({ onComplete }: AnalyzingViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 550);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1.8;
      });
    }, 50);

    const timer = setTimeout(onComplete, 3500);
    return () => {
      clearTimeout(timer);
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col h-full bg-[#1a1b23] text-white">
      {/* Android status bar */}
      <div className="h-6 bg-[#13141a]" />

      {/* Main content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Scanning animation */}
        <div className="relative w-36 h-36 mb-10">
          {/* Outer pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-emerald-500/10"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          {/* Second pulse ring */}
          <motion.div
            className="absolute inset-2 rounded-full border border-emerald-500/15"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.05, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          {/* Rotating ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-emerald-500/25"
            style={{ borderTopColor: "transparent", borderRightColor: "transparent" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          {/* Counter-rotating ring */}
          <motion.div
            className="absolute inset-8 rounded-full border-2 border-emerald-400/40"
            style={{ borderBottomColor: "transparent", borderLeftColor: "transparent" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          {/* Center icon area */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
                <path
                  d="M12 3C12 3 8 5 8 9C8 11 9 12 9 13C9 14 8 15 8 17C8 19 9 21 12 21C15 21 16 19 16 17C16 15 15 14 15 13C15 12 16 11 16 9C16 5 12 3 12 3Z"
                  fill="currentColor"
                  opacity="0.7"
                />
                <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                <path
                  d="M10 11C10 11 11 10.5 12 10.5C13 10.5 14 11 14 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-[260px] mb-6">
          <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: "linear-gradient(90deg, #059669, #34d399)",
              }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="flex justify-between mt-2.5">
            <span
              className="text-[0.65rem] text-white/25 tracking-widest uppercase"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Analyzing
            </span>
            <span
              className="text-[0.65rem] text-emerald-400/60 tabular-nums"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
        </div>

        {/* Current step */}
        <div className="h-14 flex flex-col items-center justify-center">
          <motion.p
            key={currentStep}
            className="text-sm text-white/45 text-center mb-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {steps[currentStep].text}
          </motion.p>
          <motion.span
            key={`tech-${currentStep}`}
            className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400/50 text-[0.55rem] tracking-wider uppercase"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {steps[currentStep].tech}
          </motion.span>
        </div>

        {/* Step dots */}
        <div className="flex gap-2 mt-6">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i <= currentStep ? "bg-emerald-400 w-4" : "bg-white/10 w-1.5"
              }`}
              layout
              transition={{ type: "spring", stiffness: 300 }}
            />
          ))}
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