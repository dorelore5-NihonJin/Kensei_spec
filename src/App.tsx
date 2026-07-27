import { useState, useMemo, useEffect } from "react";
import type { CPU, GPU, RAMProfile, Game, StorageType } from "./lib/types";

import cpuData from "./data/cpus.json";
import gpuData from "./data/gpus.json";
import ramData from "./data/ram.json";
import gameData from "./data/games.json";

import { calculatePerformance, getCompatibilityReport } from "./lib/calculator";

import {
  Cpu,
  Tv,
  HardDrive,
  Database,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Flame,
  Gamepad2,
  Sliders,
  Sparkles,
  Info,
  Layers,
  RotateCcw,
  Zap
} from "lucide-react";

// Safe casting seed data
const cpus = cpuData as CPU[];
const gpus = gpuData as GPU[];
const ramProfiles = ramData as RAMProfile[];
const games = gameData as Game[];

export default function App() {
  // --- BUILD STATE ---
  const [selectedCpu, setSelectedCpu] = useState<CPU | null>(null);
  const [selectedGpu, setSelectedGpu] = useState<GPU | null>(null);
  const [selectedRam, setSelectedRam] = useState<RAMProfile | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageType>("NVMe Gen3");

  // --- COMPONENT SEARCH STATE ---
  const [cpuQuery, setCpuQuery] = useState("");
  const [cpuMfgFilter, setCpuMfgFilter] = useState<"All" | "Intel" | "AMD">("All");
  const [cpuYearRange, setCpuYearRange] = useState<[number, number]>([2005, 2026]);
  const [isCpuFocused, setIsCpuFocused] = useState(false);

  const [gpuQuery, setGpuQuery] = useState("");
  const [gpuMfgFilter, setGpuMfgFilter] = useState<"All" | "NVIDIA" | "AMD" | "Intel">("All");
  const [gpuYearRange, setGpuYearRange] = useState<[number, number]>([2005, 2026]);
  const [isGpuFocused, setIsGpuFocused] = useState(false);

  // --- GAME & RESOLUTION STATE ---
  const [searchGameQuery, setSearchGameQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<Game>(games[2]); // Default Cyberpunk 2077
  const [selectedResolution, setSelectedResolution] = useState<"1080p" | "1440p" | "4K">("1080p");
  const [selectedPreset, setSelectedPreset] = useState<"Low" | "Medium" | "High" | "Ultra">("High");
  const [selectedDlss, setSelectedDlss] = useState<"Off" | "Quality" | "Performance">("Off");

  // --- RESET ALL STATE ---
  const handleResetBuild = () => {
    setSelectedCpu(null);
    setSelectedGpu(null);
    setSelectedRam(null);
    setSelectedStorage("NVMe Gen3");
    setCpuQuery("");
    setGpuQuery("");
    setCpuMfgFilter("All");
    setGpuMfgFilter("All");
    setCpuYearRange([2005, 2026]);
    setGpuYearRange([2005, 2026]);
  };

  // Auto-detect RAM compatibility when CPU changes
  useEffect(() => {
    if (selectedCpu) {
      if (selectedRam && !selectedCpu.supportedDdr.includes(selectedRam.generation)) {
        // Clear ram selection to force strict compliance
        setSelectedRam(null);
      }
    }
  }, [selectedCpu, selectedRam]);

  // --- FILTERS ---
  const filteredCpus = useMemo(() => {
    return cpus.filter((cpu) => {
      const matchQuery = cpu.name.toLowerCase().includes(cpuQuery.toLowerCase());
      const matchMfg = cpuMfgFilter === "All" || cpu.manufacturer === cpuMfgFilter;
      const matchYear = cpu.releaseYear >= cpuYearRange[0] && cpu.releaseYear <= cpuYearRange[1];
      return matchQuery && matchMfg && matchYear;
    });
  }, [cpuQuery, cpuMfgFilter, cpuYearRange]);

  const filteredGpus = useMemo(() => {
    return gpus.filter((gpu) => {
      const matchQuery = gpu.name.toLowerCase().includes(gpuQuery.toLowerCase());
      const matchMfg = gpuMfgFilter === "All" || gpu.manufacturer === gpuMfgFilter;
      const matchYear = gpu.releaseYear >= gpuYearRange[0] && gpu.releaseYear <= gpuYearRange[1];
      return matchQuery && matchMfg && matchYear;
    });
  }, [gpuQuery, gpuMfgFilter, gpuYearRange]);

  const filteredRamProfiles = useMemo(() => {
    if (!selectedCpu) return ramProfiles;
    return ramProfiles.filter((ram) => selectedCpu.supportedDdr.includes(ram.generation));
  }, [selectedCpu]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => game.title.toLowerCase().includes(searchGameQuery.toLowerCase()));
  }, [searchGameQuery]);

  // --- CALCULATIONS ---
  const performanceReport = useMemo(() => {
    return calculatePerformance(
      selectedCpu,
      selectedGpu,
      selectedRam,
      selectedStorage,
      selectedGame,
      selectedResolution,
      selectedPreset,
      selectedDlss
    );
  }, [selectedCpu, selectedGpu, selectedRam, selectedStorage, selectedGame, selectedResolution, selectedPreset, selectedDlss]);

  const compatibilityReport = useMemo(() => {
    return getCompatibilityReport(selectedCpu, selectedGpu, selectedRam, selectedStorage);
  }, [selectedCpu, selectedGpu, selectedRam, selectedStorage]);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1E2022] pb-20 relative px-4 sm:px-6 lg:px-8">
      {/* Background Watermarks */}
      <div className="absolute top-24 left-10 text-[10rem] font-bold text-black/[0.015] kanji-watermark select-none hidden md:block">
        構成
      </div>
      <div className="absolute top-[50%] right-10 text-[10rem] font-bold text-black/[0.015] kanji-watermark select-none hidden md:block">
        性能
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto py-8 mb-6 border-b border-black/[0.03] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#E88D9F] text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md shadow-[#E88D9F]/20">
            K
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2022] flex items-center gap-2">
              KENSEI SPEC <span className="text-xs bg-[#8A9A86] text-white px-2 py-0.5 rounded-full font-normal">PC構成シミュレーター</span>
            </h1>
            <p className="text-sm text-[#1E2022]/60 font-medium">Neo-Tokyo Soft Minimal PC Hardware Estimator</p>
          </div>
        </div>

        <button
          onClick={handleResetBuild}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white border border-black/[0.05] text-[#1E2022]/70 hover:text-red-500 rounded-xl transition duration-200 shadow-sm hover:shadow"
        >
          <RotateCcw className="w-4 h-4" /> Reset Config / クリア
        </button>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE BUILD STEP (8 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#E88D9F]" />
                1. Pick Components / 構成の選択
              </h2>
              <span className="text-xs bg-[#E88D9F]/10 text-[#E88D9F] font-bold px-3 py-1 rounded-full">
                Step 1 of 3
              </span>
            </div>

            <div className="flex flex-col gap-6">

              {/* ----------------- CPU SELECTOR ----------------- */}
              <div className="relative">
                <label className="block text-sm font-bold text-[#1E2022]/80 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-[#8A9A86]" /> CPU Model</span>
                  {selectedCpu && (
                    <span className="text-xs text-[#8A9A86] bg-[#8A9A86]/10 px-2 py-0.5 rounded font-normal">
                      Score: {selectedCpu.singleCoreScore} SC / {selectedCpu.multiCoreScore} MC
                    </span>
                  )}
                </label>

                {selectedCpu ? (
                  <div className="flex items-center justify-between bg-[#8A9A86]/5 border border-[#8A9A86]/20 p-4 rounded-2xl">
                    <div>
                      <div className="font-bold text-sm text-[#1E2022]">{selectedCpu.name}</div>
                      <div className="text-xs text-[#1E2022]/60">
                        {selectedCpu.manufacturer} • {selectedCpu.cores} Cores / {selectedCpu.threads} Threads • {selectedCpu.releaseYear}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCpu(null);
                        setCpuQuery("");
                      }}
                      className="text-xs text-red-500 font-semibold hover:underline px-3 py-1.5 bg-red-50 rounded-lg"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center gap-2 border border-black/[0.06] bg-white rounded-2xl px-3.5 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#E88D9F]/40 focus-within:border-[#E88D9F]">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search 150+ CPUs (e.g. Ryzen 7 9800X3D, i9-14900K)..."
                        className="w-full text-sm outline-none bg-transparent"
                        value={cpuQuery}
                        onChange={(e) => {
                          setCpuQuery(e.target.value);
                          setIsCpuFocused(true);
                        }}
                        onFocus={() => setIsCpuFocused(true)}
                      />
                    </div>

                    {/* Advanced CPU filters */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 bg-[#FBF9F5] p-3 rounded-xl border border-black/[0.03]">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Filter className="w-3 h-3" /> Filters:
                      </span>
                      {/* Brand filters */}
                      <div className="flex bg-white border border-black/[0.05] rounded-lg p-0.5 text-xs">
                        {["All", "Intel", "AMD"].map((mfg) => (
                          <button
                            key={mfg}
                            onClick={() => setCpuMfgFilter(mfg as any)}
                            className={`px-2.5 py-1 rounded-md font-semibold transition ${
                              cpuMfgFilter === mfg
                                ? "bg-[#8A9A86] text-white"
                                : "text-gray-500 hover:text-[#1E2022]"
                            }`}
                          >
                            {mfg}
                          </button>
                        ))}
                      </div>

                      {/* Year filter slider replacement */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 ml-auto">
                        <span>Year:</span>
                        <select
                          className="bg-white border border-black/[0.05] rounded p-0.5 font-medium text-gray-700"
                          value={cpuYearRange[0]}
                          onChange={(e) => setCpuYearRange([Number(e.target.value), cpuYearRange[1]])}
                        >
                          {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                        <span>to</span>
                        <select
                          className="bg-white border border-black/[0.05] rounded p-0.5 font-medium text-gray-700"
                          value={cpuYearRange[1]}
                          onChange={(e) => setCpuYearRange([cpuYearRange[0], Number(e.target.value)])}
                        >
                          {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* CPU Auto-suggest results list */}
                    {isCpuFocused && (
                      <div className="absolute z-30 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white border border-black/[0.08] rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                        <div className="text-[10px] text-gray-400 font-bold px-3 py-1.5 uppercase border-b border-black/[0.03] flex justify-between">
                          <span>Suggestions ({filteredCpus.length} matches)</span>
                          <button
                            onClick={() => setIsCpuFocused(false)}
                            className="text-red-400 hover:text-red-600"
                          >
                            ✕ Close
                          </button>
                        </div>
                        {filteredCpus.length === 0 ? (
                          <div className="text-xs text-gray-400 py-4 text-center">No CPUs fit current filters.</div>
                        ) : (
                          filteredCpus.slice(0, 20).map((cpu) => (
                            <button
                              key={cpu.id}
                              onClick={() => {
                                setSelectedCpu(cpu);
                                setIsCpuFocused(false);
                              }}
                              className="text-left w-full px-3 py-2 hover:bg-[#E88D9F]/5 hover:text-[#E88D9F] rounded-xl transition text-sm flex justify-between items-center"
                            >
                              <div>
                                <span className="font-semibold">{cpu.name}</span>
                                <span className="text-[11px] text-gray-400 ml-2">
                                  ({cpu.cores}C/{cpu.threads}T • {cpu.releaseYear})
                                </span>
                              </div>
                              <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {cpu.singleCoreScore} SC
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
                <label className="block text-sm font-bold text-[#1E2022]/80 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Database className="w-4 h-4 text-[#8A9A86]" /> RAM Profile</span>
                  {!selectedCpu && (
                    <span className="text-xs text-amber-600 font-normal">
                      ⚠️ Select a CPU first to unlock supported RAM generations.
                    </span>
                  )}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    disabled={!selectedCpu}
                    value={selectedRam?.id || ""}
                    onChange={(e) => {
                      const profile = ramProfiles.find((p) => p.id === e.target.value);
                      setSelectedRam(profile || null);
                    }}
                    className="w-full text-sm outline-none bg-white border border-black/[0.06] rounded-2xl px-3.5 py-2.5 shadow-sm disabled:opacity-50 disabled:bg-gray-100 font-medium"
                  >
                    <option value="">-- Choose RAM Profile --</option>
                    {filteredRamProfiles.map((ram) => (
                      <option key={ram.id} value={ram.id}>
                        {ram.generation} {ram.capacityGB}GB @ {ram.speedMhz}MHz ({ram.speedMultiplier}x)
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center px-4 py-2 bg-black/[0.02] border border-black/[0.04] rounded-2xl text-xs text-[#1E2022]/60">
                    {selectedCpu ? (
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-[#8A9A86]" />
                        Supported: <span className="font-bold text-[#8A9A86]">{selectedCpu.supportedDdr.join(", ")}</span>
                      </span>
                    ) : (
                      "Please select a CPU model to view compatible speeds."
                    )}
                  </div>
                </div>
              </div>

              {/* ----------------- GPU SELECTOR ----------------- */}
              <div className="relative">
                <label className="block text-sm font-bold text-[#1E2022]/80 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Tv className="w-4 h-4 text-[#8A9A86]" /> GPU Model</span>
                  {selectedGpu && (
                    <span className="text-xs text-[#8A9A86] bg-[#8A9A86]/10 px-2 py-0.5 rounded font-normal">
                      Power Score: {selectedGpu.relativePowerScore} / VRAM: {selectedGpu.vramGB}GB
                    </span>
                  )}
                </label>

                {selectedGpu ? (
                  <div className="flex items-center justify-between bg-[#8A9A86]/5 border border-[#8A9A86]/20 p-4 rounded-2xl">
                    <div>
                      <div className="font-bold text-sm text-[#1E2022]">{selectedGpu.name}</div>
                      <div className="text-xs text-[#1E2022]/60">
                        {selectedGpu.manufacturer} • {selectedGpu.architecture} • {selectedGpu.vramGB}GB VRAM • {selectedGpu.releaseYear}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedGpu(null);
                        setGpuQuery("");
                      }}
                      className="text-xs text-red-500 font-semibold hover:underline px-3 py-1.5 bg-red-50 rounded-lg"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center gap-2 border border-black/[0.06] bg-white rounded-2xl px-3.5 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#E88D9F]/40 focus-within:border-[#E88D9F]">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search 150+ GPUs (e.g. GeForce RTX 4070 Super, RX 7800 XT)..."
                        className="w-full text-sm outline-none bg-transparent"
                        value={gpuQuery}
                        onChange={(e) => {
                          setGpuQuery(e.target.value);
                          setIsGpuFocused(true);
                        }}
                        onFocus={() => setIsGpuFocused(true)}
                      />
                    </div>

                    {/* Advanced GPU filters */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 bg-[#FBF9F5] p-3 rounded-xl border border-black/[0.03]">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Filter className="w-3 h-3" /> Filters:
                      </span>
                      {/* Brand filters */}
                      <div className="flex bg-white border border-black/[0.05] rounded-lg p-0.5 text-xs">
                        {["All", "NVIDIA", "AMD", "Intel"].map((mfg) => (
                          <button
                            key={mfg}
                            onClick={() => setGpuMfgFilter(mfg as any)}
                            className={`px-2.5 py-1 rounded-md font-semibold transition ${
                              gpuMfgFilter === mfg
                                ? "bg-[#8A9A86] text-white"
                                : "text-gray-500 hover:text-[#1E2022]"
                            }`}
                          >
                            {mfg}
                          </button>
                        ))}
                      </div>

                      {/* Year filter slider replacement */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 ml-auto">
                        <span>Year:</span>
                        <select
                          className="bg-white border border-black/[0.05] rounded p-0.5 font-medium text-gray-700"
                          value={gpuYearRange[0]}
                          onChange={(e) => setGpuYearRange([Number(e.target.value), gpuYearRange[1]])}
                        >
                          {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                        <span>to</span>
                        <select
                          className="bg-white border border-black/[0.05] rounded p-0.5 font-medium text-gray-700"
                          value={gpuYearRange[1]}
                          onChange={(e) => setGpuYearRange([gpuYearRange[0], Number(e.target.value)])}
                        >
                          {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* GPU Auto-suggest list */}
                    {isGpuFocused && (
                      <div className="absolute z-20 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white border border-black/[0.08] rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                        <div className="text-[10px] text-gray-400 font-bold px-3 py-1.5 uppercase border-b border-black/[0.03] flex justify-between">
                          <span>Suggestions ({filteredGpus.length} matches)</span>
                          <button
                            onClick={() => setIsGpuFocused(false)}
                            className="text-red-400 hover:text-red-600"
                          >
                            ✕ Close
                          </button>
                        </div>
                        {filteredGpus.length === 0 ? (
                          <div className="text-xs text-gray-400 py-4 text-center">No GPUs fit current filters.</div>
                        ) : (
                          filteredGpus.slice(0, 20).map((gpu) => (
                            <button
                              key={gpu.id}
                              onClick={() => {
                                setSelectedGpu(gpu);
                                setIsGpuFocused(false);
                              }}
                              className="text-left w-full px-3 py-2 hover:bg-[#E88D9F]/5 hover:text-[#E88D9F] rounded-xl transition text-sm flex justify-between items-center"
                            >
                              <div>
                                <span className="font-semibold">{gpu.name}</span>
                                <span className="text-[11px] text-gray-400 ml-2">
                                  ({gpu.vramGB}GB • {gpu.releaseYear})
                                </span>
                              </div>
                              <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {gpu.relativePowerScore} pts
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
                <label className="block text-sm font-bold text-[#1E2022]/80 mb-2 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-[#8A9A86]" /> Storage Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(["HDD", "SATA SSD", "NVMe Gen3", "NVMe Gen4"] as StorageType[]).map((storageOpt) => (
                    <button
                      key={storageOpt}
                      onClick={() => setSelectedStorage(storageOpt)}
                      className={`px-3 py-2.5 text-xs font-bold rounded-2xl border transition duration-150 flex flex-col items-center gap-1.5 ${
                        selectedStorage === storageOpt
                          ? "border-[#E88D9F] bg-[#E88D9F]/5 text-[#E88D9F]"
                          : "border-black/[0.04] bg-white hover:border-black/[0.1] text-gray-600"
                      }`}
                    >
                      <span className="font-extrabold">{storageOpt}</span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {storageOpt === "HDD" ? "Slowest (0.85x)" : storageOpt === "SATA SSD" ? "SATA (0.95x)" : storageOpt === "NVMe Gen3" ? "Fast (1.0x)" : "Max (1.03x)"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* COMPATIBILITY & SYSTEM DIAGNOSTICS */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/45">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#8A9A86]" />
              System Diagnostics / 互換性診断
            </h3>

            {/* If fully compatible / empty warnings */}
            {compatibilityReport.warnings.length === 0 && compatibilityReport.mismatches.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-emerald-800">Perfectly Balanced Build</div>
                  <p className="text-xs text-emerald-700/85 mt-0.5">
                    No major bottlenecks, generational mismatches, or power issues identified.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {compatibilityReport.mismatches.map((mismatch, i) => (
                  <div key={i} className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-rose-800 font-semibold leading-relaxed">{mismatch}</span>
                  </div>
                ))}
                {compatibilityReport.warnings.map((warning, i) => (
                  <div key={i} className="p-3.5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-amber-800 font-medium leading-relaxed">{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {/* PSU Power Meter */}
            {selectedGpu && (
              <div className="mt-4 p-4 bg-black/[0.02] border border-black/[0.04] rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-[#1E2022]/70">Recommended PSU Wattage</span>
                </div>
                <span className="text-sm font-extrabold text-[#1E2022]">
                  {compatibilityReport.psuRecommendationW}W
                </span>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: TESTING ENVIRONMENT & ESTIMATIONS (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6">

          {/* TARGET GAME TESTER */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-[#E88D9F]" />
                2. Select Target / ゲーム選択
              </h2>
              <span className="text-xs bg-[#8A9A86]/10 text-[#8A9A86] font-bold px-3 py-1 rounded-full">
                Step 2 of 3
              </span>
            </div>

            {/* Search Game */}
            <div className="flex items-center gap-2 border border-black/[0.06] bg-white rounded-2xl px-3.5 py-2 mb-4 shadow-sm">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                className="w-full text-xs outline-none bg-transparent"
                value={searchGameQuery}
                onChange={(e) => setSearchGameQuery(e.target.value)}
              />
            </div>

            {/* Grid of 20+ Games */}
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {filteredGames.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className={`relative overflow-hidden rounded-2xl border text-left p-2.5 transition group ${
                    selectedGame.id === game.id
                      ? "border-[#E88D9F] bg-[#E88D9F]/5 ring-2 ring-[#E88D9F]/20"
                      : "border-black/[0.04] bg-white hover:border-black/[0.1]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="w-9 h-9 object-cover rounded-lg group-hover:scale-105 transition duration-200"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold truncate text-[#1E2022]">{game.title}</div>
                      <div className="text-[10px] text-gray-400">Req: {game.ramMinRequirementGB}GB RAM</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Game dependency metrics */}
            <div className="mt-4 p-3 bg-black/[0.02] rounded-2xl flex justify-around text-center text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">CPU Dependence</span>
                <span className="font-extrabold text-[#1E2022]">{selectedGame.cpuDependence * 100}%</span>
              </div>
              <div className="border-r border-black/[0.05]" />
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">GPU Dependence</span>
                <span className="font-extrabold text-[#1E2022]">{selectedGame.gpuDependence * 100}%</span>
              </div>
            </div>
          </div>

          {/* TARGET GRAPHICS SETTINGS */}
          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-sm font-bold text-[#1E2022]/80 mb-3 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#8A9A86]" /> Target Graphics Settings
            </h2>

            <div className="flex flex-col gap-4">
              {/* Resolution Toggles */}
              <div>
                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Resolution</div>
                <div className="grid grid-cols-3 gap-2">
                  {(["1080p", "1440p", "4K"] as const).map((res) => (
                    <button
                      key={res}
                      onClick={() => setSelectedResolution(res)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        selectedResolution === res
                          ? "border-[#8A9A86] bg-[#8A9A86]/5 text-[#8A9A86]"
                          : "border-black/[0.04] bg-white text-gray-600 hover:border-black/[0.1]"
                      }`}
                    >
                      {res === "1080p" ? "1080p FHD" : res === "1440p" ? "1440p QHD" : "4K UHD"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset Toggles */}
              <div>
                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Preset</div>
                <div className="grid grid-cols-4 gap-2">
                  {(["Low", "Medium", "High", "Ultra"] as const).map((pr) => (
                    <button
                      key={pr}
                      onClick={() => setSelectedPreset(pr)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        selectedPreset === pr
                          ? "border-[#E88D9F] bg-[#E88D9F]/5 text-[#E88D9F]"
                          : "border-black/[0.04] bg-white text-gray-600 hover:border-black/[0.1]"
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>

              {/* DLSS / FSR Upscaling */}
              <div>
                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Upscaling (DLSS / FSR)</div>
                <div className="grid grid-cols-3 gap-2">
                  {(["Off", "Quality", "Performance"] as const).map((dlss) => (
                    <button
                      key={dlss}
                      onClick={() => setSelectedDlss(dlss)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        selectedDlss === dlss
                          ? "border-amber-500 bg-amber-500/5 text-amber-600"
                          : "border-black/[0.04] bg-white text-gray-600 hover:border-black/[0.1]"
                      }`}
                    >
                      {dlss === "Off" ? "Off (Native)" : dlss === "Quality" ? "Quality (1.25x)" : "Performance (1.5x)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* REAL-TIME ESTIMATES / THE RESULTS PANEL */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#1E2022] text-white overflow-hidden relative shadow-2xl shadow-black/15 border border-white/5">
            <div className="absolute top-2 right-2 text-5xl font-extrabold text-white/[0.02] kanji-watermark select-none">
              性能
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E88D9F]" />
                3. Estimated Performance
              </h2>
              <span className="text-xs bg-white/10 text-white font-bold px-3 py-1 rounded-full">
                Step 3 of 3
              </span>
            </div>

            {/* BIG RADIAL ESTIMATOR GAUGE */}
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-4 border-dashed border-white/10 mb-4 bg-white/[0.02]">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl font-black tracking-tight select-all">
                    {performanceReport.averageFps || "--"}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-white/50 font-bold">AVG FPS</span>
                </div>
              </div>

              {/* Verdict Badge */}
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 mt-1 ${performanceReport.verdict.colorClass}`}>
                <span>{performanceReport.verdict.badge}</span>
                <span className="opacity-70">/</span>
                <span>{performanceReport.verdict.japaneseBadge}</span>
              </div>
            </div>

            {/* FPS Details */}
            <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-4 mb-6 text-center text-xs">
              <div>
                <span className="text-white/50 block font-semibold mb-0.5">1% Low FPS (Stutter)</span>
                <span className="text-lg font-black text-rose-300">
                  {performanceReport.onePercentLowFps || "--"} FPS
                </span>
              </div>
              <div className="border-r border-white/10" />
              <div>
                <span className="text-white/50 block font-semibold mb-0.5">Bottleneck Type</span>
                <span className="text-lg font-black text-amber-300">
                  {performanceReport.bottleneckType === "None" ? "Balanced" : performanceReport.bottleneckType}
                </span>
              </div>
            </div>

            {/* WORKLOAD BALANCE GRAPH */}
            <div>
              <h4 className="text-xs font-bold text-white/70 mb-3 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#8A9A86]" /> Workload Balance (CPU vs GPU Load)
              </h4>

              <div className="flex flex-col gap-3">
                {/* CPU load */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-white/60 mb-1">
                    <span>CPU Load ({selectedCpu?.name || "No CPU"})</span>
                    <span>{performanceReport.cpuLoadPercentage}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#8A9A86] h-full transition-all duration-500"
                      style={{ width: `${performanceReport.cpuLoadPercentage}%` }}
                    />
                  </div>
                </div>

                {/* GPU load */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-white/60 mb-1">
                    <span>GPU Load ({selectedGpu?.name || "No GPU"})</span>
                    <span>{performanceReport.gpuLoadPercentage}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#E88D9F] h-full transition-all duration-500"
                      style={{ width: `${performanceReport.gpuLoadPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Dynamic warning if CPU bottlenecked */}
                {performanceReport.bottleneckType === "CPU" && (
                  <div className="mt-2 text-[11px] leading-relaxed text-amber-200 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    💡 <span className="font-bold">CPU bottleneck alert</span>: {performanceReport.bottleneckPercentage}% of your GPU power is fully throttled by your CPU! Consider picking a faster processor.
                  </div>
                )}
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/[0.03] text-center text-xs text-gray-400 font-medium">
        Kensei Spec PC Simulator • 2026 Edition. Designed with Soft Japanese Minimalism.
      </footer>
    </div>
  );
}
