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

  // Calculator Wizard Steps
  "step1.title": {
    en: "1. Select Processor (CPU)",
    ru: "1. Выберите процессор (CPU)",
    ja: "1. プロセッサー (CPU) を選択"
  },
  "step2.title": {
    en: "2. Select Graphics Card (GPU)",
    ru: "2. Выберите видеокарту (GPU)",
    ja: "2. グラフィックボード (GPU) を選択"
  },
  "step3.title": {
    en: "3. Target Game & Quality Settings",
    ru: "3. Целевая игра и настройки графики",
    ja: "3. ターゲットゲームと画質設定"
  },
  "preset.quality": {
    en: "QUALITY PRESET",
    ru: "ПРЕСЕТ ГРАФИКИ",
    ja: "画質プリセット"
  },
  "resolution.label": {
    en: "RESOLUTION",
    ru: "РАЗРЕШЕНИЕ",
    ja: "解像度"
  },

  // Rankings Page
  "rankings.title": {
    en: "Global Hardware Hierarchy Rankings",
    ru: "Мировой топ производительности комплектующих",
    ja: "グローバル ハードウェア 階層 ランキング"
  },
  "rankings.subtitle": {
    en: "Explore complete hierarchy rankings for all CPUs and GPUs sorted by normalized aggregate benchmark scores.",
    ru: "Исследуйте полный мировое первенство всех процессоров и видеокарт по мировому агрегированному баллу.",
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
  "rankings.search": {
    en: "Search silicon by model or brand...",
    ru: "Поиск модели или бренда...",
    ja: "モデル名またはブランドを検索..."
  },
  "rankings.reset_filters": {
    en: "Reset Filters",
    ru: "Сбросить фильтры",
    ja: "フィルターリセット"
  },

  // Compare Page
  "compare.title": {
    en: "Hardware Benchmark Comparison",
    ru: "Сравнение бенчмарков железа",
    ja: "ハードウェア ベンチマーク 比較"
  },
  "compare.subtitle": {
    en: "Compare two CPUs or GPUs side-by-side on the global hierarchy scale.",
    ru: "Сравнивайте два процессора или видеокарты бок о бок на единой мировой шкале.",
    ja: "グローバル階層スケールで2つのCPUまたはGPUを横並び比較。"
  },
  "compare.select_first": {
    en: "Select First Component...",
    ru: "Выберите первое комплектующее...",
    ja: "1つ目のコンポーネントを選択..."
  },
  "compare.select_second": {
    en: "Select Second Component...",
    ru: "Выберите второе комплектующее...",
    ja: "2つ目のコンポーネントを選択..."
  },
  "compare.performance_diff": {
    en: "Performance Difference",
    ru: "Разница в производительности",
    ja: "パフォーマンスの差"
  },
  "compare.faster_by": {
    en: "faster overall",
    ru: "быстрее в среднем",
    ja: "全体で高速"
  },

  // Catalog Page
  "catalog.title": {
    en: "Verified PC Builds Catalog",
    ru: "Каталог проверенных игровых ПК",
    ja: "検証済みPC構成 カタログ"
  },
  "catalog.filter.all": {
    en: "All Categories",
    ru: "Все категории",
    ja: "すべてのカテゴリー"
  },
  "catalog.filter.esports": {
    en: "Esports Gaming",
    ru: "Киберспорт",
    ja: "eスポーツ"
  },
  "catalog.filter.aaa": {
    en: "AAA Ultra 4K",
    ru: "AAA Ультра 4K",
    ja: "AAA ウルトラ 4K"
  },
  "catalog.filter.workstation": {
    en: "Workstation & AI",
    ru: "Рабочие станции и ИИ",
    ja: "ワークステーション & AI"
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
