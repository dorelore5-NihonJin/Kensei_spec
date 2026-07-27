import { useState, useMemo, useEffect } from "react";
import type { CPU, GPU, RAMProfile, Game, StorageType } from "./lib/types";

import cpuData from "./data/cpus.json";
import gpuData from "./data/gpus.json";
import ramData from "./data/ram.json";
import gameData from "./data/games.json";

import { calculatePerformance, getCompatibilityReport } from "./lib/calculator";

import Header from "./components/Header";
import ComponentPicker from "./components/ComponentPicker";
import GameSelector from "./components/GameSelector";
import FpsGauge from "./components/FpsGauge";
import SystemDiagnostics from "./components/SystemDiagnostics";
import UpgradeAdvisor from "./components/UpgradeAdvisor";

// Safe casting seed data
const cpus = cpuData as CPU[];
const gpus = gpuData as GPU[];
const ramProfiles = ramData as RAMProfile[];
const games = gameData as Game[];

export default function App() {
  // --- DARK MODE ---
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // --- BUILD STATE ---
  const [selectedCpu, setSelectedCpu] = useState<CPU | null>(null);
  const [selectedGpu, setSelectedGpu] = useState<GPU | null>(null);
  const [selectedRam, setSelectedRam] = useState<RAMProfile | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageType>("NVMe Gen3");
  const [ramChannel, setRamChannel] = useState<"Single" | "Dual">("Dual");

  // --- GAME & RESOLUTION STATE ---
  const [selectedGame, setSelectedGame] = useState<Game>(games[2]); // Default Cyberpunk 2077
  const [selectedResolution, setSelectedResolution] = useState<"1080p" | "1440p" | "4K">("1080p");
  const [selectedPreset, setSelectedPreset] = useState<"Low" | "Medium" | "High" | "Ultra">("High");
  const [selectedDlss, setSelectedDlss] = useState<"Off" | "Quality" | "Performance">("Off");
  const [rayTracing, setRayTracing] = useState<"Off" | "Medium" | "Ultra">("Off");
  const [frameGen, setFrameGen] = useState<boolean>(false);

  // --- PARALLAX EFFECT STATE ---
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) * 0.02,
        y: (e.clientY - window.innerHeight / 2) * 0.02
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // --- RESET ALL STATE ---
  const handleResetBuild = () => {
    setSelectedCpu(null);
    setSelectedGpu(null);
    setSelectedRam(null);
    setSelectedStorage("NVMe Gen3");
    setRamChannel("Dual");
    setRayTracing("Off");
    setFrameGen(false);
  };

  // Auto-detect RAM compatibility when CPU changes
  useEffect(() => {
    if (selectedCpu) {
      if (selectedRam && !selectedCpu.supportedDdr.includes(selectedRam.generation)) {
        // Clear ram selection to force strict compliance
        setSelectedRam(null);
      }
    }
  }, [selectedCpu, selectedRam]);

  // --- CALCULATIONS ---
  const performanceReport = useMemo(() => {
    return calculatePerformance(
      selectedCpu,
      selectedGpu,
      selectedRam,
      selectedStorage,
      selectedGame,
      selectedResolution,
      selectedPreset,
      selectedDlss,
      rayTracing,
      frameGen,
      ramChannel
    );
  }, [
    selectedCpu,
    selectedGpu,
    selectedRam,
    selectedStorage,
    selectedGame,
    selectedResolution,
    selectedPreset,
    selectedDlss,
    rayTracing,
    frameGen,
    ramChannel
  ]);

  const compatibilityReport = useMemo(() => {
    return getCompatibilityReport(selectedCpu, selectedGpu, selectedRam, selectedStorage);
  }, [selectedCpu, selectedGpu, selectedRam, selectedStorage]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-[#121315] text-white" : "bg-[#FBF9F5] text-[#1E2022]"} pb-20 relative px-4 sm:px-6 lg:px-8 overflow-hidden`}>
      {/* Background Watermarks - Reactive to Scroll and Mouse Parallax */}
      <div
        className="absolute top-24 left-10 text-[10rem] font-black text-black/[0.012] dark:text-white/[0.006] kanji-watermark select-none hidden md:block transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 0.8}px, ${mousePos.y * 0.8 + scrollY * 0.08}px, 0)`
        }}
      >
        構成
      </div>
      <div
        className="absolute top-[35%] right-10 text-[10rem] font-black text-black/[0.012] dark:text-white/[0.006] kanji-watermark select-none hidden md:block transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${-mousePos.x}px, ${-mousePos.y + scrollY * 0.12}px, 0)`
        }}
      >
        性能
      </div>
      <div
        className="absolute bottom-24 left-16 text-[10rem] font-black text-black/[0.012] dark:text-white/[0.006] kanji-watermark select-none hidden md:block transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${mousePos.y * 1.2}px, ${mousePos.x * 1.2 + scrollY * 0.05}px, 0)`
        }}
      >
        互換
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header Component */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} onReset={handleResetBuild} />

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: THE BUILD STEP (7 cols) */}
          <section className="lg:col-span-7 flex flex-col gap-6">

            {/* Component Picker Card */}
            <ComponentPicker
              cpus={cpus}
              gpus={gpus}
              ramProfiles={ramProfiles}
              selectedCpu={selectedCpu}
              setSelectedCpu={setSelectedCpu}
              selectedGpu={selectedGpu}
              setSelectedGpu={setSelectedGpu}
              selectedRam={selectedRam}
              setSelectedRam={setSelectedRam}
              selectedStorage={selectedStorage}
              setSelectedStorage={setSelectedStorage}
              ramChannel={ramChannel}
              setRamChannel={setRamChannel}
            />

            {/* System Diagnostics */}
            <SystemDiagnostics
              selectedCpu={selectedCpu}
              selectedGpu={selectedGpu}
              selectedRam={selectedRam}
              compatibilityReport={compatibilityReport}
            />

          </section>

          {/* RIGHT COLUMN: TESTING ENVIRONMENT & ESTIMATIONS (5 cols) */}
          <section className="lg:col-span-5 flex flex-col gap-6">

            {/* Game Selector & Graphics Settings */}
            <GameSelector
              games={games}
              selectedGame={selectedGame}
              setSelectedGame={setSelectedGame}
              selectedResolution={selectedResolution}
              setSelectedResolution={setSelectedResolution}
              selectedPreset={selectedPreset}
              setSelectedPreset={setSelectedPreset}
              selectedDlss={selectedDlss}
              setSelectedDlss={setSelectedDlss}
              rayTracing={rayTracing}
              setRayTracing={setRayTracing}
              frameGen={frameGen}
              setFrameGen={setFrameGen}
            />

            {/* Fps Performance Gauge */}
            <FpsGauge
              report={performanceReport}
              selectedCpu={!!selectedCpu}
              selectedGpu={!!selectedGpu}
              selectedRam={!!selectedRam}
              frameGen={frameGen}
            />

            {/* Optimal Upgrade Advisor */}
            <UpgradeAdvisor
              selectedCpu={selectedCpu}
              selectedGpu={selectedGpu}
              selectedRam={selectedRam}
              selectedStorage={selectedStorage}
              selectedGame={selectedGame}
              selectedResolution={selectedResolution}
              selectedPreset={selectedPreset}
              selectedDlss={selectedDlss}
              rayTracing={rayTracing}
              frameGen={frameGen}
              ramChannel={ramChannel}
              bottleneckType={performanceReport.bottleneckType}
              currentFps={performanceReport.averageFps}
              cpus={cpus}
              gpus={gpus}
            />

          </section>

        </main>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-black/[0.04] dark:border-white/[0.04] text-center text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
          Kensei Spec PC Simulator • 2026 Edition. Designed with Soft Japanese Minimalism.
        </footer>
      </div>
    </div>
  );
}
