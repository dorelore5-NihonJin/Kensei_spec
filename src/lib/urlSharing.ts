import type { CPU, GPU, RAMProfile, Game, StorageType } from "./types";

export interface SharedBuildState {
  cpu: CPU | null;
  gpu: GPU | null;
  ram: RAMProfile | null;
  ramCap: number;
  storage: StorageType;
  game: Game | null;
  resolution: "1080p" | "1440p" | "4K";
  preset: "Low" | "Medium" | "High" | "Ultra";
  dlss: "Off" | "Quality" | "Performance";
  rayTracing: "Off" | "Medium" | "Ultra";
  frameGen: boolean;
}

/**
 * Encodes the current PC build configuration into URL search parameters.
 */
export function encodeBuildToUrl(
  cpu: CPU | null,
  gpu: GPU | null,
  ram: RAMProfile | null,
  ramCap: number,
  storage: StorageType,
  game: Game | null,
  resolution: "1080p" | "1440p" | "4K",
  preset: "Low" | "Medium" | "High" | "Ultra",
  dlss: "Off" | "Quality" | "Performance",
  rayTracing: "Off" | "Medium" | "Ultra",
  frameGen: boolean
): string {
  const params = new URLSearchParams();

  if (cpu) params.set("cpu", cpu.id);
  if (gpu) params.set("gpu", gpu.id);
  if (ram) params.set("ram", ram.id);
  if (ramCap !== 32) params.set("cap", ramCap.toString());
  if (storage !== "NVMe Gen3") params.set("storage", storage);

  if (game) params.set("game", game.id);
  if (resolution !== "1080p") params.set("res", resolution);
  if (preset !== "High") params.set("preset", preset);
  if (dlss !== "Off") params.set("dlss", dlss);
  if (rayTracing !== "Off") params.set("rt", rayTracing);
  if (frameGen) params.set("fg", "1");

  const baseUrl = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Decodes URL search parameters into hardware component IDs and settings.
 */
export function decodeBuildFromUrl(
  cpus: CPU[],
  gpus: GPU[],
  ramProfiles: RAMProfile[],
  games: Game[]
): SharedBuildState | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const cpuId = params.get("cpu");
  const gpuId = params.get("gpu");
  const ramId = params.get("ram");
  const gameId = params.get("game");

  // Only consider it a shared build link if at least CPU, GPU, or Game is present in the URL params
  if (!cpuId && !gpuId && !gameId) {
    return null;
  }

  const cpu = cpuId ? cpus.find((c) => c.id === cpuId) || null : null;
  const gpu = gpuId ? gpus.find((g) => g.id === gpuId) || null : null;
  const ram = ramId ? ramProfiles.find((r) => r.id === ramId) || null : null;
  const game = gameId ? games.find((g) => g.id === gameId) || null : null;

  const ramCap = parseInt(params.get("cap") || "32") || 32;
  const storage = (params.get("storage") || "NVMe Gen3") as StorageType;
  const resolution = (params.get("res") || "1080p") as "1080p" | "1440p" | "4K";
  const preset = (params.get("preset") || "High") as "Low" | "Medium" | "High" | "Ultra";
  const dlss = (params.get("dlss") || "Off") as "Off" | "Quality" | "Performance";
  const rayTracing = (params.get("rt") || "Off") as "Off" | "Medium" | "Ultra";
  const frameGen = params.get("fg") === "1";

  return {
    cpu,
    gpu,
    ram,
    ramCap,
    storage,
    game,
    resolution,
    preset,
    dlss,
    rayTracing,
    frameGen
  };
}
