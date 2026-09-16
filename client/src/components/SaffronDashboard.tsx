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
import indiaMapUrl from '../assets/india-map-watermark.svg';

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
    comparedSchemes, profile, personas, selectedPersonaId, selectPersona,
    setSelectedSchemeModal
  } = useProfile();
  const { t, theme, toggleTheme, language, setLanguage } = useLanguage();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [saathiCollapsed, setSaathiCollapsed] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const firstNameGreeting = user?.fullName?.split(' ')[0] || profile.fullName?.split(' ')[0] || 'Entrepreneur';

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: 'AI Intelligence',
      items: [
        { id: 'profile', label: 'AI Profile Extraction', icon: Cpu, badge: 'AI' },
        { id: 'matcher', label: 'Scheme Recommender', icon: Target, badge: `${matchResults.length}` },
        { id: 'gap', label: 'Eligibility Gap Analyzer', icon: SearchCheck, badge: null },
        { id: 'whatif', label: 'What-If Simulator', icon: Sliders, badge: 'Live' },
        { id: 'calculator', label: 'Financial Calculator', icon: Calculator, badge: null },
        { id: 'partners', label: 'Channel Partner Router', icon: Building2, badge: null },
        { id: 'documents', label: 'Document Readiness', icon: FileCheck2, badge: null },
      ]
    },
    {
      group: 'Appraisal & Delivery',
      items: [
        { id: 'dpr', label: 'Bank-Ready DPR', icon: FileText, badge: 'SIDBI' },
        { id: 'comparison', label: 'Scheme Comparison', icon: Scale, badge: comparedSchemes.length > 0 ? `${comparedSchemes.length}` : null },
        { id: 'roadmap', label: 'Application Roadmap', icon: Compass, badge: null },
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
            <AshokaChakra size={24} />
            <span className="si-brand-name">SchemeMatch</span>
            <span className="si-brand-pill">Workspace</span>
          </div>
        </div>

        {/* Center: top nav links */}
        <nav className="si-top-nav-links">
          {['Dashboard', 'Schemes', 'Patrostics', 'Documents', 'About'].map(label => (
            <button
              key={label}
              className={`si-top-nav-link ${label === 'Dashboard' ? 'active' : ''}`}
              onClick={() => {
                if (label === 'Schemes') setActiveTab('matcher');
                else if (label === 'Documents') setActiveTab('documents');
                else if (label === 'Dashboard') setActiveTab('dashboard');
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right: controls + user */}
        <div className="si-top-right">
          {/* Persona switcher */}
          <select
            className="si-persona-select"
            value={selectedPersonaId}
            onChange={e => selectPersona(e.target.value)}
            title="Switch persona"
          >
            {personas.map(p => (
              <option key={p.id} value={p.id}>{p.avatarEmoji} {p.fullName}</option>
            ))}
          </select>

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
              <div className="si-user-sub">{profile.category} · {profile.state}</div>
            </div>
          </div>

          {/* Sign out */}
          <button className="si-signout-btn" onClick={logout} title="Sign Out">
            <LogOut size={15} />
            <span className="ws-signout-label">Sign Out</span>
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
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '3px' }}>Active Profile</div>
              <span className="si-profile-snapshot-name">{profile.fullName}</span>
              <span className="si-profile-snapshot-sub">
                {profile.category} · {profile.tradeType || profile.sector} · {profile.district || profile.state}
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
                <img src={indiaMapUrl} alt="" className="si-hero-watermark" aria-hidden="true" />
                <div className="si-hero-badge-row">
                  <span className="si-hero-live-badge">
                    <span className="si-hero-live-dot" />
                    Live AI Engines
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Groq Llama-3.3 Active</span>
                </div>
                <h1 className="si-hero-title">
                  <span>{matchResults.length} Priority Schemes</span> Unlocked
                </h1>
                <p className="si-hero-subtitle">
                  Welcome back, <strong>{firstNameGreeting}</strong>! Your profile is matched with{' '}
                  <strong>{matchResults.length} government schemes</strong> offering up to{' '}
                  <strong>₹{(totalPotentialSubsidy / 100000).toFixed(1)} Lakhs</strong> in capital subsidies,
                  concessional credit, and collateral-free loans.
                </p>
                <div className="si-hero-cta-row">
                  <button className="si-hero-cta-primary" onClick={() => setActiveTab('matcher')}>
                    <Target size={16} /> View Matched Schemes <ArrowRight size={14} />
                  </button>
                  <button className="si-hero-cta-secondary" onClick={() => setActiveTab('gap')}>
                    <SearchCheck size={16} /> Diagnose Eligibility Gaps
                  </button>
                </div>
              </div>

              {/* KPI Pill Bar */}
              <div className="si-kpi-bar">
                <div className="si-kpi-pill">
                  <span className="si-kpi-pill-icon"><IndianRupee size={14} /></span>
                  ₹{(totalPotentialSubsidy / 100000).toFixed(1)}L Available Subsidy
                </div>
                <div className="si-kpi-pill indigo">
                  <span className="si-kpi-pill-icon"><Award size={14} /></span>
                  {matchResults[0]?.scheme.name?.split(' ').slice(0, 2).join(' ') || 'PMEGP'} Matched
                </div>
                <div className="si-kpi-pill green">
                  <span className="si-kpi-pill-icon"><CheckCircle2 size={14} /></span>
                  85% Doc Ready
                </div>
                <div className="si-kpi-pill indigo">
                  <span className="si-kpi-pill-icon"><TrendingUp size={14} /></span>
                  {matchResults.length} Schemes Found
                </div>
              </div>

              {/* Horizontal Scheme Cards Scroller */}
              <div className="si-section-header">
                <span className="si-section-title">🏛️ Top Priority Schemes for {profile.fullName}</span>
                <button className="si-view-all-btn" onClick={() => setActiveTab('matcher')}>
                  View All ({matchResults.length}) <ArrowRight size={13} />
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
                      <div className="si-scheme-card-ministry">{m.scheme.ministry}</div>
                      <div className="si-scheme-subsidy-chip">
                        <IndianRupee size={11} /> {m.scheme.subsidyHighlight}
                      </div>
                      <div className="si-scheme-progress-bar">
                        <div className="si-scheme-progress-fill" style={{ width: `${m.matchScore}%` }} />
                      </div>
                      <div className="si-scheme-card-footer">
                        <button className="si-scheme-apply-btn" onClick={e => { e.stopPropagation(); setActiveTab('dpr'); }}>
                          Generate DPR
                        </button>
                        <button className="si-scheme-compare-btn" onClick={e => { e.stopPropagation(); setActiveTab('comparison'); }}>
                          Compare
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Module Grid */}
              <div className="si-section-header">
                <span className="si-section-title">⚙️ 10 Core AI Intelligence Modules</span>
              </div>
              <div className="si-module-grid">
                {[
                  { id: 'profile',     icon: Cpu,          color: 'indigo', label: '1. AI Profile Extraction',    desc: 'Natural-language profile builder with NLP demographic extraction.' },
                  { id: 'matcher',     icon: Target,        color: '',       label: '2. Smart Scheme Recommender', desc: `${matchResults.length} matched schemes with explainable affirmative scores.` },
                  { id: 'gap',         icon: SearchCheck,   color: 'indigo', label: '5. Eligibility Gap Analyzer', desc: 'Pinpoints missing criteria with 1-click remediation guides.' },
                  { id: 'whatif',      icon: Sliders,       color: '',       label: '6. What-If Simulator',        desc: 'Tweak loan amounts, location, and sector for live eligibility.' },
                  { id: 'calculator',  icon: Calculator,    color: 'green',  label: '7. Financial Calculator',     desc: 'Scheme-aware EMI, subsidy deduction, and DSCR calculations.' },
                  { id: 'partners',    icon: Building2,     color: 'indigo', label: '8. Channel Partner Router',   desc: 'Locate authorized SCAs, PSBs, and RRBs in your district.' },
                  { id: 'documents',   icon: FileCheck2,    color: 'green',  label: '9. Document Readiness',       desc: 'OCR-based checklist scan with 85% Bank Ready scoring.' },
                  { id: 'dpr',         icon: FileText,      color: '',       label: 'Bank-Ready DPR Generator',    desc: 'SIDBI-compliant 3-year projections and capital outlay modeling.' },
                  { id: 'comparison',  icon: Scale,         color: 'indigo', label: 'Scheme Comparison Matrix',    desc: 'Side-by-side comparison of loan ceilings, interest, and tenure.' },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <div key={m.id} className="si-module-tile" onClick={() => setActiveTab(m.id as any)}>
                      <div className={`si-module-tile-icon ${m.color}`}><Icon size={20} /></div>
                      <div className="si-module-tile-title">{m.label}</div>
                      <div className="si-module-tile-desc">{m.desc}</div>
                      <div className="si-module-tile-footer">
                        <span>Launch</span><ArrowRight size={12} />
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
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--si-nav-active)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Module 1 of 10</span>
                <div className="si-tab-panel-title">AI Profile Extraction & Demographic Alignment</div>
                <div className="si-tab-panel-sub">Enter natural-language profile info. Our AI extracts socio-economic indicators, location type, and trade parameters.</div>
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
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: 'var(--si-nav-active-bg)', color: 'var(--si-nav-active)', border: '1px solid var(--si-kpi-border)' }}>Module 2 of 10</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: 'rgba(5,150,105,0.1)', color: 'var(--si-success)', border: '1px solid rgba(5,150,105,0.25)' }}>Affirmative Engine Active</span>
                    </div>
                    <div className="si-tab-panel-title">Smart Scheme Recommender</div>
                    <div className="si-tab-panel-sub">
                      Found <strong>{matchResults.length} schemes</strong> with up to{' '}
                      <strong style={{ color: 'var(--si-success)' }}>₹{(totalPotentialSubsidy / 100000).toFixed(1)}L</strong> in grants.
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                    <select
                      value={filterCategory}
                      onChange={e => setFilterCategory(e.target.value)}
                      style={{ padding: '7px 12px', fontSize: '0.84rem', borderRadius: '8px', border: '1.5px solid var(--si-card-border)', background: 'var(--si-card-bg)', color: 'var(--si-indigo)' }}
                    >
                      <option value="all">All Schemes ({matchResults.length})</option>
                      <option value="Credit Subsidy">Credit Subsidy</option>
                      <option value="Term Loan">Term Loans</option>
                      <option value="Grant">Direct Grants</option>
                      <option value="Micro-Credit">Micro-Credit</option>
                      <option value="Women">Women Entrepreneurs</option>
                      <option value="SC">SC / ST</option>
                      <option value="OBC">OBC Entrepreneurs</option>
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
                    Conditional Schemes ({otherSchemes.length})
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    These need minor documentation updates or specific criteria to be met.
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
