import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { SaathiPanel } from './SaathiAICopilot';
import {
  LogOut, Sparkles, FileText, CheckCircle2, Scale, Compass,
  ArrowLeft, Building2, User as UserIcon, LayoutDashboard,
  Target, SearchCheck, Sliders, Calculator, ArrowRight,
  Sun, Moon, Globe, FileCheck2, Cpu, Menu, X, ChevronLeft,
  ChevronRight, TrendingUp, IndianRupee, Award, Filter
} from 'lucide-react';
import logoImg from '../assets/logo.png';

// Feature components
import { EligibilityWizard } from './EligibilityWizard';
import { SchemeCard } from './SchemeCard';
import { SchemeDetailModal } from './SchemeDetailModal';
import { SchemeComparison } from './SchemeComparison';
import { DprGeneratorView } from './DprGeneratorView';
import { DocumentReadiness } from './DocumentReadiness';
import { ApplicationNavigator } from './ApplicationNavigator';
import { GapAnalyzer } from './GapAnalyzer';
import { WhatIfSimulator } from './WhatIfSimulator';
import { FinancialCalculator } from './FinancialCalculator';
import { ChannelPartnerRouter } from './ChannelPartnerRouter';

/* ─── Ashoka Chakra SVG ───────────────────────────────────────────── */
const AshokaChakra: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className="si-ashoka-chakra"
    aria-label="Ashoka Chakra"
  >
    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="50" cy="50" r="6" fill="currentColor" />
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 360) / 24;
      const rad = (angle * Math.PI) / 180;
      const x1 = 50 + 8 * Math.cos(rad);
      const y1 = 50 + 8 * Math.sin(rad);
      const x2 = 50 + 42 * Math.cos(rad);
      const y2 = 50 + 42 * Math.sin(rad);
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      );
    })}
  </svg>
);

/* ─── Saathi AI Panel — imported from SaathiAICopilot ────────────── */

/* ─── Main SaffronDashboard ───────────────────────────────────────── */
export const SaffronDashboard: React.FC = () => {
  const { user, logout, setCurrentView } = useAuth();
  const {
    activeTab, setActiveTab,
    matchResults, otherSchemes, totalPotentialSubsidy,
    comparedSchemes, profile,
    setSelectedSchemeModal
  } = useProfile();
  const { t, theme, toggleTheme, language, setLanguage } = useLanguage();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [saathiCollapsed, setSaathiCollapsed] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const firstNameGreeting = user?.fullName?.split(' ')[0] || 'Entrepreneur';

  // Translated nav labels
  const navLabels: Record<string, Record<string, string>> = {
    en: {
      overview: 'Overview', dashboard: 'Dashboard', aiTools: 'AI Tools',
      profile: 'AI Profile Extraction', matcher: 'Scheme Recommender',
      gap: 'Eligibility Gap Analyzer', whatif: 'What-If Simulator',
      calculator: 'Financial Calculator', partners: 'Channel Partner Router',
      documents: 'Document Readiness', appraisal: 'Appraisal & Delivery',
      dpr: 'Bank-Ready DPR', comparison: 'Scheme Comparison', roadmap: 'Application Roadmap',
      toolsFeatures: 'Tools & Features', launch: 'Launch', viewAll: 'View All',
      prioritySchemes: 'Top Priority Schemes', schemesUnlocked: 'Priority Schemes Unlocked',
      welcomeBack: 'Welcome back', schemesMatched: 'government schemes',
      upTo: 'up to', subsidies: 'in capital subsidies, concessional credit, and collateral-free loans.',
      viewMatched: 'View Matched Schemes', diagnoseGaps: 'Diagnose Eligibility Gaps',
      subsAvail: 'Available Subsidy', docReady: 'Doc Ready', schemesFound: 'Schemes Found',
      activeProfile: 'Active Profile', signOut: 'Sign Out'
    },
    hi: {
      overview: 'अवलोकन', dashboard: 'डैशबोर्ड', aiTools: 'AI उपकरण',
      profile: 'AI प्रोफ़ाइल निष्कर्षण', matcher: 'योजना अनुशंसक',
      gap: 'पात्रता अंतर विश्लेषक', whatif: 'क्या-अगर सिम्युलेटर',
      calculator: 'वित्तीय कैलकुलेटर', partners: 'चैनल पार्टनर राउटर',
      documents: 'दस्तावेज़ तत्परता', appraisal: 'मूल्यांकन एवं वितरण',
      dpr: 'बैंक-रेडी DPR', comparison: 'योजना तुलना', roadmap: 'आवेदन रोडमैप',
      toolsFeatures: 'उपकरण और सुविधाएं', launch: 'खोलें', viewAll: 'सभी देखें',
      prioritySchemes: 'शीर्ष प्राथमिकता योजनाएं', schemesUnlocked: 'प्राथमिकता योजनाएं अनलॉक',
      welcomeBack: 'वापसी पर स्वागत है', schemesMatched: 'सरकारी योजनाओं',
      upTo: 'तक', subsidies: 'पूंजी सब्सिडी, रियायती ऋण, और जमानत-मुक्त ऋण में।',
      viewMatched: 'मिलान योजनाएं देखें', diagnoseGaps: 'पात्रता अंतर जांचें',
      subsAvail: 'उपलब्ध सब्सिडी', docReady: 'दस्तावेज़ तैयार', schemesFound: 'योजनाएं मिलीं',
      activeProfile: 'सक्रिय प्रोफ़ाइल', signOut: 'साइन आउट'
    },
    te: {
      overview: 'అవలోకనం', dashboard: 'డ్యాష్‌బోర్డ్', aiTools: 'AI సాధనాలు',
      profile: 'AI ప్రొఫైల్ వెలికితీత', matcher: 'పథక సిఫార్సుదారు',
      gap: 'అర్హత లోటు విశ్లేషకం', whatif: 'ఏమైతే-అయితే సిమ్యులేటర్',
      calculator: 'ఆర్థిక కాలిక్యులేటర్', partners: 'ఛానల్ పార్ట్‌నర్ రూటర్',
      documents: 'పత్ర సంసిద్ధత', appraisal: 'మూల్యాంకనం & వితరణ',
      dpr: 'బ్యాంక్-రెడీ DPR', comparison: 'పథక పోలిక', roadmap: 'దరఖాస్తు రోడ్‌మ్యాప్',
      toolsFeatures: 'సాధనాలు & ఫీచర్లు', launch: 'ప్రారంభించు', viewAll: 'అన్నీ చూడు',
      prioritySchemes: 'అగ్ర ప్రాధాన్య పథకాలు', schemesUnlocked: 'ప్రాధాన్య పథకాలు అన్‌లాక్',
      welcomeBack: 'తిరిగి స్వాగతం', schemesMatched: 'ప్రభుత్వ పథకాలు',
      upTo: 'వరకు', subsidies: 'మూలధన సబ్సిడీలు, రాయితీ క్రెడిట్, మరియు జామీన్-రహిత రుణాలలో.',
      viewMatched: 'సరిపోయిన పథకాలు చూడండి', diagnoseGaps: 'అర్హత లోపాలను గుర్తించండి',
      subsAvail: 'అందుబాటులో సబ్సిడీ', docReady: 'డాక్ సిద్ధం', schemesFound: 'పథకాలు కనుగొనబడ్డాయి',
      activeProfile: 'యాక్టివ్ ప్రొఫైల్', signOut: 'సైన్ అవుట్'
    },
    pa: {
      overview: 'ਸੰਖੇਪ', dashboard: 'ਡੈਸ਼ਬੋਰਡ', aiTools: 'AI ਸੰਦ',
      profile: 'AI ਪ੍ਰੋਫਾਈਲ ਐਕਸਟ੍ਰੈਕਸ਼ਨ', matcher: 'ਸਕੀਮ ਸਿਫ਼ਾਰਿਸ਼ਕਰਤਾ',
      gap: 'ਯੋਗਤਾ ਘਾਟ ਵਿਸ਼ਲੇਸ਼ਕ', whatif: 'ਕੀ-ਜੇ ਸਿਮੂਲੇਟਰ',
      calculator: 'ਵਿੱਤੀ ਕੈਲਕੁਲੇਟਰ', partners: 'ਚੈਨਲ ਪਾਰਟਨਰ ਰਾਊਟਰ',
      documents: 'ਦਸਤਾਵੇਜ਼ ਤਿਆਰੀ', appraisal: 'ਮੁਲਾਂਕਣ ਅਤੇ ਡਿਲੀਵਰੀ',
      dpr: 'ਬੈਂਕ-ਰੈਡੀ DPR', comparison: 'ਸਕੀਮ ਤੁਲਨਾ', roadmap: 'ਅਰਜ਼ੀ ਰੋਡਮੈਪ',
      toolsFeatures: 'ਸੰਦ ਅਤੇ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ', launch: 'ਖੋਲੋ', viewAll: 'ਸਾਰੇ ਦੇਖੋ',
      prioritySchemes: 'ਪ੍ਰਮੁੱਖ ਸਕੀਮਾਂ', schemesUnlocked: 'ਪ੍ਰਾਥਮਿਕਤਾ ਸਕੀਮਾਂ ਅਨਲੌਕ',
      welcomeBack: 'ਵਾਪਸੀ \'ਤੇ ਜੀ ਆਇਆਂ ਨੂੰ', schemesMatched: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
      upTo: 'ਤੱਕ', subsidies: 'ਪੂੰਜੀ ਸਬਸਿਡੀ, ਰਿਆਇਤੀ ਕ੍ਰੈਡਿਟ, ਅਤੇ ਜ਼ਮਾਨਤ-ਮੁਕਤ ਕਰਜ਼ਿਆਂ ਵਿੱਚ.',
      viewMatched: 'ਮੇਲ ਖਾਂਦੀਆਂ ਸਕੀਮਾਂ ਦੇਖੋ', diagnoseGaps: 'ਯੋਗਤਾ ਘਾਟ ਜਾਂਚੋ',
      subsAvail: 'ਉਪਲਬਧ ਸਬਸਿਡੀ', docReady: 'ਦਸਤਾਵੇਜ਼ ਤਿਆਰ', schemesFound: 'ਸਕੀਮਾਂ ਮਿਲੀਆਂ',
      activeProfile: 'ਸਰਗਰਮ ਪ੍ਰੋਫਾਈਲ', signOut: 'ਸਾਈਨ ਆਊਟ'
    },
    mr: {
      overview: 'विहंगावलोकन', dashboard: 'डॅशबोर्ड', aiTools: 'AI साधने',
      profile: 'AI प्रोफाइल निष्कर्षण', matcher: 'योजना शिफारसकर्ता',
      gap: 'पात्रता तफावत विश्लेषक', whatif: 'काय-जर सिम्युलेटर',
      calculator: 'आर्थिक कॅल्क्युलेटर', partners: 'चॅनेल पार्टनर राउटर',
      documents: 'दस्तावेज सज्जता', appraisal: 'मूल्यांकन आणि वितरण',
      dpr: 'बँक-रेडी DPR', comparison: 'योजना तुलना', roadmap: 'अर्ज रोडमॅप',
      toolsFeatures: 'साधने आणि वैशिष्ट्ये', launch: 'उघडा', viewAll: 'सर्व पहा',
      prioritySchemes: 'अग्रक्रम योजना', schemesUnlocked: 'प्राधान्य योजना अनलॉक',
      welcomeBack: 'पुन्हा स्वागत', schemesMatched: 'सरकारी योजना',
      upTo: 'पर्यंत', subsidies: 'भांडवल अनुदान, सवलतीचे कर्ज, आणि तारणमुक्त कर्जामध्ये.',
      viewMatched: 'जुळणाऱ्या योजना पहा', diagnoseGaps: 'पात्रता तफावत तपासा',
      subsAvail: 'उपलब्ध अनुदान', docReady: 'दस्तावेज तयार', schemesFound: 'योजना सापडल्या',
      activeProfile: 'सक्रिय प्रोफाइल', signOut: 'साइन आउट'
    },
    bn: {
      overview: 'সংক্ষিপ্ত বিবরণ', dashboard: 'ড্যাশবোর্ড', aiTools: 'AI সরঞ্জাম',
      profile: 'AI প্রোফাইল নিষ্কাশন', matcher: 'প্রকল্প সুপারিশকারী',
      gap: 'যোগ্যতা ফাঁক বিশ্লেষক', whatif: 'কী-যদি সিমুলেটর',
      calculator: 'আর্থিক ক্যালকুলেটর', partners: 'চ্যানেল পার্টনার রাউটার',
      documents: 'নথি প্রস্তুতি', appraisal: 'মূল্যায়ন ও বিতরণ',
      dpr: 'ব্যাংক-রেডি DPR', comparison: 'প্রকল্প তুলনা', roadmap: 'আবেদন রোডম্যাপ',
      toolsFeatures: 'সরঞ্জাম ও বৈশিষ্ট্য', launch: 'খুলুন', viewAll: 'সব দেখুন',
      prioritySchemes: 'শীর্ষ অগ্রাধিকার প্রকল্প', schemesUnlocked: 'অগ্রাধিকার প্রকল্প আনলক',
      welcomeBack: 'পুনরায় স্বাগতম', schemesMatched: 'সরকারি প্রকল্প',
      upTo: 'পর্যন্ত', subsidies: 'মূলধন ভর্তুকি, রেয়াতি ক্রেডিট, এবং জামিনমুক্ত ঋণে.',
      viewMatched: 'মিলিত প্রকল্প দেখুন', diagnoseGaps: 'যোগ্যতা ঘাটতি নির্ণয় করুন',
      subsAvail: 'উপলভ্য ভর্তুকি', docReady: 'নথি প্রস্তুত', schemesFound: 'প্রকল্প পাওয়া গেছে',
      activeProfile: 'সক্রিয় প্রোফাইল', signOut: 'সাইন আউট'
    }
  };

  const nl = navLabels[language] || navLabels.en;

  const navGroups = [
    {
      group: nl.overview,
      items: [
        { id: 'dashboard', label: nl.dashboard, icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: nl.aiTools,
      items: [
        { id: 'profile', label: nl.profile, icon: Cpu, badge: null },
        { id: 'matcher', label: nl.matcher, icon: Target, badge: `${matchResults.length}` },
        { id: 'gap', label: nl.gap, icon: SearchCheck, badge: null },
        { id: 'whatif', label: nl.whatif, icon: Sliders, badge: null },
        { id: 'calculator', label: nl.calculator, icon: Calculator, badge: null },
        { id: 'partners', label: nl.partners, icon: Building2, badge: null },
        { id: 'documents', label: nl.documents, icon: FileCheck2, badge: null },
      ]
    },
    {
      group: nl.appraisal,
      items: [
        { id: 'dpr', label: nl.dpr, icon: FileText, badge: null },
        { id: 'comparison', label: nl.comparison, icon: Scale, badge: comparedSchemes.length > 0 ? `${comparedSchemes.length}` : null },
        { id: 'roadmap', label: nl.roadmap, icon: Compass, badge: null },
      ]
    }
  ];

  const filteredMatches = matchResults.filter(m => {
    if (filterCategory === 'all') return true;
    return m.scheme.categoryTag.toLowerCase().includes(filterCategory.toLowerCase()) ||
      m.scheme.targetGroups.includes(filterCategory);
  });

  /* ── JSX ──────────────────────────────────────────────────────── */
  return (
    <div className="si-layout-container">

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <header className="si-top-bar">
        {/* Left: mobile menu + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="si-mobile-menu-btn" onClick={() => setMobileSidebarOpen(o => !o)} aria-label="Menu">
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="si-brand-area" onClick={() => setCurrentView('landing')} title="Return to Landing">
            <img src={logoImg} alt="SchemeMatch" className="si-brand-logo" />
            <span className="si-brand-name">SchemeMatch</span>
          </div>
        </div>

        {/* Right: controls + user */}
        <div className="si-top-right">
          {/* Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={14} style={{ color: 'var(--text-muted)' }} />
            <select className="si-lang-select" value={language} onChange={e => setLanguage(e.target.value as any)}>
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="te">తెలుగు</option>
              <option value="mr">मराठी</option>
              <option value="bn">বাংলা</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
          </div>

          {/* Theme toggle */}
          <button className="si-icon-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Back to landing */}
          <button className="si-icon-btn" onClick={() => setCurrentView('landing')} title="Landing Page">
            <ArrowLeft size={15} />
          </button>

          {/* User badge */}
          <div className="si-user-badge">
            <div className="si-user-avatar">
              {user?.avatarUrl && !avatarError ? (
                <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer"
                  crossOrigin="anonymous" onError={() => setAvatarError(true)} />
              ) : (
                <span>
                  {user?.fullName
                    ? user.fullName.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
                    : 'U'}
                </span>
              )}
            </div>
            <div className="si-user-info">
              <div className="si-user-name">{user?.fullName || 'Entrepreneur'}</div>
              <div className="si-user-sub">{user?.email || ''}</div>
            </div>
          </div>

          {/* Sign out */}
          <button className="si-signout-btn" onClick={logout} title={nl.signOut}>
            <LogOut size={15} />
            <span className="ws-signout-label">{nl.signOut}</span>
          </button>
        </div>
      </header>

      {/* ── MAIN FRAME: Sidebar + Content + Saathi ────────────── */}
      <div className="si-main-frame">

        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <aside className={`si-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
          <div className="si-sidebar-scrollable">
            {navGroups.map((group, gi) => (
              <div key={gi}>
                <span className="si-nav-group-title">{group.group}</span>
                <nav className="si-nav-list">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`si-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => { setActiveTab(item.id as any); setMobileSidebarOpen(false); }}
                      >
                        <span className="si-nav-item-icon"><Icon size={16} /></span>
                        <span className="si-nav-item-label">{item.label}</span>
                        {item.badge && (
                          <span className="si-nav-item-badge">{item.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Sidebar footer — tricolor strip + profile snapshot */}
          <div className="si-sidebar-footer">
            <div className="si-tricolor-strip">
              <span className="tc-saffron" /><span className="tc-white" /><span className="tc-green" />
            </div>
            <div className="si-profile-snapshot">
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '3px' }}>{nl.activeProfile}</div>
              <span className="si-profile-snapshot-name">{user?.fullName || 'Entrepreneur'}</span>
              <span className="si-profile-snapshot-sub">
                {user?.email || `${profile.category || ''} · ${profile.tradeType || profile.sector || ''}`}
              </span>
            </div>
          </div>
        </aside>

        {/* ── CONTENT VIEWPORT ────────────────────────────────── */}
        <main className="si-content-viewport">

          {/* ══ TAB: DASHBOARD OVERVIEW ══════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div style={{ animation: 'si-fade-in 0.2s ease' }}>

              {/* Hero Banner */}
              <div className="si-hero-banner">
                <h1 className="si-hero-title">
                  <span>{matchResults.length} {nl.schemesUnlocked}</span>
                </h1>
                <p className="si-hero-subtitle">
                  {nl.welcomeBack}, <strong>{firstNameGreeting}</strong>! {language === 'hi' ? 'आपकी प्रोफ़ाइल' : 'Your profile is matched with'}{' '}
                  <strong>{matchResults.length} {nl.schemesMatched}</strong> {language === 'hi' ? 'से मिलान किया गया है जो' : 'offering'} {nl.upTo}{' '}
                  <strong>₹{(totalPotentialSubsidy / 100000).toFixed(1)} Lakhs</strong> {nl.subsidies}
                </p>
                <div className="si-hero-cta-row">
                  <button className="si-hero-cta-primary" onClick={() => setActiveTab('matcher')}>
                    <Target size={16} /> {nl.viewMatched} <ArrowRight size={14} />
                  </button>
                  <button className="si-hero-cta-secondary" onClick={() => setActiveTab('gap')}>
                    <SearchCheck size={16} /> {nl.diagnoseGaps}
                  </button>
                </div>
              </div>

              {/* KPI Pill Bar */}
              <div className="si-kpi-bar">
                <div className="si-kpi-pill">
                  <span className="si-kpi-pill-icon"><IndianRupee size={14} /></span>
                  ₹{(totalPotentialSubsidy / 100000).toFixed(1)}L {nl.subsAvail}
                </div>
                <div className="si-kpi-pill indigo">
                  <span className="si-kpi-pill-icon"><Award size={14} /></span>
                  {matchResults[0]?.scheme.name?.split(' ').slice(0, 2).join(' ') || 'PMEGP'}
                </div>
                <div className="si-kpi-pill green">
                  <span className="si-kpi-pill-icon"><CheckCircle2 size={14} /></span>
                  85% {nl.docReady}
                </div>
                <div className="si-kpi-pill indigo">
                  <span className="si-kpi-pill-icon"><TrendingUp size={14} /></span>
                  {matchResults.length} {nl.schemesFound}
                </div>
              </div>

              {/* Horizontal Scheme Cards Scroller */}
              <div className="si-section-header">
                <span className="si-section-title">🏛️ {nl.prioritySchemes}</span>
                <button className="si-view-all-btn" onClick={() => setActiveTab('matcher')}>
                  {nl.viewAll} ({matchResults.length}) <ArrowRight size={13} />
                </button>
              </div>
              <div className="si-scheme-scroller">
                {matchResults.slice(0, 6).map(m => (
                  <div
                    key={m.scheme.id}
                    className="si-scheme-card"
                    onClick={() => setSelectedSchemeModal(m)}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Tricolor top strip */}
                    <div className="si-scheme-card-tricolor">
                      <span className="tc-s" /><span className="tc-w" /><span className="tc-g" />
                    </div>
                    <div className="si-scheme-card-body">
                      <div className="si-scheme-card-top">
                        <span className="si-scheme-card-name">{m.scheme.name}</span>
                        <span className="si-scheme-match-badge">{m.matchScore}%</span>
                      </div>
                      <div className="si-scheme-subsidy-chip">
                        <IndianRupee size={11} /> {m.estimatedSubsidyAmount > 0 ? `₹${(m.estimatedSubsidyAmount / 100000).toFixed(1)}L` : m.scheme.categoryTag}
                      </div>
                      <div className="si-scheme-progress-bar">
                        <div className="si-scheme-progress-fill" style={{ width: `${m.matchScore}%` }} />
                      </div>
                      <div className="si-scheme-card-footer">
                        <button className="si-scheme-apply-btn" onClick={e => { e.stopPropagation(); setActiveTab('dpr'); }}>
                          {language === 'hi' ? 'DPR बनाएं' : 'Generate DPR'}
                        </button>
                        <button className="si-scheme-compare-btn" onClick={e => { e.stopPropagation(); setActiveTab('comparison'); }}>
                          {language === 'hi' ? 'तुलना करें' : 'Compare'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Module Grid */}
              <div className="si-section-header">
                <span className="si-section-title">⚙️ {nl.toolsFeatures}</span>
              </div>
              <div className="si-module-grid">
                {[
                  { id: 'profile',     icon: Cpu,          color: 'indigo', label: nl.profile,    desc: language === 'hi' ? 'NLP द्वारा प्रोफ़ाइल निर्माण' : 'Natural-language profile builder with NLP extraction.' },
                  { id: 'matcher',     icon: Target,        color: '',       label: nl.matcher, desc: language === 'hi' ? `${matchResults.length} योजनाएं मिलान स्कोर के साथ` : `${matchResults.length} matched schemes with explainable scores.` },
                  { id: 'gap',         icon: SearchCheck,   color: 'indigo', label: nl.gap, desc: language === 'hi' ? 'अनुपूर्ति मार्गदर्शन' : 'Pinpoints missing criteria with remediation guides.' },
                  { id: 'whatif',      icon: Sliders,       color: '',       label: nl.whatif,        desc: language === 'hi' ? 'ऋण, क्षेत्र, स्थान बदलकर देखें' : 'Tweak loan, location, and sector for live eligibility.' },
                  { id: 'calculator',  icon: Calculator,    color: 'green',  label: nl.calculator,     desc: language === 'hi' ? 'EMI, सब्सिडी और DSCR गणना' : 'Scheme-aware EMI, subsidy deduction, DSCR.' },
                  { id: 'partners',    icon: Building2,     color: 'indigo', label: nl.partners,   desc: language === 'hi' ? 'अधिकृत बैंक और एजेंसी खोजें' : 'Locate authorized SCAs, PSBs, and RRBs.' },
                  { id: 'documents',   icon: FileCheck2,    color: 'green',  label: nl.documents,       desc: language === 'hi' ? 'OCR आधारित दस्तावेज़ जांच' : 'OCR-based checklist with readiness scoring.' },
                  { id: 'dpr',         icon: FileText,      color: '',       label: nl.dpr,    desc: language === 'hi' ? 'SIDBI स्वरूप 3 वर्ष अनुमान' : 'SIDBI-compliant 3-year projections.' },
                  { id: 'comparison',  icon: Scale,         color: 'indigo', label: nl.comparison,    desc: language === 'hi' ? 'ऋण सीमा, ब्याज और अवधि तुलना' : 'Side-by-side comparison of loan terms.' },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <div key={m.id} className="si-module-tile" onClick={() => setActiveTab(m.id as any)}>
                      <div className={`si-module-tile-icon ${m.color}`}><Icon size={20} /></div>
                      <div className="si-module-tile-title">{m.label}</div>
                      <div className="si-module-tile-desc">{m.desc}</div>
                      <div className="si-module-tile-footer">
                        <span>{nl.launch}</span><ArrowRight size={12} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ TAB: AI PROFILE ══════════════════════════════════ */}
          {activeTab === 'profile' && (
            <div className="si-tab-panel">
              <div className="si-tab-panel-header">
                <div className="si-tab-panel-title">{nl.profile}</div>
                <div className="si-tab-panel-sub">{language === 'hi' ? 'प्राकृतिक भाषा में प्रोफ़ाइल जानकारी दर्ज करें।' : 'Enter natural-language profile info. AI extracts socio-economic indicators.'}</div>
              </div>
              <EligibilityWizard />
            </div>
          )}

          {/* ══ TAB: SCHEME MATCHER ══════════════════════════════ */}
          {activeTab === 'matcher' && (
            <div className="si-tab-panel">
              <div className="si-tab-panel-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div className="si-tab-panel-title">{nl.matcher}</div>
                    <div className="si-tab-panel-sub">
                      {language === 'hi' 
                        ? <>{matchResults.length} योजनाएं मिलीं, <strong style={{ color: 'var(--si-success)' }}>₹{(totalPotentialSubsidy / 100000).toFixed(1)}L</strong> तक अनुदान के साथ</>
                        : <>Found <strong>{matchResults.length} schemes</strong> with up to{' '}
                          <strong style={{ color: 'var(--si-success)' }}>₹{(totalPotentialSubsidy / 100000).toFixed(1)}L</strong> in grants.</>
                      }
                    </div>
                    {!profile.category && (
                      <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>💡 {language === 'hi' ? 'सुझाव: अपनी श्रेणी (SC/ST/OBC) चुनें ताकि लक्षित सब्सिडी 35% तक अनलॉक हो।' : 'Tip: Select your category (SC/ST/OBC) in Profile to unlock targeted subsidies up to 35%!'}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                    <select
                      value={filterCategory}
                      onChange={e => setFilterCategory(e.target.value)}
                      style={{ padding: '7px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1.5px solid var(--si-card-border)', background: 'var(--si-card-bg)', color: 'var(--si-indigo)' }}
                    >
                      <option value="all">{language === 'hi' ? 'सभी योजनाएं' : 'All Schemes'} ({matchResults.length})</option>
                      <option value="Credit Subsidy">{language === 'hi' ? 'ऋण सब्सिडी' : 'Credit Subsidy'}</option>
                      <option value="Term Loan">{language === 'hi' ? 'सावधि ऋण' : 'Term Loans'}</option>
                      <option value="Grant">{language === 'hi' ? 'प्रत्यक्ष अनुदान' : 'Direct Grants'}</option>
                      <option value="Micro-Credit">{language === 'hi' ? 'सूक्ष्म ऋण' : 'Micro-Credit'}</option>
                      <option value="Women">{language === 'hi' ? 'महिला उद्यमी' : 'Women Entrepreneurs'}</option>
                      <option value="SC">{language === 'hi' ? 'SC / ST' : 'SC / ST'}</option>
                      <option value="OBC">{language === 'hi' ? 'OBC उद्यमी' : 'OBC Entrepreneurs'}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredMatches.map(m => <SchemeCard key={m.scheme.id} matchResult={m} />)}
              </div>
              {otherSchemes.length > 0 && (
                <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1.5px dashed var(--si-card-border)' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--si-indigo)', marginBottom: '6px' }}>
                    {language === 'hi' ? `सशर्त योजनाएं (${otherSchemes.length})` : `Conditional Schemes (${otherSchemes.length})`}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    {language === 'hi' ? 'इनमें कुछ दस्तावेज़ अद्यतन या विशेष मानदंड पूर्ति आवश्यक है।' : 'These need minor documentation updates or specific criteria to be met.'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {otherSchemes.slice(0, 3).map(m => <SchemeCard key={m.scheme.id} matchResult={m} />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ Feature Tabs ════════════════════════════════════ */}
          {activeTab === 'gap'        && <div className="si-tab-panel"><GapAnalyzer /></div>}
          {activeTab === 'whatif'     && <div className="si-tab-panel"><WhatIfSimulator /></div>}
          {activeTab === 'calculator' && <div className="si-tab-panel"><FinancialCalculator /></div>}
          {activeTab === 'partners'   && <div className="si-tab-panel"><ChannelPartnerRouter /></div>}
          {activeTab === 'documents'  && <div className="si-tab-panel"><DocumentReadiness /></div>}
          {activeTab === 'dpr'        && <div className="si-tab-panel"><DprGeneratorView /></div>}
          {activeTab === 'comparison' && <div className="si-tab-panel"><SchemeComparison /></div>}
          {activeTab === 'roadmap'    && <div className="si-tab-panel"><ApplicationNavigator /></div>}

        </main>

        {/* ── SAATHI AI RIGHT PANEL ────────────────────────────── */}
        <SaathiPanel collapsed={saathiCollapsed} onToggle={() => setSaathiCollapsed(c => !c)} />

      </div>

      {/* Deep Dive Scheme Modal */}
      <SchemeDetailModal />
    </div>
  );
};

export default SaffronDashboard;
