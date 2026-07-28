import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { CPU, GPU, RAMProfile, Game, StorageType } from "../lib/types";

import cpuData from "../data/cpus.json";
import gpuData from "../data/gpus.json";
import ramData from "../data/ram.json";
import gameData from "../data/games.json";

import { calculatePerformance, getCompatibilityReport } from "../lib/calculator";

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
  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // App Page & Navigation State
  const [activePage, setActivePage] = useState<"simulator" | "catalog">("simulator");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [viewMode, setViewMode] = useState<"wizard" | "overview">("wizard");

  // Buy Store & Legal Modals State
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<"terms" | "privacy" | "disclaimer" | "affiliate">("terms");

  const handleOpenLegalModal = (tab: "terms" | "privacy" | "disclaimer" | "affiliate" = "terms") => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // Hardware Selection State
  const [selectedCpu, setSelectedCpu] = useState<CPU | null>(null);
  const [selectedGpu, setSelectedGpu] = useState<GPU | null>(null);
  const [selectedRam, setSelectedRam] = useState<RAMProfile | null>(null);
  const [ramCapacityGB, setRamCapacityGB] = useState<number>(32);
  const [selectedStorage, setSelectedStorage] = useState<StorageType>("NVMe Gen3");
  const [ramChannel, setRamChannel] = useState<"Single" | "Dual">("Dual");

  // Game & Graphics Options State
  const [selectedGame, setSelectedGame] = useState<Game>(games[2] || games[0]); // Default Cyberpunk 2077
  const [selectedResolution, setSelectedResolution] = useState<"1080p" | "1440p" | "4K">("1080p");
  const [selectedPreset, setSelectedPreset] = useState<"Low" | "Medium" | "High" | "Ultra">("High");
  const [selectedDlss, setSelectedDlss] = useState<"Off" | "Quality" | "Performance">("Off");
  const [rayTracing, setRayTracing] = useState<"Off" | "Medium" | "Ultra">("Off");
  const [frameGen, setFrameGen] = useState<boolean>(false);

  // Reset Build Action
  const handleResetBuild = () => {
    setSelectedCpu(null);
    setSelectedGpu(null);
    setSelectedRam(null);
    setRamCapacityGB(32);
    setSelectedStorage("NVMe Gen3");
    setRamChannel("Dual");
    setCurrentStep(1);
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
