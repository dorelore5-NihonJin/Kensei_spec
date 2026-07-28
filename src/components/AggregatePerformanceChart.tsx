import { Trophy, Sparkles } from "lucide-react";

interface ComponentInfo {
  name: string;
  score: number;
  details: string;
  manufacturer?: string;
  releaseYear?: number;
}

interface AggregatePerformanceChartProps {
  type: "cpu" | "gpu";
  itemA: ComponentInfo;
  itemB: ComponentInfo;
}

const GPU_MILESTONES = [
  { name: "GTX 1050 Ti", score: 85 },
  { name: "GTX 1660", score: 145 },
  { name: "RTX 3060", score: 205 },
  { name: "RTX 4070", score: 380 },
  { name: "RTX 4080", score: 520 },
  { name: "RTX 5090", score: 980 },
];

const CPU_MILESTONES = [
  { name: "Pentium 4", score: 11 },
  { name: "i7-3770K", score: 65 },
  { name: "i5-10400", score: 125 },
  { name: "Ryzen 5600", score: 185 },
  { name: "7800X3D", score: 310 },
  { name: "14900KS / 285K", score: 450 },
];

export default function AggregatePerformanceChart({ type, itemA, itemB }: AggregatePerformanceChartProps) {
  const milestones = type === "gpu" ? GPU_MILESTONES : CPU_MILESTONES;
  const maxScore = milestones[milestones.length - 1].score;

  const pctA = Math.min(100, Math.max(3, Math.round((itemA.score / maxScore) * 100)));
  const pctB = Math.min(100, Math.max(3, Math.round((itemB.score / maxScore) * 100)));

  const winner = itemA.score > itemB.score ? "A" : itemB.score > itemA.score ? "B" : "Tie";
  const winnerName = winner === "A" ? itemA.name : itemB.name;
  const loserName = winner === "A" ? itemB.name : itemA.name;

  const minScore = Math.min(itemA.score, itemB.score);
  const maxCompScore = Math.max(itemA.score, itemB.score);
  const deltaPct = minScore > 0 ? Math.round(((maxCompScore - minScore) / minScore) * 100) : 0;

  return (
    <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Aggregate Telemetry Performance Score / 総合性能ベンチマーク
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-0.5">
            Comparative silicon throughput index measured against landmark hardware generations.
          </p>
        </div>
        <span className="text-[10px] font-black uppercase bg-purple-500/15 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 self-start sm:self-auto">
          Silicon Scale
        </span>
      </div>

      {/* Milestones Header Ruler */}
      <div className="relative w-full pt-6 pb-2">
        <div className="grid grid-cols-6 gap-1 w-full text-center border-b border-black/10 dark:border-white/10 pb-2">
          {milestones.map((ms, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[10px] font-black text-purple-500 dark:text-purple-400 font-mono">
                {ms.name}
              </span>
              <span className="text-[8px] font-bold text-gray-400 font-mono">{ms.score} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Stacked Progress Bars */}
      <div className="flex flex-col gap-5">
        {/* BAR A */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-2">
              <span className="text-[#1E2022] dark:text-white">{itemA.name}</span>
              <span className="text-[10px] text-gray-400 font-bold">({itemA.details})</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-sm font-black text-[#1E2022] dark:text-white">{itemA.score} pts</span>
              {winner === "A" && (
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  +{deltaPct}%
                </span>
              )}
            </div>
          </div>

          <div className="w-full h-7 bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden p-1 border border-black/10 dark:border-white/10 relative">
            <div
              className={`h-full rounded-lg transition-all duration-700 ease-out flex items-center justify-end px-3 font-mono text-[10px] font-black text-white ${
                winner === "A"
                  ? "bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 shadow-md"
                  : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-75"
              }`}
              style={{ width: `${pctA}%` }}
            >
              {pctA > 15 && <span>{pctA}% Apex</span>}
            </div>
          </div>
        </div>

        {/* BAR B */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-2">
              <span className="text-[#1E2022] dark:text-white">{itemB.name}</span>
              <span className="text-[10px] text-gray-400 font-bold">({itemB.details})</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-sm font-black text-[#1E2022] dark:text-white">{itemB.score} pts</span>
              {winner === "B" && (
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  +{deltaPct}%
                </span>
              )}
            </div>
          </div>

          <div className="w-full h-7 bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden p-1 border border-black/10 dark:border-white/10 relative">
            <div
              className={`h-full rounded-lg transition-all duration-700 ease-out flex items-center justify-end px-3 font-mono text-[10px] font-black text-white ${
                winner === "B"
                  ? "bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 shadow-md"
                  : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-75"
              }`}
              style={{ width: `${pctB}%` }}
            >
              {pctB > 15 && <span>{pctB}% Apex</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Verdict Banner */}
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-start gap-3 text-purple-900 dark:text-purple-200">
        <Trophy className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
        <div className="text-xs font-extrabold leading-relaxed">
          {winner !== "Tie" ? (
            <>
              <strong className="text-purple-600 dark:text-purple-300 font-black">{winnerName}</strong> outperforms{" "}
              <span className="text-gray-600 dark:text-gray-300">{loserName}</span> by an impressive{" "}
              <span className="text-emerald-500 font-black">+{deltaPct}%</span> based on our aggregate telemetry benchmark results.
            </>
          ) : (
            <>Both components deliver identical aggregate performance scores across our telemetry workload suite.</>
          )}
        </div>
      </div>
    </div>
  );
}
