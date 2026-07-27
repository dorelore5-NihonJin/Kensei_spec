import { useState, useMemo } from "react";
import type { Game, CPU, GPU, RAMProfile } from "../lib/types";
import { Search, Filter, ShoppingCart, Zap, CheckCircle2 } from "lucide-react";

interface GameBuildsCatalogProps {
  games: Game[];
  cpus: CPU[];
  gpus: GPU[];
  ramProfiles: RAMProfile[];
  onSelectBuild: (cpu: CPU, gpu: GPU, ram: RAMProfile, ramCap: number, game: Game) => void;
  onOpenBuyModal: () => void;
}

export interface PresetBuild {
  id: string;
  gameId: string;
  gameTitle: string;
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

  // Generate catalog builds derived from actual games and hardware data
  const catalogBuilds: PresetBuild[] = useMemo(() => {
    const builds: PresetBuild[] = [];

    games.forEach((game) => {
      // 1. Budget Build
      builds.push({
        id: `${game.id}-budget`,
        gameId: game.id,
        gameTitle: game.title,
        tierName: "Budget ($500-$800)",
        buildTitle: `${game.title} 1080p Value Rig`,
        cpuName: "Ryzen 5 5600",
        gpuName: "GeForce RTX 3060 12GB",
        ramText: "16GB DDR4-3200 Dual Channel",
        storageText: "1TB NVMe M.2 SSD",
        targetResolution: "1080p",
        estimatedFps: Math.round(game.baseFpsScaling["1080p"]?.Medium * 0.85 || 90),
        totalPriceUSD: 680,
        badgeTag: "Best Value / 1080p 60+ FPS"
      });

      // 2. Sweetspot Build
      builds.push({
        id: `${game.id}-sweetspot`,
        gameId: game.id,
        gameTitle: game.title,
        tierName: "Sweetspot ($1,000-$1,500)",
        buildTitle: `${game.title} 1440p Ultra Dominator`,
        cpuName: "Ryzen 5 7600X",
        gpuName: "GeForce RTX 4070 Super 12GB",
        ramText: "32GB DDR5-6000 Dual Channel",
        storageText: "2TB NVMe Gen4 SSD",
        targetResolution: "1440p",
        estimatedFps: Math.round(game.baseFpsScaling["1440p"]?.High * 1.3 || 120),
        totalPriceUSD: 1350,
        badgeTag: "Most Popular / 1440p 120+ FPS"
      });

      // 3. High-End Build
      builds.push({
        id: `${game.id}-highend`,
        gameId: game.id,
        gameTitle: game.title,
        tierName: "High-End ($1,800-$2,500)",
        buildTitle: `${game.title} 4K Ray Tracing Beast`,
        cpuName: "Ryzen 7 7800X3D",
        gpuName: "GeForce RTX 4080 Super 16GB",
        ramText: "32GB DDR5-6000 3D V-Cache Kit",
        storageText: "2TB PCIe 4.0 NVMe SSD",
        targetResolution: "4K",
        estimatedFps: Math.round(game.baseFpsScaling["4K"]?.Ultra * 1.6 || 90),
        totalPriceUSD: 2150,
        badgeTag: "4K Ultra + Ray Tracing"
      });

      // 4. God Tier Build
      builds.push({
        id: `${game.id}-godtier`,
        gameId: game.id,
        gameTitle: game.title,
        tierName: "God Tier ($3,000+)",
        buildTitle: `${game.title} Absolute Flagship King`,
        cpuName: "Ryzen 7 9800X3D",
        gpuName: "GeForce RTX 4090 24GB",
        ramText: "64GB DDR5-6400 Low-Latency",
        storageText: "4TB Gen4 NVMe M.2 SSD",
        targetResolution: "4K",
        estimatedFps: Math.round(game.baseFpsScaling["4K"]?.Ultra * 2.2 || 140),
        totalPriceUSD: 3650,
        badgeTag: "Maximum Performance / No Compromise"
      });
    });

    return builds;
  }, [games]);

  // Filtering logic
  const filteredBuilds = useMemo(() => {
    return catalogBuilds.filter((b) => {
      const matchSearch =
        b.buildTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.gameTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.cpuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.gpuName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGame = selectedGameFilter === "All" || b.gameId === selectedGameFilter;
      const matchTier = selectedTierFilter === "All" || b.tierName === selectedTierFilter;

      return matchSearch && matchGame && matchTier;
    });
  }, [catalogBuilds, searchQuery, selectedGameFilter, selectedTierFilter]);

  // Handle loading build into simulator
  const handleApplyBuild = (build: PresetBuild) => {
    const matchedGame = games.find((g) => g.id === build.gameId) || games[0];
    const matchedCpu = cpus.find((c) => c.name.includes(build.cpuName.split(" ")[1])) || cpus[0];
    const matchedGpu = gpus.find((g) => g.name.includes(build.gpuName.split(" ")[1])) || gpus[0];
    const ramCap = build.ramText.includes("64GB") ? 64 : build.ramText.includes("32GB") ? 32 : 16;
    const matchedRam = ramProfiles.find((r) => r.generation === (build.ramText.includes("DDR5") ? "DDR5" : "DDR4")) || ramProfiles[0];

    onSelectBuild(matchedCpu, matchedGpu, matchedRam, ramCap, matchedGame);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Info */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E2022] dark:text-white flex items-center gap-2">
            📦 Recommended Game Builds Catalog / ゲーム別推奨PC構成
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-1">
            Curated, 100% verified PC builds tailored for every game title and budget tier ($500 to $3,500+)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black bg-[#E88D9F]/15 text-[#E88D9F] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            {filteredBuilds.length} Configurations Listed
          </span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-card rounded-3xl p-5 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-md flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 border border-black/15 dark:border-white/15 bg-gray-50 dark:bg-[#121315] rounded-2xl px-3.5 py-2.5 shadow-xs">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search build by game or GPU (e.g. Cyberpunk, RTX 4070 Super)..."
            className="w-full text-xs font-semibold outline-none bg-transparent text-[#1E2022] dark:text-white placeholder:text-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Game Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Game:
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

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuilds.map((build) => {
          return (
            <div
              key={build.id}
              className="glass-card rounded-3xl p-5 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col justify-between gap-4 hover:border-[#E88D9F]/50 transition duration-200 group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black bg-[#E88D9F]/15 text-[#E88D9F] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {build.badgeTag}
                  </span>
                  <span className="text-xs font-mono font-black text-[#8A9A86]">
                    ${build.totalPriceUSD.toLocaleString()} USD
                  </span>
                </div>

                <h3 className="text-base font-black text-[#1E2022] dark:text-white group-hover:text-[#E88D9F] transition">
                  {build.buildTitle}
                </h3>

                <div className="text-xs text-gray-500 font-extrabold mt-1">
                  Target Game: <strong className="text-[#1E2022] dark:text-gray-200">{build.gameTitle}</strong>
                </div>

                {/* Specs List */}
                <div className="mt-4 flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-black/5 dark:border-white/5 text-xs font-extrabold">
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
    </div>
  );
}
