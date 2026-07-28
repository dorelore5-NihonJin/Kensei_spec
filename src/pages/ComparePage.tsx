import { useState } from "react";
import type { CPU, GPU } from "../lib/types";
import { Scale, Cpu as CpuIcon, Zap, Sparkles, Layers, MousePointerClick, Trophy, Flame, HardDrive, Cpu } from "lucide-react";
import { useHardware } from "../context/HardwareContext";
import SearchableSelect from "../components/SearchableSelect";
import AggregatePerformanceChart from "../components/AggregatePerformanceChart";
import { getCpuTechnicalDetails, getGpuTechnicalDetails, type TechnicalDetails } from "../lib/hardwareSpecs";

interface ComparePageProps {
  cpus: CPU[];
  gpus: GPU[];
}

export default function ComparePage({ cpus, gpus }: ComparePageProps) {
  const { setSelectedCpu, setSelectedGpu, setActivePage, setCurrentStep } = useHardware();

  // Read initial mode from URL search param
  const [mode, setMode] = useState<"cpu" | "gpu">(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode");
    if (modeParam === "gpu" || modeParam === "cpu") return modeParam;
    return "cpu";
  });

  // Read initial component selections from URL search params ('a' and 'b')
  const [selectedCpuA, setSelectedCpuA] = useState<CPU | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode") || "cpu";
    const aParam = urlParams.get("a");
    if (modeParam === "cpu" && aParam) {
      return cpus.find((c) => c.id === aParam) || null;
    }
    return null;
  });

  const [selectedCpuB, setSelectedCpuB] = useState<CPU | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode") || "cpu";
    const bParam = urlParams.get("b");
    if (modeParam === "cpu" && bParam) {
      return cpus.find((c) => c.id === bParam) || null;
    }
    return null;
  });

  const [selectedGpuA, setSelectedGpuA] = useState<GPU | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode") || "cpu";
    const aParam = urlParams.get("a");
    if (modeParam === "gpu" && aParam) {
      return gpus.find((g) => g.id === aParam) || null;
    }
    return null;
  });

  const [selectedGpuB, setSelectedGpuB] = useState<GPU | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode") || "cpu";
    const bParam = urlParams.get("b");
    if (modeParam === "gpu" && bParam) {
      return gpus.find((g) => g.id === bParam) || null;
    }
    return null;
  });

  // Helper to sync state directly into URL parameters without reloading
  const syncUrlParams = (currentMode: "cpu" | "gpu", itemA: CPU | GPU | null, itemB: CPU | GPU | null) => {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", currentMode);
    if (itemA) {
      url.searchParams.set("a", itemA.id);
    } else {
      url.searchParams.delete("a");
    }
    if (itemB) {
      url.searchParams.set("b", itemB.id);
    } else {
      url.searchParams.delete("b");
    }
    window.history.replaceState({}, "", url.toString());
  };

  const handleModeChange = (newMode: "cpu" | "gpu") => {
    setMode(newMode);
    const nextItemA = newMode === "cpu" ? selectedCpuA : selectedGpuA;
    const nextItemB = newMode === "cpu" ? selectedCpuB : selectedGpuB;
    syncUrlParams(newMode, nextItemA, nextItemB);
  };

  const handleSelectA = (id: string) => {
    if (mode === "cpu") {
      const found = cpus.find((c) => c.id === id) || null;
      setSelectedCpuA(found);
      syncUrlParams("cpu", found, selectedCpuB);
    } else {
      const found = gpus.find((g) => g.id === id) || null;
      setSelectedGpuA(found);
      syncUrlParams("gpu", found, selectedGpuB);
    }
  };

  const handleSelectB = (id: string) => {
    if (mode === "cpu") {
      const found = cpus.find((c) => c.id === id) || null;
      setSelectedCpuB(found);
      syncUrlParams("cpu", selectedCpuA, found);
    } else {
      const found = gpus.find((g) => g.id === id) || null;
      setSelectedGpuB(found);
      syncUrlParams("gpu", selectedGpuA, found);
    }
  };

  // Map options for SearchableSelect
  const cpuOptions = cpus.map((c) => ({
    id: c.id,
    name: `${c.manufacturer} ${c.name}`,
    subText: `${c.cores} Cores / ${c.threads} Threads • Socket ${c.socket} • ${c.releaseYear}`,
    manufacturer: c.manufacturer
  }));

  const gpuOptions = gpus.map((g) => ({
    id: g.id,
    name: `${g.manufacturer} ${g.name}`,
    subText: `${g.vramGB}GB VRAM • ${g.architecture} • ${g.releaseYear}`,
    manufacturer: g.manufacturer
  }));

  const isCpuMode = mode === "cpu";
  const itemA = isCpuMode ? selectedCpuA : selectedGpuA;
  const itemB = isCpuMode ? selectedCpuB : selectedGpuB;

  // Filter out the component that is ALREADY selected in the opposite dropdown!
  const filteredOptionsA = isCpuMode
    ? cpuOptions.filter((opt) => opt.id !== selectedCpuB?.id)
    : gpuOptions.filter((opt) => opt.id !== selectedGpuB?.id);

  const filteredOptionsB = isCpuMode
    ? cpuOptions.filter((opt) => opt.id !== selectedCpuA?.id)
    : gpuOptions.filter((opt) => opt.id !== selectedGpuA?.id);

  // Calculate scores if items exist
  const cpuScoreA = selectedCpuA ? Math.round(selectedCpuA.singleCoreScore * 0.6 + (selectedCpuA.multiCoreScore / 10) * 0.4 * 10) : 0;
  const cpuScoreB = selectedCpuB ? Math.round(selectedCpuB.singleCoreScore * 0.6 + (selectedCpuB.multiCoreScore / 10) * 0.4 * 10) : 0;

  const gpuScoreA = selectedGpuA ? selectedGpuA.relativePowerScore : 0;
  const gpuScoreB = selectedGpuB ? selectedGpuB.relativePowerScore : 0;

  const scoreA = isCpuMode ? cpuScoreA : gpuScoreA;
  const scoreB = isCpuMode ? cpuScoreB : gpuScoreB;

  const deltaPct = scoreA > 0 && scoreB > 0
    ? Math.round(Math.abs((scoreA - scoreB) / Math.min(scoreA, scoreB)) * 100)
    : 0;

  const winner = scoreA > scoreB ? "A" : scoreB > scoreA ? "B" : "Tie";
  const isBothSelected = itemA !== null && itemB !== null;

  const handleApplyToBuild = (comp: CPU | GPU) => {
    if (isCpuMode) {
      setSelectedCpu(comp as CPU);
    } else {
      setSelectedGpu(comp as GPU);
    }
    setCurrentStep(1);
    setActivePage("simulator");
  };

  const itemAInfo = itemA ? {
    name: isCpuMode ? (selectedCpuA?.name || "") : (selectedGpuA?.name || ""),
    score: scoreA,
    details: isCpuMode ? `${selectedCpuA?.cores}C/${selectedCpuA?.threads}T • Socket ${selectedCpuA?.socket}` : `${selectedGpuA?.vramGB}GB VRAM • ${selectedGpuA?.architecture}`,
    manufacturer: isCpuMode ? selectedCpuA?.manufacturer : selectedGpuA?.manufacturer,
    releaseYear: isCpuMode ? selectedCpuA?.releaseYear : selectedGpuA?.releaseYear
  } : null;

  const itemBInfo = itemB ? {
    name: isCpuMode ? (selectedCpuB?.name || "") : (selectedGpuB?.name || ""),
    score: scoreB,
    details: isCpuMode ? `${selectedCpuB?.cores}C/${selectedCpuB?.threads}T • Socket ${selectedCpuB?.socket}` : `${selectedGpuB?.vramGB}GB VRAM • ${selectedGpuB?.architecture}`,
    manufacturer: isCpuMode ? selectedCpuB?.manufacturer : selectedGpuB?.manufacturer,
    releaseYear: isCpuMode ? selectedCpuB?.releaseYear : selectedGpuB?.releaseYear
  } : null;

  // Generate Technical City Specs for Candidate A and Candidate B
  const techSpecsA: TechnicalDetails | null = itemA
    ? isCpuMode
      ? getCpuTechnicalDetails(selectedCpuA!, cpus)
      : getGpuTechnicalDetails(selectedGpuA!, gpus)
    : null;

  const techSpecsB: TechnicalDetails | null = itemB
    ? isCpuMode
      ? getCpuTechnicalDetails(selectedCpuB!, cpus)
      : getGpuTechnicalDetails(selectedGpuB!, gpus)
    : null;

  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col gap-8 animate-fadeIn">
      {/* 1. PAGE HEADER & MODE TOGGLE */}
      <div className="relative overflow-hidden bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Background Live Video Banner Overlay */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-35 pointer-events-none transition-opacity duration-500"
          src="/gif_banner_vs.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#1A1C1E] dark:via-[#1A1C1E]/80 dark:to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#E88D9F] font-extrabold text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Versus Telemetry Comparison Studio / 比較スタジオ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E2022] dark:text-white mt-1">
            Hardware Comparison Studio
          </h1>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Compare CPUs and GPUs side-by-side with real-time aggregate telemetry benchmark metrics, architectural specs, and hierarchy ranking.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/10 dark:border-white/10 shrink-0 relative z-10">
          <button
            onClick={() => handleModeChange("cpu")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              mode === "cpu"
                ? "bg-[#E88D9F] text-white shadow-md scale-102"
                : "text-gray-600 dark:text-gray-300 hover:text-white"
            }`}
          >
            <CpuIcon className="w-4 h-4" />
            <span>CPU vs CPU</span>
          </button>
          <button
            onClick={() => handleModeChange("gpu")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              mode === "gpu"
                ? "bg-[#E88D9F] text-white shadow-md scale-102"
                : "text-gray-600 dark:text-gray-300 hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>GPU vs GPU</span>
          </button>
        </div>
      </div>

      {/* 2. COMPONENT SELECTION BAR */}
      <div className="flex flex-col lg:flex-row items-stretch gap-5 w-full">
        {/* COMPONENT A SELECTOR */}
        <div className="flex-1 w-full lg:w-0 min-w-0 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-4 relative min-h-[220px]">
          <SearchableSelect
            label="Component A (Left)"
            options={filteredOptionsA}
            value={itemA?.id || ""}
            onChange={handleSelectA}
            placeholder={isCpuMode ? "Select first CPU..." : "Select first GPU..."}
          />

          {itemA ? (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between pt-2">
                <div className="min-w-0 pr-2">
                  <h3 className="text-base font-black text-[#1E2022] dark:text-white truncate">
                    {itemAInfo?.name}
                  </h3>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {itemAInfo?.details}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-black uppercase text-gray-400 block">Performance Index</span>
                  <span className="text-2xl font-black text-[#E88D9F]">{scoreA} pts</span>
                </div>
              </div>

              <button
                onClick={() => handleApplyToBuild(itemA as CPU | GPU)}
                className="w-full py-2.5 rounded-xl bg-[#E88D9F]/10 hover:bg-[#E88D9F]/20 text-[#E88D9F] border border-[#E88D9F]/30 text-xs font-black transition flex items-center justify-center gap-1.5 mt-4"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Set as Active Build Component</span>
              </button>
            </div>
          ) : (
            <div className="py-6 border border-dashed border-black/10 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 bg-black/5 dark:bg-white/5">
              <MousePointerClick className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-extrabold text-gray-400">Select Candidate A from dropdown above</span>
            </div>
          )}
        </div>

        {/* VERSUS BADGE DELTA */}
        <div className="w-full lg:w-24 shrink-0 flex flex-col items-center justify-center gap-2 py-4 lg:py-0 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#E88D9F] text-white font-black text-base flex items-center justify-center shadow-lg border border-[#E88D9F]/30 shrink-0">
            VS
          </div>
          {isBothSelected ? (
            winner !== "Tie" ? (
              <span className="text-[11px] font-extrabold text-emerald-500 text-center truncate w-full px-1 animate-fadeIn">
                +{deltaPct}%
              </span>
            ) : (
              <span className="text-[11px] font-extrabold text-gray-400 text-center truncate w-full px-1 animate-fadeIn">Equal</span>
            )
          ) : (
            <span className="text-[10px] font-bold text-gray-400 text-center truncate w-full px-1">Waiting</span>
          )}
        </div>

        {/* COMPONENT B SELECTOR */}
        <div className="flex-1 w-full lg:w-0 min-w-0 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-4 relative min-h-[220px]">
          <SearchableSelect
            label="Component B (Right)"
            options={filteredOptionsB}
            value={itemB?.id || ""}
            onChange={handleSelectB}
            placeholder={isCpuMode ? "Select second CPU..." : "Select second GPU..."}
          />

          {itemB ? (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between pt-2">
                <div className="min-w-0 pr-2">
                  <h3 className="text-base font-black text-[#1E2022] dark:text-white truncate">
                    {itemBInfo?.name}
                  </h3>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {itemBInfo?.details}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-black uppercase text-gray-400 block">Performance Index</span>
                  <span className="text-2xl font-black text-[#E88D9F]">{scoreB} pts</span>
                </div>
              </div>

              <button
                onClick={() => handleApplyToBuild(itemB as CPU | GPU)}
                className="w-full py-2.5 rounded-xl bg-[#E88D9F]/10 hover:bg-[#E88D9F]/20 text-[#E88D9F] border border-[#E88D9F]/30 text-xs font-black transition flex items-center justify-center gap-1.5 mt-4"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Set as Active Build Component</span>
              </button>
            </div>
          ) : (
            <div className="py-6 border border-dashed border-black/10 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 bg-black/5 dark:bg-white/5">
              <MousePointerClick className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-extrabold text-gray-400">Select Candidate B from dropdown above</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. BENCHMARK MATRIX CHART & TECHNICAL CITY SPECIFICATION TABLES */}
      {isBothSelected && itemAInfo && itemBInfo && techSpecsA && techSpecsB ? (
        <div className="flex flex-col gap-8 animate-fadeIn transition-all duration-500 ease-out">
          {/* Aggregate Visual Benchmark Chart */}
          <AggregatePerformanceChart
            type={mode}
            itemA={itemAInfo}
            itemB={itemBInfo}
          />

          {/* TECHNICAL CITY STYLE GROUPED COMPARISON MATRIX */}
          <div className="flex flex-col gap-6">
            {/* CATEGORY 1: PRIMARY DETAILS & GLOBAL RANKING */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#E88D9F]" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                      Primary Details & Global Ranking / 基本概要・総合ランキング
                    </h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                      Overall hierarchy rank, popularity status, market segment, and architectural generation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 w-2/5">Specification Metric</th>
                      <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemAInfo.name}</th>
                      <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemBInfo.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold text-gray-700 dark:text-gray-300">
                    {/* Place in Global Ranking */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Place in Global Ranking / 総合順位</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-lg font-mono font-black text-xs border ${
                          techSpecsA.rank < techSpecsB.rank
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-[#E88D9F]/10 text-[#E88D9F] border-[#E88D9F]/20"
                        }`}>
                          #{techSpecsA.rank} of {techSpecsA.totalCount} {techSpecsA.rank < techSpecsB.rank && "🏆 Best"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-lg font-mono font-black text-xs border ${
                          techSpecsB.rank < techSpecsA.rank
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-[#E88D9F]/10 text-[#E88D9F] border-[#E88D9F]/20"
                        }`}>
                          #{techSpecsB.rank} of {techSpecsB.totalCount} {techSpecsB.rank < techSpecsA.rank && "🏆 Best"}
                        </span>
                      </td>
                    </tr>

                    {/* Place by Popularity */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Place by Popularity / 人気ランキング</td>
                      <td className="py-3.5 px-4 font-mono font-black">#{techSpecsA.popularityRank} in builds</td>
                      <td className="py-3.5 px-4 font-mono font-black">#{techSpecsB.popularityRank} in builds</td>
                    </tr>

                    {/* Market Segment */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Market Segment / セグメント</td>
                      <td className="py-3.5 px-4">{techSpecsA.marketSegment}</td>
                      <td className="py-3.5 px-4">{techSpecsB.marketSegment}</td>
                    </tr>

                    {/* Designer / Manufacturer */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Designer / 開発メーカー</td>
                      <td className="py-3.5 px-4 font-black">{itemAInfo.manufacturer}</td>
                      <td className="py-3.5 px-4 font-black">{itemBInfo.manufacturer}</td>
                    </tr>

                    {/* Architecture Codename */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Architecture Codename / アーキテクチャ</td>
                      <td className="py-3.5 px-4 font-black text-[#E88D9F]">{techSpecsA.architectureCodename}</td>
                      <td className="py-3.5 px-4 font-black text-[#E88D9F]">{techSpecsB.architectureCodename}</td>
                    </tr>

                    {/* Release Date */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Release Year / 発売年</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsA.releaseDate}</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsB.releaseDate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CATEGORY 2: CORE SPECS & PERFORMANCE ARCHITECTURE */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#E88D9F]" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                      Core Specs & Clock Frequencies / コア構成・動作周波数
                    </h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                      Physical compute engines, clock frequencies, cache memory, and semiconductor lithography.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 w-2/5">Specification Metric</th>
                      <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemAInfo.name}</th>
                      <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemBInfo.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold text-gray-700 dark:text-gray-300">
                    {/* Cores / Memory */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">
                        {isCpuMode ? "Physical Cores / Threads" : "VRAM Memory Capacity"}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black">{itemAInfo.details}</td>
                      <td className="py-3.5 px-4 font-mono font-black">{itemBInfo.details}</td>
                    </tr>

                    {/* Semiconductor Process Node */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Process Node / 製造プロセス</td>
                      <td className="py-3.5 px-4">{techSpecsA.processNode}</td>
                      <td className="py-3.5 px-4">{techSpecsB.processNode}</td>
                    </tr>

                    {/* Base Clock */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Base Clock Frequency / 基本クロック</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.baseClock}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.baseClock}</td>
                    </tr>

                    {/* Boost / Turbo Clock */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Boost / Turbo Clock / ブーストクロック</td>
                      <td className="py-3.5 px-4 font-mono text-[#E88D9F] font-black">{techSpecsA.boostClock}</td>
                      <td className="py-3.5 px-4 font-mono text-[#E88D9F] font-black">{techSpecsB.boostClock}</td>
                    </tr>

                    {/* Cache Memory */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Cache Memory / キャッシュメモリ</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.cacheInfo}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.cacheInfo}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CATEGORY 3: THERMAL, POWER & EFFICIENCY RATINGS */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#E88D9F]" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                      Thermal, Power & Efficiency Ratings / 消費電力・評価スコア
                    </h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                      Thermal design power (TDP), recommended PSU, power efficiency, and cost-effectiveness ratio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 w-2/5">Specification Metric</th>
                      <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemAInfo.name}</th>
                      <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemBInfo.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold text-gray-700 dark:text-gray-300">
                    {/* Power Draw TDP */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Thermal Design Power (TDP) / 消費電力</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsA.powerDrawTdp}</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsB.powerDrawTdp}</td>
                    </tr>

                    {/* Recommended PSU */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Recommended PSU / 推奨電源容量</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.recommendedPsu}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.recommendedPsu}</td>
                    </tr>

                    {/* Power Efficiency Score */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Power Efficiency Score / ワットパフォーマンス</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-500">{techSpecsA.powerEfficiencyScore}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-500">{techSpecsB.powerEfficiencyScore}</td>
                    </tr>

                    {/* Cost-Effectiveness Score */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Cost-Effectiveness Rating / コスパ評価</td>
                      <td className="py-3.5 px-4 font-mono font-black text-[#E88D9F]">{techSpecsA.costEffectivenessScore}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-[#E88D9F]">{techSpecsB.costEffectivenessScore}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CATEGORY 4: INTERFACE & MEMORY SUPPORT */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-[#E88D9F]" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                      Platform, Memory & Bus Interface / ソケット・バス規格
                    </h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                      Motherboard socket compatibility, bus interface, and memory technology generations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 w-2/5">Specification Metric</th>
                      <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemAInfo.name}</th>
                      <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemBInfo.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold text-gray-700 dark:text-gray-300">
                    {/* Platform Socket / Bus */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Platform / Socket / Bus Interface</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsA.platformSocket}</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsB.platformSocket}</td>
                    </tr>

                    {/* Memory Support */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Memory Support & Generation</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.memorySupport}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.memorySupport}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-[#1A1C1E]/80 border border-dashed border-[#E88D9F]/30 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-lg animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-[#E88D9F]/10 text-[#E88D9F] flex items-center justify-center border border-[#E88D9F]/20 shadow-inner">
            <Sparkles className="w-7 h-7 text-[#E88D9F] animate-pulse" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
            Select 2 {isCpuMode ? "CPUs" : "GPUs"} to compare performance / {isCpuMode ? "CPU" : "GPU"}を2つ選択してください
          </h3>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 max-w-md">
            Choose both Candidate A and Candidate B from the dropdown menus above to generate the telemetry benchmark matrix and relative advantage score.
          </p>
        </div>
      )}
    </div>
  );
}
