import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  Lightbulb, 
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';

interface EligibilityGap {
  id: string;
  title: string;
  description: string;
  impactScore: number; // Potential score boost (e.g. +15%)
  subsidyUnlock: number; // Potential subsidy unlocked
  actionLabel: string;
  actionTab?: 'documents' | 'dpr' | 'profile' | 'whatif';
  externalUrl?: string;
  difficulty: 'Quick (5 mins)' | 'Medium (1-2 days)' | 'Action Required';
  isCompleted: boolean;
}

export const GapAnalyzer: React.FC = () => {
  const { profile, matchResults, otherSchemes, setActiveTab, setSelectedSchemeModal } = useProfile();
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    matchResults[0]?.scheme.id || otherSchemes[0]?.scheme.id || 'pmegp'
  );

  const allSchemes = [...matchResults, ...otherSchemes];
  const activeMatch = allSchemes.find((m) => m.scheme.id === selectedSchemeId) || matchResults[0];

  // Derive realistic gaps based on current profile and scheme conditions
  const generateGapsForScheme = (): EligibilityGap[] => {
    const gaps: EligibilityGap[] = [];

    // 1. Udyam Registration Gap
    if (!profile.hasExistingUdyam) {
      gaps.push({
        id: 'gap-udyam',
        title: 'Missing Udyam MSME Registration',
        description: 'Government portals require Udyam MSME Registration to qualify for credit-linked capital subsidies and priority sector lending.',
        impactScore: 18,
        subsidyUnlock: 75000,
        actionLabel: 'Register on Udyam Portal (Free)',
        externalUrl: 'https://udyamregistration.gov.in',
        difficulty: 'Quick (5 mins)',
        isCompleted: false
      });
    }

    // 2. DPR Gap
    if (!profile.hasProjectReport) {
      gaps.push({
        id: 'gap-dpr',
        title: 'No Detailed Project Report (DPR) Attached',
        description: 'Banks require a compliant 3-year projected balance sheet, cash flow statement, and DSCR analysis for loan sanction.',
        impactScore: 22,
        subsidyUnlock: 120000,
        actionLabel: 'Generate Free Bank-Ready DPR',
        actionTab: 'dpr',
        difficulty: 'Quick (5 mins)',
        isCompleted: false
      });
    }

    // 3. Margin Money / Promoter Contribution Gap
    const minRequiredMargin = activeMatch 
      ? (activeMatch.scheme.promoterContributionMinPercent?.specialCategory || 5)
      : 5;
    const currentMarginPercent = profile.totalProjectCost > 0
      ? (profile.promoterContributionAvailable / profile.totalProjectCost) * 100
      : 0;

    if (currentMarginPercent < minRequiredMargin) {
      gaps.push({
        id: 'gap-margin',
        title: `Promoter Contribution Below Required Minimum (${minRequiredMargin}%)`,
        description: `Your declared equity contribution is ${currentMarginPercent.toFixed(1)}%. Increase margin contribution to at least ₹${Math.round(profile.totalProjectCost * (minRequiredMargin / 100)).toLocaleString('en-IN')} to clear bank appraisal.`,
        impactScore: 15,
        subsidyUnlock: 50000,
        actionLabel: 'Simulate Contribution in What-If',
        actionTab: 'whatif',
        difficulty: 'Action Required',
        isCompleted: false
      });
    }

    // 4. Caste Certificate for SC/ST/OBC schemes
    if ((profile.category === 'SC' || profile.category === 'ST' || profile.category === 'OBC') && !profile.hasCasteCertificate) {
      gaps.push({
        id: 'gap-caste',
        title: 'Official Caste / Category Certificate Not Uploaded',
        description: `Required to claim the 35% special category capital subsidy and concessional 4-6% interest rate under ${activeMatch?.scheme.name || 'this scheme'}.`,
        impactScore: 25,
        subsidyUnlock: 175000,
        actionLabel: 'Upload Caste Certificate',
        actionTab: 'documents',
        difficulty: 'Medium (1-2 days)',
        isCompleted: false
      });
    }

    // 5. Skill Certification
    if (!profile.hasSkillTrainingCertificate) {
      gaps.push({
        id: 'gap-skill',
        title: 'EDP / Skill Development Certificate Not Linked',
        description: 'Mandatory 10-day Entrepreneurship Development Programme (EDP) training or PMKVY certificate expedites loan disbursement.',
        impactScore: 10,
        subsidyUnlock: 25000,
        actionLabel: 'Enroll in Free e-EDP Training',
        externalUrl: 'https://kviconline.gov.in/edp/',
        difficulty: 'Medium (1-2 days)',
        isCompleted: false
      });
    }

    // If no gaps left, provide a congratulatory item
    if (gaps.length === 0) {
      gaps.push({
        id: 'gap-none',
        title: 'All Primary Eligibility Criteria Satisfied!',
        description: 'Your profile satisfies all core prerequisites for this scheme. You can proceed directly to bank branch submission.',
        impactScore: 0,
        subsidyUnlock: 0,
        actionLabel: 'View Application Roadmap',
        actionTab: 'documents',
        difficulty: 'Quick (5 mins)',
        isCompleted: true
      });
    }

    return gaps;
  };

  const gaps = generateGapsForScheme();
  const currentMatchScore = activeMatch?.matchScore || 65;
  const potentialScore = Math.min(100, currentMatchScore + gaps.filter(g => !g.isCompleted).reduce((acc, g) => acc + g.impactScore, 0));
  const totalLockedSubsidy = gaps.filter(g => !g.isCompleted).reduce((acc, g) => acc + g.subsidyUnlock, 0);

  return (
    <div className="gap-analyzer-container" style={{ padding: '8px 0' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '26px 30px', marginBottom: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 220, height: 220, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald">Explainable AI Diagnostics</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Eligibility Gap Analyzer
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
              Identifies exact missing criteria, documentation bottlenecks, and structural discrepancies between your profile and target government credit schemes — with clear, actionable remediation steps.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'var(--bg-surface-elevated)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Score</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: currentMatchScore >= 75 ? '#10B981' : '#F59E0B' }}>
                {currentMatchScore}%
              </div>
            </div>
            <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Potential Score</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                {potentialScore}%
                <TrendingUp size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheme Selector Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
          Select Target Scheme to Diagnose:
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
          {allSchemes.slice(0, 5).map((m) => {
            const isSelected = m.scheme.id === selectedSchemeId;
            return (
              <button
                key={m.scheme.id}
                onClick={() => setSelectedSchemeId(m.scheme.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #4F46E5' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-surface)',
                  color: isSelected ? '#4F46E5' : 'var(--text-primary)',
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{m.scheme.name}</span>
                <span 
                  style={{ 
                    fontSize: '0.75rem', 
                    padding: '2px 8px', 
                    borderRadius: '20px', 
                    background: m.matchScore >= 75 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: m.matchScore >= 75 ? '#059669' : '#D97706',
                    fontWeight: 700
                  }}
                >
                  {m.matchScore}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Diagnostic Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '24px' }}>
        {/* Left Column: Actionable Gaps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
              <span>Identified Gaps for {activeMatch?.scheme.name} ({gaps.filter(g => !g.isCompleted).length})</span>
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Sorted by Subsidy Impact
            </span>
          </div>

          {gaps.map((gap) => (
            <div 
              key={gap.id}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '12px',
                borderLeft: gap.isCompleted ? '4px solid #10B981' : '4px solid #F59E0B',
                background: 'var(--bg-surface)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {gap.isCompleted ? (
                    <CheckCircle2 size={20} style={{ color: '#10B981', flexShrink: 0 }} />
                  ) : (
                    <ShieldAlert size={20} style={{ color: '#F59E0B', flexShrink: 0 }} />
                  )}
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                    {gap.title}
                  </h3>
                </div>

                <span 
                  style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 600, 
                    padding: '3px 8px', 
                    borderRadius: '4px',
                    background: gap.difficulty.includes('Quick') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.1)',
                    color: gap.difficulty.includes('Quick') ? '#059669' : '#DC2626'
                  }}
                >
                  {gap.difficulty}
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                {gap.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  {gap.impactScore > 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#4F46E5', fontWeight: 600 }}>
                      +{gap.impactScore}% Match Score
                    </span>
                  )}
                  {gap.subsidyUnlock > 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                      Unlocks ₹{(gap.subsidyUnlock / 1000).toFixed(0)}k Subsidy
                    </span>
                  )}
                </div>

                {/* Remediation Button */}
                {gap.actionTab ? (
                  <button
                    className="btn-primary"
                    onClick={() => setActiveTab(gap.actionTab!)}
                    style={{
                      padding: '7px 14px',
                      fontSize: '0.82rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{gap.actionLabel}</span>
                    <ArrowRight size={14} />
                  </button>
                ) : gap.externalUrl ? (
                  <a
                    href={gap.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{
                      padding: '7px 14px',
                      fontSize: '0.82rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{gap.actionLabel}</span>
                    <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Opportunity Summary & Remediation Roadmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Unlock Potential Card */}
          <div 
            className="glass-panel" 
            style={{ 
              padding: '24px', 
              borderRadius: '14px',
              background: 'linear-gradient(145deg, rgba(79, 70, 229, 0.06) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid rgba(79, 70, 229, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Award size={20} style={{ color: '#4F46E5' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Remediation Impact Summary
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 18px 0', lineHeight: 1.45 }}>
              Resolving the <strong>{gaps.filter(g => !g.isCompleted).length} pending items</strong> on this scheme will elevate your sanction probability from conditional to pre-approved.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Additional Subsidy to Unlock:</span>
                <strong style={{ color: '#059669', fontSize: '1.05rem' }}>+₹{totalLockedSubsidy.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Match Confidence:</span>
                <strong style={{ color: '#4F46E5', fontSize: '1.05rem' }}>{potentialScore}% (High Fit)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Time to Clear:</span>
                <strong style={{ color: 'var(--text-primary)' }}>~2-3 Business Days</strong>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span>Eligibility Progress</span>
                <span>{currentMatchScore}% of 100%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${currentMatchScore}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #F59E0B 0%, #4F46E5 100%)',
                    borderRadius: '4px'
                  }} 
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (activeMatch) setSelectedSchemeModal(activeMatch);
              }}
              className="btn-secondary"
              style={{
                width: '100%',
                marginTop: '18px',
                padding: '10px',
                fontSize: '0.85rem',
                justifyContent: 'center',
                borderRadius: '8px'
              }}
            >
              Inspect Scheme Full Guidelines
            </button>
          </div>

          {/* Quick Tips Box */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Lightbulb size={18} style={{ color: '#F59E0B' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                Bank Appraisal Advisory
              </h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Under Ministry guidelines, applications with completed Udyam Registration and a 3-year projected Debt Service Coverage Ratio (DSCR) above 1.5 receive priority sanction from Public Sector Banks within 14 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapAnalyzer;
