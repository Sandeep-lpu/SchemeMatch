import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  LogOut, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Scale, 
  Compass, 
  ShieldCheck, 
  ArrowLeft,
  Building2, 
  TrendingUp, 
  User as UserIcon, 
  HelpCircle,
  ExternalLink,
  LayoutDashboard,
  Target,
  SearchCheck,
  Sliders,
  Calculator,
  ArrowRight,
  Sun,
  Moon,
  Globe,
  Award,
  AlertTriangle,
  FileCheck2,
  Cpu,
  Menu,
  X
} from 'lucide-react';
import logoImg from '../assets/logo.png';

// Import All 10 Workspace Feature Components
import { EligibilityWizard } from './EligibilityWizard';
import { SchemeCard } from './SchemeCard';
import { SchemeDetailModal } from './SchemeDetailModal';
import { SchemeComparison } from './SchemeComparison';
import { DprGeneratorView } from './DprGeneratorView';
import { DocumentReadiness } from './DocumentReadiness';
import { ApplicationNavigator } from './ApplicationNavigator';
import { SaathiAICopilot } from './SaathiAICopilot';

// Newly Created Components
import { GapAnalyzer } from './GapAnalyzer';
import { WhatIfSimulator } from './WhatIfSimulator';
import { FinancialCalculator } from './FinancialCalculator';
import { ChannelPartnerRouter } from './ChannelPartnerRouter';

export const MainAppDashboard: React.FC = () => {
  const { user, logout, setCurrentView, isConfigured } = useAuth();
  const { 
    activeTab, 
    setActiveTab, 
    matchResults, 
    otherSchemes,
    totalPotentialSubsidy,
    comparedSchemes,
    profile,
    personas,
    selectedPersonaId,
    selectPersona
  } = useProfile();
  const { t, theme, toggleTheme, language, setLanguage } = useLanguage();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [avatarError, setAvatarError] = useState<boolean>(false);

  const filteredMatches = matchResults.filter((m) => {
    if (selectedFilterCategory !== 'all') {
      if (
        !m.scheme.categoryTag.toLowerCase().includes(selectedFilterCategory.toLowerCase()) &&
        !m.scheme.targetGroups.includes(selectedFilterCategory)
      ) {
        return false;
      }
    }
    return true;
  });

  const navItems = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: 'Tools & Features',
      items: [
        { id: 'profile', label: 'AI Profile Extraction', icon: Cpu, badge: null },
        { id: 'matcher', label: 'Smart Scheme Recommender', icon: Target, badge: `${matchResults.length}` },
        { id: 'gap', label: 'Eligibility Gap Analyzer', icon: SearchCheck, badge: null },
        { id: 'whatif', label: 'What-If Simulator', icon: Sliders, badge: null },
        { id: 'calculator', label: 'Financial Calculator', icon: Calculator, badge: null },
        { id: 'partners', label: 'Channel Partner Router', icon: Building2, badge: null },
        { id: 'documents', label: 'Document Readiness', icon: FileCheck2, badge: null }
      ]
    },
    {
      group: 'Appraisal & Delivery',
      items: [
        { id: 'dpr', label: 'Bank-Ready DPR Generator', icon: FileText, badge: 'SIDBI' },
        { id: 'comparison', label: 'Scheme Comparison Matrix', icon: Scale, badge: comparedSchemes.length > 0 ? `${comparedSchemes.length}` : null },
        { id: 'roadmap', label: 'Application Roadmap', icon: Compass, badge: null }
      ]
    }
  ];

  return (
    <div className="ws-layout-container">
      {/* Top Application Bar */}
      <header className="ws-top-bar">
        <div className="ws-top-left">
          <button 
            className="ws-mobile-menu-btn"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div 
            className="ws-brand-area" 
            onClick={() => setCurrentView('landing')} 
            style={{ cursor: 'pointer' }}
            title="Return to Public Landing Page"
          >
            <img src={logoImg} alt="SchemeMatch Logo" className="ws-brand-logo" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="ws-brand-name">SchemeMatch</span>
              </div>
              <span className="ws-brand-sub">Affirmative Credit & Subsidy Intelligence</span>
            </div>
          </div>
        </div>

        {/* Top Right Controls: Theme, Language, User Badge, Logout */}
        <div className="ws-top-right">

          {/* Language Selector */}
          <div className="ws-header-btn-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <Globe size={14} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="ws-icon-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Back to Landing Button */}
          <button 
            className="ws-link-btn"
            onClick={() => setCurrentView('landing')}
            title="Preview Public Landing Page"
          >
            <ArrowLeft size={14} />
            <span>Landing</span>
          </button>

          {/* User Profile Pill */}
          <div className="ws-user-badge">
            <div className="ws-user-avatar-wrapper">
              <div className="ws-user-avatar">
                {user?.avatarUrl && !avatarError ? (
                  <img 
                    src={user.avatarUrl} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={() => setAvatarError(true)} 
                  />
                ) : (
                  <span>
                    {user?.fullName
                      ? user.fullName.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
                      : 'U'}
                  </span>
                )}
              </div>
              {user?.provider === 'google' && (
                <div className="ws-user-google-badge" title="Authenticated via Google Identity">
                  <svg viewBox="0 0 24 24" width="10" height="10">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="ws-user-info-text">
              <div className="ws-user-name-row">
                <span className="ws-user-name">{user?.fullName || 'Entrepreneur'}</span>
                {user?.provider === 'google' && (
                  <span className="ws-google-tag">Google</span>
                )}
              </div>
              <span className="ws-user-tag">{user?.email || `${profile.category} • ${profile.state}`}</span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button 
            className="ws-signout-btn" 
            onClick={logout}
            title="Sign Out of Session"
          >
            <LogOut size={16} />
            <span className="ws-signout-label">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame (Sidebar + Content Viewport) */}
      <div className="ws-main-frame">
        {/* Left Sidebar Navigation */}
        <aside className={`ws-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
          <div className="ws-sidebar-scrollable">
            {navItems.map((group, gIdx) => (
              <div key={gIdx} className="ws-nav-group">
                <span className="ws-nav-group-title">{group.group}</span>
                <nav className="ws-nav-list">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`ws-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setMobileSidebarOpen(false);
                        }}
                      >
                        <span className="ws-nav-item-icon">
                          <Icon size={18} />
                        </span>
                        <span className="ws-nav-item-label">{item.label}</span>
                        {item.badge && (
                          <span className={`ws-nav-item-badge ${isActive ? 'active' : ''}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Sidebar Bottom Profile Card */}
          <div className="ws-sidebar-footer">
            <div className="ws-profile-snapshot-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Profile</span>
                <span className="badge badge-indigo" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{profile.category} Quota</span>
              </div>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'block' }}>{profile.fullName}</strong>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{profile.tradeType || profile.sector} • {profile.district || profile.state}</span>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="ws-content-viewport">
          
          {/* TAB 0: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="ws-dashboard-overview">
              {/* Welcome Hero Banner */}
              <div className="glass-panel ws-welcome-card">
                <div className="ws-welcome-content">
                  <h1 className="ws-welcome-title">
                    Welcome, {user?.fullName?.split(' ')[0] || profile.fullName}! 👋
                  </h1>
                  <p className="ws-welcome-subtitle">
                    Your business profile is actively matched with <strong>{matchResults.length} prioritized government schemes</strong>. You have unlocked up to <strong>₹{(totalPotentialSubsidy / 100000).toFixed(1)} Lakhs</strong> in capital subsidies, concessional interest rates, and loan collateral waivers.
                  </p>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-primary"
                      onClick={() => setActiveTab('matcher')}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px' }}
                    >
                      <Target size={16} />
                      <span>Review Smart Matches ({matchResults.length})</span>
                      <ArrowRight size={14} />
                    </button>

                    <button 
                      className="btn-secondary"
                      onClick={() => setActiveTab('gap')}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}
                    >
                      <SearchCheck size={16} />
                      <span>Diagnose Eligibility Gaps</span>
                    </button>
                  </div>
                </div>

                {/* 3 Metric Stat Pillars */}
                <div className="ws-metric-pillars">
                  <div className="ws-stat-pillar">
                    <span className="ws-stat-pillar-label">Top Matched Scheme</span>
                    <strong className="ws-stat-pillar-val text-indigo">
                      {matchResults[0]?.scheme.name || 'PMEGP Subsidy'}
                    </strong>
                    <span className="ws-stat-pillar-sub">
                      {matchResults[0]?.matchScore || 94}% Affirmative Alignment
                    </span>
                  </div>

                  <div className="ws-stat-pillar">
                    <span className="ws-stat-pillar-label">Potential Capital Grant</span>
                    <strong className="ws-stat-pillar-val text-emerald">
                      ₹{(totalPotentialSubsidy / 100000).toFixed(1)} Lakhs
                    </strong>
                    <span className="ws-stat-pillar-sub">35% Special Rural Subsidy</span>
                  </div>

                  <div className="ws-stat-pillar">
                    <span className="ws-stat-pillar-label">Document Readiness</span>
                    <strong className="ws-stat-pillar-val text-blue">85% Bank Ready</strong>
                    <span className="ws-stat-pillar-sub">Pre-Appraisal Verified</span>
                  </div>
                </div>
              </div>

              {/* Features Grid Showcase */}
              <div style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      Tools & Features
                    </h2>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                      Access specialized tools designed for affirmative credit facilitation and bank sanctioning.
                    </p>
                  </div>
                </div>

                <div className="ws-feature-cards-grid">
                  {/* Card 1: AI Profile Extraction */}
                  <div className="glass-panel ws-feature-card" onClick={() => setActiveTab('profile')}>
                    <div className="ws-feature-card-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#4F46E5' }}>
                      <Cpu size={22} />
                    </div>
                    <h3 className="ws-feature-card-title">1. AI Profile Extraction</h3>
                    <p className="ws-feature-card-desc">Natural-language conversational profile builder. Extracts age, income, caste, project cost, and machinery needs.</p>
                    <div className="ws-feature-card-footer">
                      <span>Launch Builder</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  {/* Card 2: Smart Scheme Recommender */}
                  <div className="glass-panel ws-feature-card" onClick={() => setActiveTab('matcher')}>
                    <div className="ws-feature-card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                      <Target size={22} />
                    </div>
                    <h3 className="ws-feature-card-title">2. Smart Scheme Recommender</h3>
                    <p className="ws-feature-card-desc">Matches user profile against 23+ credit schemes with explainable match scores and affirmative weighting.</p>
                    <div className="ws-feature-card-footer">
                      <span>View {matchResults.length} Schemes</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  {/* Card 3: Eligibility Gap Analyzer */}
                  <div className="glass-panel ws-feature-card" onClick={() => setActiveTab('gap')}>
                    <div className="ws-feature-card-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706' }}>
                      <SearchCheck size={22} />
                    </div>
                    <h3 className="ws-feature-card-title">5. Eligibility Gap Analyzer</h3>
                    <p className="ws-feature-card-desc">Identifies missing documents and criteria when you are close to qualifying, with 1-click remediation guides.</p>
                    <div className="ws-feature-card-footer">
                      <span>Diagnose Bottlenecks</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  {/* Card 4: What-If Simulator */}
                  <div className="glass-panel ws-feature-card" onClick={() => setActiveTab('whatif')}>
                    <div className="ws-feature-card-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#4F46E5' }}>
                      <Sliders size={22} />
                    </div>
                    <h3 className="ws-feature-card-title">6. What-If Simulator</h3>
                    <p className="ws-feature-card-desc">Tweak loan amounts, project costs, sector classifications, and location to see instant scheme eligibility changes.</p>
                    <div className="ws-feature-card-footer">
                      <span>Simulate Scenarios</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  {/* Card 5: Financial Calculator */}
                  <div className="glass-panel ws-feature-card" onClick={() => setActiveTab('calculator')}>
                    <div className="ws-feature-card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                      <Calculator size={22} />
                    </div>
                    <h3 className="ws-feature-card-title">7. Financial Calculator</h3>
                    <p className="ws-feature-card-desc">Scheme-aware EMI, back-ended subsidy deductions, moratorium grace periods, and interest subvention savings.</p>
                    <div className="ws-feature-card-footer">
                      <span>Calculate Repayment</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  {/* Card 6: Channel Partner Router */}
                  <div className="glass-panel ws-feature-card" onClick={() => setActiveTab('partners')}>
                    <div className="ws-feature-card-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706' }}>
                      <Building2 size={22} />
                    </div>
                    <h3 className="ws-feature-card-title">8. Channel Partner Router</h3>
                    <p className="ws-feature-card-desc">Direct routing to authorized SCAs, Public Sector Banks, RRBs, and MFIs in {profile.district || 'your district'}.</p>
                    <div className="ws-feature-card-footer">
                      <span>Find Nodal Desks</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority Schemes Preview Strip */}
              <div style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Top Prioritized Opportunities for {profile.fullName}
                  </h3>
                  <button 
                    onClick={() => setActiveTab('matcher')} 
                    className="ws-link-btn" 
                    style={{ fontSize: '0.84rem' }}
                  >
                    <span>View All ({matchResults.length})</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {matchResults.slice(0, 2).map((m) => (
                    <SchemeCard key={m.scheme.id} matchResult={m} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: AI PROFILE EXTRACTION */}
          {activeTab === 'profile' && (
            <div className="ws-single-panel">
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '8px 0 4px 0' }}>
                  AI Profile Extraction & Demographic Alignment
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
                  Enter natural-language profile information or adjust specific fields. Our AI parses socio-economic indicators, location type, and trade parameters.
                </p>
              </div>
              <EligibilityWizard />
            </div>
          )}

          {/* TAB 2: SMART SCHEME RECOMMENDER */}
          {activeTab === 'matcher' && (
            <div className="ws-single-panel">
              <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-emerald">Affirmative Engine Active</span>
                  </div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 6px 0' }}>
                    Smart Scheme Recommender
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
                    Found <strong>{matchResults.length} prioritized credit schemes</strong> matching your profile criteria with up to <strong style={{ color: '#059669' }}>₹{(totalPotentialSubsidy / 100000).toFixed(1)} Lakhs</strong> in capital grants.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={selectedFilterCategory}
                    onChange={(e) => setSelectedFilterCategory(e.target.value)}
                    style={{ padding: '8px 14px', fontSize: '0.86rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                  >
                    <option value="all">All Evaluated Schemes ({matchResults.length})</option>
                    <option value="Credit Subsidy">Credit Subsidy</option>
                    <option value="Term Loan">Term Loans</option>
                    <option value="Grant">Direct Grants</option>
                    <option value="Micro-Credit">Micro-Credit</option>
                    <option value="Women">Women Entrepreneurs</option>
                    <option value="SC">SC / ST Entrepreneurs</option>
                  </select>
                </div>
              </div>

              <div className="schemes-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredMatches.map((match) => (
                  <SchemeCard key={match.scheme.id} matchResult={match} />
                ))}
              </div>

              {otherSchemes.length > 0 && (
                <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px dashed var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    Conditional Government Schemes ({otherSchemes.length})
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Schemes requiring minor documentation updates or meeting specific trade criteria:
                  </p>
                  <div className="schemes-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {otherSchemes.slice(0, 3).map((match) => (
                      <SchemeCard key={match.scheme.id} matchResult={match} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ELIGIBILITY GAP ANALYZER */}
          {activeTab === 'gap' && <GapAnalyzer />}

          {/* TAB 6: WHAT-IF SIMULATOR */}
          {activeTab === 'whatif' && <WhatIfSimulator />}

          {/* TAB 7: FINANCIAL CALCULATOR */}
          {activeTab === 'calculator' && <FinancialCalculator />}

          {/* TAB 8: CHANNEL PARTNER ROUTER */}
          {activeTab === 'partners' && <ChannelPartnerRouter />}

          {/* TAB 9: DOCUMENT READINESS CHECKER */}
          {activeTab === 'documents' && <DocumentReadiness />}

          {/* TAB 10: BANK-READY DPR GENERATOR */}
          {activeTab === 'dpr' && <DprGeneratorView />}

          {/* TAB 11: SCHEME COMPARISON */}
          {activeTab === 'comparison' && <SchemeComparison />}

          {/* TAB 12: APPLICATION ROADMAP */}
          {activeTab === 'roadmap' && <ApplicationNavigator />}

        </main>
      </div>

      {/* Floating Saathi AI Voice Copilot (Feature 10) */}
      <SaathiAICopilot />

      {/* Deep Dive Details Modal (Feature 3 & 4) */}
      <SchemeDetailModal />
    </div>
  );
};

export default MainAppDashboard;
