import { useMemo } from "react";
import type { CPU, GPU, RAMProfile, Game, StorageType } from "../lib/types";
import { calculatePerformance } from "../lib/calculator";
import { ArrowUpRight, TrendingUp, Sparkles, HelpCircle } from "lucide-react";

interface UpgradeAdvisorProps {
  selectedCpu: CPU | null;
  selectedGpu: GPU | null;
  selectedRam: RAMProfile | null;
  selectedStorage: StorageType;
  selectedGame: Game;
  selectedResolution: "1080p" | "1440p" | "4K";
  selectedPreset: "Low" | "Medium" | "High" | "Ultra";
  selectedDlss: "Off" | "Quality" | "Performance";
  rayTracing: "Off" | "Medium" | "Ultra";
  frameGen: boolean;
  ramChannel: "Single" | "Dual";
  bottleneckType: "None" | "CPU" | "GPU" | "RAM" | "Storage";
  currentFps: number;
  cpus: CPU[];
  gpus: GPU[];
}

export default function UpgradeAdvisor({
  selectedCpu,
  selectedGpu,
  selectedRam,
  selectedStorage,
  selectedGame,
  selectedResolution,
  selectedPreset,
  selectedDlss,
  rayTracing,
  frameGen,
  ramChannel,
  bottleneckType,
  currentFps,
  cpus,
  gpus
}: UpgradeAdvisorProps) {
  const isComplete = selectedCpu && selectedGpu && selectedRam;

  // Live calculation of the absolute best, most optimal upgrade candidate
  const upgradeRecommendation = useMemo(() => {
    if (!isComplete || bottleneckType === "None" || currentFps <= 0) return null;

    if (bottleneckType === "CPU") {
      // Find the CPU of the same brand that unlocks +30% average FPS, with the lowest score
      const currentBrand = selectedCpu.manufacturer;
      const candidates = cpus.filter(
        (c) => c.manufacturer === currentBrand && c.id !== selectedCpu.id
      );

      let bestUpgrade: CPU | null = null;
      let lowestEnrichingScore = Infinity;
      let bestUpgradeFps = 0;

      for (const candidate of candidates) {
        // Run performance simulator with this candidate CPU
        const res = calculatePerformance(
          candidate,
          selectedGpu,
          selectedRam,
          selectedStorage,
          selectedGame,
          selectedResolution,
          selectedPreset,
          selectedDlss,
          rayTracing,
          frameGen,
          ramChannel
        );

        const pctIncrease = ((res.averageFps - currentFps) / currentFps) * 100;
        if (pctIncrease >= 30) {
          const scoreMetric = candidate.singleCoreScore * 1.5 + candidate.multiCoreScore * 0.5;
          if (scoreMetric < lowestEnrichingScore) {
            lowestEnrichingScore = scoreMetric;
            bestUpgrade = candidate;
            bestUpgradeFps = res.averageFps;
          }
        }
      }

      // Fallback: if no CPU reaches +30%, find the one with the highest overall FPS in the list
      if (!bestUpgrade) {
        let maxFps = 0;
        for (const candidate of candidates) {
          const res = calculatePerformance(
            candidate,
            selectedGpu,
            selectedRam,
            selectedStorage,
            selectedGame,
            selectedResolution,
            selectedPreset,
            selectedDlss,
            rayTracing,
            frameGen,
            ramChannel
          );
          if (res.averageFps > maxFps) {
            maxFps = res.averageFps;
            bestUpgrade = candidate;
            bestUpgradeFps = res.averageFps;
          }
        }
      }

      if (bestUpgrade && bestUpgradeFps > currentFps) {
        return {
          type: "CPU",
          currentName: selectedCpu.name,
          suggestedName: bestUpgrade.name,
          details: `${bestUpgrade.cores} Cores / ${bestUpgrade.threads} Threads • Socket ${bestUpgrade.socket} • L3 Cache ${bestUpgrade.l3CacheMB}MB`,
          currentFps,
          newFps: bestUpgradeFps,
          pctBoost: Math.round(((bestUpgradeFps - currentFps) / currentFps) * 100)
        };
      }
    }

    if (bottleneckType === "GPU") {
      // Find the nearest GPU of the same brand (or any) that unlocks +30% average FPS
      const currentBrand = selectedGpu.manufacturer;
      const candidates = gpus.filter(
        (g) => g.manufacturer === currentBrand && g.id !== selectedGpu.id
      );

      let bestUpgrade: GPU | null = null;
      let lowestEnrichingScore = Infinity;
      let bestUpgradeFps = 0;

      for (const candidate of candidates) {
        const res = calculatePerformance(
          selectedCpu,
          candidate,
          selectedRam,
          selectedStorage,
          selectedGame,
          selectedResolution,
          selectedPreset,
          selectedDlss,
          rayTracing,
          frameGen,
          ramChannel
        );

        const pctIncrease = ((res.averageFps - currentFps) / currentFps) * 100;
        if (pctIncrease >= 30) {
          if (candidate.relativePowerScore < lowestEnrichingScore) {
            lowestEnrichingScore = candidate.relativePowerScore;
            bestUpgrade = candidate;
            bestUpgradeFps = res.averageFps;
          }
        }
      }

      // Fallback: pick the absolute best performing GPU of the same manufacturer
      if (!bestUpgrade) {
        let maxFps = 0;
        for (const candidate of candidates) {
          const res = calculatePerformance(
            selectedCpu,
            candidate,
            selectedRam,
            selectedStorage,
            selectedGame,
            selectedResolution,
            selectedPreset,
            selectedDlss,
            rayTracing,
            frameGen,
            ramChannel
          );
          if (res.averageFps > maxFps) {
            maxFps = res.averageFps;
            bestUpgrade = candidate;
            bestUpgradeFps = res.averageFps;
          }
        }
      }

      if (bestUpgrade && bestUpgradeFps > currentFps) {
        return {
          type: "GPU",
          currentName: selectedGpu.name,
          suggestedName: bestUpgrade.name,
          details: `${bestUpgrade.vramGB}GB VRAM • Architecture: ${bestUpgrade.architecture} • TDP: ${bestUpgrade.tdpW}W`,
          currentFps,
          newFps: bestUpgradeFps,
          pctBoost: Math.round(((bestUpgradeFps - currentFps) / currentFps) * 100)
        };
      }
    }

    return null;
  }, [
    isComplete,
    bottleneckType,
    currentFps,
    cpus,
    gpus,
    selectedCpu,
    selectedGpu,
    selectedRam,
    selectedStorage,
    selectedGame,
    selectedResolution,
    selectedPreset,
    selectedDlss,
    rayTracing,
    frameGen,
    ramChannel
  ]);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/5 dark:border-white/10 shadow-lg flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold flex items-center gap-2 text-dark-accent dark:text-white">
          <TrendingUp className="w-4 h-4 text-sakura-pink" />
          Optimal Upgrade Advisor / 推奨アップグレード
        </h3>
        <span className="text-[10px] bg-sakura-pink/10 text-sakura-pink dark:bg-sakura-pink/20 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
          Advisor
        </span>
      </div>

      {!isComplete ? (
        <div className="p-4 bg-gray-50 dark:bg-[#121315]/50 border border-gray-100 dark:border-white/5 rounded-2xl text-center text-xs text-gray-400 font-bold py-8">
          💡 Setup your current hardware configuration to unlock upgrade predictions.
        </div>
      ) : bottleneckType === "None" ? (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/25 rounded-2xl flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <div className="text-xs text-emerald-800 dark:text-emerald-400 font-bold">
            All systems balanced! No CPU or GPU hardware bottlenecks detected. No upgrade is currently critical.
          </div>
        </div>
      ) : upgradeRecommendation ? (
        <div className="flex flex-col gap-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
            Your system is currently bound by the <span className="font-extrabold text-sakura-pink">{upgradeRecommendation.type}</span>. Upgrading to the following target configuration will resolve the bottleneck and deliver a massive framerate leap:
          </div>

          <div className="p-4 bg-sakura-pink/5 dark:bg-sakura-pink/10 border border-sakura-pink/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="text-[10px] text-sakura-pink font-black uppercase tracking-wider mb-1">Suggested Upgrade Tier</div>
              <h4 className="text-sm font-black text-dark-accent dark:text-white flex items-center gap-2">
                {upgradeRecommendation.suggestedName}
                <ArrowUpRight className="w-4 h-4 text-sakura-pink" />
              </h4>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold mt-0.5">{upgradeRecommendation.details}</p>
            </div>

            <div className="bg-sakura-pink/10 dark:bg-sakura-pink/20 px-3.5 py-2 rounded-xl text-center min-w-[90px] self-stretch sm:self-auto flex flex-col justify-center">
              <span className="text-xs font-black text-sakura-pink uppercase">Unlock Boost</span>
              <span className="text-base font-black text-sakura-pink">+{upgradeRecommendation.pctBoost}% FPS</span>
            </div>
          </div>

          {/* Upgrade Framerate comparison bar */}
          <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] p-3.5 rounded-2xl flex justify-between items-center text-xs">
            <div>
              <span className="text-gray-400 dark:text-gray-500 block font-bold uppercase tracking-wider text-[9px]">Current Framerate</span>
              <span className="text-sm font-extrabold text-gray-500">{upgradeRecommendation.currentFps} FPS</span>
            </div>
            <div className="h-6 w-px bg-black/[0.08] dark:bg-white/[0.08]" />
            <div className="text-right">
              <span className="text-sakura-pink block font-bold uppercase tracking-wider text-[9px]">Upgraded Framerate</span>
              <span className="text-sm font-extrabold text-sakura-pink">{upgradeRecommendation.newFps} FPS</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/25 rounded-2xl flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          <div className="text-xs text-amber-800 dark:text-amber-400 font-semibold">
            We couldn't locate a single CPU/GPU of the same brand that delivers a +30% performance boost. You may already be at the pinnacle of this generation!
          </div>
        </div>
      )}
    </div>
  );
}
