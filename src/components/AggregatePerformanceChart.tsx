import { Sparkles, Trophy } from "lucide-react";
import gpus from "../data/gpus.json";
import cpus from "../data/cpus.json";

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

// Milestone card definitions with exact query strings for database lookup
const GPU_MILESTONE_DEFINITIONS = [
  { name: "GTX 750 Ti", query: "GTX 750 Ti", defaultScore: 55 },
  { name: "GTX 1060", query: "GTX 1060", defaultScore: 110 },
  { name: "RTX 2060", query: "RTX 2060", defaultScore: 142 },
  { name: "RTX 3070", query: "RTX 3070", defaultScore: 310 },
  { name: "RTX 4070S", query: "RTX 4070 Super", defaultScore: 440 },
  { name: "RTX 4080", query: "RTX 4080", defaultScore: 520 },
  { name: "RTX 4090", query: "RTX 4090", defaultScore: 740 },
];

const CPU_MILESTONE_DEFINITIONS = [
  { name: "i5-2500K", query: "2500K", defaultScore: 141, row: "top" },
  { name: "i5-10400", query: "10400", defaultScore: 440, row: "bottom" },
  { name: "R5 5600", query: "5600", defaultScore: 555, row: "top" },
  { name: "i7-12700K", query: "12700K", defaultScore: 957, row: "bottom" },
  { name: "7800X3D", query: "7800X3D", defaultScore: 1012, row: "top" },
  { name: "i7-14700K", query: "14700K", defaultScore: 1226, row: "bottom" },
  { name: "i9-14900K", query: "14900K", defaultScore: 1527, row: "top" },
];

export default function AggregatePerformanceChart({ type, itemA, itemB }: AggregatePerformanceChartProps) {
  // Dynamically resolve milestone scores from authentic JSON databases
  const rawMilestones = type === "gpu" ? GPU_MILESTONE_DEFINITIONS : CPU_MILESTONE_DEFINITIONS;
  const dbItems = type === "gpu" ? (gpus as any[]) : (cpus as any[]);

  const milestones = rawMilestones
    .map((ms) => {
      const match = dbItems.find((d) => d.name.toLowerCase().includes(ms.query.toLowerCase()));
      let score = ms.defaultScore;
      if (match) {
        if (type === "gpu") {
          score = match.relativePowerScore || ms.defaultScore;
        } else {
          if (match.singleCoreScore !== undefined && match.multiCoreScore !== undefined) {
            score = Math.round(match.singleCoreScore * 0.7 + (match.multiCoreScore / 2.5));
          } else {
            score = match.relativePowerScore || ms.defaultScore;
          }
        }
      }
      return { name: ms.name, score, row: (ms as any).row || "top" };
    })
    .sort((a, b) => a.score - b.score);

  // Winner candidate score defines 100% bar scale reference
  const winnerScore = Math.max(itemA?.score || 0, itemB?.score || 0, 1);

  // Exact percentage calculation relative to winner candidate (winner always fills 100%)
  const pctA = Math.min(100, Math.max(3, ((itemA?.score || 0) / winnerScore) * 100));
  const pctB = Math.min(100, Math.max(3, ((itemB?.score || 0) / winnerScore) * 100));

  const winner = itemA.score > itemB.score ? "A" : itemB.score > itemA.score ? "B" : "Tie";
  const winnerName = winner === "A" ? itemA.name : itemB.name;
  const loserName = winner === "A" ? itemB.name : itemA.name;

  const minScore = Math.min(itemA.score, itemB.score);
  const maxCompScore = Math.max(itemA.score, itemB.score);
  const deltaPct = minScore > 0 ? Math.round(((maxCompScore - minScore) / minScore) * 100) : 0;

  // Filter milestone ticks to those within range of winnerScore to prevent cluster clipping
  const activeMilestones = milestones
    .filter((ms) => ms.score <= winnerScore * 1.05)
    .map((ms) => ({
      ...ms,
      msPct: Math.min(96, Math.max(3, (ms.score / winnerScore) * 100))
    }));

  const topMilestones = activeMilestones.filter((ms, idx) => type === "gpu" ? idx % 2 === 0 : ms.row === "top");
  const bottomMilestones = activeMilestones.filter((ms, idx) => type === "gpu" ? idx % 2 === 1 : ms.row === "bottom");

  return (
    <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between gap-6 w-full min-h-[420px]">
      {/* Centered Main Title */}
      <div className="flex flex-col items-center justify-center text-center gap-1 border-b border-black/10 dark:border-white/10 pb-5 shrink-0">
        <h3 className="text-lg sm:text-xl font-black text-[#1E2022] dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E88D9F]" />
          Aggregate Telemetry Performance Matrix / 総合性能比較チャート
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
          Normalized throughput benchmark scale relative to historical silicon milestones.
        </p>
      </div>

      {/* CHART CONTAINER WITH LOCKED PIXEL WIDTH COORD SYSTEM */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2 w-full">
        {/* Fixed Width Left Component Titles Stack (w-44 shrink-0 prevents layout jumping) */}
        <div className="w-full sm:w-44 shrink-0 flex flex-col justify-around py-8 gap-6 min-w-44 max-w-44 pr-2">
          {/* Component A Title */}
          <div className="flex flex-col min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-[#1E2022] dark:text-white truncate">
              {itemA.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-black text-[#E88D9F] font-mono">
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
              <span className="text-xs font-black text-[#E88D9F] font-mono">
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

        {/* Right Shared Scale Container (h-[210px] fixed height) */}
        <div className="flex-1 relative flex flex-col justify-between py-2 h-[210px] min-w-0">
          {/* 1. TOP RULER ROW */}
          <div className="relative h-10 w-full z-10">
            {topMilestones.map((ms, idx) => (
              <div
                key={idx}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${ms.msPct}%` }}
              >
                <span className="text-[10px] font-black text-[#E88D9F] dark:text-[#E88D9F] font-mono whitespace-nowrap bg-[#E88D9F]/10 px-2.5 py-0.5 rounded-lg border border-[#E88D9F]/20 shadow-xs">
                  {ms.name}
                </span>
                <div className="w-px h-3 bg-[#E88D9F]/40 dark:bg-[#E88D9F]/40 mt-1" />
              </div>
            ))}
          </div>

          {/* 2. DUAL PROGRESS TRACKS (Optimal Height: h-9 sm:h-10, smooth Sakura/Sage gradient fills) */}
          <div className="flex flex-col gap-5 w-full z-10 my-3">
            {/* Track Capsule A */}
            <div className="w-full h-9 sm:h-10 bg-black/5 dark:bg-white/5 rounded-full p-1 border border-black/10 dark:border-white/10 relative shadow-inner flex items-center overflow-hidden">
              {/* Smooth Clean Sakura/Sage Gradient Filled Capsule */}
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out relative z-10 ${
                  winner === "A"
                    ? "bg-gradient-to-r from-[#E88D9F] via-[#8A9A86] to-emerald-400 shadow-md"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
                }`}
                style={{ width: `${pctA}%` }}
              />

              {/* Confined Dashed Vertical Lines ON TOP of Track A Fills */}
              <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden z-20">
                {activeMilestones.map((ms, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 w-px border-r border-dashed border-black/30 dark:border-white/60"
                    style={{ left: `${ms.msPct}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Track Capsule B */}
            <div className="w-full h-9 sm:h-10 bg-black/5 dark:bg-white/5 rounded-full p-1 border border-black/10 dark:border-white/10 relative shadow-inner flex items-center overflow-hidden">
              {/* Smooth Clean Sakura/Sage Gradient Filled Capsule */}
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out relative z-10 ${
                  winner === "B"
                    ? "bg-gradient-to-r from-[#E88D9F] via-[#8A9A86] to-emerald-400 shadow-md"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
                }`}
                style={{ width: `${pctB}%` }}
              />

              {/* Confined Dashed Vertical Lines ON TOP of Track B Fills */}
              <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden z-20">
                {activeMilestones.map((ms, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 w-px border-r border-dashed border-black/30 dark:border-white/60"
                    style={{ left: `${ms.msPct}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 3. BOTTOM RULER ROW */}
          <div className="relative h-8 w-full z-10">
            {bottomMilestones.map((ms, idx) => (
              <div
                key={idx}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${ms.msPct}%` }}
              >
                <div className="w-px h-3 bg-[#E88D9F]/40 dark:bg-[#E88D9F]/40 mb-1" />
                <span className="text-[10px] font-black text-[#8A9A86] dark:text-[#8A9A86] font-mono whitespace-nowrap bg-[#8A9A86]/10 px-2.5 py-0.5 rounded-lg border border-[#8A9A86]/20 shadow-xs">
                  {ms.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Verdict Banner (min-h-[64px] fixed container with Sakura Pink theme) */}
      <div className="p-4 bg-[#E88D9F]/10 border border-[#E88D9F]/20 rounded-2xl flex items-center gap-3 text-gray-900 dark:text-gray-100 shrink-0 min-h-[64px]">
        <Trophy className="w-5 h-5 text-[#E88D9F] shrink-0" />
        <div className="text-xs font-extrabold leading-relaxed">
          {winner !== "Tie" ? (
            <>
              <strong className="text-[#E88D9F] font-black">{winnerName}</strong> outperforms{" "}
              <span className="text-gray-600 dark:text-gray-400">{loserName}</span> by an impressive{" "}
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
