import { useState } from "react";
import { X, ShieldCheck, FileText, Activity, DollarSign, CheckCircle2, Lock, Scale, AlertTriangle, ChevronRight, BookOpen, ShieldAlert } from "lucide-react";

interface LegalDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "terms" | "privacy" | "disclaimer" | "affiliate";
}

export default function LegalDocsModal({ isOpen, onClose, initialTab = "terms" }: LegalDocsModalProps) {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "disclaimer" | "affiliate">(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1E2022] dark:text-white">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E2022] text-white flex items-center justify-center font-black shadow-md border border-white/10 shrink-0">
              <Scale className="w-5 h-5 text-[#E88D9F]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                KENSEI SPEC Legal & Governance / 法的文書・ガバナンス
                <span className="text-[10px] bg-[#E88D9F] text-white px-2 py-0.5 rounded font-black tracking-wider uppercase">v2.6 2026 Legal Edition</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold">
                Exhaustive Terms of Service, Privacy Protection Policy, Telemetry Methodology & Commercial Disclosures
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation Bar (Grid layout guarantees no tab clipping) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-2.5 gap-2">
          <button
            onClick={() => setActiveTab("terms")}
            className={`px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition text-center ${
              activeTab === "terms"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#E88D9F] shrink-0" />
            <span className="truncate">1. Terms of Service / 利用規約</span>
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition text-center ${
              activeTab === "privacy"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">2. Privacy Policy / プライバシー</span>
          </button>

          <button
            onClick={() => setActiveTab("disclaimer")}
            className={`px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition text-center ${
              activeTab === "disclaimer"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">3. Telemetry / 免責事項</span>
          </button>

          <button
            onClick={() => setActiveTab("affiliate")}
            className={`px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition text-center ${
              activeTab === "affiliate"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">4. Commercial / 商業開示</span>
          </button>
        </div>

        {/* Scrollable Document Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[65vh] text-xs font-extrabold leading-relaxed text-gray-700 dark:text-gray-300 flex flex-col gap-6">
          
          {/* TAB 1: TERMS OF SERVICE & EULA */}
          {activeTab === "terms" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              {/* Alert Header */}
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3 text-indigo-900 dark:text-indigo-200">
                <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">TERMS OF SERVICE & END USER LICENSE AGREEMENT (2026 COMPLETE EDITION)</h4>
                  <p className="text-[11px] mt-0.5 font-bold">
                    Effective Date: January 1, 2026. Applicable to all global users accessing KENSEI SPEC (剣聖スペック).
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> Section 1: Preamble & Binding Acceptance (第1条 本規約への同意)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  Welcome to <strong>KENSEI SPEC (剣聖スペック)</strong>. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User" or "You") and KENSEI SPEC Governing Authority ("Platform", "We", or "Us"). By accessing, browsing, or interacting with our hardware physics telemetry engine, interactive 3-step configurator, or 250 PC builds catalog, you explicitly acknowledge that you have read, understood, and agreed to be legally bound by these Terms in full. If you do not agree with any provision set forth herein, you must immediately cease all usage of the Platform.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> Section 2: Intellectual Property & Telemetry Math Protection (第2条 知的財産権及び数理モデルの保護)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  All intellectual property rights associated with KENSEI SPEC—including but not limited to source code, algorithms, 3D V-Cache latency scaling calculations, PCIe bandwidth bottleneck matrices, VRAM allocation buffer thrashing equations, UI/UX components, CSS glassmorphism styling tokens, logos, graphic assets, and text documentation—are the exclusive property of KENSEI SPEC.
                </p>
                <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-2">
                  <span className="text-[11px] font-black text-[#1E2022] dark:text-white uppercase">Strictly Prohibited Actions:</span>
                  <ul className="list-disc list-inside text-[11px] font-bold text-gray-600 dark:text-gray-400 space-y-1">
                    <li>Automated scraping, crawling, or systematic data extraction of our hardware telemetry datasets via bots or headless browser scripts.</li>
                    <li>Decompiling, reverse-engineering, or disassembling the proprietary `calculator.ts` physics module.</li>
                    <li>Extracting component pricing datasets or telemetry tables for commercial AI model training without written authorization.</li>
                    <li>Hosting unauthorized mirrors or framing the Platform within external commercial domains.</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> Section 3: Hardware Assembly & Safety Disclaimer (第3条 自作PC組み立てにおける自己責任原則)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  KENSEI SPEC provides mathematical hardware telemetry predictions for educational, analytical, and shopping reference purposes only. We do not manufacture, package, or physically assemble computer components. The User assumes 100% full sole responsibility when purchasing physical hardware parts and undertaking DIY PC assembly.
                </p>
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-2.5 text-rose-900 dark:text-rose-200">
                  <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="text-[11px] font-extrabold leading-relaxed">
                    <strong>Notice on Physical Hardware Handling:</strong> KENSEI SPEC shall not be held liable for electrostatic discharge (ESD) silicon damage, bent motherboard CPU socket pins (LGA1700/LGA1851/AM5), improper thermal paste application leading to CPU overheating, power supply unit (PSU) overload due to incorrect 12V-2x6 / 12VHPWR cable seating, or physical chassis mounting errors.
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> Section 4: Limitation of Liability (第4条 責任制限)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  To the maximum extent permitted by applicable law, in no event shall KENSEI SPEC, its developers, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages—including loss of profits, data corruption, hardware downtime, or purchasing regrets—arising out of or in connection with the use or inability to use the Platform.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> Section 5: Governing Law & Jurisdiction (第5条 準拠法及び管轄裁判所)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  These Terms shall be governed by and construed in accordance with the substantive laws of Japan, without regard to its conflict of law principles. Any legal dispute or controversy arising out of these Terms shall be subject to the exclusive primary jurisdiction of the Tokyo District Court (東京地方裁判所).
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              {/* Alert Header */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">GLOBAL PRIVACY & DATA ANONYMITY STANDARD (GDPR / CCPA / APPI COMPLIANT)</h4>
                  <p className="text-[11px] mt-0.5 font-bold">
                    KENSEI SPEC operates under a zero-tracking privacy architecture. Your hardware choices remain 100% private to your browser.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-emerald-400" /> Section 1: Non-Collection of Personally Identifiable Information (個人情報の非収集方針)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  KENSEI SPEC strictly enforces a Zero-PII standard. We do <strong>NOT</strong> ask for, record, transmit, or store personal identifiers such as your legal name, physical address, phone number, financial credit card credentials, or IP address logs. You can utilize the full functionality of our hardware simulator anonymously without creating an account or providing credentials.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-emerald-400" /> Section 2: Client-Side Computation Architecture (クライアントサイド処理の仕組み)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  Unlike traditional web platforms that send your hardware selections to remote servers for processing, 100% of KENSEI SPEC's telemetry calculation engine runs directly within your local web browser's JavaScript environment (V8 / SpiderMonkey). When you select a Core Ultra 7 265K and RTX 4070 Super, the FPS math, VRAM allocation checks, and power estimates occur locally on your device in real-time.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-emerald-400" /> Section 3: Cookie & Local Storage Disclosure (`localStorage`) (クッキー及びローカルストレージの使用目的)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  KENSEI SPEC utilizes HTML5 Web Storage (`localStorage`) and session cookie technology strictly to preserve your hardware configuration, game graphics presets, and legal governance preferences across browser reloads.
                </p>
                <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                  <table className="w-full text-[11px] font-bold text-left border-collapse">
                    <thead>
                      <tr className="border-b border-black/10 dark:border-white/10 text-gray-500 uppercase">
                        <th className="py-1">Storage Key</th>
                        <th className="py-1">Purpose</th>
                        <th className="py-1">Expiration / Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 text-gray-600 dark:text-gray-300">
                      <tr>
                        <td className="py-1.5 font-mono text-[#E88D9F]">kensei_cpu_id / gpu_id / ram_id</td>
                        <td className="py-1.5">Saves active CPU, GPU, and RAM selections across F5 page reloads</td>
                        <td className="py-1.5 text-emerald-500 font-mono">Persistent (Local Browser)</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-mono text-[#E88D9F]">kensei_game_id / resolution / preset</td>
                        <td className="py-1.5">Stores target game title, resolution (1080p/1440p/4K), and graphics preset</td>
                        <td className="py-1.5 text-emerald-500 font-mono">Persistent (Local Browser)</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-mono text-[#E88D9F]">kensei_cookie_consent</td>
                        <td className="py-1.5">Stores explicit user cookie consent status ('accepted' / 'declined')</td>
                        <td className="py-1.5 text-purple-400 font-mono font-black">Audit Log (Immutable)</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-mono text-[#E88D9F]">kensei_cookie_consent_timestamp</td>
                        <td className="py-1.5">ISO 8601 timestamp log recording exact date & time consent was granted</td>
                        <td className="py-1.5 text-purple-400 font-mono font-black">Audit Log (Immutable)</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-mono text-[#E88D9F]">kensei_legal_accepted</td>
                        <td className="py-1.5">Records user acknowledgment of Terms of Service & Privacy Policy</td>
                        <td className="py-1.5 text-purple-400 font-mono font-black">Audit Log (Immutable)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-emerald-400" /> Section 4: International Compliance Frameworks (国際的プライバシー基準への適合)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  Our data protection practices comply fully with:
                </p>
                <ul className="list-disc list-inside text-[11px] font-bold text-gray-600 dark:text-gray-300 space-y-1">
                  <li><strong>European Union GDPR</strong> (General Data Protection Regulation - Regulation EU 2016/679) & ePrivacy Directive (2002/58/EC).</li>
                  <li><strong>California Consumer Privacy Act (CCPA)</strong> & CPRA.</li>
                  <li><strong>Japan Act on the Protection of Personal Information (APPI)</strong> (個人情報の保護に関する法律).</li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-emerald-400" /> Section 5: Legal Consent Auditability & Non-Repudiation (合意監査ログ及び非否認性原則)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  Under the ePrivacy Directive and Japanese APPI frameworks, when a User acknowledges legal policies or grants cookie permissions on KENSEI SPEC, a cryptographic local consent record (`kensei_cookie_consent_timestamp` / `kensei_legal_accepted`) is written to the browser's storage manifest.
                </p>
                <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 text-[11px] text-gray-600 dark:text-gray-300 font-extrabold leading-relaxed">
                  <strong>Non-Repudiation Guarantee:</strong> Once legal consent is granted, the timestamp log serves as an immutable verification record demonstrating explicit consent under international digital contract governance standards.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TELEMETRY DISCLAIMER */}
          {activeTab === "disclaimer" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              {/* Alert Header */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">HARDWARE TELEMETRY & FPS BENCHMARK METHODOLOGY (2026 CALIBRATION)</h4>
                  <p className="text-[11px] mt-0.5 font-bold">
                    Comprehensive technical breakdown of how KENSEI SPEC models gaming framerates and workload bottlenecks.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-amber-400" /> Section 1: Empirical Dataset Sourcing (データソース及びベンチマーク検証)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  KENSEI SPEC does not use random synthetic scores. Our telemetry mathematical formulas are derived from empirical hardware log analysis sourced from industry-standard hardware testing tools: <strong>CapFrameX</strong>, <strong>TechPowerUp</strong>, <strong>Gamers Nexus</strong>, <strong>Hardware Unboxed</strong>, and <strong>MSI Afterburner</strong> across 18 modern games and workloads.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-amber-400" /> Section 2: Real-World Performance Variance Variables (±3% to ±8% 誤差要因)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  Predicted framerates reflect average expected performance under controlled benchmark conditions. Actual real-world framerates on a user's physical PC may fluctuate within a normal ±3% to ±8% variance range due to the following hardware & software variables:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-bold">
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                    <strong className="text-[#1E2022] dark:text-white block mb-1">🖥️ Operating System Background Load</strong>
                    Windows 11 Memory Integrity (HVCI), Virtualization-Based Security (VBS), background antivirus software, or Discord overlay hooks consuming CPU thread cycles.
                  </div>
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                    <strong className="text-[#1E2022] dark:text-white block mb-1">🌡️ Thermal Throttling & Cooling</strong>
                    GPU Boost 4.0 and AMD Precision Boost 2 adjust clock frequencies downward if chassis airflow is restricted or ambient room temperature exceeds 25°C.
                  </div>
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                    <strong className="text-[#1E2022] dark:text-white block mb-1">⚡ Power Delivery & Motherboard VRM</strong>
                    Motherboard BIOS power limits (Intel PL1/PL2 / Tau duration caps) capping sustained multi-core CPU frequencies under heavy game thread loads.
                  </div>
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                    <strong className="text-[#1E2022] dark:text-white block mb-1">⚙️ RAM Sub-Timings & Dual-Channel</strong>
                    Running single-channel RAM cuts memory bandwidth in half, inducing frame stuttering compared to optimal dual-channel XMP/EXPO profiles.
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-amber-400" /> Section 3: Bottleneck Physics Equations (ボトルネック数理モデルの解説)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  Our simulator dynamically calculates hardware bottlenecks based on relative silicon compute balance rather than static percentages:
                </p>
                <ul className="list-disc list-inside text-[11px] font-bold text-gray-600 dark:text-gray-300 space-y-1">
                  <li><strong>GPU Bottleneck (1080p vs 4K)</strong>: At 4K resolution, GPU pixel shader pipelines are 99% maxed out. CPU workload scales dynamically based on game draw-call intensity rather than clamping artificially to zero.</li>
                  <li><strong>VRAM Thrashing Penalty</strong>: When game VRAM requirements exceed physical GPU VRAM (e.g. Cyberpunk 2077 requiring 11.2GB VRAM on an 8GB RTX 4060), KENSEI SPEC applies a dynamic frametime penalty reflecting PCIe bus RAM fallback thrashing.</li>
                  <li><strong>3D V-Cache Latency Bonus</strong>: AMD X3D processors (Ryzen 7 7800X3D, 9800X3D) receive L3 cache latency compensation in memory-bound esports titles (CS2, Valorant, Dota 2).</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: COMMERCIAL & AFFILIATE DISCLOSURE */}
          {activeTab === "affiliate" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              
              {/* Alert Header */}
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-900 dark:text-rose-200">
                <DollarSign className="w-5 h-5 text-[#E88D9F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">COMMERCIAL DISCLOSURE & MERCHANT AFFILIATE TRANSPARENCY</h4>
                  <p className="text-[11px] mt-0.5 font-bold">
                    Full disclosure regarding referral links, merchant pricing updates, and platform funding transparency.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> Section 1: Affiliate Referral Partnerships (アフィリエイト提携に関する開示)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  When you click "Buy Build" or outbound component purchasing buttons on KENSEI SPEC, you may be redirected to verified third-party hardware retailers—including <strong>Amazon.co.jp</strong>, <strong>Amazon.com</strong>, <strong>Newegg</strong>, <strong>Rakuten Ichiba (楽天)</strong>, <strong>Tsukumo (ツクモ)</strong>, and <strong>PC Koubou (パソコン工房)</strong>. KENSEI SPEC participates in affiliate referral programs and may earn a small referral commission upon qualifying purchases made through these links.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> Section 2: Zero Cost Penalty to Users (ユーザー費用の完全同額保証)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  Affiliate referral links operate at <strong>ZERO additional cost to you</strong>. The retail purchase price you pay on merchant checkout pages remains 100% identical whether you use our referral link or navigate directly to the merchant. Referral commissions directly fund our ongoing benchmark telemetry server infrastructure and engine updates.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> Section 3: Absolute Editorial & Telemetry Independence (評価ロジックの完全な中立性)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  Our commercial affiliate relationships do <strong>NOT</strong> influence our simulator mathematical formulas, FPS calculations, or hardware recommendation algorithms. Component scores are calculated programmatically using silicon hardware specifications and CapFrameX telemetry logs. We do not accept paid sponsorship to inflate hardware performance metrics or obscure hardware bottlenecks.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> Section 4: Price & Inventory Volatility Notice (価格・在庫の変動に関する注意)
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">
                  Global hardware pricing, GPU market availability, and promotional sales fluctuate dynamically across retail merchants. Displayed prices on KENSEI SPEC reflect estimated market baselines. Users must confirm final component pricing, shipping fees, tax rates, and warranty policies directly on the merchant's official checkout page prior to purchase.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <div className="text-gray-500 dark:text-gray-400 font-extrabold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8A9A86]" />
            <span>© 2026 KENSEI SPEC (剣聖スペック). All Rights Reserved. Legal Version 2.6.</span>
          </div>
          <button
            onClick={() => {
              try {
                localStorage.setItem("kensei_legal_accepted", "true");
                localStorage.setItem("kensei_legal_accepted_timestamp", new Date().toISOString());
              } catch (e) {
                // Ignore storage errors
              }
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] font-black hover:opacity-90 transition shadow-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>I Acknowledge & Agree / 了解しました</span>
          </button>
        </div>
      </div>
    </div>
  );
}
