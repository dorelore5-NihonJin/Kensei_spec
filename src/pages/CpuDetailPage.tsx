import { useState, useMemo } from "react";
import { useHardware } from "../context/HardwareContext";
import { useLanguage } from "../context/LanguageContext";
import { getCpuTechnicalDetails } from "../lib/hardwareSpecs";
import { getHardwareSlug, findCpuBySlugOrId } from "../lib/slugs";
import {
  Cpu,
  Zap,
  Flame,
  Scale,
  ShoppingCart,
  Share2,
  Check,
  ChevronRight,
  ArrowLeft,
  Tv,
  Activity
} from "lucide-react";

export default function CpuDetailPage() {
  const {
    cpus,
    gpus,
    selectedCpuDetailId,
    setSelectedCpu,
    setActivePage,
    setCurrentStep,
    setIsBuyModalOpen,
    handleOpenCpuDetail,
    showToast
  } = useHardware();
  const { formatPrice } = useLanguage();

  const [copied, setCopied] = useState(false);

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

  const techDetails = getCpuTechnicalDetails(cpu, gpus);

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
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setActivePage("simulator")}
          className="group flex items-center gap-2 text-xs font-black text-gray-500 dark:text-gray-400 hover:text-[#1E2022] dark:hover:text-white transition active:scale-95"
        >
          <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-[#E88D9F] group-hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>Назад в Симулятор</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#E88D9F]/15 text-[#E88D9F] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            База знаний процессоров KENSEI
          </span>
        </div>
      </div>

      {/* HERO BANNER CARD */}
      <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col gap-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Brand Logo Box */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center text-white font-black text-sm shadow-xl shrink-0 border border-white/20"
              style={{ backgroundColor: brandColor }}
            >
              <span className="text-[10px] opacity-80 uppercase tracking-wider">{cpu.manufacturer}</span>
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
                  <span className="text-[10px] bg-[#E88D9F] text-white px-2.5 py-0.5 rounded-md font-black tracking-wider uppercase shadow-xs">
                    3D V-Cache Boost
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1E2022] dark:text-white">
                {cpu.name}
              </h1>

              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 max-w-2xl">
                Процессор {cpu.manufacturer} {cpu.name} ({cpu.cores} Ядер / {cpu.threads} Потоков) на архитектуре {techDetails.architectureCodename}. TDP {cpu.tdpW}W, сокет {cpu.socket}.
              </p>
            </div>
          </div>

          {/* MSRP / Price Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-2 border-t lg:border-t-0 border-black/10 dark:border-white/10 pt-4 lg:pt-0 shrink-0">
            <div className="text-left lg:text-right">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Рекомендованная цена (MSRP)</span>
              <div className="text-2xl sm:text-3xl font-black text-[#E88D9F] font-mono mt-0.5">
                {cpu.launchMsrp ? formatPrice(cpu.launchMsrp) : "Договорная"}
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              ✓ Данные калиброваны 2026
            </span>
          </div>
        </div>

        {/* ACTION TOOLBAR BUTTONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-black/10 dark:border-white/10 pt-5">
          {/* Action 1: Test in Simulator */}
          <button
            onClick={() => {
              setSelectedCpu(cpu);
              setActivePage("simulator");
              setCurrentStep(1);
            }}
            className="p-3 rounded-2xl bg-[#E88D9F] text-white hover:bg-[#E88D9F]/90 active:scale-95 transition shadow-lg shadow-[#E88D9F]/20 font-black text-xs flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Тестировать в Симуляторе</span>
          </button>

          {/* Action 2: Compare Page */}
          <button
            onClick={() => {
              setActivePage("compare");
            }}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1E2022] dark:text-white active:scale-95 transition font-black text-xs flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
          >
            <Scale className="w-4 h-4 text-[#8A9A86]" />
            <span>Сравнить в Таблице</span>
          </button>

          {/* Action 3: Buy Build */}
          <button
            onClick={() => {
              setSelectedCpu(cpu);
              setIsBuyModalOpen(true);
            }}
            className="p-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition font-black text-xs flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Найти Предложения</span>
          </button>

          {/* Action 4: Copy Shareable Link */}
          <button
            onClick={handleCopyLink}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1E2022] dark:text-white active:scale-95 transition font-black text-xs flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-[#E88D9F]" />}
            <span>{copied ? "Ссылка Скопирована!" : "Поделиться"}</span>
          </button>
        </div>
      </div>

      {/* CORE TELEMETRY METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Single-Core Power */}
        <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#8A9A86]/15 text-[#8A9A86] flex items-center justify-center font-black">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-gray-500">Одноядерный Балл</h4>
                <span className="text-lg font-black text-[#1E2022] dark:text-white font-mono">{cpu.singleCoreScore} pts</span>
              </div>
            </div>
            <span className="text-xs font-mono font-black bg-[#8A9A86]/15 text-[#8A9A86] px-2.5 py-1 rounded-lg">
              Топ #{singleRank}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#8A9A86] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (cpu.singleCoreScore / singleMax) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-400">
              <span>Производительность в играх (1 ядро)</span>
              <span>{Math.round((cpu.singleCoreScore / singleMax) * 100)}% от максимума</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Multi-Core Workload */}
        <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E88D9F]/15 text-[#E88D9F] flex items-center justify-center font-black">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-gray-500">Многоядерный Балл</h4>
                <span className="text-lg font-black text-[#1E2022] dark:text-white font-mono">{cpu.multiCoreScore} pts</span>
              </div>
            </div>
            <span className="text-xs font-mono font-black bg-[#E88D9F]/15 text-[#E88D9F] px-2.5 py-1 rounded-lg">
              Топ #{multiRank}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#E88D9F] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (cpu.multiCoreScore / multiMax) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-400">
              <span>Рендеринг / Кодирование / 3D</span>
              <span>{Math.round((cpu.multiCoreScore / multiMax) * 100)}% от максимума</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Power Efficiency & Cooling */}
        <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-gray-500">Теплопакет (TDP)</h4>
                <span className="text-lg font-black text-[#1E2022] dark:text-white font-mono">{cpu.tdpW}W</span>
              </div>
            </div>
            <span className="text-xs font-mono font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg">
              {cpu.tdpW >= 125 ? "СЖО 240/360mm" : "Воздушный кулер"}
            </span>
          </div>

          <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
            Рекомендуемый БП: <strong className="text-[#1E2022] dark:text-white">{techDetails.recommendedPsu}</strong>.
          </div>
        </div>
      </div>

      {/* DETAILED TECHNICAL SPECIFICATIONS TABLE */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#E88D9F]/15 text-[#E88D9F] flex items-center justify-center font-black shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-[#1E2022] dark:text-white">
              Полные Технические Характеристики
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
              Подробная спецификация кремниевого кристалла, кеш-памяти и контроллера ОЗУ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Spec Group 1: Architecture & Cores */}
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-[#E88D9F] tracking-wider flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4" /> Архитектура и Ядра
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Микроархитектура</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.architectureCodename}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Количество ядер</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{cpu.cores} Ядер</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Количество потоков</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{cpu.threads} Потоков</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Техпроцесс</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.processNode}</span>
              </div>
            </div>
          </div>

          {/* Spec Group 2: Clocks & Cache */}
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-[#8A9A86] tracking-wider flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4" /> Частоты и Кеш-Память
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Базовая частота</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.baseClock}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Максимальная частота (Boost)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.boostClock}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Объем L3 Кеша</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.l3Cache}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Технология 3D V-Cache</span>
                <span className={`font-mono ${cpu.is3DVCache ? "text-emerald-500 font-black" : "text-gray-400"}`}>
                  {cpu.is3DVCache ? "Да (Дополнительный стек кеша)" : "Нет"}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Встроенная графика (iGPU)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.iGpuModel}</span>
              </div>
            </div>
          </div>

          {/* Spec Group 3: Memory & Bus */}
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4" /> Память и Системная Шина
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Поддержка типов ОЗУ</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{cpu.supportedDdr.join(" / ")}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Макс. объем ОЗУ</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.maxMemorySize}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Линии PCIe</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.pcieLanes} ({techDetails.pcieVersion})</span>
              </div>
            </div>
          </div>

          {/* Spec Group 4: Platform & Power */}
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4" /> Сокет и Питание
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Сокет процессорного гнезда</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{cpu.socket}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Теплопакет (TDP)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{cpu.tdpW}W</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500">Рекомендуемый БП</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.recommendedPsu}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED GPU PAIRINGS MATRIX */}
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
              Оптимальный баланс кремния без искусственного боттлнека для разных разрешений
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="text-[#1E2022] dark:text-white font-black">1080p Full HD Игры</span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded font-black">Киберспорт</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
              Рекомендуются видеокарты уровня RTX 4060 / RX 7600. Высокая частота кадров в CS2, Valorant, Overwatch 2.
            </p>
          </div>

          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="text-[#1E2022] dark:text-white font-black">1440p QHD Игры</span>
              <span className="text-[10px] bg-[#E88D9F]/15 text-[#E88D9F] px-2 py-0.5 rounded font-black">Баланс</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
              Рекомендуются видеокарты уровня RTX 4070 Super / RX 7800 XT. Баланс графики в AAA-играх.
            </p>
          </div>

          <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="text-[#1E2022] dark:text-white font-black">4K Ultra HD Игры</span>
              <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded font-black">Максимум</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">
              Рекомендуются видеокарты уровня RTX 4080 Super / RTX 5090. Нагрузка ложится на графические блоки.
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
                  className="group text-left p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-[#E88D9F]/50 transition duration-200 flex flex-col justify-between gap-3 active:scale-95"
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
