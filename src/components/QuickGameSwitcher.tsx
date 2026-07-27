import type { Game } from "../lib/types";
import { Gamepad2, Monitor, Sparkles } from "lucide-react";

interface QuickGameSwitcherProps {
  games: Game[];
  selectedGame: Game;
  onSelectGame: (game: Game) => void;
  selectedResolution: "1080p" | "1440p" | "4K";
  onSelectResolution: (res: "1080p" | "1440p" | "4K") => void;
  selectedPreset: "Low" | "Medium" | "High" | "Ultra";
  onSelectPreset: (preset: "Low" | "Medium" | "High" | "Ultra") => void;
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
  return (
    <div className="glass-card rounded-3xl p-4 sm:p-5 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col gap-3 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-black/10 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-[#E88D9F]" />
          <h3 className="text-sm font-black text-[#1E2022] dark:text-white flex items-center gap-2">
            Quick Game & Workload Switcher / 迅速ゲーム切替
          </h3>
          <span className="text-[10px] font-black bg-[#E88D9F]/15 text-[#E88D9F] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Live Instant Recalculation
          </span>
        </div>

        {/* Resolution & Quality Selectors */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Resolution Selector */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
            <Monitor className="w-3.5 h-3.5 text-[#8A9A86] ml-1 shrink-0" />
            {(["1080p", "1440p", "4K"] as const).map((res) => (
              <button
                key={res}
                onClick={() => onSelectResolution(res)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                  selectedResolution === res
                    ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-xs"
                    : "text-gray-600 dark:text-gray-300 hover:text-[#1E2022]"
                }`}
              >
                {res}
              </button>
            ))}
          </div>

          {/* Preset Quality Selector */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
            {(["Low", "Medium", "High", "Ultra"] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => onSelectPreset(preset)}
                className={`px-2 py-1 rounded-lg text-xs font-black transition ${
                  selectedPreset === preset
                    ? "bg-[#8A9A86] text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-300 hover:text-[#1E2022]"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Games Carousel Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {games.map((game) => {
          const isSelected = selectedGame.id === game.id;

          return (
            <button
              key={game.id}
              onClick={() => onSelectGame(game)}
              className={`px-3 py-2 rounded-2xl flex items-center gap-2 font-black text-xs transition shrink-0 border ${
                isSelected
                  ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] border-transparent shadow-md scale-102"
                  : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              {/* Game Thumbnail */}
              <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-black/10 dark:border-white/10 bg-black/20">
                <img
                  src={`./games/${game.id}.jpg`}
                  alt={game.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "./games/cs2.jpg";
                  }}
                />
              </div>
              <span className="truncate max-w-[120px]">{game.title}</span>
              {isSelected && <Sparkles className="w-3 h-3 text-[#E88D9F]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
