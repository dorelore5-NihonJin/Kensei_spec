import { Cpu, Gamepad2, ShoppingCart, Zap, ShieldCheck } from "lucide-react";

interface FooterProps {
  setActivePage: (page: "simulator" | "catalog") => void;
  onOpenBuyModal: () => void;
  onResetBuild: () => void;
  onOpenLegalModal: (tab?: "terms" | "privacy" | "disclaimer" | "affiliate") => void;
}

export default function Footer({ setActivePage, onOpenBuyModal, onOpenLegalModal }: FooterProps) {
  return (
    <footer className="mt-24 border-t border-black/10 dark:border-white/10 bg-white/50 dark:bg-[#151719]/80 backdrop-blur-lg rounded-t-3xl pt-12 pb-8 px-6 sm:px-10 text-xs font-extrabold text-gray-600 dark:text-gray-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-md bg-[#1E2022] shrink-0">
              <img
                src="./kensei_logo.png"
                alt="KENSEI SPEC LOGO"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1E2022] dark:text-white flex items-center gap-2">
                KENSEI SPEC <span className="text-[10px] bg-[#E88D9F] text-white px-2 py-0.5 rounded font-black tracking-wider uppercase">剣聖スペック</span>
              </h3>
              <p className="text-[11px] text-gray-500 font-extrabold">Next-Gen Real-Time PC Hardware Telemetry & FPS Simulator</p>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 font-bold max-w-md">
            Built to deliver authentic hardware benchmark predictions. Features 3D V-Cache latency math, VRAM buffer thrashing penalties, and socket-matched PC build recommendations.
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="bg-[#8A9A86]/15 text-[#8A9A86] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A9A86] animate-ping" />
              Verified Telemetry v2.6
            </span>
            <button
              onClick={() => onOpenLegalModal("terms")}
              className="bg-[#E88D9F]/15 text-[#E88D9F] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 hover:bg-[#E88D9F]/25 transition"
            >
              <ShieldCheck className="w-3 h-3 text-[#E88D9F]" /> Legal & Terms
            </button>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#E88D9F]" /> Quick Navigation
          </h4>
          <ul className="flex flex-col gap-2 font-bold text-gray-500 dark:text-gray-400">
            <li>
              <button
                onClick={() => setActivePage("simulator")}
                className="hover:text-[#E88D9F] dark:hover:text-white transition flex items-center gap-1.5"
              >
                Hardware Simulator (3-Step Wizard)
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("catalog")}
                className="hover:text-[#E88D9F] dark:hover:text-white transition flex items-center gap-1.5"
              >
                Recommended Game Builds ($500-$3,500)
              </button>
            </li>
            <li>
              <button
                onClick={onOpenBuyModal}
                className="hover:text-[#E88D9F] dark:hover:text-white transition flex items-center gap-1.5"
              >
                PC Configurator Store & Checkout
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Hardware Benchmarked */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#8A9A86]" /> Featured Hardware
          </h4>
          <ul className="flex flex-col gap-1.5 text-[11px] font-extrabold text-gray-500 dark:text-gray-400">
            <li className="flex justify-between border-b border-black/5 dark:border-white/5 pb-1">
              <span>AMD Ryzen 7 9800X3D</span>
              <span className="font-mono text-[#E88D9F]">AM5</span>
            </li>
            <li className="flex justify-between border-b border-black/5 dark:border-white/5 pb-1">
              <span>NVIDIA RTX 4080 Super</span>
              <span className="font-mono text-[#E88D9F]">16GB VRAM</span>
            </li>
            <li className="flex justify-between border-b border-black/5 dark:border-white/5 pb-1">
              <span>Intel Core Ultra 5 245K</span>
              <span className="font-mono text-[#E88D9F]">LGA1851</span>
            </li>
            <li className="flex justify-between border-b border-black/5 dark:border-white/5 pb-1">
              <span>DDR5-6000 Low-Latency Kit</span>
              <span className="font-mono text-[#E88D9F]">32GB</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Top Games */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-[#E88D9F]" /> Supported Games
          </h4>
          <ul className="grid grid-cols-2 gap-1.5 text-[11px] font-extrabold text-gray-500 dark:text-gray-400">
            <li>• Cyberpunk 2077</li>
            <li>• CS2</li>
            <li>• GTA VI</li>
            <li>• Wukong</li>
            <li>• Valorant</li>
            <li>• Elden Ring</li>
            <li>• Fortnite</li>
            <li>• Apex Legends</li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto border-t border-black/10 dark:border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 font-extrabold flex-wrap">
        <div>
          © 2026 <strong>KENSEI SPEC (剣聖スペック)</strong>. All rights reserved.
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
          <button onClick={() => onOpenLegalModal("terms")} className="hover:text-[#E88D9F] transition">
            Terms of Service / 利用規約
          </button>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <button onClick={() => onOpenLegalModal("privacy")} className="hover:text-emerald-400 transition">
            Privacy Policy / プライバシー
          </button>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <button onClick={() => onOpenLegalModal("disclaimer")} className="hover:text-indigo-400 transition">
            Telemetry Disclaimer / 免責事項
          </button>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <button onClick={() => onOpenLegalModal("affiliate")} className="hover:text-amber-400 transition">
            Commercial & Affiliate / 商業開示
          </button>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <button onClick={onOpenBuyModal} className="text-[#E88D9F] hover:underline flex items-center gap-1">
            <ShoppingCart className="w-3 h-3" /> Buy Build
          </button>
        </div>
      </div>
    </footer>
  );
}
