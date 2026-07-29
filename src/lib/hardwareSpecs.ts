import type { CPU, GPU } from "./types";

export interface TechnicalDetails {
  rank: number;
  totalCount: number;
  popularityRank: number;
  marketSegment: string;
  architectureCodename: string;
  processNode: string;
  baseClock: string;
  boostClock: string;
  cacheInfo: string;
  powerDrawTdp: string;
  recommendedPsu: string;
  platformSocket: string;
  memorySupport: string;
  powerEfficiencyScore: string;
  costEffectivenessScore: string;
  releaseDate: string;
}

// Map CPU architecture codenames and process nodes based on model names
export function getCpuTechnicalDetails(cpu: CPU, allCpus: CPU[]): TechnicalDetails {
  // Compute global rank by sorting all CPUs descending by score
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
  } else if (name.includes("pentium 4")) {
    arch = "NetBurst (Prescott)";
    node = "90nm CMOS";
    baseClock = "3.00 GHz";
    boostClock = "3.00 GHz (No Turbo)";
  } else if (name.includes("core 2 duo")) {
    arch = "Conroe / Wolfdale";
    node = "65nm / 45nm";
    baseClock = "2.40 GHz";
    boostClock = "2.66 GHz";
  }

  const score = Math.round(cpu.singleCoreScore * 0.6 + (cpu.multiCoreScore / 10) * 0.4 * 10);
  const effScore = (Math.min(5, Math.max(1, (score / cpu.tdpW) * 1.8))).toFixed(2);
  const valScore = (Math.min(9.9, Math.max(3, (score / 35) + 2.5))).toFixed(2);

  return {
    rank,
    totalCount: allCpus.length,
    popularityRank: Math.min(allCpus.length, Math.max(1, Math.round(rank * 0.8 + 2))),
    marketSegment: cpu.cores >= 16 ? "Enthusiast Workstation" : "Desktop Gaming Processor",
    architectureCodename: arch,
    processNode: node,
    baseClock,
    boostClock,
    cacheInfo: cpu.is3DVCache ? `${cpu.l3CacheMB} MB (AMD 3D V-Cache)` : `${cpu.l3CacheMB} MB L3 Cache`,
    powerDrawTdp: `${cpu.tdpW} W TDP`,
    recommendedPsu: `${Math.max(400, cpu.tdpW * 3 + 250)} W`,
    platformSocket: `Socket ${cpu.socket}`,
    memorySupport: cpu.supportedDdr.join(" / "),
    powerEfficiencyScore: `${effScore} / 5.00`,
    costEffectivenessScore: `${valScore} / 10.0`,
    releaseDate: `${cpu.releaseYear}`
  };
}

// Map GPU architecture codenames and process nodes based on model names
export function getGpuTechnicalDetails(gpu: GPU, allGpus: GPU[]): TechnicalDetails {
  // Compute global rank by sorting all GPUs descending by relative power score
  const sortedGpus = [...allGpus].sort((a, b) => b.relativePowerScore - a.relativePowerScore);
  const rank = sortedGpus.findIndex((g) => g.id === gpu.id) + 1;
  const name = gpu.name.toLowerCase();

  let arch = gpu.architecture || "Graphics Architecture";
  let node = "12nm FFN";
  let vramType = "GDDR6";

  if (name.includes("apple m4")) {
    arch = "Apple M4 Custom Architecture";
    node = "TSMC N3E (3nm)";
    vramType = "Unified LPDDR5X";
  } else if (name.includes("apple m3")) {
    arch = "Apple M3 Custom (Dynamic Caching)";
    node = "TSMC N3B (3nm)";
    vramType = "Unified LPDDR5";
  } else if (name.includes("apple m2")) {
    arch = "Apple M2 Custom Architecture";
    node = "TSMC N5P (5nm)";
    vramType = "Unified LPDDR5";
  } else if (name.includes("apple m1")) {
    arch = "Apple M1 Custom Architecture";
    node = "TSMC N5 (5nm)";
    vramType = "Unified LPDDR4X";
  } else if (name.includes("rtx 40") || name.includes("4070") || name.includes("4080") || name.includes("4090")) {
    arch = "Ada Lovelace";
    node = "TSMC 4N (Custom 5nm)";
    vramType = "GDDR6X";
  } else if (name.includes("rtx 30") || name.includes("3070") || name.includes("3080") || name.includes("3090")) {
    arch = "Ampere";
    node = "8nm Samsung";
    vramType = name.includes("3080") || name.includes("3090") ? "GDDR6X" : "GDDR6";
  } else if (name.includes("rtx 20") || name.includes("gtx 16")) {
    arch = "Turing";
    node = "12nm FFN";
    vramType = "GDDR6";
  } else if (name.includes("gtx 10") || name.includes("1080") || name.includes("1060")) {
    arch = "Pascal";
    node = "16nm FinFET";
    vramType = name.includes("1080") ? "GDDR5X" : "GDDR5";
  } else if (name.includes("arc b5") || name.includes("arc b7") || name.includes("battlemage")) {
    arch = "Xe2 Battlemage";
    node = "TSMC N4 (4nm)";
    vramType = "GDDR6";
  } else if (name.includes("arc a") || name.includes("alchemist")) {
    arch = "Xe-HPG Alchemist";
    node = "TSMC N6 (6nm)";
    vramType = "GDDR6";
  } else if (name.includes("gtx 7") || name.includes("750")) {
    arch = "Maxwell / Kepler";
    node = "28nm TSMC";
    vramType = "GDDR5";
  } else if (name.includes("7800") || name.includes("7900") || name.includes("9600")) {
    arch = "Curie / Tesla";
    node = "90nm / 65nm";
    vramType = "GDDR3";
  }

  const score = gpu.relativePowerScore;
  const effScore = (Math.min(5, Math.max(1, (score / gpu.tdpW) * 2.2))).toFixed(2);
  const valScore = (Math.min(9.9, Math.max(3, (score / 45) + 2.0))).toFixed(2);

  let memoryStr = `${gpu.vramGB} GB ${vramType}`;
  if (gpu.manufacturer === "Apple") {
    memoryStr = `${gpu.vramGB} GB Unified Memory (Shared System RAM)`;
  } else if (gpu.isIntegrated || name.includes("igpu") || name.includes("vega") || name.includes("intel hd") || name.includes("uhd")) {
    memoryStr = `Up to ${gpu.vramGB} GB Shared System RAM (Allocated iGPU VRAM)`;
  }

  return {
    rank,
    totalCount: allGpus.length,
    popularityRank: Math.min(allGpus.length, Math.max(1, Math.round(rank * 0.85 + 1))),
    marketSegment: gpu.isIntegrated ? "Integrated Mobile / SoC GPU" : "Desktop Gaming GPU",
    architectureCodename: arch,
    processNode: node,
    baseClock: `${Math.round(1400 + score * 2)} MHz`,
    boostClock: `${Math.round(1800 + score * 2.5)} MHz`,
    cacheInfo: `${gpu.vramGB >= 12 ? "48 MB L2 Cache" : "32 MB L2 Cache"}`,
    powerDrawTdp: `${gpu.tdpW} W TDP`,
    recommendedPsu: `${gpu.recommendedPsuW} W`,
    platformSocket: gpu.isIntegrated ? "Integrated SoC / Soldered" : "PCIe 4.0 x16",
    memorySupport: memoryStr,
    powerEfficiencyScore: `${effScore} / 5.00`,
    costEffectivenessScore: `${valScore} / 10.0`,
    releaseDate: `${gpu.releaseYear}`
  };
}
