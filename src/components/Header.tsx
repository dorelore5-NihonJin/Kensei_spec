import { useState } from "react";
import { Sun, Moon, RotateCcw, Info, Sparkles, X, ShieldCheck, Cpu, Zap, Activity, ShoppingCart, Layers, LayoutGrid } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onReset: () => void;
  activePage: "simulator" | "catalog";
  setActivePage: (page: "simulator" | "catalog") => void;
  onOpenBuyModal: () => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  onReset,
  activePage,
  setActivePage,
  onOpenBuyModal
}: HeaderProps) {
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. STICKY TOP PROMINENT HEADER NAVBAR */}
      <header className="sticky top-3 z-40 w-full bg-white/90 dark:bg-[#1A1C1E]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-3 sm:p-4 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4 transition-all duration-300">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage("simulator")}>
          <div className="w-11 h-11 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-md shrink-0 bg-[#1E2022]">
            <img
              src="./kensei_logo.jpg"
              alt="KENSEI SPEC LOGO"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-[#1E2022] dark:text-white flex items-center gap-2">
              KENSEI SPEC
              <span className="text-[10px] text-white bg-[#E88D9F] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                剣聖スペック
              </span>
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-extrabold hidden sm:block">
              Hardware Physics & Telemetry Simulator
            </p>
          </div>
        </div>

        {/* Center: PROMINENT PRIMARY SITE NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/10 dark:border-white/10 shadow-inner w-full lg:w-auto justify-center">
          
          {/* TAB 1: SIMULATOR */}
          <button
            onClick={() => setActivePage("simulator")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all duration-200 shrink-0 ${
              activePage === "simulator"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-md scale-102"
                : "text-gray-600 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Layers className="w-4 h-4 text-[#E88D9F]" />
            <span>⚙️ 1. Simulator & Calculator</span>
          </button>

          {/* TAB 2: GAME BUILDS CATALOG */}
          <button
            onClick={() => setActivePage("catalog")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all duration-200 shrink-0 ${
              activePage === "catalog"
                ? "bg-[#8A9A86] text-white shadow-md scale-102"
                : "text-gray-600 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-[#8A9A86]" />
            <span>📦 2. Game Builds Catalog</span>
          </button>

          {/* TAB 3: PC CONFIGURATOR STORE */}
          <button
            onClick={onOpenBuyModal}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-[#E88D9F] text-white hover:bg-[#E88D9F]/90 transition shadow-md flex items-center gap-1.5 shrink-0 hover:scale-102"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>🛒 3. Buy PC Store</span>
          </button>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* About Modal */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="p-2.5 sm:px-3.5 sm:py-2 text-xs font-black bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#1E2022] dark:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition flex items-center gap-1.5"
            title="About Engine"
          >
            <Info className="w-4 h-4 text-[#E88D9F]" />
            <span className="hidden sm:inline">About</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[#1E2022] dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition"
            aria-label="Toggle Dark Mode"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Reset Build */}
          <button
            onClick={onReset}
            className="p-2.5 sm:px-3 sm:py-2 text-xs font-black bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition flex items-center gap-1.5"
            title="Reset All Selections"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* 2. HERO SHOWCASE BANNER */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 group">
        <img
          src="./kensei_hero_banner.jpg"
          alt="KENSEI SPEC HERO BANNER"
          className="w-full h-full object-cover brightness-95 dark:brightness-75 group-hover:scale-102 transition-all duration-700 ease-out"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-[#E88D9F] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
              Neo-Tokyo Engine v2.6
            </span>
            <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Real-Time Physics Simulator
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none drop-shadow-lg flex items-center gap-3">
            KENSEI SPEC HARDWARE SIMULATOR
          </h1>

          <p className="text-xs sm:text-sm text-gray-200 font-extrabold mt-2 max-w-xl leading-relaxed drop-shadow">
            Precision silicon telemetry, 3D V-Cache scaling, and VRAM thrashing benchmark estimator designed with Soft Japanese Minimalism.
          </p>
        </div>
      </div>

      {/* BRAND STORY & ALGORITHM MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 text-[#1E2022] dark:text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="./kensei_logo.jpg"
                  alt="KENSEI LOGO"
                  className="w-12 h-12 rounded-2xl object-cover border border-black/10 dark:border-white/10 shadow-sm"
                />
                <div>
                  <h3 className="text-xl font-black flex items-center gap-2">
                    KENSEI SPEC (剣聖スペック)
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold">
                    Precision Hardware Physics & Neo-Tokyo Telemetry Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-4 text-xs font-extrabold leading-relaxed text-gray-700 dark:text-gray-300">
              <div className="p-4 rounded-2xl bg-[#E88D9F]/10 border border-[#E88D9F]/20 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#E88D9F] shrink-0" />
                <div className="text-xs text-[#1E2022] dark:text-white font-black">
                  Built to eliminate fake online FPS calculators by running real-time silicon architecture equations!
                </div>
              </div>

              <h4 className="text-sm font-black text-[#1E2022] dark:text-white flex items-center gap-2 mt-2">
                <Cpu className="w-4 h-4 text-[#8A9A86]" /> Physics & Calculation Engine Specs
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <li className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 flex flex-col gap-1">
                  <span className="font-black text-[#1E2022] dark:text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> 3D V-Cache Scaling
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Accounts for AMD 3D V-Cache L3 latency reductions in CPU-bound games.
                  </span>
                </li>

                <li className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 flex flex-col gap-1">
                  <span className="font-black text-[#1E2022] dark:text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-500" /> VRAM Thrashing Penalty
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Simulates 35% framerate drops when VRAM capacity is exceeded at 4K & Ultra textures.
                  </span>
                </li>

                <li className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 flex flex-col gap-1">
                  <span className="font-black text-[#1E2022] dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Dual-Channel Memory Math
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Applies single-channel RAM bandwidth bottleneck penalties on 1% low framerates.
                  </span>
                </li>

                <li className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 flex flex-col gap-1">
                  <span className="font-black text-[#1E2022] dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Smart Upgrade Advisor
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Dynamically scans hardware catalogs to suggest single-part upgrades unlocking +30% FPS.
                  </span>
                </li>
              </ul>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-black/10 dark:border-white/10 pt-4 flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                KENSEI SPEC • Japanese Soft Minimalist Tech
              </span>
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] font-black text-xs hover:opacity-90 transition shadow-sm"
              >
                Close / 閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
