import { useState } from "react";
import type { CPU, GPU } from "../lib/types";
import { Scale, Cpu as CpuIcon, Zap, Sparkles, Layers } from "lucide-react";
import { useHardware } from "../context/HardwareContext";
import SearchableSelect from "../components/SearchableSelect";
import AggregatePerformanceChart from "../components/AggregatePerformanceChart";

interface ComparePageProps {
  cpus: CPU[];
  gpus: GPU[];
}

export default function ComparePage({ cpus, gpus }: ComparePageProps) {
  const { setSelectedCpu, setSelectedGpu, setActivePage, setCurrentStep } = useHardware();
  const [mode, setMode] = useState<"cpu" | "gpu">("cpu");

  // Default selections
  const [selectedCpuA, setSelectedCpuA] = useState<CPU>(() => cpus.find(c => c.id === "cpu-001") || cpus[0]);
  const [selectedCpuB, setSelectedCpuB] = useState<CPU>(() => cpus.find(c => c.id === "cpu-007") || cpus[1]);

  const [selectedGpuA, setSelectedGpuA] = useState<GPU>(() => gpus.find(g => g.id === "gpu-001") || gpus[0]);
  const [selectedGpuB, setSelectedGpuB] = useState<GPU>(() => gpus.find(g => g.id === "gpu-006") || gpus[1]);

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

  // CPU Score comparison: Single Core * 0.6 + Multi Core * 0.4
  const cpuScoreA = Math.round(selectedCpuA.singleCoreScore * 0.6 + (selectedCpuA.multiCoreScore / 10) * 0.4 * 10);
  const cpuScoreB = Math.round(selectedCpuB.singleCoreScore * 0.6 + (selectedCpuB.multiCoreScore / 10) * 0.4 * 10);

  // GPU Score comparison: relativePowerScore
  const gpuScoreA = selectedGpuA.relativePowerScore;
  const gpuScoreB = selectedGpuB.relativePowerScore;

  const isCpuMode = mode === "cpu";
  const scoreA = isCpuMode ? cpuScoreA : gpuScoreA;
  const scoreB = isCpuMode ? cpuScoreB : gpuScoreB;

  const deltaPct = scoreA > 0 && scoreB > 0
    ? Math.round(Math.abs((scoreA - scoreB) / Math.min(scoreA, scoreB)) * 100)
    : 0;

  const winner = scoreA > scoreB ? "A" : scoreB > scoreA ? "B" : "Tie";

  const handleApplyToBuild = (comp: CPU | GPU) => {
    if (isCpuMode) {
      setSelectedCpu(comp as CPU);
    } else {
      setSelectedGpu(comp as GPU);
    }
    setCurrentStep(1);
    setActivePage("simulator");
  };

  const itemAInfo = {
    name: isCpuMode ? selectedCpuA.name : selectedGpuA.name,
    score: scoreA,
    details: isCpuMode ? `${selectedCpuA.cores}C/${selectedCpuA.threads}T • Socket ${selectedCpuA.socket}` : `${selectedGpuA.vramGB}GB VRAM • ${selectedGpuA.architecture}`,
    manufacturer: isCpuMode ? selectedCpuA.manufacturer : selectedGpuA.manufacturer
  };

  const itemBInfo = {
    name: isCpuMode ? selectedCpuB.name : selectedGpuB.name,
    score: scoreB,
    details: isCpuMode ? `${selectedCpuB.cores}C/${selectedCpuB.threads}T • Socket ${selectedCpuB.socket}` : `${selectedGpuB.vramGB}GB VRAM • ${selectedGpuB.architecture}`,
    manufacturer: isCpuMode ? selectedCpuB.manufacturer : selectedGpuB.manufacturer
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* 1. PAGE HEADER & MODE SELECTOR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-500/15 font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-purple-500/20">
              Hardware Versus Matrix
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E2022] dark:text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-purple-500" />
            Hardware Versus Lab / スペック比較
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-1">
            Side-by-side silicon telemetry comparison, architecture breakdown, and performance rating.
          </p>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/10 dark:border-white/10 shrink-0">
          <button
            onClick={() => setMode("cpu")}
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
            onClick={() => setMode("gpu")}
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

      {/* 2. COMPONENT SELECTION BAR & HERO VERSUS SCORE CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COMPONENT A SELECTOR */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden">
          <SearchableSelect
            label="Component A (Left)"
            options={isCpuMode ? cpuOptions : gpuOptions}
            value={isCpuMode ? selectedCpuA.id : selectedGpuA.id}
            onChange={(id) => {
              if (isCpuMode) {
                const found = cpus.find((c) => c.id === id);
                if (found) setSelectedCpuA(found);
              } else {
                const found = gpus.find((g) => g.id === id);
                if (found) setSelectedGpuA(found);
              }
            }}
            placeholder={isCpuMode ? "Search CPU (e.g. 7800X3D)..." : "Search GPU (e.g. 4070 Super)..."}
          />

          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="text-base font-black text-[#1E2022] dark:text-white">
                {isCpuMode ? selectedCpuA.name : selectedGpuA.name}
              </h3>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                {isCpuMode ? `${selectedCpuA.cores} Cores / ${selectedCpuA.threads} Threads • Socket ${selectedCpuA.socket}` : `${selectedGpuA.vramGB}GB VRAM • ${selectedGpuA.architecture}`}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-gray-400 block">Performance Index</span>
              <span className="text-2xl font-black text-purple-500">{scoreA} pts</span>
            </div>
          </div>

          <button
            onClick={() => handleApplyToBuild(isCpuMode ? selectedCpuA : selectedGpuA)}
            className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-black transition flex items-center justify-center gap-1.5 mt-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Set as Active Build Component</span>
          </button>
        </div>

        {/* VERSUS BADGE DELTA */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center gap-2 pt-12">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shadow-lg border border-purple-400/30">
            VS
          </div>
          {winner !== "Tie" ? (
            <span className="text-[11px] font-extrabold text-emerald-500 text-center">
              Candidate {winner} leads by +{deltaPct}%
            </span>
          ) : (
            <span className="text-[11px] font-extrabold text-gray-400 text-center">Equal Match</span>
          )}
        </div>

        {/* COMPONENT B SELECTOR */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden">
          <SearchableSelect
            label="Component B (Right)"
            options={isCpuMode ? cpuOptions : gpuOptions}
            value={isCpuMode ? selectedCpuB.id : selectedGpuB.id}
            onChange={(id) => {
              if (isCpuMode) {
                const found = cpus.find((c) => c.id === id);
                if (found) setSelectedCpuB(found);
              } else {
                const found = gpus.find((g) => g.id === id);
                if (found) setSelectedGpuB(found);
              }
            }}
            placeholder={isCpuMode ? "Search CPU (e.g. 7800X3D)..." : "Search GPU (e.g. 4070 Super)..."}
          />

          <div className="flex items-center justify-between pt-2">
            <div>
              <h3 className="text-base font-black text-[#1E2022] dark:text-white">
                {isCpuMode ? selectedCpuB.name : selectedGpuB.name}
              </h3>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                {isCpuMode ? `${selectedCpuB.cores} Cores / ${selectedCpuB.threads} Threads • Socket ${selectedCpuB.socket}` : `${selectedGpuB.vramGB}GB VRAM • ${selectedGpuB.architecture}`}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-gray-400 block">Performance Index</span>
              <span className="text-2xl font-black text-purple-500">{scoreB} pts</span>
            </div>
          </div>

          <button
            onClick={() => handleApplyToBuild(isCpuMode ? selectedCpuB : selectedGpuB)}
            className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-black transition flex items-center justify-center gap-1.5 mt-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Set as Active Build Component</span>
          </button>
        </div>
      </div>

      {/* 3. AGGREGATE PERFORMANCE STACKED COMPARISON CHART */}
      <AggregatePerformanceChart
        type={mode}
        itemA={itemAInfo}
        itemB={itemBInfo}
      />

      {/* 3. SIDE-BY-SIDE DETAILED COMPARISON TABLE */}
      <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
          <h3 className="text-base font-black text-[#1E2022] dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Detailed Technical Specification Matrix / 仕様比較表
          </h3>
          <span className="text-[10px] font-black uppercase bg-purple-500/15 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">
            Verified Specs
          </span>
        </div>

        {isCpuMode ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold border-collapse">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 text-gray-400 uppercase text-[10px]">
                  <th className="py-3 px-4 w-1/3">Specification Field</th>
                  <th className="py-3 px-4 w-1/3 text-purple-500 font-mono text-sm">{selectedCpuA.name}</th>
                  <th className="py-3 px-4 w-1/3 text-purple-500 font-mono text-sm">{selectedCpuB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[#1E2022] dark:text-gray-200">
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Manufacturer / Vendor</td>
                  <td className="py-3.5 px-4">{selectedCpuA.manufacturer}</td>
                  <td className="py-3.5 px-4">{selectedCpuB.manufacturer}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Cores / Threads</td>
                  <td className="py-3.5 px-4">{selectedCpuA.cores} Cores / {selectedCpuA.threads} Threads</td>
                  <td className="py-3.5 px-4">{selectedCpuB.cores} Cores / {selectedCpuB.threads} Threads</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Single-Core Score (Cinebench/Geekbench)</td>
                  <td className="py-3.5 px-4">{selectedCpuA.singleCoreScore} pts</td>
                  <td className="py-3.5 px-4">{selectedCpuB.singleCoreScore} pts</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Multi-Core Throughput Score</td>
                  <td className="py-3.5 px-4">{selectedCpuA.multiCoreScore} pts</td>
                  <td className="py-3.5 px-4">{selectedCpuB.multiCoreScore} pts</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">L3 Cache Architecture</td>
                  <td className="py-3.5 px-4">
                    {selectedCpuA.l3CacheMB}MB {selectedCpuA.is3DVCache && <span className="ml-1 text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-md font-extrabold">3D V-Cache</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    {selectedCpuB.l3CacheMB}MB {selectedCpuB.is3DVCache && <span className="ml-1 text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-md font-extrabold">3D V-Cache</span>}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Motherboard Socket</td>
                  <td className="py-3.5 px-4 font-mono text-purple-400">Socket {selectedCpuA.socket}</td>
                  <td className="py-3.5 px-4 font-mono text-purple-400">Socket {selectedCpuB.socket}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Supported DDR Generations</td>
                  <td className="py-3.5 px-4">{selectedCpuA.supportedDdr.join(", ")}</td>
                  <td className="py-3.5 px-4">{selectedCpuB.supportedDdr.join(", ")}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Thermal Power (TDP)</td>
                  <td className="py-3.5 px-4">{selectedCpuA.tdpW} Watts</td>
                  <td className="py-3.5 px-4">{selectedCpuB.tdpW} Watts</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Release Year</td>
                  <td className="py-3.5 px-4">{selectedCpuA.releaseYear}</td>
                  <td className="py-3.5 px-4">{selectedCpuB.releaseYear}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold border-collapse">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 text-gray-400 uppercase text-[10px]">
                  <th className="py-3 px-4 w-1/3">Specification Field</th>
                  <th className="py-3 px-4 w-1/3 text-purple-500 font-mono text-sm">{selectedGpuA.name}</th>
                  <th className="py-3 px-4 w-1/3 text-purple-500 font-mono text-sm">{selectedGpuB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 text-[#1E2022] dark:text-gray-200">
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Manufacturer / Vendor</td>
                  <td className="py-3.5 px-4">{selectedGpuA.manufacturer}</td>
                  <td className="py-3.5 px-4">{selectedGpuB.manufacturer}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">VRAM Capacity</td>
                  <td className="py-3.5 px-4">{selectedGpuA.vramGB} GB</td>
                  <td className="py-3.5 px-4">{selectedGpuB.vramGB} GB</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">GPU Architecture / Micro-code</td>
                  <td className="py-3.5 px-4">{selectedGpuA.architecture}</td>
                  <td className="py-3.5 px-4">{selectedGpuB.architecture}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Relative Power Score</td>
                  <td className="py-3.5 px-4">{selectedGpuA.relativePowerScore} pts</td>
                  <td className="py-3.5 px-4">{selectedGpuB.relativePowerScore} pts</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Ray Tracing Hardware Accelerator Score</td>
                  <td className="py-3.5 px-4">{selectedGpuA.rayTracingPowerScore} pts</td>
                  <td className="py-3.5 px-4">{selectedGpuB.rayTracingPowerScore} pts</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Thermal Power (TDP)</td>
                  <td className="py-3.5 px-4">{selectedGpuA.tdpW} Watts</td>
                  <td className="py-3.5 px-4">{selectedGpuB.tdpW} Watts</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 text-gray-400 uppercase text-[10px]">Release Year</td>
                  <td className="py-3.5 px-4">{selectedGpuA.releaseYear}</td>
                  <td className="py-3.5 px-4">{selectedGpuB.releaseYear}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
