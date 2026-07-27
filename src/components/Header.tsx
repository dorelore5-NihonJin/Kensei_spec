import { Sun, Moon, RotateCcw } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onReset: () => void;
}

export default function Header({ darkMode, setDarkMode, onReset }: HeaderProps) {
  return (
    <div className="w-full">
      {/* 3D Cyberpunk Minimalist Hero Banner */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-3xl overflow-hidden mb-6 shadow-xl border border-black/5 dark:border-white/5">
        <img
          src="/kensei_hero_banner.jpg"
          alt="KENSEI SPEC HERO BANNER"
          className="w-full h-full object-cover brightness-95 dark:brightness-75 transition-all duration-300"
          onError={(e) => {
            // fallback if image not present on disk
            e.currentTarget.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&auto=format&fit=crop&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="bg-sakura-pink/15 backdrop-blur-sm self-start text-[10px] sm:text-xs font-bold text-sakura-pink border border-sakura-pink/30 px-3 py-1 rounded-full uppercase tracking-widest mb-2 sm:mb-3">
            Neo-Tokyo Performance Diagnostic
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none drop-shadow-md">
            KENSEI SPEC <span className="text-xs sm:text-sm font-semibold bg-matcha-sage text-white px-2.5 py-0.5 rounded-full ml-2">PC構成シミュレーター</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/70 font-medium mt-1.5 max-w-md drop-shadow">
            World-class ultra-polished hardware benchmark & gaming performance estimator.
          </p>
        </div>
      </div>

      <header className="max-w-7xl mx-auto py-4 mb-6 border-b border-black/[0.04] dark:border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sakura-pink text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md shadow-sakura-pink/20">
            剣
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-dark-accent dark:text-white flex items-center gap-2">
              KENSEI SPEC <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal uppercase tracking-wider">v2.6 Engine</span>
            </h2>
            <p className="text-[11px] text-[#1E2022]/60 dark:text-white/60 font-medium">Japanese Soft Minimal PC Hardware Estimator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Light / Dark mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#1A1C1E] text-dark-accent dark:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition duration-200 shadow-sm"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white dark:bg-[#1A1C1E] border border-black/[0.06] dark:border-white/[0.06] text-[#1E2022]/70 dark:text-white/70 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition duration-200 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Build / 構成クリア
          </button>
        </div>
      </header>
    </div>
  );
}
