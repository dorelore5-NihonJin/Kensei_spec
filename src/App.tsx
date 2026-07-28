import { useState, useEffect } from "react";
import { useHardware } from "./context/HardwareContext";

import Header from "./components/Header";
import ComponentPicker from "./components/ComponentPicker";
import GameSelector from "./components/GameSelector";
import FpsGauge from "./components/FpsGauge";
import SystemDiagnostics from "./components/SystemDiagnostics";
import UpgradeAdvisor from "./components/UpgradeAdvisor";
import BuildBuyModal from "./components/BuildBuyModal";
import { ShoppingCart, ArrowRight, Sparkles, Cpu, Zap, Check } from "lucide-react";

import GameBuildsCatalog from "./pages/GameBuildsCatalog";
import ComparePage from "./pages/ComparePage";
import RankingsPage from "./pages/RankingsPage";
import Footer from "./components/Footer";
import QuickGameSwitcher from "./components/QuickGameSwitcher";
import LegalDocsModal from "./components/LegalDocsModal";
import CookieBanner from "./components/CookieBanner";
import CookieSettingsModal from "./components/CookieSettingsModal";
import Toast from "./components/Toast";

export default function App() {
  const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState<boolean>(false);

  const {
    cpus,
    gpus,
    ramProfiles,
    games,
    activePage,
    setActivePage,
    currentStep,
    setCurrentStep,
    viewMode,
    setViewMode,
    darkMode,
    setDarkMode,
    selectedCpu,
    setSelectedCpu,
    selectedGpu,
    setSelectedGpu,
    selectedRam,
    setSelectedRam,
    ramCapacityGB,
    setRamCapacityGB,
    selectedStorage,
    setSelectedStorage,
    ramChannel,
    setRamChannel,
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
    isToastOpen,
    setIsToastOpen,
    toastMessage,
    toastSubMessage,
    isBuyModalOpen,
    setIsBuyModalOpen,
    isLegalModalOpen,
    setIsLegalModalOpen,
    legalModalTab,
    handleOpenLegalModal,
    performanceResult: performanceReport,
    compatibilityReport,
    handleResetBuild,
    handleSelectCatalogBuild
  } = useHardware();

  // --- PARALLAX EFFECT STATE ---
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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

  // Completion check
  const isHardwareSelected = Boolean(selectedCpu && selectedGpu && selectedRam);

  // Quick Preset Helper for users testing Step 3 directly
  const handleSelectHighEndPreset = () => {
    const highEndCpu = cpus.find(c => c.name.includes("9800X3D") || c.name.includes("7800X3D") || c.name.includes("14900K")) || cpus[cpus.length - 1];
    const highEndGpu = gpus.find(g => g.name.includes("4080 Super") || g.name.includes("4090") || g.name.includes("4070 Super")) || gpus[gpus.length - 1];
    const highEndRam = ramProfiles.find(r => r.generation === "DDR5" && r.speedMhz >= 6000) || ramProfiles[0];

    setSelectedCpu(highEndCpu);
    setSelectedGpu(highEndGpu);
    setSelectedRam(highEndRam);
    setRamCapacityGB(32);
    setSelectedStorage("NVMe Gen4");
    setRamChannel("Dual");
  };

  // Auto-detect RAM compatibility when CPU changes
  useEffect(() => {
    if (selectedCpu) {
      if (selectedRam && !selectedCpu.supportedDdr.includes(selectedRam.generation)) {
        setSelectedRam(null);
      }
    }
  }, [selectedCpu, selectedRam, setSelectedRam]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-[#121315] text-white" : "bg-[#FBF9F5] text-[#1E2022]"} pb-20 relative px-4 sm:px-6 lg:px-8 overflow-hidden`}>
      {/* Background Watermarks */}
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

      <div className="max-w-[1400px] mx-auto flex flex-col gap-6 w-full">
        {/* Header Component with Navigation */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onReset={handleResetBuild}
          activePage={activePage}
          setActivePage={setActivePage}
          onOpenBuyModal={() => setIsBuyModalOpen(true)}
        />

        {/* PAGE SWITCH: COMPARE PAGE vs RANKINGS PAGE vs CATALOG PAGE vs SIMULATOR PAGE */}
        {activePage === "compare" ? (
          <ComparePage cpus={cpus} gpus={gpus} />
        ) : activePage === "rankings" ? (
          <RankingsPage cpus={cpus} gpus={gpus} />
        ) : activePage === "catalog" ? (
          <GameBuildsCatalog
            games={games}
            cpus={cpus}
            gpus={gpus}
            ramProfiles={ramProfiles}
            onSelectBuild={handleSelectCatalogBuild}
            onOpenBuyModal={() => setIsBuyModalOpen(true)}
          />
        ) : (
          <>
            {/* WORKFLOW STEPPER CONTROLLER */}
        <div className="glass-card rounded-2xl p-3 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Steps Indicator Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* STEP 1 */}
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition duration-200 shrink-0 ${
                currentStep === 1
                  ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-sm"
                  : "bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-black/10"
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black ${
                isHardwareSelected ? "bg-emerald-500 text-white" : "bg-[#E88D9F] text-white"
              }`}>
                {isHardwareSelected ? <Check className="w-3 h-3 text-white" /> : "1"}
              </span>
              <span>1. Pick Components / 構成選択</span>
            </button>

            <span className="text-gray-300 dark:text-gray-600 font-bold hidden sm:inline">→</span>

            {/* STEP 2 */}
            <button
              onClick={() => setCurrentStep(2)}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition duration-200 shrink-0 ${
                currentStep === 2
                  ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-sm"
                  : "bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-black/10"
              }`}
            >
              <span className="w-5 h-5 rounded-full text-[10px] bg-[#8A9A86] text-white flex items-center justify-center font-black">
                2
              </span>
              <span>2. Select Game / ゲーム選択</span>
            </button>

            <span className="text-gray-300 dark:text-gray-600 font-bold hidden sm:inline">→</span>

            {/* STEP 3 */}
            <button
              onClick={() => setCurrentStep(3)}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition duration-200 shrink-0 ${
                currentStep === 3
                  ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-sm"
                  : "bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-black/10"
              }`}
            >
              <span className="w-5 h-5 rounded-full text-[10px] bg-[#E88D9F] text-white flex items-center justify-center font-black">
                3
              </span>
              <span>3. Benchmark & Diagnostics / 性能・診断</span>
            </button>
          </div>

          {/* Right Action Bar (Buy Modal Trigger & View Mode) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#E88D9F] text-white font-black text-xs hover:bg-[#E88D9F]/90 transition shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Buy Build / 買います
            </button>

            {/* View Mode Switch (Wizard vs Full Overview) */}
            <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10 text-[11px] font-black shrink-0">
              <button
                onClick={() => setViewMode("wizard")}
                className={`px-3 py-1 rounded-lg transition ${
                  viewMode === "wizard"
                    ? "bg-[#8A9A86] text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-[#1E2022]"
                }`}
              >
                Step-by-Step
              </button>
              <button
                onClick={() => setViewMode("overview")}
                className={`px-3 py-1 rounded-lg transition ${
                  viewMode === "overview"
                    ? "bg-[#8A9A86] text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-[#1E2022]"
                }`}
              >
                Full Overview
              </button>
            </div>
          </div>
        </div>

        {/* MAIN DISPLAY AREA */}
        {viewMode === "overview" ? (
          /* FULL OVERVIEW MODE (All Cards Visible) */
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-7 flex flex-col gap-6">
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
                ramCapacityGB={ramCapacityGB}
                setRamCapacityGB={setRamCapacityGB}
                selectedStorage={selectedStorage}
                setSelectedStorage={setSelectedStorage}
                ramChannel={ramChannel}
                setRamChannel={setRamChannel}
              />
              <SystemDiagnostics
                selectedCpu={selectedCpu}
                selectedGpu={selectedGpu}
                selectedRam={selectedRam}
                compatibilityReport={compatibilityReport}
              />
            </section>

            <section className="lg:col-span-5 flex flex-col gap-6">
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
                selectedCpu={selectedCpu}
                selectedGpu={selectedGpu}
              />
              <FpsGauge
                report={performanceReport}
                selectedCpu={!!selectedCpu}
                selectedGpu={!!selectedGpu}
                selectedRam={!!selectedRam}
                frameGen={frameGen}
              />
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
                cpus={cpus}
                gpus={gpus}
              />
            </section>
          </main>
        ) : (
          /* STEP-BY-STEP WIZARD MODE */
          <main className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            {currentStep === 1 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
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
                  ramCapacityGB={ramCapacityGB}
                  setRamCapacityGB={setRamCapacityGB}
                  selectedStorage={selectedStorage}
                  setSelectedStorage={setSelectedStorage}
                  ramChannel={ramChannel}
                  setRamChannel={setRamChannel}
                />

                {/* Progressive Action Banner for Step 1 */}
                <div className="p-5 rounded-3xl bg-[#1E2022] text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-white/10">
                  <div>
                    <h4 className="text-sm font-black flex items-center gap-2">
                      {isHardwareSelected ? (
                        <>
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>Step 1 Complete!</span>
                        </>
                      ) : (
                        <>
                          <Cpu className="w-4 h-4 text-[#E88D9F]" />
                          <span>Step 1: Select Hardware</span>
                        </>
                      )}
                    </h4>
                    <p className="text-xs text-gray-300 font-extrabold mt-0.5">
                      {isHardwareSelected
                        ? "CPU, GPU, and RAM selected. Ready for target game benchmarking."
                        : "Please select a CPU, GPU, and RAM to enable full performance testing."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isHardwareSelected && (
                      <button
                        onClick={() => setIsBuyModalOpen(true)}
                        className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-white/10 text-white font-black text-xs hover:bg-white/20 transition shrink-0 flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-[#E88D9F]" /> Buy Build
                      </button>
                    )}
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-[#E88D9F] text-white font-black text-xs hover:bg-[#E88D9F]/90 transition shadow-md shrink-0 flex items-center justify-center gap-1.5"
                    >
                      Proceed to Step 2 <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
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
                  selectedCpu={selectedCpu}
                  selectedGpu={selectedGpu}
                />

                {/* Progressive Action Banner for Step 2 */}
                <div className="p-5 rounded-3xl bg-[#1E2022] text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-white/10">
                  <div>
                    <h4 className="text-sm font-black flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#8A9A86]" /> Target Workload Selected: {selectedGame.title}
                    </h4>
                    <p className="text-xs text-gray-300 font-extrabold mt-0.5">
                      Resolution: {selectedResolution} • Preset: {selectedPreset} • RT: {rayTracing}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isHardwareSelected && (
                      <button
                        onClick={() => setIsBuyModalOpen(true)}
                        className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-white/10 text-white font-black text-xs hover:bg-white/20 transition shrink-0 flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-[#E88D9F]" /> Buy Build
                      </button>
                    )}
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-[#8A9A86] text-white font-black text-xs hover:bg-[#8A9A86]/90 transition shadow-md shrink-0 flex items-center justify-center gap-1.5"
                    >
                      View Benchmark Results <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                {!isHardwareSelected ? (
                  <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 text-center flex flex-col items-center gap-4 shadow-lg">
                    <div className="w-12 h-12 rounded-2xl bg-[#E88D9F]/15 text-[#E88D9F] flex items-center justify-center font-black text-2xl">
                      <Cpu className="w-6 h-6 text-[#E88D9F]" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[#1E2022] dark:text-white">
                        Select Hardware Components First
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-1 max-w-md">
                        To generate live SVG benchmark gauges, workload balance telemetry, and upgrade advice, please configure your CPU, GPU, and RAM in Step 1.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-2.5 rounded-2xl bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] font-black text-xs hover:opacity-90 transition shadow-xs"
                      >
                        Go to Step 1: Pick Hardware →
                      </button>
                      <button
                        onClick={handleSelectHighEndPreset}
                        className="px-6 py-2.5 rounded-2xl bg-[#8A9A86] text-white font-black text-xs hover:bg-[#8A9A86]/90 transition shadow-xs flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" /> Load High-End Gaming Rig
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <QuickGameSwitcher
                      games={games}
                      selectedGame={selectedGame}
                      onSelectGame={setSelectedGame}
                      selectedResolution={selectedResolution}
                      onSelectResolution={setSelectedResolution}
                      selectedPreset={selectedPreset}
                      onSelectPreset={setSelectedPreset}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-6">
                        <FpsGauge
                          report={performanceReport}
                          selectedCpu={!!selectedCpu}
                          selectedGpu={!!selectedGpu}
                          selectedRam={!!selectedRam}
                          frameGen={frameGen}
                        />
                        <SystemDiagnostics
                          selectedCpu={selectedCpu}
                          selectedGpu={selectedGpu}
                          selectedRam={selectedRam}
                          compatibilityReport={compatibilityReport}
                        />
                      </div>

                      <div className="flex flex-col gap-6">
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
                          cpus={cpus}
                          gpus={gpus}
                        />
                      </div>
                    </div>

                    {/* Final Checkout Card */}
                    <div className="p-6 rounded-3xl bg-[#1E2022] text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-white/10">
                      <div>
                        <h4 className="text-base font-black flex items-center gap-2">
                          Ready to build this setup? / 構成を注文する
                        </h4>
                        <p className="text-xs text-gray-300 font-extrabold mt-0.5">
                          View auto-matched motherboards, coolers, PSU wattage, and price comparisons across stores.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsBuyModalOpen(true)}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#E88D9F] text-white font-black text-sm hover:bg-[#E88D9F]/90 transition shadow-lg flex items-center justify-center gap-2 shrink-0"
                      >
                        <ShoppingCart className="w-4 h-4" /> Buy Complete Build / 買います
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        )}
      </>
    )}

        {/* BUILD BUY STORE MODAL */}
        <BuildBuyModal
          isOpen={isBuyModalOpen}
          onClose={() => setIsBuyModalOpen(false)}
          selectedCpu={selectedCpu}
          selectedGpu={selectedGpu}
          selectedRam={selectedRam}
          ramCapacityGB={ramCapacityGB}
          selectedStorage={selectedStorage}
          psuRecommendationW={compatibilityReport.psuRecommendationW}
        />

        {/* LEGAL GOVERNANCE & POLICY MODAL */}
        <LegalDocsModal
          isOpen={isLegalModalOpen}
          onClose={() => setIsLegalModalOpen(false)}
          initialTab={legalModalTab}
        />

        {/* Rich Multi-Column Footer */}
        <Footer
          setActivePage={setActivePage}
          onOpenBuyModal={() => setIsBuyModalOpen(true)}
          onResetBuild={handleResetBuild}
          onOpenLegalModal={handleOpenLegalModal}
          onOpenCookieSettings={() => setIsCookieSettingsOpen(true)}
        />

        {/* Cookie & LocalStorage GDPR Consent Banner */}
        <CookieBanner onOpenPrivacyPolicy={() => handleOpenLegalModal("privacy")} />

        {/* Dedicated Cookie & Storage Preferences Modal */}
        <CookieSettingsModal
          isOpen={isCookieSettingsOpen}
          onClose={() => setIsCookieSettingsOpen(false)}
          onOpenPrivacyPolicy={() => {
            setIsCookieSettingsOpen(false);
            handleOpenLegalModal("privacy");
          }}
        />

        {/* Global Toast Notification System */}
        <Toast
          message={toastMessage}
          subMessage={toastSubMessage}
          isOpen={isToastOpen}
          onClose={() => setIsToastOpen(false)}
        />
      </div>
    </div>
  );
}
