import { useState, useEffect } from "react";
import { Cookie, ShieldCheck, Check, X, FileText } from "lucide-react";

interface CookieBannerProps {
  onOpenPrivacyPolicy: () => void;
}

export default function CookieBanner({ onOpenPrivacyPolicy }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("kensei_cookie_consent");
      if (!consent) {
        // Smooth delay before presenting cookie banner to user
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 750);
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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 max-w-lg z-50 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="bg-[#1E2022]/95 dark:bg-[#18191B]/95 text-white backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
        {/* Header Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E88D9F]/20 border border-[#E88D9F]/30 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-[#E88D9F]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>Privacy & Storage Notice</span>
                <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-md uppercase font-mono">
                  クッキー通知
                </span>
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">Local Data & Session Management</p>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            title="Dismiss / 关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Description */}
        <p className="text-xs text-gray-300 leading-relaxed font-normal">
          KENSEI SPEC utilizes <strong className="text-white font-semibold">LocalStorage & Session Cookies</strong> to store your customized PC hardware selections, game graphics presets, and theme preferences. All data is saved strictly on your local device and is never shared or sold to third parties.
        </p>

        {/* Sub-badge */}
        <div className="flex items-center gap-2 text-[11px] text-[#8A9A86] bg-[#8A9A86]/10 px-3 py-1.5 rounded-lg border border-[#8A9A86]/20 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>100% Client-Side Storage • No External Tracking</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-1 border-t border-white/10">
          <button
            onClick={onOpenPrivacyPolicy}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#E88D9F]" />
            <span>Privacy Policy / 詳細</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition text-center"
            >
              Decline / 拒否
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-extrabold text-[#1E2022] bg-white hover:bg-gray-100 transition shadow-md flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Accept & Continue / 同意する</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
