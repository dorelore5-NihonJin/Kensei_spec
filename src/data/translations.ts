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
  // Section 3: Compare Page & Charts
  "compare.title": {
    en: "Hardware Head-to-Head Comparison",
    ru: "Прямое сравнение комплектующих",
    ja: "ハードウェア直接比較"
  },
  "rankings.tab.cpu": {
    en: "CPUs",
    ru: "Процессоры",
    ja: "プロセッサ (CPU)"
  },
  "rankings.tab.gpu": {
    en: "GPUs",
    ru: "Видеокарты",
    ja: "グラフィック (GPU)"
  },
  "rankings.title": {
    en: "Silicon Leaderboard & Telemetry Benchmarks",
    ru: "Рейтинг производительности и бенчмарки комплектующих",
    ja: "シリコン性能ランキング＆ベンチマーク"
  },
  "rankings.subtitle": {
    en: "Ranked by synthetic compute algorithms and real-world 1080p, 1440p & 4K gaming benchmarks.",
    ru: "Ранжирование по алгоритмам производительности и реальным бенчмаркам в 1080p, 1440p и 4K.",
    ja: "合成演算アルゴリズムおよびリアルタイム1080p/1440p/4Kゲームベンチマークによる総合順位。"
  },
  "rankings.search_cpu_placeholder": {
    en: "Search CPU (e.g. 7800X3D, i5)...",
    ru: "Поиск процессора (напр. 7800X3D, i5)...",
    ja: "CPUを検索 (例: 7800X3D, i5)..."
  },
  "rankings.search_gpu_placeholder": {
    en: "Search GPU (e.g. RTX 4070, RX)...",
    ru: "Поиск видеокарты (напр. RTX 4070, RX)...",
    ja: "GPUを検索 (例: RTX 4070, RX)..."
  },
  "rankings.sort.score_desc": {
    en: "Highest to Lowest Score",
    ru: "По убыванию очков",
    ja: "スコア順 (高→低)"
  },
  "rankings.sort.score_asc": {
    en: "Lowest to Highest Score",
    ru: "По возрастанию очков",
    ja: "スコア順 (低→高)"
  },
  "rankings.sort.year_desc": {
    en: "Newest Release Year",
    ru: "Сначала новые",
    ja: "リリース年 (新しい順)"
  },
  "rankings.sort.year_asc": {
    en: "Oldest Release Year",
    ru: "Сначала старые",
    ja: "リリース年 (古い順)"
  },
  "rankings.sort.name_asc": {
    en: "Alphabetical (A-Z)",
    ru: "По алфавиту (А-Я)",
    ja: "名前順 (A-Z)"
  },
  "rankings.sort.cores_desc": {
    en: "Max Cores First",
    ru: "По количеству ядер",
    ja: "コア数順"
  },
  "rankings.sort.vram_desc": {
    en: "Max VRAM First",
    ru: "По объему видеопамяти",
    ja: "VRAM容量順"
  },
  "rankings.vendor_label": {
    en: "Vendor:",
    ru: "Производитель:",
    ja: "ベンダー:"
  },
  "rankings.reset_btn": {
    en: "Reset",
    ru: "Сбросить",
    ja: "リセット"
  },
  "rankings.no_results": {
    en: "No hardware components match your search filter",
    ru: "Компоненты по заданному фильтру не найдены",
    ja: "検索条件に一致するハードウェアが見つかりません"
  },
  "rankings.cores": {
    en: "Cores",
    ru: "ядер",
    ja: "コア"
  },
  "rankings.threads": {
    en: "Threads",
    ru: "потоков",
    ja: "スレッド"
  },
  "rankings.unified_ram": {
    en: "Unified RAM",
    ru: "объединенной памяти",
    ja: "ユニファイドメモリ"
  },
  "rankings.shared_ram": {
    en: "Shared RAM (iGPU)",
    ru: "общей памяти (iGPU)",
    ja: "共有メモリ (iGPU)"
  },
  "rankings.vram": {
    en: "VRAM",
    ru: "видеопамяти",
    ja: "VRAM"
  },
  "rankings.of_apex": {
    en: "of apex",
    ru: "от максимума",
    ja: "最高性能比"
  },
  "rankings.pts": {
    en: "pts",
    ru: "баллов",
    ja: "pts"
  },
  "rankings.compare_btn": {
    en: "Compare",
    ru: "Сравнить",
    ja: "比較"
  },
  "rankings.select_btn": {
    en: "Select",
    ru: "Выбрать",
    ja: "選択"
  },
  "rankings.showing": {
    en: "Showing",
    ru: "Показано",
    ja: "表示中"
  },
  "rankings.of": {
    en: "of",
    ru: "из",
    ja: "全"
  },
  "rankings.components": {
    en: "components",
    ru: "комплектующих",
    ja: "件のコンポーネント"
  },
  "compare.candidate_a": {
    en: "Candidate A",
    ru: "Кандидат A",
    ja: "候補 A"
  },
  "compare.candidate_b": {
    en: "Candidate B",
    ru: "Кандидат B",
    ja: "候補 B"
  },
  "compare.select_cpu_a": {
    en: "Select first CPU...",
    ru: "Выберите первый процессор...",
    ja: "最初のCPUを選択..."
  },
  "compare.select_cpu_b": {
    en: "Select second CPU...",
    ru: "Выберите второй процессор...",
    ja: "2番目のCPUを選択..."
  },
  "compare.select_gpu_a": {
    en: "Select first GPU...",
    ru: "Выберите первую видеокарту...",
    ja: "最初のGPUを選択..."
  },
  "compare.select_gpu_b": {
    en: "Select second GPU...",
    ru: "Выберите вторую видеокарту...",
    ja: "2番目のGPUを選択..."
  },
  "compare.released": {
    en: "Released",
    ru: "Выпущен в",
    ja: "発売"
  },
  "compare.score": {
    en: "Score",
    ru: "Баллы",
    ja: "スコア"
  },
  "compare.lead_analysis": {
    en: "PERFORMANCE LEAD ANALYSIS",
    ru: "АНАЛИЗ ПРЕИМУЩЕСТВА ПРОИЗВОДИТЕЛЬНОСТИ",
    ja: "性能リード分析"
  },
  "compare.tie_score": {
    en: "Identical Throughput Benchmark Score",
    ru: "Одинаковый результат в бенчмарках",
    ja: "同等のベンチマークスコア"
  },
  "compare.faster_text": {
    en: "is {delta}% Faster",
    ru: "быстрее на {delta}%",
    ja: "は {delta}% 高速"
  },
  "compare.apply_winner_btn": {
    en: "Apply Winner to Simulator",
    ru: "Снарядить победителя в симулятор",
    ja: "勝者をシミュレーターに適用"
  },

  // Table Block Titles
  "compare.block.cpu_primary": { en: "Primary Details & Market Evaluation", ru: "Основные характеристики и рыночная оценка", ja: "CPU基本情報・市場評価" },
  "compare.block.cpu_detailed": { en: "Detailed CPU Specifications", ru: "Подробные спецификации процессора", ja: "コア構成・詳細クロック仕様" },
  "compare.block.cpu_socket": { en: "Compatibility, Socket & Power", ru: "Совместимость, сокет и энергопотребление", ja: "ソケット規格・TDP消費電力" },
  "compare.block.cpu_memory": { en: "Memory Specifications", ru: "Характеристики оперативной памяти", ja: "メモリ対応規格・帯域幅" },
  "compare.block.gpu_primary": { en: "Primary Details & Market Evaluation", ru: "Основные характеристики видеокарты", ja: "ビデオカード基本概要・市場評価" },
  "compare.block.gpu_detailed": { en: "Detailed GPU Specifications", ru: "Подробные спецификации видеокарты", ja: "シェーダーコア・演算能力" },
  "compare.block.gpu_form_factor": { en: "Form Factor & Compatibility", ru: "Форм-фактор и питание", ja: "サイズ・電源端子・スロット" },
  "compare.block.gpu_vram": { en: "VRAM Capacity & Memory Subsystem", ru: "Объём и подсистема видеопамяти", ja: "VRAMメモリ仕様・バス幅" },
  "compare.block.gpu_gaming": { en: "Average Gaming Performance & Value", ru: "Средняя производительность в играх и ценность", ja: "平均ゲーミング性能・コスパ" },
  "compare.block.gpu_outputs": { en: "Connectivity & Outputs", ru: "Интерфейсы подключения и мониторы", ja: "映像出力端子・同期技術" },
  "compare.block.gpu_api": { en: "API & SDK Support", ru: "Поддержка графических API", ja: "3DグラフィックスAPI対応" },

  // Table Metric Labels
  "compare.metric_col": { en: "Specification Metric", ru: "Характеристика", ja: "スペック項目" },
  "compare.global_rank": { en: "Place in Global Ranking", ru: "Место в мировом рейтинге", ja: "総合世界ランキング順位" },
  "compare.popularity_rank": { en: "Place by Popularity", ru: "Популярность в сборках", ja: "ビルド採用人気順位" },
  "compare.in_builds": { en: "in builds", ru: "в сборках", ja: "構成で採用" },
  "compare.cost_effectiveness": { en: "Cost-Effectiveness Evaluation", ru: "Соотношение цена / производительность", ja: "コストパフォーマンス評価" },
  "compare.power_efficiency": { en: "Power Efficiency", ru: "Энергоэффективность", ja: "ワットパフォーマンス" },
  "compare.market_segment": { en: "Market Segment", ru: "Сегмент рынка", ja: "ターゲット市場" },
  "compare.manufacturer": { en: "Designer / Manufacturer", ru: "Разработчик / Производитель", ja: "設計・製造メーカー" },
  "compare.arch_codename": { en: "Architecture Codename", ru: "Кодовое название архитектуры", ja: "アーキテクチャ名" },
  "compare.better": { en: "Better", ru: "Лучше", ja: "優位" },

  // CPU Specific Metrics
  "compare.cores_threads": { en: "Physical Cores / Threads", ru: "Ядра / Потоки", ja: "物理コア / スレッド数" },
  "compare.base_clock": { en: "Base Clock Speed", ru: "Базовая частота", ja: "ベースクロック" },
  "compare.boost_clock": { en: "Boost / Turbo Clock Speed", ru: "Максимальная частота (Boost)", ja: "ブーストクロック" },
  "compare.bus_rate": { en: "Bus Rate", ru: "Частота шины", ja: "バスレート" },
  "compare.l1_cache": { en: "L1 Cache", ru: "Кэш L1", ja: "L1 キャッシュ" },
  "compare.l2_cache": { en: "L2 Cache", ru: "Кэш L2", ja: "L2 キャッシュ" },
  "compare.l3_cache": { en: "L3 Cache Memory", ru: "Кэш L3", ja: "L3 キャッシュ" },
  "compare.process_node": { en: "Process Node Lithography", ru: "Техпроцесс", ja: "製造プロセス" },
  "compare.die_size": { en: "Die Size", ru: "Площадь кристалла", ja: "ダイサイズ" },
  "compare.max_temp": { en: "Maximum Core Temperature (TjMax)", ru: "Максимальная температура (TjMax)", ja: "最大動作温度 (TjMax)" },
  "compare.arch_64bit": { en: "64-bit Architecture Support", ru: "Поддержка 64-битной архитектуры", ja: "64ビット アーキテクチャ" },
  "compare.win11_support": { en: "Windows 11 Official Support", ru: "Официальная поддержка Windows 11", ja: "Windows 11 公式サポート" },
  "compare.supported": { en: "Supported", ru: "Поддерживается", ja: "対応" },
  "compare.compatible": { en: "Compatible", ru: "Совместим", ja: "互換" },
  "compare.legacy": { en: "Legacy", ru: "Устарел", ja: "レガシー" },
  "compare.socket_interface": { en: "Socket / Platform Interface", ru: "Сокет / Разъём", ja: "ソケット / プラットフォーム" },
  "compare.tdp": { en: "Thermal Design Power (TDP)", ru: "Тепловыделение (TDP)", ja: "熱設計電力 (TDP)" },
  "compare.rec_psu": { en: "Recommended PSU Capacity", ru: "Рекомендуемый блок питания", ja: "推奨電源ユニット容量" },
  "compare.memory_types": { en: "Supported Memory Types", ru: "Тип поддерживаемой памяти", ja: "対応メモリ規格" },
  "compare.max_memory": { en: "Maximum Memory Capacity", ru: "Максимальный объём памяти", ja: "最大メモリ容量" },
  "compare.memory_channels": { en: "Max Memory Channels", ru: "Каналы памяти", ja: "メモリチャンネル数" },
  "compare.memory_bandwidth": { en: "Maximum Memory Bandwidth", ru: "Пропускная способность памяти", ja: "最大メモリ帯域幅" },

  // GPU Specific Metrics
  "compare.gpu_arch": { en: "GPU Architecture", ru: "Архитектура GPU", ja: "GPU アーキテクチャ" },
  "compare.gpu_codename": { en: "GPU Code Name", ru: "Кодовое имя чипа", ja: "GPU コードネーム" },
  "compare.cuda_cores": { en: "Pipelines / CUDA Cores / Shaders", ru: "Шейдерные блоки / CUDA ядра", ja: "CUDAコア / シェーダー数" },
  "compare.transistors": { en: "Number of Transistors", ru: "Количество транзисторов", ja: "トランジスタ数" },
  "compare.texture_rate": { en: "Texture Fill Rate", ru: "Скорость текстурирования", ja: "テクスチャフィルレート" },
  "compare.tflops": { en: "Floating-Point Processing Power", ru: "Вычислительная мощность (TFLOPS)", ja: "単精度浮動小数点演算性能" },
  "compare.rops": { en: "ROPs Count", ru: "Блоки ROP", ja: "ROP数" },
  "compare.tmus": { en: "TMUs Count", ru: "Блоки TMU", ja: "TMU数" },
  "compare.bus_interface": { en: "Bus Interface", ru: "Интерфейс подключения", ja: "バスインターフェース" },
  "compare.card_length": { en: "Card Length", ru: "Длина видеокарты", ja: "カード長" },
  "compare.slot_width": { en: "Slot Width", ru: "Толщина (слоты)", ja: "スロット占用幅" },
  "compare.power_connectors": { en: "Supplementary Power Connectors", ru: "Разъёмы дополнительного питания", ja: "補助電源コネクタ" },
  "compare.vram_type": { en: "Memory Type", ru: "Тип видеопамяти", ja: "VRAMメモリ規格" },
  "compare.vram_max": { en: "Maximum RAM Amount", ru: "Объём видеопамяти", ja: "VRAM容量" },
  "compare.vram_bus": { en: "Memory Bus Width", ru: "Разрядность шины памяти", ja: "メモリバス幅" },
  "compare.vram_clock": { en: "Memory Clock Speed", ru: "Частота памяти", ja: "メモリクロック" },
  "compare.vram_bw": { en: "Memory Bandwidth", ru: "Пропускная способность VRAM", ja: "VRAMメモリ帯域幅" },
  "compare.shared_memory": { en: "Shared System Memory Status", ru: "Выделение из ОЗУ", ja: "共有システムメモリ" },
  "compare.avg_fps_1080p": { en: "Avg. 1080p FPS", ru: "Средний FPS в 1080p", ja: "1080p 平均FPS" },
  "compare.cost_fps_1080p": { en: "Cost per Frame (1080p)", ru: "Цена за кадр (1080p)", ja: "フレーム単価 (1080p)" },
  "compare.avg_fps_1440p": { en: "Avg. 1440p FPS", ru: "Средний FPS в 1440p", ja: "1440p 平均FPS" },
  "compare.cost_fps_1440p": { en: "Cost per Frame (1440p)", ru: "Цена за кадр (1440p)", ja: "フレーム単価 (1440p)" },
  "compare.avg_fps_4k": { en: "Avg. 4K FPS", ru: "Средний FPS в 4K", ja: "4K 平均FPS" },
  "compare.cost_fps_4k": { en: "Cost per Frame (4K)", ru: "Цена за кадр (4K)", ja: "フレーム単価 (4K)" },
  "compare.display_connectors": { en: "Display Connectors", ru: "Разъёмы вывода изображения", ja: "映像出力端子" },
  "compare.hdmi_21": { en: "HDMI 2.1 Standard", ru: "Стандарт HDMI 2.1", ja: "HDMI 2.1 規格" },
  "compare.gsync_support": { en: "G-SYNC / FreeSync Display Support", ru: "Поддержка G-SYNC / FreeSync", ja: "G-SYNC / FreeSync 対応" },
  "compare.directx": { en: "DirectX API Revision", ru: "Версия DirectX API", ja: "DirectX バージョン" },
  "compare.shader_model": { en: "Shader Model Version", ru: "Версия Shader Model", ja: "シェーダーモデル" },
  "compare.opengl": { en: "OpenGL Version", ru: "Версия OpenGL", ja: "OpenGL バージョン" },
  "compare.opencl": { en: "OpenCL Version", ru: "Версия OpenCL", ja: "OpenCL バージョン" },
  "compare.vulkan": { en: "Vulkan API Version", ru: "Версия Vulkan API", ja: "Vulkan バージョン" },
  "compare.cuda_gpgpu": { en: "CUDA / GPGPU Acceleration", ru: "Ускорение CUDA / GPGPU", ja: "CUDA / GPGPU アクセラレーション" },
  "compare.empty_state_title": { en: "Select 2 components to compare performance", ru: "Выберите 2 компонента для сравнения производительности", ja: "2つのコンポーネントを選択して比較" },
  "compare.empty_state_desc": { en: "Choose both Candidate A and Candidate B from the dropdown menus above to generate the telemetry benchmark matrix and relative advantage score.", ru: "Выберите Кандидата A и Кандидата B из выпадающих списков выше, чтобы построить матрицу бенчмарков и рассчитать преимущество.", ja: "上のドロップダウンメニューから候補Aと候補Bを選択して、テレメトリベンチマークと相乗効果スコアを生成します。" },

  // Chart and FPS Benchmarks Keys
  "chart.telemetry_title": { en: "Aggregate Telemetry Performance Matrix", ru: "Матрица итоговой производительности", ja: "総合性能比較チャート" },
  "chart.telemetry_subtitle": { en: "Normalized throughput benchmark scale relative to historical silicon milestones.", ru: "Нормализованная шкала производительности относительно исторических комплектующих.", ja: "歴史的プロセッサの節目に対する正規化ベンチマークスケール。" },
  "chart.outperforms_text": { en: "outperforms {loser} by an impressive +{delta}% based on aggregate telemetry benchmarks.", ru: "превосходит {loser} на рекордные +{delta}% по результатам агрегированного тестирования.", ja: "は総合ベンチマークで {loser} を +{delta}% 上回るパフォーマンスを発揮します。" },
  "chart.identical_text": { en: "Both components deliver identical aggregate performance scores across our telemetry workload suite.", ru: "Оба компонента показывают идентичную итоговую производительность во всех тестах.", ja: "両コンポーネントはテレメトリテスト全体で同等の総合パフォーマンスを発揮します。" },
  "chart.gaming_title": { en: "Gaming FPS Benchmarks", ru: "Игровые тесты FPS", ja: "実ゲームFPS性能比較" },
  "chart.gaming_subtitle": { en: "Empirical FPS telemetry across 1080p, 1440p, and 4K graphics presets.", ru: "Результаты тестов FPS в разрешениях 1080p, 1440p и 4K.", ja: "1080p、1440p、4K画質設定での実測FPSテレメトリ。" },
  "chart.smooth_fps": { en: "Smooth (60+ FPS)", ru: "Плавно (60+ FPS)", ja: "快適 (60+ FPS)" },
  "chart.playable_fps": { en: "Playable (30-59 FPS)", ru: "Играбельно (30-59 FPS)", ja: "プレイ可能 (30-59 FPS)" },
  "chart.demanding_fps": { en: "Demanding (<30 FPS)", ru: "Требовательно (<30 FPS)", ja: "負荷高 (<30 FPS)" },

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
  "reliance.cpu_bound": {
    en: "CPU / DRAW CALL BOUND",
    ru: "УПЁРСЛОСЬ В ПРОЦЕССОР",
    ja: "CPU・描画スレッド限界"
  },
  "reliance.gpu_headroom": {
    en: "GPU HEADROOM AVAILABLE",
    ru: "ЗАПАС ПО ВИДЕОКАРТЕ",
    ja: "GPU ヘッドルームあり"
  },
  "reliance.high_load": {
    en: "HIGH WORKLOAD",
    ru: "ВЫСОКАЯ НАГРУЗКА",
    ja: "高負荷"
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
  },
  "footer.badge_verified": {
    en: "Verified Telemetry v2.6",
    ru: "Проверенная телеметрия v2.6",
    ja: "検証済みテレメトリ v2.6"
  },
  "footer.legal_consent_active": {
    en: "Legal Consent Active ✅",
    ru: "Согласие принято ✅",
    ja: "法的同意済み ✅"
  },
  "footer.legal_terms_btn": {
    en: "Legal & Terms",
    ru: "Условия и лицензия",
    ja: "法的通知と利用規約"
  },
  "footer.cookie_settings": {
    en: "Cookie Settings",
    ru: "Настройки Cookie",
    ja: "クッキー設定"
  },
  "footer.nav_title": {
    en: "Quick Navigation",
    ru: "Быстрая навигация",
    ja: "クイックナビゲーション"
  },
  "footer.nav_simulator": {
    en: "Hardware Simulator (3-Step Wizard)",
    ru: "Симулятор сборки (3 шага)",
    ja: "ハードウェアシミュレーター (3ステップ)"
  },
  "footer.nav_builds": {
    en: "Recommended Game Builds ($500-$3,500)",
    ru: "Готовые игровые сборки ($500–$3500)",
    ja: "推奨ゲーム構成 ($500〜$3,500)"
  },
  "footer.nav_store": {
    en: "PC Configurator Store & Checkout",
    ru: "Конфигуратор и оформление",
    ja: "PC構成ストア＆チェックアウト"
  },
  "footer.hardware_title": {
    en: "Featured Hardware",
    ru: "Популярное железо",
    ja: "注目ハードウェア"
  },
  "footer.games_title": {
    en: "Supported Games",
    ru: "Поддерживаемые игры",
    ja: "対応ゲーム"
  },
  "footer.all_rights_reserved": {
    en: "All rights reserved.",
    ru: "Все права защищены.",
    ja: "All rights reserved."
  },
  "footer.terms": {
    en: "Terms of Service",
    ru: "Условия использования",
    ja: "利用規約"
  },
  "footer.privacy": {
    en: "Privacy Policy",
    ru: "Политика конфиденциальности",
    ja: "プライバシー"
  },
  "footer.disclaimer": {
    en: "Telemetry Disclaimer",
    ru: "Отказ от ответственности",
    ja: "免責事項"
  },
  "footer.affiliate": {
    en: "Commercial & Affiliate",
    ru: "Коммерческие условия",
    ja: "商業開示"
  },
  "footer.buy_build": {
    en: "Buy Build",
    ru: "Купить сборку",
    ja: "構成の購入"
  },

  // Store & Buy Complete PC Build Modal
  "store.modal_title": {
    en: "Buy Complete PC Build",
    ru: "Оформление и покупка ПК сборки",
    ja: "PC構成の購入"
  },
  "store.modal_subtitle": {
    en: "Auto-matched motherboard socket, cooling TDP, and price tier configurator",
    ru: "Автоподбор материнской платы по сокету, охлаждения по TDP и класса компонентов",
    ja: "マザーボードソケット、冷却TDP、価格帯の自動マッチングコンフィギュレーター"
  },
  "store.sync_active_title": {
    en: "Active Calculator Configuration Loaded:",
    ru: "Загружена конфигурация из калькулятора:",
    ja: "アクティブな電卓構成がロードされました:"
  },
  "store.sync_active_badge": {
    en: "✓ Calculator Synced",
    ru: "✓ Синхронизировано",
    ja: "✓ 電卓同期済み"
  },
  "store.sync_default_title": {
    en: "No Custom Hardware Selected in Calculator Yet:",
    ru: "Компоненты в калькуляторе еще не выбраны:",
    ja: "電卓でカスタムハードウェアが未選択です:"
  },
  "store.sync_default_desc": {
    en: "Showing default High-End Gaming Preset. Configure CPU/GPU in Step 1 or Catalog to sync your exact build!",
    ru: "Показан пресет по умолчанию. Выберите CPU/GPU в Шаге 1 или Каталоге для синхронизации вашей сборки!",
    ja: "デフォルトのハイエンド構成を表示中。ステップ1またはカタログでCPU/GPUを選択して同期してください！"
  },
  "store.sync_default_badge": {
    en: "Default Preset",
    ru: "Пресет по умолчанию",
    ja: "デフォルト構成"
  },
  "store.tier_select_title": {
    en: "Select Component Quality Tier",
    ru: "Выберите уровень качества компонентов",
    ja: "コンポーネントの品質ティアを選択"
  },
  "store.current_tier_label": {
    en: "Current Tier:",
    ru: "Текущий уровень:",
    ja: "現在のティア:"
  },
  "store.tier_budget_title": {
    en: "Value / Budget",
    ru: "Оптимальный / Бюджетный",
    ja: "バリュー / バジェット"
  },
  "store.tier_budget_sub": {
    en: "Best FPS per Dollar",
    ru: "Максимум FPS на рубль",
    ja: "コストパフォーマンス重視"
  },
  "store.tier_premium_title": {
    en: "High / Premium",
    ru: "Премиум / Продвинутый",
    ja: "ハイ / プレミアム"
  },
  "store.tier_premium_sub": {
    en: "AIO Cooling & WiFi 6E",
    ru: "СВО охлаждение и WiFi 6E",
    ja: "水冷クーラー & WiFi 6E"
  },
  "store.tier_extreme_title": {
    en: "Extreme / Max",
    ru: "Максимальный / Экстрим",
    ja: "エクストリーム / マックス"
  },
  "store.tier_extreme_sub": {
    en: "LCD Screen & WiFi 7",
    ru: "LCD дисплей и WiFi 7",
    ja: "LCDスクリーン & WiFi 7"
  },
  "store.compat_verified_title": {
    en: "100% Socket & Power Verified:",
    ru: "100% Совместимость по сокету и питанию:",
    ja: "100% ソケット・電源検証済み:"
  },
  "store.compat_verified_desc": {
    en: "motherboard verified for",
    ru: "материнская плата проверена для",
    ja: "マザーボード動作確認済み:"
  },
  "store.copy_spec_btn": {
    en: "Copy Spec Sheet",
    ru: "Скопировать сборку",
    ja: "構成をコピー"
  },
  "store.copied_spec_btn": {
    en: "Copied Build!",
    ru: "Скопировано!",
    ja: "コピー完了！"
  },
  "store.comp_cpu": {
    en: "CPU Processor",
    ru: "Процессор",
    ja: "プロセッサ (CPU)"
  },
  "store.comp_mobo": {
    en: "Motherboard",
    ru: "Материнская плата",
    ja: "マザーボード"
  },
  "store.comp_gpu": {
    en: "GPU Graphics Card",
    ru: "Видеокарта",
    ja: "グラフィックボード (GPU)"
  },
  "store.comp_cooler": {
    en: "CPU Cooler",
    ru: "Кулер / Охлаждение",
    ja: "CPUクーラー"
  },
  "store.comp_ram": {
    en: "System RAM Memory",
    ru: "Оперативная память",
    ja: "システムメモリ (RAM)"
  },
  "store.comp_ssd": {
    en: "Solid State Drive",
    ru: "Накопитель (SSD)",
    ja: "ストレージ (SSD)"
  },
  "store.comp_psu": {
    en: "Power Supply (PSU)",
    ru: "Блок питания (БП)",
    ja: "電源ユニット (PSU)"
  },
  "store.comp_case": {
    en: "PC Gaming Chassis",
    ru: "Корпус ПК",
    ja: "PCケース"
  },
  "store.sub_thermal_system": {
    en: "Thermal System",
    ru: "Система охлаждения",
    ja: "冷却システム"
  },
  "store.sub_ram_speed": {
    en: "Speed:",
    ru: "Частота:",
    ja: "速度:"
  },
  "store.sub_dual_channel": {
    en: "Dual Channel",
    ru: "Двухканальный режим",
    ja: "デュアルチャンネル"
  },
  "store.sub_nvme_storage": {
    en: "High Speed NVMe Storage",
    ru: "Высокоскоростной NVMe накопитель",
    ja: "高速NVMeストレージ"
  },
  "store.sub_psu_compliant": {
    en: "ATX 3.0 PCIe 5.0 Compliant",
    ru: "Стандарт ATX 3.0 / PCIe 5.0",
    ja: "ATX 3.0 / PCIe 5.0 準拠"
  },
  "store.sub_case_tower": {
    en: "Tempered Glass Airflow Tower",
    ru: "Корпус с закаленным стеклом и обдувом",
    ja: "強化ガラスエアフローケース"
  },
  "store.cooler_extreme_note": {
    en: "Extreme Tier: Features a 2.1\" IPS LCD display and iCUE LINK magnetic daisy-chain cables for ultimate cooling and zero noise.",
    ru: "Экстрим уровень: Дисплей 2.1\" IPS LCD и магнитные кабели iCUE LINK для идеального охлаждения и тишины.",
    ja: "エクストリームティア: 2.1インチIPS LCDディスプレイとiCUE LINK磁気デイジーチェーンケーブルを搭載。"
  },
  "store.cooler_liquid_note": {
    en: "High CPU TDP (160W+) requires a 360mm Liquid AIO to prevent heavy thermal throttling under load.",
    ru: "Высокий TDP процессора (160Вт+) требует 360-мм СВО во избежание троттлинга под нагрузкой.",
    ja: "高TDP (160W+) のCPUには熱スロットリングを防ぐため360mm水冷AIOが必要です。"
  },
  "store.cooler_air_note": {
    en: "High-efficiency dual-tower air cooler offers maximum silence and zero pump leak risk for mid-TDP CPUs.",
    ru: "Эффективный двухбашенный кулер обеспечивает тишину и надежность для среднемощных процессоров.",
    ja: "高効率なデュアルタワー空冷クーラー。中間TDPのCPUに静音性と高い信頼性を提供します。"
  },
  "store.total_label": {
    en: "Estimated Build Total",
    ru: "Итоговая стоимость сборки",
    ja: "構成の合計見積もり金額"
  },
  "store.order_amazon_btn": {
    en: "Order Parts on Amazon",
    ru: "Заказать детали на Amazon",
    ja: "Amazonでパーツを注文"
  },
  "store.order_newegg_btn": {
    en: "Newegg",
    ru: "Newegg",
    ja: "Newegg"
  }
};
