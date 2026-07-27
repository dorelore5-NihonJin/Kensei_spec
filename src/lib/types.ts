export interface GPU {
  id: string;
  name: string;
  manufacturer: "NVIDIA" | "AMD" | "Intel";
  releaseYear: number;
  relativePowerScore: number;
  vramGB: number;
  architecture: string;
  recommendedPsuW: number;
  tdpW: number;
  rayTracingPowerScore: number;
}

export interface CPU {
  id: string;
  name: string;
  manufacturer: "Intel" | "AMD";
  releaseYear: number;
  cores: number;
  threads: number;
  supportedDdr: ("DDR" | "DDR2" | "DDR3" | "DDR4" | "DDR5")[];
  singleCoreScore: number;
  multiCoreScore: number;
  tdpW: number;
  socket: string;
  l3CacheMB: number;
  is3DVCache: boolean;
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
