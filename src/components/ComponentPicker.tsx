import { useState, useMemo } from "react";
import type { CPU, GPU, RAMProfile, StorageType } from "../lib/types";
import {
  Cpu,
  Tv,
  Database,
  HardDrive,
  Search,
  Filter,
  AlertTriangle,
  X,
  RotateCcw,
  Edit3
} from "lucide-react";
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
    <div className="glass-card rounded-3xl p-5 sm:p-7 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-6">
      
      {/* Active Build Summary Banner */}
      {selectedCpu && selectedGpu && selectedRam && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs font-black text-emerald-950 dark:text-emerald-200 gap-3 shadow-xs transition backdrop-blur-md">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="bg-emerald-600 text-white text-[10px] px-2.5 py-0.5 rounded-full uppercase font-black tracking-wider shadow-xs">
              СБОРКА АКТИВНА
            </span>
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="bg-white/70 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-bold">{selectedCpu.name}</span>
              <span className="text-emerald-500/60">+</span>
              <span className="bg-white/70 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-bold">{selectedGpu.name}</span>
              <span className="text-emerald-500/60">+</span>
              <span className="bg-white/70 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-bold">{ramCapacityGB}GB {selectedRam.generation} ({ramChannel})</span>
              <span className="text-emerald-500/60">+</span>
              <span className="bg-white/70 dark:bg-black/40 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-bold">{selectedStorage}</span>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedCpu(null);
              setSelectedGpu(null);
              setSelectedRam(null);
            }}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 active:scale-95 px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 self-end sm:self-auto shrink-0 border border-red-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("picker.reset_hardware")}</span>
          </button>
        </div>
      )}

      {/* Header Title Section */}
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E88D9F]/15 text-[#E88D9F] dark:bg-[#E88D9F]/25 flex items-center justify-center font-black shrink-0 shadow-xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#1E2022] dark:text-white tracking-tight flex items-center gap-2">
              <span>{t("step1.title")}</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
              Выберите процессор, видеокарту, объем ОЗУ и тип диска для расчета производительности
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-[10px] bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
          {t("nav.simulator")}
        </span>
      </div>

      {/* ================= 1. CPU SELECTOR ================= */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8A9A86]" />
            <Cpu className="w-4 h-4 text-[#8A9A86]" />
            <span>{t("picker.cpu_model")}</span>
          </label>
          {selectedCpu && (
            <span className="text-[10px] text-[#8A9A86] dark:text-[#A4B5A0] bg-[#8A9A86]/15 dark:bg-[#8A9A86]/25 px-3 py-0.5 rounded-full font-black border border-[#8A9A86]/20">
              Socket {selectedCpu.socket} • {selectedCpu.is3DVCache ? "3D V-Cache Boost" : t("picker.standard_l3")}
            </span>
          )}
        </div>

        {selectedCpu ? (
          /* SELECTED CPU DISPLAY CARD */
          <div className="group relative overflow-hidden bg-gradient-to-r from-black/[0.02] to-black/[0.05] dark:from-white/[0.03] dark:to-white/[0.06] border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#8A9A86]/50 transition duration-200 shadow-sm">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white font-black text-xs shadow-md shrink-0 ${
                selectedCpu.manufacturer === "Intel" ? "bg-[#0071C5]" : "bg-[#ED1C24]"
              }`}>
                <span className="text-[9px] opacity-80 uppercase tracking-tighter">{selectedCpu.manufacturer}</span>
                <span className="text-[11px] font-mono leading-none mt-0.5">{selectedCpu.socket}</span>
              </div>
              <div>
                <div className="font-black text-base text-[#1E2022] dark:text-white flex items-center gap-2 flex-wrap">
                  <span>{selectedCpu.name}</span>
                  {selectedCpu.is3DVCache && (
                    <span className="text-[9px] bg-[#E88D9F] text-white px-2 py-0.5 rounded-md font-black tracking-wider uppercase shadow-xs">3D V-Cache</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-1 flex items-center gap-2 flex-wrap">
                  <span>{selectedCpu.cores} Ядер / {selectedCpu.threads} Потоков</span>
                  <span>•</span>
                  <span>{selectedCpu.releaseYear} г.</span>
                  <span>•</span>
                  <span>{selectedCpu.tdpW}W TDP</span>
                </div>
              </div>
            </div>

            {/* CPU Performance Metrics */}
            <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 sm:border-l border-black/10 dark:border-white/10 pt-3 sm:pt-0 sm:pl-5">
              <div className="flex flex-col gap-2 min-w-[140px]">
                <div className="flex items-center justify-between text-[10px] font-black text-[#1E2022] dark:text-gray-300 uppercase">
                  <span>Одноядерный</span>
                  <span className="text-[#8A9A86] font-mono font-black">{selectedCpu.singleCoreScore} pts</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#8A9A86] h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (selectedCpu.singleCoreScore / 2500) * 100)}%` }} />
                </div>

                <div className="flex items-center justify-between text-[10px] font-black text-[#1E2022] dark:text-gray-300 uppercase">
                  <span>Многоядерный</span>
                  <span className="text-[#E88D9F] font-mono font-black">{selectedCpu.multiCoreScore} pts</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#E88D9F] h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (selectedCpu.multiCoreScore / 25000) * 100)}%` }} />
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCpu(null);
                  setCpuQuery("");
                }}
                className="text-xs text-[#E88D9F] dark:text-[#E88D9F] font-black hover:bg-[#E88D9F]/10 active:scale-95 px-3 py-2 rounded-xl transition border border-[#E88D9F]/30 flex items-center gap-1.5 shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t("picker.change")}</span>
              </button>
            </div>
          </div>
        ) : (
          /* CPU SEARCH INPUT & FILTERS */
          <div className="relative">
            <div className="flex items-center gap-2.5 border border-black/15 dark:border-white/15 bg-gray-50 dark:bg-[#121315] rounded-2xl px-4 py-3 shadow-xs focus-within:ring-2 focus-within:ring-[#8A9A86]/50 transition">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Поиск процессора (например: Ryzen 7 7800X3D, Core i5-13600K)..."
                className="w-full text-xs font-bold outline-none bg-transparent text-[#1E2022] dark:text-white placeholder:text-gray-400"
                value={cpuQuery}
                onChange={(e) => {
                  setCpuQuery(e.target.value);
                  setIsCpuFocused(true);
                }}
                onFocus={() => setIsCpuFocused(true)}
              />
              {cpuQuery && (
                <button onClick={() => setCpuQuery("")} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Advanced CPU Filters */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 bg-black/5 dark:bg-white/5 p-2 sm:p-2.5 rounded-2xl border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#1E2022] dark:text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#8A9A86]" /> Бренд:
                </span>
                <div className="flex bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-xl p-0.5 text-xs">
                  {["All", "Intel", "AMD"].map((mfg) => (
                    <button
                      key={mfg}
                      type="button"
                      onClick={() => setCpuMfgFilter(mfg as any)}
                      className={`px-3 py-1 rounded-lg font-extrabold transition active:scale-95 text-xs ${
                        cpuMfgFilter === mfg
                          ? "bg-[#8A9A86] text-white shadow-xs"
                          : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022]"
                      }`}
                    >
                      {mfg === "All" ? "Все" : mfg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-[#1E2022] dark:text-gray-300 font-extrabold">
                <span>Год:</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 font-bold text-[#1E2022] dark:text-white outline-none cursor-pointer text-xs"
                  value={cpuYearRange[0]}
                  onChange={(e) => setCpuYearRange([Number(e.target.value), cpuYearRange[1]])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">{y}</option>
                  ))}
                </select>
                <span>—</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 font-bold text-[#1E2022] dark:text-white outline-none cursor-pointer text-xs"
                  value={cpuYearRange[1]}
                  onChange={(e) => setCpuYearRange([cpuYearRange[0], Number(e.target.value)])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Suggestions list */}
            {isCpuFocused && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsCpuFocused(false)} />
                <div className="absolute z-30 left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-white dark:bg-[#1A1C1E] border border-black/15 dark:border-white/15 rounded-2xl shadow-2xl p-2 flex flex-col gap-1">
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 font-black px-3 py-1.5 uppercase border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                    <span>Найдено процессоров: {filteredCpus.length}</span>
                    <button onClick={() => setIsCpuFocused(false)} className="text-red-500 hover:text-red-700 font-black flex items-center gap-1">
                      <X className="w-3 h-3" /> Закрыть
                    </button>
                  </div>
                  {filteredCpus.length === 0 ? (
                    <div className="text-xs text-gray-500 dark:text-gray-400 py-4 text-center font-bold">Ничего не найдено. Измените поисковый запрос или фильтр по годам.</div>
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
                        className="text-left w-full px-3 py-2.5 hover:bg-[#8A9A86]/15 rounded-xl transition text-xs flex justify-between items-center font-bold gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                            cpu.manufacturer === "Intel" ? "bg-[#0071C5]" : "bg-[#ED1C24]"
                          }`}>
                            {cpu.socket}
                          </span>
                          <div>
                            <span className="font-black text-[#1E2022] dark:text-white">{cpu.name}</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-2">
                              ({cpu.cores}C/{cpu.threads}T • {cpu.releaseYear} г.)
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-700 dark:text-gray-300 bg-black/5 dark:bg-white/10 px-2 py-1 rounded-lg font-bold shrink-0">
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

      {/* ================= 2. GPU SELECTOR ================= */}
      <div className="flex flex-col gap-2.5 border-t border-black/10 dark:border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E88D9F]" />
            <Tv className="w-4 h-4 text-[#E88D9F]" />
            <span>{t("picker.gpu_model")}</span>
          </label>
          {selectedGpu && (
            <span className="text-[10px] text-[#E88D9F] dark:text-[#E88D9F] bg-[#E88D9F]/15 dark:bg-[#E88D9F]/25 px-3 py-0.5 rounded-full font-black border border-[#E88D9F]/20">
              {selectedGpu.vramGB}GB VRAM • {selectedGpu.architecture}
            </span>
          )}
        </div>

        {selectedGpu ? (
          /* SELECTED GPU DISPLAY CARD */
          <div className="group relative overflow-hidden bg-gradient-to-r from-black/[0.02] to-black/[0.05] dark:from-white/[0.03] dark:to-white/[0.06] border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#E88D9F]/50 transition duration-200 shadow-sm">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white font-black text-xs shadow-md shrink-0 ${
                selectedGpu.manufacturer === "NVIDIA"
                  ? "bg-[#76B900]"
                  : selectedGpu.manufacturer === "AMD"
                  ? "bg-[#ED1C24]"
                  : "bg-[#0071C5]"
              }`}>
                <span className="text-[9px] opacity-80 uppercase tracking-tighter">{selectedGpu.manufacturer.slice(0, 3)}</span>
                <span className="text-[11px] font-mono leading-none mt-0.5">{selectedGpu.vramGB}GB</span>
              </div>
              <div>
                <div className="font-black text-base text-[#1E2022] dark:text-white">
                  {selectedGpu.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-1 flex items-center gap-2 flex-wrap">
                  <span>{selectedGpu.manufacturer} {selectedGpu.architecture}</span>
                  <span>•</span>
                  <span>{selectedGpu.vramGB}GB VRAM</span>
                  <span>•</span>
                  <span>{selectedGpu.releaseYear} г.</span>
                  <span>•</span>
                  <span>{selectedGpu.tdpW}W TDP</span>
                </div>
              </div>
            </div>

            {/* GPU Performance Metrics */}
            <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 sm:border-l border-black/10 dark:border-white/10 pt-3 sm:pt-0 sm:pl-5">
              <div className="flex flex-col gap-2 min-w-[140px]">
                <div className="flex justify-between items-center text-[10px] font-black text-[#E88D9F] bg-[#E88D9F]/15 dark:bg-[#E88D9F]/30 px-2.5 py-0.5 rounded-md self-start">
                  <span>Видеопамять: {selectedGpu.vramGB}GB</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black text-[#1E2022] dark:text-gray-300 uppercase">
                  <span>Трассировка лучей</span>
                  <span className="text-[#E88D9F] font-mono font-black">{selectedGpu.rayTracingPowerScore} pts</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#E88D9F] h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (selectedGpu.rayTracingPowerScore / 1500) * 100)}%` }} />
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedGpu(null);
                  setGpuQuery("");
                }}
                className="text-xs text-[#E88D9F] dark:text-[#E88D9F] font-black hover:bg-[#E88D9F]/10 active:scale-95 px-3 py-2 rounded-xl transition border border-[#E88D9F]/30 flex items-center gap-1.5 shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t("picker.change")}</span>
              </button>
            </div>
          </div>
        ) : (
          /* GPU SEARCH INPUT & FILTERS */
          <div className="relative">
            <div className="flex items-center gap-2.5 border border-black/15 dark:border-white/15 bg-gray-50 dark:bg-[#121315] rounded-2xl px-4 py-3 shadow-xs focus-within:ring-2 focus-within:ring-[#E88D9F]/50 transition">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Поиск видеокарты (например: GeForce RTX 5090, RTX 4070 Super, RX 7800 XT)..."
                className="w-full text-xs font-bold outline-none bg-transparent text-[#1E2022] dark:text-white placeholder:text-gray-400"
                value={gpuQuery}
                onChange={(e) => {
                  setGpuQuery(e.target.value);
                  setIsGpuFocused(true);
                }}
                onFocus={() => setIsGpuFocused(true)}
              />
              {gpuQuery && (
                <button onClick={() => setGpuQuery("")} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Advanced GPU Filters */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 bg-black/5 dark:bg-white/5 p-2 sm:p-2.5 rounded-2xl border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#1E2022] dark:text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#E88D9F]" /> Бренд:
                </span>
                <div className="flex bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-xl p-0.5 text-xs">
                  {["All", "NVIDIA", "AMD", "Intel"].map((mfg) => (
                    <button
                      key={mfg}
                      type="button"
                      onClick={() => setGpuMfgFilter(mfg as any)}
                      className={`px-3 py-1 rounded-lg font-extrabold transition active:scale-95 text-xs ${
                        gpuMfgFilter === mfg
                          ? "bg-[#E88D9F] text-white shadow-xs"
                          : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022]"
                      }`}
                    >
                      {mfg === "All" ? "Все" : mfg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-[#1E2022] dark:text-gray-300 font-extrabold">
                <span>Год:</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 font-bold text-[#1E2022] dark:text-white outline-none cursor-pointer text-xs"
                  value={gpuYearRange[0]}
                  onChange={(e) => setGpuYearRange([Number(e.target.value), gpuYearRange[1]])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">{y}</option>
                  ))}
                </select>
                <span>—</span>
                <select
                  className="bg-white dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 font-bold text-[#1E2022] dark:text-white outline-none cursor-pointer text-xs"
                  value={gpuYearRange[1]}
                  onChange={(e) => setGpuYearRange([gpuYearRange[0], Number(e.target.value)])}
                >
                  {[2005, 2010, 2015, 2018, 2020, 2022, 2024, 2025, 2026].map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Suggestions list */}
            {isGpuFocused && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsGpuFocused(false)} />
                <div className="absolute z-30 left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-white dark:bg-[#1A1C1E] border border-black/15 dark:border-white/15 rounded-2xl shadow-2xl p-2 flex flex-col gap-1">
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 font-black px-3 py-1.5 uppercase border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                    <span>Найдено видеокарт: {filteredGpus.length}</span>
                    <button onClick={() => setIsGpuFocused(false)} className="text-red-500 hover:text-red-700 font-black flex items-center gap-1">
                      <X className="w-3 h-3" /> Закрыть
                    </button>
                  </div>
                  {filteredGpus.length === 0 ? (
                    <div className="text-xs text-gray-500 dark:text-gray-400 py-4 text-center font-bold">Ничего не найдено. Измените поисковый запрос или фильтр по годам.</div>
                  ) : (
                    filteredGpus.slice(0, 15).map((gpu) => (
                      <button
                        key={gpu.id}
                        type="button"
                        onClick={() => {
                          setSelectedGpu(gpu);
                          setIsGpuFocused(false);
                        }}
                        className="text-left w-full px-3 py-2.5 hover:bg-[#E88D9F]/15 rounded-xl transition text-xs flex justify-between items-center font-bold gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                            gpu.manufacturer === "NVIDIA"
                              ? "bg-[#76B900]"
                              : gpu.manufacturer === "AMD"
                              ? "bg-[#ED1C24]"
                              : "bg-[#0071C5]"
                          }`}>
                            {gpu.vramGB}GB
                          </span>
                          <div>
                            <span className="font-black text-[#1E2022] dark:text-white">{gpu.name}</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-2">
                              ({gpu.architecture} • {gpu.releaseYear} г.)
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-700 dark:text-gray-300 bg-black/5 dark:bg-white/10 px-2 py-1 rounded-lg font-bold shrink-0">
                          {gpu.relativePowerScore} pts
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

      {/* ================= 3. RAM SELECTOR ================= */}
      <div className="flex flex-col gap-3.5 border-t border-black/10 dark:border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8A9A86]" />
            <Database className="w-4 h-4 text-[#8A9A86]" />
            <span>Скорость ОЗУ, Объём и Режим Каналов</span>
          </label>
          {!selectedCpu && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-black flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Выберите сначала процессор
            </span>
          )}
        </div>

        {/* RAM Capacity Quick Tabs */}
        <div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Общий объем ОЗУ</span>
            <span className="text-[#E88D9F] font-mono font-black text-xs">{ramCapacityGB} GB</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[8, 16, 32, 64, 128].map((cap) => (
              <button
                key={cap}
                type="button"
                onClick={() => setRamCapacityGB(cap)}
                className={`py-2.5 text-xs font-black rounded-xl border transition duration-200 active:scale-95 ${
                  ramCapacityGB === cap
                    ? "border-[#E88D9F] bg-[#E88D9F] text-white shadow-md shadow-[#E88D9F]/20"
                    : "border-black/10 dark:border-white/10 bg-white dark:bg-[#121315] text-[#1E2022] dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {cap} GB
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Frequency & Generation Profile Dropdown */}
          <div className="sm:col-span-7">
            <select
              disabled={!selectedCpu}
              value={selectedRam?.id || ""}
              onChange={(e) => {
                const profile = ramProfiles.find((p) => p.id === e.target.value);
                setSelectedRam(profile || null);
              }}
              className="w-full text-xs font-bold outline-none bg-white dark:bg-[#121315] border border-black/15 dark:border-white/15 rounded-2xl px-4 py-3 shadow-xs disabled:opacity-50 text-[#1E2022] dark:text-white cursor-pointer hover:border-[#8A9A86]/40 transition"
            >
              <option value="" className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">-- Выберите частоту ОЗУ --</option>
              {filteredRamProfiles.map((ram) => (
                <option key={ram.id} value={ram.id} className="bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white">
                  {ram.generation} @ {ram.speedMhz}MHz (Множитель скорости: {ram.speedMultiplier}x)
                </option>
              ))}
            </select>
          </div>

          {/* Channel Mode Segmented Control */}
          <div className="sm:col-span-5 flex gap-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-1.5">
            {(["Single", "Dual"] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setRamChannel(ch)}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition duration-200 active:scale-95 ${
                  ramChannel === ch
                    ? "bg-[#8A9A86] text-white shadow-md shadow-[#8A9A86]/20"
                    : "bg-white dark:bg-[#121315] text-[#1E2022] dark:text-gray-300 font-extrabold border border-black/10 dark:border-white/10 hover:bg-black/5"
                }`}
              >
                {ch === "Single" ? "Одноканальный" : "Двуканальный"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 4. STORAGE SELECTOR ================= */}
      <div className="flex flex-col gap-3 border-t border-black/10 dark:border-white/10 pt-4">
        <label className="text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8A9A86]" />
          <HardDrive className="w-4 h-4 text-[#8A9A86]" />
          <span>Тип Накопителя (ОС и Игры)</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["HDD", "SATA SSD", "NVMe Gen3", "NVMe Gen4"] as StorageType[]).map((storageOpt) => {
            const isSelected = selectedStorage === storageOpt;
            return (
              <button
                key={storageOpt}
                type="button"
                onClick={() => setSelectedStorage(storageOpt)}
                className={`p-3.5 rounded-2xl border transition duration-200 active:scale-95 flex flex-col items-center gap-1.5 text-center relative overflow-hidden ${
                  isSelected
                    ? "border-[#E88D9F] bg-[#E88D9F]/10 text-[#E88D9F] dark:text-[#E88D9F] shadow-md shadow-[#E88D9F]/10 font-black"
                    : "border-black/10 dark:border-white/10 bg-white dark:bg-[#121315] hover:border-black/20 text-[#1E2022] dark:text-gray-200"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E88D9F]" />
                )}
                <span className="font-black text-xs sm:text-sm">{storageOpt}</span>
                <span className={`text-[10px] font-extrabold ${
                  storageOpt === "HDD" ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
                }`}>
                  {storageOpt === "HDD"
                    ? "Сильные фризы"
                    : storageOpt === "SATA SSD"
                    ? "550 MB/s"
                    : storageOpt === "NVMe Gen3"
                    ? "3,500 MB/s"
                    : "7,000 MB/s"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
