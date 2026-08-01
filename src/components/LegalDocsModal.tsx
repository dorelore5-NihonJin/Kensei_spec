import { useState } from "react";
import {
  X,
  ShieldCheck,
  FileText,
  Activity,
  DollarSign,
  CheckCircle2,
  Lock,
  Scale,
  ChevronRight,
  BookOpen,
  ShieldAlert,
  AlertTriangle
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface LegalDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "terms" | "privacy" | "disclaimer" | "affiliate";
}

export default function LegalDocsModal({ isOpen, onClose, initialTab = "terms" }: LegalDocsModalProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "disclaimer" | "affiliate">(initialTab);

  if (!isOpen) return null;

  const lang = (language as "en" | "ru" | "ja") || "ru";

  // Modal localized strings
  const content = {
    headerTitle: {
      ru: "KENSEI SPEC Юридические документы и Нормы",
      en: "KENSEI SPEC Legal & Governance",
      ja: "KENSEI SPEC 法的文書・ガバナンス"
    },
    headerSub: {
      ru: "Условия использования, Политика конфиденциальности, Методология телеметрии и Коммерческие раскрытия",
      en: "Exhaustive Terms of Service, Privacy Protection Policy, Telemetry Methodology & Commercial Disclosures",
      ja: "利用規約、プライバシー保護方針、テレメトリ測定手法及び商業開示事項"
    },
    tabs: {
      terms: {
        ru: "1. Условия использования",
        en: "1. Terms of Service",
        ja: "1. 利用規約"
      },
      privacy: {
        ru: "2. Конфиденциальность",
        en: "2. Privacy Policy",
        ja: "2. プライバシー"
      },
      disclaimer: {
        ru: "3. Отказ от ответственности",
        en: "3. Telemetry & Disclaimer",
        ja: "3. 免責事項"
      },
      affiliate: {
        ru: "4. Коммерческие условия",
        en: "4. Commercial Terms",
        ja: "4. 商業開示"
      }
    },

    // TAB 1: TERMS
    terms: {
      alertTitle: {
        ru: "УСЛОВИЯ ИСПОЛЬЗОВАНИЯ И ЛИЦЕНЗИОННОЕ СОГЛАШЕНИЕ (2026 РЕДАКЦИЯ)",
        en: "TERMS OF SERVICE & END USER LICENSE AGREEMENT (2026 EDITION)",
        ja: "利用規約及びエンドユーザーライセンス契約（2026年版）"
      },
      alertSub: {
        ru: "Дата вступления в силу: 1 января 2026 г. Распространяется на всех пользователей KENSEI SPEC (剣圣スペック).",
        en: "Effective Date: January 1, 2026. Applicable to all global users accessing KENSEI SPEC.",
        ja: "発効日: 2026年1月1日。KENSEI SPECを利用するすべてのユーザーに適用されます。"
      },
      sec1Title: {
        ru: "Раздел 1: Преамбула и обязательное согласие",
        en: "Section 1: Preamble & Binding Acceptance",
        ja: "第1条 本規約への同意"
      },
      sec1Body: {
        ru: "Добро пожаловать в KENSEI SPEC (剣圣スペック). Настоящие Условия использования являются юридически обязывающим соглашением между вами («Пользователь») и администрацией KENSEI SPEC. Получая доступ к нашему математическому движку телеметрии, 3-шаговому симулятору или каталогу из 250 ПК сборок, вы подтверждаете, что прочитали и полностью принимаете данные Условия.",
        en: "Welcome to KENSEI SPEC. These Terms of Service constitute a legally binding agreement between you and KENSEI SPEC. By accessing our hardware physics telemetry engine, interactive 3-step configurator, or PC builds catalog, you acknowledge that you have read and agreed to these Terms in full.",
        ja: "KENSEI SPECへようこそ。本利用規約は、ユーザーとKENSEI SPEC運営との間の法的契約です。本プラットフォームを利用することで、本規約に完全に同意したものとみなされます。"
      },
      sec2Title: {
        ru: "Раздел 2: Защита интеллектуальной собственности и алгоритмов",
        en: "Section 2: Intellectual Property & Telemetry Math Protection",
        ja: "第2条 知的財産権及び数理モデルの保護"
      },
      sec2Body: {
        ru: "Все права на интеллектуальную собственность KENSEI SPEC, включая исходный код, алгоритмы физического масштабирования 3D V-Cache, матрицы боттлнеков PCIe, CSS-стили glassmorphic и документацию, принадлежат KENSEI SPEC.",
        en: "All intellectual property rights associated with KENSEI SPEC—including source code, algorithms, 3D V-Cache latency scaling calculations, PCIe bandwidth bottleneck matrices, UI styling tokens, and text documentation—are the exclusive property of KENSEI SPEC.",
        ja: "ソースコード、3D V-Cacheスケーリング計算式、PCIeボトルネックマトリクス、UIデザインを含むKENSEI SPECのすべての知的財産権は、当社に帰属します。"
      },
      sec3Title: {
        ru: "Раздел 3: Отказ от ответственности за сборку ПК (DIY)",
        en: "Section 3: Hardware Assembly & Safety Disclaimer",
        ja: "第3条 自作PC組み立てにおける自己責任原則"
      },
      sec3Body: {
        ru: "KENSEI SPEC предоставляет математические расчеты производительности исключительно в ознакомительных и аналитических целях. Пользователь несет 100% личную ответственность при покупке реальных комплектующих и их самостоятельной сборке.",
        en: "KENSEI SPEC provides mathematical hardware telemetry predictions for educational and analytical reference purposes only. The User assumes 100% full sole responsibility when purchasing physical hardware parts and undertaking DIY PC assembly.",
        ja: "KENSEI SPECは参考目的でのみパフォーマンス予測を提供します。実際のパーツ購入及びPC組み立ては、すべてユーザー自身の責任において行ってください。"
      },
      sec4Title: {
        ru: "Раздел 4: Ограничение ответственности",
        en: "Section 4: Limitation of Liability",
        ja: "第4条 責任制限"
      },
      sec4Body: {
        ru: "Платформа KENSEI SPEC не несет ответственности за любые косвенные, случайные или штрафные убытки, включая потерю данных, повреждение оборудования при сборке или несоответствие ожиданий.",
        en: "To the maximum extent permitted by applicable law, in no event shall KENSEI SPEC or its developers be liable for any direct, indirect, incidental, special, or consequential damages arising out of the use of the Platform.",
        ja: "本プラットフォームの利用または利用不能から生じるいかなる損害についても、当運営は一切の責任を負いません。"
      },
      sec5Title: {
        ru: "Раздел 5: Применимое право и юрисдикция",
        en: "Section 5: Governing Law & Jurisdiction",
        ja: "第5条 準拠法及び管轄裁判所"
      },
      sec5Body: {
        ru: "Настоящие Условия регулируются и толкуются в соответствии с законодательством. Любые споры подлежат рассмотрению в судебном порядке.",
        en: "These Terms shall be governed by and construed in accordance with standard international software governance laws.",
        ja: "本規約は日本法に準拠し、東京地方裁判所を第一審の専属的合意管轄裁判所とします。"
      }
    },

    // TAB 2: PRIVACY
    privacy: {
      alertTitle: {
        ru: "ГЛОБАЛЬНЫЙ СТАНДАРТ КОНФИДЕНЦИАЛЬНОСТИ И АНОНИМНОСТИ (GDPR / CCPA / APPI)",
        en: "GLOBAL PRIVACY & DATA ANONYMITY STANDARD (GDPR / CCPA / APPI COMPLIANT)",
        ja: "国際プライバシー及びデータ匿名性基準（GDPR / CCPA / APPI適合）"
      },
      alertSub: {
        ru: "KENSEI SPEC работает по архитектуре Zero-Tracking. Ваш выбор комплектующих остается 100% локальным в вашем браузере.",
        en: "KENSEI SPEC operates under a zero-tracking privacy architecture. Your hardware choices remain 100% private to your browser.",
        ja: "KENSEI SPECはゼロトラッキング・プライバシー構造で動作します。選択したパーツ情報はすべてブラウザ内にのみ保持されます。"
      },
      sec1Title: {
        ru: "Раздел 1: Несбор персональных данных (Zero-PII)",
        en: "Section 1: Non-Collection of Personally Identifiable Information",
        ja: "第1条 個人情報の非収集方針"
      },
      sec1Body: {
        ru: "Мы НЕ собираем, НЕ передаем и НЕ храним ваши персональные данные (ФИО, адрес, телефон, электронную почту или данные банковских карт). Вы можете использовать симулятор абсолютно анонимно без создания аккаунта.",
        en: "We do NOT ask for, record, transmit, or store personal identifiers such as your legal name, physical address, phone number, email, or credit card credentials.",
        ja: "氏名、住所、電話番号、メールアドレス、クレジットカード情報などの個人情報を収集・保存・送信することは一切ありません。"
      },
      sec2Title: {
        ru: "Раздел 2: Локальные вычисления в браузере (Client-Side Math)",
        en: "Section 2: Client-Side Computation Architecture",
        ja: "第2条 クライアントサイド処理の仕組み"
      },
      sec2Body: {
        ru: "В отличие от традиционных сервисов, 100% расчетов математического движка KENSEI SPEC выполняются непосредственно в JavaScript вашего браузера. Сервер не получает информацию о выбираемых вами деталях.",
        en: "100% of KENSEI SPEC's telemetry calculation engine runs directly within your local web browser's JavaScript environment.",
        ja: "すべてのテレメトリ計算は、ユーザーのWebブラウザ（JavaScript）内でローカルに実行されます。"
      },
      sec3Title: {
        ru: "Раздел 3: Использование Cookie и LocalStorage",
        en: "Section 3: Cookie & Local Storage Disclosure (`localStorage`)",
        ja: "第3条 クッキー及びローカルストレージの使用目的"
      },
      sec3Body: {
        ru: "Файлы Cookie и `localStorage` используются исключительно для сохранения вашей активной сборки, настроек графики и параметров согласия при перезагрузке страницы.",
        en: "KENSEI SPEC utilizes HTML5 Web Storage (`localStorage`) strictly to preserve your hardware configuration across browser reloads.",
        ja: "Web Storage（`localStorage`）は、ページ再読み込み時に選択したパーツ構成や設定を保持するためにのみ使用されます。"
      }
    },

    // TAB 3: DISCLAIMER
    disclaimer: {
      alertTitle: {
        ru: "МЕТОДОЛОГИЯ ТЕЛЕМЕТРИИ И РАСЧЕТА FPS (КАЛИБРОВКА 2026)",
        en: "HARDWARE TELEMETRY & FPS BENCHMARK METHODOLOGY (2026 CALIBRATION)",
        ja: "ハードウェア・テレメトリ及びFPS測定手法（2026年較正）"
      },
      alertSub: {
        ru: "Подробное техническое описание работы физического математического движка KENSEI SPEC.",
        en: "Comprehensive technical breakdown of how KENSEI SPEC models gaming framerates and workload bottlenecks.",
        ja: "KENSEI SPECがゲームのフレームレートとボトルネックをモデル化する技術的解説。"
      },
      sec1Title: {
        ru: "Раздел 1: Источники эмпирических данных",
        en: "Section 1: Empirical Dataset Sourcing",
        ja: "第1条 データソース及びベンチマーク検証"
      },
      sec1Body: {
        ru: "Формулы KENSEI SPEC основываются на логах реального тестирования из индустриальных утилит: CapFrameX, TechPowerUp, Gamers Nexus, Hardware Unboxed и MSI Afterburner по 18 современным играм.",
        en: "Our telemetry mathematical formulas are derived from empirical hardware log analysis sourced from CapFrameX, TechPowerUp, Gamers Nexus, Hardware Unboxed, and MSI Afterburner across modern games.",
        ja: "当社のテレメトリ計算式は、CapFrameX、TechPowerUp、Gamers Nexusなどの実測ログデータに基づいて構築されています。"
      },
      sec2Title: {
        ru: "Раздел 2: Факторы отклонений (погрешность ±3% – ±8%)",
        en: "Section 2: Real-World Performance Variance Variables (±3% to ±8%)",
        ja: "第2条 リアルワールドでの誤差要因（±3%〜±8%）"
      },
      sec2Body: {
        ru: "Расчетный FPS показывает среднюю ожидаемую производительность. Реальный FPS на физическом ПК может варьироваться на ±3%–±8% из-за фоновых программ Windows 11, охлаждения, биос-лимитов VRM и двухканала ОЗУ.",
        en: "Predicted framerates reflect average expected performance. Actual real-world framerates may fluctuate ±3% to ±8% due to background OS tasks, cooling, and VRM power limits.",
        ja: "予測FPSは標準的な環境での average 値です。実際の環境ではバックグラウンド処理や冷却状態により±3%〜±8%の変動が生じる場合があります。"
      }
    },

    // TAB 4: COMMERCIAL
    affiliate: {
      alertTitle: {
        ru: "КОММЕРЧЕСКИЕ УСЛОВИЯ И ПАРТНЕРСКИЕ ССЫЛКИ (AFFILIATE TRANSPARENCY)",
        en: "COMMERCIAL DISCLOSURE & MERCHANT AFFILIATE TRANSPARENCY",
        ja: "商業開示及びアフィリエイト透明性方針"
      },
      alertSub: {
        ru: "Полное раскрытие информации о партнерских ссылках, обновлении цен и финансировании платформы.",
        en: "Full disclosure regarding referral links, merchant pricing updates, and platform funding transparency.",
        ja: "提携リンク、価格更新、及び運営資金に関する透明性の開示。"
      },
      sec1Title: {
        ru: "Раздел 1: Партнерские ссылки (Affiliate Links)",
        en: "Section 1: Affiliate Referral Partnerships",
        ja: "第1条 アフィリエイト提携に関する開示"
      },
      sec1Body: {
        ru: "При нажатии на кнопки покупки сборки вы можете переходить в магазины ритейлеров (Amazon, DNS, Regard, Citilink, Newegg). KENSEI SPEC участвует в партнерских программах и может получать небольшое комиссионное вознаграждение.",
        en: "When you click outbound purchasing buttons, you may be redirected to verified hardware retailers. KENSEI SPEC participates in affiliate referral programs and may earn a small commission.",
        ja: "パーツ購入ボタンをクリックすると、Amazon等の提携販売サイトに移動する場合があります。当社は紹介手数料を得る場合があります。"
      },
      sec2Title: {
        ru: "Раздел 2: Нулевая наценка для покупателя",
        en: "Section 2: Zero Cost Penalty to Users",
        ja: "第2条 ユーザー費用の完全同額保証"
      },
      sec2Body: {
        ru: "Партнерские ссылки работают БЕЗ какой-либо дополнительной стоимости для вас. Итоговая цена на сайте продавца 100% идентична независимо от перехода по нашей ссылке.",
        en: "Affiliate referral links operate at ZERO additional cost to you. The purchase price on merchant checkout pages remains 100% identical.",
        ja: "アフィリエイトリンクの利用により、ユーザーに追加費用が発生することは一切ありません。"
      },
      sec3Title: {
        ru: "Раздел 3: Полная независимость алгоритмов телеметрии",
        en: "Section 3: Absolute Editorial & Telemetry Independence",
        ja: "第3条 評価ロジックの完全な中立性"
      },
      sec3Body: {
        ru: "Партнерские отношения НЕ влияют на математические формулы симулятора и расчеты FPS. Мы не принимаем платные спонсорские завышения баллов.",
        en: "Our commercial affiliate relationships do NOT influence our simulator mathematical formulas or FPS calculations.",
        ja: "商業的提携がシミュレーターの計算式やFPS評価ロジックに影響を与えることは一切ありません。"
      }
    },

    agreeBtn: {
      ru: "Я принимаю условия / Я согласен",
      en: "I Acknowledge & Agree",
      ja: "了解・同意しました"
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white dark:bg-[#1A1C1E] border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1E2022] dark:text-white">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E2022] text-white flex items-center justify-center font-black shadow-md border border-white/10 shrink-0">
              <Scale className="w-5 h-5 text-[#E88D9F]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>{content.headerTitle[lang]}</span>
                <span className="text-[10px] bg-[#E88D9F] text-white px-2 py-0.5 rounded font-black tracking-wider uppercase">v2.6 Legal Edition</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-extrabold mt-0.5">
                {content.headerSub[lang]}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-2.5 gap-2">
          <button
            onClick={() => setActiveTab("terms")}
            className={`px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition text-center ${
              activeTab === "terms"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#E88D9F] shrink-0" />
            <span className="truncate">{content.tabs.terms[lang]}</span>
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition text-center ${
              activeTab === "privacy"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{content.tabs.privacy[lang]}</span>
          </button>

          <button
            onClick={() => setActiveTab("disclaimer")}
            className={`px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition text-center ${
              activeTab === "disclaimer"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{content.tabs.disclaimer[lang]}</span>
          </button>

          <button
            onClick={() => setActiveTab("affiliate")}
            className={`px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 transition text-center ${
              activeTab === "affiliate"
                ? "bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{content.tabs.affiliate[lang]}</span>
          </button>
        </div>

        {/* Scrollable Document Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[65vh] text-xs font-extrabold leading-relaxed text-gray-700 dark:text-gray-300 flex flex-col gap-6">
          
          {/* TAB 1: TERMS OF SERVICE */}
          {activeTab === "terms" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3 text-indigo-900 dark:text-indigo-200">
                <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">{content.terms.alertTitle[lang]}</h4>
                  <p className="text-[11px] mt-0.5 font-bold">{content.terms.alertSub[lang]}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> {content.terms.sec1Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.terms.sec1Body[lang]}</p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> {content.terms.sec2Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.terms.sec2Body[lang]}</p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> {content.terms.sec3Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.terms.sec3Body[lang]}</p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> {content.terms.sec4Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.terms.sec4Body[lang]}</p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> {content.terms.sec5Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.terms.sec5Body[lang]}</p>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">{content.privacy.alertTitle[lang]}</h4>
                  <p className="text-[11px] mt-0.5 font-bold">{content.privacy.alertSub[lang]}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-emerald-400" /> {content.privacy.sec1Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.privacy.sec1Body[lang]}</p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-emerald-400" /> {content.privacy.sec2Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.privacy.sec2Body[lang]}</p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-emerald-400" /> {content.privacy.sec3Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.privacy.sec3Body[lang]}</p>
              </div>
            </div>
          )}

          {/* TAB 3: TELEMETRY DISCLAIMER */}
          {activeTab === "disclaimer" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">{content.disclaimer.alertTitle[lang]}</h4>
                  <p className="text-[11px] mt-0.5 font-bold">{content.disclaimer.alertSub[lang]}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-amber-400" /> {content.disclaimer.sec1Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.disclaimer.sec1Body[lang]}</p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-amber-400" /> {content.disclaimer.sec2Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.disclaimer.sec2Body[lang]}</p>
              </div>
            </div>
          )}

          {/* TAB 4: COMMERCIAL & AFFILIATE */}
          {activeTab === "affiliate" && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-900 dark:text-rose-200">
                <DollarSign className="w-5 h-5 text-[#E88D9F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-wider text-xs">{content.affiliate.alertTitle[lang]}</h4>
                  <p className="text-[11px] mt-0.5 font-bold">{content.affiliate.alertSub[lang]}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> {content.affiliate.sec1Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.affiliate.sec1Body[lang]}</p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> {content.affiliate.sec2Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.affiliate.sec2Body[lang]}</p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#1E2022] dark:text-white uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-1 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#E88D9F]" /> {content.affiliate.sec3Title[lang]}
                </h4>
                <p className="text-xs font-bold leading-relaxed text-gray-600 dark:text-gray-300">{content.affiliate.sec3Body[lang]}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <div className="text-gray-500 dark:text-gray-400 font-extrabold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8A9A86]" />
            <span>© 2026 KENSEI SPEC (剣聖スペック). Legal Version 2.6.</span>
          </div>
          <button
            onClick={() => {
              try {
                localStorage.setItem("kensei_legal_accepted", "true");
                localStorage.setItem("kensei_legal_accepted_timestamp", new Date().toISOString());
              } catch (e) {
                // Ignore storage errors
              }
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#1E2022] dark:bg-white text-white dark:text-[#1E2022] font-black hover:opacity-90 transition shadow-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{content.agreeBtn[lang]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
