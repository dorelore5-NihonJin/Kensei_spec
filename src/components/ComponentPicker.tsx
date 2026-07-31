import { useState, useMemo } from "react";
import type { CPU, GPU, RAMProfile, StorageType } from "../lib/types";
import { Cpu, Tv, Database, HardDrive, Search, Filter, AlertTriangle, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface ComponentPickerProps {
  cpus: CPU[];
  gpus: GPU[];
  ramProfiles: RAMProfile[];
  selectedCpu: CPU | null;
  setSelectedCpu: (val: CPU | null) => void;
  selectedGpu: GPU | null;
  setSelectedGpu: (val: GPU | null) => void;
  selectedRam: RAMProfile | null;
  setSelectedRam: (val: RAMProfile | null) => void;
  ramCapacityGB: number;
  setRamCapacityGB: (val: number) => void;
  selectedStorage: StorageType;
  setSelectedStorage: (val: StorageType) => void;
  ramChannel: "Single" | "Dual";
  setRamChannel: (val: "Single" | "Dual") => void;
}

export default function ComponentPicker({
  cpus,
  gpus,
  ramProfiles,
  selectedCpu,
  setSelectedCpu,
  selectedGpu,
  setSelectedGpu,
  selectedRam,
  setSelectedRam,
  ramCapacityGB,
  setRamCapacityGB,
  selectedStorage,
  setSelectedStorage,
  ramChannel,
  setRamChannel
}: ComponentPickerProps) {
  const { t } = useLanguage();
  // CPU state
  const [cpuQuery, setCpuQuery] = useState("");
  const [cpuMfgFilter, setCpuMfgFilter] = useState<"All" | "Intel" | "AMD">("All");
  const [cpuYearRange, setCpuYearRange] = useState<[number, number]>([2005, 2026]);
  const [isCpuFocused, setIsCpuFocused] = useState(false);

  // GPU state
  const [gpuQuery, setGpuQuery] = useState("");
  const [gpuMfgFilter, setGpuMfgFilter] = useState<"All" | "NVIDIA" | "AMD" | "Intel">("All");
  const [gpuYearRange, setGpuYearRange] = useState<[number, number]>([2005, 2026]);
  const [isGpuFocused, setIsGpuFocused] = useState(false);

  // Filters
  const filteredCpus = useMemo(() => {
    return cpus.filter((cpu) => {
      const matchQuery = cpu.name.toLowerCase().includes(cpuQuery.toLowerCase());
      const matchMfg = cpuMfgFilter === "All" || cpu.manufacturer === cpuMfgFilter;
      const matchYear = cpu.releaseYear >= cpuYearRange[0] && cpu.releaseYear <= cpuYearRange[1];
      return matchQuery && matchMfg && matchYear;
    });
  }, [cpus, cpuQuery, cpuMfgFilter, cpuYearRange]);

  const filteredGpus = useMemo(() => {
    return gpus.filter((gpu) => {
      const matchQuery = gpu.name.toLowerCase().includes(gpuQuery.toLowerCase());
      const matchMfg = gpuMfgFilter === "All" || gpu.manufacturer === gpuMfgFilter;
      const matchYear = gpu.releaseYear >= gpuYearRange[0] && gpu.releaseYear <= gpuYearRange[1];
      return matchQuery && matchMfg && matchYear;
    });
  }, [gpus, gpuQuery, gpuMfgFilter, gpuYearRange]);

  const filteredRamProfiles = useMemo(() => {
    if (!selectedCpu) return ramProfiles;
    return ramProfiles.filter((r) => selectedCpu.supportedDdr.includes(r.generation));
  }, [ramProfiles, selectedCpu]);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-6">
      
      {/* Complete Hardware Build Matrix Summary Badge */}
      {selectedCpu && selectedGpu && selectedRam && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 rounded-2xl text-xs font-extrabold text-emerald-900 dark:text-emerald-300 gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="bg-emerald-600 text-white text-[10px] px-2.5 py-0.5 rounded-full uppercase font-black tracking-wider shadow-xs">
              BUILD ACTIVE
            </span>
            <span className="font-extrabold text-emerald-900 dark:text-emerald-300">
              {selectedCpu.name} • {selectedGpu.name} • {ramCapacityGB}GB {selectedRam.generation} ({ramChannel}) • {selectedStorage}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedCpu(null);
              setSelectedGpu(null);
              setSelectedRam(null);
            }}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 px-2.5 py-1 rounded-xl text-xs font-black transition self-end sm:self-auto shrink-0"
          >
            {t("picker.reset_hardware")}
          </button>
        </div>
      )}

      {/* Step Title Header */}
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
        <h3 className="text-xl font-black flex items-center gap-2.5 text-[#1E2022] dark:text-white tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-[#E88D9F]/15 text-[#E88D9F] flex items-center justify-center font-black shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          {t("step1.title")}
        </h3>
        <span className="text-[10px] bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-black px-3 py-1 rounded-full uppercase tracking-wider">
          {t("nav.simulator")}
        </span>
      </div>

      {/* ----------------- CPU SELECTOR ----------------- */}
      <div className="relative flex flex-col gap-2">
        <label className="block text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-[#8A9A86]" /> {t("picker.cpu_model")}</span>
          {selectedCpu && (
            <span className="text-[10px] text-[#8A9A86] dark:text-[#A4B5A0] bg-[#8A9A86]/15 dark:bg-[#8A9A86]/25 px-2.5 py-0.5 rounded-full font-black">
              Socket {selectedCpu.socket} • {selectedCpu.is3DVCache ? "3D V-Cache Boost" : t("picker.standard_l3")}
            </span>
          )}
        </label>

        {selectedCpu ? (
          <div className="group relative overflow-hidden bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#8A9A86]/40 transition duration-200 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#8A9A86] text-white flex items-center justify-center font-black text-xs uppercase shadow-md shrink-0">
                {selectedCpu.socket}
              </div>
              <div>
                <div className="font-black text-sm text-[#1E2022] dark:text-white flex items-center gap-2">
                  {selectedCpu.name}
                  {selectedCpu.is3DVCache && (
                    <span className="text-[9px] bg-[#E88D9F] text-white px-2 py-0.5 rounded font-black tracking-wider uppercase shadow-xs">3D V-Cache</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
                  {selectedCpu.manufacturer} • {selectedCpu.cores} Cores / {selectedCpu.threads} Threads • {selectedCpu.releaseYear} • {selectedCpu.tdpW}W TDP
                </div>
              </div>
            </div>

            {/* Performance Score Meter */}
            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-black/10 dark:border-white/10 pt-3 sm:pt-0 sm:pl-4">
              <div className="flex flex-col gap-1.5 min-w-[130px]">
                <div className="flex justify-between text-[10px] font-black text-[#1E2022] dark:text-gray-300 uppercase">
                  <span>{t("picker.single_core")}</span>
                  <span className="text-[#1E2022] dark:text-white font-mono font-black">{selectedCpu.singleCoreScore}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#8A9A86] h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (selectedCpu.singleCoreScore / 500) * 100)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] font-black text-[#1E2022] dark:text-gray-300 uppercase">
                  <span>{t("picker.multi_core")}</span>
                  <span className="text-[#1E2022] dark:text-white font-mono font-black">{selectedCpu.multiCoreScore}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#E88D9F] h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (selectedCpu.multiCoreScore / 5000) * 100)}%` }} />
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCpu(null);
                  setCpuQuery("");
                }}
                className="text-xs text-red-600 dark:text-red-400 font-black hover:bg-red-500/10 active:scale-95 px-3 py-2 rounded-xl transition shrink-0"
              >
                {t("picker.change")}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center gap-2.5 border border-black/15 dark:border-white/15 bg-gray-50 dark:bg-[#121315] rounded-2xl px-4 py-3 shadow-xs focus-within:ring-2 focus-within:ring-[#E88D9F]/40 transition">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search 150+ CPUs (e.g. Ryzen 7 9800X3D, Core i9-14900K)..."
                className="w-full text-xs font-semibold outline-none bg-transparent text-[#1E2022] dark:text-white placeholder:text-gray-400"
                value={cpuQuery}
                onChange={(e) => {
                  setCpuQuery(e.target.value);
                  setIsCpuFocused(true);
                }}
                onFocus={() => setIsCpuFocused(true)}
              />
            </div>

            {/* Advanced CPU Filters */}
            <div className="mt-2 flex flex-wrap items-center gap-2 bg-black/5 dark:bg-white/5 p-2.5 rounded-2xl border border-black/10 dark:border-white/10">
              <span className="text-[10px] font-black text-[#1E2022] dark:text-gray-300 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#8A9A86]" /> Brand:
              </span>
              <div className="flex bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-xl p-0.5 text-xs">
                {["All", "Intel", "AMD"].map((mfg) => (
                  <button
                    key={mfg}
                    type="button"
                    onClick={() => setCpuMfgFilter(mfg as any)}
                    className={`px-3 py-1 rounded-lg font-extrabold transition active:scale-95 ${
                      cpuMfgFilter === mfg
                        ? "bg-[#8A9A86] text-white shadow-xs"
                        : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022]"
                    }`}
                  >
                    {mfg}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-[#1E2022] dark:text-gray-300 font-extrabold ml-auto">
                <span>Release Year:</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-lg p-1 font-bold text-[#1E2022] dark:text-white outline-none cursor-pointer"
                  value={cpuYearRange[0]}
                  onChange={(e) => setCpuYearRange([Number(e.target.value), cpuYearRange[1]])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">{y}</option>
                  ))}
                </select>
                <span>to</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-lg p-1 font-bold text-[#1E2022] dark:text-white outline-none cursor-pointer"
                  value={cpuYearRange[1]}
                  onChange={(e) => setCpuYearRange([cpuYearRange[0], Number(e.target.value)])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Backdrop & Suggestions list */}
            {isCpuFocused && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsCpuFocused(false)} />
                <div className="absolute z-30 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white dark:bg-[#1A1C1E] border border-black/15 dark:border-white/15 rounded-2xl shadow-2xl p-2 flex flex-col gap-0.5">
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 font-black px-3 py-1.5 uppercase border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                    <span>Suggestions ({filteredCpus.length} matches)</span>
                    <button onClick={() => setIsCpuFocused(false)} className="text-red-500 hover:text-red-700 font-black flex items-center gap-1"><X className="w-3 h-3" /> Close</button>
                  </div>
                  {filteredCpus.length === 0 ? (
                    <div className="text-xs text-gray-500 dark:text-gray-400 py-4 text-center font-bold">No match found. Adjust search or year filter.</div>
                  ) : (
                    filteredCpus.slice(0, 15).map((cpu) => (
                      <button
                        key={cpu.id}
                        type="button"
                        onClick={() => {
                          setSelectedCpu(cpu);
                          setIsCpuFocused(false);
                          const compatibleRams = ramProfiles.filter((r) => cpu.supportedDdr.includes(r.generation));
                          if (compatibleRams.length > 0 && (!selectedRam || !cpu.supportedDdr.includes(selectedRam.generation))) {
                            setSelectedRam(compatibleRams[0]);
                          }
                        }}
                        className="text-left w-full px-3 py-2 hover:bg-[#E88D9F]/10 hover:text-[#E88D9F] rounded-xl transition text-xs flex justify-between items-center font-bold"
                      >
                        <div>
                          <span className="font-black text-[#1E2022] dark:text-white">{cpu.name}</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-2">
                            ({cpu.cores}C/{cpu.threads}T • {cpu.releaseYear} • {cpu.socket})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded font-bold">
                          {cpu.singleCoreScore} SC / {cpu.multiCoreScore} MC
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ----------------- RAM SELECTOR ----------------- */}
      <div className="flex flex-col gap-3.5 border-t border-black/10 dark:border-white/10 pt-4">
        <label className="block text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-[#8A9A86]" /> {t("picker.ram_section")}</span>
          {!selectedCpu && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-black flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Choose a CPU first
            </span>
          )}
        </label>

        {/* RAM Capacity Picker (Exact GB) */}
        <div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-wider mb-1.5">
            {t("picker.total_ram")} <span className="text-[#E88D9F] font-mono font-black">{ramCapacityGB} GB</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[8, 16, 32, 64, 128].map((cap) => (
              <button
                key={cap}
                type="button"
                onClick={() => setRamCapacityGB(cap)}
                className={`py-2 text-xs font-black rounded-xl border transition duration-150 active:scale-95 ${
                  ramCapacityGB === cap
                    ? "border-[#E88D9F] bg-[#E88D9F] text-white shadow-md"
                    : "border-black/10 dark:border-white/10 bg-white dark:bg-[#121315] text-[#1E2022] dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {cap} GB
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Profile choose */}
          <div className="sm:col-span-6">
            <select
              disabled={!selectedCpu}
              value={selectedRam?.id || ""}
              onChange={(e) => {
                const profile = ramProfiles.find((p) => p.id === e.target.value);
                setSelectedRam(profile || null);
              }}
              className="w-full text-xs font-extrabold outline-none bg-white dark:bg-[#121315] border border-black/15 dark:border-white/15 rounded-2xl px-3.5 py-3 shadow-xs disabled:opacity-50 text-[#1E2022] dark:text-white cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">-- Choose RAM Speed Profile --</option>
              {filteredRamProfiles.map((ram) => (
                <option key={ram.id} value={ram.id} className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">
                  {ram.generation} @ {ram.speedMhz}MHz ({ram.speedMultiplier}x {t("picker.speed_factor")})
                </option>
              ))}
            </select>
          </div>

          {/* Channel choose */}
          <div className="sm:col-span-6 flex gap-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-1.5">
            {(["Single", "Dual"] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setRamChannel(ch)}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition duration-150 active:scale-95 ${
                  ramChannel === ch
                    ? "bg-[#8A9A86] text-white shadow-xs"
                    : "bg-white dark:bg-[#121315] text-[#1E2022] dark:text-gray-300 font-extrabold border border-black/10 dark:border-white/10 hover:bg-black/5"
                }`}
              >
                {ch === "Single" ? t("picker.single_channel") : t("picker.dual_channel")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ----------------- GPU SELECTOR ----------------- */}
      <div className="relative flex flex-col gap-2 border-t border-black/10 dark:border-white/10 pt-4">
        <label className="block text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Tv className="w-3.5 h-3.5 text-[#8A9A86]" /> {t("picker.gpu_model")}</span>
          {selectedGpu && (
            <span className="text-[10px] text-[#E88D9F] dark:text-[#E88D9F] bg-[#E88D9F]/15 dark:bg-[#E88D9F]/25 px-2.5 py-0.5 rounded-full font-black">
              {selectedGpu.vramGB}GB VRAM • {selectedGpu.architecture}
            </span>
          )}
        </label>

        {selectedGpu ? (
          <div className="group relative overflow-hidden bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#E88D9F]/40 transition duration-200 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#E88D9F] text-white flex items-center justify-center font-black text-xs uppercase shadow-md shrink-0">
                {selectedGpu.manufacturer.slice(0, 3)}
              </div>
              <div>
                <div className="font-black text-sm text-[#1E2022] dark:text-white">
                  {selectedGpu.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
                  {selectedGpu.manufacturer} • {selectedGpu.architecture} • {selectedGpu.vramGB}GB VRAM • {selectedGpu.releaseYear} • {selectedGpu.tdpW}W TDP
                </div>
              </div>
            </div>

            {/* Performance Score Meter */}
            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-black/10 dark:border-white/10 pt-3 sm:pt-0 sm:pl-4">
              <div className="flex flex-col gap-1 min-w-[130px]">
                <div className="flex justify-between items-center text-[10px] font-black text-[#E88D9F] bg-[#E88D9F]/15 dark:bg-[#E88D9F]/30 px-2 py-0.5 rounded-md self-start mb-1">
                  <span>{t("picker.vram")} {selectedGpu.vramGB}GB</span>
                </div>
                <div className="flex justify-between text-[10px] font-black text-[#1E2022] dark:text-gray-300 uppercase">
                  <span>{t("picker.ray_tracing_power")}</span>
                  <span className="text-[#1E2022] dark:text-white font-mono font-black">{selectedGpu.rayTracingPowerScore}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#E88D9F] h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (selectedGpu.rayTracingPowerScore / 1000) * 100)}%` }} />
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedGpu(null);
                  setGpuQuery("");
                }}
                className="text-xs text-red-600 dark:text-red-400 font-black hover:bg-red-500/10 active:scale-95 px-3 py-2 rounded-xl transition shrink-0"
              >
                {t("picker.change")}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center gap-2.5 border border-black/15 dark:border-white/15 bg-gray-50 dark:bg-[#121315] rounded-2xl px-4 py-3 shadow-xs focus-within:ring-2 focus-within:ring-[#E88D9F]/40 transition">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search 150+ GPUs (e.g. GeForce RTX 4070 Super, RX 7800 XT)..."
                className="w-full text-xs font-semibold outline-none bg-transparent text-[#1E2022] dark:text-white placeholder:text-gray-400"
                value={gpuQuery}
                onChange={(e) => {
                  setGpuQuery(e.target.value);
                  setIsGpuFocused(true);
                }}
                onFocus={() => setIsGpuFocused(true)}
              />
            </div>

            {/* Advanced GPU Filters */}
            <div className="mt-2 flex flex-wrap items-center gap-2 bg-black/5 dark:bg-white/5 p-2.5 rounded-2xl border border-black/10 dark:border-white/10">
              <span className="text-[10px] font-black text-[#1E2022] dark:text-gray-300 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#8A9A86]" /> Brand:
              </span>
              <div className="flex bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-xl p-0.5 text-xs">
                {["All", "NVIDIA", "AMD", "Intel"].map((mfg) => (
                  <button
                    key={mfg}
                    type="button"
                    onClick={() => setGpuMfgFilter(mfg as any)}
                    className={`px-3 py-1 rounded-lg font-extrabold transition active:scale-95 ${
                      gpuMfgFilter === mfg
                        ? "bg-[#8A9A86] text-white shadow-xs"
                        : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022]"
                    }`}
                  >
                    {mfg}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-[#1E2022] dark:text-gray-300 font-extrabold ml-auto">
                <span>Release Year:</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-lg p-1 font-bold text-[#1E2022] dark:text-white outline-none cursor-pointer"
                  value={gpuYearRange[0]}
                  onChange={(e) => setGpuYearRange([Number(e.target.value), gpuYearRange[1]])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">{y}</option>
                  ))}
                </select>
                <span>to</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-lg p-1 font-bold text-[#1E2022] dark:text-white outline-none cursor-pointer"
                  value={gpuYearRange[1]}
                  onChange={(e) => setGpuYearRange([gpuYearRange[0], Number(e.target.value)])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Backdrop & Suggestions list */}
            {isGpuFocused && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsGpuFocused(false)} />
                <div className="absolute z-20 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white dark:bg-[#1A1C1E] border border-black/15 dark:border-white/15 rounded-2xl shadow-2xl p-2 flex flex-col gap-0.5">
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 font-black px-3 py-1.5 uppercase border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                    <span>Suggestions ({filteredGpus.length} matches)</span>
                    <button onClick={() => setIsGpuFocused(false)} className="text-red-500 hover:text-red-700 font-black flex items-center gap-1"><X className="w-3 h-3" /> Close</button>
                  </div>
                  {filteredGpus.length === 0 ? (
                    <div className="text-xs text-gray-500 dark:text-gray-400 py-4 text-center font-bold">No match found. Adjust search or year filter.</div>
                  ) : (
                    filteredGpus.slice(0, 15).map((gpu) => (
                      <button
                        key={gpu.id}
                        type="button"
                        onClick={() => {
                          setSelectedGpu(gpu);
                          setIsGpuFocused(false);
                        }}
                        className="text-left w-full px-3 py-2 hover:bg-[#E88D9F]/10 hover:text-[#E88D9F] rounded-xl transition text-xs flex justify-between items-center font-bold"
                      >
                        <div>
                          <span className="font-black text-[#1E2022] dark:text-white">{gpu.name}</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-2">
                            ({gpu.vramGB}GB • {gpu.releaseYear} • {gpu.architecture})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded font-bold">
                          Power: {gpu.relativePowerScore} pts
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ----------------- STORAGE SELECTOR ----------------- */}
      <div className="flex flex-col gap-2.5 border-t border-black/10 dark:border-white/10 pt-4">
        <label className="block text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-[#8A9A86]" /> {t("picker.storage_section")}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(["HDD", "SATA SSD", "NVMe Gen3", "NVMe Gen4"] as StorageType[]).map((storageOpt) => (
            <button
              key={storageOpt}
              type="button"
              onClick={() => setSelectedStorage(storageOpt)}
              className={`px-3 py-3 text-xs font-black rounded-2xl border transition duration-150 active:scale-95 flex flex-col items-center gap-1 ${
                selectedStorage === storageOpt
                  ? "border-[#E88D9F] bg-[#E88D9F]/10 text-[#E88D9F] shadow-xs font-black"
                  : "border-black/10 dark:border-white/10 bg-white dark:bg-[#121315] hover:border-black/20 text-[#1E2022] dark:text-gray-200"
              }`}
            >
              <span className="font-black">{storageOpt}</span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 font-extrabold">
                {storageOpt === "HDD" ? t("picker.severe_stutter") : storageOpt === "SATA SSD" ? "SATA 3.0" : storageOpt === "NVMe Gen3" ? "PCIe 3.0 x4" : "PCIe 4.0 x4"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
