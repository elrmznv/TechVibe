import { useState, useMemo, useEffect, useRef, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  Globe, 
  Cpu, 
  Sparkles, 
  Terminal, 
  Smartphone, 
  ShieldAlert, 
  BrainCircuit, 
  Languages, 
  X, 
  ArrowRight, 
  Send, 
  CheckCircle2, 
  Menu, 
  Clock, 
  Coins, 
  FileText, 
  Zap,
  PhoneCall,
  Copy,
  Check,
  ChevronDown
} from "lucide-react";
import { SERVICES, TRANSLATIONS } from "./data";
import { Language, ServiceDetail } from "./types";
import DataNetwork3D from "./components/DataNetwork3D";

const button3DProps = {
  whileHover: { 
    y: -2.5, 
    scale: 1.03, 
    rotateX: 7, 
    rotateY: 7,
    z: 12,
  },
  whileTap: { 
    scale: 0.97,
    transition: { type: "spring", stiffness: 400, damping: 20 }
  },
  style: { transformStyle: "preserve-3d" as const, perspective: 800 }
};

const LANG_DETAILS = {
  AZ: { name: "AZ" },
  EN: { name: "EN" },
  RU: { name: "RU" }
};

export default function App() {
  const [lang, setLang] = useState<Language>("AZ");
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [activeServiceTab, setActiveServiceTab] = useState<"overview" | "architecture" | "tech">("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  
  // Scoped project quote in contact modal state
  const [prefilledServiceMessage, setPrefilledServiceMessage] = useState("");

  // AI consultant chat states
  type ChatMessage = { role: "user" | "ai"; text: string; id: number };
  const [consultantInput, setConsultantInput] = useState("");
  const [consultantLoading, setConsultantLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [responseError, setResponseError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Session ID — created once on mount, lives server-side (IP-bound)
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionFailed, setSessionFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const createSession = async (attempt = 1) => {
      try {
        const r = await fetch("/api/session", { method: "POST" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const d = await r.json();
        if (!cancelled && d.sessionId) setSessionId(d.sessionId);
      } catch {
        if (attempt < 3 && !cancelled) {
          setTimeout(() => createSession(attempt + 1), attempt * 1000);
        } else if (!cancelled) {
          setSessionFailed(true);
        }
      }
    };
    createSession();
    return () => { cancelled = true; };
  }, []);

  // Force page to start at top — prevent browser from restoring hash scroll
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    // Also clear any hash in URL silently
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Active localized dictionaries
  const dict = useMemo(() => TRANSLATIONS[lang], [lang]);
  const [clientEmail, setClientEmail] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-scroll logic helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Pre-fill prompt suggestion in AI Consultant
  const handleSuggestionClick = (text: string) => {
    setConsultantInput(text);
    // Smooth scroll to consultant input
    const inputEl = document.getElementById("consultant-message-box");
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
      inputEl.focus();
    }
  };

  const handleCopyReport = () => {
    const lastAI = [...chatHistory].reverse().find(m => m.role === "ai");
    if (!lastAI) return;
    navigator.clipboard.writeText(lastAI.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, consultantLoading]);

  // Send request — appends to chat history instead of replacing
  // FIX: On error/timeout, remove the pending user message so user can retry cleanly
  // TVS-008: sends only sessionId — no history[] to the server.
  // Server reads/writes history from its own session store.
  const handleAnalyzeVision = async (e: FormEvent, retryText?: string) => {
    e.preventDefault();
    const trimmed = retryText ?? consultantInput.trim();
    if (!trimmed || consultantLoading) return;

    // FIX-5: Client-side hard limit before network call
    if (trimmed.length > 2000) {
      setResponseError(
        lang === "AZ" ? "Mesaj çox uzundur (maks 2000 simvol)." :
        lang === "RU" ? "Сообщение слишком длинное (макс. 2000 символов)." :
        "Message too long (max 2000 characters)."
      );
      return;
    }

    if (sessionFailed) {
      setResponseError(
        lang === "AZ" ? "Sessiya yaradıla bilmədi. Səhifəni yeniləyin." :
        lang === "RU" ? "Не удалось создать сессию. Обновите страницу." :
        "Session creation failed. Please refresh the page."
      );
      return;
    }

    if (!sessionId) {
      setResponseError(
        lang === "AZ" ? "Sessiya yüklənir, bir an gözləyin..." :
        lang === "RU" ? "Сессия загружается..." :
        "Session loading, please wait..."
      );
      return;
    }

    const userMsg: ChatMessage = { role: "user", text: trimmed, id: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setConsultantInput("");
    setConsultantLoading(true);
    setResponseError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // TVS-008: only sessionId sent — no history[]
        body: JSON.stringify({ message: trimmed, lang, sessionId }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Server xətası");

      const aiMsg: ChatMessage = { role: "ai", text: data.text, id: Date.now() + 1 };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err: any) {
      // Remove orphaned user message — user can retry cleanly
      setChatHistory(prev => prev.filter(m => m.id !== userMsg.id));
      setConsultantInput(trimmed);
      if (err?.name === "AbortError") {
        setResponseError("Sorğu vaxtı bitdi. Zəhmət olmasa yenidən cəhd edin.");
      } else {
        setResponseError(err?.message || "İnternet bağlantı xətası baş verdi.");
      }
    } finally {
      setConsultantLoading(false);
    }
  };

  // Action to launch contact modal with prefilled data
  const handleInitiateProject = (service: ServiceDetail) => {
    const serviceName = service.name[lang];
    const messagePart = 
      lang === "AZ" 
        ? `${serviceName} xidməti üzrə fərdi rəqəmsal layihə barədə tam memarlıq layihələndirilməsi almaq istəyirəm.` 
        : lang === "RU"
        ? `Я хотел бы обсудить индивидуальное проектирование по услуге: ${serviceName}.`
        : `I would like to discuss a custom design project for: ${serviceName}.`;
    
    setPrefilledServiceMessage(messagePart);
    setClientMessage(messagePart);
    setSelectedService(null); // Auto-close service details modal
    setContactModalOpen(true);
  };

  // TVS-002 FIX: Real backend POST /api/contact çağırışı
  // Email format yoxlaması + server-side validasiya
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) return;

    // Client-side email format yoxlaması
    const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
    if (!emailRegex.test(clientEmail)) {
      setContactError(
        lang === "AZ" ? "Düzgün email ünvanı daxil edin." :
        lang === "RU" ? "Введите корректный email." :
        "Please enter a valid email address."
      );
      return;
    }

    setContactLoading(true);
    setContactError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName.trim(),
          email: clientEmail.trim(),
          message: clientMessage.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Xəta baş verdi.");

      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setClientName("");
        setClientEmail("");
        setClientMessage("");
        setContactError(null);
        setContactModalOpen(false);
      }, 4000);
    } catch (err: any) {
      setContactError(err?.message || (
        lang === "AZ" ? "Müraciət göndərilmədi. Yenidən cəhd edin." :
        lang === "RU" ? "Не удалось отправить. Попробуйте снова." :
        "Failed to submit. Please try again."
      ));
    } finally {
      setContactLoading(false);
    }
  };

  // Global 3D physical reaction listener
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      let target = event.target as HTMLElement | null;
      while (target && target !== document.body) {
        if (
          target.tagName === "BUTTON" || 
          target.getAttribute("role") === "button" || 
          target.classList.contains("cursor-pointer") ||
          target.tagName === "A"
        ) {
          window.dispatchEvent(new CustomEvent("btn-click-3d"));
          break;
        }
        target = target.parentElement;
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  // Match Lucide icons securely
  const getIconComponent = (key: string) => {
    switch (key) {
      case "Globe": return <Globe className="w-8 h-8 text-primary-cyan" />;
      case "Cpu": return <Cpu className="w-8 h-8 text-primary-cyan" />;
      case "Sparkles": return <Sparkles className="w-8 h-8 text-primary-cyan" />;
      case "Terminal": return <Terminal className="w-8 h-8 text-primary-cyan" />;
      case "Smartphone": return <Smartphone className="w-8 h-8 text-primary-cyan" />;
      case "ShieldAlert": return <ShieldAlert className="w-8 h-8 text-primary-cyan" />;
      case "BrainCircuit": return <BrainCircuit className="w-8 h-8 text-primary-cyan" />;
      default: return <Globe className="w-8 h-8 text-primary-cyan" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-darkest text-gray-200 selection:bg-cyan-500/30 overflow-x-hidden bg-grid-pattern">
      
      {/* 1. Header & Navigation Panel */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#090b12]/90 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <motion.div 
                className="relative flex items-center justify-center w-11 h-11"
                whileHover="hover"
                whileTap="tap"
              >
                <motion.svg 
                  className="w-10 h-10 drop-shadow-[0_0_12px_rgba(6,182,212,0.45)]" 
                  viewBox="0 0 100 100" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  variants={{
                    hover: { scale: 1.15 },
                    tap: { scale: 0.88, rotate: -15 }
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>

                  {/* Outer Spinning Sci-Fi Ring */}
                  <motion.circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="url(#logoGrad)" 
                    strokeWidth="2.5" 
                    strokeDasharray="45 15 15 15" 
                    strokeLinecap="round"
                    variants={{
                      hover: { rotate: 360 }
                    }}
                    transition={{ 
                      rotate: { repeat: Infinity, duration: 4, ease: "linear" },
                      default: { type: "spring", stiffness: 200 }
                    }}
                    style={{ transformOrigin: "50px 50px" }}
                  />

                  {/* Dynamic "V" Waveform (representing the energetic Vibe & Velocity) */}
                  <motion.path 
                    d="M24 46 L50 78 L76 46" 
                    stroke="url(#logoGrad)" 
                    strokeWidth="5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                      hover: { scale: 1.08, y: 1 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    style={{ transformOrigin: "50px 50px" }}
                  />

                  {/* Structural Solid "T" Monogram Header and Stem */}
                  <motion.path 
                    d="M32 30 H68" 
                    stroke="#ffffff" 
                    strokeWidth="5" 
                    strokeLinecap="round"
                    variants={{
                      hover: { scale: 1.05, y: -2 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    style={{ transformOrigin: "50px 50px" }}
                  />
                  <motion.path 
                    d="M50 30 V56" 
                    stroke="#ffffff" 
                    strokeWidth="5" 
                    strokeLinecap="round"
                    variants={{
                      hover: { scale: 1.05, y: -1 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    style={{ transformOrigin: "50px 50px" }}
                  />

                  {/* Interactive Pulse Signal Wave (Thin glowing path showing high frequency frequency/vibe) */}
                  <motion.path 
                    d="M18 52 Q34 40 50 64 T82 52" 
                    stroke="url(#logoGrad)" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.85"
                    variants={{
                      hover: { 
                        d: "M18 52 Q34 64 50 40 T82 52",
                        opacity: 1
                      }
                    }}
                    transition={{ type: "spring", stiffness: 150, damping: 10 }}
                  />

                  {/* Glowing Connection Nodes */}
                  <circle cx="24" cy="46" r="3.5" fill="#ffffff" />
                  <circle cx="76" cy="46" r="3.5" fill="#ffffff" />
                  <circle cx="32" cy="30" r="3" fill="#ffffff" />
                  <circle cx="68" cy="30" r="3" fill="#ffffff" />
                  <circle cx="50" cy="78" r="4.5" fill="#ffffff" className="animate-pulse" />
                  <circle cx="50" cy="56" r="2.5" fill="url(#logoGrad)" />
                </motion.svg>
                {/* Dynamic Ambient Blur Glow under logo */}
                <motion.div 
                  className="absolute inset-0 bg-primary-cyan/20 blur-md rounded-full -z-10"
                  variants={{
                    hover: { scale: 1.35, opacity: 0.9 },
                    tap: { scale: 0.8 }
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
              <motion.span 
                className="text-2xl font-bold tracking-tight font-display text-white"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                Tech<span className="text-primary-cyan">Vibe</span>
              </motion.span>
            </div>

            {/* Desktop Navigation Link Cluster */}
            <div className="hidden md:flex items-center gap-10">
              <button 
                onClick={() => scrollToSection("services-section")} 
                className="text-[14px] font-medium tracking-wide text-gray-300 hover:text-primary-cyan transition-colors"
              >
                {dict.navbar.services}
              </button>
              <button 
                onClick={() => scrollToSection("manifesto-section")} 
                className="text-[14px] font-medium tracking-wide text-gray-300 hover:text-primary-cyan transition-colors"
              >
                {dict.navbar.manifesto}
              </button>
              <button 
                onClick={() => scrollToSection("consultant-section")} 
                className="text-[14px] font-medium tracking-wide text-gray-300 hover:text-primary-cyan transition-colors"
              >
                {dict.navbar.consultant}
              </button>
            </div>

            {/* Control Hub: I18n languages + CTAs */}
            <div className="hidden md:flex items-center gap-6">
              {/* Custom Global Language Dropdown */}
              <div className="relative group/lang">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  onMouseEnter={() => setLangDropdownOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer select-none"
                >
                  <Globe className="w-3.5 h-3.5 text-primary-cyan" />
                  <span>{LANG_DETAILS[lang].name}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${langDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Options List */}
                {langDropdownOpen && (
                  <>
                    {/* Overlay detector to close dropdown on clicking outside */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setLangDropdownOpen(false)} 
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-28 rounded-xl bg-bg-darkest/95 backdrop-blur-md border border-white/10 shadow-xl shadow-black/60 py-1.5 z-50 overflow-hidden"
                      onMouseLeave={() => setLangDropdownOpen(false)}
                    >
                      {(["AZ", "EN", "RU"] as Language[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => {
                            setLang(l);
                            setLangDropdownOpen(false);
                            if (typeof window !== "undefined") {
                              window.dispatchEvent(new CustomEvent("btn-click-3d"));
                            }
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center justify-between transition-colors ${
                            lang === l 
                              ? "bg-gradient-to-r from-cyan-500/10 to-violet-600/10 text-primary-cyan font-semibold border-l-2 border-cyan-500" 
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{LANG_DETAILS[l].name}</span>
                          </span>
                          {lang === l && <Check className="w-3.5 h-3.5 text-primary-cyan" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </div>

              {/* Consult CTA Button */}
              <button
                onClick={() => {
                  setPrefilledServiceMessage("");
                  setClientMessage("");
                  setContactModalOpen(true);
                }}
                className="relative px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-white overflow-hidden group shadow-md shadow-cyan-500/5 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600 group-hover:scale-105 transition-all duration-300" />
                <span className="relative flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  {dict.navbar.consultButton}
                </span>
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                {(["AZ", "EN", "RU"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("btn-click-3d"));
                      }
                    }}
                    className={`px-2 py-0.5 text-xs font-semibold rounded ${
                      lang === l ? "bg-cyan-500/20 text-primary-cyan font-bold" : "text-gray-400"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-400 hover:text-white focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden glassmorphism border-b border-white/10 px-4 py-4 space-y-3">
            <button 
              onClick={() => scrollToSection("services-section")} 
              className="block w-full text-left py-2 px-3 rounded text-base font-semibold text-gray-300 hover:bg-white/5"
            >
              {dict.navbar.services}
            </button>
            <button 
              onClick={() => scrollToSection("manifesto-section")} 
              className="block w-full text-left py-2 px-3 rounded text-base font-semibold text-gray-300 hover:bg-white/5"
            >
              {dict.navbar.manifesto}
            </button>
            <button 
              onClick={() => scrollToSection("consultant-section")} 
              className="block w-full text-left py-2 px-3 rounded text-base font-semibold text-gray-300 hover:bg-white/5"
            >
              {dict.navbar.consultant}
            </button>
            <button
              onClick={() => {
                setPrefilledServiceMessage("");
                setClientMessage("");
                setContactModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600"
            >
              <PhoneCall className="w-4 h-4" />
              {dict.navbar.consultButton}
            </button>
          </div>
        )}
      </nav>

      {/* 2. Hero Section containing WebGL interactive background */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden">
        {/* Abstract Background Glows - subtle, elegant, zero text obstruction! */}
        <div className="absolute inset-0 z-0 opacity-40 select-none pointer-events-none">
          <div className="absolute inset-0 bg-radial-glow opacity-60 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-bg-darkest to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-darkest via-bg-darkest/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Information */}
            <div className="lg:col-span-7 select-text">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/10 text-cyan-400 font-mono text-[11px] font-semibold tracking-wider uppercase backdrop-blur-sm animate-pulse-slow">
                <span className="w-1.5 h-1.5 bg-primary-cyan rounded-full animate-ping" />
                {dict.hero.tagline}
              </span>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] text-white">
                {dict.hero.titleFirst} <br/>
                <span className="bg-gradient-to-r from-primary-cyan via-blue-400 to-indigo-500 bg-clip-text text-transparent text-glow-cyan">
                  {dict.hero.titleHighlight}
                </span> <br/>
                <span>{dict.hero.titleLast}</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-xl font-sans leading-relaxed">
                {dict.hero.subtitle}
              </p>

              {/* Call-to-actions */}
              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <motion.button
                  onClick={() => scrollToSection("consultant-section")}
                  className="px-8 py-4 rounded-xl font-bold tracking-wide text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
                  {...button3DProps}
                >
                  <Sparkles className="w-5 h-5" />
                  {dict.hero.ctaConsult}
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection("services-section")}
                  className="px-8 py-4 rounded-xl font-bold tracking-wide text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  {...button3DProps}
                >
                  {dict.hero.ctaServices}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Right Column containing the gorgeous 3D visualizer */}
            <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[450px] lg:h-[550px] flex items-center justify-center select-none pointer-events-none">
              <div className="absolute inset-0 z-0 opacity-100">
                <DataNetwork3D />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-darkest to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Manifesto (Haqqımızda) Section */}
      <section id="manifesto-section" className="relative py-24 bg-bg-darkest/90 border-t border-white/5 overflow-hidden">
        {/* Subtle decorative mesh */}
        <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <span className="text-xs font-mono font-bold tracking-wider text-primary-cyan bg-cyan-950/20 px-3 py-1 rounded border border-cyan-500/20">
                {dict.manifesto.badge}
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
                {dict.manifesto.title}
              </h2>
              <p className="mt-6 text-lg font-semibold text-primary-cyan font-display">
                {dict.manifesto.highlightText}
              </p>
              <p className="mt-4 text-gray-300 leading-relaxed font-sans">
                {dict.manifesto.mainText}
              </p>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed font-sans">
                {dict.manifesto.paragraph2}
              </p>

              {/* High-Polish Author Quote */}
              <div className="mt-8 border-l-2 border-primary-cyan pl-6 py-2 bg-white/2 rounded-r-xl">
                <p className="text-gray-300 italic font-medium text-15">
                  "{dict.manifesto.quote}"
                </p>
                <p className="mt-2 text-xs font-mono font-semibold tracking-wide text-primary-cyan/80">
                  {dict.manifesto.quoteAuthor}
                </p>
              </div>
            </div>

            {/* Right Statistics Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-6">
              
              {/* Stat 1: Mojo */}
              <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent">
                <div className="bg-bg-panel backdrop-blur-xl p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400">
                      <Zap className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-3xl font-extrabold font-mono text-white text-glow-cyan leading-none">
                        {dict.manifesto.statMojoSpeed}
                      </h4>
                      <p className="mt-1 text-xs font-semibold tracking-wider text-violet-400 font-mono">MOJO INTELLIGENCE CORE</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[13px] text-gray-400 leading-relaxed">
                    {dict.manifesto.statMojoDesc}
                  </p>
                </div>
              </div>

              {/* Stat 2: Rust */}
              <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent">
                <div className="bg-bg-panel backdrop-blur-xl p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/10 rounded-lg text-primary-cyan">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-3xl font-extrabold font-mono text-white text-glow-violet leading-none">
                        {dict.manifesto.statRustSpeed}
                      </h4>
                      <p className="mt-1 text-xs font-semibold tracking-wider text-primary-cyan font-mono">RUST COMPILED CODE</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[13px] text-gray-400 leading-relaxed">
                    {dict.manifesto.statRustDesc}
                  </p>
                </div>
              </div>

              {/* Stat 3: Reliability */}
              <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent">
                <div className="bg-bg-panel backdrop-blur-xl p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-3xl font-extrabold font-mono text-white leading-none">
                        {dict.manifesto.statReliability}
                      </h4>
                      <p className="mt-1 text-xs font-semibold tracking-wider text-emerald-400 font-mono">INFRASTRUCTURE SLA</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[13px] text-gray-400 leading-relaxed">
                    {dict.manifesto.statReliabilityDesc}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. Services Section with Detailed Modals */}
      <section id="services-section" className="relative py-24 bg-bg-dark border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow opacity-35 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center select-none">
            <span className="text-xs font-mono font-bold tracking-widest text-primary-cyan bg-cyan-950/25 px-4 py-1.5 rounded-full border border-cyan-500/20 uppercase">
              {dict.servicesSection.badge}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white">
              {dict.servicesSection.title}
            </h2>
            <p className="mt-4 text-gray-400 text-base max-w-2xl mx-auto font-sans">
              {dict.servicesSection.subtitle}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((srv) => (
              <div
                key={srv.id}
                onClick={() => setSelectedService(srv)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl p-[1.2px] bg-white/5 hover:bg-gradient-to-tr hover:from-cyan-500/40 hover:to-violet-600/40 transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-black/15 hover:shadow-cyan-500/10"
              >
                {/* Micro-interaction top border glow */}
                <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary-cyan to-indigo-500 transition-all duration-500 group-hover:w-full z-20" />
                
                <div className="absolute inset-0 bg-bg-panel backdrop-blur-xl rounded-2.5xl -z-10" />
                <div className="h-full bg-slate-950/50 group-hover:bg-slate-950/80 p-8 rounded-2xl border border-white/5 flex flex-col justify-between focus:outline-none transition-colors duration-300">
                  
                  <div>
                    {/* Icon container */}
                    <div className="w-14 h-14 rounded-xl bg-gray-900/60 flex items-center justify-center border border-white/10 group-hover:border-primary-cyan group-hover:bg-primary-cyan/10 transition-all duration-300 shadow-inner">
                      {getIconComponent(srv.iconName)}
                    </div>

                    <h3 className="mt-6 text-xl font-bold font-display text-white group-hover:text-primary-cyan transition-colors">
                      {srv.name[lang]}
                    </h3>

                    <p className="mt-4 text-[13.5px] text-gray-400 group-hover:text-gray-300 line-clamp-3 leading-relaxed transition-colors">
                      {srv.shortDesc[lang]}
                    </p>
                  </div>

                  {/* Tech badget pill & learn more badge */}
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[12px] font-mono text-gray-400 group-hover:text-white transition-colors flex items-center gap-1.5">
                      {srv.technologies[0]}
                      <span className="text-gray-600">•</span>
                      {srv.technologies[1]}
                    </span>
                    <span className="text-xs font-bold text-primary-cyan group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
                       {lang === "AZ" ? "Ətraflı" : lang === "RU" ? "Инфо" : "Details"}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. AI Consultant (Oracle) Interactive Section */}
      <section id="consultant-section" className="relative py-24 bg-bg-darkest border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-[#8b5cf6] bg-violet-950/20 px-3.5 py-1.5 rounded-full border border-violet-500/20 uppercase">
              {dict.consultantSection.badge}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white">
              {dict.consultantSection.title}
            </h2>
            <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-3xl mx-auto font-sans leading-relaxed">
              {dict.consultantSection.subtitle}
            </p>
          </div>

          <div className="glassmorphism rounded-2xl border border-white/5 overflow-hidden shadow-2xl">

            {/* ── Chat toolbar ── */}
            {chatHistory.length > 0 && (
              <div className="flex items-center justify-between px-5 py-3 bg-slate-950/60 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                    TechVibe Oracle · {chatHistory.filter(m => m.role === "ai").length} {lang === "AZ" ? "cavab" : lang === "RU" ? "ответов" : "responses"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      copied
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
                    }`}
                  >
                    {copied ? <><Check className="w-3 h-3" /> COPIED</> : <><Copy className="w-3 h-3" /> COPY LAST</>}
                  </button>
                  <button
                    onClick={() => {
                      setChatHistory([]);
                      setResponseError(null);
                      if (sessionId) {
                        // Delete old session silently, create new one (IP-bound)
                        fetch(`/api/session/${sessionId}`, { method: "DELETE" }).catch(() => {});
                        setSessionId(null);
                        fetch("/api/session", { method: "POST" })
                          .then(r => r.json())
                          .then(d => { if (d.sessionId) setSessionId(d.sessionId); })
                          .catch(() => setSessionFailed(true));
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold text-gray-400 hover:text-white bg-white/5 border border-white/5 transition-all"
                  >
                    {lang === "AZ" ? "SİL" : lang === "RU" ? "ОЧИСТ." : "CLEAR"}
                  </button>
                </div>
              </div>
            )}

            {/* ── Chat messages area ── */}
            <div className="flex flex-col gap-0 min-h-[340px] max-h-[540px] overflow-y-auto p-5 sm:p-7 bg-slate-950/40 border-b border-white/5 scroll-smooth">

              {/* Welcome state */}
              {chatHistory.length === 0 && !consultantLoading && (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-violet-400 mb-4">
                    <BrainCircuit className="w-9 h-9" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-display mb-2">TechVibe AI Intelligent Companion</h4>
                  <p className="text-sm text-gray-400 max-w-md leading-relaxed">{dict.consultantSection.welcomeMsg}</p>
                </div>
              )}

              {/* Message bubbles */}
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex w-full mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {/* AI avatar */}
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mr-3 mt-1 flex-shrink-0">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-cyan-600/25 to-indigo-600/25 border border-cyan-500/20 text-white rounded-tr-sm"
                      : "bg-slate-900/80 border border-white/8 text-gray-200 rounded-tl-sm"
                  }`}>
                    {msg.role === "ai" && (
                      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] font-mono font-bold text-primary-cyan uppercase tracking-wider">TechVibe Oracle</span>
                      </div>
                    )}
                    {msg.text}

                    {/* Order button on last AI message */}
                    {msg.role === "ai" && msg.id === Math.max(...chatHistory.filter(m => m.role === "ai").map(m => m.id)) && (
                      <button
                        onClick={() => {
                          setClientMessage(
                            lang === "AZ"
                              ? "Mən Oracle raportuna əsasən fərdi mühəndislik layihəsi başlatmaq istəyirəm."
                              : lang === "RU"
                              ? "Я бы хотел заказать разработку корпоративного проекта на основе ИИ-отчета."
                              : "I would like to commission an enterprise project based on the compiled AI draft."
                          );
                          setContactModalOpen(true);
                        }}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 rounded-xl text-[11px] font-extrabold tracking-wider text-white transition-all uppercase font-mono"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {lang === "AZ" ? "Bu Memarlığı Sifariş Et" : lang === "RU" ? "Заказать Данную Систему" : "Initiate Engineering Phase"}
                      </button>
                    )}
                  </div>

                  {/* User avatar */}
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-300 ml-3 mt-1 flex-shrink-0 text-xs font-bold">
                      U
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {consultantLoading && (
                <div className="flex justify-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mr-3 mt-1 flex-shrink-0">
                    <BrainCircuit className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="bg-slate-900/80 border border-white/8 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary-cyan rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
                      <span className="w-2 h-2 bg-primary-cyan rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider ml-1">{dict.consultantSection.loadingText}</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {responseError && (
                <div className="mx-2 p-4 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-mono text-center">
                  <p>{responseError}</p>
                  {consultantInput && (
                    <button
                      onClick={(e) => handleAnalyzeVision(e as any, consultantInput)}
                      className="mt-2 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-[10px] font-bold transition-colors"
                    >
                      ↻ {lang === "AZ" ? "Yenidən cəhd et" : lang === "RU" ? "Попробовать снова" : "Retry"}
                    </button>
                  )}
                </div>
              )}

              {/* Auto-scroll anchor */}
              <div ref={chatEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleAnalyzeVision} className="p-6 bg-slate-950/60 font-sans">
              <label htmlFor="consultant-message-box" className="sr-only">{dict.consultantSection.placeholder}</label>
              <div className="relative">
                <textarea
                  id="consultant-message-box"
                  rows={3}
                  value={consultantInput}
                  onChange={(e) => setConsultantInput(e.target.value)}
                  placeholder={dict.consultantSection.placeholder}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 pl-4 pr-16 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAnalyzeVision(e);
                    }
                  }}
                />
                
                {/* Submit button on top right of input box */}
                <motion.button
                  type="submit"
                  disabled={!consultantInput.trim() || consultantLoading}
                  className={`absolute right-3 bottom-4 p-3 rounded-lg text-white bg-gradient-to-tr from-cyan-500 to-violet-600 shadow-md shadow-cyan-500/10 focus:outline-none ${
                    (!consultantInput.trim() || consultantLoading) ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  aria-label={dict.consultantSection.sendBtn}
                  {...button3DProps}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Suggestions grid beneath typing block */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5 bg-transparent">
                <span className="text-xs font-semibold text-gray-500 tracking-wider">
                  {lang === "AZ" ? "SÜRƏTLİ SUALLAR:" : lang === "RU" ? "ОБРАЗЦЫ:" : "QUICK TEMPLATES:"}
                </span>
                <motion.button
                  type="button"
                  onClick={() => handleSuggestionClick(dict.consultantSection.suggestion1)}
                  className="px-3 py-1.5 rounded bg-white/5 border border-white/5 text-xs text-slate-300 hover:text-white cursor-pointer hover:border-cyan-500/20 transition-colors font-medium text-left line-clamp-1"
                  {...button3DProps}
                >
                  {dict.hero.techBadge ? "" : ""}
                  {dict.consultantSection.suggestion1}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => handleSuggestionClick(dict.consultantSection.suggestion2)}
                  className="px-3 py-1.5 rounded bg-white/5 border border-white/5 text-xs text-slate-300 hover:text-white cursor-pointer hover:border-cyan-500/20 transition-colors font-medium text-left line-clamp-1"
                  {...button3DProps}
                >
                  {dict.consultantSection.suggestion2}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => handleSuggestionClick(dict.consultantSection.suggestion3)}
                  className="px-3 py-1.5 rounded bg-white/5 border border-white/5 text-xs text-slate-300 hover:text-white cursor-pointer hover:border-cyan-500/20 transition-colors font-medium text-left line-clamp-1"
                  {...button3DProps}
                >
                  {dict.consultantSection.suggestion3}
                </motion.button>
              </div>

              <div className="mt-4 text-[10.5px] text-gray-600 italic">
                {dict.consultantSection.disclaimer}
              </div>
            </form>

          </div>

        </div>
      </section>

      {/* 6. Lead Scoping and Contact Interactive Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setContactModalOpen(false)} />
          
          <div className="relative w-full max-w-xl bg-bg-panel backdrop-blur-2xl rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl z-10 animate-glow">
            <div className="p-6 sm:p-8">
              
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-display text-white">{dict.contactModal.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 font-sans leading-relaxed">{dict.contactModal.subtitle}</p>
                </div>
                <button 
                  onClick={() => setContactModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formSubmitted ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Təşəkkür edirik!</h4>
                  <p className="text-sm text-gray-300 max-w-sm leading-relaxed">{dict.contactModal.successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="mt-8 space-y-5 font-sans">
                  
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
                      {dict.contactModal.nameLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder=""
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
                      {dict.contactModal.emailLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder=""
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
                      {dict.contactModal.msgLabel}
                    </label>
                    <textarea
                      rows={3}
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 resize-none"
                    />
                  </div>

                  {prefilledServiceMessage && (
                    <div className="p-3 bg-cyan-950/10 border border-cyan-500/20 rounded-lg text-xs text-primary-cyan">
                      {lang === "AZ" ? "Seçilmiş mütəxəssis xidməti təyin edildi." : lang === "RU" ? "Выбрана услуга для проекта" : "Scoring set context for requested package."}
                    </div>
                  )}

                  {/* TVS-002 FIX: xəta mesajı göstər */}
                  {contactError && (
                    <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg text-xs text-red-400">
                      {contactError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full py-4 tracking-wide font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 rounded-xl hover:opacity-95 shadow-lg shadow-cyan-500/15 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {dict.contactModal.submitBtn}
                  </button>

                </form>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 7. Detailed Service Window (Modal) */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedService(null)} />
          
          <div className="relative w-full max-w-2xl bg-bg-panel backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl z-10">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600" />
            
            <div className="p-6 sm:p-8">
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-950 flex items-center justify-center border border-white/10 text-primary-cyan">
                    {getIconComponent(selectedService.iconName)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-display text-white">{selectedService.name[lang]}</h3>
                    <span className="text-[11px] font-mono tracking-wider text-violet-400">{selectedService.id.toUpperCase()} SERVICE LAYER</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Selector Bar */}
              <div className="flex border-b border-white/5 mb-6">
                <button
                  onClick={() => setActiveServiceTab("overview")}
                  className={`flex-1 pb-3 text-[10px] md:text-xs font-mono font-bold tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                    activeServiceTab === "overview"
                      ? "border-cyan-500 text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {lang === "AZ" ? "1. ANLAYIŞ & SƏRHƏD" : lang === "RU" ? "1. КОНЦЕПТ И СРОКИ" : "1. OVERVIEW & SCOPE"}
                </button>
                <button
                  onClick={() => setActiveServiceTab("architecture")}
                  className={`flex-1 pb-3 text-[10px] md:text-xs font-mono font-bold tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                    activeServiceTab === "architecture"
                      ? "border-violet-500 text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {lang === "AZ" ? "2. SİSTEM MEMARLIĞI" : lang === "RU" ? "2. СИСТЕМНАЯ АРХИТЕКТУРА" : "2. SYSTEM ARCHITECTURE"}
                </button>
                <button
                  onClick={() => setActiveServiceTab("tech")}
                  className={`flex-1 pb-3 text-[10px] md:text-xs font-mono font-bold tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                    activeServiceTab === "tech"
                      ? "border-emerald-500 text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {lang === "AZ" ? "3. SPESİFİKASİYA" : lang === "RU" ? "3. СПЕЦИФИКАЦИЯ" : "3. TECH SPEC SHEET"}
                </button>
              </div>

              {/* Tab views content switcher */}
              {activeServiceTab === "overview" && (
                <div className="space-y-6">
                  <p className="text-gray-300 text-sm leading-relaxed font-sans bg-white/2 p-4 rounded-xl border border-white/5">
                    {selectedService.longDesc[lang]}
                  </p>
                </div>
              )}

              {activeServiceTab === "architecture" && (
                <div className="space-y-4">
                  <div className="bg-black/45 p-5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-mono text-violet-400 block tracking-wider uppercase mb-3">SYSTEM DATA-FLOW TREE</span>
                    <div className="relative pl-6 border-l border-violet-500/20 space-y-5">
                      {selectedService.architecture[lang].map((arch, idx) => (
                        <div key={idx} className="relative">
                          {/* Left bullet connecting back to active border */}
                          <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-slate-900 border border-violet-500 flex items-center justify-center text-[9px] font-bold font-mono text-violet-400">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-gray-300 font-sans font-medium">{arch}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeServiceTab === "tech" && (
                <div className="space-y-6">
                  {/* Technologies array */}
                  <div className="font-mono">
                    <h4 className="text-xs font-bold tracking-widest text-primary-cyan uppercase mb-3 text-glow-cyan">
                      {dict.servicesSection.modalTechTitle}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1.5 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/20 rounded text-xs font-bold text-cyan-300 transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Corporate SLA and standards matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/2 p-4 rounded-xl border border-white/5 font-mono text-[11px] text-gray-400">
                    <div className="p-3 bg-black/25 rounded-lg border border-white/5">
                      <span className="text-gray-600 block text-[9px] uppercase">MEM_FOOTPRINT</span>
                      <span className="text-emerald-400 font-bold block mt-1">~12MB STATIC ELF</span>
                    </div>
                    <div className="p-3 bg-black/25 rounded-lg border border-white/5">
                      <span className="text-gray-600 block text-[9px] uppercase">SPEED_RATIO</span>
                      <span className="text-cyan-400 font-bold block mt-1">0.01ms DIRECT INT</span>
                    </div>
                    <div className="p-3 bg-black/25 rounded-lg border border-white/5">
                      <span className="text-gray-600 block text-[9px] uppercase">COMPLIANCE</span>
                      <span className="text-violet-400 font-bold block mt-1">ISO-27001 SECURE</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Spacer before actions panel */}
              <div className="h-6" />

              {/* Actions panel inside detailed modal */}
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedService(null)}
                  className="w-full py-3.5 text-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-xs uppercase text-white transition-all font-bold tracking-wider cursor-pointer font-mono"
                >
                  {dict.servicesSection.modalCloseBtn}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 8. Mandatory Footer Branding & Coordinates */}
      <footer className="relative py-12 bg-bg-darkest border-t border-white/5 z-25 overflow-hidden font-sans select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            
            {/* Soft, beautiful micro credentials brand line */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-cyan rounded-full animate-pulse-slow" />
              <span className="text-xs uppercase font-mono tracking-widest text-gray-500">
                TechVibe Premium Systems Engineering
              </span>
            </div>

            {/* MANDATORY EXACT BRANDING TEXT BLOCK (STRICT DIRECTIVE) */}
            <div className="text-sm tracking-wide text-gray-400 hover:text-white transition-colors duration-300 font-medium">
              TechVibe © 2026 | Created by Eldar Ramazanov
            </div>

            <p className="text-[10px] text-gray-600 select-none tracking-wide">
              Mojo, Rust, Go, Zig • Edge-Inference LLM Frameworks • Caucasus Center
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
