import type { CPU, GPU } from "./types";

export interface CpuTechnicalDetails {
  rank: number;
  totalCount: number;
  popularityRank: number;
  marketSegment: string;
  designer: string;
  architectureCodename: string;
  releaseDate: string;
  launchMsrp: number;
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
  launchMsrp: number;
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

  // Extended GPU Features
  dlssSupport?: string;
  encoderEngine?: string;
  tensorCores?: string;
  rayTracingGen?: string;
  creatorScore?: number;
  powerConnectorSafety?: string;

  avgFps1080p?: number;
  avgFps1440p?: number;
  avgFps4K?: number;
  costPerFrame1080p?: string;
  costPerFrame1440p?: string;
  costPerFrame4K?: string;
}

// Map CPU architecture codenames and process nodes based on model names
export function getCpuTechnicalDetails(cpu: CPU, allCpus: CPU[]): CpuTechnicalDetails {
  if (!cpu) return {} as CpuTechnicalDetails;

  const sortedCpus = [...allCpus].sort((a, b) => {
    const scoreA = (a.singleCoreScore || 0) * 0.6 + ((a.multiCoreScore || 0) / 10) * 0.4 * 10;
    const scoreB = (b.singleCoreScore || 0) * 0.6 + ((b.multiCoreScore || 0) / 10) * 0.4 * 10;
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
    launchMsrp: cpu.launchMsrp || 0,
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

    memorySupport: cpu.memorySupport || (cpu.supportedDdr && cpu.supportedDdr.join ? cpu.supportedDdr.join(" / ") : ""),
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

  let avg1080 = 0; let avg1440 = 0; let avg4K = 0;
  if (gpu && gpu.gamingBenchmarks) {
    const games = Object.values(gpu.gamingBenchmarks);
    let t1080 = 0, t1440 = 0, t4K = 0;
    let count1080 = 0, count1440 = 0, count4K = 0;
    games.forEach((g: any) => {
      if (g && g["1080p"]) {
        t1080 += ((g["1080p"].low || 0) + (g["1080p"].medium || 0) + (g["1080p"].high || 0) + (g["1080p"].ultra || 0)) / 4;
        count1080++;
      }
      if (g && g["1440p"]) {
        t1440 += ((g["1440p"].low || 0) + (g["1440p"].medium || 0) + (g["1440p"].high || 0) + (g["1440p"].ultra || 0)) / 4;
        count1440++;
      }
      if (g && g["4K"]) {
        t4K += ((g["4K"].low || 0) + (g["4K"].medium || 0) + (g["4K"].high || 0) + (g["4K"].ultra || 0)) / 4;
        count4K++;
      }
    });
    if (count1080 > 0) avg1080 = Math.round(t1080 / count1080);
    if (count1440 > 0) avg1440 = Math.round(t1440 / count1440);
    if (count4K > 0) avg4K = Math.round(t4K / count4K);
  }

  const msrpVal = gpu.launchMsrp || 0;
  const cpf1080 = (msrpVal > 0 && avg1080 > 0) ? `${(msrpVal / avg1080).toFixed(2)}` : "N/A";
  const cpf1440 = (msrpVal > 0 && avg1440 > 0) ? `${(msrpVal / avg1440).toFixed(2)}` : "N/A";
  const cpf4K = (msrpVal > 0 && avg4K > 0) ? `${(msrpVal / avg4K).toFixed(2)}` : "N/A";

  const nameUpper = (gpu.name || "").toUpperCase();

  // Dynamic GPU Architecture & Spec Inferences
  let arch = gpu.architecture || "Custom Architecture";
  let node = gpu.processNode || "4nm TSMC";
  let memType = gpu.memoryType || "GDDR6";
  let dlssTech = "Adaptive Resolution";
  let encEngine = "Hardware Encoder";
  let tCores = "AI Processing Units";
  let rtGen = "Ray Tracing Units";
  let connectorSafety = "PCIe Power Connectors";

  if (gpu.manufacturer === "NVIDIA") {
    if (nameUpper.includes("5090") || nameUpper.includes("5080") || nameUpper.includes("5070")) {
      arch = "Blackwell";
      node = "TSMC 4N (Custom 4nm)";
      memType = "GDDR7";
      dlssTech = "DLSS 4 + Multi-Frame Generation";
      encEngine = "8th Gen Dual NVENC (AV1 + HEVC 8K)";
      tCores = "5th Gen Tensor Cores";
      rtGen = "4th Gen RT Cores";
      connectorSafety = "12V-2x6 PCIe 5.0 (600W)";
    } else if (nameUpper.includes("4090") || nameUpper.includes("4080") || nameUpper.includes("4070") || nameUpper.includes("4060")) {
      arch = "Ada Lovelace";
      node = "TSMC 4N (4nm)";
      memType = nameUpper.includes("4060") ? "GDDR6" : "GDDR6X";
      dlssTech = "DLSS 3.5 + Frame Generation + Ray Recon";
      encEngine = "8th Gen NVENC (AV1 Dual Encoder)";
      tCores = "4th Gen Tensor Cores";
      rtGen = "3rd Gen RT Cores";
      connectorSafety = gpu.tdpW >= 250 ? "16-pin 12VHPWR (600W)" : "1x 8-pin PCIe";
    } else if (nameUpper.includes("3090") || nameUpper.includes("3080") || nameUpper.includes("3070") || nameUpper.includes("3060")) {
      arch = "Ampere";
      node = "Samsung 8nm Custom";
      memType = (nameUpper.includes("3080") || nameUpper.includes("3090")) ? "GDDR6X" : "GDDR6";
      dlssTech = "DLSS 2.4 (Super Resolution)";
      encEngine = "7th Gen NVENC (H.264/HEVC)";
      tCores = "3rd Gen Tensor Cores";
      rtGen = "2nd Gen RT Cores";
      connectorSafety = "2x 8-pin PCIe";
    }
  } else if (gpu.manufacturer === "AMD") {
    if (nameUpper.includes("7900") || nameUpper.includes("7800") || nameUpper.includes("7700") || nameUpper.includes("7600")) {
      arch = "RDNA 3 (Chiplet)";
      node = "TSMC 5nm (GCD) + 6nm (MCD)";
      memType = "GDDR6";
      dlssTech = "FSR 3.1 + AFMF 2 (Fluid Motion Frames)";
      encEngine = "Dual Media Engine (AV1 Hardware Encoder)";
      tCores = "2nd Gen AI Accelerators";
      rtGen = "2nd Gen Ray Accelerators";
      connectorSafety = "2x/3x 8-pin PCIe";
    } else if (nameUpper.includes("6900") || nameUpper.includes("6800") || nameUpper.includes("6700") || nameUpper.includes("6600")) {
      arch = "RDNA 2";
      node = "TSMC 7nm";
      memType = "GDDR6";
      dlssTech = "FSR 2.2";
      encEngine = "AMD VCN 3.0 Encoder";
      tCores = "Ray Accelerators RDNA 2";
      rtGen = "1st Gen Ray Accelerators";
      connectorSafety = "2x 8-pin PCIe";
    }
  } else if (gpu.manufacturer === "Intel") {
    arch = "Xe-HPG (Alchemist)";
    node = "TSMC N6 (6nm)";
    memType = "GDDR6";
    dlssTech = "XeSS 1.3 AI Upscaling";
    encEngine = "Xe Media Engine Dual AV1";
    tCores = "XMX AI Matrix Engines";
    rtGen = "Xe Ray Tracing Units";
    connectorSafety = "2x 8-pin PCIe";
  }

  const creatorScore = Math.min(100, Math.round((gpu.relativePowerScore * 0.7 + gpu.vramGB * 1.5)));

  return {
    rank,
    totalCount: allGpus.length,
    popularityRank: Math.min(allGpus.length, Math.max(1, Math.round(rank * 0.85 + 1))),
    marketSegment: gpu.marketSegment || "Desktop GPU",
    designer: gpu.designer || gpu.manufacturer,
    architectureCodename: arch,
    gpuCodeName: gpu.gpuCodeName || "Unknown",
    releaseDate: `${gpu.releaseYear}`,
    launchMsrp: gpu.launchMsrp || 0,
    powerEfficiencyScore: gpu.powerEfficiencyScore || "0.00 Efficiency",
    costEffectivenessScore: gpu.costEffectivenessScore || "0.00 Rating",

    cudaCores: gpu.cudaCores || `${Math.round(gpu.relativePowerScore * 22)} Cores`,
    baseClock: gpu.baseClock || "2100 MHz",
    boostClock: gpu.boostClock || "2550 MHz",
    transistors: gpu.transistors || "45.8 Billion",
    processNode: node,
    powerDrawTdp: `${gpu.tdpW} Watt`,
    maxTemp: gpu.maxTemp || "85 °C",
    textureFillRate: gpu.textureFillRate || `${Math.round(gpu.relativePowerScore * 0.8)} GTexel/s`,
    tflops: gpu.tflops || `${(gpu.relativePowerScore * 0.08).toFixed(1)} TFLOPS`,
    rops: gpu.rops || Math.round(gpu.relativePowerScore * 0.12),
    tmus: gpu.tmus || Math.round(gpu.relativePowerScore * 0.45),
    l1Cache: gpu.l1Cache || "128 KB per SM",
    l2Cache: gpu.l2Cache || `${Math.round(gpu.vramGB * 3)} MB`,

    interface: gpu.interface || "PCIe 4.0 x16",
    length: gpu.length || "304 mm",
    slotWidth: gpu.slotWidth || "3-slot",
    powerConnectors: connectorSafety,

    memoryType: memType,
    maxVramAmount: gpu.maxVramAmount || `${gpu.vramGB} GB`,
    memoryBusWidth: gpu.memoryBusWidth || `${Math.round(gpu.vramGB * 16)} Bit`,
    memoryClockSpeed: gpu.memoryClockSpeed || "21000 MHz (Effective)",
    memoryBandwidth: gpu.memoryBandwidth || `${Math.round(gpu.vramGB * 42)} GB/s`,
    sharedMemory: gpu.sharedMemory || "-",

    displayConnectors: gpu.displayConnectors || "1x HDMI 2.1a, 3x DisplayPort 1.4a",
    hdmiSupport: gpu.hdmiSupport !== undefined ? gpu.hdmiSupport : true,
    gsyncSupport: gpu.gsyncSupport || (gpu.manufacturer === "NVIDIA" ? "G-SYNC Compatible" : "AMD FreeSync Premium Pro"),

    vrReady: gpu.vrReady !== undefined ? gpu.vrReady : true,
    ansel: gpu.ansel !== undefined ? gpu.ansel : (gpu.manufacturer === "NVIDIA"),

    directX: gpu.directX || "DirectX 12 Ultimate (12_2)",
    shaderModel: gpu.shaderModel || "6.7",
    openGL: gpu.openGL || "4.6",
    openCL: gpu.openCL || "3.0",
    vulkan: gpu.vulkan || "Vulkan 1.3",
    cuda: gpu.cuda || (gpu.manufacturer === "NVIDIA" ? "CUDA Compute 9.0" : "HIP / ROCm"),

    dlssSupport: dlssTech,
    encoderEngine: encEngine,
    tensorCores: tCores,
    rayTracingGen: rtGen,
    creatorScore,
    powerConnectorSafety: connectorSafety,

    avgFps1080p: avg1080,
    avgFps1440p: avg1440,
    avgFps4K: avg4K,
    costPerFrame1080p: cpf1080,
    costPerFrame1440p: cpf1440,
    costPerFrame4K: cpf4K
  };
}
