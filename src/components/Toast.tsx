import { useState, useEffect } from "react";
import { Link as LinkIcon, Sparkles, X } from "lucide-react";

interface ToastProps {
  message: string;
  subMessage?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Toast({ message, subMessage, isOpen, onClose }: ToastProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const frame = requestAnimationFrame(() => {
        setIsAnimatingIn(true);
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsAnimatingIn(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[120] transition-all duration-400 ease-out ${
        isAnimatingIn
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-6 scale-95 pointer-events-none"
      }`}
    >
      <div className="bg-[#18191B]/95 text-white backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center gap-3.5 max-w-md">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <LinkIcon className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-black text-white flex items-center gap-1.5">
            <span>{message}</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </h4>
          {subMessage && (
            <p className="text-[11px] text-gray-300 font-medium truncate mt-0.5">{subMessage}</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
