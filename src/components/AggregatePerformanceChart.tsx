import { Sparkles, Trophy } from "lucide-react";

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
  { name: "GTX 750 Ti", score: 55 },
  { name: "GTX 1060", score: 110 },
  { name: "RTX 2060", score: 185 },
  { name: "RTX 3070", score: 310 },
  { name: "RTX 4080", score: 520 },
];

const CPU_MILESTONES = [
  { name: "Pentium 4", score: 11 },
  { name: "Core 2 Duo", score: 45 },
  { name: "i7-3770K", score: 65 },
  { name: "i5-10400", score: 125 },
  { name: "Ryzen 5600", score: 185 },
  { name: "i5-13600K", score: 250 },
];

export default function AggregatePerformanceChart({ type, itemA, itemB }: AggregatePerformanceChartProps) {
  const milestones = type === "gpu" ? GPU_MILESTONES : CPU_MILESTONES;
  // Maximum scale benchmark score (310 pts for CPU apex, 520 pts for GPU milestone scale)
  const maxScore = type === "gpu" ? 520 : 310;

  // Exact percentage calculation relative to max scale
  const pctA = Math.max(0.5, (itemA.score / maxScore) * 100);
  const pctB = Math.max(0.5, (itemB.score / maxScore) * 100);

  const winner = itemA.score > itemB.score ? "A" : itemB.score > itemA.score ? "B" : "Tie";
  const winnerName = winner === "A" ? itemA.name : itemB.name;
  const loserName = winner === "A" ? itemB.name : itemA.name;

  const minScore = Math.min(itemA.score, itemB.score);
  const maxCompScore = Math.max(itemA.score, itemB.score);
  const deltaPct = minScore > 0 ? Math.round(((maxCompScore - minScore) / minScore) * 100) : 0;

  // Stagger milestones: even index -> top, odd index -> bottom
  const topMilestones = milestones.filter((_, idx) => idx % 2 === 0);
  const bottomMilestones = milestones.filter((_, idx) => idx % 2 === 1);

  return (
    <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
      {/* Centered Main Title */}
      <div className="flex flex-col items-center justify-center text-center gap-1 border-b border-black/10 dark:border-white/10 pb-5">
        <h3 className="text-lg sm:text-xl font-black text-[#1E2022] dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Aggregate Telemetry Performance Matrix / 総合性能比較チャート
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
          Normalized throughput benchmark scale relative to historical silicon milestones.
        </p>
      </div>

      {/* CHART CONTAINER WITH UNIFIED COORD SYSTEM */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-2">
        {/* Left Component Titles Stack */}
        <div className="w-full sm:w-44 shrink-0 flex flex-col justify-around py-10 gap-6 min-w-0 pr-2">
          {/* Component A Title */}
          <div className="flex flex-col min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-[#1E2022] dark:text-white truncate">
              {itemA.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-black text-purple-600 dark:text-purple-400 font-mono">
                {itemA.score} pts
              </span>
              {winner === "A" && (
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  +{deltaPct}%
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5">{itemA.details}</p>
          </div>

          {/* Component B Title */}
          <div className="flex flex-col min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-[#1E2022] dark:text-white truncate">
              {itemB.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-black text-purple-600 dark:text-purple-400 font-mono">
                {itemB.score} pts
              </span>
              {winner === "B" && (
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  +{deltaPct}%
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5">{itemB.details}</p>
          </div>
        </div>

        {/* Right Shared Scale Container */}
        <div className="flex-1 relative flex flex-col justify-between py-2 min-h-[200px]">
          {/* 1. TOP RULER ROW (Even Indices) */}
          <div className="relative h-10 w-full z-10">
            {topMilestones.map((ms, idx) => {
              const msPct = (ms.score / maxScore) * 100;
              return (
                <div
                  key={idx}
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${msPct}%` }}
                >
                  <span className="text-[10px] font-black text-purple-600 dark:text-purple-300 font-mono whitespace-nowrap bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 shadow-xs">
                    {ms.name} ({ms.score} pts)
                  </span>
                  <div className="w-px h-3 bg-purple-500/40 dark:bg-purple-400/40 mt-1" />
                </div>
              );
            })}
          </div>

          {/* 2. DUAL PROGRESS TRACKS (Dashed lines CONFINED strictly INSIDE the track bars only) */}
          <div className="flex flex-col gap-6 w-full z-10 my-4">
            {/* Track Capsule A */}
            <div className="w-full h-8 bg-black/5 dark:bg-white/5 rounded-full p-1 border border-black/10 dark:border-white/10 relative shadow-inner flex items-center overflow-visible">
              {/* Confined Dashed Vertical Lines INSIDE Track A */}
              <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
                {milestones.map((ms, idx) => {
                  const msPct = (ms.score / maxScore) * 100;
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 w-px border-r border-dashed border-black/15 dark:border-white/15"
                      style={{ left: `${msPct}%` }}
                    />
                  );
                })}
              </div>

              {/* Filled Slider Bar */}
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-0.5 relative ${
                  winner === "A"
                    ? "bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 shadow-md"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
                }`}
                style={{ width: `${pctA}%` }}
              >
                {/* Integrated Terminal Cap Knob */}
                <div
                  className={`w-5 h-5 rounded-full bg-white dark:bg-[#1A1C1E] border-2 shadow-sm flex items-center justify-center shrink-0 ${
                    winner === "A" ? "border-emerald-400" : "border-gray-400"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      winner === "A" ? "bg-emerald-400" : "bg-gray-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Track Capsule B */}
            <div className="w-full h-8 bg-black/5 dark:bg-white/5 rounded-full p-1 border border-black/10 dark:border-white/10 relative shadow-inner flex items-center overflow-visible">
              {/* Confined Dashed Vertical Lines INSIDE Track B */}
              <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
                {milestones.map((ms, idx) => {
                  const msPct = (ms.score / maxScore) * 100;
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 w-px border-r border-dashed border-black/15 dark:border-white/15"
                      style={{ left: `${msPct}%` }}
                    />
                  );
                })}
              </div>

              {/* Filled Slider Bar */}
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-0.5 relative ${
                  winner === "B"
                    ? "bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 shadow-md"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
                }`}
                style={{ width: `${pctB}%` }}
              >
                {/* Integrated Terminal Cap Knob */}
                <div
                  className={`w-5 h-5 rounded-full bg-white dark:bg-[#1A1C1E] border-2 shadow-sm flex items-center justify-center shrink-0 ${
                    winner === "B" ? "border-emerald-400" : "border-gray-400"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      winner === "B" ? "bg-emerald-400" : "bg-gray-400"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. BOTTOM RULER ROW (Odd Indices) */}
          <div className="relative h-8 w-full z-10">
            {bottomMilestones.map((ms, idx) => {
              const msPct = (ms.score / maxScore) * 100;
              return (
                <div
                  key={idx}
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${msPct}%` }}
                >
                  <div className="w-px h-3 bg-purple-500/40 dark:bg-purple-400/40 mb-1" />
                  <span className="text-[10px] font-black text-purple-600 dark:text-purple-300 font-mono whitespace-nowrap bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 shadow-xs">
                    {ms.name} ({ms.score} pts)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Verdict Banner */}
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-start gap-3 text-purple-900 dark:text-purple-200 mt-2">
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
