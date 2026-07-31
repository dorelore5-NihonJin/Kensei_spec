import { useState, useMemo, useEffect } from "react";
import type { CPU, GPU } from "../lib/types";
import { Trophy, Cpu, Zap, Search, Layers, Scale, ChevronLeft, ChevronRight, ArrowUpDown, RotateCcw } from "lucide-react";
import { useHardware } from "../context/HardwareContext";
import { useLanguage } from "../context/LanguageContext";
import CustomSelect from "../components/CustomSelect";

interface RankingsPageProps {
  cpus: CPU[];
  gpus: GPU[];
}

export default function RankingsPage({ cpus, gpus }: RankingsPageProps) {
  const { setSelectedCpu, setSelectedGpu, setActivePage, setCurrentStep } = useHardware();
  const { t } = useLanguage();

  // Read initial type and highlight parameter from URL search params
  const [type, setType] = useState<"cpu" | "gpu">(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tParam = urlParams.get("type");
    if (tParam === "gpu" || tParam === "cpu") return tParam;
    return "cpu";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("score-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Highlight parameter from URL (e.g. ?highlight=cpu-001)
  const [highlightId, setHighlightId] = useState<string | null>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("highlight");
  });

  // Calculate sorted CPU ranking list with assigned globalRank
  const rankedCpus = useMemo(() => {
    const list = [...cpus]
      .map((c) => {
        const score = c.overallPerformanceScore || Math.round(c.singleCoreScore * 0.7 + c.multiCoreScore / 2.5);
        return { ...c, computedScore: score };
      })
      .sort((a, b) => b.computedScore - a.computedScore);

    return list.map((item, idx) => ({ ...item, globalRank: idx + 1 }));
  }, [cpus]);

  // Calculate sorted GPU ranking list with assigned globalRank
  const rankedGpus = useMemo(() => {
    const list = [...gpus]
      .map((g) => ({ ...g, computedScore: g.relativePowerScore }))
      .sort((a, b) => b.computedScore - a.computedScore);

    return list.map((item, idx) => ({ ...item, globalRank: idx + 1 }));
  }, [gpus]);

  const activeList = type === "cpu" ? rankedCpus : rankedGpus;

  // Filter & Sort list based on query, manufacturer, and sortBy selection
  const filteredList = useMemo(() => {
    const filtered = activeList.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q);

      const matchesManufacturer =
        manufacturerFilter === "All" || item.manufacturer === manufacturerFilter;

      return matchesSearch && matchesManufacturer;
    });

    // Apply Sorting
    return [...filtered].sort((a, b) => {
      if (sortBy === "score-desc") {
        return b.computedScore - a.computedScore;
      }
      if (sortBy === "score-asc") {
        return a.computedScore - b.computedScore;
      }
      if (sortBy === "year-desc") {
        return b.releaseYear - a.releaseYear || b.computedScore - a.computedScore;
      }
      if (sortBy === "year-asc") {
        return a.releaseYear - b.releaseYear || b.computedScore - a.computedScore;
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "specs-desc") {
        if (type === "cpu") {
          return (b as CPU).cores - (a as CPU).cores || b.computedScore - a.computedScore;
        } else {
          return (b as GPU).vramGB - (a as GPU).vramGB || b.computedScore - a.computedScore;
        }
      }
      return b.computedScore - a.computedScore;
    });
  }, [activeList, searchQuery, manufacturerFilter, sortBy, type]);

  // Auto-jump to page containing highlighted item
  useEffect(() => {
    if (highlightId) {
      const idx = filteredList.findIndex((item) => item.id === highlightId);
      if (idx !== -1) {
        const targetPage = Math.floor(idx / itemsPerPage) + 1;
        setCurrentPage(targetPage);
      }
    }
  }, [highlightId, filteredList, itemsPerPage]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage, itemsPerPage]);

  const handleTypeChange = (newType: "cpu" | "gpu") => {
    setType(newType);
    setCurrentPage(1);
    setManufacturerFilter("All");
    setSortBy("score-desc");
    const url = new URL(window.location.href);
    url.searchParams.set("page", "rankings");
    url.searchParams.set("type", newType);
    url.searchParams.delete("highlight");
    window.history.replaceState({}, "", url.toString());
    setHighlightId(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setManufacturerFilter("All");
    setSortBy("score-desc");
    setCurrentPage(1);
  };

  const maxScore = useMemo(() => {
    return activeList.length > 0 ? activeList[0].computedScore : 1000;
  }, [activeList]);

  const handleCompareItem = (item: any) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", "compare");
    url.searchParams.set("mode", type);
    url.searchParams.set("a", item.id);
    window.history.replaceState({}, "", url.toString());
    setActivePage("compare");
  };

  const handleApplyToBuild = (item: any) => {
    if (type === "cpu") {
      setSelectedCpu(item as CPU);
    } else {
      setSelectedGpu(item as GPU);
    }
    setCurrentStep(1);
    setActivePage("simulator");
  };

  const isFilterActive = searchQuery !== "" || manufacturerFilter !== "All" || sortBy !== "score-desc";

  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col gap-8 animate-fadeIn">
      {/* 1. HEADER HERO BANNER & TYPE TAB SWITCHER */}
      <div className="relative overflow-hidden bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Background Live Video Banner Overlay */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-30 pointer-events-none transition-opacity duration-500"
          src="/gif_banner_vs.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#1A1C1E] dark:via-[#1A1C1E]/80 dark:to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#E88D9F] font-extrabold text-xs uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>{t("hero.rankings.badge1")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E2022] dark:text-white mt-1">
            {t("rankings.title")}
          </h1>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            {t("rankings.subtitle")}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/10 dark:border-white/10 shrink-0 relative z-10">
          <button
            onClick={() => handleTypeChange("cpu")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              type === "cpu"
                ? "bg-[#E88D9F] text-white shadow-md scale-102"
                : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{t("rankings.tab.cpu")} ({rankedCpus.length})</span>
          </button>
          <button
            onClick={() => handleTypeChange("gpu")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              type === "gpu"
                ? "bg-[#E88D9F] text-white shadow-md scale-102"
                : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{t("rankings.tab.gpu")} ({rankedGpus.length})</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH, SORTING & MANUFACTURER FILTER BAR */}
      <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-5 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4 relative z-30">
        {/* Left Group: Search Input + Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search Input Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={type === "cpu" ? t("rankings.search_cpu_placeholder") : t("rankings.search_gpu_placeholder")}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-extrabold text-[#1E2022] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E88D9F]/30 transition"
            />
          </div>

          {/* Sort Order Selector Dropdown */}
          <CustomSelect
            options={[
              { value: "score-desc", label: t("rankings.sort.score_desc") },
              { value: "score-asc", label: t("rankings.sort.score_asc") },
              { value: "year-desc", label: t("rankings.sort.year_desc") },
              { value: "year-asc", label: t("rankings.sort.year_asc") },
              { value: "name-asc", label: t("rankings.sort.name_asc") },
              {
                value: "specs-desc",
                label: type === "cpu" ? t("rankings.sort.cores_desc") : t("rankings.sort.vram_desc")
              }
            ]}
            value={sortBy}
            onChange={(val) => {
              setSortBy(val);
              setCurrentPage(1);
            }}
            icon={<ArrowUpDown className="w-3.5 h-3.5" />}
            className="w-full sm:w-72"
          />
        </div>

        {/* Right Group: Manufacturer Filter Badges + Reset Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto justify-start sm:justify-end">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider hidden sm:inline mr-1">
            {t("rankings.vendor_label")}
          </span>
          {(type === "cpu" ? ["All", "AMD", "Intel", "Apple"] : ["All", "NVIDIA", "AMD", "Intel", "Apple"]).map((mfr) => {
            const isActive = manufacturerFilter === mfr;
            let activeClass = "bg-[#E88D9F] text-white shadow-sm border-[#E88D9F]";
            let hoverClass = "hover:bg-[#E88D9F]/15 hover:text-[#E88D9F] hover:border-[#E88D9F]/30";

            if (mfr === "Intel") {
              activeClass = "bg-blue-500 text-white shadow-sm border-blue-500";
              hoverClass = "hover:bg-blue-500/15 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30";
            } else if (mfr === "NVIDIA") {
              activeClass = "bg-emerald-500 text-white shadow-sm border-emerald-500";
              hoverClass = "hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30";
            } else if (mfr === "Apple") {
              activeClass = "bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900 shadow-sm border-slate-700 dark:border-slate-200";
              hoverClass = "hover:bg-slate-500/15 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-500/30";
            }

            return (
              <button
                key={mfr}
                onClick={() => {
                  setManufacturerFilter(mfr);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition border shrink-0 ${
                  isActive
                    ? activeClass
                    : `bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-black/10 dark:border-white/10 ${hoverClass}`
                }`}
              >
                {mfr}
              </button>
            );
          })}

          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-black transition flex items-center gap-1 shrink-0 ml-1"
              title="Reset search and sort filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t("rankings.reset_btn")}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. LEADERBOARD LIST MATRIX */}
      <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
        {paginatedList.length === 0 ? (
          <div className="py-12 text-center text-xs font-extrabold text-gray-400 flex flex-col items-center gap-2">
            <Search className="w-8 h-8 opacity-40" />
            <span>{t("rankings.no_results")} "{searchQuery}"</span>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 rounded-xl bg-[#E88D9F] text-white text-xs font-black shadow-md hover:bg-[#E88D9F]/90 transition"
            >
              {t("rankings.reset_btn")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paginatedList.map((item) => {
              const isHighlighted = highlightId === item.id;
              const pct = Math.min(100, Math.max(3, (item.computedScore / maxScore) * 100));

              return (
                <div
                  key={item.id}
                  id={`item-${item.id}`}
                  className={`p-4 rounded-2xl border transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${
                    isHighlighted
                      ? "bg-[#E88D9F]/10 border-[#E88D9F] ring-2 ring-[#E88D9F]/50 shadow-lg scale-[1.01]"
                      : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-[#E88D9F]/40"
                  }`}
                >
                  {/* Column 1: Rank Badge + Name Details (md:col-span-5) */}
                  <div className="md:col-span-5 flex items-center gap-4 min-w-0">
                    {/* Rank Badge Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow-sm border ${
                        item.globalRank === 1
                          ? "bg-amber-500/20 text-amber-500 border-amber-500/40"
                          : item.globalRank === 2
                          ? "bg-slate-300/20 text-slate-300 border-slate-300/40"
                          : item.globalRank === 3
                          ? "bg-amber-700/20 text-amber-600 border-amber-700/40"
                          : "bg-black/5 dark:bg-white/5 text-purple-500 dark:text-[#E88D9F] border-black/10 dark:border-white/10"
                      }`}
                    >
                      #{item.globalRank}
                    </div>

                    {/* Hardware Info Stack */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-[#1E2022] dark:text-white truncate">
                          {item.name}
                        </h3>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                            item.manufacturer === "Intel"
                              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                              : item.manufacturer === "AMD"
                              ? "bg-[#E88D9F]/15 text-[#E88D9F] border-[#E88D9F]/30"
                              : (item.manufacturer as string) === "Apple"
                              ? "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30"
                              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {item.manufacturer}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {type === "cpu"
                          ? `${(item as CPU).cores} ${t("rankings.cores")} / ${(item as CPU).threads} ${t("rankings.threads")} • Socket ${(item as CPU).socket} • ${item.releaseYear}`
                          : (item as GPU).manufacturer === "Apple"
                          ? `${(item as GPU).vramGB}GB ${t("rankings.unified_ram")} • ${(item as GPU).architecture} • ${item.releaseYear}`
                          : (item as GPU).isIntegrated
                          ? `${(item as GPU).vramGB}GB ${t("rankings.shared_ram")} • ${(item as GPU).architecture} • ${item.releaseYear}`
                          : `${(item as GPU).vramGB}GB ${t("rankings.vram")} • ${(item as GPU).architecture} • ${item.releaseYear}`}
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Benchmark Meter Bar + Score PTS (md:col-span-4) - PIXEL LOCKED POSITION */}
                  <div className="md:col-span-4 flex items-center gap-4 min-w-0">
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-[#E88D9F] via-[#8A9A86] to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 text-right">
                        {pct.toFixed(0)}% {t("rankings.of_apex")}
                      </span>
                    </div>

                    <div className="text-right shrink-0 w-24">
                      <span className="text-base font-black text-[#E88D9F] font-mono whitespace-nowrap">
                        {item.computedScore} {t("rankings.pts")}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Quick Action Buttons (md:col-span-3) */}
                  <div className="md:col-span-3 flex items-center gap-2 justify-start md:justify-end shrink-0">
                    <button
                      onClick={() => handleCompareItem(item)}
                      className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-extrabold transition flex items-center gap-1.5 shrink-0"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{t("rankings.compare_btn")}</span>
                    </button>

                    <button
                      onClick={() => handleApplyToBuild(item)}
                      className="px-3.5 py-2 rounded-xl bg-[#E88D9F]/10 hover:bg-[#E88D9F]/20 text-[#E88D9F] border border-[#E88D9F]/30 text-xs font-extrabold transition flex items-center gap-1.5 shrink-0"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{t("rankings.select_btn")}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black/10 dark:border-white/10 mt-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              {t("rankings.showing")} {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredList.length)} {t("rankings.of")} {filteredList.length} {t("rankings.components")}
            </span>

            {/* Pagination Button Row */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/10 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                if (
                  pg === 1 ||
                  pg === totalPages ||
                  (pg >= currentPage - 1 && pg <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`w-8 h-8 rounded-xl text-xs font-black transition ${
                        currentPage === pg
                          ? "bg-[#E88D9F] text-white shadow-md"
                          : "bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-black/10 dark:border-white/10 hover:bg-[#E88D9F]/15 hover:text-[#E88D9F] hover:border-[#E88D9F]/30"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                } else if (pg === currentPage - 2 || pg === currentPage + 2) {
                  return (
                    <span key={pg} className="px-1 text-gray-400 font-bold text-xs">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/10 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
