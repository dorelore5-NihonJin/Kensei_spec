import { useState, useMemo } from "react";
import type { Game } from "../lib/types";
import { Gamepad2, Search } from "lucide-react";

interface GameSelectorProps {
  games: Game[];
  selectedGame: Game;
  setSelectedGame: (val: Game) => void;
  selectedResolution: "1080p" | "1440p" | "4K";
  setSelectedResolution: (val: "1080p" | "1440p" | "4K") => void;
  selectedPreset: "Low" | "Medium" | "High" | "Ultra";
  setSelectedPreset: (val: "Low" | "Medium" | "High" | "Ultra") => void;
  selectedDlss: "Off" | "Quality" | "Performance";
  setSelectedDlss: (val: "Off" | "Quality" | "Performance") => void;
  rayTracing: "Off" | "Medium" | "Ultra";
  setRayTracing: (val: "Off" | "Medium" | "Ultra") => void;
  frameGen: boolean;
  setFrameGen: (val: boolean) => void;
}

export default function GameSelector({
  games,
  selectedGame,
  setSelectedGame,
  selectedResolution,
  setSelectedResolution,
  selectedPreset,
  setSelectedPreset,
  selectedDlss,
  setSelectedDlss,
  rayTracing,
  setRayTracing,
  frameGen,
  setFrameGen
}: GameSelectorProps) {
  const [searchGameQuery, setSearchGameQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Esports" | "AAA" | "Simulation">("All");

  // Category classifier helper
  const getGameCategory = (id: string): "Esports" | "AAA" | "Simulation" => {
    const esportsIds = ["game-cs2", "game-valorant", "game-dota2", "game-apex", "game-fortnite"];
    const simulationIds = ["game-minecraft", "game-forza5", "game-gtav", "game-sims4"];
    if (esportsIds.includes(id)) return "Esports";
    if (simulationIds.includes(id)) return "Simulation";
    return "AAA";
  };

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchQuery = game.title.toLowerCase().includes(searchGameQuery.toLowerCase());
      const cat = getGameCategory(game.id);
      const matchCat = activeCategory === "All" || cat === activeCategory;
      return matchQuery && matchCat;
    });
  }, [games, searchGameQuery, activeCategory]);

  return (
    <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1A1C1E] border border-black/5 dark:border-white/10 shadow-lg flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold flex items-center gap-2 text-dark-accent dark:text-white">
          <Gamepad2 className="w-4 h-4 text-sakura-pink" />
          2. Select Target / ゲーム選択
        </h3>
        <span className="text-[10px] bg-matcha-sage/10 text-matcha-sage dark:bg-matcha-sage/20 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
          Environment
        </span>
      </div>

      {/* Search game & category filter */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#121315] rounded-2xl px-3.5 py-2 shadow-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full text-xs outline-none bg-transparent dark:text-white"
            value={searchGameQuery}
            onChange={(e) => setSearchGameQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] rounded-xl p-0.5 text-[10px] font-black uppercase tracking-wider">
          {(["All", "Esports", "AAA", "Simulation"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-1.5 rounded-lg text-center transition duration-150 ${
                activeCategory === cat
                  ? "bg-matcha-sage text-white shadow-sm"
                  : "text-gray-400 hover:text-dark-accent dark:hover:text-white"
              }`}
            >
              {cat === "AAA" ? "AAA Next-Gen" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Game selector cards scrollbox */}
      <div className="grid grid-cols-2 gap-2.5 max-h-[190px] overflow-y-auto pr-1">
        {filteredGames.map((game) => {
          const isSelected = selectedGame.id === game.id;
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => setSelectedGame(game)}
              className={`relative overflow-hidden rounded-2xl border text-left p-2.5 transition group flex flex-col justify-between h-[84px] ${
                isSelected
                  ? "border-sakura-pink bg-sakura-pink/5 ring-2 ring-sakura-pink/20"
                  : "border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-[#121315] hover:border-black/[0.1] dark:hover:border-white/[0.1]"
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-8 h-8 object-cover rounded-lg group-hover:scale-110 transition duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-extrabold truncate text-dark-accent dark:text-white">{game.title}</div>
                  <div className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide">
                    {getGameCategory(game.id)}
                  </div>
                </div>
              </div>

              {/* Requirement details */}
              <div className="flex justify-between items-center text-[9px] font-bold text-gray-400">
                <span>Min RAM: {game.ramMinRequirementGB}GB</span>
                <span className="text-sakura-pink opacity-80">RT Tag</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Game Dependence Metrics */}
      <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] rounded-2xl flex justify-around text-center text-xs">
        <div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 block font-bold uppercase tracking-wider">CPU Reliance</span>
          <span className="font-extrabold text-dark-accent dark:text-white">{selectedGame.cpuDependence * 100}%</span>
        </div>
        <div className="border-r border-black/[0.05] dark:border-white/[0.05]" />
        <div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 block font-bold uppercase tracking-wider">GPU Reliance</span>
          <span className="font-extrabold text-dark-accent dark:text-white">{selectedGame.gpuDependence * 100}%</span>
        </div>
      </div>

      {/* Advanced Resolution / Presets / Scaling Controls */}
      <div className="flex flex-col gap-3.5 border-t border-black/[0.04] dark:border-white/[0.04] pt-4">
        {/* Resolution */}
        <div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider mb-1.5">Target Resolution</div>
          <div className="grid grid-cols-3 gap-2">
            {(["1080p", "1440p", "4K"] as const).map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setSelectedResolution(res)}
                className={`py-1.5 text-[11px] font-extrabold rounded-xl border transition ${
                  selectedResolution === res
                    ? "border-matcha-sage bg-matcha-sage/5 text-matcha-sage dark:text-white"
                    : "border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-[#121315] text-gray-600 dark:text-gray-300"
                }`}
              >
                {res === "1080p" ? "1080p FHD" : res === "1440p" ? "1440p QHD" : "4K UHD"}
              </button>
            ))}
          </div>
        </div>

        {/* Preset */}
        <div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider mb-1.5">Preset Detail</div>
          <div className="grid grid-cols-4 gap-2">
            {(["Low", "Medium", "High", "Ultra"] as const).map((pr) => (
              <button
                key={pr}
                type="button"
                onClick={() => setSelectedPreset(pr)}
                className={`py-1.5 text-[11px] font-extrabold rounded-xl border transition ${
                  selectedPreset === pr
                    ? "border-sakura-pink bg-sakura-pink/5 text-sakura-pink"
                    : "border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-[#121315] text-gray-600 dark:text-gray-300"
                }`}
              >
                {pr}
              </button>
            ))}
          </div>
        </div>

        {/* Upscaling */}
        <div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider mb-1.5">Upscaling (DLSS / FSR)</div>
          <div className="grid grid-cols-3 gap-2">
            {(["Off", "Quality", "Performance"] as const).map((dlss) => (
              <button
                key={dlss}
                type="button"
                onClick={() => setSelectedDlss(dlss)}
                className={`py-1.5 text-[11px] font-extrabold rounded-xl border transition ${
                  selectedDlss === dlss
                    ? "border-amber-500 bg-amber-500/5 text-amber-600"
                    : "border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-[#121315] text-gray-600 dark:text-gray-300"
                }`}
              >
                {dlss === "Off" ? "Off (Native)" : dlss === "Quality" ? "Quality (1.25x)" : "Perf (1.5x)"}
              </button>
            ))}
          </div>
        </div>

        {/* Ray Tracing Control */}
        <div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider mb-1.5">Ray Tracing (RTX / DXR)</div>
          <div className="grid grid-cols-3 gap-2">
            {(["Off", "Medium", "Ultra"] as const).map((rt) => (
              <button
                key={rt}
                type="button"
                onClick={() => setRayTracing(rt)}
                className={`py-1.5 text-[11px] font-extrabold rounded-xl border transition ${
                  rayTracing === rt
                    ? "border-red-500 bg-red-500/5 text-red-600"
                    : "border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-[#121315] text-gray-600 dark:text-gray-300"
                }`}
              >
                {rt === "Off" ? "Off (1.0x)" : rt === "Medium" ? "RT Medium" : "Path Tracing"}
              </button>
            ))}
          </div>
        </div>

        {/* Frame Generation Toggle */}
        <div className="flex items-center justify-between p-2.5 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl border border-black/[0.05] dark:border-white/[0.05]">
          <div>
            <div className="text-xs font-black text-dark-accent dark:text-white">Frame Generation (DLSS 3 / FSR 3)</div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Adds 1.7x display average FPS boost</div>
          </div>
          <button
            type="button"
            onClick={() => setFrameGen(!frameGen)}
            className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
              frameGen ? "bg-sakura-pink" : "bg-gray-300 dark:bg-neutral-800"
            }`}
          >
            <span
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                frameGen ? "transform translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
