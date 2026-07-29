import { useState } from "react";
import type { GPU } from "../lib/types";
import { Gamepad2, Tv, Flame, CheckCircle2, AlertTriangle, XCircle, Zap } from "lucide-react";

interface GpuGamingBenchmarkChartProps {
  gpuA: GPU;
  gpuB: GPU;
}

type GameKey = "Cyberpunk 2077" | "Red Dead Redemption 2" | "Forza Horizon 6" | "Black Myth: Wukong" | "Helldivers 2" | "Alan Wake 2";
type ResKey = "1080p" | "1440p" | "4K";
type PresetKey = "low" | "medium" | "high" | "ultra";

const GAMES: { key: GameKey; label: string; cover: string; bgGradient: string }[] = [
  { key: "Cyberpunk 2077", label: "Cyberpunk 2077", cover: "./games/cyberpunk.jpg", bgGradient: "from-cyan-500/20 via-pink-500/10 to-purple-500/20" },
  { key: "Red Dead Redemption 2", label: "Red Dead Redemption 2", cover: "./games/rdr2.jpg", bgGradient: "from-amber-600/20 via-orange-500/10 to-red-600/20" },
  { key: "Forza Horizon 6", label: "Forza Horizon 6", cover: "./games/forza6.jpg", bgGradient: "from-fuchsia-500/20 via-rose-500/10 to-amber-500/20" },
  { key: "Black Myth: Wukong", label: "Black Myth: Wukong", cover: "./games/wukong.jpg", bgGradient: "from-yellow-600/20 via-orange-600/10 to-amber-800/20" },
  { key: "Helldivers 2", label: "Helldivers 2", cover: "./games/helldivers2.jpg", bgGradient: "from-blue-600/20 via-indigo-500/10 to-blue-800/20" },
  { key: "Alan Wake 2", label: "Alan Wake 2", cover: "./games/alanwake2.jpg", bgGradient: "from-green-700/20 via-emerald-800/10 to-teal-900/20" }
];

const RESOLUTIONS: { key: ResKey; label: string; desc: string }[] = [
  { key: "1080p", label: "1080p", desc: "Full HD (1920x1080)" },
  { key: "1440p", label: "1440p", desc: "Quad HD (2560x1440)" },
  { key: "4K", label: "4K UHD", desc: "Ultra HD (3840x2160)" }
];

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
  { key: "ultra", label: "Ultra" }
];

export default function GpuGamingBenchmarkChart({ gpuA, gpuB }: GpuGamingBenchmarkChartProps) {
  const [selectedGame, setSelectedGame] = useState<GameKey>("Cyberpunk 2077");
  const [selectedRes, setSelectedRes] = useState<ResKey>("1080p");
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("high");

  // Extract FPS for active selections safely
  const getFps = (gpu: GPU, game: GameKey, res: ResKey, preset: PresetKey): number => {
    if (!gpu.gamingBenchmarks || !gpu.gamingBenchmarks[game]) return 0;
    const resObj = gpu.gamingBenchmarks[game][res];
    if (!resObj) return 0;
    return resObj[preset] || 0;
  };

  const fpsA = getFps(gpuA, selectedGame, selectedRes, selectedPreset);
  const fpsB = getFps(gpuB, selectedGame, selectedRes, selectedPreset);

  const maxFps = Math.max(fpsA, fpsB, 120);

  const pctA = Math.min(100, Math.max(4, (fpsA / maxFps) * 100));
  const pctB = Math.min(100, Math.max(4, (fpsB / maxFps) * 100));

  const winner = fpsA > fpsB ? "A" : fpsB > fpsA ? "B" : "Tie";
  const diffFps = Math.abs(fpsA - fpsB);
  const diffPct = Math.min(fpsA, fpsB) > 0 ? Math.round((diffFps / Math.min(fpsA, fpsB)) * 100) : 0;

  const getPlayabilityBadge = (fps: number) => {
    if (fps >= 60) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3" /> Smooth (60+ FPS)
        </span>
      );
    }
    if (fps >= 30) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
          <AlertTriangle className="w-3 h-3" /> Playable (30-59 FPS)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
        <XCircle className="w-3 h-3" /> Demanding (&lt;30 FPS)
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6 mt-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E88D9F]/15 border border-[#E88D9F]/30 flex items-center justify-center text-[#E88D9F]">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#1E2022] dark:text-white flex items-center gap-2">
              Gaming FPS Benchmarks / 実ゲームFPS性能比較
            </h3>
            <p className="text-xs text-gray-500 font-bold mt-0.5">
              Empirical FPS telemetry across 1080p, 1440p, and 4K graphics presets.
            </p>
          </div>
        </div>

        {/* Resolution Segmented Picker */}
        <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/10 dark:border-white/10 self-start sm:self-auto">
          {RESOLUTIONS.map((res) => (
            <button
              key={res.key}
              onClick={() => setSelectedRes(res.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-1.5 ${
                selectedRes === res.key
                  ? "bg-[#E88D9F] text-white shadow-md scale-[1.02]"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              {res.label}
            </button>
          ))}
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {GAMES.map((game) => {
          const isActive = selectedGame === game.key;
          return (
            <button
              key={game.key}
              onClick={() => setSelectedGame(game.key)}
              className={`relative overflow-hidden rounded-2xl p-3 border text-left transition-all duration-300 ${
                isActive
                  ? "border-[#E88D9F] bg-gradient-to-br " + game.bgGradient + " shadow-md ring-2 ring-[#E88D9F]/30"
                  : "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-black/20 dark:hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={game.cover}
                  alt={game.label}
                  className="w-12 h-12 rounded-xl object-cover border border-black/10 dark:border-white/10 shadow-md shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-[#1E2022] dark:text-white truncate">
                    {game.label}
                  </span>
                  {isActive ? (
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#E88D9F] mt-0.5">
                      Active Game
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-gray-400 mt-0.5">
                      Select Benchmark
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Visual FPS Comparison Bars */}
      <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-5 sm:p-6 border border-black/10 dark:border-white/10 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#E88D9F]" />
            {selectedGame} • {selectedRes} ({selectedPreset.toUpperCase()} PRESET)
          </span>

          {winner !== "Tie" && (
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {winner === "A" ? gpuA.name : gpuB.name} is +{diffPct}% faster (+{diffFps} FPS)
            </span>
          )}
        </div>

        {/* Candidate A Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-[#1E2022] dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E88D9F]" />
              {gpuA.name}
            </span>
            <div className="flex items-center gap-2">
              {getPlayabilityBadge(fpsA)}
              <span className="font-mono text-sm text-[#E88D9F]">{fpsA} FPS</span>
            </div>
          </div>

          <div className="w-full h-8 bg-black/10 dark:bg-white/10 rounded-xl p-1 relative flex items-center overflow-hidden">
            <div
              className={`h-full rounded-lg transition-all duration-700 ease-out relative z-10 ${
                winner === "A"
                  ? "bg-gradient-to-r from-[#E88D9F] via-[#d47285] to-emerald-400 shadow-md"
                  : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
              }`}
              style={{ width: `${pctA}%` }}
            />
          </div>
        </div>

        {/* Candidate B Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-[#1E2022] dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              {gpuB.name}
            </span>
            <div className="flex items-center gap-2">
              {getPlayabilityBadge(fpsB)}
              <span className="font-mono text-sm text-emerald-500">{fpsB} FPS</span>
            </div>
          </div>

          <div className="w-full h-8 bg-black/10 dark:bg-white/10 rounded-xl p-1 relative flex items-center overflow-hidden">
            <div
              className={`h-full rounded-lg transition-all duration-700 ease-out relative z-10 ${
                winner === "B"
                  ? "bg-gradient-to-r from-[#E88D9F] via-[#8A9A86] to-emerald-400 shadow-md"
                  : "bg-gradient-to-r from-gray-400 to-gray-500 opacity-70"
              }`}
              style={{ width: `${pctB}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Quality Preset Cards Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider">
            Graphics Quality Presets ({selectedGame} @ {selectedRes})
          </h4>
          <span className="text-[10px] font-bold text-gray-400">Click preset to filter telemetry</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESETS.map((p) => {
            const fA = getFps(gpuA, selectedGame, selectedRes, p.key);
            const fB = getFps(gpuB, selectedGame, selectedRes, p.key);
            const isSelected = selectedPreset === p.key;
            const pWinner = fA > fB ? "A" : fB > fA ? "B" : "Tie";

            return (
              <div
                key={p.key}
                onClick={() => setSelectedPreset(p.key)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? "border-[#E88D9F] bg-gradient-to-br from-[#E88D9F]/15 to-[#8A9A86]/10 shadow-lg ring-2 ring-[#E88D9F]/30 scale-[1.02]"
                    : "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-black/20 dark:hover:border-white/20 hover:scale-[1.01]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-[#1E2022] dark:text-white">{p.label}</span>
                  {isSelected && (
                    <span className="text-[9px] font-black uppercase text-[#E88D9F] bg-[#E88D9F]/15 px-2 py-0.5 rounded-md border border-[#E88D9F]/30">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-black mt-2">
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span className="truncate max-w-[90px] text-[11px] font-bold">{gpuA.name.replace(/GeForce|Radeon|Intel/g, "").trim()}</span>
                    <span className={`font-mono ${pWinner === "A" ? "text-[#E88D9F] font-black" : "text-gray-400"}`}>{fA} FPS</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span className="truncate max-w-[90px] text-[11px] font-bold">{gpuB.name.replace(/GeForce|Radeon|Intel/g, "").trim()}</span>
                    <span className={`font-mono ${pWinner === "B" ? "text-emerald-400 font-black" : "text-gray-400"}`}>{fB} FPS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
