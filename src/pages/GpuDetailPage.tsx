import { useState, useMemo } from "react";
import { useHardware } from "../context/HardwareContext";
import { useLanguage } from "../context/LanguageContext";
import { getGpuTechnicalDetails, getRecommendedCpusForGpu } from "../lib/hardwareSpecs";
import { getHardwareSlug, findGpuBySlugOrId } from "../lib/slugs";
import { calculateGpuTelemetryApi } from "../lib/calculator";
import {
  Zap,
  Scale,
  ShoppingCart,
  Share2,
  Check,
  ArrowLeft,
  Tv,
  Dna,
  HardDrive,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  Monitor,
  Video,
  Flame,
  Gamepad2,
  Cpu
} from "lucide-react";

export default function GpuDetailPage() {
  const {
    cpus,
    gpus,
    games,
    ramProfiles,
    selectedGpuDetailId,
    setSelectedGpu,
    setActivePage,
    setCurrentStep,
    handleOpenHardwareOffersModal,
    handleOpenCpuDetail,
    handleOpenGpuDetail,
    previousPage,
    handleBackFromCpuDetail,
    showToast
  } = useHardware();
  const { lang, formatPrice } = useLanguage();

  const [copied, setCopied] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<"1080p" | "1440p" | "4K">("1440p");

  const t = useMemo(() => {
    const isEn = lang === "en";
    const isJa = lang === "ja";
    return {
      backRankings: isEn ? "Back to Rankings" : isJa ? "ランキングに戻る" : "Назад в Рейтинг",
      backCompare: isEn ? "Back to Comparison" : isJa ? "比較に戻る" : "Назад в Сравнение",
      backCatalog: isEn ? "Back to Catalog" : isJa ? "カタログに戻る" : "Назад в Каталог",
      backSimulator: isEn ? "Back to Simulator" : isJa ? "シミュレーターに戻る" : "Назад в Симулятор",
      notFoundTitle: isEn ? "GPU Not Found" : isJa ? "グラフィックボードが見つかりません" : "Видеокарта не найдена",
      returnSimulator: isEn ? "Return to Simulator" : isJa ? "シミュレーターに戻る" : "Вернуться в Симулятор",
      passportBadge: isEn ? "KENSEI Knowledge Base • GPU Passport" : isJa ? "KENSEI ナレッジベース • グラフィックボードパスポート" : "База знаний KENSEI • Паспорт Видеокарты",
      vram: isEn ? "VRAM" : isJa ? "VRAM メモリ" : "Видеопамять",
      bus: isEn ? "Memory Bus" : isJa ? "メモリバス" : "Шина",
      tdp: isEn ? "TDP" : isJa ? "TDP 消費電力" : "Теплопакет",
      msrp: isEn ? "Launch MSRP" : isJa ? "メーカー希望小売価格 (MSRP)" : "Рекомендованная цена (MSRP)",
      negotiable: isEn ? "Market Price" : isJa ? "時価" : "Договорная",
      calibNotice: isEn ? "2026 Telemetry Calibration" : isJa ? "2026年テレメトリキャリブレーション" : "Калибровка данных 2026",
      btnTestSim: isEn ? "Select for Simulator" : isJa ? "シミュレーターで選択" : "Тестировать в Симуляторе",
      btnCompare: isEn ? "Compare in Matrix" : isJa ? "マトリックスで比較" : "Сравнить в Таблице",
      btnOffers: isEn ? "Find Offers" : isJa ? "オファーを探す" : "Найти Предложения",
      btnShare: isEn ? "Share" : isJa ? "共有する" : "Поделиться",
      btnShared: isEn ? "Link Copied!" : isJa ? "リンクがコピーされました！" : "Ссылка Скопирована!",
      noticeHeader: isEn ? "IMPORTANT KENSEI TELEMETRY NOTICE:" : isJa ? "KENSEI テレメトリに関する重要なお知らせ:" : "ВАЖНОЕ ПРИМЕЧАНИЕ О ТЕЛЕМЕТРИИ KENSEI ENGINE:",
      noticeBody: isEn
        ? "All FPS figures are calculated on an unthrottled KENSEI testbench (Ryzen 7 7800X3D / Core i7-14700K + 32GB DDR5). Older CPUs will bottleneck this GPU and lower real-world FPS."
        : isJa
        ? "すべてのFPS数値は、ボトルネックのないKENSEIリファレンスベンチ（Ryzen 7 7800X3D / Core i7-14700K + 32GB DDR5）で計算されています。古いCPUを使用する場合、プロセッサのボトルネックにより実際のFPSが低くなる可能性があります。"
        : "Все показатели FPS рассчитаны на эталонном тестовом стенде KENSEI без процессора-боттлнека (Ryzen 7 7800X3D / Core i7-14700K + 32GB DDR5). При использовании более старых процессоров реальный FPS может быть ниже из-за процессорного боттлнека.",
      cpuPairingTitle: isEn ? "Recommended CPUs to Pair with" : isJa ? "推奨ペアリングCPU:" : "Рекомендуемые Процессоры для",
      cpuPairingDesc: isEn
        ? "KENSEI Smart Algorithm analyzed GPU throughput to compute optimal bottleneck-free CPUs:"
        : isJa
        ? "KENSEIスマートアルゴリズムがGPUのスループットを分析し、最適なCPUを計算しました:"
        : "Умный алгоритм KENSEI проанализировал пропускную способность видеокарты и рассчитал оптимальные CPU:",
      catFlagship: isEn ? "🏆 Flagship Gaming Choice (0% Bottleneck)" : isJa ? "🏆 フラグシップゲーム推奨 (ボトルネック 0%)" : "🏆 Флагманский Игровой Выбор (0% Боттлнека)",
      catOptimal: isEn ? "⚖️ Optimal Price/FPS Balance" : isJa ? "⚖️ 最適なコスパバランス" : "⚖️ Оптимальный Баланс (Цена / FPS)",
      catMin: isEn ? "💡 Minimum Recommended CPU" : isJa ? "💡 最低推奨CPU" : "💡 Минимально Рекомендуемый CPU",
      bottleneck: isEn ? "Bottleneck" : isJa ? "ボトルネック" : "Боттлнек",
      viewCpu: isEn ? "Detailed CPU view →" : isJa ? "プロセッサの詳細を見る →" : "Подробнее о процессоре →"
    };
  }, [lang]);

  const backLabel = useMemo(() => {
    if (previousPage === "rankings") return t.backRankings;
    if (previousPage === "compare") return t.backCompare;
    if (previousPage === "catalog") return t.backCatalog;
    return t.backSimulator;
  }, [previousPage, t]);

  // Resolve target GPU from selectedGpuDetailId or URL
  const gpu = useMemo(() => {
    if (selectedGpuDetailId) {
      const match = findGpuBySlugOrId(gpus, selectedGpuDetailId);
      if (match) return match;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id") || urlParams.get("gpu");
    if (idParam) {
      const match = findGpuBySlugOrId(gpus, idParam);
      if (match) return match;
    }
    return gpus[0] || null;
  }, [gpus, selectedGpuDetailId]);

  if (!gpu) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-black text-gray-400">Видеокарта не найдена</h2>
        <button
          onClick={() => setActivePage("simulator")}
          className="mt-4 px-6 py-2.5 bg-[#1E2022] text-white rounded-xl text-xs font-black"
        >
          Вернуться в Симулятор
        </button>
      </div>
    );
  }

  const techDetails = getGpuTechnicalDetails(gpu, gpus);

  // Compute rankings & percentiles among database GPUs
  const { gpuRank, rtRank, powerMax, rtMax } = useMemo(() => {
    if (!gpus || gpus.length === 0) {
      return { gpuRank: 1, rtRank: 1, powerMax: 100, rtMax: 100 };
    }
    const sortedPower = [...gpus].sort((a, b) => b.relativePowerScore - a.relativePowerScore);
    const sortedRt = [...gpus].sort((a, b) => b.rayTracingPowerScore - a.rayTracingPowerScore);

    const gRank = sortedPower.findIndex((g) => g.id === gpu.id) + 1;
    const rRank = sortedRt.findIndex((g) => g.id === gpu.id) + 1;

    const pMax = sortedPower[0]?.relativePowerScore || 100;
    const rMax = sortedRt[0]?.rayTracingPowerScore || 100;

    return {
      gpuRank: gRank > 0 ? gRank : 1,
      rtRank: rRank > 0 ? rRank : 1,
      powerMax: pMax,
      rtMax: rMax
    };
  }, [gpus, gpu]);

  // Find direct rival GPUs (same performance tier)
  const rivalGpus = useMemo(() => {
    return gpus
      .filter((g) => g.id !== gpu.id)
      .map((g) => ({
        gpu: g,
        diff: Math.abs(g.relativePowerScore - gpu.relativePowerScore) + Math.abs(g.vramGB - gpu.vramGB) * 2
      }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 4)
      .map((item) => item.gpu);
  }, [gpus, gpu]);

  // Copy share link helper
  const handleCopyLink = () => {
    const slug = getHardwareSlug(gpu);
    const url = `${window.location.origin}${window.location.pathname}?page=gpu&id=${slug}`;
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("Ссылка на видеокарту скопирована!", gpu.name);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast("Скопировано!", url);
    }
  };

  const isNvidia = gpu.manufacturer === "NVIDIA";
  const isAmd = gpu.manufacturer === "AMD";
  const isIntel = gpu.manufacturer === "Intel";

  const brandColor = isNvidia ? "#76B900" : isAmd ? "#ED1C24" : isIntel ? "#0071C5" : "#555555";

  // Official Physics Telemetry Engine API Data
  const telemetryApiData = useMemo(() => {
    return calculateGpuTelemetryApi(gpu, cpus, games, ramProfiles);
  }, [gpu, cpus, games, ramProfiles]);

  const currentResTelemetry = telemetryApiData[selectedResolution];

  // Smart CPU Pairing Recommendations for Unlocking GPU Potential
  const recommendedCpus = useMemo(() => {
    return getRecommendedCpusForGpu(gpu, cpus);
  }, [gpu, cpus]);

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
            База знаний KENSEI • Паспорт Видеокарты
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
              <span className="text-[10px] opacity-80 uppercase tracking-widest">{gpu.manufacturer}</span>
              <span className="text-sm sm:text-base font-mono leading-none mt-1">{gpu.vramGB} GB</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border" style={{ backgroundColor: `${brandColor}15`, color: brandColor, borderColor: `${brandColor}30` }}>
                  {gpu.manufacturer}
                </span>
                <span className="text-[10px] bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-md font-extrabold text-gray-600 dark:text-gray-300">
                  {gpu.vramGB} GB VRAM ({techDetails.memoryType})
                </span>
                <span className="text-[10px] bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-md font-extrabold text-gray-600 dark:text-gray-300">
                  {techDetails.architectureCodename}
                </span>
                <span className="text-[10px] bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-md font-extrabold text-gray-600 dark:text-gray-300">
                  {gpu.releaseYear} г.
                </span>
                {gpu.rayTracingPowerScore >= 60 && (
                  <span className="text-[10px] bg-emerald-500 text-white px-2.5 py-0.5 rounded-md font-black tracking-wider uppercase shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-current" /> Ray Tracing Pro
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1E2022] dark:text-white">
                {gpu.name}
              </h1>

              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                Видеокарта {gpu.manufacturer} {gpu.name} ({gpu.vramGB} GB {techDetails.memoryType}) на архитектуре {techDetails.architectureCodename} ({techDetails.processNode}). TDP {gpu.tdpW}W, интерфейс {techDetails.interface}.
              </p>
            </div>
          </div>

          {/* MSRP / Price Callout */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-2 border-t lg:border-t-0 border-black/10 dark:border-white/10 pt-4 lg:pt-0 shrink-0">
            <div className="text-left lg:text-right">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{t.msrp}</span>
              <div className="text-2xl sm:text-3xl font-black text-[#E88D9F] font-mono mt-0.5">
                {gpu.launchMsrp ? formatPrice(gpu.launchMsrp) : t.negotiable}
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" /> {t.calibNotice}
            </span>
          </div>
        </div>

        {/* UNIFIED ACTION TOOLBAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-black/10 dark:border-white/10 pt-5">
          {/* Action 1: Test in Simulator */}
          <button
            onClick={() => {
              setSelectedGpu(gpu);
              setActivePage("simulator");
              setCurrentStep(2);
            }}
            className="p-3 rounded-2xl bg-[#E88D9F] text-white hover:bg-[#E88D9F]/90 active:scale-97 transition-all duration-200 shadow-md font-black text-xs flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{t.btnTestSim}</span>
          </button>

          {/* Action 2: Compare Page */}
          <button
            onClick={() => {
              setActivePage("compare");
            }}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1E2022] dark:text-white active:scale-97 transition-all duration-200 font-black text-xs flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
          >
            <Scale className="w-4 h-4 text-[#8A9A86]" />
            <span>{t.btnCompare}</span>
          </button>

          {/* Action 3: Buy / Find Offers */}
          <button
            onClick={() => {
              handleOpenHardwareOffersModal({
                name: gpu.name,
                manufacturer: gpu.manufacturer,
                type: "gpu",
                launchMsrp: gpu.launchMsrp,
                vramGB: gpu.vramGB
              });
            }}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1E2022] dark:text-white active:scale-97 transition-all duration-200 font-black text-xs flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-500" />
            <span>{t.btnOffers}</span>
          </button>

          {/* Action 4: Copy Shareable Link */}
          <button
            onClick={handleCopyLink}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#1E2022] dark:text-white active:scale-97 transition-all duration-200 font-black text-xs flex items-center justify-center gap-2 border border-black/10 dark:border-white/10"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-[#E88D9F]" />}
            <span>{copied ? t.btnShared : t.btnShare}</span>
          </button>
        </div>
      </div>

      {/* TELEMETRY BENCHMARK DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* HERO TELEMETRY CARDS (lg:col-span-6) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 3D Relative Power Card */}
          <div className="glass-card rounded-3xl p-5 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#8A9A86]/15 text-[#8A9A86] flex items-center justify-center font-black">
                  <Tv className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase text-gray-500">Индекс Производительности</span>
              </div>
              <span className="text-xs font-mono font-black bg-[#8A9A86]/15 text-[#8A9A86] px-2.5 py-0.5 rounded-lg">
                Топ #{gpuRank}
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-[#1E2022] dark:text-white font-mono">{gpu.relativePowerScore} pts</div>
              <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-[#8A9A86] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (gpu.relativePowerScore / powerMax) * 100)}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] font-bold text-gray-400">
              Графический потенциал в 3D (Kensei Silicon Index)
            </div>
          </div>

          {/* Ray Tracing Telemetry Card */}
          <div className="glass-card rounded-3xl p-5 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-lg flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E88D9F]/15 text-[#E88D9F] flex items-center justify-center font-black">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase text-gray-500">Трассировка Лучей (RT)</span>
              </div>
              <span className="text-xs font-mono font-black bg-[#E88D9F]/15 text-[#E88D9F] px-2.5 py-0.5 rounded-lg">
                Топ #{rtRank}
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-[#1E2022] dark:text-white font-mono">{gpu.rayTracingPowerScore} pts</div>
              <div className="w-full bg-gray-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-[#E88D9F] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (gpu.rayTracingPowerScore / rtMax) * 100)}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] font-bold text-gray-400">
              Аппаратный Ray Tracing & Патчевый рендер
            </div>
          </div>

        </div>

        {/* SECONDARY BENCHMARKS GRID (lg:col-span-6) */}
        <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-sm flex flex-col justify-between gap-1">
            <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> TimeSpy Graphics
            </span>
            <span className="text-lg font-black text-indigo-400 font-mono mt-1">
              {gpu.timeSpyGraphicsScore ? `${gpu.timeSpyGraphicsScore}` : `${Math.round(gpu.relativePowerScore * 280)}`} pts
            </span>
            <span className="text-[10px] font-bold text-gray-400">DirectX 12 3DMark</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-sm flex flex-col justify-between gap-1">
            <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E88D9F]" /> Port Royal (RT)
            </span>
            <span className="text-lg font-black text-[#E88D9F] font-mono mt-1">
              {gpu.portRoyalScore ? `${gpu.portRoyalScore}` : `${Math.round(gpu.rayTracingPowerScore * 140)}`} pts
            </span>
            <span className="text-[10px] font-bold text-gray-400">Ray Tracing 3DMark</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-sm flex flex-col justify-between gap-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> PassMark G3D
            </span>
            <span className="text-lg font-black text-emerald-500 font-mono mt-1">
              {gpu.passmarkG3D ? `${gpu.passmarkG3D}` : `${Math.round(gpu.relativePowerScore * 310)}`} pts
            </span>
            <span className="text-[10px] font-bold text-gray-400">PassMark 3D Benchmark</span>
          </div>
        </div>

      </div>

      {/* GPU SPECIALIZED ENGINE & UPSCALING FEATURE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AI & Upscaling Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-md flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-black shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1E2022] dark:text-white">AI & ИИ-Масштабирование</h4>
              <p className="text-[10px] text-gray-400 font-extrabold">Технологии генерации кадров</p>
            </div>
          </div>
          <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl">
            {techDetails.dlssSupport}
          </div>
        </div>

        {/* Video Encoder Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-md flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E88D9F]/15 text-[#E88D9F] flex items-center justify-center font-black shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1E2022] dark:text-white">Стриминг & Экосистема</h4>
              <p className="text-[10px] text-gray-400 font-extrabold">Аппаратные кодировщики видео</p>
            </div>
          </div>
          <div className="text-sm font-black font-mono text-[#E88D9F] bg-[#E88D9F]/10 px-3 py-2 rounded-xl">
            {techDetails.encoderEngine}
          </div>
        </div>

        {/* Power & Safety Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-md flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1E2022] dark:text-white">Разъемы Питания & БП</h4>
              <p className="text-[10px] text-gray-400 font-extrabold">Рекомендации по Блок Питания</p>
            </div>
          </div>
          <div className="text-sm font-black font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-2 rounded-xl">
            {techDetails.powerConnectorSafety} (БП {gpu.recommendedPsuW}W+)
          </div>
        </div>
      </div>

      {/* STRUCTURED SPECIFICATIONS MASTER TABLE (4 CLEAN CATEGORIES) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#E88D9F]/15 text-[#E88D9F] flex items-center justify-center font-black shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-[#1E2022] dark:text-white">
              Технические Спецификации Видеокарты
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
              Полный паспорт графического процессора, видеопамяти VRAM и выходов
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* CATEGORY 1: ЧИПСЕТ И ВЫЧИСЛЕНИЯ */}
          <div className="p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-[#E88D9F] tracking-wider flex items-center gap-2">
              <Dna className="w-4 h-4 text-[#E88D9F]" /> 1. Графический Чипсет и Вычисления
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Архитектура</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.architectureCodename}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Кодовое имя GPU</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.gpuCodeName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Техпроцесс (Lithography)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.processNode}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Шейдерные процессоры (CUDA/Stream)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.cudaCores}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Тензорные / ИИ Ядра</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.tensorCores}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Трассировка Лучей (RT Cores)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.rayTracingGen}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Производительность TFLOPS</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.tflops}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Частоты (Base / Boost)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.baseClock} / {techDetails.boostClock}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Блоки ROPs / TMUs</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.rops} ROPs / {techDetails.tmus} TMUs</span>
              </div>
            </div>
          </div>

          {/* CATEGORY 2: ПАМЯТЬ VRAM И ШИНА */}
          <div className="p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-[#8A9A86] tracking-wider flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#8A9A86]" /> 2. Память VRAM и Пропускная Способность
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Объем видеопамяти VRAM</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{gpu.vramGB} GB</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Тип видеопамяти</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.memoryType}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Разрядность шины памяти</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.memoryBusWidth}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Частота памяти</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.memoryClockSpeed}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Пропускная способность (ПСП)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.memoryBandwidth}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Кеш L2/L3</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.l2Cache}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Индексация 3D Рендера (Creator Score)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.creatorScore} / 100</span>
              </div>
            </div>
          </div>

          {/* CATEGORY 3: ИНТЕРФЕЙС И ГАБАРИТЫ */}
          <div className="p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> 3. Интерфейс, Габариты и Выходы
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Интерфейс подключения</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.interface}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Длина видеокарты</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.length}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Ширина слота</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.slotWidth}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Разъемы дополнительного питания</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.powerConnectors}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Видеовыходы</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.displayConnectors}</span>
              </div>
            </div>
          </div>

          {/* CATEGORY 4: ПИТАНИЕ И ИГРОВЫЕ ТЕХНОЛОГИИ */}
          <div className="p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> 4. Питание и Технологии
            </h4>
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 text-xs font-bold">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Теплопакет (TDP)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.powerDrawTdp}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Рекомендуемый БП</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{gpu.recommendedPsuW} W</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Макс. температура (TjMax)</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.maxTemp}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Синхронизация кадров</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.gsyncSupport}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">DirectX / Vulkan API</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.directX} / {techDetails.vulkan}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">VR Ready / Ansel</span>
                <span className="text-[#1E2022] dark:text-white font-mono">{techDetails.vrReady ? "Да" : "Нет"}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* GAMING FPS TELEMETRY MATRIX WITH INTERACTIVE RESOLUTION SWITCHER */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-black shrink-0">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-[#1E2022] dark:text-white">
                Игровая Телеметрия FPS (Поигровой Тест)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
                Оценка кадров в секунду в популярных AAA-играх на максимальных настройках
              </p>
            </div>
          </div>

          {/* Interactive Resolution Switcher */}
          <div className="flex items-center p-1 bg-black/5 dark:bg-white/10 rounded-2xl shrink-0">
            {(["1080p", "1440p", "4K"] as const).map((res) => (
              <button
                key={res}
                onClick={() => setSelectedResolution(res)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
                  selectedResolution === res
                    ? "bg-[#E88D9F] text-white shadow-md"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#1E2022] dark:hover:text-white"
                }`}
              >
                {res === "1080p" ? "1080p Full HD" : res === "1440p" ? "1440p Quad HD" : "4K Ultra HD"}
              </button>
            ))}
          </div>
        </div>

        {/* Unthrottled Test Bench Notice */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-black text-amber-800 dark:text-amber-300">
              Тестовый стенд KENSEI (Максимальный Графический Потенциал):
            </span>
            <p className="text-amber-700/90 dark:text-amber-200/80 leading-relaxed font-medium">
              Расчёт FPS выполнен без ограничений со стороны CPU на базе эталонного процессора <strong className="font-bold underline">{telemetryApiData.refCpuName}</strong> и оперативной памяти DDR5. В связке с более старым или бюджетным процессором частота кадров может быть ниже из-за боттлнека (узкого места CPU).
            </p>
          </div>
        </div>

        {/* Top 3 FPS Cards Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
          {/* 1080p */}
          <div className={`p-4 rounded-2xl border transition ${selectedResolution === "1080p" ? "bg-emerald-500/10 border-emerald-500/40 shadow-md" : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5"}`}>
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="text-[#1E2022] dark:text-white font-black">1080p Full HD</span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded font-black">
                {telemetryApiData["1080p"].avgFps > 120 ? "Киберспорт 144Hz+" : "Высокий FPS"}
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-500 mt-1">
              {telemetryApiData["1080p"].avgFps} FPS
            </div>
            <div className="text-[10px] font-bold text-gray-400">
              Цена за 1 FPS: <strong className="text-[#1E2022] dark:text-white">${telemetryApiData["1080p"].costPerFrame}</strong>
            </div>
          </div>

          {/* 1440p */}
          <div className={`p-4 rounded-2xl border transition ${selectedResolution === "1440p" ? "bg-[#E88D9F]/10 border-[#E88D9F]/40 shadow-md" : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5"}`}>
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="text-[#1E2022] dark:text-white font-black">1440p Quad HD</span>
              <span className="text-[10px] bg-[#E88D9F]/15 text-[#E88D9F] px-2 py-0.5 rounded font-black">
                {telemetryApiData["1440p"].avgFps >= 80 ? "Плавный QHD" : "Базовый QHD"}
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-[#E88D9F] mt-1">
              {telemetryApiData["1440p"].avgFps} FPS
            </div>
            <div className="text-[10px] font-bold text-gray-400">
              Цена за 1 FPS: <strong className="text-[#1E2022] dark:text-white">${telemetryApiData["1440p"].costPerFrame}</strong>
            </div>
          </div>

          {/* 4K */}
          <div className={`p-4 rounded-2xl border transition ${selectedResolution === "4K" ? "bg-indigo-500/10 border-indigo-500/40 shadow-md" : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5"}`}>
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <span className="text-[#1E2022] dark:text-white font-black">4K Ultra HD</span>
              <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded font-black">
                {telemetryApiData["4K"].avgFps >= 60 ? "Стабильный 4K 60+" : "4K c DLSS/FSR"}
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-indigo-400 mt-1">
              {telemetryApiData["4K"].avgFps} FPS
            </div>
            <div className="text-[10px] font-bold text-gray-400">
              Цена за 1 FPS: <strong className="text-[#1E2022] dark:text-white">${telemetryApiData["4K"].costPerFrame}</strong>
            </div>
          </div>
        </div>

        {/* Detailed Game Breakdown Table for Selected Resolution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentResTelemetry.gameResults.map((game, idx) => (
            <div key={idx} className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-4 h-4 text-gray-500" />
                </div>
                <div className="truncate">
                  <h5 className="text-xs font-black text-[#1E2022] dark:text-white truncate">{game.title}</h5>
                  <p className="text-[10px] text-gray-400 font-extrabold">Ultra Preset • 1% Low: {game.onePercentLow} FPS</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-base font-black font-mono text-[#E88D9F]">{game.fps}</span>
                <span className="text-[10px] text-gray-400 font-bold ml-1">FPS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDED CPUS FOR UNLOCKING GPU POTENTIAL */}
      {recommendedCpus.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 shadow-xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center font-black shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-[#1E2022] dark:text-white">
                  {t.cpuPairingTitle} {gpu.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
                  {t.cpuPairingDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendedCpus.map((rec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col justify-between gap-4 hover:border-black/20 dark:hover:border-white/20 transition group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black border ${rec.badgeColor}`}>
                      {rec.tierLabel === "Optimum" ? (lang === "en" ? "0% Bottleneck" : lang === "ja" ? "ボトルネック 0%" : "0% Боттлнека") : `~${rec.bottleneckPercentage}% ${t.bottleneck}`}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {rec.cpu.manufacturer} {rec.cpu.releaseYear}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-[#1E2022] dark:text-white group-hover:text-[#E88D9F] transition">
                      {rec.cpu.name}
                    </h4>
                    <p className="text-[11px] font-extrabold text-[#E88D9F] mt-0.5">
                      {rec.tierTitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold bg-black/5 dark:bg-white/5 p-2.5 rounded-xl border border-black/5 dark:border-white/5">
                    <div>
                      <span className="text-gray-400 block">{lang === "en" ? "Cores / Threads" : lang === "ja" ? "コア / スレッド" : "Ядра / Потоки"}</span>
                      <span className="text-[#1E2022] dark:text-white font-mono">{rec.cpu.cores}C / {rec.cpu.threads}T</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">{lang === "en" ? "Socket" : lang === "ja" ? "ソケット" : "Сокет"}</span>
                      <span className="text-[#1E2022] dark:text-white font-mono">{rec.cpu.socket}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                    {rec.rationale}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenCpuDetail(rec.cpu)}
                  className="w-full py-2.5 px-4 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-[#E88D9F] hover:text-white font-black text-xs transition flex items-center justify-center gap-2 active:scale-97"
                >
                  <span>{t.viewCpu}</span>
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIRECT RIVALS & ALTERNATIVE GPUS GRID */}
      {rivalGpus.length > 0 && (
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
                  Похожие видеокарты в том же ценовом или производительном сегменте
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rivalGpus.map((rival) => {
              const rNvidia = rival.manufacturer === "NVIDIA";
              const rAmd = rival.manufacturer === "AMD";
              const rIntel = rival.manufacturer === "Intel";
              const rColor = rNvidia ? "#76B900" : rAmd ? "#ED1C24" : rIntel ? "#0071C5" : "#555555";
              return (
                <button
                  key={rival.id}
                  onClick={() => handleOpenGpuDetail(rival)}
                  className="group text-left p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-[#E88D9F]/50 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between gap-3 active:scale-97 shadow-sm hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border" style={{ backgroundColor: `${rColor}15`, color: rColor, borderColor: `${rColor}30` }}>
                      {rival.manufacturer}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 font-bold">
                      {rival.vramGB} GB VRAM
                    </span>
                  </div>

                  <div>
                    <h5 className="font-black text-xs text-[#1E2022] dark:text-white group-hover:text-[#E88D9F] transition truncate">
                      {rival.name}
                    </h5>
                    <p className="text-[10px] text-gray-500 font-extrabold mt-0.5">
                      {rival.architecture || "GPU Architecture"} • {rival.releaseYear} г.
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-2 text-[10px] font-mono font-bold text-gray-500">
                    <span>{rival.relativePowerScore} 3D</span>
                    <span>{rival.rayTracingPowerScore} RT</span>
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
