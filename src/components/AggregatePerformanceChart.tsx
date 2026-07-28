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
  { name: "14900KS", score: 450 },
];

export default function AggregatePerformanceChart({ type, itemA, itemB }: AggregatePerformanceChartProps) {
  // Static milestone array
  const baseMilestones = type === "gpu" ? GPU_MILESTONES : CPU_MILESTONES;

  // Insert dynamically selected items A and B if they are missing from milestones
  const allPoints = [...baseMilestones];
  if (!allPoints.some((m) => m.name.toLowerCase() === itemA.name.toLowerCase())) {
    allPoints.push({ name: itemA.name, score: itemA.score });
  }
  if (!allPoints.some((m) => m.name.toLowerCase() === itemB.name.toLowerCase())) {
    allPoints.push({ name: itemB.name, score: itemB.score });
  }

  // Sort milestones chronologically/by score
  allPoints.sort((a, b) => a.score - b.score);
  const maxScore = Math.max(allPoints[allPoints.length - 1].score, 100);

  const pctA = Math.min(100, Math.max(1.5, Math.round((itemA.score / maxScore) * 100)));
  const pctB = Math.min(100, Math.max(1.5, Math.round((itemB.score / maxScore) * 100)));

  const winner = itemA.score > itemB.score ? "A" : itemB.score > itemA.score ? "B" : "Tie";
  const winnerName = winner === "A" ? itemA.name : itemB.name;
  const loserName = winner === "A" ? itemB.name : itemA.name;

  const minScore = Math.min(itemA.score, itemB.score);
  const maxCompScore = Math.max(itemA.score, itemB.score);
  const deltaPct = minScore > 0 ? Math.round(((maxCompScore - minScore) / minScore) * 100) : 0;

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

      {/* Main Chart Container */}
      <div className="flex flex-col gap-4 relative pt-4">
        {/* Top Milestone Ruler */}
        <div className="relative w-full h-14">
          {allPoints.map((ms, idx) => {
            const msPct = Math.round((ms.score / maxScore) * 100);
            const isMatchA = ms.name.toLowerCase() === itemA.name.toLowerCase();
            const isMatchB = ms.name.toLowerCase() === itemB.name.toLowerCase();
            const isMatch = isMatchA || isMatchB;

            return (
              <div
                key={idx}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-10 transition-all duration-300"
                style={{ left: `${msPct}%` }}
              >
                <span
                  className={`text-[10px] font-black font-mono whitespace-nowrap px-2 py-0.5 rounded-md border shadow-xs ${
                    isMatch
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40 font-black scale-105"
                      : "bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20"
                  }`}
                >
                  {ms.name}
                </span>
                <span className="text-[8px] font-extrabold text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                  {ms.score} pts
                </span>
                {/* Vertical tick extending downwards to tracks */}
                <div className="w-px h-5 bg-black/15 dark:bg-white/20 mt-1" />
              </div>
            );
          })}
        </div>

        {/* Dual Track Container with Background Grid Lines */}
        <div className="relative flex flex-col gap-6 pt-2">
          {/* Vertical dashed guide lines extending across tracks */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {allPoints.map((ms, idx) => {
              const msPct = Math.round((ms.score / maxScore) * 100);
              return (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 w-px border-r border-dashed border-black/10 dark:border-white/10"
                  style={{ left: `${msPct}%` }}
                />
              );
            })}
          </div>

          {/* BAR A */}
          <div className="grid grid-cols-12 items-center gap-4 relative z-10">
            {/* Left Label */}
            <div className="col-span-4 sm:col-span-3 flex flex-col min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-[#1E2022] dark:text-white truncate">
                {itemA.name}
              </h4>
              <p className="text-[10px] text-gray-400 font-bold truncate">{itemA.details}</p>
            </div>

            {/* Track A */}
            <div className="col-span-8 sm:col-span-9 flex items-center gap-3">
              <div className="w-full h-8 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden p-1 border border-black/10 dark:border-white/10 relative shadow-inner flex items-center">
                {/* Filled Bar */}
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end px-1.5 relative ${
                    winner === "A"
                      ? "bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 shadow-md"
                      : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
                  }`}
                  style={{ width: `${pctA}%` }}
                >
                  {/* Circular Node Knob */}
                  <div className="w-5 h-5 rounded-full bg-white/30 dark:bg-black/30 border border-white/60 backdrop-blur-md shrink-0 shadow-sm" />
                </div>
              </div>

              {/* Score & Badge on Right */}
              <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs">
                <span className="font-black text-[#1E2022] dark:text-white">{itemA.score} pts</span>
                {winner === "A" && (
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    +{deltaPct}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* BAR B */}
          <div className="grid grid-cols-12 items-center gap-4 relative z-10">
            {/* Left Label */}
            <div className="col-span-4 sm:col-span-3 flex flex-col min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-[#1E2022] dark:text-white truncate">
                {itemB.name}
              </h4>
              <p className="text-[10px] text-gray-400 font-bold truncate">{itemB.details}</p>
            </div>

            {/* Track B */}
            <div className="col-span-8 sm:col-span-9 flex items-center gap-3">
              <div className="w-full h-8 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden p-1 border border-black/10 dark:border-white/10 relative shadow-inner flex items-center">
                {/* Filled Bar */}
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end px-1.5 relative ${
                    winner === "B"
                      ? "bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 shadow-md"
                      : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
                  }`}
                  style={{ width: `${pctB}%` }}
                >
                  {/* Circular Node Knob */}
                  <div className="w-5 h-5 rounded-full bg-white/30 dark:bg-black/30 border border-white/60 backdrop-blur-md shrink-0 shadow-sm" />
                </div>
              </div>

              {/* Score & Badge on Right */}
              <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs">
                <span className="font-black text-[#1E2022] dark:text-white">{itemB.score} pts</span>
                {winner === "B" && (
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    +{deltaPct}%
                  </span>
                )}
              </div>
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
