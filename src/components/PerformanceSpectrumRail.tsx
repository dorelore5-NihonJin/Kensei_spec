import { Sparkles, Flame } from "lucide-react";

interface PerformanceSpectrumRailProps {
  type: "cpu" | "gpu";
  name: string;
  score: number;
}

const GPU_MILESTONES = [
  { name: "GTX 980", score: 120, label: "Legacy" },
  { name: "GTX 1660", score: 145, label: "Entry" },
  { name: "RTX 2060", score: 185, label: "Mid Tier" },
  { name: "RTX 3070", score: 310, label: "High Tier" },
  { name: "RTX 4080", score: 520, label: "Enthusiast" },
  { name: "RTX 5090", score: 980, label: "Apex Top ⚡" },
];

const CPU_MILESTONES = [
  { name: "i5-3570K", score: 45, label: "Legacy" },
  { name: "i7-7700K", score: 75, label: "Entry" },
  { name: "Ryzen 3600", score: 110, label: "Mid Tier" },
  { name: "i5-13400", score: 185, label: "High Tier" },
  { name: "7800X3D", score: 310, label: "Gaming King" },
  { name: "14900KS / 285K", score: 450, label: "Apex Top ⚡" },
];

export default function PerformanceSpectrumRail({ type, name, score }: PerformanceSpectrumRailProps) {
  const milestones = type === "gpu" ? GPU_MILESTONES : CPU_MILESTONES;
  const maxScore = milestones[milestones.length - 1].score;

  // Percentage along spectrum (min 6%, max 100%)
  const percentage = Math.min(100, Math.max(6, Math.round((score / maxScore) * 100)));

  let tierLabel = "Budget Tier";
  if (percentage > 85) tierLabel = "Ultra Apex Flagship";
  else if (percentage > 65) tierLabel = "Enthusiast Tier";
  else if (percentage > 45) tierLabel = "High Performance Tier";
  else if (percentage > 25) tierLabel = "Mainstream Gaming Tier";

  return (
    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-3">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider">
            {type === "gpu" ? "GPU Architecture Tier Spectrum" : "CPU Throughput Tier Spectrum"}
          </span>
        </div>
        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
          {tierLabel} ({percentage}% Apex)
        </span>
      </div>

      {/* Main Visual Rail Track */}
      <div className="relative w-full my-4">
        {/* Track Background Line */}
        <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Selected Component Marker Pin */}
        <div
          className="absolute -top-3 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
          style={{ left: `${percentage}%` }}
        >
          <div className="bg-purple-600 text-white font-black text-[9px] px-2 py-0.5 rounded-md shadow-lg border border-purple-300/40 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
            <span>{name}</span>
          </div>
          <div className="w-2 h-2 bg-purple-600 rotate-45 -mt-1 shadow-md" />
        </div>
      </div>

      {/* Milestone Reference Ticks Bar */}
      <div className="grid grid-cols-6 gap-1 text-center pt-1 border-t border-black/5 dark:border-white/5">
        {milestones.map((ms, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 truncate w-full">
              {ms.name}
            </span>
            <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase truncate">
              {ms.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
