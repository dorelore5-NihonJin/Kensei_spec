import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Globe, ChevronDown } from "lucide-react";
import type { Language } from "../data/translations";

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "EN", flag: "🇺🇸" },
    { code: "ru", label: "RU", flag: "🇷🇺" },
    { code: "ja", label: "JA", flag: "🇯🇵" }
  ];

  const currentLangObj = languages.find((l) => l.code === lang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-black text-[#1E2022] dark:text-white transition-all shadow-xs"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#E88D9F]" />
        <span className="font-mono text-xs font-black uppercase tracking-wider">{currentLangObj.code}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl py-1.5 z-50 animate-fadeIn overflow-hidden">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-extrabold transition-all ${
                lang === l.code
                  ? "bg-[#E88D9F]/15 text-[#E88D9F] dark:text-[#E88D9F]"
                  : "text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{l.flag}</span>
                <span>{l.code === "en" ? "English" : l.code === "ru" ? "Русский" : "日本語"}</span>
              </div>
              {lang === l.code && <span className="w-1.5 h-1.5 rounded-full bg-[#E88D9F]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
