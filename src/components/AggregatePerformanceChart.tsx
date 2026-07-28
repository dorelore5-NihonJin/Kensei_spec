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
  // Use clean fixed milestone array to prevent label overlap collisions
  const milestones = type === "gpu" ? GPU_MILESTONES : CPU_MILESTONES;
  const maxScore = milestones[milestones.length - 1].score;

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

      {/* Main Chart Section */}
      <div className="flex flex-col gap-6 pt-2">
        {/* Top Milestone Ruler Row */}
        <div className="flex items-end">
          {/* Left spacer matching left title card width */}
          <div className="w-44 sm:w-52 shrink-0 hidden sm:block" />

          {/* Right Ruler Container (Stretches 100% over the tracks) */}
          <div className="flex-1 relative h-14">
            {milestones.map((ms, idx) => {
              const msPct = Math.round((ms.score / maxScore) * 100);
              return (
                <div
                  key={idx}
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-10"
                  style={{ left: `${msPct}%` }}
                >
                  <span className="text-[10px] font-black text-purple-600 dark:text-purple-300 font-mono whitespace-nowrap bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 shadow-xs">
                    {ms.name}
                  </span>
                  <span className="text-[8px] font-extrabold text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                    {ms.score} pts
                  </span>
                  {/* Vertical tick line extending downwards */}
                  <div className="w-px h-5 bg-black/15 dark:bg-white/20 mt-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* BAR A ROW */}
        <div className="flex items-center gap-3 relative">
          {/* Left Component Title & Score Card */}
          <div className="w-44 sm:w-52 shrink-0 flex flex-col min-w-0 pr-2">
            <h4 className="text-xs sm:text-sm font-black text-[#1E2022] dark:text-white truncate">
              {itemA.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
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

          {/* Right Track Scale Container (Full Width) */}
          <div className="flex-1 relative h-7 min-w-0">
            {/* Dashed vertical milestone guide lines passing strictly inside the track column */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {milestones.map((ms, idx) => {
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

            {/* Track Capsule A */}
            <div className="w-full h-full bg-black/5 dark:bg-white/5 rounded-full p-0.5 border border-black/10 dark:border-white/10 relative shadow-inner flex items-center">
              {/* Filled Slider Bar - Ends exactly at terminal point without trailing overflow */}
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                  winner === "A"
                    ? "bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 shadow-md"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
                }`}
                style={{ width: `${pctA}%` }}
              >
                {/* Terminal Circular Pin Knob centered flush at the exact right tip */}
                <div
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full border-2 shadow-md flex items-center justify-center z-20 ${
                    winner === "A"
                      ? "bg-emerald-400 border-white dark:border-[#1A1C1E]"
                      : "bg-gray-300 dark:bg-gray-600 border-white dark:border-[#1A1C1E]"
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BAR B ROW */}
        <div className="flex items-center gap-3 relative">
          {/* Left Component Title & Score Card */}
          <div className="w-44 sm:w-52 shrink-0 flex flex-col min-w-0 pr-2">
            <h4 className="text-xs sm:text-sm font-black text-[#1E2022] dark:text-white truncate">
              {itemB.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
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

          {/* Right Track Scale Container (Full Width) */}
          <div className="flex-1 relative h-7 min-w-0">
            {/* Dashed vertical milestone guide lines passing strictly inside the track column */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {milestones.map((ms, idx) => {
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

            {/* Track Capsule B */}
            <div className="w-full h-full bg-black/5 dark:bg-white/5 rounded-full p-0.5 border border-black/10 dark:border-white/10 relative shadow-inner flex items-center">
              {/* Filled Slider Bar - Ends exactly at terminal point without trailing overflow */}
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                  winner === "B"
                    ? "bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 shadow-md"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
                }`}
                style={{ width: `${pctB}%` }}
              >
                {/* Terminal Circular Pin Knob centered flush at the exact right tip */}
                <div
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full border-2 shadow-md flex items-center justify-center z-20 ${
                    winner === "B"
                      ? "bg-emerald-400 border-white dark:border-[#1A1C1E]"
                      : "bg-gray-300 dark:bg-gray-600 border-white dark:border-[#1A1C1E]"
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
                </div>
              </div>
            </div>
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
