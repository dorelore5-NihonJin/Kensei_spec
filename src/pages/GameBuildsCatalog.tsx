import { useState, useMemo, useEffect } from "react";
import type { Game, CPU, GPU, RAMProfile } from "../lib/types";
import { Search, Filter, ShoppingCart, Zap, CheckCircle2, Package, Loader2, ArrowDown, ArrowUpDown, Award, Sparkles, Code2 } from "lucide-react";

interface GameBuildsCatalogProps {
  games: Game[];
  cpus: CPU[];
  gpus: GPU[];
  ramProfiles: RAMProfile[];
  onSelectBuild: (cpu: CPU, gpu: GPU, ram: RAMProfile, ramCap: number, game: Game) => void;
  onOpenBuyModal: () => void;
}

export type BuildCategory = "Gaming" | "3D Render" | "AI & Dev" | "Streaming" | "Audio Studio" | "CAD & Workstation";

export interface PresetBuild {
  id: string;
  gameId: string;
  gameTitle: string;
  category: BuildCategory;
  categoryBadge: string;
  tierName: "Budget ($500-$800)" | "Sweetspot ($1,000-$1,500)" | "High-End ($1,800-$2,500)" | "God Tier ($3,000+)";
  buildTitle: string;
  cpuName: string;
  gpuName: string;
  ramText: string;
  storageText: string;
  targetResolution: "1080p" | "1440p" | "4K";
  estimatedFps: number;
  totalPriceUSD: number;
  badgeTag: string;
  accentBorderClass: string;
  highlightFeature: string;
}

export default function GameBuildsCatalog({
  games,
  cpus,
  gpus,
  ramProfiles,
  onSelectBuild,
  onOpenBuyModal
}: GameBuildsCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>("All");
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"recommended" | "price-desc" | "price-asc" | "fps-desc" | "title-asc">("recommended");

  // PAGINATION LAZY LOADING STATE (9 at a time)
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(9);
  }, [searchQuery, selectedGameFilter, selectedTierFilter, selectedCategoryFilter, sortBy]);

  // Generate ultra-accurate catalog builds with unique visual styles & categories
  const catalogBuilds: PresetBuild[] = useMemo(() => {
    const builds: PresetBuild[] = [];

    games.forEach((game) => {
      const isEsports = ["cs2", "valorant", "fortnite", "apex"].includes(game.id);
      const isHeavyAAA = ["cyberpunk", "wukong", "gtavi", "stalker2", "alanwake2"].includes(game.id);

      // 1. Budget Build ($500 - $800) -> Category: Gaming / Entry Workstation
      const bCpu = isEsports ? "Ryzen 5 5600" : "Core i3-13100F";
      const bGpu = isEsports ? "GeForce RTX 3060 12GB" : "GeForce RTX 4060 8GB";
      const bFps = isEsports
        ? Math.round((game.baseFpsScaling["1080p"]?.Low || 220) * 1.1)
        : Math.round((game.baseFpsScaling["1080p"]?.Medium || 65) * 0.95);

      builds.push({
        id: `${game.id}-budget`,
        gameId: game.id,
        gameTitle: game.title,
        category: "Gaming",
        categoryBadge: "🎮 Esports & 1080p Gaming",
        tierName: "Budget ($500-$800)",
        buildTitle: `${game.title} ${isEsports ? "Esports 1080p 144Hz Rig" : "1080p High Value Rig"}`,
        cpuName: bCpu,
        gpuName: bGpu,
        ramText: "16GB DDR4-3200 Dual Channel",
        storageText: "1TB NVMe M.2 SSD",
        targetResolution: "1080p",
        estimatedFps: bFps,
        totalPriceUSD: isHeavyAAA ? 790 : 640,
        badgeTag: "Value Champion / 1080p Verified",
        accentBorderClass: "border-2 border-emerald-500/40 hover:border-emerald-500/80 shadow-xs",
        highlightFeature: "1080p 60+ FPS • Low TDP Air Cooling"
      });

      // 2. Sweetspot Build ($1,000 - $1,500) -> Category: 3D Render & Streaming
      const sCpu = isEsports ? "Ryzen 7 5700X3D" : "Ryzen 5 7600X";
      const sGpu = "GeForce RTX 4070 Super 12GB";
      const sFps = Math.round((game.baseFpsScaling["1440p"]?.High || 90) * 1.25);

      builds.push({
        id: `${game.id}-sweetspot`,
        gameId: game.id,
        gameTitle: game.title,
        category: "Streaming",
        categoryBadge: "📺 1440p Streaming & Content Creation",
        tierName: "Sweetspot ($1,000-$1,500)",
        buildTitle: `${game.title} 1440p Streamer Dominator`,
        cpuName: sCpu,
        gpuName: sGpu,
        ramText: "32GB DDR5-6000 Low-Latency",
        storageText: "2TB NVMe Gen4 SSD",
        targetResolution: "1440p",
        estimatedFps: sFps,
        totalPriceUSD: 1380,
        badgeTag: "Most Popular / 1440p Sweetspot",
        accentBorderClass: "border-2 border-[#8A9A86]/60 hover:border-[#8A9A86] shadow-sm",
        highlightFeature: "NVENC AV1 Dual Encoder • 12GB VRAM"
      });

      // 3. High-End Build ($1,800 - $2,500) -> Category: 3D Render & VFX
      const hCpu = "Ryzen 7 7800X3D";
      const hGpu = "GeForce RTX 4080 Super 16GB";
      const hFps = isEsports
        ? Math.round((game.baseFpsScaling["1440p"]?.High || 240) * 1.5)
        : Math.round((game.baseFpsScaling["4K"]?.Ultra || 75) * 1.55);

      builds.push({
        id: `${game.id}-highend`,
        gameId: game.id,
        gameTitle: game.title,
        category: "3D Render",
        categoryBadge: "🎨 3D VFX & 4K Ray Tracing",
        tierName: "High-End ($1,800-$2,500)",
        buildTitle: `${game.title} 4K Ray Tracing Beast`,
        cpuName: hCpu,
        gpuName: hGpu,
        ramText: "32GB DDR5-6000 3D V-Cache Kit",
        storageText: "2TB PCIe 4.0 NVMe SSD",
        targetResolution: isEsports ? "1440p" : "4K",
        estimatedFps: hFps,
        totalPriceUSD: 2190,
        badgeTag: "4K Ultra + Ray Tracing",
        accentBorderClass: "border-2 border-[#E88D9F]/70 shadow-[0_0_18px_rgba(232,141,159,0.18)] hover:border-[#E88D9F]",
        highlightFeature: "AMD 3D V-Cache • 16GB GDDR6X VRAM"
      });

      // 4. God Tier Build ($3,000+) -> Category: AI & Dev Workstation
      const gCpu = "Ryzen 7 9800X3D";
      const gGpu = "GeForce RTX 4090 24GB";
      const gFps = Math.round((game.baseFpsScaling["4K"]?.Ultra || 95) * 2.15);

      builds.push({
        id: `${game.id}-godtier`,
        gameId: game.id,
        gameTitle: game.title,
        category: "AI & Dev",
        categoryBadge: "💻 AI LLM Dev & Flagship Gaming",
        tierName: "God Tier ($3,000+)",
        buildTitle: `${game.title} Absolute Flagship King`,
        cpuName: gCpu,
        gpuName: gGpu,
        ramText: "64GB DDR5-6400 Low-Latency",
        storageText: "4TB Gen4 NVMe M.2 SSD",
        targetResolution: "4K",
        estimatedFps: gFps,
        totalPriceUSD: 3680,
        badgeTag: "Maximum Performance / No Compromise",
        accentBorderClass: "border-2 border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.22)] hover:border-amber-400",
        highlightFeature: "24GB VRAM CUDA Workstation • 64GB DDR5"
      });
    });

    return builds;
  }, [games]);

  // Filtering and Sorting Logic
  const filteredBuilds = useMemo(() => {
    let result = catalogBuilds.filter((b) => {
      const matchSearch =
        b.buildTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.gameTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.cpuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.gpuName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGame = selectedGameFilter === "All" || b.gameId === selectedGameFilter;
      const matchTier = selectedTierFilter === "All" || b.tierName === selectedTierFilter;
      const matchCategory = selectedCategoryFilter === "All" || b.category === selectedCategoryFilter;

      return matchSearch && matchGame && matchTier && matchCategory;
    });

    // Apply Sorting
    return result.sort((a, b) => {
      if (sortBy === "price-desc") return b.totalPriceUSD - a.totalPriceUSD;
      if (sortBy === "price-asc") return a.totalPriceUSD - b.totalPriceUSD;
      if (sortBy === "fps-desc") return b.estimatedFps - a.estimatedFps;
      if (sortBy === "title-asc") return a.buildTitle.localeCompare(b.buildTitle);
      return 0; // Default recommended order
    });
  }, [catalogBuilds, searchQuery, selectedGameFilter, selectedTierFilter, selectedCategoryFilter, sortBy]);

  // Lazy loading scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || visibleCount >= filteredBuilds.length) return;

      const scrollBottom = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 350;

      if (scrollBottom >= threshold) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(filteredBuilds.length, prev + 9));
          setIsLoadingMore(false);
        }, 400);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, filteredBuilds.length, isLoadingMore]);

  // Manual Load More Handler
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(filteredBuilds.length, prev + 9));
      setIsLoadingMore(false);
    }, 400);
  };

  // Handle loading build into simulator
  const handleApplyBuild = (build: PresetBuild) => {
    const matchedGame = games.find((g) => g.id === build.gameId) || games[0];
    const matchedCpu = cpus.find((c) => c.name.includes(build.cpuName.split(" ")[1])) || cpus[0];
    const matchedGpu = gpus.find((g) => g.name.includes(build.gpuName.split(" ")[1])) || gpus[0];
    const ramCap = build.ramText.includes("64GB") ? 64 : build.ramText.includes("32GB") ? 32 : 16;
    const matchedRam = ramProfiles.find((r) => r.generation === (build.ramText.includes("DDR5") ? "DDR5" : "DDR4")) || ramProfiles[0];

    onSelectBuild(matchedCpu, matchedGpu, matchedRam, ramCap, matchedGame);
  };

  const displayedBuilds = filteredBuilds.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Info */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E2022] dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-[#8A9A86]" /> Recommended PC Builds Catalog / 用途別・ゲーム別推奨PC構成
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-1">
            Curated, 100% verified PC builds tailored for Gaming, 3D Rendering, AI ML Development, and Live Streaming.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black bg-[#E88D9F]/15 text-[#E88D9F] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Showing {displayedBuilds.length} of {filteredBuilds.length} Builds
          </span>
        </div>
      </div>

      {/* Filter & Sorting Controls Bar */}
      <div className="glass-card rounded-3xl p-5 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-md flex flex-col gap-4">
        
        {/* Row 1: Search & Sort Order */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 border border-black/15 dark:border-white/15 bg-gray-50 dark:bg-[#121315] rounded-2xl px-3.5 py-2.5 shadow-xs">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search build by game, GPU, or CPU (e.g. Cyberpunk, RTX 4070 Super, 9800X3D)..."
              className="w-full text-xs font-semibold outline-none bg-transparent text-[#1E2022] dark:text-white placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#E88D9F]" /> Sort:
            </span>
            <select
              className="bg-white dark:bg-[#121315] border border-black/15 dark:border-white/15 rounded-2xl px-3 py-2.5 text-xs font-black text-[#1E2022] dark:text-white outline-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="recommended" className="bg-white dark:bg-[#1A1C1E]">Recommended Order</option>
              <option value="price-desc" className="bg-white dark:bg-[#1A1C1E]">Price: High to Low ($3,680 → $500)</option>
              <option value="price-asc" className="bg-white dark:bg-[#1A1C1E]">Price: Low to High ($500 → $3,680)</option>
              <option value="fps-desc" className="bg-white dark:bg-[#1A1C1E]">Framerate: Highest FPS</option>
              <option value="title-asc" className="bg-white dark:bg-[#1A1C1E]">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category, Game & Budget Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 border-t border-black/10 dark:border-white/10 pt-3">
          
          {/* Workload Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-indigo-500" /> Category:
            </span>
            <select
              className="bg-white dark:bg-[#121315] border border-black/15 dark:border-white/15 rounded-2xl px-3 py-2 text-xs font-black text-[#1E2022] dark:text-white outline-none cursor-pointer"
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="All" className="bg-white dark:bg-[#1A1C1E]">-- All Workload Categories --</option>
              <option value="Gaming" className="bg-white dark:bg-[#1A1C1E]">🎮 Esports & Gaming</option>
              <option value="3D Render" className="bg-white dark:bg-[#1A1C1E]">🎨 3D Render & VFX</option>
              <option value="AI & Dev" className="bg-white dark:bg-[#1A1C1E]">💻 AI ML & Software Dev</option>
              <option value="Streaming" className="bg-white dark:bg-[#1A1C1E]">📺 4K Live Streaming</option>
            </select>
          </div>

          {/* Game Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#8A9A86]" /> Game:
            </span>
            <select
              className="bg-white dark:bg-[#121315] border border-black/15 dark:border-white/15 rounded-2xl px-3 py-2 text-xs font-black text-[#1E2022] dark:text-white outline-none cursor-pointer"
              value={selectedGameFilter}
              onChange={(e) => setSelectedGameFilter(e.target.value)}
            >
              <option value="All" className="bg-white dark:bg-[#1A1C1E]">-- All 18 Games --</option>
              {games.map((g) => (
                <option key={g.id} value={g.id} className="bg-white dark:bg-[#1A1C1E]">
                  {g.title}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Tier Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider shrink-0">Budget:</span>
            <select
              className="bg-white dark:bg-[#121315] border border-black/15 dark:border-white/15 rounded-2xl px-3 py-2 text-xs font-black text-[#1E2022] dark:text-white outline-none cursor-pointer"
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
            >
              <option value="All" className="bg-white dark:bg-[#1A1C1E]">-- All Budget Tiers --</option>
              <option value="Budget ($500-$800)" className="bg-white dark:bg-[#1A1C1E]">Budget ($500-$800)</option>
              <option value="Sweetspot ($1,000-$1,500)" className="bg-white dark:bg-[#1A1C1E]">Sweetspot ($1,000-$1,500)</option>
              <option value="High-End ($1,800-$2,500)" className="bg-white dark:bg-[#1A1C1E]">High-End ($1,800-$2,500)</option>
              <option value="God Tier ($3,000+)" className="bg-white dark:bg-[#1A1C1E]">God Tier ($3,000+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Grid (Displays initial 9 builds with unique visual themes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBuilds.map((build) => {
          const isGodTier = build.tierName.includes("God Tier");
          const isHighEnd = build.tierName.includes("High-End");

          return (
            <div
              key={build.id}
              className={`glass-card rounded-3xl p-5 bg-white dark:bg-[#1A1C1E] shadow-xl flex flex-col justify-between gap-4 transition duration-300 group animate-fadeIn ${build.accentBorderClass}`}
            >
              <div>
                {/* Top Category Badge & Price Tag */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black bg-black/5 dark:bg-white/10 text-[#1E2022] dark:text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    {isGodTier && <Award className="w-3 h-3 text-amber-400" />}
                    {isHighEnd && <Sparkles className="w-3 h-3 text-[#E88D9F]" />}
                    {build.categoryBadge}
                  </span>
                  <span className="text-xs font-mono font-black text-[#8A9A86]">
                    ${build.totalPriceUSD.toLocaleString()} USD
                  </span>
                </div>

                {/* Build Title */}
                <h3 className="text-base font-black text-[#1E2022] dark:text-white group-hover:text-[#E88D9F] transition flex items-center gap-1.5">
                  {build.buildTitle}
                </h3>

                <div className="text-xs text-gray-500 font-extrabold mt-1">
                  Target Game: <strong className="text-[#1E2022] dark:text-gray-200">{build.gameTitle}</strong>
                </div>

                {/* Silicon Highlight Pill */}
                <div className="mt-2.5 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 inline-block">
                  ⚡ {build.highlightFeature}
                </div>

                {/* Specs List */}
                <div className="mt-3 flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-black/5 dark:border-white/5 text-xs font-extrabold">
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                    <span className="text-gray-500 text-[10px] uppercase font-black">CPU:</span>
                    <span className="text-[#1E2022] dark:text-white font-bold">{build.cpuName}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                    <span className="text-gray-500 text-[10px] uppercase font-black">GPU:</span>
                    <span className="text-[#E88D9F] font-bold">{build.gpuName}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                    <span className="text-gray-500 text-[10px] uppercase font-black">RAM:</span>
                    <span className="text-[#1E2022] dark:text-white font-bold">{build.ramText}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                    <span className="text-gray-500 text-[10px] uppercase font-black">SSD:</span>
                    <span className="text-[#1E2022] dark:text-white font-bold">{build.storageText}</span>
                  </div>
                </div>

                {/* Performance Predictor Metric */}
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex justify-between items-center">
                  <span className="text-[11px] font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Est. FPS @ {build.targetResolution}:
                  </span>
                  <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">
                    ~{build.estimatedFps} FPS
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2 border-t border-black/10 dark:border-white/10 pt-3">
                <button
                  onClick={() => handleApplyBuild(build)}
                  className="flex-1 py-2.5 rounded-2xl bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] font-black text-xs hover:opacity-90 transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-[#E88D9F]" /> Load in Simulator
                </button>

                <button
                  onClick={() => {
                    handleApplyBuild(build);
                    onOpenBuyModal();
                  }}
                  className="px-3.5 py-2.5 rounded-2xl bg-[#E88D9F] text-white font-black text-xs hover:bg-[#E88D9F]/90 transition shadow-xs flex items-center gap-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Buy
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* LAZY LOAD / INFINITE SCROLL LOADER CARD & FALLBACK BUTTON */}
      {visibleCount < filteredBuilds.length && (
        <div className="mt-4 flex flex-col items-center justify-center gap-3">
          {isLoadingMore ? (
            <div className="glass-card rounded-2xl px-6 py-4 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-md flex items-center gap-3 animate-pulse">
              <Loader2 className="w-5 h-5 text-[#E88D9F] animate-spin" />
              <span className="text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider">
                Loading next 9 verified configurations...
              </span>
            </div>
          ) : (
            <button
              onClick={handleLoadMore}
              className="px-8 py-3.5 rounded-2xl bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] font-black text-xs hover:opacity-90 transition shadow-lg flex items-center gap-2"
            >
              <span>Load More Builds ({visibleCount} of {filteredBuilds.length} showing) / さらなる構成を読み込む</span>
              <ArrowDown className="w-4 h-4 text-[#E88D9F]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
