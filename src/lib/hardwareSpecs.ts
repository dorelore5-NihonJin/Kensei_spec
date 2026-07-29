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
    const scoreA = Math.round(a.singleCoreScore * 0.6 + (a.multiCoreScore / 10) * 0.4 * 10);
    const scoreB = Math.round(b.singleCoreScore * 0.6 + (b.multiCoreScore / 10) * 0.4 * 10);
    return scoreB - scoreA;
  });

  const rank = sortedCpus.findIndex((c) => c.id === cpu.id) + 1;
  const name = cpu.name.toLowerCase();

  let arch = "x86-64 Microarchitecture";
  let node = "14nm";
  let baseClock = "3.20 GHz";
  let boostClock = "4.40 GHz";

  if (name.includes("ryzen ai 9") || name.includes("strix point")) {
    arch = "Zen 5 / Zen 5c (Strix Point)";
    node = "TSMC N4P (4nm)";
    baseClock = "2.00 GHz";
    boostClock = "5.10 GHz";
  } else if (name.includes("258v") || name.includes("226v") || name.includes("lunar lake")) {
    arch = "Lunar Lake (Lion Cove / Skymont)";
    node = "TSMC N3B (3nm)";
    baseClock = "2.20 GHz";
    boostClock = "5.00 GHz";
  } else if (name.includes("8845hs") || name.includes("7840hs") || name.includes("7940hs")) {
    arch = "Zen 4 (Phoenix / Hawk Point)";
    node = "TSMC 4nm";
    baseClock = "3.80 GHz";
    boostClock = "5.10 GHz";
  } else if (name.includes("6800u") || name.includes("5800u") || name.includes("5600u")) {
    arch = "Zen 3 / Zen 3+ (Rembrandt/Cezanne)";
    node = "TSMC 6nm / 7nm";
    baseClock = "2.70 GHz";
    boostClock = "4.70 GHz";
  } else if (name.includes("1360p") || name.includes("1340p") || name.includes("1260p") || name.includes("1240p")) {
    arch = "Raptor Lake / Alder Lake P";
    node = "Intel 7 (10nm)";
    baseClock = "2.10 GHz";
    boostClock = "5.00 GHz";
  } else if (name.includes("11800h") || name.includes("11400h") || name.includes("1165g7") || name.includes("1135g7")) {
    arch = "Tiger Lake H/U";
    node = "10nm SuperFin";
    baseClock = "2.30 GHz";
    boostClock = "4.60 GHz";
  } else if (name.includes("10875h") || name.includes("10750h") || name.includes("10510u") || name.includes("10210u")) {
    arch = "Comet Lake H/U";
    node = "14nm++";
    baseClock = "2.60 GHz";
    boostClock = "5.00 GHz";
  } else if (name.includes("5500u") || name.includes("5700u") || name.includes("5800h") || name.includes("5600h") || name.includes("5900hx")) {
    arch = "Zen 3 / Zen 2 (Cezanne / Lucienne)";
    node = "TSMC 7nm";
    baseClock = "2.10 GHz";
    boostClock = "4.60 GHz";
  } else if (name.includes("4800h") || name.includes("4600h") || name.includes("4700u") || name.includes("4500u")) {
    arch = "Zen 2 (Renoir)";
    node = "TSMC 7nm";
    baseClock = "2.00 GHz";
    boostClock = "4.20 GHz";
  } else if (name.includes("apple m4")) {
    arch = "Apple M4 Silicon (ARMv9)";
    node = "TSMC N3E (3nm)";
    baseClock = "3.40 GHz";
    boostClock = "4.40 GHz";
  } else if (name.includes("apple m3")) {
    arch = "Apple M3 Silicon (ARMv9)";
    node = "TSMC N3B (3nm)";
    baseClock = "3.20 GHz";
    boostClock = "4.05 GHz";
  } else if (name.includes("apple m2")) {
    arch = "Apple M2 Silicon (ARMv8)";
    node = "TSMC N5P (5nm)";
    baseClock = "3.00 GHz";
    boostClock = "3.50 GHz";
  } else if (name.includes("apple m1")) {
    arch = "Apple M1 Silicon (ARMv8)";
    node = "TSMC N5 (5nm)";
    baseClock = "2.06 GHz";
    boostClock = "3.20 GHz";
  } else if (name.includes("7800x3d") || name.includes("7950x") || name.includes("7600")) {
    arch = "Zen 4 (Raphaël)";
    node = "5nm TSMC (FinFET)";
    baseClock = "4.20 GHz";
    boostClock = "5.00 GHz";
  } else if (name.includes("9800x3d") || name.includes("9950x")) {
    arch = "Zen 5 (Granite Ridge)";
    node = "4nm TSMC";
    baseClock = "4.70 GHz";
    boostClock = "5.20 GHz";
  } else if (name.includes("14900") || name.includes("14700") || name.includes("14400")) {
    arch = "Raptor Lake Refresh";
    node = "Intel 7 (10nm Enhanced SuperFin)";
    baseClock = "3.20 GHz";
    boostClock = "6.00 GHz";
  } else if (name.includes("13900") || name.includes("13600") || name.includes("13400")) {
    arch = "Raptor Lake";
    node = "Intel 7 (10nm)";
    baseClock = "3.50 GHz";
    boostClock = "5.40 GHz";
  } else if (name.includes("12900") || name.includes("12400") || name.includes("12100")) {
    arch = "Alder Lake";
    node = "Intel 7 (10nm)";
    baseClock = "3.00 GHz";
    boostClock = "4.90 GHz";
  } else if (name.includes("10400") || name.includes("10700") || name.includes("10900")) {
    arch = "Comet Lake";
    node = "14nm+++";
    baseClock = "2.90 GHz";
    boostClock = "4.30 GHz";
  } else if (name.includes("5600") || name.includes("5800x3d") || name.includes("5900x")) {
    arch = "Zen 3 (Vermeer)";
    node = "7nm TSMC";
    baseClock = "3.70 GHz";
    boostClock = "4.60 GHz";
  } else if (name.includes("3600") || name.includes("3700x")) {
    arch = "Zen 2 (Matisse)";
    node = "7nm TSMC";
    baseClock = "3.60 GHz";
    boostClock = "4.20 GHz";
  }

  const score = Math.round(cpu.singleCoreScore * 0.6 + (cpu.multiCoreScore / 10) * 0.4 * 10);
  const effScore = (Math.min(5, Math.max(1, (score / cpu.tdpW) * 1.8))).toFixed(2);
  const valScore = (Math.min(9.9, Math.max(3, (score / 35) + 2.5))).toFixed(2);

  const msrpEst = `$${Math.min(999, Math.max(79, Math.round(score * 1.45 + cpu.cores * 15)))}`;
  const iGpuName = name.includes("f") && !name.includes("5600g")
    ? "None (Discrete GPU Required)"
    : cpu.manufacturer === "Apple"
    ? "Apple Silicon Integrated GPU"
    : cpu.manufacturer === "AMD"
    ? "Radeon Graphics (RDNA 3 / Vega)"
    : "Intel® UHD / Iris Xe Graphics";

  return {
    rank,
    totalCount: allCpus.length,
    popularityRank: Math.min(allCpus.length, Math.max(1, Math.round(rank * 0.8 + 2))),
    marketSegment: cpu.cores >= 16 ? "Enthusiast Workstation" : cpu.tdpW <= 28 ? "Laptop Processor" : "Desktop Processor",
    designer: cpu.manufacturer,
    architectureCodename: arch,
    releaseDate: `${cpu.releaseYear}`,
    launchMsrp: msrpEst,
    powerEfficiencyScore: `${effScore} / 5.00`,
    costEffectivenessScore: `${valScore} / 10.0`,

    // Detailed CPU Specs
    cores: cpu.cores,
    threads: cpu.threads,
    baseClock,
    boostClock,
    busRate: cpu.releaseYear >= 2022 ? "16 GT/s" : "8 GT/s",
    l1Cache: `${cpu.cores * 64} KB`,
    l2Cache: `${cpu.cores * 1} MB`,
    l3Cache: cpu.is3DVCache ? `${cpu.l3CacheMB} MB (3D V-Cache)` : `${cpu.l3CacheMB} MB`,
    processNode: node,
    dieSize: `${Math.round(95 + cpu.cores * 10)} mm²`,
    maxTemp: cpu.manufacturer === "AMD" ? "95 °C" : "100 °C",
    is64Bit: true,
    win11Compat: cpu.releaseYear >= 2018,

    // Compatibility & Power
    socket: `Socket ${cpu.socket}`,
    powerDrawTdp: `${cpu.tdpW} W TDP`,
    recommendedPsu: `${Math.max(400, cpu.tdpW * 3 + 250)} W`,

    // Technologies & Security
    instructionSets: cpu.manufacturer === "Apple"
      ? "ARMv8/v9 NEON"
      : cpu.manufacturer === "AMD"
      ? "Intel® SSE4.1, SSE4.2, AVX2, AVX-512, FMA3"
      : "Intel® SSE4.1, SSE4.2, AVX2, Deep Learning Boost",
    aesNi: true,
    dlBoost: cpu.releaseYear >= 2021,
    virtualization: true,
    hyperThreading: cpu.threads > cpu.cores,

    // Memory Specs
    memorySupport: cpu.supportedDdr.join(" / "),
    maxMemorySize: cpu.manufacturer === "Apple" ? "Up to 128 GB Unified" : "128 GB / 192 GB",
    memoryChannels: "2 Channels (Dual Channel)",
    memoryBandwidth: `${Math.round(41.6 + (cpu.releaseYear - 2020) * 12)} GB/s`,

    // Integrated Graphics & Peripherals
    iGpuModel: iGpuName,
    pcieVersion: cpu.releaseYear >= 2022 ? "PCIe 5.0" : "PCIe 4.0",
    pcieLanes: "20 Express Lanes"
  };
}

export function getGpuTechnicalDetails(gpu: GPU, allGpus: GPU[]): GpuTechnicalDetails {
  const sortedGpus = [...allGpus].sort((a, b) => b.relativePowerScore - a.relativePowerScore);
  const rank = sortedGpus.findIndex((g) => g.id === gpu.id) + 1;
  const name = gpu.name.toLowerCase();
  const score = gpu.relativePowerScore;

  let arch = gpu.architecture || "Graphics Architecture";
  let node = "12nm FFN";
  let vramType = "GDDR6";
  let gpuCode = "AD102";
  let cudaCoresCount = Math.round(score * 22);
  let baseClockMHz = Math.round(1400 + score * 1.5);
  let boostClockMHz = Math.round(1750 + score * 1.8);
  let transistorsCount = `${(Math.round((score * 120 + 2000) / 100) / 10).toFixed(1)} Billion`;
  let texFillRate = (score * 1.8 + 45).toFixed(1);
  let tflopsVal = (score * 0.08 + 1.2).toFixed(2);
  let ropsCount = gpu.vramGB >= 16 ? 96 : gpu.vramGB >= 12 ? 64 : 32;
  let tmusCount = Math.round(cudaCoresCount / 16);

  if (name.includes("4090")) {
    arch = "Ada Lovelace";
    gpuCode = "AD102";
    node = "TSMC 4N (Custom 5nm)";
    vramType = "GDDR6X";
    cudaCoresCount = 16384;
    baseClockMHz = 2235;
    boostClockMHz = 2520;
    transistorsCount = "76.3 Billion";
    tflopsVal = "82.58";
    texFillRate = "1290.2";
    ropsCount = 176;
    tmusCount = 512;
  } else if (name.includes("4080")) {
    arch = "Ada Lovelace";
    gpuCode = "AD103";
    node = "TSMC 4N (Custom 5nm)";
    vramType = "GDDR6X";
    cudaCoresCount = 9728;
    baseClockMHz = 2205;
    boostClockMHz = 2505;
    transistorsCount = "45.9 Billion";
    tflopsVal = "48.74";
    texFillRate = "761.5";
    ropsCount = 112;
    tmusCount = 304;
  } else if (name.includes("4070")) {
    arch = "Ada Lovelace";
    gpuCode = "AD104";
    node = "TSMC 4N (Custom 5nm)";
    vramType = "GDDR6X";
    cudaCoresCount = 5888;
    baseClockMHz = 1920;
    boostClockMHz = 2475;
    transistorsCount = "35.8 Billion";
    tflopsVal = "29.15";
    texFillRate = "455.4";
    ropsCount = 64;
    tmusCount = 184;
  } else if (name.includes("3080")) {
    arch = "Ampere";
    gpuCode = "GA102";
    node = "8nm Samsung";
    vramType = "GDDR6X";
    cudaCoresCount = 8704;
    baseClockMHz = 1440;
    boostClockMHz = 1710;
    transistorsCount = "28.3 Billion";
    tflopsVal = "29.77";
    texFillRate = "465.1";
    ropsCount = 96;
    tmusCount = 272;
  } else if (name.includes("3060")) {
    arch = "Ampere";
    gpuCode = "GA106";
    node = "8nm Samsung";
    vramType = "GDDR6";
    cudaCoresCount = 3584;
    baseClockMHz = 1320;
    boostClockMHz = 1777;
    transistorsCount = "12.0 Billion";
    tflopsVal = "12.74";
    texFillRate = "199.0";
    ropsCount = 48;
    tmusCount = 112;
  } else if (name.includes("1660")) {
    arch = "Turing";
    gpuCode = "TU116";
    node = "12nm FFN";
    vramType = "GDDR5";
    cudaCoresCount = 1408;
    baseClockMHz = 1530;
    boostClockMHz = 1785;
    transistorsCount = "6.6 Billion";
    tflopsVal = "5.027";
    texFillRate = "157.1";
    ropsCount = 48;
    tmusCount = 88;
  } else if (name.includes("1050 ti") || name.includes("1050ti")) {
    arch = "Pascal";
    gpuCode = "GP107";
    node = "14nm Samsung";
    vramType = "GDDR5";
    cudaCoresCount = 768;
    baseClockMHz = 1291;
    boostClockMHz = 1392;
    transistorsCount = "3.3 Billion";
    tflopsVal = "2.138";
    texFillRate = "66.82";
    ropsCount = 32;
    tmusCount = 48;
  } else if (name.includes("apple")) {
    arch = "Apple Silicon Architecture";
    gpuCode = "Apple iGPU";
    node = "TSMC 3nm / 5nm";
    vramType = "Unified System Memory";
  } else if (gpu.isIntegrated || name.includes("vega") || name.includes("uhd") || name.includes("iris")) {
    arch = "Integrated Graphics (iGPU)";
    gpuCode = "Integrated SoC";
    node = "7nm / 10nm";
    vramType = "Shared System RAM";
  }

  const effScore = (Math.min(5, Math.max(1, (score / gpu.tdpW) * 2.2))).toFixed(2);
  const valScore = (Math.min(9.9, Math.max(3, (score / 45) + 2.0))).toFixed(2);

  const msrpEst = `$${Math.min(1999, Math.max(120, Math.round(score * 2.8)))}`;

  const l1CacheStr = gpu.isIntegrated ? "256 KB L1 Cache" : gpu.vramGB >= 12 ? "1.4 MB L1 Cache" : "288 KB L1 Cache";
  const l2CacheStr = gpu.vramGB >= 16 ? "96 MB L2 Cache" : gpu.vramGB >= 12 ? "48 MB L2 Cache" : "1.5 MB L2 Cache";

  return {
    rank,
    totalCount: allGpus.length,
    popularityRank: Math.min(allGpus.length, Math.max(1, Math.round(rank * 0.85 + 1))),
    marketSegment: gpu.isIntegrated ? "Integrated Mobile / SoC GPU" : "Desktop Gaming GPU",
    designer: gpu.manufacturer,
    architectureCodename: arch,
    gpuCodeName: gpuCode,
    releaseDate: `${gpu.releaseYear}`,
    launchMsrp: msrpEst,
    powerEfficiencyScore: `${effScore} Efficiency`,
    costEffectivenessScore: `${valScore} Rating`,

    // Detailed Specs
    cudaCores: `${cudaCoresCount} Shaders`,
    baseClock: `${baseClockMHz} MHz`,
    boostClock: `${boostClockMHz} MHz`,
    transistors: transistorsCount,
    processNode: node,
    powerDrawTdp: `${gpu.tdpW} Watt`,
    maxTemp: "85 °C",
    textureFillRate: `${texFillRate} GTexel/s`,
    tflops: `${tflopsVal} TFLOPS`,
    rops: ropsCount,
    tmus: tmusCount,
    l1Cache: l1CacheStr,
    l2Cache: l2CacheStr,

    // Form Factor & Compatibility
    interface: gpu.releaseYear >= 2022 ? "PCIe 4.0 x16" : "PCIe 3.0 x16",
    length: gpu.isIntegrated ? "N/A (Built-in)" : gpu.vramGB >= 16 ? "304 mm" : "229 mm",
    slotWidth: gpu.isIntegrated ? "Integrated" : gpu.vramGB >= 16 ? "3-slot" : "2-slot",
    powerConnectors: gpu.isIntegrated ? "None" : gpu.tdpW >= 250 ? "1x 16-pin 12VHPWR" : gpu.tdpW >= 100 ? "1x 8-pin" : "None",

    // VRAM Capacity and Type
    memoryType: vramType,
    maxVramAmount: gpu.manufacturer === "Apple" ? `${gpu.vramGB} GB Unified` : gpu.isIntegrated ? `${gpu.vramGB} GB Shared` : `${gpu.vramGB} GB`,
    memoryBusWidth: gpu.vramGB >= 16 ? "384 Bit" : gpu.vramGB >= 12 ? "192 Bit" : "128 Bit",
    memoryClockSpeed: `${Math.round(14000 + score * 10)} MHz`,
    memoryBandwidth: `${Math.round(gpu.vramGB * 32 + score * 0.8)} GB/s`,
    sharedMemory: gpu.isIntegrated ? "Dynamic System RAM" : "-",

    // Connectivity & Outputs
    displayConnectors: gpu.isIntegrated ? "1x HDMI, 1x eDP" : "1x HDMI 2.1, 3x DisplayPort 1.4a",
    hdmiSupport: true,
    gsyncSupport: gpu.manufacturer === "NVIDIA" ? "G-SYNC Compatible" : gpu.manufacturer === "AMD" ? "FreeSync Premium" : "Adaptive Sync",

    // Supported Technologies
    vrReady: gpu.relativePowerScore >= 40,
    ansel: gpu.manufacturer === "NVIDIA",

    // API and SDK Support
    directX: gpu.releaseYear >= 2020 ? "12 Ultimate (12_2)" : "12 (12_1)",
    shaderModel: gpu.releaseYear >= 2022 ? "6.7" : "6.5",
    openGL: "4.6",
    openCL: "3.0",
    vulkan: "1.3",
    cuda: gpu.manufacturer === "NVIDIA" ? "CUDA Supported" : gpu.manufacturer === "AMD" ? "ROCm Supported" : "OneAPI Supported"
  };
}
