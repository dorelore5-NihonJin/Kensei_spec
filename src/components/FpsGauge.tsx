import { useState, useEffect } from "react";
import type { CalculationResult } from "../lib/types";
import { Sparkles, Info } from "lucide-react";

interface FpsGaugeProps {
  report: CalculationResult;
  selectedCpu: boolean;
  selectedGpu: boolean;
  selectedRam: boolean;
  frameGen: boolean;
}

// Custom Counter / Spring Hook for smooth numerical transition
function useAnimatedNumber(target: number, duration: number = 300) {
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = current;

    let cancelled = false;
    const step = (timestamp: number) => {
      if (cancelled) return;
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const val = Math.floor(progress * (target - startValue) + startValue);
      setCurrent(val);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    window.requestAnimationFrame(step);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return current;
}

export default function FpsGauge({ report, selectedCpu, selectedGpu, selectedRam, frameGen }: FpsGaugeProps) {
  const isComplete = selectedCpu && selectedGpu && selectedRam;

  const animatedAvgFps = useAnimatedNumber(isComplete ? report.averageFps : 0);
  const animatedLowFps = useAnimatedNumber(isComplete ? report.onePercentLowFps : 0);

  // SVG parameters
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const maxFpsReference = 240; // cap the circle max at 240 FPS
  const strokeOffset = circumference - (Math.min(animatedAvgFps, maxFpsReference) / maxFpsReference) * circumference;

  // Decide gradient ID based on FPS value
  let gradientId = "fps-grad-60-120";
  let pulseClass = "";
  if (animatedAvgFps < 30) {
    gradientId = "fps-grad-under-30";
    pulseClass = "animate-pulse";
  } else if (animatedAvgFps < 60) {
    gradientId = "fps-grad-30-60";
  } else if (animatedAvgFps < 120) {
    gradientId = "fps-grad-60-120";
  } else {
    gradientId = "fps-grad-120-plus";
  }

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-[#1A1C1E] dark:bg-[#111214] text-white overflow-hidden relative shadow-2xl border border-white/10 flex flex-col gap-5">
      {/* Kanji Watermark */}
      <div className="absolute top-2 right-2 text-6xl font-black text-white/[0.03] kanji-watermark select-none pointer-events-none">
        性能
      </div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-black tracking-tight flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-[#E88D9F]" />
          3. Estimated Performance / 性能予測
        </h3>
        <span className="text-[10px] bg-white/10 text-white font-black px-3 py-1 rounded-full uppercase tracking-wider">
          Real-Time
        </span>
      </div>

      {/* SVG Radial Gauge */}
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Gradients & Glow Filters */}
            <defs>
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="fps-grad-under-30" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F43F5E" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
              <linearGradient id="fps-grad-30-60" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="fps-grad-60-120" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="fps-grad-120-plus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#E88D9F" />
              </linearGradient>
            </defs>

            {/* Inner dashed track */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              className="stroke-white/10 fill-transparent"
              strokeWidth="8"
            />

            {/* Core Arc */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke={`url(#${gradientId})`}
              strokeWidth="8"
              filter="url(#neon-glow)"
              className={`fill-transparent transition-all duration-300 ease-out ${pulseClass}`}
              strokeDasharray={circumference}
              strokeDashoffset={isComplete ? strokeOffset : circumference}
              strokeLinecap="round"
            />
          </svg>

          {/* Inner Counter Labels */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black tracking-tight text-white select-all">
              {isComplete ? animatedAvgFps : "--"}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/60 font-black mt-0.5">AVG FPS</span>
          </div>
        </div>

        {/* Verdict Badge */}
        {isComplete ? (
          <div className={`px-4 py-1 rounded-full text-xs font-black border flex items-center gap-2 mt-4 ${report.verdict.colorClass}`}>
            <span>{report.verdict.badge}</span>
            <span className="opacity-70">/</span>
            <span>{report.verdict.japaneseBadge}</span>
          </div>
        ) : (
          <div className="px-4 py-1.5 rounded-full text-xs font-black border border-white/15 text-gray-300 bg-white/5 mt-4">
            Awaiting Component Selection
          </div>
        )}
      </div>

      {/* FPS Details Grid */}
      <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-4 text-center text-xs">
        <div className="border-r border-white/10 pr-2">
          <span className="text-gray-400 block font-black uppercase tracking-wider text-[10px] mb-1">1% Low (Stutter)</span>
          <span className="text-lg font-black text-rose-300">
            {isComplete ? `${animatedLowFps} FPS` : "--"}
          </span>
        </div>
        <div className="pl-2">
          <span className="text-gray-400 block font-black uppercase tracking-wider text-[10px] mb-1">Bottleneck Factor</span>
          <span className="text-lg font-black text-amber-300 uppercase tracking-wide">
            {isComplete ? (report.bottleneckType === "None" ? "Balanced" : report.bottleneckType) : "--"}
          </span>
        </div>
      </div>

      {/* Workload balancing meter */}
      <div>
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#8A9A86]" /> Workload Balance (CPU vs GPU Load)
        </h4>

        <div className="flex flex-col gap-3">
          {/* CPU Load */}
          <div>
            <div className="flex justify-between text-xs font-black text-gray-300 mb-1">
              <span>CPU Load</span>
              <span className="font-mono">{isComplete ? `${report.cpuLoadPercentage}%` : "0%"}</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#8A9A86] h-full transition-all duration-500 rounded-full"
                style={{ width: `${isComplete ? report.cpuLoadPercentage : 0}%` }}
              />
            </div>
          </div>

          {/* GPU Load */}
          <div>
            <div className="flex justify-between text-xs font-black text-gray-300 mb-1">
              <span>GPU Load</span>
              <span className="font-mono">{isComplete ? `${report.gpuLoadPercentage}%` : "0%"}</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#E88D9F] h-full transition-all duration-500 rounded-full"
                style={{ width: `${isComplete ? report.gpuLoadPercentage : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Frame Generation disclaimer tag */}
      {frameGen && isComplete && (
        <div className="text-[10px] text-gray-300 font-extrabold bg-white/5 p-2 rounded-xl text-center leading-normal border border-white/10">
          *Input Latency is determined by Base FPS, not Frame Gen FPS.*
        </div>
      )}
    </div>
  );
}
