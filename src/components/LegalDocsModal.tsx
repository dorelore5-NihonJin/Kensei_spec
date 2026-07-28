import { useState } from "react";
import { X, ShieldCheck, FileText, Activity, DollarSign, CheckCircle2, Lock, Scale, AlertTriangle } from "lucide-react";

interface LegalDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "terms" | "privacy" | "disclaimer" | "affiliate";
}

export default function LegalDocsModal({ isOpen, onClose, initialTab = "terms" }: LegalDocsModalProps) {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "disclaimer" | "affiliate">(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1E2022] dark:text-white">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E2022] text-white flex items-center justify-center font-black shadow-md border border-white/10 shrink-0">
              <Scale className="w-5 h-5 text-[#E88D9F]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                KENSEI SPEC Legal & Governance / 法的文書・ガバナンス
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold">
                Official Terms, Privacy, Telemetry Disclaimer & Commercial Disclosures
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation Bar */}
        <div className="flex border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-2 gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("terms")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition shrink-0 ${
              activeTab === "terms"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <FileText className="w-4 h-4 text-[#E88D9F]" />
            <span>1. Terms of Service / 利用規約</span>
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition shrink-0 ${
              activeTab === "privacy"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>2. Privacy Policy / プライバシー</span>
          </button>

          <button
            onClick={() => setActiveTab("disclaimer")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition shrink-0 ${
              activeTab === "disclaimer"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>3. Telemetry Disclaimer / ベンチマーク免責事項</span>
          </button>

          <button
            onClick={() => setActiveTab("affiliate")}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition shrink-0 ${
              activeTab === "affiliate"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>4. Commercial & Affiliate / 商業開示</span>
          </button>
        </div>

        {/* Scrollable Content View */}
        <div className="p-6 overflow-y-auto max-h-[60vh] text-xs font-extrabold leading-relaxed text-gray-700 dark:text-gray-300 flex flex-col gap-5">
          
          {/* TAB 1: TERMS OF SERVICE */}
          {activeTab === "terms" && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3 text-indigo-900 dark:text-indigo-200">
                <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">TERMS OF SERVICE AGREEMENT (2026 REVISION)</h4>
                  <p className="text-[11px] mt-0.5 font-bold">
                    By accessing or utilizing KENSEI SPEC (剣聖スペック), you agree to be bound by these Terms of Service.
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 mt-2">
                1. Intellectual Property Protection
              </h4>
              <p>
                All proprietary hardware physics mathematical formulas, 3D V-Cache latency scaling calculations, PCIe Gen 3/4/5 bandwidth bottleneck matrices, VRAM allocation thrashing algorithms, visual UI elements, brand assets, and logos are the sole intellectual property of <strong>KENSEI SPEC</strong>. Unauthorized reverse engineering, systematic scraping, or redistribution without prior written consent is strictly prohibited.
              </p>

              <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 mt-2">
                2. Permitted Use of Hardware Simulator & Catalog
              </h4>
              <p>
                KENSEI SPEC grants users a non-exclusive, non-transferable, revocable license to utilize the hardware simulator tool and 250 PC builds catalog for personal, educational, and commercial PC purchasing decisions.
              </p>

              <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 mt-2">
                3. Limitation of Liability
              </h4>
              <p>
                Under no circumstances shall KENSEI SPEC or its engineering team be held liable for any direct, indirect, incidental, or consequential damages resulting from user purchasing decisions, hardware assembly errors, component incompatibilities outside our verified socket matrix, or thermal degradation of third-party computer hardware.
              </p>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">DATA PRIVACY & ANONYMITY PROMISE</h4>
                  <p className="text-[11px] mt-0.5 font-bold">
                    KENSEI SPEC enforces strict zero-tracking user privacy principles under GDPR, CCPA, and Japanese APPI laws.
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 mt-2">
                1. Zero Personally Identifiable Information (PII) Collection
              </h4>
              <p>
                We do NOT collect, store, or sell your name, email address, IP address, payment card data, or physical address. All simulator choices (CPU, GPU, RAM, Storage, and Game selection) are evaluated entirely client-side within your browser.
              </p>

              <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 mt-2">
                2. Local Storage Persistence
              </h4>
              <p>
                KENSEI SPEC utilizes your browser's local storage (`localStorage`) solely to preserve user interface preferences (such as Light / Dark Mode toggles and active step positions) between sessions. No cross-site tracking cookies or third-party telemetry beacons are injected into your browsing experience.
              </p>

              <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 mt-2">
                3. Compliance & User Rights
              </h4>
              <p>
                You retain full right to clear your browser cache and local storage at any time to reset all saved site states.
              </p>
            </div>
          )}

          {/* TAB 3: TELEMETRY DISCLAIMER */}
          {activeTab === "disclaimer" && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">HARDWARE TELEMETRY & FPS BENCHMARK METHODOLOGY</h4>
                  <p className="text-[11px] mt-0.5 font-bold">
                    Understanding how KENSEI SPEC estimates framerates and workload bottleneck percentages.
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 mt-2">
                1. Sourcing Sourcing & CapFrameX Calibration
              </h4>
              <p>
                Our telemetry simulator models physics predictions using empirical log datasets sourced from <strong>CapFrameX</strong>, <strong>TechPowerUp</strong>, <strong>Tom's Hardware</strong>, and <strong>MSI Afterburner</strong> across 18 modern games.
              </p>

              <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 mt-2">
                2. Environmental & Operating System Variables
              </h4>
              <p>
                Actual gaming framerates may vary by ±3% to ±8% depending on your specific Windows / Linux OS background processes, GPU driver version (NVIDIA Game Ready / AMD Adrenalin), ambient room temperature, RAM sub-timings, motherboards VRM power limits, and CPU thermal throttling under sustained loads.
              </p>
            </div>
          )}

          {/* TAB 4: COMMERCIAL & AFFILIATE */}
          {activeTab === "affiliate" && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-900 dark:text-rose-200">
                <DollarSign className="w-5 h-5 text-[#E88D9F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">COMMERCIAL DISCLOSURE & AFFILIATE TRANSPARENCY</h4>
                  <p className="text-[11px] mt-0.5 font-bold">
                    Full disclosure regarding merchant referral links and purchasing options.
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 mt-2">
                1. Affiliate Referral Partnerships
              </h4>
              <p>
                When you click "Buy Build" or purchase individual hardware components via KENSEI SPEC, you may be redirected to verified retail partners (Amazon, Newegg, Rakuten, PC Koubou, Tsukumo). We may earn a small referral commission at no additional cost to you.
              </p>

              <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 mt-2">
                2. Unbiased Benchmark Integrity
              </h4>
              <p>
                Affiliate partnerships do NOT influence our simulator math, benchmark scoring, or bottleneck evaluations. All recommendations remain strictly governed by empirical silicon performance metrics.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <div className="text-gray-500 dark:text-gray-400 font-extrabold">
            © 2026 KENSEI SPEC (剣聖スペック). All rights reserved.
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] font-black hover:opacity-90 transition shadow-xs"
          >
            I Understand & Agree / 了解しました
          </button>
        </div>
      </div>
    </div>
  );
}
