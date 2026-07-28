import { useState, useEffect } from "react";
import { Cookie, ShieldCheck, CheckCircle2, XCircle, Trash2, X, Lock, Check } from "lucide-react";

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy: () => void;
}

export default function CookieSettingsModal({ isOpen, onClose, onOpenPrivacyPolicy }: CookieSettingsModalProps) {
  const [consentStatus, setConsentStatus] = useState<"accepted" | "declined" | "none">("none");
  const [consentTime, setConsentTime] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const status = localStorage.getItem("kensei_cookie_consent");
        const time = localStorage.getItem("kensei_cookie_consent_timestamp");
        setConsentStatus(status === "accepted" ? "accepted" : status === "declined" ? "declined" : "none");
        if (time) {
          setConsentTime(new Date(time).toLocaleString());
        }
      } catch {
        // Ignore storage read errors
      }
    }
  }, [isOpen]);

  const handleToggleConsent = () => {
    try {
      if (consentStatus === "accepted") {
        localStorage.setItem("kensei_cookie_consent", "declined");
        localStorage.removeItem("kensei_cookie_consent_timestamp");
        setConsentStatus("declined");
        setConsentTime(null);
      } else {
        localStorage.setItem("kensei_cookie_consent", "accepted");
        const now = new Date().toISOString();
        localStorage.setItem("kensei_cookie_consent_timestamp", now);
        setConsentStatus("accepted");
        setConsentTime(new Date(now).toLocaleString());
      }
    } catch {
      // Ignore storage write errors
    }
  };

  const handleClearAllStorage = () => {
    try {
      localStorage.clear();
      setConsentStatus("none");
      setConsentTime(null);
    } catch {
      // Ignore errors
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1E2022] dark:bg-[#18191B] text-white border border-[#E88D9F]/30 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6">
        {/* Background Ambient Accents */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#E88D9F]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#8A9A86]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E88D9F]/20 border border-[#E88D9F]/30 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-[#E88D9F]" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>Cookie & Storage Controls</span>
                <span className="text-[10px] bg-[#E88D9F]/20 text-[#E88D9F] border border-[#E88D9F]/30 px-2 py-0.5 rounded-full font-mono uppercase">
                  クッキー設定
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-medium">Manage Local Data Persistence & Privacy Settings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Privacy Status Overview Card */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {consentStatus === "accepted" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Consent Status</span>
                <span className={`text-sm font-extrabold ${consentStatus === "accepted" ? "text-emerald-400" : "text-rose-400"}`}>
                  {consentStatus === "accepted" ? "Cookie Storage Enabled / 許可済み ✅" : "Cookie Storage Disabled / 無効 ❌"}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleConsent}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md ${
                consentStatus === "accepted"
                  ? "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30"
                  : "bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold"
              }`}
            >
              {consentStatus === "accepted" ? (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Disable Cookies / 無効化</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>Enable Cookies / 許可する</span>
                </>
              )}
            </button>
          </div>

          {consentTime && (
            <div className="text-[11px] text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 flex items-center justify-between">
              <span>Timestamp Granted:</span>
              <span className="font-mono text-gray-300 font-semibold">{consentTime}</span>
            </div>
          )}
        </div>

        {/* Detailed Storage Category Controls */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#8A9A86]" />
            <span>Storage Categories & Permissions</span>
          </h3>

          {/* Item 1: Essential Simulator State */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                <span>Hardware & Presets State</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">
                  Required
                </span>
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Saves CPU, GPU, RAM, storage, and game choices across F5 page reloads.</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 shrink-0">
              Active
            </span>
          </div>

          {/* Item 2: Client Security Guarantee */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                <span>Client-Side Privacy Protection</span>
                <span className="text-[9px] bg-[#8A9A86]/20 text-[#8A9A86] px-2 py-0.5 rounded-full font-bold uppercase">
                  Guaranteed
                </span>
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Zero external tracking scripts or advertising cookies are utilized.</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-[#8A9A86] shrink-0" />
          </div>
        </div>

        {/* Action Options Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
          <button
            onClick={handleClearAllStorage}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition flex items-center gap-1.5 border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Local Storage / リセット</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPrivacyPolicy}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              Privacy Policy
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-extrabold text-[#1E2022] bg-white hover:bg-gray-100 transition shadow-md"
            >
              Done / 完了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
