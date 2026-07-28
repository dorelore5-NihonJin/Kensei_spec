import { useState, useMemo } from "react";
import type { CPU, GPU, Game, RAMProfile } from "../lib/types";
import { calculatePerformance } from "../lib/calculator";
import { Gamepad2, Search, AlertTriangle } from "lucide-react";

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
  selectedCpu?: CPU | null;
  selectedGpu?: GPU | null;
}

// Custom theme badges for each game
const GAME_THEMES: Record<string, { gradient: string; label: string }> = {
  "game-wukong": { gradient: "from-amber-600 to-red-800", label: "WUKONG" },
  "game-alanwake2": { gradient: "from-slate-900 to-purple-900", label: "AW2" },
  "game-gtavi": { gradient: "from-fuchsia-600 to-pink-500", label: "GTA VI" },
  "game-dota2": { gradient: "from-red-700 to-amber-700", label: "DOTA 2" },
  "game-apex": { gradient: "from-orange-600 to-[#1E2022]", label: "APEX" },
  "game-forza5": { gradient: "from-[#8A9A86] to-emerald-800", label: "FORZA 5" },
  "game-minecraft": { gradient: "from-emerald-600 to-green-800", label: "MINECRAFT" },
  "game-rdr2": { gradient: "from-amber-700 to-stone-900", label: "RDR 2" },
  "game-codwarzone": { gradient: "from-[#1E2022] to-yellow-700", label: "WARZONE" },
  "game-hogwarts": { gradient: "from-amber-500 to-indigo-900", label: "HOGWARTS" },
  "game-spider2": { gradient: "from-red-600 to-blue-800", label: "SPIDER-MAN" },
  "game-helldivers2": { gradient: "from-yellow-500 to-zinc-900", label: "HELLDIVERS" },
  "game-starfield": { gradient: "from-indigo-900 to-sky-600", label: "STARFIELD" },
  "game-sims4": { gradient: "from-teal-500 to-emerald-600", label: "SIMS 4" },
};

// Helper for resolving relative image paths under subfolder deployments (e.g. XAMPP http://localhost/Kensei_spec/dist/)
function resolveCoverUrl(path: string): string {
  if (!path) return "./games/cs2.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.replace(/^\//, "");
  return `./${clean}`;
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
  setFrameGen,
  selectedCpu,
  selectedGpu
}: GameSelectorProps) {
  const [searchGameQuery, setSearchGameQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Esports" | "AAA" | "Simulation">("All");

  // Track failed image URLs to cleanly render SVG badges instead of broken boxes
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Dynamic Telemetry Load Calculations matching exact hardware pairing physics
  const telemetryLoads = useMemo(() => {
    if (!selectedGpu) return null; // Require GPU selection

    const fallbackCpu: CPU = selectedCpu || {
      id: "fallback-cpu",
      name: "Standard CPU",
      manufacturer: "Intel",
      socket: "LGA1700",
      cores: 6,
      threads: 12,
      singleCoreScore: 200,
      multiCoreScore: 1600,
      releaseYear: 2022,
      tdpW: 65,
      supportedDdr: ["DDR4", "DDR5"],
      is3DVCache: false,
      l3CacheMB: 18
    };

    const fallbackRam: RAMProfile = {
      id: "ddr4-3200",
      generation: "DDR4",
      speedMhz: 3200,
      speedMultiplier: 1.0,
      capacityGB: 16
    };

    const report = calculatePerformance(
      fallbackCpu,
      selectedGpu,
      fallbackRam,
      "NVMe Gen3",
      selectedGame,
      selectedResolution,
      selectedPreset,
      selectedDlss,
      rayTracing,
      frameGen,
      "Dual",
      32
    );

    return {
      cpuLoad: report.cpuLoadPercentage,
      gpuLoad: report.gpuLoadPercentage,
      bottleneckType: report.bottleneckType
    };
  }, [selectedGame, selectedResolution, selectedPreset, selectedDlss, rayTracing, frameGen, selectedCpu, selectedGpu]);

  // Category classifier helper
  const getGameCategory = (id: string): "Esports" | "AAA" | "Simulation" => {
    const esportsIds = ["game-cs2", "game-valorant", "game-dota2", "game-apex", "game-fortnite", "game-codwarzone", "game-helldivers2"];
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
    <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black flex items-center gap-2 text-[#1E2022] dark:text-white">
          <Gamepad2 className="w-4 h-4 text-[#E88D9F]" />
          2. Select Target / ゲーム選択
        </h3>
        <span className="text-[10px] bg-[#8A9A86]/15 text-[#8A9A86] dark:bg-[#8A9A86]/25 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
          Environment
        </span>
      </div>

      {/* Search game & category filter */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 border border-black/15 dark:border-white/15 bg-gray-50 dark:bg-[#121315] rounded-2xl px-3.5 py-2 shadow-xs">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full text-xs font-semibold outline-none bg-transparent text-[#1E2022] dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            value={searchGameQuery}
            onChange={(e) => setSearchGameQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-0.5 text-[10px] font-black uppercase tracking-wider">
          {(["All", "Esports", "AAA", "Simulation"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-1.5 rounded-lg text-center transition duration-150 font-black ${
                activeCategory === cat
                  ? "bg-[#8A9A86] text-white shadow-xs"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#1E2022]"
              }`}
            >
              {cat === "AAA" ? "AAA Next-Gen" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Game selector cards grid - smooth scroll without jitter */}
      <div className="grid grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
        {filteredGames.map((game) => {
          const isSelected = selectedGame.id === game.id;
          const hasImageError = failedImages[game.id];
          const initial = game.title.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
          const customTheme = GAME_THEMES[game.id] || {
            gradient: "from-[#E88D9F] to-[#8A9A86]",
            label: initial
          };

          return (
            <button
              key={game.id}
              type="button"
              onClick={() => setSelectedGame(game)}
              className={`overflow-hidden rounded-2xl border text-left p-3 transition flex flex-col justify-between h-[105px] box-border ${
                isSelected
                  ? "border-[#E88D9F] bg-[#E88D9F]/10 ring-2 ring-[#E88D9F]/30"
                  : "border-black/10 dark:border-white/10 bg-white dark:bg-[#121315] hover:border-black/20"
              }`}
            >
              <div className="flex items-center gap-3">
                {!hasImageError ? (
                  <img
                    src={resolveCoverUrl(game.coverImage)}
                    alt={game.title}
                    className="w-11 h-11 object-cover rounded-xl shrink-0 border border-black/10 dark:border-white/10 shadow-xs bg-gray-100 dark:bg-neutral-800"
                    onError={() => handleImageError(game.id)}
                  />
                ) : (
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${customTheme.gradient} text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs text-center p-1 leading-none uppercase`}>
                    {customTheme.label}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black truncate text-[#1E2022] dark:text-white leading-tight">{game.title}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wide mt-0.5">
                    {getGameCategory(game.id)}
                  </div>
                </div>
              </div>

              {/* Requirement details */}
              <div className="flex justify-between items-center text-[10px] font-extrabold text-gray-600 dark:text-gray-300 border-t border-black/5 dark:border-white/5 pt-1.5 mt-auto">
                <span>Min RAM: <strong className="text-[#1E2022] dark:text-white">{game.ramMinRequirementGB}GB</strong></span>
                <span className="text-[#E88D9F] font-black bg-[#E88D9F]/10 px-1.5 py-0.5 rounded">RT Capable</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Hardware-Aware Telemetry Reliance Metrics */}
      <div className="p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl flex flex-col sm:flex-row justify-around items-center text-center gap-3">
        <div className="flex flex-col items-center flex-1">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-black uppercase tracking-wider">
            CPU Reliance {selectedCpu && <span className="text-gray-400 font-normal">({selectedCpu.name})</span>}
          </span>
          {telemetryLoads !== null ? (
            <div className="flex flex-col items-center">
              <span className="font-black text-indigo-600 dark:text-indigo-400 text-base transition-all duration-300">
                {telemetryLoads.cpuLoad}%
              </span>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-0.5 ${
                telemetryLoads.cpuLoad >= 90
                  ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                  : telemetryLoads.cpuLoad >= 60
                  ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              }`}>
                {telemetryLoads.cpuLoad >= 90
                  ? "High Thread Load"
                  : telemetryLoads.cpuLoad >= 60
                  ? "Balanced Load"
                  : "Optimal Headroom"}
              </span>
            </div>
          ) : (
            <span className="font-extrabold text-[11px] text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1 mt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              {!selectedCpu && !selectedGpu ? "Select Hardware in Step 1" : !selectedCpu ? "Select CPU in Step 1" : "Select GPU in Step 1"}
            </span>
          )}
        </div>

        <div className="hidden sm:block border-r border-black/10 dark:border-white/10 h-10" />

        <div className="flex flex-col items-center flex-1">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-black uppercase tracking-wider">
            GPU Reliance {selectedGpu && <span className="text-gray-400 font-normal">({selectedGpu.name})</span>}
          </span>
          {telemetryLoads !== null ? (
            <div className="flex flex-col items-center">
              <span className="font-black text-[#E88D9F] dark:text-[#E88D9F] text-base transition-all duration-300">
                {telemetryLoads.gpuLoad}%
              </span>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-0.5 ${
                telemetryLoads.gpuLoad >= 90
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  : telemetryLoads.gpuLoad <= 50
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  : "bg-teal-500/15 text-teal-600 dark:text-teal-400"
              }`}>
                {telemetryLoads.gpuLoad >= 90
                  ? "Shader & Render Bound"
                  : telemetryLoads.gpuLoad <= 50
                  ? "Throttled by CPU"
                  : "High VRAM Headroom"}
              </span>
            </div>
          ) : (
            <span className="font-extrabold text-[11px] text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1 mt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              {!selectedCpu && !selectedGpu ? "Select Hardware in Step 1" : !selectedGpu ? "Select GPU in Step 1" : "Select CPU in Step 1"}
            </span>
          )}
        </div>
      </div>

      {/* Advanced Resolution / Presets / Scaling Controls */}
      <div className="flex flex-col gap-3.5 border-t border-black/10 dark:border-white/10 pt-4">
        {/* Resolution */}
        <div>
          <div className="text-[10px] text-gray-600 dark:text-gray-400 font-black uppercase tracking-wider mb-1.5">Target Resolution</div>
          <div className="grid grid-cols-3 gap-2">
            {(["1080p", "1440p", "4K"] as const).map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setSelectedResolution(res)}
                className={`py-1.5 text-xs font-black rounded-xl border transition ${
                  selectedResolution === res
                    ? "border-[#8A9A86] bg-[#8A9A86] text-white shadow-xs"
                    : "border-black/10 dark:border-white/10 bg-white dark:bg-[#121315] text-[#1E2022] dark:text-gray-200 hover:bg-black/5"
                }`}
              >
                {res === "1080p" ? "1080p FHD" : res === "1440p" ? "1440p QHD" : "4K UHD"}
              </button>
            ))}
          </div>
        </div>

        {/* Preset */}
        <div>
          <div className="text-[10px] text-gray-600 dark:text-gray-400 font-black uppercase tracking-wider mb-1.5">Preset Detail</div>
          <div className="grid grid-cols-4 gap-2">
            {(["Low", "Medium", "High", "Ultra"] as const).map((pr) => (
              <button
                key={pr}
                type="button"
                onClick={() => setSelectedPreset(pr)}
                className={`py-1.5 text-xs font-black rounded-xl border transition ${
                  selectedPreset === pr
                    ? "border-[#E88D9F] bg-[#E88D9F] text-white shadow-xs"
                    : "border-black/10 dark:border-white/10 bg-white dark:bg-[#121315] text-[#1E2022] dark:text-gray-200 hover:bg-black/5"
                }`}
              >
                {pr}
              </button>
            ))}
          </div>
        </div>

        {/* Upscaling */}
        <div>
          <div className="text-[10px] text-gray-600 dark:text-gray-400 font-black uppercase tracking-wider mb-1.5">Upscaling (DLSS / FSR)</div>
          <div className="grid grid-cols-3 gap-2">
            {(["Off", "Quality", "Performance"] as const).map((dlss) => (
              <button
                key={dlss}
                type="button"
                onClick={() => setSelectedDlss(dlss)}
                className={`py-1.5 text-xs font-black rounded-xl border transition ${
                  selectedDlss === dlss
                    ? "border-amber-500 bg-amber-500 text-white shadow-xs"
                    : "border-black/10 dark:border-white/10 bg-white dark:bg-[#121315] text-[#1E2022] dark:text-gray-200 hover:bg-black/5"
                }`}
              >
                {dlss === "Off" ? "Off (Native)" : dlss === "Quality" ? "Quality" : "Performance"}
              </button>
            ))}
          </div>
        </div>

        {/* Ray Tracing Control */}
        <div>
          <div className="text-[10px] text-gray-600 dark:text-gray-400 font-black uppercase tracking-wider mb-1.5">Ray Tracing (RTX / DXR)</div>
          <div className="grid grid-cols-3 gap-2">
            {(["Off", "Medium", "Ultra"] as const).map((rt) => (
              <button
                key={rt}
                type="button"
                onClick={() => setRayTracing(rt)}
                className={`py-1.5 text-xs font-black rounded-xl border transition ${
                  rayTracing === rt
                    ? "border-rose-600 bg-rose-600 text-white shadow-xs"
                    : "border-black/10 dark:border-white/10 bg-white dark:bg-[#121315] text-[#1E2022] dark:text-gray-200 hover:bg-black/5"
                }`}
              >
                {rt === "Off" ? "Off" : rt === "Medium" ? "RT Medium" : "Path Tracing"}
              </button>
            ))}
          </div>
        </div>

        {/* Frame Generation Toggle */}
        <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-black text-[#1E2022] dark:text-white">Frame Generation (DLSS 3 / FSR 3)</div>
            <div className="text-[10px] text-gray-500 font-extrabold">Dynamic AI Frame Interpolation</div>
          </div>
          <button
            type="button"
            onClick={() => setFrameGen(!frameGen)}
            className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
              frameGen ? "bg-[#8A9A86] justify-end" : "bg-gray-300 dark:bg-gray-700 justify-start"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>
      </div>
    </div>
  );
}
