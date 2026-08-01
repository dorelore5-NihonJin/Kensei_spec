import { useMemo } from "react";
import {
  X,
  ExternalLink,
  ShieldCheck,
  Award,
  Store,
  Globe
} from "lucide-react";
import type { CPU, GPU, RAMProfile, StorageType } from "../lib/types";
import { useLanguage } from "../context/LanguageContext";
import StoreLogo from "./StoreLogo";

interface BuildBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCpu: CPU | null;
  selectedGpu: GPU | null;
  selectedRam: RAMProfile | null;
  ramCapacityGB: number;
  selectedStorage: StorageType;
  psuRecommendationW: number;
}

export type BuildTier = "budget" | "premium" | "extreme";
export type StoreRegion = "ru" | "ja" | "en";

interface StoreProvider {
  id: string;
  name: string;
  badge: string;
  badgeBg: string;
  logoBg: string;
  logoText: string;
  region: StoreRegion;
  buildUrl: (query: string) => string;
  description: string;
}

// Global Store Marketplaces Database
const STORE_PROVIDERS: StoreProvider[] = [
  // CIS / RUSSIAN REGION
  {
    id: "ozon",
    name: "OZON",
    badge: "Маркетплейс",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    logoBg: "bg-blue-600 text-white",
    logoText: "OZON",
    region: "ru",
    buildUrl: (q) => `https://www.ozon.ru/search/?text=${encodeURIComponent(q)}`,
    description: "Быстрая доставка в ПВЗ, кэшбэк Ozon Картой и гарантия продавцов"
  },
  {
    id: "yandex",
    name: "Яндекс Маркет",
    badge: "Маркетплейс",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    logoBg: "bg-[#FFCC00] text-black font-black",
    logoText: "ЯМ",
    region: "ru",
    buildUrl: (q) => `https://market.yandex.ru/search?text=${encodeURIComponent(q)}`,
    description: "Оплата Сплитом, баллы Плюса и удобная курьерская доставка"
  },
  {
    id: "dns",
    name: "DNS-Shop",
    badge: "Официальный Ритейл",
    badgeBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    logoBg: "bg-orange-500 text-white font-black",
    logoText: "DNS",
    region: "ru",
    buildUrl: (q) => `https://www.dns-shop.ru/search/?q=${encodeURIComponent(q)}`,
    description: "Официальная гарантия производителя и наличие в магазинах города"
  },
  {
    id: "wb",
    name: "Wildberries",
    badge: "Маркетплейс",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    logoBg: "bg-purple-600 text-white font-black",
    logoText: "WB",
    region: "ru",
    buildUrl: (q) => `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(q)}`,
    description: "Пункты выдачи у дома, скидки при оплате WB Кошельком"
  },
  {
    id: "ali-ru",
    name: "AliExpress СНГ",
    badge: "Прямой Импорт",
    badgeBg: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
    logoBg: "bg-red-500 text-white font-black",
    logoText: "ALI",
    region: "ru",
    buildUrl: (q) => `https://aliexpress.ru/wholesale?SearchText=${encodeURIComponent(q)}`,
    description: "Прямые поставки железных новинок напрямую от азиатских фабрик"
  },
  {
    id: "amazon-global",
    name: "Amazon Global",
    badge: "США / Европа",
    badgeBg: "bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30",
    logoBg: "bg-slate-800 text-amber-400 font-black",
    logoText: "AMZ",
    region: "ru",
    buildUrl: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}`,
    description: "Оригинальные партии с доставкой через сервис CDEK Forward"
  },

  // JAPAN REGION
  {
    id: "amazon-jp",
    name: "Amazon.co.jp",
    badge: "公式ショップ",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    logoBg: "bg-[#FF9900] text-black font-black",
    logoText: "AMZ",
    region: "ja",
    buildUrl: (q) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(q)}`,
    description: "翌日配送・Prime会員送料無料・正規代理店保証対応"
  },
  {
    id: "rakuten",
    name: "Rakuten (楽天市場)",
    badge: "ポイント還元",
    badgeBg: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
    logoBg: "bg-[#BF0000] text-white font-black",
    logoText: "楽天",
    region: "ja",
    buildUrl: (q) => `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(q)}/`,
    description: "楽天ポイント最大10倍還元・お買い物マラソン対応"
  },
  {
    id: "yahoo-jp",
    name: "Yahoo! ショッピング",
    badge: "PayPay対応",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    logoBg: "bg-[#FF0033] text-white font-black",
    logoText: "Y!",
    region: "ja",
    buildUrl: (q) => `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(q)}`,
    description: "PayPayポイントが毎日貯まる・5のつく日キャンペーン"
  },
  {
    id: "dospara",
    name: "Dospara (ドスパラ)",
    badge: "PC専門店",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    logoBg: "bg-blue-700 text-white font-black",
    logoText: "DSP",
    region: "ja",
    buildUrl: (q) => `https://www.dospara.co.jp/5shopping/search.php?ft=${encodeURIComponent(q)}`,
    description: "老舗PCパーツ専門店・自作パソコンパーツ保証充実"
  },
  {
    id: "biccamera",
    name: "BicCamera (ビックカメラ)",
    badge: "家電量販店",
    badgeBg: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
    logoBg: "bg-[#E60012] text-white font-black",
    logoText: "BIC",
    region: "ja",
    buildUrl: (q) => `https://www.biccamera.com/bc/category/?q=${encodeURIComponent(q)}`,
    description: "基本10%ビックポイント還元・指定店舗受取対応"
  },

  // GLOBAL / EN REGION
  {
    id: "amazon-us",
    name: "Amazon.com",
    badge: "Global Retail",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    logoBg: "bg-[#FF9900] text-black font-black",
    logoText: "AMZ",
    region: "en",
    buildUrl: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}`,
    description: "Prime 1-Day Shipping, Easy Hassle-Free Returns & Global Direct Export"
  },
  {
    id: "newegg",
    name: "Newegg",
    badge: "Tech Specialist",
    badgeBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    logoBg: "bg-[#F37021] text-white font-black",
    logoText: "EGG",
    region: "en",
    buildUrl: (q) => `https://www.newegg.com/p/pl?d=${encodeURIComponent(q)}`,
    description: "Hardware Combo Discounts, Daily Shell Shocker Deals & Trade-in Savings"
  },
  {
    id: "bestbuy",
    name: "Best Buy",
    badge: "Authorized Dealer",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    logoBg: "bg-[#0046BE] text-white font-black",
    logoText: "BBY",
    region: "en",
    buildUrl: (q) => `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(q)}`,
    description: "Official Founder's Edition Stock & Same-Day In-Store Pickup"
  },
  {
    id: "microcenter",
    name: "Micro Center",
    badge: "In-Store Bundles",
    badgeBg: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
    logoBg: "bg-red-700 text-white font-black",
    logoText: "MC",
    region: "en",
    buildUrl: (q) => `https://www.microcenter.com/search/search_results.aspx?Ntt=${encodeURIComponent(q)}`,
    description: "Unbeatable CPU + Motherboard + RAM In-Store Bundle Savings"
  },
  {
    id: "bhphoto",
    name: "B&H Photo Video",
    badge: "Authorized Dealer",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    logoBg: "bg-emerald-700 text-white font-black",
    logoText: "B&H",
    region: "en",
    buildUrl: (q) => `https://www.bhphotovideo.com/c/search?Ntt=${encodeURIComponent(q)}`,
    description: "Save Sales Tax with Payboo Card & Fast Worldwide Shipping"
  },
  {
    id: "ebay",
    name: "eBay Marketplace",
    badge: "Deals & Auctions",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    logoBg: "bg-[#E53238] text-white font-black",
    logoText: "BAY",
    region: "en",
    buildUrl: (q) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}`,
    description: "Refurbished Hardware, Verified Seller Warranty & Buyer Protection"
  }
];

// Socket matcher helper
function getMotherboardForCpu(cpu: CPU | null, tier: BuildTier) {
  const socket = cpu?.socket || "AM5";

  if (socket === "AM5") {
    if (tier === "extreme") return { name: "ASUS ROG Crosshair X670E Hero WiFi 7", socket: "AM5", price: 620, vendor: "ASUS ROG" };
    if (tier === "premium") return { name: "ASUS ROG Strix X670E-F Gaming WiFi", socket: "AM5", price: 360, vendor: "ASUS ROG" };
    return { name: "MSI PRO B650M-A WiFi", socket: "AM5", price: 140, vendor: "MSI PRO" };
  }
  if (socket === "LGA1851") {
    if (tier === "extreme") return { name: "ASUS ROG Maximus Z890 Hero WiFi 7", socket: "LGA1851", price: 680, vendor: "ASUS ROG" };
    if (tier === "premium") return { name: "MSI MAG Z890 Tomahawk WiFi", socket: "LGA1851", price: 320, vendor: "MSI MAG" };
    return { name: "GIGABYTE Z890 EAGLE AX", socket: "LGA1851", price: 220, vendor: "Gigabyte" };
  }
  if (socket === "LGA1700") {
    if (tier === "extreme") return { name: "ASUS ROG Maximus Z790 Dark Hero", socket: "LGA1700", price: 590, vendor: "ASUS ROG" };
    if (tier === "premium") return { name: "MSI MAG Z790 Tomahawk WiFi", socket: "LGA1700", price: 260, vendor: "MSI MAG" };
    return { name: "ASRock B760M Pro RS WiFi", socket: "LGA1700", price: 120, vendor: "ASRock" };
  }
  if (socket === "AM4") {
    if (tier === "extreme") return { name: "ASUS ROG Strix X570-E Gaming WiFi", socket: "AM4", price: 290, vendor: "ASUS ROG" };
    if (tier === "premium") return { name: "Gigabyte B550 AORUS Elite V2", socket: "AM4", price: 150, vendor: "Gigabyte AORUS" };
    return { name: "MSI B450M PRO-VDH MAX", socket: "AM4", price: 75, vendor: "MSI PRO" };
  }
  return { name: `Gigabyte Ultra Durable ${socket} Motherboard`, socket, price: 90, vendor: "Gigabyte" };
}

// Cooler matcher helper
function getCoolingForCpu(cpu: CPU | null, tier: BuildTier) {
  const tdp = cpu?.tdpW || 105;

  if (tier === "extreme") {
    return {
      type: "Custom 360mm LCD Liquid AIO",
      name: "Corsair iCUE LINK H150i LCD 360mm Liquid AIO",
      price: 290,
      vendor: "Corsair iCUE LINK",
      isLiquid: true
    };
  }

  if (tdp >= 160 || (tier === "premium" && tdp >= 120)) {
    return {
      type: "Liquid AIO 360mm",
      name: "DeepCool LT720 360mm ARGB Liquid AIO",
      price: 140,
      vendor: "DeepCool",
      isLiquid: true
    };
  }

  return {
    type: "Dual Tower Air Cooler",
    name: "Thermalright Peerless Assassin 120 SE ARGB",
    price: 40,
    vendor: "Thermalright",
    isLiquid: false
  };
}

function getCpuPrice(cpu: CPU | null): number {
  if (!cpu) return 300;
  if (cpu.launchMsrp && cpu.launchMsrp > 0) return cpu.launchMsrp;
  if (cpu.releaseYear < 2015) return Math.min(40, Math.max(10, Math.round(cpu.multiCoreScore * 0.15)));
  if (cpu.releaseYear < 2020) return Math.min(120, Math.max(40, Math.round(cpu.multiCoreScore * 0.12)));
  return Math.min(750, Math.max(130, Math.round(cpu.singleCoreScore * 0.18 + cpu.multiCoreScore * 0.015)));
}

function getGpuPrice(gpu: GPU | null): number {
  if (!gpu) return 600;
  if (gpu.launchMsrp && gpu.launchMsrp > 0) return gpu.launchMsrp;
  if (gpu.releaseYear < 2015) return Math.min(60, Math.max(15, Math.round(gpu.relativePowerScore * 0.4)));
  if (gpu.releaseYear < 2020) return Math.min(220, Math.max(50, Math.round(gpu.relativePowerScore * 0.6)));
  return Math.min(2000, Math.max(250, Math.round(gpu.relativePowerScore * 1.5)));
}

export default function BuildBuyModal({
  isOpen,
  onClose,
  selectedCpu,
  selectedGpu,
  ramCapacityGB,
  selectedStorage,
  psuRecommendationW
}: BuildBuyModalProps) {
  const { lang, formatPrice } = useLanguage();

  // Auto region derived from active site language
  const selectedRegion: StoreRegion = lang === "ru" ? "ru" : lang === "ja" ? "ja" : "en";

  const searchQuery = useMemo(() => {
    const cpuName = selectedCpu ? selectedCpu.name : "Gaming CPU";
    const gpuName = selectedGpu ? selectedGpu.name : "GPU";
    return `${cpuName} ${gpuName}`;
  }, [selectedCpu, selectedGpu]);

  const filteredStores = useMemo(() => {
    return STORE_PROVIDERS.filter((s) => s.region === selectedRegion);
  }, [selectedRegion]);

  if (!isOpen) return null;

  const mobo = getMotherboardForCpu(selectedCpu, "premium");
  const cooler = getCoolingForCpu(selectedCpu, "premium");

  const cpuPrice = getCpuPrice(selectedCpu);
  const gpuPrice = getGpuPrice(selectedGpu);
  const moboPrice = mobo.price;
  const coolerPrice = cooler.price;
  const ramPrice = Math.round(ramCapacityGB * 3.5);
  const storagePrice = typeof selectedStorage === "string" && selectedStorage.includes("5.0") ? 180 : 110;
  const psuPrice = Math.round(psuRecommendationW * 0.16);
  const casePrice = 110;

  const totalPriceUSD = cpuPrice + gpuPrice + moboPrice + coolerPrice + ramPrice + storagePrice + psuPrice + casePrice;

  const regionLabel = lang === "ru" ? "СНГ / Россия" : lang === "ja" ? "日本 (Japan)" : "Global / US";

  const t = useMemo(() => {
    const isEn = lang === "en";
    const isJa = lang === "ja";
    return {
      title: isEn ? "Where to Buy PC Build & Component Estimate" : isJa ? "PCビルド購入 & パーツ見積もり" : "Где Купить Сборку ПК & Смета Комплектующих",
      subtitle: isEn
        ? "Calculated component prices, case, PSU, and direct ready-to-use PC build search"
        : isJa
        ? "パーツ、ケース、電源の概算価格とストアでのビルド直接検索"
        : "Рассчитанные цены комплектующих, корпуса, блока питания и прямого поиска готовой сборки в магазинах",
      buildLabel: isEn ? "Full PC Build:" : isJa ? "フルPCビルド:" : "Комплексная сборка:",
      estCost: isEn ? "Estimated Cost" : isJa ? "概算見積もり価格" : "Расчетная стоимость",
      storesHeader: isEn ? "Retailers & Marketplaces" : isJa ? "対応ストア・オンラインショップ" : "Магазины и Торговые Площадки",
      directSearch: isEn ? `Direct search for «${searchQuery}»` : isJa ? `«${searchQuery}» の直接検索` : `Прямой поиск по «${searchQuery}»`,
      findOffers: isEn ? "Find Offers" : isJa ? "オファーを探す" : "Искать предложения",
      adviceTitle: isEn ? "KENSEI Hardware Buyer Advice:" : isJa ? "KENSEIパーツ購入のアドバイス:" : "Советы по безопасной покупке железа KENSEI:",
      adviceBody: isEn
        ? `Before payment, verify seller rating, official warranty card, physical socket compatibility (${selectedCpu?.socket || "AM5"}) and required PSU capacity (${psuRecommendationW}W+).`
        : isJa
        ? `支払い前に、セラーの評価、正規保証書の有無、ソケットの物理的互換性（${selectedCpu?.socket || "AM5"}）、および必要な電源容量（${psuRecommendationW}W+）を確認してください。`
        : `Перед оплатой проверяйте рейтинг продавца, наличие официального гарантийного талона, а также физическую совместимость сокета (${selectedCpu?.socket || "AM5"}) и необходимую мощность БП (${psuRecommendationW}W+).`
    };
  }, [lang, searchQuery, selectedCpu, psuRecommendationW]);

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
                  {t.title}
                </h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  {regionLabel}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
                {t.subtitle}
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

        {/* FULL PC BUILD SUMMARY CARD */}
        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-[#E88D9F] shrink-0" />
            <div>
              <span className="font-black text-[#1E2022] dark:text-white block">
                {t.buildLabel} {selectedCpu?.name || "Gaming CPU"} + {selectedGpu?.name || "GPU"}
              </span>
              <span className="text-[10px] text-gray-400 font-extrabold">
                {ramCapacityGB}GB RAM • 2TB SSD • {psuRecommendationW}W PSU
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t sm:border-t-0 border-black/10 dark:border-white/10 pt-2 sm:pt-0">
            <div>
              <span className="text-[9px] uppercase text-gray-400 font-black">{t.estCost}</span>
              <div className="text-base font-black text-[#E88D9F] font-mono">{formatPrice(totalPriceUSD)}</div>
            </div>
          </div>
        </div>

        {/* STORE MARKETPLACE PROVIDERS GRID */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase text-gray-500 dark:text-gray-400 tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#E88D9F]" /> {t.storesHeader} ({regionLabel})
            </h4>
            <span className="text-[10px] text-gray-400 font-extrabold">
              {t.directSearch}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStores.map((store) => (
              <a
                key={store.id}
                href={store.buildUrl(searchQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-[#E88D9F]/50 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between gap-3 active:scale-97 shadow-xs hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <StoreLogo id={store.id} name={store.name} size={36} />
                    <div>
                      <h5 className="font-black text-sm text-[#1E2022] dark:text-white group-hover:text-[#E88D9F] transition">
                        {store.name}
                      </h5>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border inline-block mt-0.5 ${store.badgeBg}`}>
                        {store.badge}
                      </span>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:bg-[#E88D9F] group-hover:text-white transition">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold leading-snug">
                  {store.description}
                </p>

                <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-2 text-[10px] font-black text-[#E88D9F] group-hover:underline">
                  <span>{t.findOffers}</span>
                  <span>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* BUYER PROTECTION & VERIFICATION TIP BANNER */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300 font-extrabold flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-black text-emerald-700 dark:text-emerald-400 mb-0.5">
              {t.adviceTitle}
            </strong>
            {t.adviceBody}
          </div>
        </div>

      </div>
    </div>
  );
}
