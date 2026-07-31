import type { CPU, GPU } from "./types";

/**
 * Converts a CPU or GPU object/name into a clean, human-readable URL slug.
 * Examples:
 * "Core i9-14900K" -> "i9-14900k"
 * "GeForce RTX 5090" -> "rtx-5090"
 * "Ryzen 7 7800X3D" -> "ryzen-7-7800x3d"
 * "Core i5-10400F" -> "i5-10400f"
 * "Radeon RX 7900 XTX" -> "rx-7900-xtx"
 */
export function getHardwareSlug(item: CPU | GPU | null | undefined): string {
  if (!item || !item.name) return "";
  
  let raw = item.name.toLowerCase().trim();
  
  // Clean up common repetitive brand prefixes for ultra-clean short slugs
  raw = raw
    .replace(/^intel\s+/i, "")
    .replace(/^nvidia\s+/i, "")
    .replace(/^amd\s+/i, "")
    .replace(/^geforce\s+/i, "")
    .replace(/^radeon\s+/i, "")
    .replace(/^core\s+/i, "");

  // Replace spaces and special characters with single hyphens
  const slug = raw
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || item.id;
}

/**
 * Resolves a CPU from either a human-readable slug or internal ID.
 */
export function findCpuBySlugOrId(cpus: CPU[], query: string | null | undefined): CPU | null {
  if (!query || cpus.length === 0) return null;
  const q = query.toLowerCase().trim();

  // 1. Direct ID match
  const byId = cpus.find((c) => c.id.toLowerCase() === q);
  if (byId) return byId;

  // 2. Exact slug match
  const bySlug = cpus.find((c) => getHardwareSlug(c) === q);
  if (bySlug) return bySlug;

  // 3. Name inclusion match
  const byName = cpus.find((c) => {
    const cleanName = c.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanQ = q.replace(/[^a-z0-9]/g, "");
    return cleanName.includes(cleanQ) || cleanQ.includes(cleanName);
  });
  if (byName) return byName;

  return null;
}

/**
 * Resolves a GPU from either a human-readable slug or internal ID.
 */
export function findGpuBySlugOrId(gpus: GPU[], query: string | null | undefined): GPU | null {
  if (!query || gpus.length === 0) return null;
  const q = query.toLowerCase().trim();

  // 1. Direct ID match
  const byId = gpus.find((g) => g.id.toLowerCase() === q);
  if (byId) return byId;

  // 2. Exact slug match
  const bySlug = gpus.find((g) => getHardwareSlug(g) === q);
  if (bySlug) return bySlug;

  // 3. Name inclusion match
  const byName = gpus.find((g) => {
    const cleanName = g.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanQ = q.replace(/[^a-z0-9]/g, "");
    return cleanName.includes(cleanQ) || cleanQ.includes(cleanName);
  });
  if (byName) return byName;

  return null;
}
