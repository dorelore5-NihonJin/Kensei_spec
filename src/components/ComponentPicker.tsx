import { useState, useMemo } from "react";
import type { CPU, GPU, RAMProfile, StorageType } from "../lib/types";
import { Cpu, Tv, Database, HardDrive, Search, Filter } from "lucide-react";

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
  selectedStorage,
  setSelectedStorage,
  ramChannel,
  setRamChannel
}: ComponentPickerProps) {
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
    return ramProfiles.filter((ram) => selectedCpu.supportedDdr.includes(ram.generation));
  }, [ramProfiles, selectedCpu]);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/5 dark:border-white/10 shadow-lg flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold flex items-center gap-2 text-dark-accent dark:text-white">
          <Cpu className="w-5 h-5 text-sakura-pink" />
          1. Pick Components / 構成の選択
        </h3>
        <span className="text-[10px] bg-sakura-pink/10 text-sakura-pink dark:bg-sakura-pink/20 font-black px-3 py-1 rounded-full uppercase tracking-wider">
          Specification
        </span>
      </div>

      {/* ----------------- CPU SELECTOR ----------------- */}
      <div className="relative">
        <label className="block text-xs font-black text-dark-accent/80 dark:text-white/80 mb-2 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-matcha-sage" /> CPU Model</span>
          {selectedCpu && (
            <span className="text-[10px] text-matcha-sage bg-matcha-sage/10 dark:bg-matcha-sage/20 px-2 py-0.5 rounded font-bold">
              {selectedCpu.socket} • {selectedCpu.is3DVCache ? "3D V-Cache Boost" : "Standard L3"}
            </span>
          )}
        </label>

        {selectedCpu ? (
          <div className="group relative overflow-hidden bg-matcha-sage/5 dark:bg-matcha-sage/10 border border-matcha-sage/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-matcha-sage/40 transition duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-matcha-sage/15 flex items-center justify-center font-bold text-matcha-sage text-sm">
                AM5
              </div>
              <div>
                <div className="font-extrabold text-sm text-dark-accent dark:text-white flex items-center gap-2">
                  {selectedCpu.name}
                  {selectedCpu.is3DVCache && (
                    <span className="text-[9px] bg-sakura-pink/15 text-sakura-pink px-1.5 py-0.5 rounded font-black tracking-wider uppercase">3D V-Cache</span>
                  )}
                </div>
                <div className="text-[11px] text-[#1E2022]/60 dark:text-white/60 font-semibold">
                  {selectedCpu.manufacturer} • {selectedCpu.cores} Cores / {selectedCpu.threads} Threads • {selectedCpu.releaseYear} • {selectedCpu.tdpW}W
                </div>
              </div>
            </div>

            {/* Performance score meter */}
            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                <span>Single-Core</span>
                <span className="text-dark-accent dark:text-white">{selectedCpu.singleCoreScore}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-matcha-sage h-full" style={{ width: `${Math.min(100, (selectedCpu.singleCoreScore / 500) * 100)}%` }} />
              </div>
              <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                <span>Multi-Core</span>
                <span className="text-dark-accent dark:text-white">{selectedCpu.multiCoreScore}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-sakura-pink h-full" style={{ width: `${Math.min(100, (selectedCpu.multiCoreScore / 5000) * 100)}%` }} />
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCpu(null);
                setCpuQuery("");
              }}
              className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 text-[10px] text-red-500 font-extrabold hover:underline px-2.5 py-1.5 bg-red-500/10 dark:bg-red-500/20 rounded-lg shrink-0"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center gap-2 border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#121315] rounded-2xl px-3.5 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-sakura-pink/40">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search 150+ CPUs (e.g. Ryzen 7 9800X3D, i9-14900K)..."
                className="w-full text-xs outline-none bg-transparent dark:text-white"
                value={cpuQuery}
                onChange={(e) => {
                  setCpuQuery(e.target.value);
                  setIsCpuFocused(true);
                }}
                onFocus={() => setIsCpuFocused(true)}
              />
            </div>

            {/* Advanced CPU filters */}
            <div className="mt-2 flex flex-wrap items-center gap-2 bg-black/[0.02] dark:bg-white/[0.02] p-2.5 rounded-xl border border-black/[0.03] dark:border-white/[0.03]">
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3" /> Brand:
              </span>
              <div className="flex bg-white dark:bg-[#121315] border border-black/[0.05] dark:border-white/[0.05] rounded-lg p-0.5 text-[11px]">
                {["All", "Intel", "AMD"].map((mfg) => (
                  <button
                    key={mfg}
                    type="button"
                    onClick={() => setCpuMfgFilter(mfg as any)}
                    className={`px-2 py-0.5 rounded-md font-bold transition ${
                      cpuMfgFilter === mfg
                        ? "bg-matcha-sage text-white shadow-sm"
                        : "text-gray-500 hover:text-dark-accent dark:hover:text-white"
                    }`}
                  >
                    {mfg}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold ml-auto">
                <span>Release Year:</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/[0.05] dark:border-white/[0.05] rounded p-0.5 font-bold text-gray-600 dark:text-gray-300 outline-none"
                  value={cpuYearRange[0]}
                  onChange={(e) => setCpuYearRange([Number(e.target.value), cpuYearRange[1]])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <span>to</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/[0.05] dark:border-white/[0.05] rounded p-0.5 font-bold text-gray-600 dark:text-gray-300 outline-none"
                  value={cpuYearRange[1]}
                  onChange={(e) => setCpuYearRange([cpuYearRange[0], Number(e.target.value)])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Suggestions list */}
            {isCpuFocused && (
              <div className="absolute z-30 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white dark:bg-[#1A1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl shadow-xl p-2 flex flex-col gap-0.5">
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-black px-3 py-1.5 uppercase border-b border-black/[0.03] dark:border-white/[0.03] flex justify-between">
                  <span>Suggestions ({filteredCpus.length} matches)</span>
                  <button onClick={() => setIsCpuFocused(false)} className="text-red-400 hover:text-red-600 font-black">✕ Close</button>
                </div>
                {filteredCpus.length === 0 ? (
                  <div className="text-xs text-gray-400 py-4 text-center font-bold">No match. Adjust filters.</div>
                ) : (
                  filteredCpus.slice(0, 15).map((cpu) => (
                    <button
                      key={cpu.id}
                      type="button"
                      onClick={() => {
                        setSelectedCpu(cpu);
                        setIsCpuFocused(false);
                      }}
                      className="text-left w-full px-3 py-2 hover:bg-sakura-pink/5 dark:hover:bg-sakura-pink/10 hover:text-sakura-pink rounded-xl transition text-xs flex justify-between items-center font-semibold"
                    >
                      <div>
                        <span className="font-extrabold text-dark-accent dark:text-white">{cpu.name}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-2">
                          ({cpu.cores}C/{cpu.threads}T • {cpu.releaseYear} • {cpu.socket})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                        {cpu.singleCoreScore} SC / {cpu.multiCoreScore} MC
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ----------------- RAM SELECTOR ----------------- */}
      <div>
        <label className="block text-xs font-black text-dark-accent/80 dark:text-white/80 mb-2 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-matcha-sage" /> RAM Speed & Channel Config</span>
          {!selectedCpu && <span className="text-[10px] text-amber-500 font-bold">⚠️ Choose a CPU first</span>}
        </label>

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
              className="w-full text-xs font-bold outline-none bg-white dark:bg-[#121315] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl px-3.5 py-2.5 shadow-sm disabled:opacity-50 dark:text-white cursor-pointer"
            >
              <option value="">-- Choose RAM Profile --</option>
              {filteredRamProfiles.map((ram) => (
                <option key={ram.id} value={ram.id}>
                  {ram.generation} {ram.capacityGB}GB @ {ram.speedMhz}MHz ({ram.speedMultiplier}x)
                </option>
              ))}
            </select>
          </div>

          {/* Channel choose */}
          <div className="sm:col-span-6 flex gap-1.5 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-2xl p-1">
            {(["Single", "Dual"] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setRamChannel(ch)}
                className={`flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase transition duration-150 ${
                  ramChannel === ch
                    ? "bg-matcha-sage text-white shadow-sm"
                    : "text-gray-400 hover:text-dark-accent dark:hover:text-white"
                }`}
              >
                {ch} Channel
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ----------------- GPU SELECTOR ----------------- */}
      <div className="relative">
        <label className="block text-xs font-black text-dark-accent/80 dark:text-white/80 mb-2 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Tv className="w-3.5 h-3.5 text-matcha-sage" /> GPU Model</span>
          {selectedGpu && (
            <span className="text-[10px] text-matcha-sage bg-matcha-sage/10 dark:bg-matcha-sage/20 px-2 py-0.5 rounded font-bold">
              {selectedGpu.vramGB}GB VRAM • {selectedGpu.architecture}
            </span>
          )}
        </label>

        {selectedGpu ? (
          <div className="group relative overflow-hidden bg-sakura-pink/5 dark:bg-sakura-pink/10 border border-sakura-pink/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-sakura-pink/40 transition duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sakura-pink/15 flex items-center justify-center font-bold text-sakura-pink text-sm uppercase">
                {selectedGpu.manufacturer.slice(0, 3)}
              </div>
              <div>
                <div className="font-extrabold text-sm text-dark-accent dark:text-white">
                  {selectedGpu.name}
                </div>
                <div className="text-[11px] text-[#1E2022]/60 dark:text-white/60 font-semibold">
                  {selectedGpu.manufacturer} • {selectedGpu.architecture} • {selectedGpu.vramGB}GB VRAM • {selectedGpu.releaseYear} • {selectedGpu.tdpW}W
                </div>
              </div>
            </div>

            {/* VRAM size badge & RT capability meter */}
            <div className="flex flex-col gap-1 min-w-[120px]">
              <div className="flex justify-between items-center text-[10px] font-black text-sakura-pink bg-sakura-pink/10 dark:bg-sakura-pink/20 px-2 py-0.5 rounded self-start mb-1">
                <span>VRAM Capacity: {selectedGpu.vramGB}GB</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                <span>Ray Tracing Power</span>
                <span className="text-dark-accent dark:text-white">{selectedGpu.rayTracingPowerScore}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
                <div className="bg-[#E88D9F] h-full" style={{ width: `${Math.min(100, (selectedGpu.rayTracingPowerScore / 1000) * 100)}%` }} />
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedGpu(null);
                setGpuQuery("");
              }}
              className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 text-[10px] text-red-500 font-extrabold hover:underline px-2.5 py-1.5 bg-red-500/10 dark:bg-red-500/20 rounded-lg shrink-0"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center gap-2 border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#121315] rounded-2xl px-3.5 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-sakura-pink/40">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search 150+ GPUs (e.g. GeForce RTX 4070 Super, RX 7800 XT)..."
                className="w-full text-xs outline-none bg-transparent dark:text-white"
                value={gpuQuery}
                onChange={(e) => {
                  setGpuQuery(e.target.value);
                  setIsGpuFocused(true);
                }}
                onFocus={() => setIsGpuFocused(true)}
              />
            </div>

            {/* Advanced GPU filters */}
            <div className="mt-2 flex flex-wrap items-center gap-2 bg-black/[0.02] dark:bg-white/[0.02] p-2.5 rounded-xl border border-black/[0.03] dark:border-white/[0.03]">
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3" /> Brand:
              </span>
              <div className="flex bg-white dark:bg-[#121315] border border-black/[0.05] dark:border-white/[0.05] rounded-lg p-0.5 text-[11px]">
                {["All", "NVIDIA", "AMD", "Intel"].map((mfg) => (
                  <button
                    key={mfg}
                    type="button"
                    onClick={() => setGpuMfgFilter(mfg as any)}
                    className={`px-2 py-0.5 rounded-md font-bold transition ${
                      gpuMfgFilter === mfg
                        ? "bg-matcha-sage text-white shadow-sm"
                        : "text-gray-500 hover:text-dark-accent dark:hover:text-white"
                    }`}
                  >
                    {mfg}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold ml-auto">
                <span>Release Year:</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/[0.05] dark:border-white/[0.05] rounded p-0.5 font-bold text-gray-600 dark:text-gray-300 outline-none"
                  value={gpuYearRange[0]}
                  onChange={(e) => setGpuYearRange([Number(e.target.value), gpuYearRange[1]])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <span>to</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/[0.05] dark:border-white/[0.05] rounded p-0.5 font-bold text-gray-600 dark:text-gray-300 outline-none"
                  value={gpuYearRange[1]}
                  onChange={(e) => setGpuYearRange([gpuYearRange[0], Number(e.target.value)])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Suggestions list */}
            {isGpuFocused && (
              <div className="absolute z-20 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white dark:bg-[#1A1C1E] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl shadow-xl p-2 flex flex-col gap-0.5">
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-black px-3 py-1.5 uppercase border-b border-black/[0.03] dark:border-white/[0.03] flex justify-between">
                  <span>Suggestions ({filteredGpus.length} matches)</span>
                  <button onClick={() => setIsGpuFocused(false)} className="text-red-400 hover:text-red-600 font-black">✕ Close</button>
                </div>
                {filteredGpus.length === 0 ? (
                  <div className="text-xs text-gray-400 py-4 text-center font-bold">No match. Adjust filters.</div>
                ) : (
                  filteredGpus.slice(0, 15).map((gpu) => (
                    <button
                      key={gpu.id}
                      type="button"
                      onClick={() => {
                        setSelectedGpu(gpu);
                        setIsGpuFocused(false);
                      }}
                      className="text-left w-full px-3 py-2 hover:bg-sakura-pink/5 dark:hover:bg-sakura-pink/10 hover:text-sakura-pink rounded-xl transition text-xs flex justify-between items-center font-semibold"
                    >
                      <div>
                        <span className="font-extrabold text-dark-accent dark:text-white">{gpu.name}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-2">
                          ({gpu.vramGB}GB • {gpu.releaseYear} • {gpu.architecture})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                        Power: {gpu.relativePowerScore} pts
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ----------------- STORAGE SELECTOR ----------------- */}
      <div>
        <label className="block text-xs font-black text-dark-accent/80 dark:text-white/80 mb-2 uppercase tracking-wider flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-matcha-sage" /> Storage Interface (OS & Games)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(["HDD", "SATA SSD", "NVMe Gen3", "NVMe Gen4"] as StorageType[]).map((storageOpt) => (
            <button
              key={storageOpt}
              type="button"
              onClick={() => setSelectedStorage(storageOpt)}
              className={`px-3 py-2.5 text-xs font-bold rounded-2xl border transition duration-150 flex flex-col items-center gap-1 ${
                selectedStorage === storageOpt
                  ? "border-sakura-pink bg-sakura-pink/5 text-sakura-pink"
                  : "border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#121315] hover:border-black/[0.1] text-gray-600 dark:text-gray-300"
              }`}
            >
              <span className="font-extrabold">{storageOpt}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold">
                {storageOpt === "HDD" ? "Severe stutter" : storageOpt === "SATA SSD" ? "SATA 3.0" : storageOpt === "NVMe Gen3" ? "PCIe 3.0 x4" : "PCIe 4.0 x4"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
