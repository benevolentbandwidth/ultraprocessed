import { motion } from "motion/react";
import { Share2, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { CopyrightFooter } from "./copyright-footer";
import { AppHeader } from "./app-header";

type Verdict = "green" | "yellow" | "red";

interface ResultData {
  verdict: Verdict;
  novaGroup: number;
  productName: string;
  summary: string;
  problemIngredients: { name: string; reason: string }[];
  allIngredients: string[];
}

interface ResultsViewProps {
  onScanAgain: () => void;
  result?: ResultData;
}

const demoResults: ResultData[] = [
  {
    verdict: "red",
    novaGroup: 4,
    productName: "Strawberry Fruit Snacks",
    summary:
      "This product is ultra-processed (NOVA 4). It contains multiple artificial additives, high-fructose corn syrup, and synthetic colorants that are associated with health concerns.",
    problemIngredients: [
      { name: "High Fructose Corn Syrup", reason: "Ultra-processed sweetener linked to metabolic issues" },
      { name: "Red 40 (Allura Red)", reason: "Synthetic dye; potential hyperactivity in children" },
      { name: "Sodium Benzoate", reason: "Preservative; may form benzene with ascorbic acid" },
      { name: "Partially Hydrogenated Oil", reason: "Contains trans fats; cardiovascular risk" },
      { name: "Tertiary Butylhydroquinone", reason: "Synthetic antioxidant preservative (TBHQ)" },
    ],
    allIngredients: [
      "Sugar", "High Fructose Corn Syrup", "Corn Syrup", "Modified Corn Starch",
      "Partially Hydrogenated Oil", "Citric Acid", "Sodium Benzoate",
      "Natural & Artificial Flavors", "Red 40", "Yellow 5", "Blue 1",
      "Tertiary Butylhydroquinone", "Gelatin",
    ],
  },
  {
    verdict: "yellow",
    novaGroup: 3,
    productName: "Whole Grain Cereal Bar",
    summary:
      "This product is processed (NOVA 3). While it contains whole grains, it also includes added sugars and some processed ingredients. Moderate consumption is reasonable.",
    problemIngredients: [
      { name: "Cane Sugar", reason: "Added sugar; contributes to excess caloric intake" },
      { name: "Soy Lecithin", reason: "Emulsifier; generally safe but indicates processing" },
    ],
    allIngredients: [
      "Whole Grain Oats", "Cane Sugar", "Rice Flour", "Canola Oil",
      "Honey", "Soy Lecithin", "Salt", "Natural Flavor",
    ],
  },
  {
    verdict: "green",
    novaGroup: 1,
    productName: "Organic Mixed Nuts",
    summary:
      "This product is unprocessed or minimally processed (NOVA 1). It contains whole food ingredients with no artificial additives. An excellent choice.",
    problemIngredients: [],
    allIngredients: ["Almonds", "Cashews", "Walnuts", "Pecans"],
  },
];

const verdictConfig = {
  green: {
    color: "#22c55e",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400",
    label: "PASS",
    sublabel: "Minimally Processed",
    icon: CheckCircle,
    ringColor: "rgba(34,197,94,0.2)",
  },
  yellow: {
    color: "#eab308",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    textColor: "text-yellow-400",
    label: "CAUTION",
    sublabel: "Moderately Processed",
    icon: AlertTriangle,
    ringColor: "rgba(234,179,8,0.2)",
  },
  red: {
    color: "#ef4444",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    textColor: "text-red-400",
    label: "AVOID",
    sublabel: "Ultra-Processed",
    icon: XCircle,
    ringColor: "rgba(239,68,68,0.2)",
  },
};

export function ResultsView({ onScanAgain, result }: ResultsViewProps) {
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  // Cycle through demo results randomly if no result provided
  const data = result || demoResults[Math.floor(Math.random() * demoResults.length)];
  const [fixedData] = useState(data);
  const config = verdictConfig[fixedData.verdict];
  const VerdictIcon = config.icon;

  return (
    <div className="flex flex-col h-full bg-[#1a1b23] text-white">
      <AppHeader
        variant="back"
        title="Analysis Results"
        onBack={onScanAgain}
        actions={
          <button className="w-10 h-10 rounded-full hover:bg-white/5 active:bg-white/10 flex items-center justify-center transition-colors">
            <Share2 className="w-5 h-5 text-white/50" />
          </button>
        }
      />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {/* Verdict Card */}
        <motion.div
          className={`rounded-3xl ${config.bgColor} border ${config.borderColor} p-6 mb-4 text-center`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          {/* Traffic light indicator */}
          <motion.div
            className="mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: config.ringColor }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${config.color}22` }}
              animate={{ boxShadow: [`0 0 20px ${config.color}33`, `0 0 40px ${config.color}22`, `0 0 20px ${config.color}33`] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <VerdictIcon className="w-7 h-7" style={{ color: config.color }} />
            </motion.div>
          </motion.div>

          <motion.h1
            className={`${config.textColor} tracking-widest mb-1`}
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.75rem', fontWeight: 700 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {config.label}
          </motion.h1>
          <p className="text-white/40 text-xs tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            NOVA Group {fixedData.novaGroup} · {config.sublabel}
          </p>
        </motion.div>

        {/* Product name */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-white/90 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {fixedData.productName}
          </h2>
          <p className="text-white/40 text-sm leading-relaxed">
            {fixedData.summary}
          </p>
        </motion.div>

        {/* Problem Ingredients */}
        {fixedData.problemIngredients.length > 0 && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3
              className="text-xs text-white/30 tracking-widest uppercase mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Problem Ingredients
            </h3>
            <div className="space-y-2">
              {fixedData.problemIngredients.map((ingredient, i) => (
                <motion.div
                  key={ingredient.name}
                  className={`rounded-xl ${config.bgColor} border ${config.borderColor} p-3`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: config.color }}
                    />
                    <div>
                      <p className="text-white/80 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {ingredient.name}
                      </p>
                      <p className="text-white/35 text-xs mt-0.5">
                        {ingredient.reason}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Ingredients */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => setShowAllIngredients(!showAllIngredients)}
            className="flex items-center justify-between w-full py-3 text-white/30"
          >
            <span className="text-xs tracking-widest uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              All Ingredients ({fixedData.allIngredients.length})
            </span>
            {showAllIngredients ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showAllIngredients && (
            <motion.div
              className="flex flex-wrap gap-2 pb-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
            >
              {fixedData.allIngredients.map((ing) => {
                const isProblem = fixedData.problemIngredients.some(
                  (p) => p.name === ing
                );
                return (
                  <span
                    key={ing}
                    className={`px-3 py-1.5 rounded-full text-xs ${
                      isProblem
                        ? `${config.bgColor} border ${config.borderColor} ${config.textColor}`
                        : "bg-white/5 text-white/40 border border-white/10"
                    }`}
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {ing}
                  </span>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* NOVA explanation */}
        <motion.div
          className="mt-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-white/25 leading-relaxed">
            <span className="text-white/40" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>NOVA Classification:</span>{" "}
            A food classification system that groups foods by the extent and purpose of processing. Group 1 (unprocessed) to Group 4 (ultra-processed).
          </p>
        </motion.div>
      </div>

      {/* Bottom action */}
      <div className="px-5 pb-2 pt-2">
        <motion.button
          onClick={onScanAgain}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl flex items-center justify-center gap-2 transition-colors"
          whileTap={{ scale: 0.97 }}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Scan Another Product
        </motion.button>
      </div>

      {/* Android navigation bar */}
      <CopyrightFooter />
      <div className="h-5 bg-[#13141a] flex items-center justify-center">
        <div className="w-28 h-1 bg-white/10 rounded-full" />
      </div>
    </div>
  );
}