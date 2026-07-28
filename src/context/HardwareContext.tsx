import { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import type { CPU, GPU, RAMProfile, Game, StorageType } from "../lib/types";

import cpuData from "../data/cpus.json";
import gpuData from "../data/gpus.json";
import ramData from "../data/ram.json";
import gameData from "../data/games.json";

import { calculatePerformance, getCompatibilityReport } from "../lib/calculator";
import { encodeBuildToUrl, decodeBuildFromUrl } from "../lib/urlSharing";

const cpus = cpuData as CPU[];
const gpus = gpuData as GPU[];
const ramProfiles = ramData as RAMProfile[];
const games = gameData as Game[];

interface HardwareContextType {
  // Data Lists
  cpus: CPU[];
  gpus: GPU[];
  ramProfiles: RAMProfile[];
  games: Game[];

  // App Page & Navigation State
  activePage: "simulator" | "catalog";
  setActivePage: (page: "simulator" | "catalog") => void;
  currentStep: 1 | 2 | 3;
  setCurrentStep: (step: 1 | 2 | 3) => void;
  viewMode: "wizard" | "overview";
  setViewMode: (mode: "wizard" | "overview") => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean | ((prev: boolean) => boolean)) => void;

  // Hardware Selection State
  selectedCpu: CPU | null;
  setSelectedCpu: (cpu: CPU | null) => void;
  selectedGpu: GPU | null;
  setSelectedGpu: (gpu: GPU | null) => void;
  selectedRam: RAMProfile | null;
  setSelectedRam: (ram: RAMProfile | null) => void;
  ramCapacityGB: number;
  setRamCapacityGB: (cap: number) => void;
  selectedStorage: StorageType;
  setSelectedStorage: (storage: StorageType) => void;
  ramChannel: "Single" | "Dual";
  setRamChannel: (channel: "Single" | "Dual") => void;

  // Game & Graphics Options State
  selectedGame: Game;
  setSelectedGame: (game: Game) => void;
  selectedResolution: "1080p" | "1440p" | "4K";
  setSelectedResolution: (res: "1080p" | "1440p" | "4K") => void;
  selectedPreset: "Low" | "Medium" | "High" | "Ultra";
  setSelectedPreset: (preset: "Low" | "Medium" | "High" | "Ultra") => void;
  selectedDlss: "Off" | "Quality" | "Performance";
  setSelectedDlss: (dlss: "Off" | "Quality" | "Performance") => void;
  rayTracing: "Off" | "Medium" | "Ultra";
  setRayTracing: (rt: "Off" | "Medium" | "Ultra") => void;
  frameGen: boolean;
  setFrameGen: (fg: boolean) => void;

  // Toast State
  isToastOpen: boolean;
  setIsToastOpen: (open: boolean) => void;
  toastMessage: string;
  toastSubMessage: string;
  showToast: (message: string, subMessage?: string) => void;

  // Modals State
  isBuyModalOpen: boolean;
  setIsBuyModalOpen: (open: boolean) => void;
  isLegalModalOpen: boolean;
  setIsLegalModalOpen: (open: boolean) => void;
  legalModalTab: "terms" | "privacy" | "disclaimer" | "affiliate";
  setLegalModalTab: (tab: "terms" | "privacy" | "disclaimer" | "affiliate") => void;
  handleOpenLegalModal: (tab?: "terms" | "privacy" | "disclaimer" | "affiliate") => void;

  // Computed Telemetry
  performanceResult: ReturnType<typeof calculatePerformance>;
  compatibilityReport: ReturnType<typeof getCompatibilityReport>;

  // Action Methods
  handleResetBuild: () => void;
  handleShareBuild: () => string;
  handleSelectCatalogBuild: (
    cpu: CPU,
    gpu: GPU,
    ram: RAMProfile,
    ramCap: number,
    game: Game,
    targetResolution?: "1080p" | "1440p" | "4K"
  ) => void;
}

const HardwareContext = createContext<HardwareContextType | undefined>(undefined);

export function HardwareProvider({ children }: { children: ReactNode }) {
  // Helper to read localStorage safely
  const getStorageItem = (key: string, fallback: string) => {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch {
      return fallback;
    }
  };

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastSubMessage, setToastSubMessage] = useState<string>("");
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);

  const showToast = (message: string, subMessage?: string) => {
    setToastMessage(message);
    setToastSubMessage(subMessage || "");
    setIsToastOpen(true);
  };

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => getStorageItem("kensei_dark_mode", "false") === "true");

  // App Page & Navigation State
  const [activePage, setActivePage] = useState<"simulator" | "catalog">(() => getStorageItem("kensei_active_page", "simulator") as any);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(() => {
    const step = parseInt(getStorageItem("kensei_current_step", "1"));
    return (step === 1 || step === 2 || step === 3) ? step : 1;
  });
  const [viewMode, setViewMode] = useState<"wizard" | "overview">("wizard");

  // Buy Store & Legal Modals State
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<"terms" | "privacy" | "disclaimer" | "affiliate">("terms");

  const handleOpenLegalModal = (tab: "terms" | "privacy" | "disclaimer" | "affiliate" = "terms") => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // Hardware Selection State (Restored from localStorage on F5)
  const [selectedCpu, setSelectedCpu] = useState<CPU | null>(() => {
    const savedId = getStorageItem("kensei_cpu_id", "");
    return savedId ? cpus.find(c => c.id === savedId) || null : null;
  });
  const [selectedGpu, setSelectedGpu] = useState<GPU | null>(() => {
    const savedId = getStorageItem("kensei_gpu_id", "");
    return savedId ? gpus.find(g => g.id === savedId) || null : null;
  });
  const [selectedRam, setSelectedRam] = useState<RAMProfile | null>(() => {
    const savedId = getStorageItem("kensei_ram_id", "");
    return savedId ? ramProfiles.find(r => r.id === savedId) || null : null;
  });
  const [ramCapacityGB, setRamCapacityGB] = useState<number>(() => parseInt(getStorageItem("kensei_ram_capacity", "32")) || 32);
  const [selectedStorage, setSelectedStorage] = useState<StorageType>(() => getStorageItem("kensei_storage", "NVMe Gen3") as StorageType);
  const [ramChannel, setRamChannel] = useState<"Single" | "Dual">(() => getStorageItem("kensei_ram_channel", "Dual") as any);

  // Game & Graphics Options State (Restored from localStorage on F5)
  const [selectedGame, setSelectedGame] = useState<Game>(() => {
    const savedId = getStorageItem("kensei_game_id", "");
    return savedId ? games.find(g => g.id === savedId) || games[2] || games[0] : games[2] || games[0];
  });
  const [selectedResolution, setSelectedResolution] = useState<"1080p" | "1440p" | "4K">(() => getStorageItem("kensei_resolution", "1080p") as any);
  const [selectedPreset, setSelectedPreset] = useState<"Low" | "Medium" | "High" | "Ultra">(() => getStorageItem("kensei_preset", "High") as any);
  const [selectedDlss, setSelectedDlss] = useState<"Off" | "Quality" | "Performance">(() => getStorageItem("kensei_dlss", "Off") as any);
  const [rayTracing, setRayTracing] = useState<"Off" | "Medium" | "Ultra">(() => getStorageItem("kensei_ray_tracing", "Off") as any);
  const [frameGen, setFrameGen] = useState<boolean>(() => getStorageItem("kensei_frame_gen", "false") === "true");

  // Check for shared build in URL parameters on mount
  useEffect(() => {
    const sharedState = decodeBuildFromUrl(cpus, gpus, ramProfiles, games);
    if (sharedState) {
      if (sharedState.cpu) setSelectedCpu(sharedState.cpu);
      if (sharedState.gpu) setSelectedGpu(sharedState.gpu);
      if (sharedState.ram) setSelectedRam(sharedState.ram);
      setRamCapacityGB(sharedState.ramCap);
      setSelectedStorage(sharedState.storage);
      if (sharedState.game) setSelectedGame(sharedState.game);
      setSelectedResolution(sharedState.resolution);
      setSelectedPreset(sharedState.preset);
      setSelectedDlss(sharedState.dlss);
      setRayTracing(sharedState.rayTracing);
      setFrameGen(sharedState.frameGen);
      setCurrentStep(3);
      setActivePage("simulator");

      const cpuLabel = sharedState.cpu ? sharedState.cpu.name : "Custom CPU";
      const gpuLabel = sharedState.gpu ? sharedState.gpu.name : "Custom GPU";
      showToast("Shared Configuration Loaded!", `${cpuLabel} + ${gpuLabel}`);
    }
  }, []);

  // Auto-Save Configuration State to localStorage
  useEffect(() => {
    try {
      if (selectedCpu) localStorage.setItem("kensei_cpu_id", selectedCpu.id);
      else localStorage.removeItem("kensei_cpu_id");

      if (selectedGpu) localStorage.setItem("kensei_gpu_id", selectedGpu.id);
      else localStorage.removeItem("kensei_gpu_id");

      if (selectedRam) localStorage.setItem("kensei_ram_id", selectedRam.id);
      else localStorage.removeItem("kensei_ram_id");

      localStorage.setItem("kensei_ram_capacity", ramCapacityGB.toString());
      localStorage.setItem("kensei_storage", selectedStorage);
      localStorage.setItem("kensei_ram_channel", ramChannel);

      if (selectedGame) localStorage.setItem("kensei_game_id", selectedGame.id);
      localStorage.setItem("kensei_resolution", selectedResolution);
      localStorage.setItem("kensei_preset", selectedPreset);
      localStorage.setItem("kensei_dlss", selectedDlss);
      localStorage.setItem("kensei_ray_tracing", rayTracing);
      localStorage.setItem("kensei_frame_gen", frameGen.toString());

      localStorage.setItem("kensei_current_step", currentStep.toString());
      localStorage.setItem("kensei_active_page", activePage);
      localStorage.setItem("kensei_dark_mode", darkMode.toString());
    } catch {
      // Ignore storage write errors
    }
  }, [
    selectedCpu,
    selectedGpu,
    selectedRam,
    ramCapacityGB,
    selectedStorage,
    ramChannel,
    selectedGame,
    selectedResolution,
    selectedPreset,
    selectedDlss,
    rayTracing,
    frameGen,
    currentStep,
    activePage,
    darkMode
  ]);

  // Reset Build Action
  const handleResetBuild = () => {
    setSelectedCpu(null);
    setSelectedGpu(null);
    setSelectedRam(null);
    setRamCapacityGB(32);
    setSelectedStorage("NVMe Gen3");
    setRamChannel("Dual");
    setCurrentStep(1);

    try {
      localStorage.removeItem("kensei_cpu_id");
      localStorage.removeItem("kensei_gpu_id");
      localStorage.removeItem("kensei_ram_id");
      localStorage.setItem("kensei_ram_capacity", "32");
      localStorage.setItem("kensei_storage", "NVMe Gen3");
      localStorage.setItem("kensei_ram_channel", "Dual");
      localStorage.setItem("kensei_current_step", "1");
    } catch {
      // Ignore storage errors
    }
  };

  // Catalog Selection Action
  const handleSelectCatalogBuild = (
    cpu: CPU,
    gpu: GPU,
    ram: RAMProfile,
    ramCap: number,
    game: Game,
    targetResolution?: "1080p" | "1440p" | "4K"
  ) => {
    setSelectedCpu(cpu);
    setSelectedGpu(gpu);
    setSelectedRam(ram);
    setRamCapacityGB(ramCap);
    setSelectedGame(game);
    if (targetResolution) {
      setSelectedResolution(targetResolution);
    }
    setCurrentStep(3);
    setActivePage("simulator");
  };

  // Computed Telemetry
  const performanceResult = useMemo(() => {
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

  // Computed Compatibility & Power Diagnostics
  const compatibilityReport = useMemo(() => {
    return getCompatibilityReport(
      selectedCpu,
      selectedGpu,
      selectedRam,
      selectedStorage
    );
  }, [selectedCpu, selectedGpu, selectedRam, selectedStorage]);

  const handleShareBuild = () => {
    const url = encodeBuildToUrl(
      selectedCpu,
      selectedGpu,
      selectedRam,
      ramCapacityGB,
      selectedStorage,
      selectedGame,
      selectedResolution,
      selectedPreset,
      selectedDlss,
      rayTracing,
      frameGen
    );

    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
    }
    const cpuName = selectedCpu ? selectedCpu.name : "System";
    const gpuName = selectedGpu ? selectedGpu.name : "Build";
    showToast("Build Link Copied to Clipboard! 🔗", `${cpuName} + ${gpuName}`);
    return url;
  };

  const value = {
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
    showToast,
    isBuyModalOpen,
    setIsBuyModalOpen,
    isLegalModalOpen,
    setIsLegalModalOpen,
    legalModalTab,
    setLegalModalTab,
    handleOpenLegalModal,
    performanceResult,
    compatibilityReport,
    handleResetBuild,
    handleShareBuild,
    handleSelectCatalogBuild
  };

  return <HardwareContext.Provider value={value}>{children}</HardwareContext.Provider>;
}

export function useHardware() {
  const context = useContext(HardwareContext);
  if (!context) {
    throw new Error("useHardware must be used within a HardwareProvider");
  }
  return context;
}
