import { useState, useMemo } from "react";
import { useHardware } from "../context/HardwareContext";
import { useLanguage } from "../context/LanguageContext";
import { getCpuTechnicalDetails } from "../lib/hardwareSpecs";
import { getHardwareSlug, findCpuBySlugOrId } from "../lib/slugs";
import {
  Zap,
  Scale,
  ShoppingCart,
  Share2,
  Check,
  ArrowLeft,
  Tv,
  CheckCircle2,
  XCircle,
  Dna,
  Cpu as CpuIcon,
  HardDrive,
  ShieldCheck,
  Flame,
  Award,
  Sparkles
} from "lucide-react";

export default function CpuDetailPage() {
  const {
    cpus,
    selectedCpuDetailId,
    setSelectedCpu,
    setActivePage,
    setCurrentStep,
    setIsBuyModalOpen,
    handleOpenHardwareOffersModal,
    handleOpenCpuDetail,
    previousPage,
    handleBackFromCpuDetail,
    showToast
  } = useHardware();
  const { formatPrice } = useLanguage();

  const [copied, setCopied] = useState(false);

  const backLabel = useMemo(() => {
    if (previousPage === "rankings") return "Назад в Рейтинг";
    if (previousPage === "compare") return "Назад в Сравнение";
    if (previousPage === "catalog") return "Назад в Каталог";
    return "Назад в Симулятор";
  }, [previousPage]);

  // Resolve target CPU from selectedCpuDetailId or URL
  const cpu = useMemo(() => {
    if (selectedCpuDetailId) {
      const match = findCpuBySlugOrId(cpus, selectedCpuDetailId);
      if (match) return match;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id") || urlParams.get("cpu");
    if (idParam) {
      const match = findCpuBySlugOrId(cpus, idParam);
      if (match) return match;
    }
    return cpus[0] || null;
  }, [cpus, selectedCpuDetailId]);

  if (!cpu) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-black text-gray-400">Процессор не найден</h2>
        <button
          onClick={() => setActivePage("simulator")}
          className="mt-4 px-6 py-2.5 bg-[#1E2022] text-white rounded-xl text-xs font-black"
        >
          Вернуться в Симулятор
        </button>
      </div>
    );
  }

  const techDetails = getCpuTechnicalDetails(cpu, cpus);

  // Compute rankings & percentiles among database CPUs
  const { singleRank, multiRank, singleMax, multiMax } = useMemo(() => {
    if (!cpus || cpus.length === 0) {
      return { singleRank: 1, multiRank: 1, singleMax: 2500, multiMax: 25000 };
    }
    const sortedSingle = [...cpus].sort((a, b) => b.singleCoreScore - a.singleCoreScore);
    const sortedMulti = [...cpus].sort((a, b) => b.multiCoreScore - a.multiCoreScore);

    const sRank = sortedSingle.findIndex((c) => c.id === cpu.id) + 1;
    const mRank = sortedMulti.findIndex((c) => c.id === cpu.id) + 1;

    const sMax = sortedSingle[0]?.singleCoreScore || 2500;
    const mMax = sortedMulti[0]?.multiCoreScore || 25000;

    return {
      singleRank: sRank > 0 ? sRank : 1,
      multiRank: mRank > 0 ? mRank : 1,
      singleMax: sMax,
      multiMax: mMax
    };
  }, [cpus, cpu]);

  // Compute dynamic smart GPU recommendations based on CPU performance tier
  const gpuPairings = useMemo(() => {
    const sScore = cpu.singleCoreScore;
    const mScore = cpu.multiCoreScore;

    if (sScore >= 2100 || mScore >= 18000) {
      return {
        res1080p: { gpu: "RTX 4070 Super / RX 7800 XT", tag: "Киберспорт 300+ FPS", desc: "Экстремальная частота кадров без задержек ввода." },
        res1440p: { gpu: "RTX 4080 Super / RX 7900 XTX", tag: "Максимальная Графика", desc: "Ультра-настройки с рейтрейсингом и DLSS Quality." },
        res4K: { gpu: "RTX 4090 / RTX 5090", tag: "Флагманский Фреймрейт", desc: "Бескомпромиссный 4K гейминг на 144Hz+ мониторах." }
      };
    }
    if (sScore >= 1700 || mScore >= 12000) {
      return {
        res1080p: { gpu: "RTX 4060 Ti / RX 7700 XT", tag: "Высокая Частота", desc: "Плавный геймплей 144Hz+ в шутерах и AAA-играх." },
        res1440p: { gpu: "RTX 4070 Super / RX 7800 XT", tag: "Оптимальный Баланс", desc: "Отличный баланс четкости и кадров в QHD." },
        res4K: { gpu: "RTX 4080 Super / RX 7900 XT", tag: "Премиум 4K", desc: "Комфортный фреймрейт на ультра-настройках." }
      };
    }
    if (sScore >= 1400 || mScore >= 8000) {
      return {
        res1080p: { gpu: "RTX 4060 / RX 7600", tag: "Народный Стандарт", desc: "Высокие настройки графика в Full HD." },
        res1440p: { gpu: "RTX 4070 / RX 7700 XT", tag: "Комфортный QHD", desc: "Стабильные 60-90 FPS в современных играх." },
        res4K: { gpu: "RTX 4070 Ti Super", tag: "Базовый 4K", desc: "Игры в 4K с включенным DLSS / FSR." }
      };
    }
    return {
      res1080p: { gpu: "RX 6600 / RTX 3050", tag: "Базовый Full HD", desc: "Стабильные 60 FPS на средних/высоких настройках." },
      res1440p: { gpu: "RTX 4060 / RX 7600 XT", tag: "Начальный QHD", desc: "Средние настройки в 1440p с масштабированием." },
      res4K: { gpu: "RTX 4060 Ti 16GB", tag: "4K с DLSS", desc: "Играбельные 60 FPS при поддержке DLSS Performance." }
    };
  }, [cpu]);

  // Find direct rival CPUs (same price tier or generation)
  const rivalCpus = useMemo(() => {
    return cpus
      .filter((c) => c.id !== cpu.id)
      .map((c) => ({
        cpu: c,
        diff: Math.abs(c.singleCoreScore - cpu.singleCoreScore) + Math.abs(c.multiCoreScore - cpu.multiCoreScore) / 10
      }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 4)
      .map((item) => item.cpu);
  }, [cpus, cpu]);

  // Copy share link helper
  const handleCopyLink = () => {
    const slug = getHardwareSlug(cpu);
    const url = `${window.location.origin}${window.location.pathname}?page=cpu&id=${slug}`;
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("Ссылка на процессор скопирована!", cpu.name);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast("Скопировано!", url);
    }
  };

  const isIntel = cpu.manufacturer === "Intel";
  const brandColor = isIntel ? "#0071C5" : "#ED1C24";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-8 text-[#1E2022] dark:text-white animate-fadeIn">
      
      {/* Dynamic Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleBackFromCpuDetail}
          className="group flex items-center gap-2 text-xs font-black text-gray-500 dark:text-gray-400 hover:text-[#1E2022] dark:hover:text-white transition active:scale-95"
        >
          <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-[#E88D9F] group-hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>{backLabel}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#E88D9F]/15 text-[#E88D9F] font-black px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            База знаний KENSEI • Паспорт Процессора
          </span>
        </div>
      </div>

      {/* HERO BANNER CARD */}
      <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col gap-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Brand Logo Box */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center text-white font-black text-sm shadow-xl shrink-0 border border-white/20 transition-transform hover:scale-105 duration-200"
              style={{ backgroundColor: brandColor, boxShadow: `0 10px 25px -5px ${brandColor}40` }}
            >
              <span className="text-[10px] opacity-80 uppercase tracking-widest">{cpu.manufacturer}</span>
              <span className="text-sm sm:text-base font-mono leading-none mt-1">{cpu.socket}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border" style={{ backgroundColor: `${brandColor}15`, color: brandColor, borderColor: `${brandColor}30` }}>
                  {cpu.manufacturer}
                </span>
                <span className="text-[10px] bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-md font-extrabold text-gray-600 dark:text-gray-300">
                  Сокет {cpu.socket}
                </span>
                <span className="text-[10px] bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-md font-extrabold text-gray-600 dark:text-gray-300">
                  {cpu.releaseYear} г.
                </span>
                {cpu.is3DVCache && (
                  <span className="text-[10px] bg-[#E88D9F] text-white px-2.5 py-0.5 rounded-md font-black tracking-wider uppercase shadow-xs flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" /> 3D V-Cache Boost
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1E2022] dark:text-white">
                {cpu.name}
              </h1>

              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                Процессор {cpu.manufacturer} {cpu.name} ({cpu.cores} Ядер / {cpu.threads} Потоков) на микроархитектуре {techDetails.architectureCodename}. TDP {cpu.tdpW}W, сокет {cpu.socket}.
              </p>
            </div>
          </div>

          {/* MSRP / Price Callout */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-2 border-t lg:border-t-0 border-black/10 dark:border-white/10 pt-4 lg:pt-0 shrink-0">
            <div className="text-left lg:text-right">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Рекомендованная цена (MSRP)</span>
              <div className="text-2xl sm:text-3xl font-black text-[#E88D9F] font-mono mt-0.5">
                {cpu.launchMsrp ? formatPrice(cpu.launchMsrp) : "Договорная"}
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" /> Калибровка данных 2026
            </span>
          </div>
        </div>

        {/* UNIFIED ACTION TOOLBAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-black/10 dark:border-white/10 pt-5">
          {/* Action 1: Test in Simulator */}
          <button
            onClick={() => {
              setSelectedCpu(cpu);
              setActivePage("simulator");
              setCurrentStep(1);
            }}
            className="p-3 rounded-2xl bg-[#E88D9F] text-white hover:bg-[#E88D9F]/90 active:scale-97 transition-all duration-200 shadow-md font-black text-xs flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Тестировать в Симуляторе</span>
          </button>

          {/* Action 2: Compare Page */}
          <button
            onClick={() => {
              setActivePage("compare");
            }}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1E2022] dark:text-white active:scale-97 transition-all duration-200 font-black text-xs flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
          >
            <Scale className="w-4 h-4 text-[#8A9A86]" />
            <span>Сравнить в Таблице</span>
          </button>

          {/* Action 3: Buy / Find Offers */}
          <button
            onClick={() => {
              handleOpenHardwareOffersModal({
                name: cpu.name,
                manufacturer: cpu.manufacturer,
                type: "cpu",
                launchMsrp: cpu.launchMsrp,
                socket: cpu.socket
              });
            }}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1E2022] dark:text-white active:scale-97 transition-all duration-200 font-black text-xs flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-500" />
            <span>Найти Предложения</span>
          </button>

          {/* Action 4: Copy Shareable Link */}
          <button
            onClick={handleCopyLink}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1E2022] dark:text-white active:scale-97 transition-all duration-200 font-black text-xs flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-[#E88D9F]" />}
            <span>{copied ? "Ссылка Скопирована!" : "Поделиться"}</span>
          </button>
        </div>
      </div>

      {/* TELEMETRY BENCHMARK DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* HERO TELEMETRY CARDS (lg:col-span-6) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Single-Core Telemetry Card */}
          <div className="glass-card rounded-3xl p-5 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#8A9A86]/15 text-[#8A9A86] flex items-center justify-center font-black">
                  <CpuIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase text-gray-500">Geekbench 6 Single</span>
              </div>
              <span className="text-xs font-mono font-black bg-[#8A9A86]/15 text-[#8A9A86] px-2.5 py-0.5 rounded-lg">
                Топ #{singleRank}
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-[#1E2022] dark:text-white font-mono">{cpu.singleCoreScore} pts</div>
              <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-[#8A9A86] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (cpu.singleCoreScore / singleMax) * 100)}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] font-bold text-gray-400">
              Одноядерный потенциал в играх
            </div>
          </div>

          {/* Multi-Core Telemetry Card */}
          <div className="glass-card rounded-3xl p-5 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E88D9F]/15 text-[#E88D9F] flex items-center justify-center font-black">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase text-gray-500">Geekbench 6 Multi</span>
              </div>
              <span className="text-xs font-mono font-black bg-[#E88D9F]/15 text-[#E88D9F] px-2.5 py-0.5 rounded-lg">
                Топ #{multiRank}
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-[#1E2022] dark:text-white font-mono">{cpu.multiCoreScore} pts</div>
              <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-[#E88D9F] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (cpu.multiCoreScore / multiMax) * 100)}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] font-bold text-gray-400">
              Рендеринг, 3D и кодирование
            </div>
          </div>

        </div>

        {/* SECONDARY BENCHMARKS GRID (lg:col-span-6) */}
        <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-sm flex flex-col justify-between gap-1">
            <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Cinebench R23 1-Core
            </span>
            <span className="text-lg font-black text-amber-500 font-mono mt-1">
              {cpu.cinebenchR23Single ? `${cpu.cinebenchR23Single}` : `${Math.round(cpu.singleCoreScore * 0.85)}`} pts
            </span>
            <span className="text-[10px] font-bold text-gray-400">1-ядерный рендер</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-sm flex flex-col justify-between gap-1">
            <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Cinebench R23 Multi
            </span>
            <span className="text-lg font-black text-indigo-400 font-mono mt-1">
              {cpu.cinebenchR23Multi ? `${cpu.cinebenchR23Multi}` : `${Math.round(cpu.multiCoreScore * 0.88)}`} pts
            </span>
            <span className="text-[10px] font-bold text-gray-400">Многопоточный рендер</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-sm flex flex-col justify-between gap-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> PassMark CPU Mark
            </span>
            <span className="text-lg font-black text-emerald-500 font-mono mt-1">
              {cpu.passmarkScore ? `${cpu.passmarkScore}` : `${Math.round(cpu.multiCoreScore * 1.45)}`} pts
            </span>
            <span className="text-[10px] font-bold text-gray-400">Сводный балл</span>
          </div>
        </div>

      </div>

      {/* REFACTORED STRUCTURED SPECIFICATIONS (4 CLEAN CATEGORIES) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#E88D9F]/15 text-[#E88D9F] flex items-center justify-center font-black shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-[#1E2022] dark:text-white">
              Технические Спецификации Процессора
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
              Полный структурированный паспорт кремния и системного контроллера
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* CATEGORY 1: КРИСТАЛЛ И АРХИТЕКТУРА */}
          <div className="p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-[#E88D9F] tracking-wider flex items-center gap-2">
              <Dna className="w-4 h-4 text-[#E88D9F]" /> Кристалл и Архитектура
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Микроархитектура</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.architectureCodename}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Разработчик (Designer)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.designer}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Сегмент рынка</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.marketSegment}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Техпроцесс (Lithography)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.processNode}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Площадь кристалла (Die Size)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.dieSize}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">64-битная архитектура</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.is64Bit ? "Да (x86-64)" : "Нет"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Windows 11 Совместимость</span>
                <span className={`font-mono flex items-center gap-1 ${techDetails.win11Compat ? "text-emerald-500" : "text-amber-500"}`}>
                  {techDetails.win11Compat ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {techDetails.win11Compat ? "Поддерживается" : "Не поддерживается"}
                </span>
              </div>
            </div>
          </div>

          {/* CATEGORY 2: ЯДРА, ЧАСТОТЫ И КЕШ */}
          <div className="p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-[#8A9A86] tracking-wider flex items-center gap-2">
              <CpuIcon className="w-4 h-4 text-[#8A9A86]" /> Ядра, Частоты и Кеш-Память
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Формула Ядер / Потоков</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{cpu.cores} Ядер / {cpu.threads} Потоков</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Базовая частота (Base Clock)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.baseClock}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Макс. турбо-частота (Boost)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.boostClock}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Многопоточность (SMT / HT)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.hyperThreading ? "Поддерживается" : "Нет"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Кеш L1 / L2</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.l1Cache} / {techDetails.l2Cache}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Объем L3 Кеша</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.l3Cache}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">3D V-Cache Технология</span>
                <span className={`font-mono ${cpu.is3DVCache ? "text-emerald-500 font-black" : "text-gray-400"}`}>
                  {cpu.is3DVCache ? "Да (Стек L3 кеша)" : "Отсутствует"}
                </span>
              </div>
            </div>
          </div>

          {/* CATEGORY 3: ПАМЯТЬ, PCIE И ГРАФИКА */}
          <div className="p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-400" /> Контроллер ОЗУ и PCIe I/O
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Поддерживаемая память</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{cpu.supportedDdr.join(" / ")}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Макс. стандартная частота</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.memorySupport}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Макс. объем памяти</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.maxMemorySize}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Каналы / ПСП памяти</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.memoryChannels} ({techDetails.memoryBandwidth})</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Шина PCIe & Линии</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.pcieVersion} ({techDetails.pcieLanes})</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Встроенная графика (iGPU)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.iGpuModel}</span>
              </div>
            </div>
          </div>

          {/* CATEGORY 4: ПИТАНИЕ, ТЕПЛО И ИНСТРУКЦИИ */}
          <div className="p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> Сокет, Теплопакет & Безопасность
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Процессорный сокет</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.socket}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Теплопакет (TDP) / TjMax</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.powerDrawTdp} (TjMax {techDetails.maxTemp})</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Рекомендуемый БП</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.recommendedPsu}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Шифрование AES-NI</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.aesNi ? "Поддерживается" : "Нет"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">ИИ-ускорение (DL Boost)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.dlBoost ? "Поддерживается" : "Нет"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Виртуализация (VT-x / AMD-V)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.virtualization ? "Поддерживается" : "Нет"}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* DYNAMIC ACCURATE GPU PAIRINGS MATRIX */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#76B900]/15 text-[#76B900] flex items-center justify-center font-black shrink-0">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-[#1E2022] dark:text-white">
              Рекомендуемые Видеокарты в Связку
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
              Калиброванные графические связки под чипсетовый потенциал процессора
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
          {/* 1080p */}
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="text-[#1E2022] dark:text-white font-black">1080p Full HD Игры</span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded font-black">
                {gpuPairings.res1080p.tag}
              </span>
            </div>
            <div className="text-sm font-black font-mono text-[#E88D9F] mt-1">{gpuPairings.res1080p.gpu}</div>
            <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
              {gpuPairings.res1080p.desc}
            </p>
          </div>

          {/* 1440p */}
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="text-[#1E2022] dark:text-white font-black">1440p QHD Игры</span>
              <span className="text-[10px] bg-[#E88D9F]/15 text-[#E88D9F] px-2 py-0.5 rounded font-black">
                {gpuPairings.res1440p.tag}
              </span>
            </div>
            <div className="text-sm font-black font-mono text-[#E88D9F] mt-1">{gpuPairings.res1440p.gpu}</div>
            <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
              {gpuPairings.res1440p.desc}
            </p>
          </div>

          {/* 4K */}
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="text-[#1E2022] dark:text-white font-black">4K Ultra HD Игры</span>
              <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded font-black">
                {gpuPairings.res4K.tag}
              </span>
            </div>
            <div className="text-sm font-black font-mono text-[#E88D9F] mt-1">{gpuPairings.res4K.gpu}</div>
            <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
              {gpuPairings.res4K.desc}
            </p>
          </div>
        </div>
      </div>

      {/* DIRECT RIVALS & ALTERNATIVE PROCESSORS GRID */}
      {rivalCpus.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8A9A86]/15 text-[#8A9A86] flex items-center justify-center font-black shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-[#1E2022] dark:text-white">
                  Ближайшие Конкуренты и Альтернативы
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
                  Похожие процессоры в том же ценовом или производительном сегменте
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rivalCpus.map((rival) => {
              const rivalIntel = rival.manufacturer === "Intel";
              const rColor = rivalIntel ? "#0071C5" : "#ED1C24";
              return (
                <button
                  key={rival.id}
                  onClick={() => handleOpenCpuDetail(rival)}
                  className="group text-left p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-[#E88D9F]/50 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between gap-3 active:scale-97 shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border" style={{ backgroundColor: `${rColor}15`, color: rColor, borderColor: `${rColor}30` }}>
                      {rival.manufacturer}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 font-bold">
                      Socket {rival.socket}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-black text-xs text-[#1E2022] dark:text-white group-hover:text-[#E88D9F] transition truncate">
                      {rival.name}
                    </h5>
                    <p className="text-[10px] text-gray-500 font-extrabold mt-0.5">
                      {rival.cores}C / {rival.threads}T • {rival.releaseYear} г.
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-2 text-[10px] font-mono font-bold text-gray-500">
                    <span>{rival.singleCoreScore} SC</span>
                    <span>{rival.multiCoreScore} MC</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
