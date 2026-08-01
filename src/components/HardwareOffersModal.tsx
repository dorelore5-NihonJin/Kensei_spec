import { useState, useMemo } from "react";
import {
  X,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Store,
  Globe
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import StoreLogo from "./StoreLogo";

export interface HardwareOffersItem {
  name: string;
  manufacturer: string;
  type: "cpu" | "gpu";
  launchMsrp?: number;
  socket?: string;
  vramGB?: number;
}

interface HardwareOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: HardwareOffersItem | null;
}

type StoreRegion = "ru" | "ja" | "en";

interface StoreProvider {
  id: string;
  name: string;
  region: StoreRegion;
  badge: string;
  badgeColor: string;
  description: string;
  logoColor: string;
  getUrl: (query: string) => string;
}

const STORE_PROVIDERS: StoreProvider[] = [
  // 🇷🇺 СНГ / РОССИЯ
  {
    id: "ozon",
    name: "OZON",
    region: "ru",
    badge: "Маркетплейс",
    badgeColor: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    description: "Быстрая доставка в ПВЗ, кэшбэк Ozon Картой и гарантия продавцов",
    logoColor: "#005BFF",
    getUrl: (q) => `https://www.ozon.ru/search/?text=${encodeURIComponent(q)}`
  },
  {
    id: "yandex",
    name: "Яндекс Маркет",
    region: "ru",
    badge: "Маркетплейс",
    badgeColor: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    description: "Оплата Сплитом, баллы Плюса и удобная курьерская доставка",
    logoColor: "#FC3F1D",
    getUrl: (q) => `https://market.yandex.ru/search?text=${encodeURIComponent(q)}`
  },
  {
    id: "dns",
    name: "DNS-Shop",
    region: "ru",
    badge: "Официальный Ритейл",
    badgeColor: "bg-orange-500/15 text-orange-500 border-orange-500/30",
    description: "Официальная гарантия производителя и наличие в магазинах города",
    logoColor: "#FF6600",
    getUrl: (q) => `https://www.dns-shop.ru/search/?q=${encodeURIComponent(q)}`
  },
  {
    id: "wildberries",
    name: "Wildberries",
    region: "ru",
    badge: "Маркетплейс",
    badgeColor: "bg-purple-500/15 text-purple-500 border-purple-500/30",
    description: "Пункты выдачи у дома, скидки при оплате WB Кошельком",
    logoColor: "#A100FF",
    getUrl: (q) => `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(q)}`
  },
  {
    id: "aliexpress",
    name: "AliExpress СНГ",
    region: "ru",
    badge: "Прямой Импорт",
    badgeColor: "bg-red-500/15 text-red-500 border-red-500/30",
    description: "Прямые поставки железных новинок напрямую от азиатских фабрик",
    logoColor: "#FF4747",
    getUrl: (q) => `https://aliexpress.ru/wholesale?SearchText=${encodeURIComponent(q)}`
  },
  {
    id: "amazon-global",
    name: "Amazon Global",
    region: "ru",
    badge: "США / Европа",
    badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    description: "Оригинальные партии с доставкой через сервис CDEK Forward",
    logoColor: "#FF9900",
    getUrl: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}`
  },

  // 🇯🇵 JAPAN (日本)
  {
    id: "amazon-jp",
    name: "Amazon.co.jp",
    region: "ja",
    badge: "公式ストア",
    badgeColor: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    description: "翌日配送・Prime会員送料無料・正規代理店保証付き",
    logoColor: "#FF9900",
    getUrl: (q) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(q)}`
  },
  {
    id: "rakuten",
    name: "Rakuten (楽天市場)",
    region: "ja",
    badge: "ポイント最大10倍",
    badgeColor: "bg-red-500/15 text-red-500 border-red-500/30",
    description: "楽天ポイント還元・お買い物マラソン対象店舗多数",
    logoColor: "#BF0000",
    getUrl: (q) => `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(q)}/`
  },
  {
    id: "yahoo-jp",
    name: "Yahoo! ショッピング",
    region: "ja",
    badge: "PayPayポイント",
    badgeColor: "bg-red-600/15 text-red-600 border-red-600/30",
    description: "PayPayポイント大幅還元・毎日ゾロ目の日クーポン",
    logoColor: "#FF0033",
    getUrl: (q) => `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(q)}`
  },
  {
    id: "dospara",
    name: "Dospara (ドスパラ)",
    region: "ja",
    badge: "専門店",
    badgeColor: "bg-blue-600/15 text-blue-600 border-blue-600/30",
    description: "老舗PCパーツ専門店・自作パーツ保証＆即日出荷対応",
    logoColor: "#0066CC",
    getUrl: (q) => `https://www.dospara.co.jp/5shopping/search.php?ft=${encodeURIComponent(q)}`
  },
  {
    id: "biccamera",
    name: "BicCamera (ビックカメラ)",
    region: "ja",
    badge: "10%ポイント還元",
    badgeColor: "bg-red-500/15 text-red-500 border-red-500/30",
    description: "ビックポイント10%還元・全店在庫確認＆店舗受取可能",
    logoColor: "#E60012",
    getUrl: (q) => `https://www.biccamera.com/bc/category/?q=${encodeURIComponent(q)}`
  },

  // 🌎 GLOBAL / US
  {
    id: "amazon-us",
    name: "Amazon.com",
    region: "en",
    badge: "Official Store",
    badgeColor: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    description: "Fast Prime 1-day shipping & direct manufacturer export warranty",
    logoColor: "#FF9900",
    getUrl: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}`
  },
  {
    id: "newegg",
    name: "Newegg",
    region: "en",
    badge: "Tech Specialist",
    badgeColor: "bg-orange-500/15 text-orange-500 border-orange-500/30",
    description: "Combo discounts, Daily Shell Shocker deals & trade-in program",
    logoColor: "#F58220",
    getUrl: (q) => `https://www.newegg.com/p/pl?d=${encodeURIComponent(q)}`
  },
  {
    id: "bestbuy",
    name: "Best Buy",
    region: "en",
    badge: "Authorized Retail",
    badgeColor: "bg-blue-600/15 text-blue-500 border-blue-600/30",
    description: "Official Founder's Edition partner & instant local store pickup",
    logoColor: "#0046BE",
    getUrl: (q) => `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(q)}`
  },
  {
    id: "microcenter",
    name: "Micro Center",
    region: "en",
    badge: "In-Store Bundles",
    badgeColor: "bg-red-500/15 text-red-500 border-red-500/30",
    description: "Unbeatable in-store CPU + Mobo combo discounts & enthusiast deals",
    logoColor: "#E2001A",
    getUrl: (q) => `https://www.microcenter.com/search/search_results.aspx?Ntt=${encodeURIComponent(q)}`
  },
  {
    id: "bhphoto",
    name: "B&H Photo Video",
    region: "en",
    badge: "No Sales Tax",
    badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    description: "Payboo Card tax savings, worldwide shipping & official retail stock",
    logoColor: "#0066B3",
    getUrl: (q) => `https://www.bhphotovideo.com/c/search?Ntt=${encodeURIComponent(q)}`
  },
  {
    id: "ebay",
    name: "eBay Marketplace",
    region: "en",
    badge: "Buyer Protection",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    description: "Verified refurbished cards, open-box deals & Money Back Guarantee",
    logoColor: "#E53238",
    getUrl: (q) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}`
  }
];

export default function HardwareOffersModal({
  isOpen,
  onClose,
  item
}: HardwareOffersModalProps) {
  const { lang, formatPrice } = useLanguage();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto region derived from active site language
  const selectedRegion: StoreRegion = lang === "ru" ? "ru" : lang === "ja" ? "ja" : "en";

  const filteredStores = useMemo(() => {
    return STORE_PROVIDERS.filter((s) => s.region === selectedRegion);
  }, [selectedRegion]);

  if (!isOpen || !item) return null;

  const handleCopyText = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Ignore clipboard error
    }
  };

  const isNvidia = item.manufacturer === "NVIDIA";
  const isAmd = item.manufacturer === "AMD";
  const isIntel = item.manufacturer === "Intel";
  const brandColor = isNvidia ? "#76B900" : isAmd ? "#ED1C24" : isIntel ? "#0071C5" : "#555555";
  const regionLabel = lang === "ru" ? "СНГ / Россия" : lang === "ja" ? "日本 (Japan)" : "Global / US";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 text-[#1E2022] dark:text-white rounded-[32px] max-w-4xl w-full p-5 sm:p-7 shadow-2xl relative flex flex-col gap-5 max-h-[92vh] overflow-y-auto transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header Bar */}
        <div className="flex items-start justify-between border-b border-black/10 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-black shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-[#1E2022] dark:text-white">
                  Где Купить {item.name}
                </h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  {regionLabel}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
                Официальные магазины и проверенные площадки для {item.type === "cpu" ? "процессора" : "видеокарты"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-black/5 dark:bg-white/10 text-gray-400 hover:text-[#1E2022] dark:hover:text-white transition active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FOCUSED ITEM BANNER */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-black/[0.03] to-black/[0.06] dark:from-white/[0.04] dark:to-white/[0.07] border border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-black text-xs shadow-md shrink-0 border border-white/20"
              style={{ backgroundColor: brandColor }}
            >
              <span className="text-[9px] opacity-80 uppercase">{item.manufacturer}</span>
              <span className="text-xs font-mono mt-0.5">{item.type.toUpperCase()}</span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border" style={{ backgroundColor: `${brandColor}15`, color: brandColor, borderColor: `${brandColor}30` }}>
                  {item.manufacturer}
                </span>
                {item.socket && (
                  <span className="text-[10px] bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-extrabold">
                    Сокет {item.socket}
                  </span>
                )}
                {item.vramGB && (
                  <span className="text-[10px] bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded font-extrabold">
                    {item.vramGB} GB VRAM
                  </span>
                )}
              </div>
              <h4 className="text-lg font-black text-[#1E2022] dark:text-white mt-0.5">
                {item.name}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {item.launchMsrp ? (
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-black uppercase text-gray-400">Рекомендованная цена (MSRP)</span>
                <div className="text-base font-black text-[#E88D9F] font-mono">
                  {formatPrice(item.launchMsrp)}
                </div>
              </div>
            ) : null}

            {/* Copy Search Query Button */}
            <button
              onClick={() => handleCopyText(item.name, "offers_query")}
              className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-black text-[#1E2022] dark:text-white hover:bg-[#E88D9F] hover:text-white transition flex items-center justify-center gap-2 border border-black/10 dark:border-white/10 active:scale-97"
            >
              {copiedId === "offers_query" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#E88D9F]" />}
              <span>{copiedId === "offers_query" ? "Запрос Скопирован!" : "Скопировать Название"}</span>
            </button>
          </div>
        </div>

        {/* MARKETPLACES GRID FOR SELECTED REGION */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#E88D9F]" /> {lang === "ru" ? "Магазины и Торговые Площадки" : lang === "ja" ? "対応ストア・オンラインショップ" : "Retailers & Marketplaces"} ({regionLabel})
            </span>
            <span className="text-[10px] font-bold text-gray-400">Прямой поиск по «{item.name}»</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredStores.map((store) => (
              <a
                key={store.id}
                href={store.getUrl(item.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-200 flex flex-col justify-between gap-3 group hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <StoreLogo id={store.id} name={store.name} size={36} />
                    <div>
                      <h4 className="text-xs font-black text-[#1E2022] dark:text-white group-hover:text-[#E88D9F] transition">
                        {store.name}
                      </h4>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border mt-0.5 inline-block ${store.badgeColor}`}>
                        {store.badge}
                      </span>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#E88D9F] transition shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-snug">
                  {store.description}
                </p>

                <div className="text-[11px] font-black text-[#E88D9F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Искать предложения</span>
                  <span>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* SECURITY & SAFETY TIPS FOOTER */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex items-start gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-black text-emerald-800 dark:text-emerald-300">
              Советы по безопасной покупке железа KENSEI:
            </span>
            <p className="text-emerald-700/90 dark:text-emerald-200/80 leading-relaxed font-medium">
              Перед оплатой проверяйте рейтинг продавца, наличие официального гарантийного талона, а также физическую совместимость сокета ({item.socket || "sTR5/AM5/LGA1700"}) и системного питания.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
