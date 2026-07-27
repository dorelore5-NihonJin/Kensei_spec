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
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="bg-[#E88D9F]/20 backdrop-blur-md self-start text-[10px] sm:text-xs font-black text-white border border-[#E88D9F]/40 px-3 py-1 rounded-full uppercase tracking-widest mb-2 sm:mb-3 shadow-sm">
            Neo-Tokyo Performance Diagnostic
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none drop-shadow-md">
            KENSEI SPEC <span className="text-xs sm:text-sm font-bold bg-[#8A9A86] text-white px-2.5 py-0.5 rounded-full ml-2">PC構成シミュレーター</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/90 font-semibold mt-2 max-w-md drop-shadow">
            World-class ultra-polished hardware benchmark & gaming performance estimator.
          </p>
        </div>
      </div>

      <header className="max-w-7xl mx-auto py-4 mb-6 border-b border-black/[0.08] dark:border-white/[0.08] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E88D9F] text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md shadow-[#E88D9F]/30">
            剣
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-[#1E2022] dark:text-white flex items-center gap-2">
              KENSEI SPEC <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded">v2.6 Engine</span>
            </h2>
            <p className="text-xs text-[#1E2022]/70 dark:text-gray-300 font-semibold">Japanese Soft Minimal PC Hardware Estimator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Light / Dark mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1C1E] text-[#1E2022] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition duration-200 shadow-sm"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-xs font-extrabold bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 text-[#1E2022] dark:text-white hover:text-red-500 dark:hover:text-red-400 rounded-xl transition duration-200 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Build / 構成クリア
          </button>
        </div>
      </header>
    </div>
  );
}
