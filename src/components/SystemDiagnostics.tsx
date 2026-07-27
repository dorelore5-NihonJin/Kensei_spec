import type { CPU, GPU, RAMProfile, CompatibilityReport } from "../lib/types";
import { AlertTriangle, CheckCircle, Zap, ShieldAlert } from "lucide-react";

interface SystemDiagnosticsProps {
  selectedCpu: CPU | null;
  selectedGpu: GPU | null;
  selectedRam: RAMProfile | null;
  compatibilityReport: CompatibilityReport;
}

export default function SystemDiagnostics({
  selectedCpu,
  selectedGpu,
  selectedRam,
  compatibilityReport
}: SystemDiagnosticsProps) {
  const isComplete = selectedCpu && selectedGpu && selectedRam;

  // Calculate total system TDP
  const cpuTdp = selectedCpu ? selectedCpu.tdpW : 0;
  const gpuTdp = selectedGpu ? selectedGpu.tdpW : 0;
  const systemTdp = isComplete ? cpuTdp + gpuTdp + 75 : 0;
  const recommendedPsu = compatibilityReport.psuRecommendationW;

  // Calculate headroom percentage: (recommendedPsu - systemTdp) / recommendedPsu
  const headroomPct = recommendedPsu > 0 ? Math.max(0, Math.round(((recommendedPsu - systemTdp) / recommendedPsu) * 100)) : 0;
  const isOverloaded = systemTdp > recommendedPsu;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col gap-6">

      {/* Silicon CPU/GPU Die Artwork Badge - Custom Visual Asset */}
      <div className="relative w-full h-24 rounded-2xl overflow-hidden shadow-inner border border-black/10 dark:border-white/10">
        <img
          src="/hardware_silicon_badge.jpg"
          alt="Silicon Hardware Badge"
          className="w-full h-full object-cover brightness-90 dark:brightness-60"
          onError={(e) => {
            // fallback if artwork not present
            e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/30 flex items-center justify-between px-5">
          <div>
            <h4 className="text-xs font-black text-[#E88D9F] uppercase tracking-widest">Hardware Die Diagnostics</h4>
            <p className="text-[11px] text-white/90 font-bold mt-0.5">Silicon Architecture Integrity & Power Load Verification</p>
          </div>
          <span className="text-[10px] font-black bg-[#8A9A86] text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
            Active
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black flex items-center gap-2 text-[#1E2022] dark:text-white">
          <Zap className="w-5 h-5 text-[#E88D9F] animate-bounce" />
          System Diagnostics / 互換性診断
        </h3>
        <span className="text-[10px] bg-[#E88D9F]/15 text-[#E88D9F] dark:bg-[#E88D9F]/25 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
          Telemetry
        </span>
      </div>

      {/* Warnings & Errors */}
      {!isComplete ? (
        <div className="p-4 bg-gray-50 dark:bg-[#121315] border border-black/10 dark:border-white/10 rounded-2xl text-center text-xs text-gray-600 dark:text-gray-400 font-extrabold py-6">
          🚨 Select CPU, GPU, and RAM to activate telemetry report.
        </div>
      ) : compatibilityReport.warnings.length === 0 && compatibilityReport.mismatches.length === 0 ? (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">Perfect Hardware Match</div>
            <p className="text-xs text-emerald-800 dark:text-emerald-200 font-bold mt-0.5">
              Silicon structures are perfectly balanced. Memory speed, storage bus, and power targets align.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {compatibilityReport.mismatches.map((mismatch, i) => (
            <div key={i} className="p-3.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span className="text-xs text-rose-900 dark:text-rose-200 font-extrabold leading-relaxed">{mismatch}</span>
            </div>
          ))}
          {compatibilityReport.warnings.map((warning, i) => (
            <div key={i} className="p-3.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="text-xs text-amber-900 dark:text-amber-200 font-extrabold leading-relaxed">{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* PSU Power & Efficiency Gauge */}
      {isComplete && (
        <div className="border-t border-black/10 dark:border-white/10 pt-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-black text-[#1E2022] dark:text-white uppercase tracking-wider">PSU Power & Efficiency Gauge</span>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-bold mt-0.5">Recommended PSU: <span className="font-black text-[#1E2022] dark:text-white">{recommendedPsu}W</span></p>
            </div>
            <span className="text-xs font-black bg-black/5 dark:bg-white/10 text-[#1E2022] dark:text-white px-3 py-1 rounded-full">
              TDP: {systemTdp}W
            </span>
          </div>

          {/* Headroom Bar */}
          <div>
            <div className="w-full bg-gray-200 dark:bg-neutral-800 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverloaded || headroomPct < 15
                    ? "bg-rose-500"
                    : headroomPct < 25
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, (systemTdp / recommendedPsu) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-xs font-black">
              <span className="text-gray-600 dark:text-gray-400">TDP: {systemTdp}W / Capacity: {recommendedPsu}W</span>
              <span className={`${isOverloaded || headroomPct < 15 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                {isOverloaded ? "🚨 OVERLOADED" : `✅ ${headroomPct}% Safety Headroom`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
