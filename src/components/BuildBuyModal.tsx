import { useState } from "react";
import { ShoppingCart, X, ExternalLink, ShieldCheck, Fan, Flame, Sparkles, Award, Copy, Check } from "lucide-react";
import type { CPU, GPU, RAMProfile, StorageType } from "../lib/types";
import { useLanguage } from "../context/LanguageContext";

interface BuildBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCpu: CPU | null;
  selectedGpu: GPU | null;
  selectedRam: RAMProfile | null;
  ramCapacityGB: number;
  selectedStorage: StorageType;
  psuRecommendationW: number;
}

export type BuildTier = "budget" | "premium" | "extreme";

// Accurate Socket Matcher
function getMotherboardForCpu(cpu: CPU | null, tier: BuildTier) {
  const socket = cpu?.socket || "AM5";

  if (socket === "AM5") {
    if (tier === "extreme") return { name: "ASUS ROG Crosshair X670E Hero WiFi 7", socket: "AM5", price: 620, vendor: "ASUS ROG" };
    if (tier === "premium") return { name: "ASUS ROG Strix X670E-F Gaming WiFi", socket: "AM5", price: 360, vendor: "ASUS ROG" };
    return { name: "MSI PRO B650M-A WiFi", socket: "AM5", price: 140, vendor: "MSI PRO" };
  }
  if (socket === "LGA1851") {
    if (tier === "extreme") return { name: "ASUS ROG Maximus Z890 Hero WiFi 7", socket: "LGA1851", price: 680, vendor: "ASUS ROG" };
    if (tier === "premium") return { name: "MSI MAG Z890 Tomahawk WiFi", socket: "LGA1851", price: 320, vendor: "MSI MAG" };
    return { name: "GIGABYTE Z890 EAGLE AX", socket: "LGA1851", price: 220, vendor: "Gigabyte" };
  }
  if (socket === "LGA1700") {
    if (tier === "extreme") return { name: "ASUS ROG Maximus Z790 Dark Hero", socket: "LGA1700", price: 590, vendor: "ASUS ROG" };
    if (tier === "premium") return { name: "MSI MAG Z790 Tomahawk WiFi", socket: "LGA1700", price: 260, vendor: "MSI MAG" };
    return { name: "ASRock B760M Pro RS WiFi", socket: "LGA1700", price: 120, vendor: "ASRock" };
  }
  if (socket === "AM4") {
    if (tier === "extreme") return { name: "ASUS ROG Strix X570-E Gaming WiFi", socket: "AM4", price: 290, vendor: "ASUS ROG" };
    if (tier === "premium") return { name: "Gigabyte B550 AORUS Elite V2", socket: "AM4", price: 150, vendor: "Gigabyte AORUS" };
    return { name: "MSI B450M PRO-VDH MAX", socket: "AM4", price: 75, vendor: "MSI PRO" };
  }
  if (socket === "LGA1200") {
    if (tier === "extreme") return { name: "ASUS ROG Maximus XII Hero WiFi", socket: "LGA1200", price: 280, vendor: "ASUS ROG" };
    return { name: "ASUS TUF Gaming Z590-Plus WiFi", socket: "LGA1200", price: 150, vendor: "ASUS TUF" };
  }
  if (socket === "LGA1151") {
    return { name: "ASUS ROG Strix Z390-F Gaming", socket: "LGA1151", price: 130, vendor: "ASUS ROG" };
  }
  if (socket === "LGA1150" || socket === "LGA1155") {
    return { name: "Gigabyte GA-Z97X-Gaming 5", socket, price: 80, vendor: "Gigabyte" };
  }
  if (socket === "LGA775") {
    return { name: "ASUS P5Q Deluxe (LGA775 Legacy Chipset)", socket: "LGA775", price: 45, vendor: "ASUS Legacy" };
  }
  if (socket === "AM3+" || socket === "AM2+") {
    return { name: "ASUS M5A97 R2.0 (AM3+ Legacy)", socket, price: 50, vendor: "ASUS Legacy" };
  }
  return { name: `Gigabyte Ultra Durable ${socket} Motherboard`, socket, price: 90, vendor: "Gigabyte" };
}

// Accurate Cooler Matcher based on TDP and Tier
function getCoolingForCpu(cpu: CPU | null, tier: BuildTier) {
  const tdp = cpu?.tdpW || 105;

  if (tier === "extreme") {
    return {
      type: "Custom 360mm LCD Liquid AIO",
      name: "Corsair iCUE LINK H150i LCD 360mm Liquid AIO",
      price: 290,
      vendor: "Corsair iCUE LINK",
      recommendationNote: "Extreme Tier: Features a 2.1\" IPS LCD display and iCUE LINK magnetic daisy-chain cables for ultimate cooling and zero noise.",
      isLiquid: true
    };
  }

  if (tdp >= 160 || tier === "premium") {
    return {
      type: "Liquid AIO 360mm",
      name: "DeepCool LT720 360mm ARGB Liquid AIO",
      price: 140,
      vendor: "DeepCool",
      recommendationNote: "High CPU TDP (160W+) requires a 360mm Liquid AIO to prevent heavy thermal throttling under load.",
      isLiquid: true
    };
  }

  return {
    type: "Dual Tower Air Cooler",
    name: "Thermalright Peerless Assassin 120 SE ARGB",
    price: 40,
    vendor: "Thermalright",
    recommendationNote: "High-efficiency dual-tower air cooler offers maximum silence and zero pump leak risk for mid-TDP CPUs.",
    isLiquid: false
  };
}

// Realistic Price Estimators based on Hardware Year and MSRP
function getCpuPrice(cpu: CPU | null): number {
  if (!cpu) return 300;
  if (cpu.releaseYear < 2015) return Math.min(40, Math.max(10, Math.round(cpu.multiCoreScore * 0.15)));
  if (cpu.releaseYear < 2020) return Math.min(120, Math.max(40, Math.round(cpu.multiCoreScore * 0.12)));

  // Modern CPUs (2020+)
  if (cpu.is3DVCache) return 440; // Ryzen 7 7800X3D / 9800X3D MSRP
  if (cpu.multiCoreScore >= 3500) return 550; // Core i9 / Ryzen 9
  if (cpu.multiCoreScore >= 2000) return 300; // Core i7 / Ryzen 7
  if (cpu.multiCoreScore >= 1200) return 190; // Core i5 / Ryzen 5
  return 120; // Core i3
}

function getGpuPrice(gpu: GPU | null): number {
  if (!gpu) return 600;
  if (gpu.releaseYear < 2015) return Math.min(50, Math.max(15, Math.round(gpu.relativePowerScore * 0.8)));
  if (gpu.releaseYear < 2020) return Math.min(180, Math.max(60, Math.round(gpu.relativePowerScore * 0.9)));

  // Modern GPUs (RTX 40 / RX 7000 / Arc)
  const name = gpu.name.toLowerCase();
  if (name.includes("4090")) return 1790;
  if (name.includes("4080")) return 980;
  if (name.includes("4070 ti")) return 760;
  if (name.includes("4070 super")) return 590;
  if (name.includes("4070")) return 530;
  if (name.includes("4060 ti")) return 380;
  if (name.includes("4060")) return 295;
  if (name.includes("3050")) return 185; // Fixed RTX 3050 MSRP!
  if (name.includes("7900 xtx")) return 940;
  if (name.includes("7900 xt")) return 690;
  if (name.includes("7800 xt")) return 490;
  if (name.includes("7700 xt")) return 390;
  if (name.includes("7600")) return 250;

  return Math.min(1200, Math.max(150, Math.round(gpu.relativePowerScore * 1.4)));
}

export default function BuildBuyModal({
  isOpen,
  onClose,
  selectedCpu,
  selectedGpu,
  selectedRam,
  ramCapacityGB,
  selectedStorage,
  psuRecommendationW
}: BuildBuyModalProps) {
  const { t, formatPrice } = useLanguage();
  const [tier, setTier] = useState<BuildTier>("premium");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const mobo = getMotherboardForCpu(selectedCpu, tier);
  const cooler = getCoolingForCpu(selectedCpu, tier);

  const coolerNote = tier === "extreme"
    ? t("store.cooler_extreme_note")
    : cooler.isLiquid
    ? t("store.cooler_liquid_note")
    : t("store.cooler_air_note");

  // Price calculations
  const cpuPrice = getCpuPrice(selectedCpu);
  const gpuPrice = getGpuPrice(selectedGpu);

  // RAM Price
  let ramPrice = Math.round(ramCapacityGB * 2.8 + (selectedRam?.speedMhz || 6000) * 0.012);
  if (selectedRam?.generation === "DDR2" || selectedRam?.generation === "DDR3") {
    ramPrice = Math.min(45, Math.round(ramCapacityGB * 1.5));
  }
  if (tier === "extreme") ramPrice += 60; // RGB Link premium

  // Storage Price
  let storagePrice = selectedStorage === "NVMe Gen4" ? 130 : selectedStorage === "NVMe Gen3" ? 85 : selectedStorage === "SATA SSD" ? 55 : 35;
  if (tier === "extreme") storagePrice += 70; // 4TB Upgrade

  // PSU Price & Case
  let psuPrice = Math.round(psuRecommendationW * 0.16);
  let casePrice = tier === "extreme" ? 220 : tier === "premium" ? 130 : 75;
  let caseName = tier === "extreme" ? "Lian Li O11 Dynamic EVO XL Full-Tower" : tier === "premium" ? "NZXT H7 Flow RGB Mid-Tower" : "Montech AIR 903 MAX Mesh Case";

  const totalPriceUSD = cpuPrice + gpuPrice + ramPrice + storagePrice + mobo.price + cooler.price + psuPrice + casePrice;

  // Copy Helper
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyFullBuild = () => {
    const text = `KENSEI SPEC PC BUILD:\n` +
      `1. CPU: ${selectedCpu?.name || "AMD Ryzen 7 7800X3D"}\n` +
      `2. Motherboard: ${mobo.name}\n` +
      `3. GPU: ${selectedGpu?.name || "GeForce RTX 4070 Super"}\n` +
      `4. Cooler: ${cooler.name}\n` +
      `5. RAM: ${ramCapacityGB}GB ${selectedRam?.generation || "DDR5"}-${selectedRam?.speedMhz || 6000}\n` +
      `6. SSD: 2TB ${selectedStorage}\n` +
      `7. PSU: ${psuRecommendationW}W 80+ Gold\n` +
      `8. Case: ${caseName}\n` +
      `Est. Total Price: ${formatPrice(totalPriceUSD)}`;
    handleCopyText(text, "full-build");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 text-[#1E2022] dark:text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-black/10 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E88D9F] text-white flex items-center justify-center font-black text-xl shadow-md">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black flex items-center gap-2">
                {t("store.modal_title")}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold">
                {t("store.modal_subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ACTIVE CALCULATOR SELECTION STATUS BANNER */}
        {selectedCpu && selectedGpu && selectedRam ? (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 block">
                  {t("store.sync_active_title")}
                </span>
                <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  {selectedCpu.name} • {selectedGpu.name} • {ramCapacityGB}GB {selectedRam.generation}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black bg-emerald-500 text-white px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-xs">
              {t("store.sync_active_badge")}
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-xs font-black text-amber-900 dark:text-amber-300 block">
                  {t("store.sync_default_title")}
                </span>
                <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400">
                  {t("store.sync_default_desc")}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black bg-amber-500 text-white px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-xs">
              {t("store.sync_default_badge")}
            </span>
          </div>
        )}

        {/* BUILD TIER SELECTOR (Value / Premium / Extreme) */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center justify-between">
            <span>{t("store.tier_select_title")}</span>
            <span className="text-[10px] text-[#E88D9F] font-black uppercase">
              {t("store.current_tier_label")} {tier.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/10 dark:border-white/10">
            <button
              onClick={() => setTier("budget")}
              className={`py-2 rounded-xl text-xs font-black flex flex-col items-center gap-0.5 transition ${
                tier === "budget"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022]"
              }`}
            >
              <span className="flex items-center gap-1">{t("store.tier_budget_title")}</span>
              <span className="text-[9px] opacity-80">{t("store.tier_budget_sub")}</span>
            </button>

            <button
              onClick={() => setTier("premium")}
              className={`py-2 rounded-xl text-xs font-black flex flex-col items-center gap-0.5 transition ${
                tier === "premium"
                  ? "bg-[#E88D9F] text-white shadow-xs"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022]"
              }`}
            >
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> {t("store.tier_premium_title")}</span>
              <span className="text-[9px] opacity-80">{t("store.tier_premium_sub")}</span>
            </button>

            <button
              onClick={() => setTier("extreme")}
              className={`py-2 rounded-xl text-xs font-black flex flex-col items-center gap-0.5 transition ${
                tier === "extreme"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022]"
              }`}
            >
              <span className="flex items-center gap-1"><Award className="w-3 h-3 text-amber-300" /> {t("store.tier_extreme_title")}</span>
              <span className="text-[9px] opacity-80">{t("store.tier_extreme_sub")}</span>
            </button>
          </div>
        </div>

        {/* Compatibility Certification Banner with Master Copy Button */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs text-emerald-900 dark:text-emerald-300 font-extrabold">
              <strong>{t("store.compat_verified_title")}</strong> Socket <span className="underline">{mobo.socket}</span> {t("store.compat_verified_desc")} {selectedCpu?.name || "CPU"}.
            </div>
          </div>

          <button
            onClick={handleCopyFullBuild}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] transition shrink-0 flex items-center gap-1 shadow-xs"
          >
            {copiedId === "full-build" ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedId === "full-build" ? t("store.copied_spec_btn") : t("store.copy_spec_btn")}
          </button>
        </div>

        {/* Component Buying Breakdown with Quick Copy Icons */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-extrabold">
            
            {/* 1. CPU */}
            <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#8A9A86] uppercase tracking-wider font-black">1. {t("store.comp_cpu")}</span>
                  <button
                    onClick={() => handleCopyText(selectedCpu?.name || "AMD Ryzen 7 7800X3D", "cpu")}
                    className="p-1 text-gray-400 hover:text-[#E88D9F] transition"
                    title="Copy CPU Name to Search Bar"
                  >
                    {copiedId === "cpu" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="font-black text-[#1E2022] dark:text-white block mt-0.5">{selectedCpu?.name || "AMD Ryzen 7 7800X3D"}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Socket {selectedCpu?.socket || "AM5"} • TDP {selectedCpu?.tdpW || 120}W</span>
              </div>
              <span className="font-mono text-xs font-black text-[#E88D9F]">{formatPrice(cpuPrice)}</span>
            </div>

            {/* 2. Motherboard (Exact Socket Matched) */}
            <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#8A9A86] uppercase tracking-wider font-black">2. {t("store.comp_mobo")} (Socket {mobo.socket})</span>
                  <button
                    onClick={() => handleCopyText(mobo.name, "mobo")}
                    className="p-1 text-gray-400 hover:text-[#E88D9F] transition"
                    title="Copy Motherboard Name to Search Bar"
                  >
                    {copiedId === "mobo" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="font-black text-[#1E2022] dark:text-white block mt-0.5">{mobo.name}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Socket {mobo.socket} • {mobo.vendor}</span>
              </div>
              <span className="font-mono text-xs font-black text-[#E88D9F]">{formatPrice(mobo.price)}</span>
            </div>

            {/* 3. GPU */}
            <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#E88D9F] uppercase tracking-wider font-black">3. {t("store.comp_gpu")}</span>
                  <button
                    onClick={() => handleCopyText(selectedGpu?.name || "GeForce RTX 4070 Super", "gpu")}
                    className="p-1 text-gray-400 hover:text-[#E88D9F] transition"
                    title="Copy GPU Name to Search Bar"
                  >
                    {copiedId === "gpu" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="font-black text-[#1E2022] dark:text-white block mt-0.5">{selectedGpu?.name || "GeForce RTX 4070 Super"}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{selectedGpu?.vramGB || 12}GB VRAM • {selectedGpu?.architecture || "Ada Lovelace"}</span>
              </div>
              <span className="font-mono text-xs font-black text-[#E88D9F]">{formatPrice(gpuPrice)}</span>
            </div>

            {/* 4. CPU Cooling */}
            <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#8A9A86] uppercase tracking-wider font-black flex items-center gap-1">
                    {cooler.isLiquid ? <Flame className="w-3 h-3 text-rose-500" /> : <Fan className="w-3 h-3 text-blue-500" />}
                    4. {t("store.comp_cooler")} ({cooler.type})
                  </span>
                  <button
                    onClick={() => handleCopyText(cooler.name, "cooler")}
                    className="p-1 text-gray-400 hover:text-[#E88D9F] transition"
                    title="Copy Cooler Name to Search Bar"
                  >
                    {copiedId === "cooler" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="font-black text-[#1E2022] dark:text-white block mt-0.5">{cooler.name}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{cooler.vendor} {t("store.sub_thermal_system")}</span>
              </div>
              <span className="font-mono text-xs font-black text-[#E88D9F]">{formatPrice(cooler.price)}</span>
            </div>

            {/* 5. RAM */}
            <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#8A9A86] uppercase tracking-wider font-black">5. {t("store.comp_ram")}</span>
                  <button
                    onClick={() => handleCopyText(`${ramCapacityGB}GB ${selectedRam?.generation || "DDR5"} ${selectedRam?.speedMhz || 6000}MHz`, "ram")}
                    className="p-1 text-gray-400 hover:text-[#E88D9F] transition"
                    title="Copy RAM Spec to Search Bar"
                  >
                    {copiedId === "ram" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="font-black text-[#1E2022] dark:text-white block mt-0.5">{ramCapacityGB}GB {selectedRam?.generation || "DDR5"} Kit</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{t("store.sub_ram_speed")} {selectedRam?.speedMhz || 6000} MHz {t("store.sub_dual_channel")}</span>
              </div>
              <span className="font-mono text-xs font-black text-[#E88D9F]">{formatPrice(ramPrice)}</span>
            </div>

            {/* 6. Storage */}
            <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#8A9A86] uppercase tracking-wider font-black">6. {t("store.comp_ssd")}</span>
                  <button
                    onClick={() => handleCopyText(`2TB ${selectedStorage} M.2 SSD`, "ssd")}
                    className="p-1 text-gray-400 hover:text-[#E88D9F] transition"
                    title="Copy SSD Spec to Search Bar"
                  >
                    {copiedId === "ssd" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="font-black text-[#1E2022] dark:text-white block mt-0.5">2TB {selectedStorage} M.2 SSD</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{t("store.sub_nvme_storage")}</span>
              </div>
              <span className="font-mono text-xs font-black text-[#E88D9F]">{formatPrice(storagePrice)}</span>
            </div>

            {/* 7. PSU Power Supply */}
            <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#8A9A86] uppercase tracking-wider font-black">7. {t("store.comp_psu")}</span>
                  <button
                    onClick={() => handleCopyText(`${psuRecommendationW}W 80+ Gold Modular PSU`, "psu")}
                    className="p-1 text-gray-400 hover:text-[#E88D9F] transition"
                    title="Copy PSU Spec to Search Bar"
                  >
                    {copiedId === "psu" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="font-black text-[#1E2022] dark:text-white block mt-0.5">{psuRecommendationW}W 80+ Gold Modular</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{t("store.sub_psu_compliant")}</span>
              </div>
              <span className="font-mono text-xs font-black text-[#E88D9F]">{formatPrice(psuPrice)}</span>
            </div>

            {/* 8. Chassis */}
            <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#8A9A86] uppercase tracking-wider font-black">8. {t("store.comp_case")}</span>
                  <button
                    onClick={() => handleCopyText(caseName, "case")}
                    className="p-1 text-gray-400 hover:text-[#E88D9F] transition"
                    title="Copy Case Name to Search Bar"
                  >
                    {copiedId === "case" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="font-black text-[#1E2022] dark:text-white block mt-0.5">{caseName}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{t("store.sub_case_tower")}</span>
              </div>
              <span className="font-mono text-xs font-black text-[#E88D9F]">{formatPrice(casePrice)}</span>
            </div>
          </div>
        </div>

        {/* Cooler & Thermal Advisory Banner */}
        <div className="p-3.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl text-xs text-amber-900 dark:text-amber-300 font-extrabold leading-relaxed">
          {coolerNote}
        </div>

        {/* Total Price & Store Checkout Buttons */}
        <div className="border-t border-black/10 dark:border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-black block">{t("store.total_label")}</span>
            <div className="text-xl sm:text-2xl font-black text-[#1E2022] dark:text-white flex items-center gap-3">
              <span>{formatPrice(totalPriceUSD)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`https://www.amazon.com/s?k=${encodeURIComponent(`${selectedCpu?.name || 'Gaming CPU'} ${selectedGpu?.name || 'GPU'}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-[#E88D9F] text-white font-black text-xs hover:bg-[#E88D9F]/90 transition shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> {t("store.order_amazon_btn")} <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={`https://www.newegg.com/p/pl?d=${encodeURIComponent(`${selectedCpu?.name || 'Gaming CPU'} ${selectedGpu?.name || 'GPU'}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/10 text-[#1E2022] dark:text-white font-black text-xs hover:bg-black/10 transition flex items-center justify-center gap-1.5"
            >
              {t("store.order_newegg_btn")} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
