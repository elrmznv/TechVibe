import { Language, ServiceDetail, TranslationDictionary } from "./types";

export const SERVICES: ServiceDetail[] = [
  {
    id: "web-dev",
    name: {
      AZ: "Veb Saytların Hazırlanması",
      EN: "Web Platform Engineering",
      RU: "Разработка Веб-Платформ"
    },
    shortDesc: {
      AZ: "Maksimal sürətli rəqəmsal ekosistemlər və ultra-müasir korporativ portallar.",
      EN: "Hyper-fast enterprise digital systems and polished responsive platforms.",
      RU: "Сверхбыстрые корпоративные системы и изящные адаптивные веб-решения."
    },
    longDesc: {
      AZ: "TechVibe mükəmməl vizual görünüşü 60 FPS fərdi animasiyalar, Next.js və Rust web-assembly (WASM) infrastrukturu ilə birləşdirir. Hər bir platforma sürət və axtarış motoru (SEO) üçün xüsusi olaraq optimallaşdırılır.",
      EN: "TechVibe fuses premium visual design with custom 60 FPS motion layers, Next.js, and high-efficiency Rust WebAssembly (WASM) cores. Out-performing average standards by default.",
      RU: "TechVibe объединяет премиальный визуальный стиль с анимацией 60 кадров в секунду, Next.js и оптимизированными модулями Rust WebAssembly (WASM)."
    },
    iconName: "Globe",
    technologies: ["React / Next.js", "Rust (WASM)", "Tailwind v4", "Go", "Framer Motion", "Vite Core"],
    duration: {
      AZ: "3 - 6 həftə",
      EN: "3 - 6 weeks",
      RU: "3 - 6 недель"
    },
    priceEstimate: {
      AZ: "3,500 AZN-dən başlayaraq",
      EN: "From $2,000 USD",
      RU: "От 120,000 RUB"
    },
    architecture: {
      AZ: [
        "Edge-native paylanmış server strukturu",
        "İnteryerdə WASM əsaslı ağır hesablama modulları",
        "Zərif CSS render mexanizmləri",
        "İnteqrasiya olunmuş analitika infrastrukturu"
      ],
      EN: [
        "Edge-native distributed hosting schema",
        "Under-the-hood WASM computing nodes",
        "Optimized style render trees",
        "Built-in telemetry & performance analytics"
      ],
      RU: [
        "Глобально распределенная Edge-архитектура",
        "Модули WASM для ресурсоемких вычислений",
        "Оптимизированные деревья рендеринга",
        "Встроенная сквозная аналитика"
      ]
    }
  },
  {
    id: "software-eng",
    name: {
      AZ: "Proqramların Yaradılması",
      EN: "Custom Software Engineering",
      RU: "Разработка ПО под Ключ"
    },
    shortDesc: {
      AZ: "Rust, Go və Zig dillərində yüksək yüklənməyə davamlı ekosistemlər.",
      EN: "High-throughput software infrastructure built with Rust, Go, and Zig.",
      RU: "Высоконагруженное корпоративное ПО на Rust, Go и Zig."
    },
    longDesc: {
      AZ: "Böyük həcmli data axını ilə işləmək üçün hazırlanan xüsusi backend və bulud platformaları. Ənənəvi dillərdən (Python, Java, PHP) fərqli olaraq, gələcəyə yönələn, xüsusi optimallaşdırılmış və təhlükəsiz memarlıq.",
      EN: "Enterprise level backend engines designed for massive operations. Choosing memory-safe modern structures over slower traditional frameworks for guaranteed performance index.",
      RU: "Масштабируемые серверные экосистемы. Применение безопасных технологий вместо устаревших архитектурных подходов для гарантированной отказоустойчивости."
    },
    iconName: "Cpu",
    technologies: ["Rust", "Go", "Zig", "Docker & Kubernetes", "gRPC", "PostgreSQL"],
    duration: {
      AZ: "6 - 12 həftə",
      EN: "6 - 12 weeks",
      RU: "6 - 12 недель"
    },
    architecture: {
      AZ: [
        "Zig/Rust əsaslı sürətli mikroservislər",
        "Memory-safe təhlükəsiz yaddaş idarəsi",
        "Kubernetes orkestrasiyası",
        "Sıfır asılılıq (zero-dependency) daxili utilitlər"
      ],
      EN: [
        "Zig/Rust cloud native microservices",
        "Memory-safe parallel computing layers",
        "Kubernetes active-active clusters",
        "Zero-dependency server-side utilities"
      ],
      RU: [
        "Микросервисы на Zig/Rust нового поколения",
        "Потокобезопасная параллельная обработка",
        "Динамическая оркестрация Kubernetes",
        "Автономные утилиты без системных зависимостей"
      ]
    }
  },
  {
    id: "ai-integration",
    name: {
      AZ: "AI İnteqrasiyası",
      EN: "AI Integration Systems",
      RU: "Интеграция ИИ"
    },
    shortDesc: {
      AZ: "Şirkətinizin proseslərini avtomatlaşdıran rəqəmsal beyinlər.",
      EN: "Injecting custom machine intelligence directly into your daily operations.",
      RU: "Внедрение интеллектуальных агентов в бизнес-процессы."
    },
    longDesc: {
      AZ: "Mövcud proqram təminatınız və ya yeni həlləriniz daxilinə Gemini lisenziyalı böyük dil modellərinin (LLM), fərdi öyrədilmiş maşın öyrənməsi (ML) modullarının və rəqəmsal köməkçilərin peşəkar surətdə yerləşdirilməsi.",
      EN: "Tailoring state-of-the-art LLMs (Gemini, etc.) and deep learning pipelines straight into your sales, operations, support, or intelligence nodes.",
      RU: "Кастомизация и интеграция флагманских LLM (Gemini и др.) и систем машинного обучения для автоматизации продаж, аналитики и поддержки."
    },
    iconName: "Sparkles",
    technologies: ["Gemini API", "TensorFlow", "PyTorch", "Mojo", "LangChain", "Vector DBs"],
    duration: {
      AZ: "4 - 8 həftə",
      EN: "4 - 8 weeks",
      RU: "4 - 8 недель"
    },
    priceEstimate: {
      AZ: "5,000 AZN-dən başlayaraq",
      EN: "From $3,000 USD",
      RU: "От 170,000 RUB"
    },
    architecture: {
      AZ: [
        "Gecikməsi çox aşağı olan Vector Database infrastrukturu",
        "RAG (Retrieval-Augmented Generation) təmiz konsepti",
        "Təhlükəsiz API proxy qoruyucusu",
        "Ehtiyatlı model routing zənciri"
      ],
      EN: [
        "Ultra-low latency vector search indices",
        "Production-grade Retrieval-Augmented Generation (RAG)",
        "Secure enterprise API proxies",
        "Resilient failover LLM routing chain"
      ],
      RU: [
        "Векторные базы данных со сверхнизким пингом",
        "Промышленная архитектура RAG",
        "Безопасные прокси-шлюзы для API корпоративного уровня",
        "Отказоустойчивые каскадные цепочки моделей"
      ]
    }
  },
  {
    id: "support",
    name: {
      AZ: "7/24 Support Xidməti",
      EN: "24/7 Support & DevOps",
      RU: "Круглосуточная поддержка 24/7 и DevOps"
    },
    shortDesc: {
      AZ: "7/24 fasiləsiz texniki dəstək və DevOps xidməti.",
      EN: "24/7 continuous technical support, server monitoring, and professional DevOps operations.",
      RU: "Круглосуточная техподдержка 24/7, мониторинг серверов и DevOps-сервис."
    },
    longDesc: {
      AZ: "Sistemlərinizin fasiləsiz və problemsiz işləməsi üçün serverlərin sazlanması, tətbiqlərin bulud mühitində avtomatik miqrasiyası və 7/24 operativ DevOps dəstək mexanizmi.",
      EN: "Achieve 99.99% uptime with professional 24/7 cloud orchestrations, automatic backup protocols, real-time logging systems, and instantaneous support hot-fixes.",
      RU: "Обеспечение безотказной работы 99.99% за счет круглосуточного мониторинга 24/7, автоматического резервного копирования и мгновенной технической поддержки."
    },
    iconName: "Terminal",
    technologies: ["AWS", "Google Cloud", "CI/CD Pipelines", "Terraform", "Prometheus & Grafana", "Linux"],
    duration: {
      AZ: "Aylıq abunə",
      EN: "Monthly Retainer",
      RU: "Ежемесячно"
    },
    priceEstimate: {
      AZ: "1,200 AZN / ay",
      EN: "$800 USD / month",
      RU: "От 45,000 RUB / мес"
    },
    architecture: {
      AZ: [
        "Bulud infrastrukturunun kod halında yazılması (IaC)",
        "Prometheus dərhal daxili xəbərdarlıq qovşaqları",
        "Sıfır downtime ilə deployment sxemi",
        "Yüksək intensivlikli server replikasiyaları"
      ],
      EN: [
        "Infrastructure as Code (IaC) templates",
        "Prometheus real-time alert boundaries",
        "Zero-downtime deployment workflows",
        "High-frequency cross-region master-slave db layouts"
      ],
      RU: [
        "Инфраструктура как код (IaC)",
        "Мгновенное оповещение инженеров через Prometheus",
        "Деплой без остановки систем (Zero-downtime)",
        "Высокочастотная репликация баз данных"
      ]
    }
  },
  {
    id: "mobile-apps",
    name: {
      AZ: "Mobile App-ların Yaradılması",
      EN: "Mobile App Engineering",
      RU: "Разработка Мобильных Приложений"
    },
    shortDesc: {
      AZ: "iOS və Android platformalarında yüksək performanslı rəqəmli alətlər.",
      EN: "Elegant high-fidelity native apps for iOS and Android.",
      RU: "Флагманские мобильные приложения для iOS и Android."
    },
    longDesc: {
      AZ: "Flutter və ya tam yerli (Native) Swift/Kotlin texnologiyalarından istifadə edilərək sürətli, asan idarə olunan və müştəriyə birbaşa rahatlıq gətirən modern mobil tətbiqlərin kodlaşdırılması.",
      EN: "Crafted for maximum fluid touch layouts, smooth offline cache capabilities, push notification servers, and instant app store distribution pipelines.",
      RU: "Созданы для плавной анимации интерфейса, безупречной автономности, серверов push-уведомлений и быстрой публикации."
    },
    iconName: "Smartphone",
    technologies: ["Flutter", "React Native", "Swift / Kotlin", "SQLite / Room", "Firebase Suite", "App Store Connect"],
    duration: {
      AZ: "5 - 10 həftə",
      EN: "5 - 10 weeks",
      RU: "5 - 10 недель"
    },
    priceEstimate: {
      AZ: "6,000 AZN-dən başlayaraq",
      EN: "From $3,500 USD",
      RU: "От 200,000 RUB"
    },
    architecture: {
      AZ: [
        "Cihaz daxili şifrəli verilənlər bazası",
        "Offline-first çalışma fəlsəfəsi",
        "Arxa fonda işləyən sinxronizasiya tənzimləri",
        "Asinxron şəkil və verilənlər idarəediciləri"
      ],
      EN: [
        "Encrypted on-device data storage engines",
        "Offline-first sync methodologies",
        "Resource-optimized background workers",
        "Asynchronous asset caching pipelines"
      ],
      RU: [
        "Зашифрованные базы данных на устройстве",
        "Архитектура Offline-first для автономной работы",
        "Фоновые обработчики данных, оптимизирующие батарею",
        "Асинхронное кэширование медиа-ресурсов"
      ]
    }
  },

  {
    id: "custom-ai",
    name: {
      AZ: "Fərdi AI Tool-ların Yaradılması",
      EN: "Custom AI & ML Core Design",
      RU: "Индивидуальные ИИ-Инструменты"
    },
    shortDesc: {
      AZ: "Biznesinizə mükəmməl uyğunlaşan, daxili süni intellekt köməkçiləri.",
      EN: "Fully customized native intelligent agents tailored exclusively to your corporate requirements.",
      RU: "Разработка локальных ИИ-инструментов, заточенных строго под специфику бизнеса."
    },
    longDesc: {
      AZ: "Hər bir şirkət fərqli proseslərə malikdir. Müştəri münasibətləri, sənədləşmə vərdişləri və ya mühasibat uçotu üçün tam müstəqil çalışan daxili rəqəmsal beyinlərin hazırlanması.",
      EN: "Building tailor-fit smart modules. From file synthesis pipelines, multi-document synthesis to automated deep code generations, utilizing lightweight edge-inference designs.",
      RU: "Создание локальных вычислительных модулей ИИ. Автоматический анализ документов, синтез кода и оптимизация операций без отправки важных данных третьим лицам."
    },
    iconName: "BrainCircuit",
    technologies: ["Mojo Core", "Gemini 3.5 LLMs", "Python / Rust Wrappers", "On-Premises deployment", "Custom Embeddings"],
    duration: {
      AZ: "5 - 9 həftə",
      EN: "5 - 9 weeks",
      RU: "5 - 9 недель"
    },
    priceEstimate: {
      AZ: "8,000 AZN-dən başlayaraq",
      EN: "From $5,000 USD",
      RU: "От 280,000 RUB"
    },
    architecture: {
      AZ: [
        "Mojo dilində yazılmış sürətli ML kodları",
        "Lokal data gizli saxlanılması",
        "Zəncirvari ssenarili fərdi süni intellekt axınları",
        "Şirkət sənədlərinin daxili bilik idarəçisi"
      ],
      EN: [
        "High-performance Mojo computing algorithms",
        "Strict on-premises local private hosting",
        "Chained reasoning system flows",
        "Corporate document asset knowledge grounding"
      ],
      RU: [
        "Высокопроизводительные алгоритмы Mojo",
        "Локальный закрытый хостинг без облачных утечек",
        "Гибко настраиваемые цепочки логических рассуждений ИИ",
        "Интеллектуальная база знаний по закрытой документации"
      ]
    }
  }
];

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  AZ: {
    navbar: {
      services: "Xidmətlər",
      manifesto: "Manifest",
      consultant: "AI Konsultant",
      team: "Mühəndislik",
      contact: "Əlaqə",
      consultButton: "Mükəmməllik Üçün"
    },
    hero: {
      tagline: "QÜSURSUZ İT VƏ Süni İntellekt MÜHƏNDİSLİYİ",
      titleFirst: "Sizin Vizyonunuz,",
      titleHighlight: "Bizim Qüsursuz",
      titleLast: "Mühəndisliyimiz",
      subtitle: "Biz sıradan kodlar deyil, biznesinizi transformasiya edəcək mühəndislik şedevrləri yaradırıq. İnnovativ İT agentliyi olaraq, TechVibe mühəndisləri Mojo, Rust, Go və Zig ekosistemi ilə rəqəmsal sərhədləri yenidən müəyyən edir. Bizim əsas hədəfimiz: həm yerli, həm də beynəlxalq bazarlar üçün miqyaslana bilən (scalable), hər cür yüklənməyə tab gətirən və arxitektur səviyyədə mütləq təhlükəsizliklə qorunan premium həllər inkişaf etdirməkdir. Biz sizin vizyonunuzu sarsılmaz və tam güvənli bir təməl üzərində inşa edirik.",
      ctaConsult: "AI ilə layihəni qiymətləndir",
      ctaServices: "Mühəndislik Xidmətlərimiz",
    },
    manifesto: {
      badge: "BİZİM MANİFEST",
      title: "Gələcəyi Yaradan Texnoloji İntizam",
      highlightText: "Gələcəyin fərqi sürət və dayanıqlılıqdır.",
      mainText: `TechVibe, müasir rəqəmsal sistemləri yüksək performans və minimal resurs istifadəsi üzərində quran mühəndislik şirkətidir.
Biz ənənəvi stack-lərlə yanaşı (Python, PHP, Java), gələcəyin performans yönümlü texnologiyalarını — Rust, Zig və Mojo kimi yeni nəsil yanaşmaları tətbiq edirik. Məqsədimiz sadəcə proqram yazmaq deyil — 0.01ms səviyyəsində optimallaşdırılmış, təhlükəsiz və genişlənə bilən sistemlər yaratmaqdır. Hər layihədə arxitektura, performans və məhsul düşüncəsini birləşdiririk. Nəticə: daha sürətli, daha stabil və gələcəyə hazır sistemlər.`,
      paragraph2: "İşimiz sadəcə kod yazmaq deyil; hər sətirdə memarlıq qüsursuzluğu yaratmaq, şirkətinizin vizyonunu sarsılmaz proqram infrastrukturuna çevirməkdir. Sizin iş üçün 0.01ms gecikmə və real AI gücü təqdim edirik.",
      quote: "Sürət sadəcə bir göstərici deyil, biznesdə ən kəsərli rəqabət üstünlüyüdür.",
      quoteAuthor: "Eldar Ramazanov — Founder & Head of Engineering",
      statRustSpeed: "22 qat daha sürətli",
      statRustDesc: "Ənənəvi web backendlərə nisbətdə sürət artımı.",
      statMojoSpeed: "35,000x sürət",
      statMojoDesc: "AI və data analiz proseslərində Python-a nisbətən sürət.",
      statReliability: "99.99% Uptime",
      statReliabilityDesc: "Kubernetes və elastik cloud-native arxitektura sayəsində davamlılıq."
    },
    servicesSection: {
      badge: "MÜHƏNDİSLİK PORTFELİ",
      title: "Premium Xidmətlər",
      subtitle: "Gələcəyin rəqəmsal arxitekturasını bu gün sizə təqdim edirik.",
      modalTechTitle: "İSTİFADƏ OLUNAN PREMİUM TEXNOLOGİYALAR",
      modalArchTitle: "SİSTEMİN STRUKTUR PLANI VƏ MEMARLIĞI",
      modalPriceTitle: "QİYMƏTLƏNDİRMƏ",
      modalDurationTitle: "TAM HAZIR OLMA MÜDDƏTİ",
      modalCloseBtn: "Pəncərəni Bağla",
      modalQuoteBtn: "Xidməti Sifariş Edin"
    },
    consultantSection: {
      badge: "LIVE CONSULTANCY ENGINE",
      title: "TechVibe Rəqəmsal Oracle",
      subtitle: "İdeyanızı və ya biznes layihənizi bura daxil edin. Süni İntellekt rəqəmsal agentimiz sizə qüsursuz texnoloji yığın, memarlıq dizaynı və fərdi mühəndislik yanaşması tərtib edəcək.",
      placeholder: "Məsələn: 'Azərbaycan üçün ultra-sürətli kuryer çatdırılma proqramı və sürücü idarəetmə paneli...' və ya 'Şirkətim üçün daxili sənədləri avtomatik analiz edən AI inteqrasiya sistemi...'",
      sendBtn: "Vision Təhlili Başlat",
      loadingText: "Biznes İdeyası Mühəndislərimiz və Süni İntellekt tərəfindən Təhlil Olunur...",
      disclaimer: "*Rəsmi təklif və ətraflı planlaşdırma üçün TechVibe mühəndislik komandası ilə birbaşa məsləhət tövsiyə olunur.",
      welcomeMsg: "Salam! Mən TechVibe-ın AI rəqəmsal ortağıyam. Biznesinizin rəqəmsal gələcəyini unikal şəkildə memarlıq və mühəndisliyini bərabər quraq. Biznes ideyanızı yazın və tam texniki həll planına saniyələr içində sahib olun.",
      suggestion1: "Milli fintech ödəmə qərərgahı və mikro-sürətli api xidməti",
      suggestion2: "Sənaye anbarları üçün daxili smart sensor monitorinq sistemi",
      suggestion3: "Video axınlarını real-vaxtda emal edən təhlükəsizlik AI aləti"
    },
    contactModal: {
      title: "Görüş Təyin Edin",
      subtitle: "Mühəndislik rəhbərimiz Eldar Ramazanov və komandası ilə vizyonunuzu reallığa çevirmə addımı.",
      nameLabel: "Adınız və Soyadınız",
      emailLabel: "E-poçt ünvanınız",
      msgLabel: "Layihə barədə qısa qeydiniz",
      submitBtn: "Görüş Sifarişi Göndər",
      successMsg: "Müraciətiniz qəbul olundu! Mühəndisliyimizin ən parlaq üzvləri 2 saat daxilində sizinlə əlaqə saxlayacaq."
    }
  },
  EN: {
    navbar: {
      services: "Services",
      manifesto: "Manifesto",
      consultant: "AI Consultant",
      team: "Engineering",
      contact: "Contact",
      consultButton: "Request Architecture"
    },
    hero: {
      tagline: "FLAWLESS IT & ARTIFICIAL INTELLIGENCE ENGINEERING",
      titleFirst: "Your Vision,",
      titleHighlight: "Our Flawless",
      titleLast: "Engineering",
      subtitle: "TechVibe designs state-of-the-art digital infrastructure utilizing the fastest modern languages including Mojo, Rust, Go, and Zig on Azerbaijan and international scales.",
      ctaConsult: "Audit Idea with AI Partner",
      ctaServices: "Explore Engineering Core"
    },
    manifesto: {
      badge: "THE MANIFESTO",
      title: "Technological Discipline of Tomorrow",
      highlightText: "The future is defined by compute efficacy and memory speed.",
      mainText: "TechVibe is a top-bracket software engineering boutique active since 2026, located in Baku and operating internationally. While highly adept with legacy codebases (Python, PHP, Java), our engineering mission prioritizes extreme speed, small deployment footprints, and safety by utilizing Rust, Zig, and Mojo.",
      paragraph2: "We do not simply stitch APIs; we engineer robust architectural patterns. Delivering sub-millisecond response rates, heavy encryption layers, and on-premises custom machine learning networks.",
      quote: "Speed isn't just a metric; it is the single most unforgiving competitive weapon in business.",
      quoteAuthor: "Eldar Ramazanov — Founder & Head of Engineering",
      statRustSpeed: "22x Faster",
      statRustDesc: "Average boost compared to traditional backend architectures.",
      statMojoSpeed: "35,000x Speedup",
      statMojoDesc: "Computing acceleration over pure Python in AI operations.",
      statReliability: "99.99% Uptime",
      statReliabilityDesc: "Ensured by active-active cloud clusters and declarative orchestration."
    },
    servicesSection: {
      badge: "THE PORTFOLIO",
      title: "Premium Engineering",
      subtitle: "Delivering structural systems designed to scale endlessly.",
      modalTechTitle: "DEPLOYED PREMIUM STACK",
      modalArchTitle: "STRUCTURAL ARCHITECTURE PLAN & SYSTEM FLOWS",
      modalPriceTitle: "ESTIMATED BRACKET",
      modalDurationTitle: "DEVELOPMENT TIMELINE",
      modalCloseBtn: "Dismiss Panel",
      modalQuoteBtn: "Order This Service"
    },
    consultantSection: {
      badge: "LIVE CONSULTANCY ENGINE",
      title: "TechVibe Digital Oracle",
      subtitle: "Submit your business idea or project. Our AI agent will outline the recommended tech stack, system architecture, and engineering approach tailored to your vision.",
      placeholder: "e.g., 'A high-speed courier delivery app for Azerbaijan with driver dispatch panel...' or 'An AI system that automatically analyzes my company's internal documents...'",
      sendBtn: "Start Vision Analysis",
      loadingText: "Business idea is being analyzed by our engineers and AI...",
      disclaimer: "*For official proposals and detailed scoping, a direct consultation with the TechVibe engineering team is recommended.",
      welcomeMsg: "Hello! I am TechVibe's AI digital partner. Let's architect the digital future of your business together. Describe your idea and receive a complete technical solution plan in seconds.",
      suggestion1: "National fintech payment hub with high-speed API service",
      suggestion2: "Smart sensor monitoring system for industrial warehouses",
      suggestion3: "Real-time video stream processing security AI tool"
    },
    contactModal: {
      title: "Convene Scoping Meeting",
      subtitle: "Set up an engineering-lead design meeting with Eldar Ramazanov and senior system architects.",
      nameLabel: "Your Name",
      emailLabel: "Corporate Email Address",
      msgLabel: "Brief description of the challenge",
      submitBtn: "Lock Meeting Window",
      successMsg: "Submission registered. A system partner will reach out within 2 hours with schedule options."
    }
  },
  RU: {
    navbar: {
      services: "Услуги",
      manifesto: "Манифест",
      consultant: "ИИ Консультант",
      team: "Команда",
      contact: "Контакты",
      consultButton: "Получить Архитектуру"
    },
    hero: {
      tagline: "БЕЗУПРЕЧНЫЙ ИТ-ИНЖИНИРИНГ И ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ",
      titleFirst: "Ваше Видение,",
      titleHighlight: "Наше Безупречное",
      titleLast: "Исполнение",
      subtitle: "TechVibe конструирует высокоэффективные цифровые экосистемы на базе Rust, Mojo, Go и Zig в Азербайджане и за его пределами.",
      ctaConsult: "Анализ проекта с ИИ",
      ctaServices: "Технологическое Портфолио"
    },
    manifesto: {
      badge: "НАШ МАНИФЕСТ",
      title: "Технологическая Дисциплина Будущего",
      highlightText: "Будущее принадлежит эффективным вычислениям и надежной памяти.",
      mainText: "TechVibe — бутик высокотехнологичного инжиниринга, основанный в 2026 году и работающий по всему СНГ и миру. Работая на высшем уровне со старыми стеками (Python, PHP, Java), мы ставим приоритетом внедрение сверхбыстрых, безопасных и легко масштабируемых систем на Rust, Zig и Mojo.",
      paragraph2: "Мы не просто собираем API из готовых частей; мы разрабатываем надежные архитектурные паттерны с задержкой отклика до 0.01 мс.",
      quote: "Скорость — это не просто метрика; это сильнейшее конкурентное оружие в бизнесе.",
      quoteAuthor: "Эльдар Рамазанов — Основатель и Главный Инженер",
      statRustSpeed: "В 22 раза быстрее",
      statRustDesc: "Ускорение работы API интерфейсов по сравнению со стандартным ПО.",
      statMojoSpeed: "35,000x Быстрее",
      statMojoDesc: "Превосходство Mojo над Python в ИИ и обработке баз данных.",
      statReliability: "99.99% Uptime",
      statReliabilityDesc: "Гарантируется использованием отказоустойчивых облачных сред Kubernetes."
    },
    servicesSection: {
      badge: "ПОРТФОЛИО УСЛУГ",
      title: "Премиальный Инжиниринг",
      subtitle: "Цифровая архитектура, спроектированная работать безупречно десятилетиями.",
      modalTechTitle: "ИСПОЛЬЗУЕМЫЕ ТЕХНОЛОГИИ",
      modalArchTitle: "АРХИТЕКТУРНЫЙ ПЛАН И СИСТЕМНЫЕ ПОТОКИ",
      modalPriceTitle: "БЮДЖЕТНАЯ СЕТКА",
      modalDurationTitle: "СРОКИ РЕАЛИЗАЦИИ",
      modalCloseBtn: "Закрыть Панель",
      modalQuoteBtn: "Заказать Услугу"
    },
    consultantSection: {
      badge: "LIVE CONSULTANCY ENGINE",
      title: "TechVibe Цифровой Оракул",
      subtitle: "Введите вашу бизнес-идею или проект. Наш ИИ-агент предложит подходящий технологический стек, архитектуру системы и инженерный подход под ваши задачи.",
      placeholder: "Например: 'Высокоскоростное приложение для доставки в Азербайджане с панелью управления водителями...' или 'ИИ-система для автоматического анализа внутренних документов компании...'",
      sendBtn: "Запустить Анализ Идеи",
      loadingText: "Бизнес-идея анализируется нашими инженерами и ИИ...",
      disclaimer: "*Для официального предложения и детального планирования рекомендуется прямая консультация с командой TechVibe.",
      welcomeMsg: "Приветствуем! Я ИИ-партнёр TechVibe. Давайте вместе спроектируем цифровое будущее вашего бизнеса. Опишите идею и получите полный технический план за секунды.",
      suggestion1: "Национальный финтех-шлюз с высокоскоростным API",
      suggestion2: "Система мониторинга smart-датчиков для промышленных складов",
      suggestion3: "ИИ-инструмент обработки видеопотока в реальном времени"
    },
    contactModal: {
      title: "Забронировать встречу",
      subtitle: "Назначьте технический аудит с главным инженером Эльдаром Рамазановым и ведущими архитекторами.",
      nameLabel: "Ваше Имя",
      emailLabel: "Корпоративная Электронная Почта",
      msgLabel: "Краткое описание задачи",
      submitBtn: "Забронировать Время",
      successMsg: "Заявка успешно принята! Наш инженер свяжется с вами в течение 2 часов для согласования деталей."
    }
  }
};
