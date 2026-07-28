import { useRef } from "react";
import type { Game } from "../lib/types";
import { Gamepad2, Monitor, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface QuickGameSwitcherProps {
  games: Game[];
  selectedGame: Game;
  onSelectGame: (game: Game) => void;
  selectedResolution: "1080p" | "1440p" | "4K";
  onSelectResolution: (res: "1080p" | "1440p" | "4K") => void;
  selectedPreset: "Low" | "Medium" | "High" | "Ultra";
  onSelectPreset: (preset: "Low" | "Medium" | "High" | "Ultra") => void;
}

// Helper for resolving relative image paths under subfolder deployments
function resolveCoverUrl(path?: string): string {
  if (!path) return "./games/cs2.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.replace(/^\//, "");
  return `./${clean}`;
}

export default function QuickGameSwitcher({
  games,
  selectedGame,
  onSelectGame,
  selectedResolution,
  onSelectResolution,
  selectedPreset,
  onSelectPreset
}: QuickGameSwitcherProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="glass-card rounded-3xl p-4 sm:p-5 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col gap-4 animate-fadeIn">
      {/* Top Header: Title & Clean Controls Bar (Flex-Wrap, No Scrollbars) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b border-black/10 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Gamepad2 className="w-5 h-5 text-[#E88D9F] shrink-0" />
          <h3 className="text-sm font-black text-[#1E2022] dark:text-white flex items-center gap-2">
            Quick Game & Workload Switcher / 迅速ゲーム切替
          </h3>
          <span className="text-[10px] font-black bg-[#E88D9F]/15 text-[#E88D9F] px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            Live Instant Recalculation
          </span>
        </div>

        {/* Resolution & Quality Selectors (Clean Flex Wrap without Any Native Scrollbars) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Resolution Selector */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/10 dark:border-white/10 shadow-xs">
            <Monitor className="w-3.5 h-3.5 text-[#8A9A86] ml-1.5 shrink-0" />
            {(["1080p", "1440p", "4K"] as const).map((res) => (
              <button
                key={res}
                onClick={() => onSelectResolution(res)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                  selectedResolution === res
                    ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-xs"
                    : "text-gray-600 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white"
                }`}
              >
                {res}
              </button>
            ))}
          </div>

          {/* Preset Quality Selector */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/10 dark:border-white/10 shadow-xs">
            {(["Low", "Medium", "High", "Ultra"] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => onSelectPreset(preset)}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition ${
                  selectedPreset === preset
                    ? "bg-[#8A9A86] text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Games Carousel Bar with Soft Gradient Edge Fade & Sleek Arrow Navigation */}
      <div className="relative flex items-center group px-1">
        {/* Soft Left Edge Gradient Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white dark:from-[#1A1C1E] to-transparent z-10 rounded-l-2xl" />

        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 z-20 p-2 rounded-full bg-white dark:bg-[#1E2022] border border-black/10 dark:border-white/10 shadow-lg text-gray-700 dark:text-gray-200 hover:scale-110 active:scale-95 transition flex items-center justify-center"
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Carousel Container (Custom hidden scrollbars via no-scrollbar) */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-4 w-full"
        >
          {games.map((game) => {
            const isSelected = selectedGame.id === game.id;
            const coverSrc = resolveCoverUrl(game.coverImage);

            return (
              <button
                key={game.id}
                onClick={() => onSelectGame(game)}
                className={`px-3.5 py-2 rounded-2xl flex items-center gap-2.5 font-black text-xs transition shrink-0 border ${
                  isSelected
                    ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] border-transparent shadow-md scale-102"
                    : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10"
                }`}
              >
                {/* Game Thumbnail Cover */}
                <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-black/10 dark:border-white/10 bg-black/20 shadow-xs">
                  <img
                    src={coverSrc}
                    alt={game.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "./games/cs2.jpg";
                    }}
                  />
                </div>
                <span className="truncate max-w-[140px]">{game.title}</span>
                {isSelected && <Sparkles className="w-3.5 h-3.5 text-[#E88D9F]" />}
              </button>
            );
          })}
        </div>

        {/* Soft Right Edge Gradient Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white dark:from-[#1A1C1E] to-transparent z-10 rounded-r-2xl" />

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 z-20 p-2 rounded-full bg-white dark:bg-[#1E2022] border border-black/10 dark:border-white/10 shadow-lg text-gray-700 dark:text-gray-200 hover:scale-110 active:scale-95 transition flex items-center justify-center"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
