import { Link, Sparkles, X } from "lucide-react";

interface ToastProps {
  message: string;
  subMessage?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Toast({ message, subMessage, isOpen, onClose }: ToastProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-6 right-6 z-[120] animate-in fade-in slide-in-from-top-6 duration-300">
      <div className="bg-[#18191B]/95 text-white backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center gap-3.5 max-w-md">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Link className="w-5 h-5 text-emerald-400" />
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
