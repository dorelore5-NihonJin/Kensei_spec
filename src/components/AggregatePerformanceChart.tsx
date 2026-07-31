import { Sparkles, Trophy } from "lucide-react";
import gpus from "../data/gpus.json";
import cpus from "../data/cpus.json";
import { useLanguage } from "../context/LanguageContext";

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

// Milestone card definitions with exact query strings & exact names for authentic database lookup
const GPU_MILESTONE_DEFINITIONS = [
  { name: "GTX 750 Ti", exactName: "GeForce GTX 750 Ti", query: "GTX 750 Ti", defaultScore: 55 },
  { name: "GTX 1060", exactName: "GeForce GTX 1060", query: "GTX 1060", defaultScore: 110 },
  { name: "RTX 2060", exactName: "GeForce RTX 2060", query: "RTX 2060", defaultScore: 142 },
  { name: "RTX 3070", exactName: "GeForce RTX 3070", query: "RTX 3070", defaultScore: 310 },
  { name: "RTX 4070S", exactName: "GeForce RTX 4070 Super", query: "RTX 4070 Super", defaultScore: 440 },
  { name: "RTX 4080", exactName: "GeForce RTX 4080", query: "RTX 4080", defaultScore: 520 },
  { name: "RTX 4090", exactName: "GeForce RTX 4090", query: "RTX 4090", defaultScore: 740 },
];

const CPU_MILESTONE_DEFINITIONS = [
  { name: "i5-2500K", exactName: "Core i5-2500K", query: "2500K", defaultScore: 141, row: "top" },
  { name: "i5-10400", exactName: "Core i5-10400", query: "10400", defaultScore: 440, row: "bottom" },
  { name: "R5 5600", exactName: "Ryzen 5 5600", query: "5600", defaultScore: 555, row: "top" },
  { name: "i7-12700K", exactName: "Core i7-12700K", query: "12700K", defaultScore: 1250, row: "bottom" },
  { name: "7800X3D", exactName: "Ryzen 7 7800X3D", query: "7800X3D", defaultScore: 1350, row: "top" },
  { name: "i7-14700K", exactName: "Core i7-14700K", query: "14700K", defaultScore: 1720, row: "bottom" },
  { name: "i9-14900K", exactName: "Core i9-14900K", query: "14900K", defaultScore: 2100, row: "top" },
];

export default function AggregatePerformanceChart({ type, itemA, itemB }: AggregatePerformanceChartProps) {
  const { t } = useLanguage();

  // Dynamically resolve milestone scores from authentic JSON databases
  const rawMilestones = type === "gpu" ? GPU_MILESTONE_DEFINITIONS : CPU_MILESTONE_DEFINITIONS;
  const dbItems = type === "gpu" ? (gpus as any[]) : (cpus as any[]);

  // Absolute Global Consumer Hardware Hierarchy Max Scale (Static Anchor Reference)
  // GPU: RTX 5090 = 1000 pts (100%), RTX 4090 = 740 pts (74%)
  // CPU: Flagship Consumer Desktop Max Anchor = 2400 pts (100%), i9-14900K = 2100 pts (87.5%)
  const globalScaleMax = type === "gpu" ? 1000 : 2400;

  const milestones = rawMilestones
    .map((ms: any) => {
      const match = dbItems.find((d: any) => {
        if (ms.exactName) {
          return d.name.toLowerCase() === ms.exactName.toLowerCase();
        }
        return (
          d.name.toLowerCase() === ms.query.toLowerCase() ||
          d.name.toLowerCase().includes(ms.query.toLowerCase())
        );
      });
      let score = ms.defaultScore;
      if (match) {
        if (type === "gpu") {
          score = match.relativePowerScore || ms.defaultScore;
        } else {
          score = match.overallPerformanceScore || match.relativePowerScore || ms.defaultScore;
        }
      }
      return { name: ms.name, score, row: ms.row || "top" };
    })
    .sort((a: any, b: any) => a.score - b.score);

  // Exact percentage calculation relative to Global Hardware Scale
  const pctA = Math.min(98, Math.max(3, ((itemA?.score || 0) / globalScaleMax) * 100));
  const pctB = Math.min(98, Math.max(3, ((itemB?.score || 0) / globalScaleMax) * 100));

  const winner = itemA.score > itemB.score ? "A" : itemB.score > itemA.score ? "B" : "Tie";
  const winnerName = winner === "A" ? itemA.name : itemB.name;
  const loserName = winner === "A" ? itemB.name : itemA.name;

  const minScore = Math.min(itemA.score, itemB.score);
  const maxCompScore = Math.max(itemA.score, itemB.score);
  const deltaPct = minScore > 0 ? Math.round(((maxCompScore - minScore) / minScore) * 100) : 0;

  // Active milestones mapped cleanly across the static global ruler
  const activeMilestones = milestones.map((ms: any) => ({
    ...ms,
    msPct: Math.min(98, Math.max(3, (ms.score / globalScaleMax) * 100))
  }));

  const topMilestones = activeMilestones.filter((ms: any, idx: number) => type === "gpu" ? idx % 2 === 0 : ms.row === "top");
  const bottomMilestones = activeMilestones.filter((ms: any, idx: number) => type === "gpu" ? idx % 2 === 1 : ms.row === "bottom");

  return (
    <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between gap-6 w-full min-h-[420px]">
      {/* Centered Main Title */}
      <div className="flex flex-col items-center justify-center text-center gap-1 border-b border-black/10 dark:border-white/10 pb-5 shrink-0">
        <h3 className="text-lg sm:text-xl font-black text-[#1E2022] dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#E88D9F]" />
          {t("chart.telemetry_title")}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
          {t("chart.telemetry_subtitle")}
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

          {/* 2. CENTER BARS CONTAINER */}
          <div className="relative w-full h-24 flex flex-col justify-around my-auto">
            {/* Bar A */}
            <div className="w-full h-8 bg-black/10 dark:bg-white/10 rounded-2xl p-1 relative flex items-center overflow-hidden">
              <div
                className={`h-full rounded-xl transition-all duration-700 ease-out relative z-10 ${
                  winner === "A"
                    ? "bg-gradient-to-r from-[#E88D9F] via-[#8A9A86] to-emerald-400 shadow-md"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
                }`}
                style={{ width: `${pctA}%` }}
              />
            </div>

            {/* Bar B */}
            <div className="w-full h-8 bg-black/10 dark:bg-white/10 rounded-2xl p-1 relative flex items-center overflow-hidden">
              <div
                className={`h-full rounded-xl transition-all duration-700 ease-out relative z-10 ${
                  winner === "B"
                    ? "bg-gradient-to-r from-[#E88D9F] via-[#8A9A86] to-emerald-400 shadow-md"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
                }`}
                style={{ width: `${pctB}%` }}
              />
            </div>

            {/* Vertical Milestone Guide Lines Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {activeMilestones.map((ms: any, idx: number) => (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 w-px border-r border-dashed border-black/30 dark:border-white/60"
                  style={{ left: `${ms.msPct}%` }}
                />
              ))}
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
              <strong className="text-[#E88D9F] font-black">{winnerName}</strong>{" "}
              {String(t("chart.outperforms_text") || "outperforms {loser} by {delta}%")
                .replace("{loser}", loserName)
                .replace("{delta}", String(deltaPct))}
            </>
          ) : (
            <>{t("chart.identical_text")}</>
          )}
        </div>
      </div>
    </div>
  );
}
