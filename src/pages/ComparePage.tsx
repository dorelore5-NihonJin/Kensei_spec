import { useState } from "react";
import type { CPU, GPU } from "../lib/types";
import { Scale, Cpu as CpuIcon, Zap, Sparkles, Layers, MousePointerClick, ShieldCheck } from "lucide-react";
import { useHardware } from "../context/HardwareContext";
import SearchableSelect from "../components/SearchableSelect";
import AggregatePerformanceChart from "../components/AggregatePerformanceChart";

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

  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col gap-8 animate-fadeIn">
      {/* 1. PAGE HEADER & MODE TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-purple-500 font-extrabold text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Versus Benchmark Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E2022] dark:text-white mt-1">
            Hardware Comparison Studio
          </h1>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
            Select 2 components below to compare telemetry performance metrics side-by-side.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/10 dark:border-white/10 shrink-0">
          <button
            onClick={() => handleModeChange("cpu")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              mode === "cpu"
                ? "bg-purple-600 text-white shadow-md scale-102"
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
                ? "bg-purple-600 text-white shadow-md scale-102"
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
                  <span className="text-2xl font-black text-purple-500">{scoreA} pts</span>
                </div>
              </div>

              <button
                onClick={() => handleApplyToBuild(itemA as CPU | GPU)}
                className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-black transition flex items-center justify-center gap-1.5 mt-4"
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
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shadow-lg border border-purple-400/30 shrink-0">
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
                  <span className="text-2xl font-black text-purple-500">{scoreB} pts</span>
                </div>
              </div>

              <button
                onClick={() => handleApplyToBuild(itemB as CPU | GPU)}
                className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-black transition flex items-center justify-center gap-1.5 mt-4"
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

      {/* 3. BENCHMARK MATRIX CHART & DETAILED COMPARISON TABLE */}
      {isBothSelected && itemAInfo && itemBInfo ? (
        <div className="flex flex-col gap-8 animate-fadeIn transition-all duration-500 ease-out">
          {/* Aggregate Visual Benchmark Chart */}
          <AggregatePerformanceChart
            type={mode}
            itemA={itemAInfo}
            itemB={itemBInfo}
          />

          {/* Comprehensive Telemetry Specification Matrix Table */}
          <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-500" />
                <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                  Detailed Telemetry Specification Matrix / 詳細スペック比較
                </h3>
              </div>
              <span className="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                {isCpuMode ? "CPU Architecture" : "GPU Architecture"}
              </span>
            </div>

            {/* Side-by-side spec grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* COMPONENT A SPECS */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                  <span className="text-xs font-black text-purple-500 uppercase tracking-wider">Candidate A</span>
                  <h4 className="text-sm font-black text-[#1E2022] dark:text-white truncate">
                    {isCpuMode ? selectedCpuA?.name : selectedGpuA?.name}
                  </h4>
                </div>

                {isCpuMode && selectedCpuA ? (
                  <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Cores / Threads</span>
                      <span className="font-black font-mono">{selectedCpuA.cores} Cores / {selectedCpuA.threads} Threads</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Single Core Score</span>
                      <span className="font-black font-mono text-purple-600 dark:text-purple-400">{selectedCpuA.singleCoreScore} pts</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Multi Core Score</span>
                      <span className="font-black font-mono text-purple-600 dark:text-purple-400">{selectedCpuA.multiCoreScore} pts</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Socket / Platform</span>
                      <span className="font-black font-mono">{selectedCpuA.socket}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Release Year</span>
                      <span className="font-black font-mono">{selectedCpuA.releaseYear}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-bold text-gray-500">Manufacturer</span>
                      <span className="font-black">{selectedCpuA.manufacturer}</span>
                    </div>
                  </div>
                ) : !isCpuMode && selectedGpuA ? (
                  <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">VRAM Capacity</span>
                      <span className="font-black font-mono">{selectedGpuA.vramGB} GB</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Relative Power Score</span>
                      <span className="font-black font-mono text-purple-600 dark:text-purple-400">{selectedGpuA.relativePowerScore} pts</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Architecture</span>
                      <span className="font-black">{selectedGpuA.architecture}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Release Year</span>
                      <span className="font-black font-mono">{selectedGpuA.releaseYear}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-bold text-gray-500">Manufacturer</span>
                      <span className="font-black">{selectedGpuA.manufacturer}</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* COMPONENT B SPECS */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                  <span className="text-xs font-black text-purple-500 uppercase tracking-wider">Candidate B</span>
                  <h4 className="text-sm font-black text-[#1E2022] dark:text-white truncate">
                    {isCpuMode ? selectedCpuB?.name : selectedGpuB?.name}
                  </h4>
                </div>

                {isCpuMode && selectedCpuB ? (
                  <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Cores / Threads</span>
                      <span className="font-black font-mono">{selectedCpuB.cores} Cores / {selectedCpuB.threads} Threads</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Single Core Score</span>
                      <span className="font-black font-mono text-purple-600 dark:text-purple-400">{selectedCpuB.singleCoreScore} pts</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Multi Core Score</span>
                      <span className="font-black font-mono text-purple-600 dark:text-purple-400">{selectedCpuB.multiCoreScore} pts</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Socket / Platform</span>
                      <span className="font-black font-mono">{selectedCpuB.socket}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Release Year</span>
                      <span className="font-black font-mono">{selectedCpuB.releaseYear}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-bold text-gray-500">Manufacturer</span>
                      <span className="font-black">{selectedCpuB.manufacturer}</span>
                    </div>
                  </div>
                ) : !isCpuMode && selectedGpuB ? (
                  <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">VRAM Capacity</span>
                      <span className="font-black font-mono">{selectedGpuB.vramGB} GB</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Relative Power Score</span>
                      <span className="font-black font-mono text-purple-600 dark:text-purple-400">{selectedGpuB.relativePowerScore} pts</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Architecture</span>
                      <span className="font-black">{selectedGpuB.architecture}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="font-bold text-gray-500">Release Year</span>
                      <span className="font-black font-mono">{selectedGpuB.releaseYear}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-bold text-gray-500">Manufacturer</span>
                      <span className="font-black">{selectedGpuB.manufacturer}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-[#1A1C1E]/80 border border-dashed border-purple-500/30 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-lg animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 shadow-inner">
            <Sparkles className="w-7 h-7 text-purple-500 animate-pulse" />
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
