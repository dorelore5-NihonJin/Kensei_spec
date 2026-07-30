export type Language = "en" | "ru" | "ja";

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    ru: string;
    ja: string;
  };
}

export const translations: TranslationDictionary = {
  // Navigation Tabs
  "nav.simulator": {
    en: "1. Hardware Simulator",
    ru: "1. Симулятор ПК",
    ja: "1. シミュレーター"
  },
  "nav.catalog": {
    en: "2. Builds Catalog",
    ru: "2. Каталог ПК",
    ja: "2. PCカタログ"
  },
  "nav.compare": {
    en: "3. Hardware Compare",
    ru: "3. Сравнение железа",
    ja: "3. ハードウェア比較"
  },
  "nav.rankings": {
    en: "4. Silicon Rankings",
    ru: "4. Топ комплектующих",
    ja: "4. シリコンランキング"
  },
  "nav.store": {
    en: "5. Buy PC Store",
    ru: "5. Магазин ПК",
    ja: "5. PCストア購入"
  },
  "header.about": {
    en: "About",
    ru: "О сервисе",
    ja: "概要"
  },
  "header.reset": {
    en: "Reset",
    ru: "Сбросить",
    ja: "リセット"
  },

  // Hero Banners
  "hero.simulator.badge1": {
    en: "PHYSICS ENGINE",
    ru: "ФИЗИЧЕСКИЙ ДВИЖОК",
    ja: "物理エンジン"
  },
  "hero.simulator.badge2": {
    en: "REAL-TIME TELEMETRY",
    ru: "ТЕЛЕМЕТРИЯ В РЕАЛЬНОМ ВРЕМЕНИ",
    ja: "リアルタイムテレメトリ"
  },
  "hero.simulator.title": {
    en: "Hardware Physics & Benchmark Simulator",
    ru: "Симулятор комплектующих и бенчмарков",
    ja: "パーツ物理・ベンチマークシミュレーター"
  },
  "hero.simulator.desc": {
    en: "Predict real-time FPS, bottleneck ratios, and PSU wattage for any CPU & GPU configuration.",
    ru: "Рассчитывайте реальный FPS, боттлнек и энергопотребление для любых связок процессоров и видеокарт.",
    ja: "CPUとGPUの任意の組み合わせでリアルタイムFPS、ボトルネック率、PSUワット数を予測します。"
  },

  "hero.catalog.badge1": {
    en: "PRE-CONFIGURED BUILDS",
    ru: "ГОТОВЫЕ СБОРКИ",
    ja: "事前構成ビルド"
  },
  "hero.catalog.badge2": {
    en: "TESTED BENCHMARKS",
    ru: "ПРОВЕРЕННЫЕ БЕНЧМАРКИ",
    ja: "検証済みベンチマーク"
  },
  "hero.catalog.title": {
    en: "Curated Game PC Builds Catalog",
    ru: "Каталог готовых игровых конфигураций",
    ja: "厳選ゲームPCビルドカタログ"
  },
  // Section 2: Game Builds Catalog
  "catalog.title": {
    en: "Curated Game PC Builds Catalog",
    ru: "Каталог готовых ПК и игровых сборок",
    ja: "厳選ゲームPCビルドカタログ"
  },
  "catalog.badge.verified": {
    en: "VERIFIED BENCHMARKS",
    ru: "ПРОВЕРЕННЫЕ БЕНЧМАРКИ",
    ja: "検証済みベンチマーク"
  },
  "catalog.search.placeholder": {
    en: "Search 250 builds by game, GPU, or CPU (e.g. Cyberpunk, RTX 4070, 9800X3D)...",
    ru: "Поиск 250 сборок по игре, видеокарте или процессору (например, Cyberpunk, RTX 4070)...",
    ja: "250のビルドをゲーム、GPU、CPUで検索 (例: Cyberpunk, RTX 4070)..."
  },
  "catalog.sort.label": {
    en: "SORT:",
    ru: "СОРТИРОВКА:",
    ja: "並び替え:"
  },
  "catalog.category.label": {
    en: "CATEGORY:",
    ru: "КАТЕГОРИЯ:",
    ja: "カテゴリ:"
  },
  "catalog.game.label": {
    en: "GAME:",
    ru: "ИГРА:",
    ja: "ゲーム:"
  },
  "catalog.budget.label": {
    en: "BUDGET:",
    ru: "БЮДЖЕТ:",
    ja: "予算:"
  },

  "catalog.sort.recommended": {
    en: "Recommended Order",
    ru: "Рекомендуемый порядок",
    ja: "おすすめ順"
  },
  "catalog.sort.price_desc": {
    en: "Price: High to Low ($4,450 → $120)",
    ru: "Цена: От высокой к низкой ($4 450 → $120)",
    ja: "価格: 高い順 ($4,450 → $120)"
  },
  "catalog.sort.price_asc": {
    en: "Price: Low to High ($120 → $4,450)",
    ru: "Цена: От низкой к высокой ($120 → $4 450)",
    ja: "価格: 安い順 ($120 → $4,450)"
  },
  "catalog.sort.fps_desc": {
    en: "Framerate: Highest FPS",
    ru: "Кадры: Максимальный FPS",
    ja: "フレームレート: 最高FPS"
  },
  "catalog.sort.title_asc": {
    en: "Title (A-Z)",
    ru: "Название (А-Я)",
    ja: "タイトル (A-Z)"
  },

  "catalog.category.all": {
    en: "-- All Workload Categories --",
    ru: "-- Все категории задач --",
    ja: "-- すべてのタスクカテゴリ --"
  },
  "catalog.category.gaming": {
    en: "Esports & Gaming",
    ru: "Киберспорт и Игры",
    ja: "eスポーツ＆ゲーム"
  },
  "catalog.category.render": {
    en: "3D Render & VFX",
    ru: "3D Рендеринг и Визуализация",
    ja: "3Dレンダリング＆VFX"
  },
  "catalog.category.ai": {
    en: "AI ML & Software Dev",
    ru: "ИИ Нейросети и Разработка",
    ja: "AI ML＆ソフトウェア開発"
  },
  "catalog.category.stream": {
    en: "4K Live Streaming",
    ru: "4K Стриминг и Запись",
    ja: "4K ライブ配信"
  },
  "catalog.category.audio": {
    en: "Audio DAW Studio",
    ru: "Звукозапись и Аранжировка",
    ja: "オーディオ DAW スタジオ"
  },
  "catalog.category.cad": {
    en: "CAD & Engineering",
    ru: "CAD и Проектирование",
    ja: "CAD＆エンジニアリング"
  },

  "catalog.game.all": {
    en: "-- All Games --",
    ru: "-- Все игры --",
    ja: "-- すべてのゲーム --"
  },

  "catalog.tier.all": {
    en: "-- All Budget Tiers --",
    ru: "-- Все ценовые категории --",
    ja: "-- すべての予算帯 --"
  },
  "catalog.tier.budget": {
    en: "Budget ($500 - $800)",
    ru: "Бюджетный ($500 - $800)",
    ja: "バジェット ($500 - $800)"
  },
  "catalog.tier.sweetspot": {
    en: "Sweetspot ($1,000 - $1,500)",
    ru: "Сбалансированный ($1 000 - $1 500)",
    ja: "スイートスポット ($1,000 - $1,500)"
  },
  "catalog.tier.highend": {
    en: "High-End ($1,800 - $2,500)",
    ru: "Премиум ($1 800 - $2 500)",
    ja: "ハイエンド ($1,800 - $2,500)"
  },
  "catalog.tier.godtier": {
    en: "God Tier ($3,000+)",
    ru: "Флагманский ($3 000+)",
    ja: "フラッグシップ ($3,000+)"
  },

  "catalog.card.target_game": {
    en: "Target Game / Use Case:",
    ru: "Целевая игра / Задача:",
    ja: "対象ゲーム / 用途:"
  },
  "catalog.card.est_fps": {
    en: "Est. FPS @",
    ru: "Расч. FPS @",
    ja: "推定 FPS @"
  },
  "catalog.card.verified": {
    en: "CapFrameX 2025/2026 Verified",
    ru: "Проверено CapFrameX 2025/2026",
    ja: "CapFrameX 2025/2026 検証済み"
  },
  "catalog.card.load_btn": {
    en: "Load in Simulator",
    ru: "Снарядить в симулятор",
    ja: "シミュレーターに読み込む"
  },
  "catalog.card.buy_btn": {
    en: "Buy PC",
    ru: "Купить ПК",
    ja: "PCを購入"
  },

  "catalog.loading_more": {
    en: "Loading next 9 verified configurations...",
    ru: "Загрузка следующих 9 сборок...",
    ja: "次の9つの構成を読み込み中..."
  },
  "catalog.load_more_btn": {
    en: "Load More Builds",
    ru: "Загрузить больше сборок",
    ja: "さらに構成を表示"
  },
  "hero.catalog.desc": {
    en: "Explore optimized PC builds tailored for Budget eSports, 1440p Ultra, and 4K Path Tracing.",
    ru: "Исследуйте сбалансированные ПК для киберспорта, 1440p Ультра и 4K Трассировки путей.",
    ja: "予算向けeスポーツ、1440pウルトラ、4Kパストレーシングに最適化されたPCビルドを検索。"
  },

  "hero.compare.badge1": {
    en: "SILICON VS SILICON",
    ru: "КРЕМНИЙ ПРОТИВ КРЕМНИЯ",
    ja: "シリコン 対 シリコン"
  },
  "hero.compare.badge2": {
    en: "HEAD-TO-HEAD BATTLE",
    ru: "ПРЯМОЕ СРАВНЕНИЕ",
    ja: "直接対決"
  },
  "hero.compare.title": {
    en: "Hardware Head-to-Head Comparison",
    ru: "Сравнение процессоров и видеокарт",
    ja: "ハードウェア直接比較"
  },
  "hero.compare.desc": {
    en: "Compare two CPUs or GPUs side-by-side: arch specs, cache bandwidth, TDP, and gaming deltas.",
    ru: "Сравнивайте два процессора или видеокарты бок о бок: архитектуру, кэш, TDP и разницу FPS.",
    ja: "2つのCPUまたはGPUを並べて比較：アーキテクチャ、キャッシュ帯域、TDP、ゲーム性能差。"
  },

  "hero.rankings.badge1": {
    en: "GLOBAL LEADERBOARD",
    ru: "ГЛОБАЛЬНЫЙ РЕЙТИНГ",
    ja: "グローバルリーダーボード"
  },
  "hero.rankings.badge2": {
    en: "2026 HARDWARE TIER LIST",
    ru: "ТОП ЖЕЛЕЗА 2026",
    ja: "2026年ハードウェアティア"
  },
  "hero.rankings.title": {
    en: "Silicon Architecture Performance Rankings",
    ru: "Рейтинг производительности комплектующих",
    ja: "シリコンアーキテクチャ性能ランキング"
  },
  "hero.rankings.desc": {
    en: "Comprehensive tier lists for all CPUs and GPUs ranked by single-core, multi-core, and raw 3D rasterization score.",
    ru: "Полный рейтинг процессоров и видеокарт по одноядерной, многоядерной и 3D производительности.",
    ja: "シングルコア、マルチコア、3Dラスタライズスコアで順位付けされた全CPU・GPUのティアリスト。"
  },

  // Top Wizard Breadcrumbs
  "wizard.step1": {
    en: "1. Pick Components",
    ru: "1. Выбор комплектующих",
    ja: "1. 構成の選択"
  },
  "wizard.step2": {
    en: "2. Select Game & Quality",
    ru: "2. Выбор игры и настроек",
    ja: "2. ゲームと画質の選択"
  },
  "wizard.step3": {
    en: "3. Telemetry & Benchmark",
    ru: "3. Телеметрия и бенчмарк",
    ja: "3. 性能・診断"
  },
  "wizard.buy_build": {
    en: "Buy Configured Build",
    ru: "Купить эту сборку",
    ja: "この構成を購入"
  },
  "wizard.step_by_step": {
    en: "Step-by-Step",
    ru: "Пошагово",
    ja: "ステップ別"
  },
  "wizard.full_overview": {
    en: "Full Overview",
    ru: "Полный обзор",
    ja: "全体表示"
  },

  // Step Headers
  "step1.title": {
    en: "1. Select Processor & Graphics (CPU / GPU)",
    ru: "1. Выберите процессор и видеокарту (CPU / GPU)",
    ja: "1. プロセッサーとグラフィックを選択 (CPU / GPU)"
  },
  "step2.title": {
    en: "2. Select Target Game & Graphics Settings",
    ru: "2. Выберите игру и настройки графики",
    ja: "2. ターゲットゲームと画質設定を選択"
  },
  "step3.title": {
    en: "3. Target Game & Quality Settings",
    ru: "3. Настройки игры и пресеты графики",
    ja: "3. ターゲットゲームと画質設定"
  },

  // Component Picker Labels
  "picker.cpu_model": {
    en: "CPU MODEL",
    ru: "МОДЕЛЬ ПРОЦЕССОРА",
    ja: "CPU モデル"
  },
  "picker.gpu_model": {
    en: "GPU MODEL",
    ru: "МОДЕЛЬ ВИДЕОКАРТЫ",
    ja: "GPU モデル"
  },
  "picker.single_core": {
    en: "SINGLE-CORE",
    ru: "ОДНОЯДЕРНЫЙ",
    ja: "シングルコア"
  },
  "picker.multi_core": {
    en: "MULTI-CORE",
    ru: "МНОГОЯДЕРНЫЙ",
    ja: "マルチコア"
  },
  "picker.change": {
    en: "Change",
    ru: "Изменить",
    ja: "変更"
  },
  "picker.ram_section": {
    en: "RAM SPEED, CAPACITY & CHANNEL CONFIG",
    ru: "СКОРОСТЬ ОЗУ, ОБЪЁМ И РЕЖИМ КАНАЛОВ",
    ja: "RAM 速度・容量・チャネル構成"
  },
  "picker.total_ram": {
    en: "TOTAL RAM CAPACITY:",
    ru: "ОБЩИЙ ОБЪЁМ ОЗУ:",
    ja: "RAM 総容量:"
  },
  "picker.single_channel": {
    en: "SINGLE CHANNEL",
    ru: "ОДНОКАНАЛЬНЫЙ (SINGLE)",
    ja: "シングルチャネル"
  },
  "picker.dual_channel": {
    en: "DUAL CHANNEL",
    ru: "ДВУХКАНАЛЬНЫЙ (DUAL)",
    ja: "デュアルチャネル"
  },
  "picker.speed_factor": {
    en: "speed factor",
    ru: "множитель скорости",
    ja: "速度係数"
  },
  "picker.storage_section": {
    en: "STORAGE INTERFACE (OS & GAMES)",
    ru: "ТИП НАКОПИТЕЛЯ (ОС И ИГРЫ)",
    ja: "ストレージ 規格 (OS & ゲーム)"
  },
  "picker.ray_tracing_power": {
    en: "RAY TRACING POWER",
    ru: "МОЩНОСТЬ ТРАССИРОВКИ ЛУЧЕЙ",
    ja: "レイトレーシング性能"
  },
  "picker.vram": {
    en: "VRAM:",
    ru: "ВИДЕОПАМЯТЬ:",
    ja: "VRAM:"
  },
  "picker.severe_stutter": {
    en: "Severe stutter",
    ru: "Сильные фризы",
    ja: "重いスタッター"
  },
  "picker.standard_l3": {
    en: "STANDARD L3",
    ru: "СТАНДАРТНЫЙ L3",
    ja: "標準 L3 キャッシュ"
  },
  "picker.reset_hardware": {
    en: "Reset Hardware",
    ru: "Сбросить комплектующие",
    ja: "構成リセット"
  },

  // Floating Bottom Step 1 Bar
  "floating.step1_complete": {
    en: "Step 1 Complete!",
    ru: "Шаг 1 завершён!",
    ja: "ステップ1 完了!"
  },
  "floating.step1_incomplete": {
    en: "Step 1: Select Hardware",
    ru: "Шаг 1: Выберите комплектующие",
    ja: "ステップ1: パーツ選択"
  },
  "floating.step1_desc": {
    en: "CPU, GPU, and RAM selected. Ready for target game benchmarking.",
    ru: "Процессор, видеокарта и ОЗУ выбраны. Готово к тестированию игр.",
    ja: "CPU、GPU、RAMを選択完了。ターゲットゲームのテストが可能です。"
  },
  "floating.step1_desc_incomplete": {
    en: "Please select a CPU, GPU, and RAM to enable full performance testing.",
    ru: "Пожалуйста, выберите процессор, видеокарту и ОЗУ для запуска тестирования.",
    ja: "完全なパフォーマンス測定のためにCPU、GPU、RAMを選択してください。"
  },
  "floating.proceed_step2": {
    en: "Proceed to Step 2 →",
    ru: "Перейти к Шагу 2 →",
    ja: "ステップ2へ進む →"
  },

  // Toast Notifications
  "toast.copied": {
    en: "Build Link Copied to Clipboard!",
    ru: "Ссылка на сборку скопирована в буфер обмена!",
    ja: "構成リンクをクリップボードにコピーしました！"
  },

  // FPS Verdict Badges
  "verdict.high_refresh": {
    en: "High Refresh",
    ru: "Высокая плавность",
    ja: "超快適"
  },
  "verdict.smooth": {
    en: "Smooth 60+ FPS",
    ru: "Плавная игра 60+ FPS",
    ja: "快適 60+ FPS"
  },
  "verdict.playable": {
    en: "Playable 30+ FPS",
    ru: "Играбельно 30+ FPS",
    ja: "プレイ可能 30+ FPS"
  },
  "verdict.heavy": {
    en: "Below 30 FPS",
    ru: "Низкий FPS (меньше 30)",
    ja: "動作重い"
  },

  // Game Selector Labels
  "game.target_resolution": {
    en: "TARGET RESOLUTION",
    ru: "ЦЕЛЕВОЕ РАЗРЕШЕНИЕ",
    ja: "ターゲット解像度"
  },
  "game.preset_detail": {
    en: "PRESET DETAIL",
    ru: "ПРЕСЕТ КАЧЕСТВА",
    ja: "画質プリセット"
  },
  "game.upscaling": {
    en: "UPSCALING (DLSS / FSR)",
    ru: "МАСШТАБИРОВАНИЕ (DLSS / FSR)",
    ja: "アップスケーリング (DLSS / FSR)"
  },
  "game.off_native": {
    en: "Off (Native)",
    ru: "Выкл (Нативное)",
    ja: "オフ (ネイティブ)"
  },
  "game.quality": {
    en: "Quality",
    ru: "Качество",
    ja: "クオリティ"
  },
  "game.performance": {
    en: "Performance",
    ru: "Производительность",
    ja: "パフォーマンス"
  },
  "game.ray_tracing": {
    en: "RAY TRACING (RTX / DXR)",
    ru: "ТРАССИРОВКА ЛУЧЕЙ (RTX / DXR)",
    ja: "レイトレーシング (RTX / DXR)"
  },
  "game.off": {
    en: "Off",
    ru: "Выкл",
    ja: "オフ"
  },
  "game.rt_medium": {
    en: "RT Medium",
    ru: "RT Средняя",
    ja: "RT ミディアム"
  },
  "game.path_tracing": {
    en: "Path Tracing / Ultra",
    ru: "Трассировка путей / Ультра",
    ja: "パストレーシング / ウルトラ"
  },
  "game.frame_gen": {
    en: "Frame Generation (DLSS 3 / FSR 3)",
    ru: "Генерация кадров (DLSS 3 / FSR 3)",
    ja: "フレーム生成 (DLSS 3 / FSR 3)"
  },
  "game.frame_gen_desc": {
    en: "Dynamic AI Frame Interpolation",
    ru: "Динамическая ИИ-интерполяция кадров",
    ja: "AI動的フレーム補間"
  },
  "game.min_ram": {
    en: "Min RAM:",
    ru: "Мин. ОЗУ:",
    ja: "最小 RAM:"
  },
  "game.rt_capable": {
    en: "RT Capable",
    ru: "Поддержка RT",
    ja: "RT 対応"
  },

  // Game Reliance & Load
  "reliance.cpu": {
    en: "CPU RELIANCE",
    ru: "НАГРУЗКА НА ПРОЦЕССОР",
    ja: "CPU 依存度"
  },
  "reliance.gpu": {
    en: "GPU RELIANCE",
    ru: "НАГРУЗКА НА ВИДЕОКАРТУ",
    ja: "GPU 依存度"
  },
  "reliance.optimal_headroom": {
    en: "OPTIMAL HEADROOM",
    ru: "ОПТИМАЛЬНЫЙ ЗАПАС",
    ja: "最適ヘッドルーム"
  },
  "reliance.shader_bound": {
    en: "SHADER & RENDER BOUND",
    ru: "УПЁРСЛОСЬ В ШЕЙДЕРЫ И РЕНДЕР",
    ja: "シェーダー・レンダー限界"
  },

  // Floating Bottom Workload Bar
  "floating.target_selected": {
    en: "Target Workload Selected:",
    ru: "Выбранная целевая игра:",
    ja: "選択されたターゲット:"
  },
  "floating.resolution": {
    en: "Resolution:",
    ru: "Разрешение:",
    ja: "解像度:"
  },
  "floating.preset": {
    en: "Preset:",
    ru: "Пресет:",
    ja: "プリセット:"
  },
  "floating.rt": {
    en: "RT:",
    ru: "Трассировка:",
    ja: "RT:"
  },
  "floating.view_results": {
    en: "View Benchmark Results →",
    ru: "Смотреть результаты бенчмарка →",
    ja: "ベンチマーク結果を見る →"
  },

  // Quick Game Switcher Bar
  "switcher.title": {
    en: "Quick Game & Workload Switcher",
    ru: "Быстрое переключение игр",
    ja: "迅速ゲーム切替"
  },
  "switcher.live_recalc": {
    en: "LIVE INSTANT RECALCULATION",
    ru: "МГНОВЕННЫЙ ПЕРЕРАСЧЁТ",
    ja: "リアルタイム再計算"
  },

  // FPS Gauge Card
  "fps.estimated": {
    en: "ESTIMATED AVERAGE FPS",
    ru: "РАСЧЁТНЫЙ СРЕДНИЙ FPS",
    ja: "予測平均 FPS"
  },
  "fps.share_build": {
    en: "Share Build",
    ru: "Поделиться сборкой",
    ja: "構成を共有"
  },
  "fps.link_copied": {
    en: "Link Copied!",
    ru: "Ссылка скопирована!",
    ja: "リンクをコピーしました！"
  },
  "fps.real_time": {
    en: "REAL-TIME",
    ru: "РЕАЛЬНОЕ ВРЕМЯ",
    ja: "リアルタイム"
  },
  "fps.avg_fps": {
    en: "AVG FPS",
    ru: "СРЕДНИЙ FPS",
    ja: "平均 FPS"
  },
  "fps.high_refresh": {
    en: "High Refresh",
    ru: "Высокая плавность",
    ja: "超快適"
  },
  "fps.one_percent_low": {
    en: "1% LOW (STUTTER)",
    ru: "1% МИНИМАЛЬНЫЙ FPS",
    ja: "1% LOW (スタッター)"
  },
  "fps.bottleneck_factor": {
    en: "BOTTLENECK FACTOR",
    ru: "ФАКТОР БОТТЛНЕКА",
    ja: "ボトルネック要因"
  },
  "fps.workload_balance": {
    en: "WORKLOAD BALANCE (CPU VS GPU LOAD)",
    ru: "БАЛАНС НАГРУЗКИ (CPU ПРОТИВ GPU)",
    ja: "WORKLOAD バランス (CPU vs GPU)"
  },
  "fps.cpu_load": {
    en: "CPU Load",
    ru: "Загрузка CPU",
    ja: "CPU 負荷"
  },
  "fps.gpu_load": {
    en: "GPU Load",
    ru: "Загрузка GPU",
    ja: "GPU 負荷"
  },
  "fps.awaiting": {
    en: "Awaiting Component Selection",
    ru: "Ожидание выбора комплектующих",
    ja: "パーツ選択待ち"
  },

  // Smart Upgrade Advisor
  "advisor.title": {
    en: "Smart Upgrade Advisor",
    ru: "Умный советник апгрейда",
    ja: "アップグレード診断"
  },
  "advisor.optimization": {
    en: "OPTIMIZATION",
    ru: "ОПТИМИЗАЦИЯ",
    ja: "最適化"
  },
  "advisor.pinnacle": {
    en: "We couldn't locate a single CPU/GPU of the same brand that delivers a +30% performance boost. You may already be at the pinnacle of this generation!",
    ru: "Не найдено процессоров/видеокарт того же бренда, дающих +30% прироста. Ваша система уже на пике текущего поколения!",
    ja: "同ブランドで+30%の性能向上を提供するCPU/GPUは見つかりませんでした。すでにこの世代の頂点に達しています！"
  },

  // Hardware Die Diagnostics & Power
  "bottleneck.title": {
    en: "SYSTEM BOTTLENECK ANALYSIS",
    ru: "АНАЛИЗ БОТТЛНЕКА СИСТЕМЫ",
    ja: "システム ボトルネック 分析"
  },
  "diag.header": {
    en: "HARDWARE DIE DIAGNOSTICS",
    ru: "ДИАГНОСТИКА КРИСТАЛЛА ЖЕЛЕЗА",
    ja: "ハードウェア ダイ 診断"
  },
  "diag.subtitle": {
    en: "Silicon Architecture Integrity & Power Load Verification",
    ru: "Проверка архитектуры кремния и энергопотребления",
    ja: "シリコンアーキテクチャの整合性と電力検証"
  },
  "diag.active": {
    en: "ACTIVE",
    ru: "АКТИВНО",
    ja: "アクティブ"
  },
  "diag.perfect_match": {
    en: "PERFECT HARDWARE MATCH",
    ru: "ИДЕАЛЬНОЕ СОВПАДЕНИЕ ЖЕЛЕЗА",
    ja: "完璧なハードウェア構成"
  },
  "diag.perfect_match_desc": {
    en: "Silicon structures are perfectly balanced. Memory speed, storage bus, and power targets align.",
    ru: "Кремниевые структуры идеально сбалансированы. Скорость памяти и энергопотребление согласованы.",
    ja: "シリコン構造が完全にバランスをとっています。メモリ速度と消費電力ターゲットが一致しています。"
  },
  "diag.psu_title": {
    en: "PSU POWER & EFFICIENCY GAUGE",
    ru: "ОЦЕНКА ЭНЕРГОПОТРЕБЛЕНИЯ БП",
    ja: "PSU 電力 & 効率 ゲージ"
  },
  "diag.recommended_psu": {
    en: "Recommended PSU:",
    ru: "Рекомендуемый БП:",
    ja: "推奨 PSU:"
  },
  "diag.safety_headroom": {
    en: "Safety Headroom",
    ru: "Запас безопасности",
    ja: "セーフティ ヘッドルーム"
  },
  "diag.show_advanced": {
    en: "Show Advanced Telemetry & Deep Specs",
    ru: "Показать расширенную телеметрию и характеристики",
    ja: "詳細スペック・拡張テレメトリを表示"
  },
  "diag.hide_advanced": {
    en: "Hide Advanced Telemetry",
    ru: "Скрыть расширенную телеметрию",
    ja: "拡張テレメトリを非表示"
  },
  "diag.l3_cache_subsystem": {
    en: "L3 CACHE SUBSYSTEM",
    ru: "ПОДСИСТЕМА L3 КЭША",
    ja: "L3 キャッシュ サブシステム"
  },
  "diag.thermal_peak_load": {
    en: "THERMAL PEAK LOAD",
    ru: "ПИКОВАЯ ТЕМПЕРАТУРА",
    ja: "サーマル ピーク 負荷"
  },
  "diag.pcie_bandwidth": {
    en: "PCIE BUS BANDWIDTH",
    ru: "ПРОПУСКНАЯ СПОСОБНОСТЬ PCIE",
    ja: "PCIE バス 帯域幅"
  },
  "diag.memory_throughput": {
    en: "MEMORY THROUGHPUT",
    ru: "ПРОПУСКНАЯ СПОСОБНОСТЬ ОЗУ",
    ja: "メモリ スループット"
  },
  "diag.gaming_load": {
    en: "under 100% Gaming Load",
    ru: "при 100% игровой нагрузке",
    ja: "100% ゲーム負荷時"
  },

  // Bottom CTA Order Bar
  "cta.ready_title": {
    en: "Ready to build this setup?",
    ru: "Готовы собрать эту конфигурацию?",
    ja: "この構成を注文しますか？"
  },
  "cta.ready_desc": {
    en: "View auto-matched motherboards, coolers, PSU wattage, and price comparisons across stores.",
    ru: "Смотрите автоматический подбор материнских плат, кулеров, БП и цены во всех магазинах.",
    ja: "マザーボード、クーラー、PSU容量、価格比較を自動マッチングで確認。"
  },
  "cta.buy_complete": {
    en: "Buy Complete Build",
    ru: "Купить готовую сборку",
    ja: "構成を購入する"
  },

  // Search & Filter
  "search.placeholder": {
    en: "Search hardware model or manufacturer...",
    ru: "Поиск модели или производителя...",
    ja: "モデル名またはメーカーを検索..."
  },
  "filter.all": {
    en: "All Manufacturers",
    ru: "Все производители",
    ja: "すべてのメーカー"
  },

  // Footer & Legal
  "footer.brand": {
    en: "Built to deliver authentic hardware benchmark predictions. Features 3D V-Cache latency math, VRAM buffer thrashing penalties, and socket-matched PC build recommendations.",
    ru: "Создан для точного прогнозирования бенчмарков. Учитывает 3D V-Cache, штрафы нехватки VRAM и совместимость сокетов.",
    ja: "本物のハードウェアベンチマーク予測を提供。3D V-Cacheレイテンシ計算、VRAM不足ペナルティ、ソケット整合済みのPC構成提案を搭載。"
  }
};
