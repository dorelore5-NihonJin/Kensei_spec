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
        `Generational Mismatch: Pairing a ${cpu.releaseYear} CPU (${cpu.name}) with a ${gpu.releaseYear} GPU (${gpu.name}) may result in highly unbalanced performance.`
      );
    } else if (yearDiff >= 6) {
      warnings.push(
        `Generational Unbalance: There is a ${yearDiff}-year difference between your CPU (${cpu.releaseYear}) and GPU (${gpu.releaseYear}).`
      );
    }

    // PSU recommendation: CPU TDP + GPU TDP + 75W (Motherboard/RAM/Storage) plus 25% safety headroom, rounded to nearest 50W
    const totalTdp = cpu.tdpW + gpu.tdpW + 75;
    psuRecommendationW = Math.max(Math.ceil((totalTdp * 1.25) / 50) * 50, 450);
  }

  if (cpu && ramProfile) {
    // RAM generation strictly filtered by CPU support
    if (!cpu.supportedDdr.includes(ramProfile.generation)) {
      mismatches.push(
        `RAM Compatibility Error: ${cpu.name} does not support ${ramProfile.generation}. Supported: ${cpu.supportedDdr.join(", ")}.`
      );
    }
  }

  if (ramProfile) {
    if (ramProfile.capacityGB < 8) {
      warnings.push(
        `Low RAM capacity: ${ramProfile.capacityGB}GB is extremely low for any modern workload. Consider upgrading to at least 16GB.`
      );
    }
  }

  if (storage === "HDD") {
    warnings.push(
      `Mechanical Storage Alert: Using an HDD as your primary drive will cause severe micro-stuttering and extremely long loading times in modern games.`
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
  dlssFsr: "Off" | "Quality" | "Performance",
  rayTracing: "Off" | "Medium" | "Ultra",
  frameGen: boolean,
  ramChannel: "Single" | "Dual",
  ramCapacityGB: number = 16
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

  // --- 2. Calculate Hardware Modifiers (Benchmark Calibrated to Real-World TechPowerUp & Gamers Nexus Tests) ---
  // CPU Power Index (Normalized to i5-13400 / Ryzen 5 5600 baseline = 1.0)
  // For CPUs with 6+ physical cores or 12+ threads, multi-core scaling accounts for 40% of total throughput in modern multi-threaded AAA engines (Cyberpunk, Wukong, UE5)
  const isMultiThreadedCpu = cpu.cores >= 6 || cpu.threads >= 12;
  const singleCoreWeight = isMultiThreadedCpu ? 0.60 : 0.70;
  const multiCoreWeight = isMultiThreadedCpu ? 0.40 : 0.30;
  const multiCoreScale = isMultiThreadedCpu ? 0.50 : 0.30;

  let rawCpuPower = (cpu.singleCoreScore * singleCoreWeight) + ((cpu.multiCoreScore / 10) * multiCoreWeight * multiCoreScale * 10);
  if (cpu.releaseYear <= 2014 && cpu.cores >= 6) {
    rawCpuPower *= 1.08; // HEDT Quad-Channel / L3 Cache Boost (+8% throughput for 6-core Sandy Bridge-E / Ivy Bridge-E)
  }
  if (cpu.is3DVCache) {
    rawCpuPower *= 1.16; // +16% effective throughput boost in gaming workloads from 3D V-Cache L3 pool
  }
  const refCpuPower = 3000.0;
  const cpuFactor = Math.max(0.15, rawCpuPower / refCpuPower);

  // GPU Power Index (Normalized to RTX 4060 / RX 7600 baseline = 295)
  const gpuPower = gpu.relativePowerScore;
  const refGpuPower = 295.0;
  const rawGpuRatio = gpuPower / refGpuPower;
  const gpuFactor = Math.max(0.25, resolution === "4K" ? Math.pow(rawGpuRatio, 0.95) : rawGpuRatio);

  // RAM Speed & Capacity Scaling
  let ramFactor = ramProfile.speedMultiplier;

  if (ramProfile.generation === "DDR5" && (resolution === "1440p" || resolution === "4K")) {
    ramFactor *= 1.04; // Bandwidth boost in memory-intensive resolutions
  } else if (ramProfile.generation === "DDR3") {
    ramFactor *= (cpu.cores >= 6 ? 0.94 : 0.90); // HEDT DDR3 quad-channel memory bus delivers high throughput
  } else if (ramProfile.generation === "DDR2") {
    ramFactor *= 0.80;
  } else if (ramProfile.generation === "DDR") {
    ramFactor *= 0.70;
  }

  if (ramCapacityGB < game.ramMinRequirementGB) {
    const deficit = game.ramMinRequirementGB - ramCapacityGB;
    const penalty = 1 - Math.min(0.35, deficit * 0.07);
    ramFactor *= penalty;
    warnings.push(
      `Low RAM capacity: Choosing ${ramCapacityGB}GB RAM for ${game.title} (recommends ${game.ramMinRequirementGB}GB) triggers performance throttling.`
    );
  }

  // Storage Speed Throttling & DirectStorage Open-World Traversal Streaming
  let storageFactor = 1.0;
  const isOpenWorldTraversalGame = ["game-spider2", "game-cyberpunk", "game-rdr2", "game-hogwarts", "game-starfield", "game-wukong"].includes(game.id);

  if (storage === "HDD") {
    storageFactor = isOpenWorldTraversalGame ? 0.78 : 0.88;
  } else if (storage === "SATA SSD") {
    storageFactor = isOpenWorldTraversalGame ? 0.94 : 0.97;
  } else if (storage === "NVMe Gen3") {
    storageFactor = 1.0;
  } else if (storage === "NVMe Gen4") {
    storageFactor = isOpenWorldTraversalGame ? 1.03 : 1.02;
  }

  // --- 3. Dynamic Resolution-Aware & Asymmetric Bottleneck Calculation ---
  let resCpuWeight = game.cpuDependence;
  let resGpuWeight = game.gpuDependence;

  if (resolution === "1080p") {
    resCpuWeight *= 0.55;
    resGpuWeight *= 0.45;
  } else if (resolution === "1440p") {
    resCpuWeight *= 0.25;
    resGpuWeight *= 0.75;
  } else { // 4K
    resCpuWeight *= 0.10;
    resGpuWeight *= 0.90;
  }

  const totalWeight = resCpuWeight + resGpuWeight;
  const weightedHwFactor = ((cpuFactor * resCpuWeight) + (gpuFactor * resGpuWeight)) / totalWeight;

  // Bottleneck Law: The weakest hardware component strictly limits peak framerate throughput
  const minHwFactor = Math.min(cpuFactor, gpuFactor);

  // Asymmetric Disparity Penalty: When one component is > 2.2x faster than the other, pipeline waiting occurs
  const bottleneckRatio = Math.max(cpuFactor / gpuFactor, gpuFactor / cpuFactor);
  let asymmetricStallFactor = 1.0;
  if (bottleneckRatio > 2.2) {
    asymmetricStallFactor = Math.max(0.78, 1.0 - (bottleneckRatio - 2.2) * 0.05);
  }

  // Generational Disparity (e.g. pairing a 2011 CPU with a 2024 GPU)
  const yearDiff = Math.abs(gpu.releaseYear - cpu.releaseYear);
  let genMismatchFactor = 1.0;
  if (yearDiff >= 6 && cpu.releaseYear <= 2017) {
    const penaltyPerYear = (cpu.cores >= 6 ? 0.025 : 0.035);
    genMismatchFactor = Math.max(0.80, 1.0 - (yearDiff - 5) * penaltyPerYear);
    warnings.push(
      `💡 Generational Asymmetry: Pairing a ${cpu.releaseYear} CPU (${cpu.name}) with a ${gpu.releaseYear} GPU (${gpu.name}) causes PCIe bus & draw-call thread saturation.`
    );
  }

  const combinedHwFactor = ((minHwFactor * 0.45) + (weightedHwFactor * 0.55)) * asymmetricStallFactor * genMismatchFactor;

  let estimatedFps = baseFps * combinedHwFactor * ramFactor * storageFactor;

  // PCIe 3.0 x8/x4 Lane Bottleneck Check
  const isX8orX4Gpu = gpu.vramGB <= 8 && ["4060", "3060 8GB", "7600", "6600", "6500"].some(name => gpu.name.includes(name));
  if (isX8orX4Gpu && cpu.releaseYear <= 2020) {
    estimatedFps *= 0.96;
    warnings.push(
      `PCIe 3.0 Bus Limit: Running a x8/x4 lane GPU (${gpu.name}) on a pre-2021 CPU platform causes minor bus throttling.`
    );
  }

  // Apply Resolution-Calibrated DLSS / FSR Toggles
  if (dlssFsr === "Quality") {
    estimatedFps *= resolution === "1440p" ? 1.32 : resolution === "4K" ? 1.45 : 1.22;
  } else if (dlssFsr === "Performance") {
    estimatedFps *= resolution === "1440p" ? 1.60 : resolution === "4K" ? 1.80 : 1.40;
  }

  // Apply Ray Tracing Toggles & Hardware SER Architecture Bonus
  if (rayTracing !== "Off") {
    const isNvidia = gpu.name.includes("RTX") || gpu.name.includes("GeForce");
    const archRtBonus = isNvidia ? 1.08 : 0.88; // NVIDIA SER hardware BVH traversal vs AMD/Intel DXR
    const rtBase = rayTracing === "Medium" ? 0.70 : 0.45;
    const rtCapability = Math.min(1.25, 0.45 + (gpu.rayTracingPowerScore / 400));
    const rtMultiplier = rtBase * rtCapability * archRtBonus;
    estimatedFps *= rtMultiplier;
  }

  // Thermal TDP Warning
  if (cpu.tdpW >= 170 && cpu.multiCoreScore > 2500) {
    warnings.push(
      `Thermal TDP Warning: ${cpu.name} (${cpu.tdpW}W TDP) requires high-end liquid or dual-tower cooling to avoid thermal clock throttling.`
    );
  }

  // Apply Frame Generation (DLSS 3 / FSR 3)
  if (frameGen) {
    estimatedFps *= 1.65;
    warnings.push(
      `Frame Generation is active: Note that Input Latency is determined by Base FPS, not Frame Gen FPS.`
    );
  }

  // Engine Soft-Cap (CS2 Source 2 engine soft-caps ~535 FPS, Valorant ~580 FPS, Dota 2 ~360 FPS)
  const isEsportsHighFpsGame = game.id.includes("cs2") || game.id.includes("valorant") || game.id.includes("dota") || game.id.includes("fortnite") || game.id.includes("apex");
  if (isEsportsHighFpsGame || baseFps > 180) {
    let maxEngineCap = 600;
    if (game.id.includes("cs2")) maxEngineCap = 535;
    else if (game.id.includes("valorant")) maxEngineCap = 580;
    else if (game.id.includes("dota")) maxEngineCap = 360;

    estimatedFps = Math.min(estimatedFps, maxEngineCap);
  }

  // Cap FPS logically
  estimatedFps = Math.max(1, Math.round(estimatedFps));

  // --- 4. 1% Low FPS & Advanced Hardware Physics Calculation ---
  let onePercentFactor = 0.72;
  if (cpu.is3DVCache) onePercentFactor += 0.07;
  if (ramChannel === "Single") {
    onePercentFactor -= 0.14;
    estimatedFps *= 0.94; // Single channel memory bandwidth bottleneck
    warnings.push(
      `Single-Channel RAM: Running 1 RAM stick halves memory bandwidth, dropping 1% Low FPS stability.`
    );
  }
  if (storage === "HDD") onePercentFactor -= 0.15;

  // Resizable BAR / Smart Access Memory (ReBAR/SAM) Hardware Alignment
  const isReBarCapableSystem = cpu.releaseYear >= 2020 && gpu.releaseYear >= 2020;
  const isReBarBeneficialGame = ["game-starfield", "game-hogwarts", "game-forza5", "game-cyberpunk", "game-rdr2"].includes(game.id);
  if (isReBarCapableSystem && isReBarBeneficialGame) {
    onePercentFactor += 0.06; // +6% 1% Lows stability boost from ReBAR un-gated VRAM bus access
  }

  let averageFps = Math.round(estimatedFps);
  let onePercentLowFps = Math.max(1, Math.round(estimatedFps * onePercentFactor));

  // VRAM Capacity Thrashing & System RAM Paging Check
  const resMultiplier = resolution === "1080p" ? 1.0 : resolution === "1440p" ? 1.35 : 1.85;
  const presetMultiplier = preset === "Low" ? 0.8 : preset === "Medium" ? 0.95 : preset === "High" ? 1.1 : 1.3;
  const GameBaseVRAM = Math.max(2.0, game.ramMinRequirementGB * 0.45);
  const VRAM_used = Number((GameBaseVRAM * resMultiplier * presetMultiplier).toFixed(2));

  if (VRAM_used > gpu.vramGB) {
    averageFps = Math.max(1, Math.round(averageFps * 0.88));
    onePercentLowFps = Math.max(1, Math.round(onePercentLowFps * 0.48));
    warnings.push(
      `VRAM Allocation Cap Exceeded: Game requires ~${VRAM_used}GB VRAM, but ${gpu.name} only has ${gpu.vramGB}GB. System RAM texture paging causes severe micro-stuttering.`
    );
  }

  // Make sure 1% Lows never exceed average FPS
  if (onePercentLowFps > averageFps) {
    onePercentLowFps = averageFps;
  }

  // --- 6. Real-Time Telemetry Load & Bottleneck Calculations ---
  const cpuMetric = (cpu.singleCoreScore * 0.7) + (cpu.multiCoreScore * 0.3);
  const gpuMetric = gpu.relativePowerScore;

  let bottleneckType: "None" | "CPU" | "GPU" | "RAM" | "Storage" = "None";
  let bottleneckPercentage = 0;

  // Base Load Profile per Game Type
  const isEsportsOrLightGame = ["game-cs2", "game-valorant", "game-dota2", "game-gtav", "game-fortnite"].includes(game.id);
  let baseGpuLoad = isEsportsOrLightGame ? (62 + game.gpuDependence * 15) : (92 + game.gpuDependence * 8);
  let baseCpuLoad = 34 + (game.cpuDependence * 28);

  // Multi-Core Core Count Thread Distribution (High-core CPUs show lower % total load)
  if (cpu.multiCoreScore > 2800) {
    baseCpuLoad *= 0.62;
  } else if (cpu.multiCoreScore > 1800) {
    baseCpuLoad *= 0.76;
  } else if (cpu.multiCoreScore < 1200) {
    baseCpuLoad *= 1.45;
  }

  // Resolution Modifiers
  if (resolution === "1080p") {
    baseGpuLoad -= 8;
    baseCpuLoad += 10;
  } else if (resolution === "1440p") {
    baseGpuLoad += 4;
    baseCpuLoad -= 2;
  } else if (resolution === "4K") {
    baseGpuLoad += 12;
    baseCpuLoad -= 12;
  }

  // Preset Detail Modifiers
  if (preset === "Low") {
    baseGpuLoad -= 16;
    baseCpuLoad += 8;
  } else if (preset === "Medium") {
    baseGpuLoad -= 6;
    baseCpuLoad += 2;
  } else if (preset === "Ultra") {
    baseGpuLoad += 8;
    baseCpuLoad -= 2;
  }

  // DLSS / FSR Upscaling Modifiers
  if (dlssFsr === "Quality") {
    baseGpuLoad -= 14;
    baseCpuLoad += 8;
  } else if (dlssFsr === "Performance") {
    baseGpuLoad -= 22;
    baseCpuLoad += 14;
  }

  // Ray Tracing Modifiers
  if (rayTracing === "Medium") {
    baseGpuLoad += 10;
    baseCpuLoad += 4;
  } else if (rayTracing === "Ultra") {
    baseGpuLoad += 18;
    baseCpuLoad += 8;
  }

  // Hardware Disparity & Bottleneck Ratio (Normalized CPU vs GPU index)
  const cpuNormalizedIndex = cpuFactor;
  const gpuNormalizedIndex = gpuFactor;
  const hwPowerRatio = gpuNormalizedIndex / Math.max(0.1, cpuNormalizedIndex);

  let gpuLoadPercentage = 50;
  let cpuLoadPercentage = 50;

  if (hwPowerRatio > 1.80) {
    // Severe CPU Bottleneck (Weak/Budget CPU paired with Flagship GPU, e.g. i3-13100 + RTX 5090)
    bottleneckType = "CPU";
    bottleneckPercentage = Math.min(85, Math.round((hwPowerRatio - 1.5) * 22));
    cpuLoadPercentage = Math.min(100, Math.max(92, Math.round(baseCpuLoad * 1.35)));
    
    // GPU load drops because CPU cannot dispatch draw calls fast enough
    let calculatedGpuLoad = Math.round(baseGpuLoad / (hwPowerRatio * 0.75));
    if (resolution === "4K" || rayTracing === "Ultra") {
      calculatedGpuLoad = Math.round(calculatedGpuLoad * 1.3);
    }
    gpuLoadPercentage = Math.max(22, Math.min(88, calculatedGpuLoad));
    
    warnings.push(
      `Significant CPU Bottleneck: Your GPU (${gpu.name}) will be heavily throttled in CPU-heavy scenarios because of a relatively weak CPU (${cpu.name}).`
    );
  } else if (hwPowerRatio < 0.55) {
    // Severe GPU Bottleneck (Top CPU paired with Weak/Entry GPU, e.g. 9800X3D + GTX 1650)
    bottleneckType = "GPU";
    const ratioInv = 1.0 / hwPowerRatio;
    bottleneckPercentage = Math.min(85, Math.round((ratioInv - 1.5) * 18));
    gpuLoadPercentage = 99;

    let dynamicCpuLoad = 16 + (game.cpuDependence * 22);
    if (resolution === "1080p") dynamicCpuLoad += 6;
    else if (resolution === "4K") dynamicCpuLoad -= 4;

    if (cpu.multiCoreScore > 20000) dynamicCpuLoad *= 0.65;
    else if (cpu.multiCoreScore > 12000) dynamicCpuLoad *= 0.80;

    cpuLoadPercentage = Math.min(65, Math.max(12, Math.round(dynamicCpuLoad)));
    warnings.push(
      `Significant GPU Bottleneck: Your CPU (${cpu.name}) has plenty of headroom, but your GPU (${gpu.name}) is fully maxed out.`
    );
  } else {
    // Balanced System: Hardware is well matched for current resolution & preset
    bottleneckType = "None";
    bottleneckPercentage = Math.round(Math.abs(hwPowerRatio - 1.0) * 15);
    gpuLoadPercentage = Math.min(99, Math.max(25, Math.round(baseGpuLoad)));
    cpuLoadPercentage = Math.min(95, Math.max(15, Math.round(baseCpuLoad)));
  }

  if (ramProfile.capacityGB < game.ramMinRequirementGB) {
    bottleneckType = "RAM";
    const deficit = game.ramMinRequirementGB - ramProfile.capacityGB;
    bottleneckPercentage = Math.max(bottleneckPercentage, Math.min(60, deficit * 10));
  }

  if (storage === "HDD") {
    warnings.push(
      `Storage warning: An HDD can cause severe FPS drops (1% Lows) and micro-stuttering.`
    );
  }

  // --- 7. Verdict Badges ---
  let verdict = { key: "playable", badge: "Playable", japaneseBadge: "プレイ可能", colorClass: "text-yellow-700 bg-yellow-50 border-yellow-200" };
  if (averageFps < 30) {
    verdict = { key: "heavy", badge: "Unplayable", japaneseBadge: "厳しい", colorClass: "text-red-700 bg-red-50 border-red-200 animate-pulse" };
  } else if (averageFps < 60) {
    verdict = { key: "playable", badge: "Playable", japaneseBadge: "プレイ可能", colorClass: "text-orange-700 bg-orange-50 border-orange-200" };
  } else if (averageFps < 120) {
    verdict = { key: "smooth", badge: "Smooth", japaneseBadge: "快適", colorClass: "text-green-700 bg-green-50 border-green-200 font-medium" };
  } else {
    verdict = { key: "high_refresh", badge: "High Refresh", japaneseBadge: "超快適", colorClass: "text-teal-700 bg-teal-50 border-teal-200 font-bold" };
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
