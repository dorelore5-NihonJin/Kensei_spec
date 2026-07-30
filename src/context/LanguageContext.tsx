import React, { createContext, useContext, useState, useEffect } from "react";
import type { Language } from "../data/translations";
import { translations } from "../data/translations";
import { fetchExchangeRates, formatPrice, getSecondaryCurrency } from "../lib/currency";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  formatPrice: (usdAmount: number, showFullSecondary?: boolean) => string;
  getSecondaryCurrency: (usdAmount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get("lang") as Language;
      if (urlLang === "en" || urlLang === "ru" || urlLang === "ja") {
        localStorage.setItem("kensei_lang", urlLang);
        return urlLang;
      }
      const saved = localStorage.getItem("kensei_lang") as Language;
      if (saved === "en" || saved === "ru" || saved === "ja") return saved;
    }
    return "en";
  });

  const [, setRatesLoaded] = useState(false);

  // Fetch exchange rates once per 24h
  useEffect(() => {
    fetchExchangeRates().then(() => setRatesLoaded(true)).catch(() => {});
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("kensei_lang", newLang);
      const url = new URL(window.location.href);
      url.searchParams.set("lang", newLang);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry["en"] || key;
  };

  const formatPriceBound = (usdAmount: number, showFullSecondary = true): string => {
    return formatPrice(usdAmount, lang, showFullSecondary);
  };

  const getSecondaryCurrencyBound = (usdAmount: number): string => {
    return getSecondaryCurrency(usdAmount, lang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, formatPrice: formatPriceBound, getSecondaryCurrency: getSecondaryCurrencyBound }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
