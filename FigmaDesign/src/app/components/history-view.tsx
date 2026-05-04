import { motion } from "motion/react";
import { Trash2, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { CopyrightFooter } from "./copyright-footer";
import { AppHeader } from "./app-header";

interface HistoryItem {
  id: string;
  productName: string;
  verdict: "green" | "yellow" | "red";
  novaGroup: number;
  timestamp: string;
}

interface HistoryViewProps {
  onBack: () => void;
}

const mockHistory: HistoryItem[] = [
  { id: "1", productName: "Strawberry Fruit Snacks", verdict: "red", novaGroup: 4, timestamp: "2 min ago" },
  { id: "2", productName: "Organic Mixed Nuts", verdict: "green", novaGroup: 1, timestamp: "15 min ago" },
  { id: "3", productName: "Whole Grain Cereal Bar", verdict: "yellow", novaGroup: 3, timestamp: "1 hr ago" },
  { id: "4", productName: "Diet Cola Zero", verdict: "red", novaGroup: 4, timestamp: "1 hr ago" },
  { id: "5", productName: "Fresh Orange Juice", verdict: "green", novaGroup: 1, timestamp: "2 hrs ago" },
  { id: "6", productName: "Protein Energy Bar", verdict: "yellow", novaGroup: 3, timestamp: "3 hrs ago" },
];

const verdictMeta = {
  green: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "PASS" },
  yellow: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "CAUTION" },
  red: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "AVOID" },
};

export function HistoryView({ onBack }: HistoryViewProps) {
  return (
    <div className="flex flex-col h-full bg-[#1a1b23] text-white">
      <AppHeader
        variant="back"
        title="Scan History"
        onBack={onBack}
        actions={
          <button className="w-10 h-10 rounded-full hover:bg-white/5 active:bg-white/10 flex items-center justify-center transition-colors">
            <Trash2 className="w-[18px] h-[18px] text-white/40" />
          </button>
        }
      />

      {/* Info badge */}
      <div className="mx-5 mb-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-white/20 shrink-0" />
        <p className="text-[0.65rem] text-white/25" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          Stored locally via Room DB · Session only · No cloud sync
        </p>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="space-y-2">
          {mockHistory.map((item, i) => {
            const meta = verdictMeta[item.verdict];
            const Icon = meta.icon;
            return (
              <motion.div
                key={item.id}
                className={`rounded-xl ${meta.bg} border ${meta.border} p-3.5 flex items-center gap-3`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className={`w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/75 truncate" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    {item.productName}
                  </p>
                  <p className="text-[0.65rem] text-white/25 mt-0.5">
                    NOVA {item.novaGroup} · {item.timestamp}
                  </p>
                </div>
                <span
                  className={`text-[0.6rem] ${meta.color} tracking-widest shrink-0`}
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {meta.label}
                </span>
              </motion.div>
            );
          })}
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