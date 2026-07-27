import type { CPU, GPU, RAMProfile, Game, StorageType, CalculationResult, CompatibilityReport } from "./types";

/**
 * Checks CPU, GPU, RAM, Storage compatibility and returns reports.
 */
export function getCompatibilityReport(
  cpu: CPU | null,
  gpu: GPU | null,
  ramProfile: RAMProfile | null,
  storage: StorageType
): CompatibilityReport {
  const warnings: string[] = [];
  const mismatches: string[] = [];
  let psuRecommendationW = 400;

  if (cpu && gpu) {
    // Generational mismatch check (e.g. pairing a 2008 CPU with a 2025 GPU or vice versa)
    const yearDiff = Math.abs(cpu.releaseYear - gpu.releaseYear);
    if (yearDiff >= 10) {
      mismatches.push(
        `⚠️ Generational Mismatch: Pairing a ${cpu.releaseYear} CPU (${cpu.name}) with a ${gpu.releaseYear} GPU (${gpu.name}) may result in highly unbalanced performance.`
      );
    } else if (yearDiff >= 6) {
      warnings.push(
        `💡 Generational Unbalance: There is a ${yearDiff}-year difference between your CPU (${cpu.releaseYear}) and GPU (${gpu.releaseYear}).`
      );
    }

    // PSU recommendation
    psuRecommendationW = Math.max(gpu.recommendedPsuW + 100, 450);
  }

  if (cpu && ramProfile) {
    // RAM generation strictly filtered by CPU support
    if (!cpu.supportedDdr.includes(ramProfile.generation)) {
      mismatches.push(
        `❌ RAM Compatibility Error: ${cpu.name} does not support ${ramProfile.generation}. Supported: ${cpu.supportedDdr.join(", ")}.`
      );
    }
  }

  if (ramProfile) {
    if (ramProfile.capacityGB < 8) {
      warnings.push(
        `⚠️ Low RAM capacity: ${ramProfile.capacityGB}GB is extremely low for any modern workload. Consider upgrading to at least 16GB.`
      );
    }
  }

  if (storage === "HDD") {
    warnings.push(
      `⚠️ Mechanical Storage Alert: Using an HDD as your primary drive will cause severe micro-stuttering and extremely long loading times in modern games.`
    );
  }

  return { warnings, mismatches, psuRecommendationW };
}

/**
 * Calculates estimated performance (FPS) and Bottlenecks based on the current build and target game configurations.
 */
export function calculatePerformance(
  cpu: CPU | null,
  gpu: GPU | null,
  ramProfile: RAMProfile | null,
  storage: StorageType,
  game: Game,
  resolution: "1080p" | "1440p" | "4K",
  preset: "Low" | "Medium" | "High" | "Ultra",
  dlssFsr: "Off" | "Quality" | "Performance"
): CalculationResult {
  const warnings: string[] = [];

  // If incomplete selection, return empty/zeroed results
  if (!cpu || !gpu || !ramProfile) {
    return {
      averageFps: 0,
      onePercentLowFps: 0,
      verdict: { badge: "Incomplete", japaneseBadge: "未選択", colorClass: "text-gray-400 bg-gray-100 border-gray-200" },
      cpuLoadPercentage: 0,
      gpuLoadPercentage: 0,
      bottleneckType: "None",
      bottleneckPercentage: 0,
      warnings: ["Please select a CPU, GPU, and RAM profile to compute estimated FPS."]
    };
  }

  // --- 1. Base FPS from Game Data ---
  let baseFps = game.baseFpsScaling[resolution]?.[preset] ?? 60;

  // --- 2. Calculate Hardware Modifiers ---
  // Reference specs:
  // Let's assume a "Perfect modern build" matches the game's developer targets.
  // Reference CPU: 100% capacity has singleCoreScore of ~250 and multiCoreScore of ~1200.
  // Reference GPU: 100% capacity has relativePowerScore of ~300.
  // Reference RAM: 16GB DDR4 (multiplier 1.0)
  
  // CPU Scaling
  const cpuPower = (cpu.singleCoreScore * 0.6) + ((cpu.multiCoreScore / 10) * 0.4);
  const refCpuPower = (250 * 0.6) + (120 * 0.4); // 150 + 48 = 198
  const cpuFactor = Math.max(0.1, cpuPower / refCpuPower);

  // GPU Scaling
  const gpuPower = gpu.relativePowerScore;
  const refGpuPower = 300;
  const gpuFactor = Math.max(0.1, gpuPower / refGpuPower);

  // RAM Speed & Capacity Scaling
  let ramFactor = ramProfile.speedMultiplier;
  if (ramProfile.capacityGB < game.ramMinRequirementGB) {
    const penalty = 1 - Math.min(0.5, (game.ramMinRequirementGB - ramProfile.capacityGB) * 0.08);
    ramFactor *= penalty;
    warnings.push(
      `⚠️ Low RAM capacity: Choosing ${ramProfile.capacityGB}GB RAM for ${game.title} (recommends ${game.ramMinRequirementGB}GB) triggers performance throttling.`
    );
  }

  // Storage Speed Throttling & Micro-stuttering
  let storageFactor = 1.0;
  if (storage === "HDD") {
    storageFactor = 0.85;
  } else if (storage === "SATA SSD") {
    storageFactor = 0.95;
  } else if (storage === "NVMe Gen3") {
    storageFactor = 1.0;
  } else if (storage === "NVMe Gen4") {
    storageFactor = 1.03;
  }

  // --- 3. Compute FPS ---
  // A weighted combination of cpuFactor and gpuFactor, based on the game's dependencies.
  const gameCpuDep = game.cpuDependence; // e.g. 0.8
  const gameGpuDep = game.gpuDependence; // e.g. 1.0
  const totalDep = gameCpuDep + gameGpuDep;

  const combinedHwFactor = ((cpuFactor * gameCpuDep) + (gpuFactor * gameGpuDep)) / totalDep;
  let estimatedFps = baseFps * combinedHwFactor * ramFactor * storageFactor;

  // Apply DLSS / FSR Toggles
  if (dlssFsr === "Quality") {
    // Quality boosts FPS by ~25%
    estimatedFps *= 1.25;
  } else if (dlssFsr === "Performance") {
    // Performance boosts FPS by ~50%
    estimatedFps *= 1.5;
  }

  // Cap FPS logically (no negative, max 1000 for realistic UI constraints)
  estimatedFps = Math.max(1, Math.round(estimatedFps));

  // 1% Low is lower on HDD, lower when RAM capacity is breached, and generally is ~75% of average FPS
  let onePercentFactor = 0.75;
  if (storage === "HDD") onePercentFactor -= 0.15; // severe stutter
  if (ramProfile.capacityGB < game.ramMinRequirementGB) onePercentFactor -= 0.12;

  const averageFps = Math.round(estimatedFps);
  const onePercentLowFps = Math.max(1, Math.round(estimatedFps * onePercentFactor));

  // --- 4. Bottleneck Calculations ---
  // Let's analyze CPU vs GPU power disparity
  // "CPU-GPU Bottleneck Check: Calculate difference ratio between CPU singleCoreScore/multiCoreScore and GPU relativePowerScore."
  // If GPU score is > 2.5x CPU score: Significant CPU Bottleneck.
  // CPU score metric = (singleCoreScore * 0.7 + multiCoreScore * 0.3)
  const cpuMetric = (cpu.singleCoreScore * 0.7) + (cpu.multiCoreScore * 0.3);
  const gpuMetric = gpu.relativePowerScore;

  let bottleneckType: "None" | "CPU" | "GPU" | "RAM" | "Storage" = "None";
  let bottleneckPercentage = 0;
  let cpuLoadPercentage = 50;
  let gpuLoadPercentage = 50;

  if (gpuMetric > 2.5 * cpuMetric) {
    bottleneckType = "CPU";
    const ratio = gpuMetric / cpuMetric;
    bottleneckPercentage = Math.min(80, Math.round((ratio - 2.5) * 15));
    // CPU bottleneck means CPU load is 100%, GPU load is throttled down
    cpuLoadPercentage = 100;
    gpuLoadPercentage = Math.max(20, Math.round(100 - bottleneckPercentage));
    warnings.push(
      `⚠️ Significant CPU Bottleneck: Your GPU (${gpu.name}) will be heavily throttled in CPU-heavy scenarios because of a relatively weak CPU (${cpu.name}).`
    );
  } else if (cpuMetric > 3.0 * gpuMetric) {
    bottleneckType = "GPU";
    const ratio = cpuMetric / gpuMetric;
    bottleneckPercentage = Math.min(80, Math.round((ratio - 3.0) * 12));
    // GPU bottleneck means GPU load is 100%, CPU load is low
    gpuLoadPercentage = 100;
    cpuLoadPercentage = Math.max(30, Math.round(100 - bottleneckPercentage));
    warnings.push(
      `⚠️ Significant GPU Bottleneck: Your CPU (${cpu.name}) has plenty of headroom, but your GPU (${gpu.name}) is fully maxed out.`
    );
  } else {
    // Balanced or normal GPU-bound situation typical in gaming
    gpuLoadPercentage = 95;
    cpuLoadPercentage = Math.min(90, Math.round(40 + (game.cpuDependence * 40)));
  }

  // If RAM capacity is too low, override bottleneck info to alert RAM throttling
  if (ramProfile.capacityGB < game.ramMinRequirementGB) {
    bottleneckType = "RAM";
    const deficit = game.ramMinRequirementGB - ramProfile.capacityGB;
    bottleneckPercentage = Math.max(bottleneckPercentage, Math.min(60, deficit * 10));
  }

  // Storage-based stutter warnings
  if (storage === "HDD") {
    warnings.push(
      `⚠️ Storage warning: An HDD can cause severe FPS drops (1% Lows) and micro-stuttering.`
    );
  }

  // --- 5. Verdict Badges ---
  let verdict = { badge: "Playable", japaneseBadge: "プレイ可能", colorClass: "text-yellow-700 bg-yellow-50 border-yellow-200" };
  if (averageFps < 30) {
    verdict = { badge: "Unplayable", japaneseBadge: "厳しい", colorClass: "text-red-700 bg-red-50 border-red-200 animate-pulse" };
  } else if (averageFps < 60) {
    verdict = { badge: "Playable", japaneseBadge: "プレイ可能", colorClass: "text-orange-700 bg-orange-50 border-orange-200" };
  } else if (averageFps < 120) {
    verdict = { badge: "Smooth", japaneseBadge: "快適", colorClass: "text-green-700 bg-green-50 border-green-200 font-medium" };
  } else {
    verdict = { badge: "High Refresh", japaneseBadge: "超快適", colorClass: "text-teal-700 bg-teal-50 border-teal-200 font-bold" };
  }

  return {
    averageFps,
    onePercentLowFps,
    verdict,
    cpuLoadPercentage,
    gpuLoadPercentage,
    bottleneckType,
    bottleneckPercentage,
    warnings
  };
}
