
export interface GameBenchmark {
  low: number;
  medium: number;
  high: number;
  ultra: number;
}

export interface ResolutionBenchmark {
  "1080p": GameBenchmark;
  "1440p": GameBenchmark;
  "4K": GameBenchmark;
}

export interface GPUGamingBenchmarks {
  "Cyberpunk 2077": ResolutionBenchmark;
  "Red Dead Redemption 2": ResolutionBenchmark;
  "Forza Horizon 6": ResolutionBenchmark;
  "Black Myth: Wukong": ResolutionBenchmark;
  "Helldivers 2": ResolutionBenchmark;
  "Alan Wake 2": ResolutionBenchmark;
}

export interface GPU {
  id: string;
  name: string;
  manufacturer: "NVIDIA" | "AMD" | "Intel" | "Apple";
  releaseYear: number;
  relativePowerScore: number;
  vramGB: number;
  architecture: string;
  recommendedPsuW: number;
  tdpW: number;
  rayTracingPowerScore: number;
  isIntegrated?: boolean;
  gpuCodeName?: string;
  marketSegment?: string;
  designer?: string;
  processNode?: string;
  launchMsrp?: string;
  costEffectivenessScore?: string;
  powerEfficiencyScore?: string;
  cudaCores?: string;
  baseClock?: string;
  boostClock?: string;
  transistors?: string;
  maxTemp?: string;
  textureFillRate?: string;
  tflops?: string;
  rops?: number;
  tmus?: number;
  l1Cache?: string;
  l2Cache?: string;
  interface?: string;
  length?: string;
  slotWidth?: string;
  powerConnectors?: string;
  memoryType?: string;
  maxVramAmount?: string;
  memoryBusWidth?: string;
  memoryClockSpeed?: string;
  memoryBandwidth?: string;
  sharedMemory?: string;
  displayConnectors?: string;
  hdmiSupport?: boolean;
  gsyncSupport?: string;
  vrReady?: boolean;
  ansel?: boolean;
  directX?: string;
  shaderModel?: string;
  openGL?: string;
  openCL?: string;
  vulkan?: string;
  cuda?: string;
  timeSpyGraphicsScore?: number;
  portRoyalScore?: number;
  geekbenchVulkan?: number;
  geekbenchOpenCL?: number;
  passmarkG3D?: number;
  gamingBenchmarks?: GPUGamingBenchmarks;
}

export interface CPU {
  id: string;
  name: string;
  manufacturer: "Intel" | "AMD" | "Apple";
  releaseYear: number;
  cores: number;
  threads: number;
  supportedDdr: string[];
  singleCoreScore: number;
  multiCoreScore: number;
  overallPerformanceScore?: number;
  cinebenchR23Single?: number;
  cinebenchR23Multi?: number;
  passmarkScore?: number;
  tdpW: number;
  socket: string;
  l3CacheMB: number;
  is3DVCache: boolean;
  marketSegment?: string;
  designer?: string;
  architectureCodename?: string;
  processNode?: string;
  baseClock?: string;
  boostClock?: string;
  busRate?: string;
  l1Cache?: string;
  l2Cache?: string;
  l3Cache?: string;
  dieSize?: string;
  maxTemp?: string;
  is64Bit?: boolean;
  win11Compat?: boolean;
  recommendedPsu?: string;
  instructionSets?: string;
  aesNi?: boolean;
  dlBoost?: boolean;
  virtualization?: boolean;
  hyperThreading?: boolean;
  memorySupport?: string;
  maxMemorySize?: string;
  memoryChannels?: string;
  memoryBandwidth?: string;
  iGpuModel?: string;
  pcieVersion?: string;
  pcieLanes?: string;
  launchMsrp?: string;
  costEffectivenessScore?: string;
  powerEfficiencyScore?: string;
}

export interface RAMProfile {
  id: string;
  generation: "DDR" | "DDR2" | "DDR3" | "DDR4" | "DDR5";
  capacityGB: number;
  speedMultiplier: number;
  speedMhz: number;
}

export interface Game {
  id: string;
  title: string;
  coverImage: string;
  cpuDependence: number; // 0.1 to 1.0 multiplier
  gpuDependence: number; // 0.1 to 1.0 multiplier
  ramMinRequirementGB: number;
  baseFpsScaling: {
    [resolution: string]: {
      [preset: string]: number; // base FPS at standard reference hardware
    };
  };
}

export type StorageType = "HDD" | "SATA SSD" | "NVMe Gen3" | "NVMe Gen4";

export interface BuildSelection {
  cpu: CPU | null;
  gpu: GPU | null;
  ramProfile: RAMProfile | null;
  storage: StorageType;
}

export interface CalculationResult {
  averageFps: number;
  onePercentLowFps: number;
  verdict: {
    badge: string;
    japaneseBadge: string;
    colorClass: string;
  };
  cpuLoadPercentage: number;
  gpuLoadPercentage: number;
  bottleneckType: "None" | "CPU" | "GPU" | "RAM" | "Storage";
  bottleneckPercentage: number; // e.g. 15% throttled
  warnings: string[];
}

export interface CompatibilityReport {
  warnings: string[];
  mismatches: string[];
  psuRecommendationW: number;
}
