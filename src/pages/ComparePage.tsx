import { useState } from "react";
import type { CPU, GPU } from "../lib/types";
import { Scale, Cpu as CpuIcon, Zap, Sparkles, Layers, MousePointerClick, Trophy, Flame, HardDrive, Cpu, Check, ShieldCheck, Activity } from "lucide-react";
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

  const [mode, setMode] = useState<"cpu" | "gpu">(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode");
    if (modeParam === "gpu" || modeParam === "cpu") return modeParam;
    return "cpu";
  });

  const [selectedCpuA, setSelectedCpuA] = useState<CPU | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode") || "cpu";
    const aParam = urlParams.get("a");
    if (modeParam === "cpu" && aParam) {
      return cpus.find((c) => c.id === aParam) || null;
    }
    return cpus[0] || null;
  });

  const [selectedCpuB, setSelectedCpuB] = useState<CPU | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get("mode") || "cpu";
    const bParam = urlParams.get("b");
    if (modeParam === "cpu" && bParam) {
      return cpus.find((c) => c.id === bParam) || null;
    }
    return cpus[1] || cpus[0] || null;
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
    url.searchParams.set("page", "compare");
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

  // Helper to render winning spec with emerald badge
  const getWinnerClass = (winnerSide: "A" | "B" | "none", targetSide: "A" | "B", valText: React.ReactNode) => {
    if (winnerSide === targetSide) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono font-black text-xs shadow-sm">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>{valText}</span>
          <span className="text-[9px] font-black uppercase bg-emerald-500 text-white dark:text-black px-1.5 py-0.2 rounded ml-1 tracking-wider">
            Better
          </span>
        </span>
      );
    }
    return <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">{valText}</span>;
  };

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
                : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
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
                : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
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
                        <button
                          type="button"
                          onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set("page", "rankings");
                            url.searchParams.set("type", mode);
                            url.searchParams.set("highlight", itemA.id);
                            window.history.replaceState({}, "", url.toString());
                            setActivePage("rankings");
                          }}
                          className={`px-3 py-1 rounded-xl font-mono font-black text-xs border inline-flex items-center gap-1.5 transition hover:scale-105 ${
                            techSpecsA.rank < techSpecsB.rank
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                              : "bg-[#E88D9F]/10 text-[#E88D9F] border-[#E88D9F]/20 hover:bg-[#E88D9F]/20"
                          }`}
                          title="Click to view full global ranking hierarchy"
                        >
                          <span>#{techSpecsA.rank}</span>
                          {techSpecsA.rank < techSpecsB.rank && (
                            <span className="inline-flex items-center gap-0.5 text-amber-500 dark:text-amber-400 font-extrabold ml-1">
                              <Trophy className="w-3 h-3" /> Best
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set("page", "rankings");
                            url.searchParams.set("type", mode);
                            url.searchParams.set("highlight", itemB.id);
                            window.history.replaceState({}, "", url.toString());
                            setActivePage("rankings");
                          }}
                          className={`px-3 py-1 rounded-xl font-mono font-black text-xs border inline-flex items-center gap-1.5 transition hover:scale-105 ${
                            techSpecsB.rank < techSpecsA.rank
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                              : "bg-[#E88D9F]/10 text-[#E88D9F] border-[#E88D9F]/20 hover:bg-[#E88D9F]/20"
                          }`}
                          title="Click to view full global ranking hierarchy"
                        >
                          <span>#{techSpecsB.rank}</span>
                          {techSpecsB.rank < techSpecsA.rank && (
                            <span className="inline-flex items-center gap-0.5 text-amber-500 dark:text-amber-400 font-extrabold ml-1">
                              <Trophy className="w-3 h-3" /> Best
                            </span>
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Place by Popularity */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Place by Popularity / 人気ランキング</td>
                      <td className="py-3.5 px-4">{getWinnerClass(techSpecsA.popularityRank < techSpecsB.popularityRank ? "A" : "B", "A", `#${techSpecsA.popularityRank} in builds`)}</td>
                      <td className="py-3.5 px-4">{getWinnerClass(techSpecsB.popularityRank < techSpecsA.popularityRank ? "B" : "A", "B", `#${techSpecsB.popularityRank} in builds`)}</td>
                    </tr>

                    {/* Cost-Effectiveness Evaluation */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Cost-Effectiveness Evaluation / コスパ評価</td>
                      <td className="py-3.5 px-4">{getWinnerClass(parseFloat(techSpecsA.costEffectivenessScore) >= parseFloat(techSpecsB.costEffectivenessScore) ? "A" : "B", "A", `${techSpecsA.costEffectivenessScore} Rating`)}</td>
                      <td className="py-3.5 px-4">{getWinnerClass(parseFloat(techSpecsB.costEffectivenessScore) >= parseFloat(techSpecsA.costEffectivenessScore) ? "B" : "A", "B", `${techSpecsB.costEffectivenessScore} Rating`)}</td>
                    </tr>

                    {/* Power Efficiency */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Power Efficiency / ワットパフォーマンス</td>
                      <td className="py-3.5 px-4">{getWinnerClass(parseFloat(techSpecsA.powerEfficiencyScore) >= parseFloat(techSpecsB.powerEfficiencyScore) ? "A" : "B", "A", `${techSpecsA.powerEfficiencyScore} Efficiency`)}</td>
                      <td className="py-3.5 px-4">{getWinnerClass(parseFloat(techSpecsB.powerEfficiencyScore) >= parseFloat(techSpecsA.powerEfficiencyScore) ? "B" : "A", "B", `${techSpecsB.powerEfficiencyScore} Efficiency`)}</td>
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
                      <td className="py-3.5 px-4 font-black">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                            itemAInfo.manufacturer === "Intel"
                              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                              : itemAInfo.manufacturer === "AMD"
                              ? "bg-[#E88D9F]/15 text-[#E88D9F] border-[#E88D9F]/30"
                              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {itemAInfo.manufacturer}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                            itemBInfo.manufacturer === "Intel"
                              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                              : itemBInfo.manufacturer === "AMD"
                              ? "bg-[#E88D9F]/15 text-[#E88D9F] border-[#E88D9F]/30"
                              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {itemBInfo.manufacturer}
                        </span>
                      </td>
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
                      <td className="py-3.5 px-4">{getWinnerClass(parseInt(techSpecsA.releaseDate) >= parseInt(techSpecsB.releaseDate) ? "A" : "B", "A", techSpecsA.releaseDate)}</td>
                      <td className="py-3.5 px-4">{getWinnerClass(parseInt(techSpecsB.releaseDate) >= parseInt(techSpecsA.releaseDate) ? "B" : "A", "B", techSpecsB.releaseDate)}</td>
                    </tr>

                    {/* Launch Price MSRP */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Launch Price (MSRP) / 発売価格</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsA.launchMsrp}</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsB.launchMsrp}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CATEGORY 2: DETAILED SPECIFICATIONS & SILICON MICROARCHITECTURE */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#E88D9F]" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                      Detailed Specifications & Cores / 詳細スペック・コア構成
                    </h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                      Physical compute engines, clock frequencies, bus rate, cache memory, and semiconductor lithography.
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
                      <td className="py-3.5 px-4">
                        {getWinnerClass(
                          isCpuMode
                            ? (itemA as CPU).cores >= (itemB as CPU).cores ? "A" : "B"
                            : (itemA as GPU).vramGB >= (itemB as GPU).vramGB ? "A" : "B",
                          "A",
                          itemAInfo.details
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {getWinnerClass(
                          isCpuMode
                            ? (itemB as CPU).cores >= (itemA as CPU).cores ? "B" : "A"
                            : (itemB as GPU).vramGB >= (itemA as GPU).vramGB ? "B" : "A",
                          "B",
                          itemBInfo.details
                        )}
                      </td>
                    </tr>

                    {/* Semiconductor Process Node */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Process Node Lithography / 製造プロセス</td>
                      <td className="py-3.5 px-4">{techSpecsA.processNode}</td>
                      <td className="py-3.5 px-4">{techSpecsB.processNode}</td>
                    </tr>

                    {/* Base Clock */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Base Clock Speed / 基本クロック</td>
                      <td className="py-3.5 px-4">{getWinnerClass(parseFloat(techSpecsA.baseClock) >= parseFloat(techSpecsB.baseClock) ? "A" : "B", "A", techSpecsA.baseClock)}</td>
                      <td className="py-3.5 px-4">{getWinnerClass(parseFloat(techSpecsB.baseClock) >= parseFloat(techSpecsA.baseClock) ? "B" : "A", "B", techSpecsB.baseClock)}</td>
                    </tr>

                    {/* Boost / Turbo Clock */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Boost / Turbo Clock Speed / ブーストクロック</td>
                      <td className="py-3.5 px-4">{getWinnerClass(parseFloat(techSpecsA.boostClock) >= parseFloat(techSpecsB.boostClock) ? "A" : "B", "A", techSpecsA.boostClock)}</td>
                      <td className="py-3.5 px-4">{getWinnerClass(parseFloat(techSpecsB.boostClock) >= parseFloat(techSpecsA.boostClock) ? "B" : "A", "B", techSpecsB.boostClock)}</td>
                    </tr>

                    {/* Bus Rate */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Bus Rate / DMI / Fabric Speed</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.busRate}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.busRate}</td>
                    </tr>

                    {/* L1 Cache */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">L1 Cache Memory</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.l1Cache}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.l1Cache}</td>
                    </tr>

                    {/* L2 Cache */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">L2 Cache Memory</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.l2Cache}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.l2Cache}</td>
                    </tr>

                    {/* L3 Cache */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">L3 Cache Memory / L3キャッシュ</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.l3Cache}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.l3Cache}</td>
                    </tr>

                    {/* Die Size */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Die Size (mm²) / ダイサイズ</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.dieSize}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.dieSize}</td>
                    </tr>

                    {/* Max Core Temperature */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Max Temperature (TjMax) / 限界温度</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.maxTemp}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.maxTemp}</td>
                    </tr>

                    {/* 64-Bit Support */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">64-bit Architecture Support</td>
                      <td className="py-3.5 px-4 font-black text-emerald-500">+ (Supported)</td>
                      <td className="py-3.5 px-4 font-black text-emerald-500">+ (Supported)</td>
                    </tr>

                    {/* Windows 11 Compatibility */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Windows 11 Official Compatibility</td>
                      <td className="py-3.5 px-4">{techSpecsA.win11Compat ? <span className="text-emerald-500 font-black">+ (Compatible)</span> : <span className="text-red-400 font-bold">- (Legacy)</span>}</td>
                      <td className="py-3.5 px-4">{techSpecsB.win11Compat ? <span className="text-emerald-500 font-black">+ (Compatible)</span> : <span className="text-red-400 font-bold">- (Legacy)</span>}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CATEGORY 3: COMPATIBILITY, SOCKET & POWER */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#E88D9F]" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                      Compatibility, Socket & Power / 互換性・ソケット・消費電力
                    </h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                      Motherboard socket type, thermal design power (TDP), and power supply unit requirements.
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
                    {/* Socket */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Platform / Socket / Bus Slot</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsA.platformSocket}</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsB.platformSocket}</td>
                    </tr>

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
                  </tbody>
                </table>
              </div>
            </div>

            {/* CATEGORY 4: TECHNOLOGIES & EXTENSIONS */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#E88D9F]" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                      Technologies, Extensions & AI / 拡張命令・セキュリティ・AI
                    </h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                      SIMD instruction sets, hardware encryption, virtualization, and AI neural engines.
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
                    {/* Instruction Set Extensions */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Instruction Set Extensions</td>
                      <td className="py-3.5 px-4 font-mono text-[#E88D9F] font-black">{techSpecsA.instructionSets}</td>
                      <td className="py-3.5 px-4 font-mono text-[#E88D9F] font-black">{techSpecsB.instructionSets}</td>
                    </tr>

                    {/* AES-NI */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">AES-NI Encryption Acceleration</td>
                      <td className="py-3.5 px-4 font-black text-emerald-500">+ (Supported)</td>
                      <td className="py-3.5 px-4 font-black text-emerald-500">+ (Supported)</td>
                    </tr>

                    {/* Deep Learning Boost / AI */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Deep Learning Boost / AI Engine</td>
                      <td className="py-3.5 px-4">{techSpecsA.dlBoost ? <span className="text-emerald-500 font-black">+ (Supported)</span> : <span className="text-gray-400">-</span>}</td>
                      <td className="py-3.5 px-4">{techSpecsB.dlBoost ? <span className="text-emerald-500 font-black">+ (Supported)</span> : <span className="text-gray-400">-</span>}</td>
                    </tr>

                    {/* Virtualization */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Hardware Virtualization (VT-x / AMD-V)</td>
                      <td className="py-3.5 px-4 font-black text-emerald-500">+ (Supported)</td>
                      <td className="py-3.5 px-4 font-black text-emerald-500">+ (Supported)</td>
                    </tr>

                    {/* Hyper-Threading / SMT */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Hyper-Threading / SMT Multi-Threading</td>
                      <td className="py-3.5 px-4">{techSpecsA.hyperThreading ? <span className="text-emerald-500 font-black">+ (Supported)</span> : <span className="text-gray-400">-</span>}</td>
                      <td className="py-3.5 px-4">{techSpecsB.hyperThreading ? <span className="text-emerald-500 font-black">+ (Supported)</span> : <span className="text-gray-400">-</span>}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CATEGORY 5: MEMORY SPECS */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-[#E88D9F]" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                      Memory Specs & Bandwidth / メモリ仕様・帯域幅
                    </h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                      Supported memory types, max capacity, memory channel count, and peak memory bandwidth.
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
                    {/* Supported Memory Types */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Supported Memory Types</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsA.memorySupport}</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsB.memorySupport}</td>
                    </tr>

                    {/* Maximum Memory Capacity */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Maximum Memory Capacity</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.maxMemorySize}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.maxMemorySize}</td>
                    </tr>

                    {/* Memory Channels */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Max Memory Channels</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.memoryChannels}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.memoryChannels}</td>
                    </tr>

                    {/* Maximum Memory Bandwidth */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Peak Memory Bandwidth / 最大帯域幅</td>
                      <td className="py-3.5 px-4">{getWinnerClass(parseFloat(techSpecsA.memoryBandwidth) >= parseFloat(techSpecsB.memoryBandwidth) ? "A" : "B", "A", techSpecsA.memoryBandwidth)}</td>
                      <td className="py-3.5 px-4">{getWinnerClass(parseFloat(techSpecsB.memoryBandwidth) >= parseFloat(techSpecsA.memoryBandwidth) ? "B" : "A", "B", techSpecsB.memoryBandwidth)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CATEGORY 6: GRAPHICS SPECIFICATIONS & PERIPHERALS */}
            <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#E88D9F]" />
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                      Graphics Specifications & Peripherals / グラフィック・周辺機器
                    </h3>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                      Integrated graphics processor, PCI Express generation, and bus lane width.
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
                    {/* Integrated Graphics Model */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">Integrated Graphics Processor / 内蔵グラフィックス</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsA.iGpuModel}</td>
                      <td className="py-3.5 px-4 font-mono font-black">{techSpecsB.iGpuModel}</td>
                    </tr>

                    {/* PCI Express Version */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">PCI Express Interface Revision</td>
                      <td className="py-3.5 px-4">{getWinnerClass(techSpecsA.pcieVersion.includes("5.0") ? "A" : "B", "A", techSpecsA.pcieVersion)}</td>
                      <td className="py-3.5 px-4">{getWinnerClass(techSpecsB.pcieVersion.includes("5.0") ? "B" : "A", "B", techSpecsB.pcieVersion)}</td>
                    </tr>

                    {/* PCI Express Lanes */}
                    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-500">PCI Express Lanes Count</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsA.pcieLanes}</td>
                      <td className="py-3.5 px-4 font-mono">{techSpecsB.pcieLanes}</td>
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
