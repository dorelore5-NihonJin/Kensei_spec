import { useState, useEffect } from "react";
import { useHardware } from "../context/HardwareContext";
import { useLanguage } from "../context/LanguageContext";
import type { CPU, GPU } from "../lib/types";
import { getCpuTechnicalDetails, getGpuTechnicalDetails } from "../lib/hardwareSpecs";
import { getHardwareSlug, findCpuBySlugOrId, findGpuBySlugOrId } from "../lib/slugs";
import AggregatePerformanceChart from "../components/AggregatePerformanceChart";
import GpuGamingBenchmarkChart from "../components/GpuGamingBenchmarkChart";
import SearchableSelect, { type SelectOption } from "../components/SearchableSelect";
import {
  Trophy,
  Sparkles,
  Zap,
  Cpu,
  Flame,
  MousePointerClick,
  Scale,
  HardDrive,
  Check,
  Gamepad2,
  Monitor,
  ShieldCheck,
  Activity
} from "lucide-react";

interface ComparePageProps {
  cpus: CPU[];
  gpus: GPU[];
}

export default function ComparePage({ cpus, gpus }: ComparePageProps) {
  const { setSelectedCpu, setSelectedGpu, setActivePage, setCurrentStep } = useHardware();
  const { t, formatPrice } = useLanguage();

  const renderMsrp = (msrpStr: any) => {
    if (msrpStr === undefined || msrpStr === null) return "N/A";
    const str = String(msrpStr);
    const val = parseFloat(str.replace(/[^0-9.]/g, ""));
    if (isNaN(val) || val === 0) return str;
    return formatPrice(val);
  };

  const [mode, setMode] = useState<"cpu" | "gpu">(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page");
    if (pageParam === "compare-gpu") return "gpu";
    if (pageParam === "compare-cpu") return "cpu";
    const modeParam = urlParams.get("mode");
    if (modeParam === "gpu" || modeParam === "cpu") return modeParam;
    return "cpu";
  });

  const [selectedCpuA, setSelectedCpuA] = useState<CPU | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page");
    const modeParam = urlParams.get("mode") || (pageParam === "compare-gpu" ? "gpu" : "cpu");
    const aParam = urlParams.get("a");
    const cpuAParam = urlParams.get("cpuA");
    const target = (modeParam === "cpu" || pageParam === "compare-cpu" ? aParam : null) || cpuAParam || localStorage.getItem("kensei_compare_cpu_a");
    const match = findCpuBySlugOrId(cpus, target);
    return match || cpus[0] || null;
  });

  const [selectedCpuB, setSelectedCpuB] = useState<CPU | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page");
    const modeParam = urlParams.get("mode") || (pageParam === "compare-gpu" ? "gpu" : "cpu");
    const bParam = urlParams.get("b");
    const cpuBParam = urlParams.get("cpuB");
    const target = (modeParam === "cpu" || pageParam === "compare-cpu" ? bParam : null) || cpuBParam || localStorage.getItem("kensei_compare_cpu_b");
    const match = findCpuBySlugOrId(cpus, target);
    return match || cpus[1] || cpus[0] || null;
  });

  const [selectedGpuA, setSelectedGpuA] = useState<GPU | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page");
    const modeParam = urlParams.get("mode") || (pageParam === "compare-gpu" ? "gpu" : "cpu");
    const aParam = urlParams.get("a");
    const gpuAParam = urlParams.get("gpuA");
    const target = (modeParam === "gpu" || pageParam === "compare-gpu" ? aParam : null) || gpuAParam || localStorage.getItem("kensei_compare_gpu_a");
    const match = findGpuBySlugOrId(gpus, target);
    return match || gpus[0] || null;
  });

  const [selectedGpuB, setSelectedGpuB] = useState<GPU | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page");
    const modeParam = urlParams.get("mode") || (pageParam === "compare-gpu" ? "gpu" : "cpu");
    const bParam = urlParams.get("b");
    const gpuBParam = urlParams.get("gpuB");
    const target = (modeParam === "gpu" || pageParam === "compare-gpu" ? bParam : null) || gpuBParam || localStorage.getItem("kensei_compare_gpu_b");
    const match = findGpuBySlugOrId(gpus, target);
    return match || gpus[1] || gpus[0] || null;
  });

  // Ensure default fallback selections if cpus/gpus load asynchronously or initial state is null
  useEffect(() => {
    if (!selectedCpuA && cpus.length > 0) setSelectedCpuA(cpus[0]);
    if (!selectedCpuB && cpus.length > 0) setSelectedCpuB(cpus[1] || cpus[0]);
  }, [cpus, selectedCpuA, selectedCpuB]);

  useEffect(() => {
    if (!selectedGpuA && gpus.length > 0) setSelectedGpuA(gpus[0]);
    if (!selectedGpuB && gpus.length > 0) setSelectedGpuB(gpus[1] || gpus[0]);
  }, [gpus, selectedGpuA, selectedGpuB]);

  // Save selection states to localStorage
  useEffect(() => {
    if (selectedCpuA) localStorage.setItem("kensei_compare_cpu_a", selectedCpuA.id);
    if (selectedCpuB) localStorage.setItem("kensei_compare_cpu_b", selectedCpuB.id);
  }, [selectedCpuA, selectedCpuB]);

  useEffect(() => {
    if (selectedGpuA) localStorage.setItem("kensei_compare_gpu_a", selectedGpuA.id);
    if (selectedGpuB) localStorage.setItem("kensei_compare_gpu_b", selectedGpuB.id);
  }, [selectedGpuA, selectedGpuB]);

  // Helper to sync clean human-readable URLs with pushState navigation history
  const syncUrlParams = (
    currentMode: "cpu" | "gpu",
    cpuA: CPU | null,
    cpuB: CPU | null,
    gpuA: GPU | null,
    gpuB: GPU | null,
    useReplace: boolean = false
  ) => {
    try {
      const url = new URL(window.location.href);
      // Clean dedicated sub-route page parameter
      url.searchParams.set("page", currentMode === "cpu" ? "compare-cpu" : "compare-gpu");
      url.searchParams.delete("mode");
      url.searchParams.delete("cpuA");
      url.searchParams.delete("cpuB");
      url.searchParams.delete("gpuA");
      url.searchParams.delete("gpuB");

      const activeA = currentMode === "cpu" ? cpuA : gpuA;
      const activeB = currentMode === "cpu" ? cpuB : gpuB;
      if (activeA) url.searchParams.set("a", getHardwareSlug(activeA));
      if (activeB) url.searchParams.set("b", getHardwareSlug(activeB));

      if (useReplace) {
        window.history.replaceState({}, "", url.toString());
      } else {
        window.history.pushState({}, "", url.toString());
      }
    } catch {
      // Ignore URL sync errors
    }
  };

  // Immediately sync active selections into URL bar on mount so user can share link instantly
  useEffect(() => {
    syncUrlParams(mode, selectedCpuA, selectedCpuB, selectedGpuA, selectedGpuB, true);
  }, []);

  // Listen for browser Back/Forward (popstate) navigation to keep Compare state in sync
  useEffect(() => {
    const handlePopStateSync = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get("page");
      const modeParam = urlParams.get("mode");
      
      let activeMode: "cpu" | "gpu" = mode;
      if (pageParam === "compare-gpu" || modeParam === "gpu") {
        activeMode = "gpu";
        setMode("gpu");
      } else if (pageParam === "compare-cpu" || modeParam === "cpu") {
        activeMode = "cpu";
        setMode("cpu");
      }

      const aParam = urlParams.get("a");
      const bParam = urlParams.get("b");

      if (activeMode === "cpu") {
        const targetA = aParam || urlParams.get("cpuA");
        const targetB = bParam || urlParams.get("cpuB");
        if (targetA) {
          const matchA = findCpuBySlugOrId(cpus, targetA);
          if (matchA) setSelectedCpuA(matchA);
        }
        if (targetB) {
          const matchB = findCpuBySlugOrId(cpus, targetB);
          if (matchB) setSelectedCpuB(matchB);
        }
      } else {
        const targetA = aParam || urlParams.get("gpuA");
        const targetB = bParam || urlParams.get("gpuB");
        if (targetA) {
          const matchA = findGpuBySlugOrId(gpus, targetA);
          if (matchA) setSelectedGpuA(matchA);
        }
        if (targetB) {
          const matchB = findGpuBySlugOrId(gpus, targetB);
          if (matchB) setSelectedGpuB(matchB);
        }
      }
    };

    window.addEventListener("popstate", handlePopStateSync);
    return () => window.removeEventListener("popstate", handlePopStateSync);
  }, [cpus, gpus, mode]);

  const handleModeChange = (newMode: "cpu" | "gpu") => {
    setMode(newMode);
    syncUrlParams(newMode, selectedCpuA, selectedCpuB, selectedGpuA, selectedGpuB);
  };

  const handleSelectA = (id: string) => {
    if (mode === "cpu") {
      const found = cpus.find((c) => c.id === id) || selectedCpuA || cpus[0] || null;
      if (found) setSelectedCpuA(found);
      syncUrlParams("cpu", found, selectedCpuB, selectedGpuA, selectedGpuB);
    } else {
      const found = gpus.find((g) => g.id === id) || selectedGpuA || gpus[0] || null;
      if (found) setSelectedGpuA(found);
      syncUrlParams("gpu", selectedCpuA, selectedCpuB, found, selectedGpuB);
    }
  };

  const handleSelectB = (id: string) => {
    if (mode === "cpu") {
      const found = cpus.find((c) => c.id === id) || selectedCpuB || cpus[1] || cpus[0] || null;
      if (found) setSelectedCpuB(found);
      syncUrlParams("cpu", selectedCpuA, found, selectedGpuA, selectedGpuB);
    } else {
      const found = gpus.find((g) => g.id === id) || selectedGpuB || gpus[1] || gpus[0] || null;
      if (found) setSelectedGpuB(found);
      syncUrlParams("gpu", selectedCpuA, selectedCpuB, selectedGpuA, found);
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
    subText: g.manufacturer === "Apple" ? `${g.vramGB}GB Unified RAM • ${g.architecture} • ${g.releaseYear}` : g.isIntegrated ? `${g.vramGB}GB Shared RAM (iGPU) • ${g.architecture} • ${g.releaseYear}` : `${g.vramGB}GB VRAM • ${g.architecture} • ${g.releaseYear}`,
    manufacturer: g.manufacturer
  }));

  const isCpuMode = mode === "cpu";
  const itemA = isCpuMode ? selectedCpuA : selectedGpuA;
  const itemB = isCpuMode ? selectedCpuB : selectedGpuB;

  // Smart Recommendation Engine for hardware dropdown options
  const rankOptions = (
    options: SelectOption[],
    selectedOpponent: CPU | GPU | null,
    rawItems: (CPU | GPU)[]
  ): SelectOption[] => {
    const opponentYear = selectedOpponent?.releaseYear || 0;
    const opponentBrand = selectedOpponent?.manufacturer || "";
    const opponentScore = selectedOpponent
      ? ("singleCoreScore" in selectedOpponent
          ? Math.round(selectedOpponent.singleCoreScore * 0.6 + (selectedOpponent.multiCoreScore / 10) * 0.4 * 10)
          : (selectedOpponent as GPU).relativePowerScore)
      : 0;

    const mapped = options.map((opt) => {
      const raw = rawItems.find((item) => item.id === opt.id);
      if (!raw) return { opt, rankScore: 0 };

      const year = raw.releaseYear || 2010;
      const brand = raw.manufacturer;
      const score = "singleCoreScore" in raw
        ? Math.round(raw.singleCoreScore * 0.6 + (raw.multiCoreScore / 10) * 0.4 * 10)
        : (raw as GPU).relativePowerScore;

      let badge: string | undefined;
      let badgeColor: "rival" | "era" | "popular" | "recent" | undefined;
      let rankScore = 0;

      if (selectedOpponent) {
        const yearDiff = Math.abs(year - opponentYear);
        const maxScoreVal = Math.max(opponentScore, score, 1);
        const scoreDiffRatio = Math.abs(score - opponentScore) / maxScoreVal;

        // Direct Cross-Brand Rival: Same era (<= 2 yrs) + similar tier (scoreDiffRatio <= 0.35) + competitor brand
        if (yearDiff <= 2 && scoreDiffRatio <= 0.35 && brand !== opponentBrand) {
          rankScore = 15000 - scoreDiffRatio * 1000 - yearDiff * 100;
          badge = `Direct ${brand} Rival`;
          badgeColor = "rival";
        }
        // Same Era Alternative: Same era (<= 1 yr) + similar tier (scoreDiffRatio <= 0.4)
        else if (yearDiff <= 1 && scoreDiffRatio <= 0.4) {
          rankScore = 12000 - yearDiff * 500 - scoreDiffRatio * 1000;
          badge = `${year} Era Rival`;
          badgeColor = "era";
        }
        // Similar Performance Tier
        else if (scoreDiffRatio <= 0.25 && yearDiff <= 4) {
          rankScore = 10000 - scoreDiffRatio * 1000;
          badge = `Similar Tier`;
          badgeColor = "popular";
        }
        // Modern components (2020+)
        else if (year >= 2020) {
          rankScore = 5000 + (year - 2020) * 10;
        }
        // Mid-era components (2012–2019)
        else if (year >= 2012) {
          rankScore = 2000 + (year - 2012) * 10;
        } else {
          rankScore = year;
        }
      } else {
        // No opponent selected -> Rank modern hardware (2012+) first
        if (year >= 2020) {
          rankScore = 5000 + year * 2;
          badge = year >= 2022 ? `Modern` : undefined;
          badgeColor = "recent";
        } else if (year >= 2015) {
          rankScore = 3000 + year;
        } else if (year >= 2012) {
          rankScore = 1000 + year;
        } else {
          rankScore = year;
        }
      }

      return {
        opt: { ...opt, badge, badgeColor, releaseYear: year },
        rankScore
      };
    });

    mapped.sort((a, b) => b.rankScore - a.rankScore);
    return mapped.map((m) => m.opt);
  };

  const filteredOptionsA = isCpuMode
    ? rankOptions(cpuOptions.filter((opt) => opt.id !== selectedCpuB?.id), selectedCpuB, cpus)
    : rankOptions(gpuOptions.filter((opt) => opt.id !== selectedGpuB?.id), selectedGpuB, gpus);

  const filteredOptionsB = isCpuMode
    ? rankOptions(cpuOptions.filter((opt) => opt.id !== selectedCpuA?.id), selectedCpuA, cpus)
    : rankOptions(gpuOptions.filter((opt) => opt.id !== selectedGpuA?.id), selectedGpuA, gpus);

  // Calculate scores if items exist
  const cpuScoreA = selectedCpuA ? (selectedCpuA.overallPerformanceScore || Math.round(selectedCpuA.singleCoreScore * 0.7 + selectedCpuA.multiCoreScore / 2.5)) : 0;
  const cpuScoreB = selectedCpuB ? (selectedCpuB.overallPerformanceScore || Math.round(selectedCpuB.singleCoreScore * 0.7 + selectedCpuB.multiCoreScore / 2.5)) : 0;

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
    details: isCpuMode ? `${selectedCpuA?.cores}C/${selectedCpuA?.threads}T • Socket ${selectedCpuA?.socket}` : selectedGpuA?.manufacturer === "Apple" ? `${selectedGpuA?.vramGB}GB Unified RAM` : selectedGpuA?.isIntegrated ? `${selectedGpuA?.vramGB}GB Shared RAM` : `${selectedGpuA?.vramGB}GB VRAM`,
    manufacturer: isCpuMode ? selectedCpuA?.manufacturer : selectedGpuA?.manufacturer,
    releaseYear: isCpuMode ? selectedCpuA?.releaseYear : selectedGpuA?.releaseYear
  } : null;

  const itemBInfo = itemB ? {
    name: isCpuMode ? (selectedCpuB?.name || "") : (selectedGpuB?.name || ""),
    score: scoreB,
    details: isCpuMode ? `${selectedCpuB?.cores}C/${selectedCpuB?.threads}T • Socket ${selectedCpuB?.socket}` : selectedGpuB?.manufacturer === "Apple" ? `${selectedGpuB?.vramGB}GB Unified RAM` : selectedGpuB?.isIntegrated ? `${selectedGpuB?.vramGB}GB Shared RAM` : `${selectedGpuB?.vramGB}GB VRAM`,
    manufacturer: isCpuMode ? selectedCpuB?.manufacturer : selectedGpuB?.manufacturer,
    releaseYear: isCpuMode ? selectedCpuB?.releaseYear : selectedGpuB?.releaseYear
  } : null;

  // Technical details for CPU and GPU
  const cpuTechA = selectedCpuA ? getCpuTechnicalDetails(selectedCpuA, cpus) : null;
  const cpuTechB = selectedCpuB ? getCpuTechnicalDetails(selectedCpuB, cpus) : null;

  const gpuTechA = selectedGpuA ? getGpuTechnicalDetails(selectedGpuA, gpus) : null;
  const gpuTechB = selectedGpuB ? getGpuTechnicalDetails(selectedGpuB, gpus) : null;

  // Helper to parse metric strings with unit multipliers (Billion, Million, GHz, MHz, GB, MB, KB, TFLOPS, etc.)
  const parseMetricNumber = (val: string | number | undefined): number => {
    if (val === undefined || val === null) return NaN;
    if (typeof val === "number") return val;
    const str = String(val).toLowerCase().trim();
    if (str === "n/a" || str === "-" || str === "none") return NaN;

    if (str.includes("ddr5")) return 5;
    if (str.includes("ddr4")) return 4;
    if (str.includes("ddr3")) return 3;

    const match = str.match(/([0-9]+(?:\.[0-9]+)?)/);
    if (!match) return NaN;
    let num = Math.abs(parseFloat(match[1]));

    // Unit Multipliers
    if (str.includes("trillion")) {
      num *= 1000000;
    } else if (str.includes("billion")) {
      num *= 1000; // Normalized to Millions
    }

    if (str.includes("ghz")) {
      num *= 1000; // Normalized to MHz
    }

    if (str.includes("tflops")) {
      num *= 1000; // Normalized to GFLOPS
    }

    if (str.includes("gb/s") || (str.includes("gb") && !str.includes("gbit"))) {
      num *= 1000; // Normalized to MB
    } else if (str.includes("kb")) {
      num *= 0.001; // Normalized to MB
    }

    return num;
  };

  // Helper to compare numeric metric strings cleanly
  const compareNumeric = (valAStr: string | number | undefined, valBStr: string | number | undefined, lowerIsBetter: boolean = false): "A" | "B" | "none" => {
    const numA = parseMetricNumber(valAStr);
    const numB = parseMetricNumber(valBStr);
    if (isNaN(numA) || isNaN(numB) || numA === numB) return "none";
    if (lowerIsBetter) return numA < numB ? "A" : "B";
    return numA > numB ? "A" : "B";
  };

  // Helper to render winning spec with emerald badge
  const getWinnerClass = (winnerSide: "A" | "B" | "none", targetSide: "A" | "B", valText: React.ReactNode) => {
    if (winnerSide === targetSide) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono font-black text-xs shadow-sm">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>{valText}</span>
          <span className="text-[9px] font-black uppercase bg-emerald-500 text-white dark:text-black px-1.5 py-0.2 rounded ml-1 tracking-wider">
            {t("compare.better")}
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
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E88D9F]/10 text-[#E88D9F] flex items-center justify-center border border-[#E88D9F]/20 shadow-inner shrink-0">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#E88D9F]/15 text-[#E88D9F] border border-[#E88D9F]/30 tracking-wider">
                {t("hero.compare.badge1")}
              </span>
              <span className="text-xs text-gray-400 font-bold hidden sm:inline">• {t("hero.compare.badge2")}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1E2022] dark:text-white mt-1">
              {t("compare.title")}
            </h2>
          </div>
        </div>

        {/* Component Selector Switch */}
        <div className="flex items-center p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 shrink-0 self-start md:self-center">
          <button
            onClick={() => handleModeChange("cpu")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              isCpuMode
                ? "bg-[#E88D9F] text-white shadow-md scale-102"
                : "text-gray-500 hover:text-black dark:hover:text-white"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{t("rankings.tab.cpu")}</span>
          </button>
          <button
            onClick={() => handleModeChange("gpu")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              !isCpuMode
                ? "bg-[#E88D9F] text-white shadow-md scale-102"
                : "text-gray-500 hover:text-black dark:hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{t("rankings.tab.gpu")}</span>
          </button>
        </div>
      </div>

      {/* 2. SELECTION CARDS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CANDIDATE A */}
        <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-4 relative z-20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#E88D9F] tracking-wider flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5" /> {t("compare.candidate_a")}
            </span>
            {itemA && (
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border ${
                  itemA?.manufacturer === "Intel"
                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                    : itemA?.manufacturer === "AMD"
                    ? "bg-[#E88D9F]/15 text-[#E88D9F] border-[#E88D9F]/30"
                    : itemA?.manufacturer === "NVIDIA"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30"
                }`}
              >
                {itemA.manufacturer}
              </span>
            )}
          </div>

          <SearchableSelect
            options={filteredOptionsA}
            value={itemA?.id || ""}
            onChange={handleSelectA}
            placeholder={isCpuMode ? t("compare.select_cpu_a") : t("compare.select_gpu_a")}
          />

          {itemAInfo && (
            <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10 mt-1">
              <div>
                <div className="text-xs text-gray-400 font-bold">{itemAInfo.details}</div>
                <div className="text-xs font-black text-gray-700 dark:text-gray-300 mt-0.5">
                  {t("compare.released")} {itemAInfo.releaseYear}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-gray-400">{t("compare.score")}</div>
                <div className="text-xl font-black font-mono text-[#E88D9F]">{itemAInfo.score} PTS</div>
              </div>
            </div>
          )}
        </div>

        {/* CANDIDATE B */}
        <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#E88D9F] tracking-wider flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5" /> {t("compare.candidate_b")}
            </span>
            {itemB && (
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border ${
                  itemB?.manufacturer === "Intel"
                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                    : itemB?.manufacturer === "AMD"
                    ? "bg-[#E88D9F]/15 text-[#E88D9F] border-[#E88D9F]/30"
                    : itemB?.manufacturer === "NVIDIA"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30"
                }`}
              >
                {itemB.manufacturer}
              </span>
            )}
          </div>

          <SearchableSelect
            options={filteredOptionsB}
            value={itemB?.id || ""}
            onChange={handleSelectB}
            placeholder={isCpuMode ? t("compare.select_cpu_b") : t("compare.select_gpu_b")}
          />

          {itemBInfo && (
            <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10 mt-1">
              <div>
                <div className="text-xs text-gray-400 font-bold">{itemBInfo.details}</div>
                <div className="text-xs font-black text-gray-700 dark:text-gray-300 mt-0.5">
                  {t("compare.released")} {itemBInfo.releaseYear}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-gray-400">{t("compare.score")}</div>
                <div className="text-xl font-black font-mono text-[#E88D9F]">{itemBInfo.score} PTS</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. VERIFIED COMPARISON DATA MATRIX */}
      {isBothSelected && itemAInfo && itemBInfo ? (
        <div className="flex flex-col gap-8">
          {/* WINNER VERDICT BANNER */}
          <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                  {t("compare.lead_analysis")}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#1E2022] dark:text-white mt-0.5">
                  {winner === "Tie"
                    ? t("compare.tie_score")
                    : `${winner === "A" ? itemAInfo.name : itemBInfo.name} ${String(t("compare.faster_text") || "is {delta}% faster").replace("{delta}", String(deltaPct))}`}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApplyToBuild(winner === "B" ? itemB! : itemA!)}
                className="px-5 py-2.5 rounded-2xl bg-[#E88D9F] hover:bg-[#E88D9F]/90 text-white text-xs font-black transition shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t("compare.apply_winner_btn")}</span>
              </button>
            </div>
          </div>

          {/* Aggregate Visual Benchmark Chart */}
          <AggregatePerformanceChart
            type={mode}
            itemA={itemAInfo}
            itemB={itemBInfo}
          />

          {/* ============================================================ */}
          {/* CPU MODE COMPARISON MATRIX */}
          {/* ============================================================ */}
          {isCpuMode && cpuTechA && cpuTechB && (
            <div className="flex flex-col gap-6">
              {/* CPU BLOCK 1: PRIMARY DETAILS */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <Trophy className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.cpu_primary")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black/10 dark:border-white/10 text-gray-400 font-extrabold uppercase text-[10px]">
                        <th className="py-3 px-4 w-2/5">{t("compare.metric_col")}</th>
                        <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemAInfo.name}</th>
                        <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemBInfo.name}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.global_rank")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.rank, cpuTechB.rank, true), "A", `#${cpuTechA.rank}`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.rank, cpuTechB.rank, true), "B", `#${cpuTechB.rank}`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.popularity_rank")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.popularityRank, cpuTechB.popularityRank, true), "A", `#${cpuTechA.popularityRank} ${t("compare.in_builds")}`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.popularityRank, cpuTechB.popularityRank, true), "B", `#${cpuTechB.popularityRank} ${t("compare.in_builds")}`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.cost_effectiveness")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.costEffectivenessScore, cpuTechB.costEffectivenessScore), "A", cpuTechA.costEffectivenessScore)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.costEffectivenessScore, cpuTechB.costEffectivenessScore), "B", cpuTechB.costEffectivenessScore)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.power_efficiency")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.powerEfficiencyScore, cpuTechB.powerEfficiencyScore), "A", cpuTechA.powerEfficiencyScore)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.powerEfficiencyScore, cpuTechB.powerEfficiencyScore), "B", cpuTechB.powerEfficiencyScore)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.market_segment")}</td>
                        <td className="py-3.5 px-4">{cpuTechA.marketSegment}</td>
                        <td className="py-3.5 px-4">{cpuTechB.marketSegment}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.manufacturer")}</td>
                        <td className="py-3.5 px-4 font-black">{cpuTechA.designer}</td>
                        <td className="py-3.5 px-4 font-black">{cpuTechB.designer}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.arch_codename")}</td>
                        <td className="py-3.5 px-4 font-black text-[#E88D9F]">{cpuTechA.architectureCodename}</td>
                        <td className="py-3.5 px-4 font-black text-[#E88D9F]">{cpuTechB.architectureCodename}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.released")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.releaseDate, cpuTechB.releaseDate), "A", cpuTechA.releaseDate)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.releaseDate, cpuTechB.releaseDate), "B", cpuTechB.releaseDate)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">MSRP</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.launchMsrp, cpuTechB.launchMsrp, true), "A", renderMsrp(cpuTechA.launchMsrp))}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.launchMsrp, cpuTechB.launchMsrp, true), "B", renderMsrp(cpuTechB.launchMsrp))}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CPU BLOCK 2: DETAILED SPECIFICATIONS */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <Cpu className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.cpu_detailed")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500 w-2/5">{t("compare.cores_threads")}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(cpuTechA.cores, cpuTechB.cores), "A", `${cpuTechA.cores} / ${cpuTechA.threads}`)}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(cpuTechA.cores, cpuTechB.cores), "B", `${cpuTechB.cores} / ${cpuTechB.threads}`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.base_clock")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.baseClock, cpuTechB.baseClock), "A", cpuTechA.baseClock)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.baseClock, cpuTechB.baseClock), "B", cpuTechB.baseClock)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.boost_clock")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.boostClock, cpuTechB.boostClock), "A", cpuTechA.boostClock)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.boostClock, cpuTechB.boostClock), "B", cpuTechB.boostClock)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.bus_rate")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.busRate, cpuTechB.busRate), "A", cpuTechA.busRate)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.busRate, cpuTechB.busRate), "B", cpuTechB.busRate)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.l1_cache")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.l1Cache, cpuTechB.l1Cache), "A", cpuTechA.l1Cache)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.l1Cache, cpuTechB.l1Cache), "B", cpuTechB.l1Cache)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.l2_cache")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.l2Cache, cpuTechB.l2Cache), "A", cpuTechA.l2Cache)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.l2Cache, cpuTechB.l2Cache), "B", cpuTechB.l2Cache)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.l3_cache")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.l3Cache, cpuTechB.l3Cache), "A", cpuTechA.l3Cache)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.l3Cache, cpuTechB.l3Cache), "B", cpuTechB.l3Cache)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.process_node")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.processNode, cpuTechB.processNode, true), "A", cpuTechA.processNode)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.processNode, cpuTechB.processNode, true), "B", cpuTechB.processNode)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.die_size")}</td>
                        <td className="py-3.5 px-4 font-mono">{cpuTechA.dieSize}</td>
                        <td className="py-3.5 px-4 font-mono">{cpuTechB.dieSize}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.max_temp")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.maxTemp, cpuTechB.maxTemp, true), "A", cpuTechA.maxTemp)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.maxTemp, cpuTechB.maxTemp, true), "B", cpuTechB.maxTemp)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.arch_64bit")}</td>
                        <td className="py-3.5 px-4 text-emerald-500 font-black">+ ({t("compare.supported")})</td>
                        <td className="py-3.5 px-4 text-emerald-500 font-black">+ ({t("compare.supported")})</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.win11_support")}</td>
                        <td className="py-3.5 px-4">{cpuTechA.win11Compat ? <span className="text-emerald-500 font-black">+ ({t("compare.compatible")})</span> : <span className="text-red-400 font-bold">- ({t("compare.legacy")})</span>}</td>
                        <td className="py-3.5 px-4">{cpuTechB.win11Compat ? <span className="text-emerald-500 font-black">+ ({t("compare.compatible")})</span> : <span className="text-red-400 font-bold">- ({t("compare.legacy")})</span>}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CPU BLOCK 3: SOCKET & POWER */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <Flame className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.cpu_socket")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500 w-2/5">{t("compare.socket_interface")}</td>
                        <td className="py-3.5 px-4 w-3/10 font-mono font-black">{cpuTechA.socket}</td>
                        <td className="py-3.5 px-4 w-3/10 font-mono font-black">{cpuTechB.socket}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.tdp")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.powerDrawTdp, cpuTechB.powerDrawTdp, true), "A", cpuTechA.powerDrawTdp)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.powerDrawTdp, cpuTechB.powerDrawTdp, true), "B", cpuTechB.powerDrawTdp)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.rec_psu")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.recommendedPsu, cpuTechB.recommendedPsu, true), "A", cpuTechA.recommendedPsu)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.recommendedPsu, cpuTechB.recommendedPsu, true), "B", cpuTechB.recommendedPsu)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CPU BLOCK 4: MEMORY SPECS */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <HardDrive className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.cpu_memory")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500 w-2/5">{t("compare.memory_types")}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(cpuTechA.memorySupport, cpuTechB.memorySupport), "A", cpuTechA.memorySupport)}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(cpuTechA.memorySupport, cpuTechB.memorySupport), "B", cpuTechB.memorySupport)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.max_memory")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.maxMemorySize, cpuTechB.maxMemorySize), "A", cpuTechA.maxMemorySize)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.maxMemorySize, cpuTechB.maxMemorySize), "B", cpuTechB.maxMemorySize)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.memory_channels")}</td>
                        <td className="py-3.5 px-4 font-mono">{cpuTechA.memoryChannels}</td>
                        <td className="py-3.5 px-4 font-mono">{cpuTechB.memoryChannels}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.memory_bandwidth")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.memoryBandwidth, cpuTechB.memoryBandwidth), "A", cpuTechA.memoryBandwidth)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(cpuTechA.memoryBandwidth, cpuTechB.memoryBandwidth), "B", cpuTechB.memoryBandwidth)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CPU BLOCK 5: SYNTHETIC BENCHMARKS & RENDERING */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <Activity className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.cpu_benchmarks")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500 w-2/5">{t("compare.bench.geekbench6_single")}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(selectedCpuA?.singleCoreScore, selectedCpuB?.singleCoreScore), "A", `${selectedCpuA?.singleCoreScore || 0} pts`)}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(selectedCpuA?.singleCoreScore, selectedCpuB?.singleCoreScore), "B", `${selectedCpuB?.singleCoreScore || 0} pts`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.bench.geekbench6_multi")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedCpuA?.multiCoreScore, selectedCpuB?.multiCoreScore), "A", `${selectedCpuA?.multiCoreScore || 0} pts`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedCpuA?.multiCoreScore, selectedCpuB?.multiCoreScore), "B", `${selectedCpuB?.multiCoreScore || 0} pts`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.bench.cinebench_single")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedCpuA?.cinebenchR23Single || Math.round((selectedCpuA?.singleCoreScore || 0) * 0.75), selectedCpuB?.cinebenchR23Single || Math.round((selectedCpuB?.singleCoreScore || 0) * 0.75)), "A", `${selectedCpuA?.cinebenchR23Single || Math.round((selectedCpuA?.singleCoreScore || 0) * 0.75)} pts`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedCpuA?.cinebenchR23Single || Math.round((selectedCpuA?.singleCoreScore || 0) * 0.75), selectedCpuB?.cinebenchR23Single || Math.round((selectedCpuB?.singleCoreScore || 0) * 0.75)), "B", `${selectedCpuB?.cinebenchR23Single || Math.round((selectedCpuB?.singleCoreScore || 0) * 0.75)} pts`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.bench.cinebench_multi")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedCpuA?.cinebenchR23Multi || Math.round((selectedCpuA?.multiCoreScore || 0) * 1.8), selectedCpuB?.cinebenchR23Multi || Math.round((selectedCpuB?.multiCoreScore || 0) * 1.8)), "A", `${selectedCpuA?.cinebenchR23Multi || Math.round((selectedCpuA?.multiCoreScore || 0) * 1.8)} pts`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedCpuA?.cinebenchR23Multi || Math.round((selectedCpuA?.multiCoreScore || 0) * 1.8), selectedCpuB?.cinebenchR23Multi || Math.round((selectedCpuB?.multiCoreScore || 0) * 1.8)), "B", `${selectedCpuB?.cinebenchR23Multi || Math.round((selectedCpuB?.multiCoreScore || 0) * 1.8)} pts`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.bench.passmark_cpu")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedCpuA?.passmarkScore || Math.round((selectedCpuA?.multiCoreScore || 0) * 2.2), selectedCpuB?.passmarkScore || Math.round((selectedCpuB?.multiCoreScore || 0) * 2.2)), "A", `${selectedCpuA?.passmarkScore || Math.round((selectedCpuA?.multiCoreScore || 0) * 2.2)} pts`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedCpuA?.passmarkScore || Math.round((selectedCpuA?.multiCoreScore || 0) * 2.2), selectedCpuB?.passmarkScore || Math.round((selectedCpuB?.multiCoreScore || 0) * 2.2)), "B", `${selectedCpuB?.passmarkScore || Math.round((selectedCpuB?.multiCoreScore || 0) * 2.2)} pts`)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* GPU MODE COMPARISON MATRIX (Tailored for Video Cards) */}
          {/* ============================================================ */}
          {!isCpuMode && gpuTechA && gpuTechB && (
            <div className="flex flex-col gap-6">
              {/* GPU BLOCK 1: PRIMARY DETAILS */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <Trophy className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.gpu_primary")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black/10 dark:border-white/10 text-gray-400 font-extrabold uppercase text-[10px]">
                        <th className="py-3 px-4 w-2/5">{t("compare.metric_col")}</th>
                        <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemAInfo.name}</th>
                        <th className="py-3 px-4 w-3/10 text-[#E88D9F] font-black text-sm">{itemBInfo.name}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.global_rank")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.rank, gpuTechB.rank, true), "A", `#${gpuTechA.rank}`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.rank, gpuTechB.rank, true), "B", `#${gpuTechB.rank}`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.popularity_rank")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.popularityRank, gpuTechB.popularityRank, true), "A", `#${gpuTechA.popularityRank} ${t("compare.in_builds")}`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.popularityRank, gpuTechB.popularityRank, true), "B", `#${gpuTechB.popularityRank} ${t("compare.in_builds")}`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.cost_effectiveness")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.costEffectivenessScore, gpuTechB.costEffectivenessScore), "A", gpuTechA.costEffectivenessScore)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.costEffectivenessScore, gpuTechB.costEffectivenessScore), "B", gpuTechB.costEffectivenessScore)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.power_efficiency")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.powerEfficiencyScore, gpuTechB.powerEfficiencyScore), "A", gpuTechA.powerEfficiencyScore)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.powerEfficiencyScore, gpuTechB.powerEfficiencyScore), "B", gpuTechB.powerEfficiencyScore)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.gpu_arch")}</td>
                        <td className="py-3.5 px-4 font-black text-[#E88D9F]">{gpuTechA.architectureCodename}</td>
                        <td className="py-3.5 px-4 font-black text-[#E88D9F]">{gpuTechB.architectureCodename}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.gpu_codename")}</td>
                        <td className="py-3.5 px-4 font-mono font-black">{gpuTechA.gpuCodeName}</td>
                        <td className="py-3.5 px-4 font-mono font-black">{gpuTechB.gpuCodeName}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.market_segment")}</td>
                        <td className="py-3.5 px-4">{gpuTechA.marketSegment}</td>
                        <td className="py-3.5 px-4">{gpuTechB.marketSegment}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.released")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.releaseDate, gpuTechB.releaseDate), "A", gpuTechA.releaseDate)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.releaseDate, gpuTechB.releaseDate), "B", gpuTechB.releaseDate)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">MSRP</td>
                        <td className="py-3.5 px-4 font-mono font-black">{renderMsrp(gpuTechA.launchMsrp)}</td>
                        <td className="py-3.5 px-4 font-mono font-black">{renderMsrp(gpuTechB.launchMsrp)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GPU BLOCK 2: DETAILED SPECIFICATIONS */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <Zap className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.gpu_detailed")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500 w-2/5">{t("compare.cuda_cores")}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(gpuTechA.cudaCores, gpuTechB.cudaCores), "A", gpuTechA.cudaCores)}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(gpuTechA.cudaCores, gpuTechB.cudaCores), "B", gpuTechB.cudaCores)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.base_clock")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.baseClock, gpuTechB.baseClock), "A", gpuTechA.baseClock)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.baseClock, gpuTechB.baseClock), "B", gpuTechB.baseClock)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.boost_clock")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.boostClock, gpuTechB.boostClock), "A", gpuTechA.boostClock)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.boostClock, gpuTechB.boostClock), "B", gpuTechB.boostClock)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.transistors")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.transistors, gpuTechB.transistors), "A", gpuTechA.transistors)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.transistors, gpuTechB.transistors), "B", gpuTechB.transistors)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.process_node")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.processNode, gpuTechB.processNode, true), "A", gpuTechA.processNode)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.processNode, gpuTechB.processNode, true), "B", gpuTechB.processNode)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.tdp")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.powerDrawTdp, gpuTechB.powerDrawTdp, true), "A", gpuTechA.powerDrawTdp)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.powerDrawTdp, gpuTechB.powerDrawTdp, true), "B", gpuTechB.powerDrawTdp)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.max_temp")}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechA.maxTemp}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechB.maxTemp}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.texture_rate")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.textureFillRate, gpuTechB.textureFillRate), "A", gpuTechA.textureFillRate)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.textureFillRate, gpuTechB.textureFillRate), "B", gpuTechB.textureFillRate)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.tflops")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.tflops, gpuTechB.tflops), "A", gpuTechA.tflops)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.tflops, gpuTechB.tflops), "B", gpuTechB.tflops)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.rops")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.rops, gpuTechB.rops), "A", gpuTechA.rops)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.rops, gpuTechB.rops), "B", gpuTechB.rops)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.tmus")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.tmus, gpuTechB.tmus), "A", gpuTechA.tmus)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.tmus, gpuTechB.tmus), "B", gpuTechB.tmus)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.l1_cache")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.l1Cache, gpuTechB.l1Cache), "A", gpuTechA.l1Cache)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.l1Cache, gpuTechB.l1Cache), "B", gpuTechB.l1Cache)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.l2_cache")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.l2Cache, gpuTechB.l2Cache), "A", gpuTechA.l2Cache)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.l2Cache, gpuTechB.l2Cache), "B", gpuTechB.l2Cache)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GPU BLOCK 3: FORM FACTOR & COMPATIBILITY */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <Flame className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.gpu_form_factor")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500 w-2/5">{t("compare.bus_interface")}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(gpuTechA.interface, gpuTechB.interface), "A", gpuTechA.interface)}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(gpuTechA.interface, gpuTechB.interface), "B", gpuTechB.interface)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.card_length")}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechA.length}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechB.length}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.slot_width")}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechA.slotWidth}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechB.slotWidth}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.power_connectors")}</td>
                        <td className="py-3.5 px-4 font-mono text-[#E88D9F] font-black">{gpuTechA.powerConnectors}</td>
                        <td className="py-3.5 px-4 font-mono text-[#E88D9F] font-black">{gpuTechB.powerConnectors}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GPU BLOCK 4: VRAM CAPACITY & TYPE */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <HardDrive className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.gpu_vram")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500 w-2/5">{t("compare.vram_type")}</td>
                        <td className="py-3.5 px-4 w-3/10 font-mono font-black">{gpuTechA.memoryType}</td>
                        <td className="py-3.5 px-4 w-3/10 font-mono font-black">{gpuTechB.memoryType}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.vram_max")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.maxVramAmount, gpuTechB.maxVramAmount), "A", gpuTechA.maxVramAmount)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.maxVramAmount, gpuTechB.maxVramAmount), "B", gpuTechB.maxVramAmount)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.vram_bus")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.memoryBusWidth, gpuTechB.memoryBusWidth), "A", gpuTechA.memoryBusWidth)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.memoryBusWidth, gpuTechB.memoryBusWidth), "B", gpuTechB.memoryBusWidth)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.vram_clock")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.memoryClockSpeed, gpuTechB.memoryClockSpeed), "A", gpuTechA.memoryClockSpeed)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.memoryClockSpeed, gpuTechB.memoryClockSpeed), "B", gpuTechB.memoryClockSpeed)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.vram_bw")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.memoryBandwidth, gpuTechB.memoryBandwidth), "A", gpuTechA.memoryBandwidth)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.memoryBandwidth, gpuTechB.memoryBandwidth), "B", gpuTechB.memoryBandwidth)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.shared_memory")}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechA.sharedMemory}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechB.sharedMemory}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GPU BLOCK: GAMING BENCHMARKS & COST PER FRAME */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <Gamepad2 className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.gpu_gaming")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500 w-2/5">{t("compare.avg_fps_1080p")}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(gpuTechA.avgFps1080p, gpuTechB.avgFps1080p), "A", `${gpuTechA.avgFps1080p || 0} FPS`)}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(gpuTechA.avgFps1080p, gpuTechB.avgFps1080p), "B", `${gpuTechB.avgFps1080p || 0} FPS`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.cost_fps_1080p")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.costPerFrame1080p, gpuTechB.costPerFrame1080p, true), "A", gpuTechA.costPerFrame1080p && gpuTechA.costPerFrame1080p !== "N/A" ? `$${gpuTechA.costPerFrame1080p} / FPS` : "N/A")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.costPerFrame1080p, gpuTechB.costPerFrame1080p, true), "B", gpuTechB.costPerFrame1080p && gpuTechB.costPerFrame1080p !== "N/A" ? `$${gpuTechB.costPerFrame1080p} / FPS` : "N/A")}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.avg_fps_1440p")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.avgFps1440p, gpuTechB.avgFps1440p), "A", `${gpuTechA.avgFps1440p || 0} FPS`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.avgFps1440p, gpuTechB.avgFps1440p), "B", `${gpuTechB.avgFps1440p || 0} FPS`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.cost_fps_1440p")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.costPerFrame1440p, gpuTechB.costPerFrame1440p, true), "A", gpuTechA.costPerFrame1440p && gpuTechA.costPerFrame1440p !== "N/A" ? `$${gpuTechA.costPerFrame1440p} / FPS` : "N/A")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.costPerFrame1440p, gpuTechB.costPerFrame1440p, true), "B", gpuTechB.costPerFrame1440p && gpuTechB.costPerFrame1440p !== "N/A" ? `$${gpuTechB.costPerFrame1440p} / FPS` : "N/A")}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.avg_fps_4k")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.avgFps4K, gpuTechB.avgFps4K), "A", `${gpuTechA.avgFps4K || 0} FPS`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.avgFps4K, gpuTechB.avgFps4K), "B", `${gpuTechB.avgFps4K || 0} FPS`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.cost_fps_4k")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.costPerFrame4K, gpuTechB.costPerFrame4K, true), "A", gpuTechA.costPerFrame4K && gpuTechA.costPerFrame4K !== "N/A" ? `$${gpuTechA.costPerFrame4K} / FPS` : "N/A")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.costPerFrame4K, gpuTechB.costPerFrame4K, true), "B", gpuTechB.costPerFrame4K && gpuTechB.costPerFrame4K !== "N/A" ? `$${gpuTechB.costPerFrame4K} / FPS` : "N/A")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GPU BLOCK 5: CONNECTIVITY & OUTPUTS */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <Monitor className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.gpu_outputs")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500 w-2/5">{t("compare.display_connectors")}</td>
                        <td className="py-3.5 px-4 w-3/10 font-mono">{gpuTechA.displayConnectors}</td>
                        <td className="py-3.5 px-4 w-3/10 font-mono">{gpuTechB.displayConnectors}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.hdmi_21")}</td>
                        <td className="py-3.5 px-4 text-emerald-500 font-black">+ ({t("compare.supported")})</td>
                        <td className="py-3.5 px-4 text-emerald-500 font-black">+ ({t("compare.supported")})</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.gsync_support")}</td>
                        <td className="py-3.5 px-4 font-mono font-black text-emerald-500">{gpuTechA.gsyncSupport}</td>
                        <td className="py-3.5 px-4 font-mono font-black text-emerald-500">{gpuTechB.gsyncSupport}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GPU BLOCK 6: SUPPORTED TECHNOLOGIES & APIS */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <ShieldCheck className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.gpu_api")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500 w-2/5">{t("compare.directx")}</td>
                        <td className="py-3.5 px-4 font-mono text-[#E88D9F] font-black">{gpuTechA.directX}</td>
                        <td className="py-3.5 px-4 font-mono text-[#E88D9F] font-black">{gpuTechB.directX}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.shader_model")}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechA.shaderModel}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechB.shaderModel}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.opengl")}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechA.openGL}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechB.openGL}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.opencl")}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechA.openCL}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechB.openCL}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.vulkan")}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechA.vulkan}</td>
                        <td className="py-3.5 px-4 font-mono">{gpuTechB.vulkan}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.cuda_gpgpu")}</td>
                        <td className="py-3.5 px-4 font-mono text-emerald-500 font-black">{gpuTechA.cuda}</td>
                        <td className="py-3.5 px-4 font-mono text-emerald-500 font-black">{gpuTechB.cuda}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GPU BLOCK 6: SYNTHETIC & COMPUTE BENCHMARKS */}
              <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4">
                  <Activity className="w-5 h-5 text-[#E88D9F]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
                    {t("compare.block.gpu_benchmarks")}
                  </h3>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 font-bold">
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500 w-2/5">{t("compare.bench.3dmark_timespy")}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(selectedGpuA?.relativePowerScore, selectedGpuB?.relativePowerScore), "A", `${Math.round((selectedGpuA?.relativePowerScore || 0) * 45)} pts`)}</td>
                        <td className="py-3.5 px-4 w-3/10">{getWinnerClass(compareNumeric(selectedGpuA?.relativePowerScore, selectedGpuB?.relativePowerScore), "B", `${Math.round((selectedGpuB?.relativePowerScore || 0) * 45)} pts`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.bench.3dmark_portroyal")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedGpuA?.rayTracingPowerScore, selectedGpuB?.rayTracingPowerScore), "A", `${Math.round((selectedGpuA?.rayTracingPowerScore || 0) * 22)} pts`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedGpuA?.rayTracingPowerScore, selectedGpuB?.rayTracingPowerScore), "B", `${Math.round((selectedGpuB?.rayTracingPowerScore || 0) * 22)} pts`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.bench.passmark_gpu")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedGpuA?.relativePowerScore, selectedGpuB?.relativePowerScore), "A", `${Math.round((selectedGpuA?.relativePowerScore || 0) * 65)} pts`)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(selectedGpuA?.relativePowerScore, selectedGpuB?.relativePowerScore), "B", `${Math.round((selectedGpuB?.relativePowerScore || 0) * 65)} pts`)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.bench.compute_tflops")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.tflops, gpuTechB.tflops), "A", gpuTechA.tflops)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.tflops, gpuTechB.tflops), "B", gpuTechB.tflops)}</td>
                      </tr>
                      <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-gray-500">{t("compare.bench.texture_rate")}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.textureFillRate, gpuTechB.textureFillRate), "A", gpuTechA.textureFillRate)}</td>
                        <td className="py-3.5 px-4">{getWinnerClass(compareNumeric(gpuTechA.textureFillRate, gpuTechB.textureFillRate), "B", gpuTechB.textureFillRate)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* INTERACTIVE GPU GAMING BENCHMARKS SHOWCASE */}
              {selectedGpuA && selectedGpuB && (
                <GpuGamingBenchmarkChart gpuA={selectedGpuA} gpuB={selectedGpuB} />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-[#1A1C1E]/80 border border-dashed border-[#E88D9F]/30 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-lg animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-[#E88D9F]/10 text-[#E88D9F] flex items-center justify-center border border-[#E88D9F]/20 shadow-inner">
            <Sparkles className="w-7 h-7 text-[#E88D9F] animate-pulse" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#1E2022] dark:text-white">
            {t("compare.empty_state_title")}
          </h3>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 max-w-md">
            {t("compare.empty_state_desc")}
          </p>
        </div>
      )}
    </div>
  );
}
