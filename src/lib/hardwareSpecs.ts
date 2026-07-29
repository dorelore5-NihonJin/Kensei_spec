import type { CPU, GPU } from "./types";

export interface CpuTechnicalDetails {
  rank: number;
  totalCount: number;
  popularityRank: number;
  marketSegment: string;
  designer: string;
  architectureCodename: string;
  releaseDate: string;
  launchMsrp: string;
  powerEfficiencyScore: string;
  costEffectivenessScore: string;

  // Detailed CPU Specs
  cores: number;
  threads: number;
  baseClock: string;
  boostClock: string;
  busRate: string;
  l1Cache: string;
  l2Cache: string;
  l3Cache: string;
  processNode: string;
  dieSize: string;
  maxTemp: string;
  is64Bit: boolean;
  win11Compat: boolean;

  // Compatibility & Power
  socket: string;
  powerDrawTdp: string;
  recommendedPsu: string;

  // Technologies & Security
  instructionSets: string;
  aesNi: boolean;
  dlBoost: boolean;
  virtualization: boolean;
  hyperThreading: boolean;

  // Memory Specs
  memorySupport: string;
  maxMemorySize: string;
  memoryChannels: string;
  memoryBandwidth: string;

  // Integrated Graphics & Peripherals
  iGpuModel: string;
  pcieVersion: string;
  pcieLanes: string;
}

export interface GpuTechnicalDetails {
  rank: number;
  totalCount: number;
  popularityRank: number;
  marketSegment: string;
  designer: string;
  architectureCodename: string;
  gpuCodeName: string;
  releaseDate: string;
  launchMsrp: string;
  powerEfficiencyScore: string;
  costEffectivenessScore: string;

  // Detailed Specs
  cudaCores: string;
  baseClock: string;
  boostClock: string;
  transistors: string;
  processNode: string;
  powerDrawTdp: string;
  maxTemp: string;
  textureFillRate: string;
  tflops: string;
  rops: number;
  tmus: number;
  l1Cache: string;
  l2Cache: string;

  // Form Factor & Compatibility
  interface: string;
  length: string;
  slotWidth: string;
  powerConnectors: string;

  // VRAM Capacity and Type
  memoryType: string;
  maxVramAmount: string;
  memoryBusWidth: string;
  memoryClockSpeed: string;
  memoryBandwidth: string;
  sharedMemory: string;

  // Connectivity & Outputs
  displayConnectors: string;
  hdmiSupport: boolean;
  gsyncSupport: string;

  // Supported Technologies
  vrReady: boolean;
  ansel: boolean;

  // API and SDK Support
  directX: string;
  shaderModel: string;
  openGL: string;
  openCL: string;
  vulkan: string;
  cuda: string;
}

// Map CPU architecture codenames and process nodes based on model names
export function getCpuTechnicalDetails(cpu: CPU, allCpus: CPU[]): CpuTechnicalDetails {
  const sortedCpus = [...allCpus].sort((a, b) => {
    const scoreA = a.singleCoreScore * 0.6 + (a.multiCoreScore / 10) * 0.4 * 10;
    const scoreB = b.singleCoreScore * 0.6 + (b.multiCoreScore / 10) * 0.4 * 10;
    return scoreB - scoreA;
  });
  const rank = sortedCpus.findIndex((c) => c.id === cpu.id) + 1;

  return {
    rank,
    totalCount: allCpus.length,
    popularityRank: Math.min(allCpus.length, Math.max(1, Math.round(rank * 0.8 + 2))),
    marketSegment: cpu.marketSegment || "Desktop Processor",
    designer: cpu.designer || cpu.manufacturer,
    architectureCodename: cpu.architectureCodename || "Unknown Architecture",
    releaseDate: `${cpu.releaseYear}`,
    launchMsrp: cpu.launchMsrp || "$0",
    powerEfficiencyScore: cpu.powerEfficiencyScore || "0.00 / 5.00",
    costEffectivenessScore: cpu.costEffectivenessScore || "0.00 / 10.0",

    cores: cpu.cores,
    threads: cpu.threads,
    baseClock: cpu.baseClock || "0.00 GHz",
    boostClock: cpu.boostClock || "0.00 GHz",
    busRate: cpu.busRate || "8 GT/s",
    l1Cache: cpu.l1Cache || "0 KB",
    l2Cache: cpu.l2Cache || "0 MB",
    l3Cache: cpu.l3Cache || "0 MB",
    processNode: cpu.processNode || "Unknown",
    dieSize: cpu.dieSize || "0 mm²",
    maxTemp: cpu.maxTemp || "90 °C",
    is64Bit: cpu.is64Bit !== undefined ? cpu.is64Bit : true,
    win11Compat: cpu.win11Compat !== undefined ? cpu.win11Compat : false,

    socket: `Socket ${cpu.socket}`,
    powerDrawTdp: `${cpu.tdpW} W TDP`,
    recommendedPsu: cpu.recommendedPsu || "400 W",

    instructionSets: cpu.instructionSets || "",
    aesNi: cpu.aesNi !== undefined ? cpu.aesNi : true,
    dlBoost: cpu.dlBoost !== undefined ? cpu.dlBoost : false,
    virtualization: cpu.virtualization !== undefined ? cpu.virtualization : true,
    hyperThreading: cpu.hyperThreading !== undefined ? cpu.hyperThreading : false,

    memorySupport: cpu.memorySupport || (cpu.supportedDdr ? cpu.supportedDdr.join(" / ") : ""),
    maxMemorySize: cpu.maxMemorySize || "128 GB",
    memoryChannels: cpu.memoryChannels || "2 Channels",
    memoryBandwidth: cpu.memoryBandwidth || "0 GB/s",

    iGpuModel: cpu.iGpuModel || "None",
    pcieVersion: cpu.pcieVersion || "PCIe 4.0",
    pcieLanes: cpu.pcieLanes || "20 Express Lanes"
  };
}

export function getGpuTechnicalDetails(gpu: GPU, allGpus: GPU[]): GpuTechnicalDetails {
  const sortedGpus = [...allGpus].sort((a, b) => b.relativePowerScore - a.relativePowerScore);
  const rank = sortedGpus.findIndex((g) => g.id === gpu.id) + 1;

  return {
    rank,
    totalCount: allGpus.length,
    popularityRank: Math.min(allGpus.length, Math.max(1, Math.round(rank * 0.85 + 1))),
    marketSegment: gpu.marketSegment || "Desktop GPU",
    designer: gpu.designer || gpu.manufacturer,
    architectureCodename: gpu.architecture || "Unknown",
    gpuCodeName: gpu.gpuCodeName || "Unknown",
    releaseDate: `${gpu.releaseYear}`,
    launchMsrp: gpu.launchMsrp || "$0",
    powerEfficiencyScore: gpu.powerEfficiencyScore || "0.00 Efficiency",
    costEffectivenessScore: gpu.costEffectivenessScore || "0.00 Rating",

    cudaCores: gpu.cudaCores || "0 Shaders",
    baseClock: gpu.baseClock || "0 MHz",
    boostClock: gpu.boostClock || "0 MHz",
    transistors: gpu.transistors || "0 Billion",
    processNode: gpu.processNode || "Unknown",
    powerDrawTdp: `${gpu.tdpW} Watt`,
    maxTemp: gpu.maxTemp || "85 °C",
    textureFillRate: gpu.textureFillRate || "0 GTexel/s",
    tflops: gpu.tflops || "0 TFLOPS",
    rops: gpu.rops || 0,
    tmus: gpu.tmus || 0,
    l1Cache: gpu.l1Cache || "0 KB",
    l2Cache: gpu.l2Cache || "0 MB",

    interface: gpu.interface || "PCIe 3.0 x16",
    length: gpu.length || "200 mm",
    slotWidth: gpu.slotWidth || "2-slot",
    powerConnectors: gpu.powerConnectors || "None",

    memoryType: gpu.memoryType || "GDDR6",
    maxVramAmount: gpu.maxVramAmount || `${gpu.vramGB} GB`,
    memoryBusWidth: gpu.memoryBusWidth || "128 Bit",
    memoryClockSpeed: gpu.memoryClockSpeed || "0 MHz",
    memoryBandwidth: gpu.memoryBandwidth || "0 GB/s",
    sharedMemory: gpu.sharedMemory || "-",

    displayConnectors: gpu.displayConnectors || "1x HDMI",
    hdmiSupport: gpu.hdmiSupport !== undefined ? gpu.hdmiSupport : true,
    gsyncSupport: gpu.gsyncSupport || "Adaptive Sync",

    vrReady: gpu.vrReady !== undefined ? gpu.vrReady : false,
    ansel: gpu.ansel !== undefined ? gpu.ansel : false,

    directX: gpu.directX || "12",
    shaderModel: gpu.shaderModel || "6.5",
    openGL: gpu.openGL || "4.6",
    openCL: gpu.openCL || "3.0",
    vulkan: gpu.vulkan || "1.3",
    cuda: gpu.cuda || "Supported"
  };
}
