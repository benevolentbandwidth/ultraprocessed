import { ArrowLeft, Settings, History, Sparkles } from "lucide-react";

interface AppHeaderProps {
  variant?: "home" | "back";
  title?: string;
  onBack?: () => void;
  onSettings?: () => void;
  onHistory?: () => void;
  hasApiKey?: boolean;
  actions?: React.ReactNode;
}

export function AppHeader({
  variant = "home",
  title,
  onBack,
  onSettings,
  onHistory,
  hasApiKey = true,
  actions,
}: AppHeaderProps) {
  return (
    <>
      {/* Android status bar */}
      <div className="h-6 bg-[#13141a]" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        {variant === "home" ? (
          <div className="flex items-center gap-3">
            {/* Professional Logo */}
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black">
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
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-black" strokeWidth={3} />
              </div>
            </div>
            <div>
              <h1
                className="text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                Ultra Processed Detective
              </h1>
              <p className="text-emerald-400/60" style={{ fontSize: "0.7rem", fontFamily: "Space Grotesk, sans-serif", marginTop: "1px" }}>
                is ur food even real?
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full hover:bg-white/5 active:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </button>
            <h1
              className="text-white"
              style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.15rem", fontWeight: 600 }}
            >
              {title}
            </h1>
          </div>
        )}

        <div className="flex items-center gap-2">
          {actions || (
            <>
              {onHistory && (
                <button
                  onClick={onHistory}
                  className="w-10 h-10 rounded-full hover:bg-white/5 active:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <History className="w-5 h-5 text-white/50" />
                </button>
              )}
              {onSettings && (
                <button
                  onClick={onSettings}
                  className="w-10 h-10 rounded-full hover:bg-white/5 active:bg-white/10 flex items-center justify-center transition-colors relative"
                >
                  <Settings className="w-5 h-5 text-white/50" />
                  {!hasApiKey && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
