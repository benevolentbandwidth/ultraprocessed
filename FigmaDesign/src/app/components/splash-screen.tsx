import { motion } from "motion/react";
import { useEffect } from "react";
import { Heart } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({
  onComplete,
}: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Letters for "Benevolant" and "Bandwidth"
  const word1 = "Benevolant";
  const word2 = "Bandwidth";

  return (
    <div className="flex flex-col h-full bg-[#06060a] text-white items-center justify-center relative overflow-hidden">
      {/* Background ambient glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Logo mark */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 120,
        }}
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center relative shadow-2xl shadow-emerald-500/30">
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)",
            }}
          />
          {/* Food droplet icon */}
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-black relative z-10">
            <path
              d="M12 3C12 3 8 5 8 9C8 11 9 12 9 13C9 14 8 15 8 17C8 19 9 21 12 21C15 21 16 19 16 17C16 15 15 14 15 13C15 12 16 11 16 9C16 5 12 3 12 3Z"
              fill="currentColor"
              opacity="0.9"
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
        {/* Glow ring */}
        <motion.div
          className="absolute -inset-3 rounded-[1.75rem] border-2 border-emerald-500/20"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* "Benevolant" - animated letter by letter */}
      <div className="flex mb-1 overflow-hidden">
        {word1.split("").map((letter, i) => (
          <motion.span
            key={`w1-${i}`}
            className="text-white/90"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.6 + i * 0.05,
              duration: 0.5,
              type: "spring",
              stiffness: 150,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* "Bandwidth" - animated letter by letter */}
      <div className="flex overflow-hidden">
        {word2.split("").map((letter, i) => (
          <motion.span
            key={`w2-${i}`}
            className="text-emerald-400"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 1.1 + i * 0.05,
              duration: 0.5,
              type: "spring",
              stiffness: 150,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Divider line */}
      <motion.div
        className="w-12 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent my-6"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      />

      {/* Gen-Z tagline */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3, duration: 0.5 }}
      >
        <p
          className="text-white/50 tracking-[0.3em] uppercase mb-2"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "0.6rem",
          }}
        >
          presents
        </p>
        <h2
          className="text-white/80 mb-1"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          is ur food even real?
        </h2>
        <p
          className="text-white/25 text-xs"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          the ultra-processed food unmasker
        </p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        className="absolute bottom-20 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Version tag */}
      <motion.div
        className="absolute bottom-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2 }}
      >
        <p
          className="text-white/15 text-[0.65rem] mb-1"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          © The Benevolent Bandwidth Foundation, Inc. ·
          Massachusetts Nonprofit Corporation. All rights
          reserved.
        </p>
        <p
          className="text-white/15 text-[0.65rem] flex items-center justify-center gap-1"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Built with{" "}
          <Heart className="w-2.5 h-2.5 fill-red-500/40 text-red-500/40" />{" "}
          for humanity
        </p>
        <p
          className="text-white/10 text-[0.55rem] mt-1.5"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          v1.0.0 · Android · Kotlin + Jetpack Compose
        </p>
      </motion.div>
    </div>
  );
}