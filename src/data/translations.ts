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
    ja: "1. ハードウェアシミュレーター"
  },
  "nav.catalog": {
    en: "2. Game Builds Catalog",
    ru: "2. Каталог игровых ПК",
    ja: "2. ゲームPCカタログ"
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
    ru: "Пошаговый режим",
    ja: "ステップ別"
  },
  "wizard.full_overview": {
    en: "Full Overview",
    ru: "Полный обзор",
    ja: "全体表示"
  },
  "wizard.build_active": {
    en: "BUILD ACTIVE",
    ru: "СБОРКА АКТИВНА",
    ja: "構成アクティブ"
  },
  "wizard.reset_hardware": {
    en: "Reset Hardware",
    ru: "Сбросить железо",
    ja: "構成リセット"
  },

  // Component Picker (Step 1)
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

  // Bottom Floating Bar
  "floating.step1_complete": {
    en: "Step 1 Complete!",
    ru: "Шаг 1 завершён!",
    ja: "ステップ1 完了!"
  },
  "floating.step1_desc": {
    en: "CPU, GPU, and RAM selected. Ready for target game benchmarking.",
    ru: "Процессор, видеокарта и ОЗУ выбраны. Готово к тестированию игр.",
    ja: "CPU、GPU、RAMを選択完了。ターゲットゲームのテストが可能です。"
  },
  "floating.proceed_step2": {
    en: "Proceed to Step 2 →",
    ru: "Перейти к Шагу 2 →",
    ja: "ステップ2へ進む →"
  },

  // Game Selector (Step 2)
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
  "fps.share_build": {
    en: "Share Build",
    ru: "Поделиться сборкой",
    ja: "構成を共有"
  },
  "fps.real_time": {
    en: "REAL-TIME",
    ru: "РЕАЛЬНЫЙ ВРЕМЯ",
    ja: "リアルタイム"
  },
  "fps.avg_fps": {
    en: "AVG FPS",
    ru: "СРЕДНИЙ FPS",
    ja: "平均 FPS"
  },
  "fps.high_refresh": {
    en: "High Refresh / Smooth",
    ru: "Высокая плавнось",
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
    ja: "ワークロード バランス (CPU vs GPU)"
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

  // Header Actions
  "header.reset": {
    en: "Reset Build",
    ru: "Сбросить сборку",
    ja: "構成リセット"
  },
  "header.about": {
    en: "About Engine",
    ru: "О движке",
    ja: "エンジン概要"
  },

  // Hero Banners
  "hero.simulator.badge1": {
    en: "NEO-TOKYO ENGINE V2.6",
    ru: "НЕО-ТОКИО ДВИЖОК V2.6",
    ja: "ネオ東京エンジン V2.6"
  },
  "hero.simulator.badge2": {
    en: "REAL-TIME PHYSICS SIMULATOR",
    ru: "ФИЗИЧЕСКИЙ СИМУЛЯТОР В РЕАЛЬНОМ ВРЕМЕНИ",
    ja: "リアルタイム物理シミュレーター"
  },
  "hero.simulator.title": {
    en: "KENSEI SPEC HARDWARE SIMULATOR",
    ru: "СИМУЛЯТОР КОМПЛЕКТУЮЩИХ KENSEI SPEC",
    ja: "剣聖スペック ハードウェアシミュレーター"
  },
  "hero.simulator.desc": {
    en: "Precision silicon telemetry, 3D V-Cache scaling, and VRAM thrashing benchmark estimator designed with Soft Japanese Minimalism.",
    ru: "Высокоточная телеметрия кремния, расчёт латентности 3D V-Cache и штрафов VRAM в стиле японского минимализма.",
    ja: "精密なシリコンテレメトリ、3D V-Cacheスケーリング、VRAMボトルネック予測を統合した日本美学シミュレーター。"
  },

  "hero.catalog.badge1": {
    en: "250 VERIFIED BUILDS",
    ru: "250 ПРОВЕРЕННЫХ СБОРК",
    ja: "250の検証済み構成"
  },
  "hero.catalog.badge2": {
    en: "LIVE CATALOG SHOWROOM",
    ru: "КАТАЛОГ СБОРНЫХ ПК",
    ja: "ライブ カタログ ショールーム"
  },
  "hero.catalog.title": {
    en: "KENSEI GAME BUILDS CATALOG",
    ru: "КАТАЛОГ ИГРОВЫХ ПК KENSEI SPEC",
    ja: "KENSEI GAME BUILDS カタログ"
  },
  "hero.catalog.desc": {
    en: "Browse 250 verified PC configurations across Esports Gaming, AI LLM Inference, 3D Rendering & Workstations.",
    ru: "Исследуйте 250 протестированных конфигураций ПК для киберспорта, ИИ-моделей, 3D-рендеринга и рабочих станций.",
    ja: "eスポーツ、AI推論、3Dレンダリング、ワークステーション向けに検証された250のPC構成を閲覧。"
  },

  "hero.compare.badge1": {
    en: "VERSUS BENCHMARK LAB",
    ru: "ЛАБОРАТОРИЯ СРАВНЕНИЯ",
    ja: "バーサス ベンチマーク ラボ"
  },
  "hero.compare.badge2": {
    en: "DEEP SILICON MATRIX COMPARISON",
    ru: "МАТРИЦА СРАВНЕНИЯ КРЕМНИЯ",
    ja: "ディープ シリコン マトリックス 比較"
  },
  "hero.compare.title": {
    en: "KENSEI VERSUS HARDWARE STUDIO",
    ru: "СТУДИЯ СРАВНЕНИЯ ЖЕЛЕЗА KENSEI",
    ja: "KENSEI VERSUS ハードウェア スタジオ"
  },
  "hero.compare.desc": {
    en: "Compare CPUs and GPUs side-by-side with normalized aggregate telemetry performance metrics, architectural specs, and hierarchy ranking.",
    ru: "Сравнивайте процессоры и видеокарты бок о бок на единой мировой шкале производительности с чистыми метриками и характеристиками.",
    ja: "CPUとGPUを標準化されたテレメトリ性能指標、アーキテクチャ仕様、階層ランキングで横並び比較。"
  },

  "hero.rankings.badge1": {
    en: "GLOBAL HIERARCHY LEADERBOARD",
    ru: "МИРОВОЙ РЕЙТИНГ ПРОИЗВОДИТЕЛЬНОСТИ",
    ja: "グローバル 階層 リーダーボード"
  },
  "hero.rankings.badge2": {
    en: "100% VERIFIED HARDWARE INDEX",
    ru: "100% ПРОВЕРЕННЫЙ ИНДЕКС ЖЕЛЕЗА",
    ja: "100% 検証済み ハードウェア インデックス"
  },
  "hero.rankings.title": {
    en: "GLOBAL SILICON HIERARCHY RANKINGS",
    ru: "МИРОВОЙ ТОП КОМПЛЕКТУЮЩИХ",
    ja: "グローバル シリコン 階層 ランキング"
  },
  "hero.rankings.desc": {
    en: "Explore complete global hierarchy leaderboards for all CPUs and GPUs sorted by normalized aggregate performance throughput.",
    ru: "Полное мировое первенство всех процессоров и видеокарт, отсортированное по абсолютной производительности.",
    ja: "正規化された総合パフォーマンスでソートされたすべてのCPUおよびGPUの完全な世界階層リーダーボード。"
  },

  // Rankings Page
  "rankings.title": {
    en: "Global Hardware Hierarchy Rankings",
    ru: "Мировой топ производительности комплектующих",
    ja: "グローバル ハードウェア 階層 ランキング"
  },
  "rankings.subtitle": {
    en: "Explore complete hierarchy rankings for all CPUs and GPUs sorted by normalized aggregate benchmark scores.",
    ru: "Исследуйте полное мировое первенство всех процессоров и видеокарт по мировому агрегированному баллу.",
    ja: "正規化されたベンチマークスコアでソートされたすべてのCPUとGPUの階層ランキング。"
  },
  "rankings.tab.cpu": {
    en: "Processors (CPUs)",
    ru: "Процессоры (CPU)",
    ja: "プロセッサー (CPU)"
  },
  "rankings.tab.gpu": {
    en: "Graphics Cards (GPUs)",
    ru: "Видеокарты (GPU)",
    ja: "グラフィックボード (GPU)"
  },

  // Compare Page
  "compare.title": {
    en: "Hardware Benchmark Comparison",
    ru: "Сравнение бенчмарков железа",
    ja: "ハードウェア ベンチマーク 比較"
  },

  // Catalog Page
  "catalog.title": {
    en: "Verified PC Builds Catalog",
    ru: "Каталог проверенных игровых ПК",
    ja: "検証済みPC構成 カタログ"
  },

  // Telemetry Output Cards
  "fps.estimated": {
    en: "ESTIMATED AVERAGE FPS",
    ru: "РАСЧЁТНЫЙ СРЕДНИЙ FPS",
    ja: "予測平均 FPS"
  },
  "bottleneck.title": {
    en: "SYSTEM BOTTLENECK ANALYSIS",
    ru: "АНАЛИЗ БОТТЛНЕКА СИСТЕМЫ",
    ja: "システム ボトルネック 分析"
  },
  "vram.buffer": {
    en: "VRAM BUFFER LOAD",
    ru: "ЗАГРУЗКА ВИДЕОПАМЯТИ VRAM",
    ja: "VRAM バッファ 使用量"
  },
  "vcache.boost": {
    en: "3D V-CACHE LATENCY BOOST",
    ru: "БОНУС ЛАТЕНТНОСТИ 3D V-CACHE",
    ja: "3D V-CACHE レイテンシ ブースト"
  },
  "psu.headroom": {
    en: "ESTIMATED SYSTEM POWER CONSUMPTION",
    ru: "ОЦЕНКА ЭНЕРГОПОТРЕБЛЕНИЯ СИСТЕМЫ",
    ja: "推定システム消費電力"
  },
  "upgrade.advisor": {
    en: "OPTIMAL HARDWARE UPGRADE ADVISOR",
    ru: "РЕКОМЕНДАТЕЛЬ ОПТИМАЛЬНОГО АПГРЕЙДА",
    ja: "最適ハードウェア アップグレード アドバイザー"
  },

  // Buttons & Controls
  "btn.compare": {
    en: "Compare",
    ru: "Сравнить",
    ja: "比較する"
  },
  "btn.select": {
    en: "Select",
    ru: "Выбрать",
    ja: "選択する"
  },
  "btn.selected": {
    en: "Selected",
    ru: "Выбрано",
    ja: "選択中"
  },
  "btn.buy_pc": {
    en: "Buy Configured PC",
    ru: "Купить этот ПК",
    ja: "この構成でPCを購入"
  },
  "btn.apply_build": {
    en: "Apply to Calculator Build",
    ru: "Применить к сборке",
    ja: "シミュレーターに適用"
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
  "sort.score_desc": {
    en: "Sort: Highest Score",
    ru: "Сортировка: Высокий балл",
    ja: "ソート: 最高スコア順"
  },
  "sort.year_desc": {
    en: "Sort: Release Year",
    ru: "Сортировка: Год выпуска",
    ja: "ソート: 発売年順"
  },

  // Footer & Legal
  "footer.brand": {
    en: "Built to deliver authentic hardware benchmark predictions. Features 3D V-Cache latency math, VRAM buffer thrashing penalties, and socket-matched PC build recommendations.",
    ru: "Создан для точного прогнозирования бенчмарков. Учитывает 3D V-Cache, штрафы нехватки VRAM и совместимость сокетов.",
    ja: "本物のハードウェアベンチマーク予測を提供。3D V-Cacheレイテンシ計算、VRAM不足ペナルティ、ソケット整合済みのPC構成提案を搭載。"
  },
  "footer.quick_nav": {
    en: "Quick Navigation",
    ru: "Быстрая навигация",
    ja: "クイック ナビゲーション"
  },
  "footer.featured_hw": {
    en: "Featured Hardware",
    ru: "Популярные комплектующие",
    ja: "注目のハードウェア"
  },
  "footer.supported_games": {
    en: "Supported Games",
    ru: "Поддерживаемые игры",
    ja: "対応ゲームタイトル"
  },
  "footer.rights": {
    en: "All rights reserved.",
    ru: "Все права защищены.",
    ja: "All rights reserved."
  }
};
