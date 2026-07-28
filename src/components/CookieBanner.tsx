import { useState, useEffect } from "react";
import { Cookie, ShieldCheck, Check, X, FileText, Lock } from "lucide-react";

interface CookieBannerProps {
  onOpenPrivacyPolicy: () => void;
}

export default function CookieBanner({ onOpenPrivacyPolicy }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("kensei_cookie_consent");
      if (!consent) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("kensei_cookie_consent", "accepted");
      localStorage.setItem("kensei_cookie_consent_timestamp", new Date().toISOString());
    } catch {
      // Ignore storage write errors
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("kensei_cookie_consent", "declined");
    } catch {
      // Ignore storage write errors
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94vw] sm:w-[680px] max-w-2xl z-[100] animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-[#18191B]/95 text-white backdrop-blur-2xl border border-[#E88D9F]/30 rounded-3xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-5 relative overflow-hidden">
        {/* Ambient Subtle Accent Blur */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#E88D9F]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#8A9A86]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Bar: Icon + Title + Close Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E88D9F]/15 border border-[#E88D9F]/30 flex items-center justify-center shrink-0 shadow-xs">
              <Cookie className="w-5 h-5 text-[#E88D9F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-white tracking-wide">
                  Privacy & Cookie Preferences
                </h3>
                <span className="text-[10px] bg-[#E88D9F]/20 text-[#E88D9F] border border-[#E88D9F]/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  クッキー通知
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Local Data & Session Management</p>
            </div>
          </div>

          <button
            onClick={handleDecline}
            className="text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/10 shrink-0"
            title="Dismiss / 閉じる"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body Description */}
        <div className="text-xs text-gray-300 leading-relaxed font-normal bg-black/30 p-4 rounded-2xl border border-white/5">
          KENSEI SPEC uses <strong className="text-white font-bold">LocalStorage & Cookies</strong> solely to store your hardware configurations, game benchmark presets, and theme preferences directly on your device.
        </div>

        {/* Client-Side Security Guarantee Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8A9A86] bg-[#8A9A86]/10 px-4 py-2 rounded-xl border border-[#8A9A86]/20 font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8A9A86] shrink-0" />
            <span>100% Client-Side Storage • No External Tracking</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
            <Lock className="w-3 h-3 text-[#8A9A86]" />
            <span>Encrypted Session</span>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
          <button
            onClick={onOpenPrivacyPolicy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <FileText className="w-4 h-4 text-[#E88D9F] shrink-0" />
            <span>Privacy Policy / 詳細</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition whitespace-nowrap text-center"
            >
              Decline / 拒否
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black text-[#1E2022] bg-white hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Accept & Continue / 同意する</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
