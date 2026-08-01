import { useState } from "react";
import { Sun, Moon, RotateCcw, Info, Sparkles, X, ShieldCheck, Cpu, Zap, Activity, ShoppingCart, Layers, LayoutGrid, Scale, Trophy } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "../context/LanguageContext";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onReset: () => void;
  activePage: "simulator" | "catalog" | "compare" | "rankings" | "cpu-detail" | "gpu-detail";
  setActivePage: (page: "simulator" | "catalog" | "compare" | "rankings" | "cpu-detail" | "gpu-detail") => void;
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
  const { t } = useLanguage();

  return (
    <div className="w-full mx-auto flex flex-col gap-6">
      {/* 1. STICKY TOP PROMINENT HEADER NAVBAR */}
      <header className="sticky top-3 z-40 w-full bg-white/95 dark:bg-[#1A1C1E]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-3 sm:p-3.5 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-300">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActivePage("simulator")}>
          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-md shrink-0 bg-[#1E2022] hover:scale-105 transition duration-200">
            <img
              src="./kensei_logo.png"
              alt="KENSEI SPEC CORPORATE LOGO"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-[#1E2022] dark:text-white flex items-center gap-2">
              KENSEI SPEC
              <span className="text-[10px] text-white bg-[#E88D9F] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                剣圣スペック
              </span>
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-extrabold hidden sm:block">
              Hardware Physics & Telemetry Simulator
            </p>
          </div>
        </div>

        {/* Center: PROMINENT PRIMARY SITE NAVIGATION TABS */}
        <div className="flex items-center gap-1 sm:gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-black/10 dark:border-white/10 shadow-inner max-w-full overflow-x-auto no-scrollbar whitespace-nowrap justify-start sm:justify-center flex-1 min-w-0">
          
          {/* TAB 1: SIMULATOR */}
          <button
            onClick={() => setActivePage("simulator")}
            className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all duration-200 shrink-0 whitespace-nowrap ${
              activePage === "simulator"
                ? "bg-cyan-600 dark:bg-cyan-500 text-white shadow-md shadow-cyan-500/25 scale-102"
                : "text-gray-600 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Layers className={`w-4 h-4 ${activePage === "simulator" ? "text-white" : "text-cyan-500"}`} />
            <span>{t("nav.simulator")}</span>
          </button>

          {/* TAB 2: GAME BUILDS CATALOG */}
          <button
            onClick={() => setActivePage("catalog")}
            className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all duration-200 shrink-0 whitespace-nowrap ${
              activePage === "catalog"
                ? "bg-[#8A9A86] text-white shadow-md shadow-[#8A9A86]/25 scale-102"
                : "text-gray-600 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <LayoutGrid className={`w-4 h-4 ${activePage === "catalog" ? "text-white" : "text-[#8A9A86]"}`} />
            <span>{t("nav.catalog")}</span>
          </button>

          {/* TAB 3: HARDWARE COMPARE */}
          <button
            onClick={() => setActivePage("compare")}
            className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all duration-200 shrink-0 whitespace-nowrap ${
              activePage === "compare"
                ? "bg-[#E88D9F] text-white shadow-md shadow-[#E88D9F]/25 scale-102"
                : "text-gray-600 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Scale className={`w-4 h-4 ${activePage === "compare" ? "text-white" : "text-[#E88D9F]"}`} />
            <span>{t("nav.compare")}</span>
          </button>

          {/* TAB 4: GLOBAL RANKINGS */}
          <button
            onClick={() => setActivePage("rankings")}
            className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all duration-200 shrink-0 whitespace-nowrap ${
              activePage === "rankings"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-102"
                : "text-gray-600 dark:text-gray-300 hover:text-[#1E2022] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Trophy className={`w-4 h-4 ${activePage === "rankings" ? "text-white" : "text-amber-500"}`} />
            <span>{t("nav.rankings")}</span>
          </button>

          {/* TAB 5: PC CONFIGURATOR STORE */}
          <button
            onClick={onOpenBuyModal}
            className="px-3 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 shadow-md shadow-emerald-600/25 flex items-center gap-1.5 shrink-0 hover:scale-102 border border-emerald-400/30 whitespace-nowrap"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            <span>{t("nav.store")}</span>
          </button>
        </div>

        {/* Right: Quick Action Controls & Language Selector */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Selector Dropdown */}
          <LanguageSelector />

          {/* About Modal */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="px-3.5 py-2 text-xs font-black bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#1E2022] dark:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition flex items-center gap-1.5"
            title={t("header.about")}
          >
            <Info className="w-4 h-4 text-[#E88D9F]" />
            <span className="hidden sm:inline">{t("header.about")}</span>
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
            className="px-3 py-2 text-xs font-black bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition flex items-center gap-1.5"
            title={t("header.reset")}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{t("header.reset")}</span>
          </button>
        </div>
      </header>

      {/* 2. DYNAMIC LOOPING VIDEO HERO BANNER (Smooth Seamless Crossfade Stack with Premium Hover Motion) */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 group bg-black/90 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 dark:hover:border-cyan-400/40 cursor-pointer">
        {(["simulator", "catalog", "compare", "rankings"] as const).map((page) => {
          const videoSrc =
            page === "rankings"
              ? "./gif_banner_rankings.mp4"
              : page === "compare"
              ? "./gif_banner_vs.mp4"
              : page === "catalog"
              ? "./gif_banner_catalog.mp4"
              : "./gif_banner_calculator.mp4";
          const isActive = activePage === page;

          return (
            <video
              key={page}
              autoPlay
              loop
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover brightness-95 dark:brightness-80 group-hover:scale-105 group-hover:brightness-105 transition-all duration-700 ease-out pointer-events-none ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          );
        })}

        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/90 via-black/60 to-transparent group-hover:from-black/95 group-hover:via-black/65 transition-all duration-500 flex flex-col justify-end p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-[#E88D9F] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest shadow-xs group-hover:scale-105 transition-transform duration-300">
              {activePage === "rankings" ? t("hero.rankings.badge1") : activePage === "compare" ? t("hero.compare.badge1") : activePage === "catalog" ? t("hero.catalog.badge1") : t("hero.simulator.badge1")}
            </span>
            <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 group-hover:scale-105 transition-transform duration-300">
              {activePage === "rankings" ? t("hero.rankings.badge2") : activePage === "compare" ? t("hero.compare.badge2") : activePage === "catalog" ? t("hero.catalog.badge2") : t("hero.simulator.badge2")}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none drop-shadow-lg flex items-center gap-3 group-hover:translate-x-1.5 transition-transform duration-500 ease-out">
            {activePage === "rankings"
              ? t("hero.rankings.title")
              : activePage === "compare"
              ? t("hero.compare.title")
              : activePage === "catalog"
              ? t("hero.catalog.title")
              : t("hero.simulator.title")}
          </h1>

          <p className="text-xs sm:text-sm text-gray-200 font-extrabold mt-2 max-w-xl leading-relaxed drop-shadow group-hover:translate-x-1.5 transition-transform duration-500 ease-out delay-75">
            {activePage === "rankings"
              ? t("hero.rankings.desc")
              : activePage === "compare"
              ? t("hero.compare.desc")
              : activePage === "catalog"
              ? t("hero.catalog.desc")
              : t("hero.simulator.desc")}
          </p>
        </div>
      </div>

      {/* BRAND STORY & ALGORITHM MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 text-[#1E2022] dark:text-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-black/10 dark:border-white/10 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src="./kensei_logo.jpg"
                    alt="KENSEI LOGO"
                    className="w-12 h-12 rounded-2xl object-cover border border-black/10 dark:border-white/10 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#1A1C1E] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black tracking-tight text-[#1E2022] dark:text-white">
                      KENSEI SPEC <span className="text-xs font-bold text-[#E88D9F] ml-1">(剣聖スペック)</span>
                    </h3>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E88D9F]/15 text-[#E88D9F] border border-[#E88D9F]/30">
                      v2.6 Telemetry
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
                    {t("about.subtitle")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/15 active:scale-95 transition-all text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-5 text-xs font-extrabold leading-relaxed text-gray-700 dark:text-gray-300">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#E88D9F]/15 via-[#E88D9F]/5 to-transparent border border-[#E88D9F]/30 flex items-center gap-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#E88D9F]/20 text-[#E88D9F] flex items-center justify-center shrink-0 border border-[#E88D9F]/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-xs text-[#1E2022] dark:text-white font-black leading-snug">
                  {t("about.banner")}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-400 flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-[#8A9A86]" /> {t("about.specs_title")}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <li className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:border-[#E88D9F]/30 hover:bg-[#E88D9F]/5 transition-all duration-200 flex flex-col gap-1.5 group">
                    <span className="font-black text-[#1E2022] dark:text-white flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      {t("about.3d_vcache.title")}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold leading-normal pl-8">
                      {t("about.3d_vcache.desc")}
                    </span>
                  </li>

                  <li className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:border-[#E88D9F]/30 hover:bg-[#E88D9F]/5 transition-all duration-200 flex flex-col gap-1.5 group">
                    <span className="font-black text-[#1E2022] dark:text-white flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/30">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      {t("about.vram_thrashing.title")}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold leading-normal pl-8">
                      {t("about.vram_thrashing.desc")}
                    </span>
                  </li>

                  <li className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:border-[#E88D9F]/30 hover:bg-[#E88D9F]/5 transition-all duration-200 flex flex-col gap-1.5 group">
                    <span className="font-black text-[#1E2022] dark:text-white flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      {t("about.dual_channel.title")}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold leading-normal pl-8">
                      {t("about.dual_channel.desc")}
                    </span>
                  </li>

                  <li className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:border-[#E88D9F]/30 hover:bg-[#E88D9F]/5 transition-all duration-200 flex flex-col gap-1.5 group">
                    <span className="font-black text-[#1E2022] dark:text-white flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/30">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      {t("about.upgrade_advisor.title")}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold leading-normal pl-8">
                      {t("about.upgrade_advisor.desc")}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-black/10 dark:border-white/10 pt-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <span className="text-[10px] text-gray-400 dark:text-gray-400 font-extrabold uppercase tracking-wider">
                {t("about.footer_tag")}
              </span>
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] font-black text-xs hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{t("common.close")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
