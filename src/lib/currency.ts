import type { Language } from "../data/translations";

export interface ExchangeRates {
  RUB: number;
  JPY: number;
  lastUpdated: number;
}

// Fallback rates if offline or API unavailable
const DEFAULT_RATES: ExchangeRates = {
  RUB: 92.5,
  JPY: 155.0,
  lastUpdated: Date.now()
};

const STORAGE_KEY = "kensei_fx_rates";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

let cachedRates: ExchangeRates = DEFAULT_RATES;

// Load cached rates from localStorage on startup
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: ExchangeRates = JSON.parse(saved);
      if (parsed && typeof parsed.RUB === "number" && typeof parsed.JPY === "number") {
        cachedRates = parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load cached exchange rates:", e);
  }
}

/**
 * Asynchronously fetch latest exchange rates from open.er-api.com and cache for 24h
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  if (typeof window === "undefined") return cachedRates;

  const now = Date.now();
  // Use cached rates if less than 24 hours old
  if (cachedRates.lastUpdated && now - cachedRates.lastUpdated < CACHE_TTL_MS && cachedRates.RUB > 0) {
    return cachedRates;
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.result === "success" && data.rates) {
      const newRates: ExchangeRates = {
        RUB: data.rates.RUB || DEFAULT_RATES.RUB,
        JPY: data.rates.JPY || DEFAULT_RATES.JPY,
        lastUpdated: now
      };
      cachedRates = newRates;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRates));
      return newRates;
    }
  } catch (err) {
    console.warn("Using fallback exchange rates:", err);
  }

  return cachedRates;
}

/**
 * Get current exchange rates synchronously (returns cached or default rates)
 */
export function getRates(): ExchangeRates {
  return cachedRates;
}

/**
 * Formats a USD price with local currency conversion based on user language.
 * @example
 * formatPrice(1380, "ru") -> "$1 380 (~127 650 ₽)"
 * formatPrice(1380, "ja") -> "$1,380 (~¥213,900)"
 * formatPrice(1380, "en") -> "$1,380 USD"
 */
export function formatPrice(usdAmount: number, lang: Language = "en", showFullSecondary = true): string {
  const roundedUsd = Math.round(usdAmount);

  if (lang === "en") {
    return `$${roundedUsd.toLocaleString("en-US")} USD`;
  }

  const rates = getRates();

  if (lang === "ru") {
    const rubAmount = Math.round(roundedUsd * rates.RUB);
    const usdFormatted = `$${roundedUsd.toLocaleString("ru-RU")}`;
    const rubFormatted = `~${rubAmount.toLocaleString("ru-RU")} ₽`;
    return showFullSecondary ? `${usdFormatted} (${rubFormatted})` : `${usdFormatted}`;
  }

  if (lang === "ja") {
    const jpyAmount = Math.round(roundedUsd * rates.JPY);
    const usdFormatted = `$${roundedUsd.toLocaleString("en-US")}`;
    const jpyFormatted = `~¥${jpyAmount.toLocaleString("ja-JP")}`;
    return showFullSecondary ? `${usdFormatted} (${jpyFormatted})` : `${usdFormatted}`;
  }

  return `$${roundedUsd.toLocaleString()} USD`;
}

/**
 * Helper to get local secondary currency string separately
 * @example
 * getSecondaryCurrency(1380, "ru") -> "~127 650 ₽"
 * getSecondaryCurrency(1380, "ja") -> "~¥213,900"
 * getSecondaryCurrency(1380, "en") -> ""
 */
export function getSecondaryCurrency(usdAmount: number, lang: Language = "en"): string {
  if (lang === "en") return "";
  const rates = getRates();
  const roundedUsd = Math.round(usdAmount);

  if (lang === "ru") {
    const rubAmount = Math.round(roundedUsd * rates.RUB);
    return `~${rubAmount.toLocaleString("ru-RU")} ₽`;
  }

  if (lang === "ja") {
    const jpyAmount = Math.round(roundedUsd * rates.JPY);
    return `~¥${jpyAmount.toLocaleString("ja-JP")}`;
  }

  return "";
}
