import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  Check, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  ShieldCheck, 
  Building2, 
  DollarSign, 
  MapPin, 
  Briefcase,
  HelpCircle,
  Zap
} from 'lucide-react';
import { SectorType, SocialCategory, LocationType } from '../types';

export const WhatIfSimulator: React.FC = () => {
  const { profile, setProfile, runMatching, matchResults } = useProfile();

  // Simulated state initialized from active user profile
  const [simLoanAmount, setSimLoanAmount] = useState<number>(profile.requiredLoanAmount || 250000);
  const [simProjectCost, setSimProjectCost] = useState<number>(profile.totalProjectCost || 300000);
  const [simPromoterContribution, setSimPromoterContribution] = useState<number>(profile.promoterContributionAvailable || 15000);
  const [simSector, setSimSector] = useState<SectorType>(profile.sector || 'ArtisanHandicraft');
  const [simCategory, setSimCategory] = useState<SocialCategory>(profile.category || 'SC');
  const [simLocation, setSimLocation] = useState<LocationType>(profile.locationType || 'Rural');
  const [simHasUdyam, setSimHasUdyam] = useState<boolean>(profile.hasExistingUdyam || false);
  const [simHasCasteCert, setSimHasCasteCert] = useState<boolean>(profile.hasCasteCertificate || true);
  const [simHasDpr, setSimHasDpr] = useState<boolean>(profile.hasProjectReport || false);

  const [isAppliedNotice, setIsAppliedNotice] = useState<boolean>(false);

  // Calculate simulated subsidy & scores based on rules
  const marginPercent = simProjectCost > 0 ? (simPromoterContribution / simProjectCost) * 100 : 5;

  // Simulate PMEGP Subsidy Rate:
  // Special category (SC/ST/OBC/Women) Rural = 35%, Urban = 25%
  // General category Rural = 25%, Urban = 15%
  const isSpecialCategory = simCategory === 'SC' || simCategory === 'ST' || simCategory === 'OBC' || profile.gender === 'Female';
  let simSubsidyRate = 15;
  if (isSpecialCategory) {
    simSubsidyRate = simLocation === 'Rural' ? 35 : 25;
  } else {
    simSubsidyRate = simLocation === 'Rural' ? 25 : 15;
  }

  // Max cap for PMEGP: Mfg 50L (subsidy max 17.5L), Service 20L (subsidy max 7L)
  const maxEligibleCost = simSector === 'Manufacturing' ? 5000000 : 2000000;
  const effectiveProjectCost = Math.min(simProjectCost, maxEligibleCost);
  const simSubsidyAmount = Math.round(effectiveProjectCost * (simSubsidyRate / 100));

  // Simulated EMI calculation (concessional ~6% vs standard ~9%)
  const simAnnualRate = isSpecialCategory ? 0.06 : 0.085;
  const simMonthlyRate = simAnnualRate / 12;
  const simTenureMonths = 60;
  const simPrincipal = Math.max(10000, simLoanAmount - simSubsidyAmount);
  const simEmi = Math.round(
    (simPrincipal * simMonthlyRate * Math.pow(1 + simMonthlyRate, simTenureMonths)) /
    (Math.pow(1 + simMonthlyRate, simTenureMonths) - 1)
  );

  // Baseline comparisons with current profile
  const baselineLoan = profile.requiredLoanAmount || 250000;
  const baselineSubsidy = Math.round(
    profile.totalProjectCost * (profile.locationType === 'Rural' && (profile.category === 'SC' || profile.category === 'ST') ? 0.35 : 0.25)
  );
  const subsidyDelta = simSubsidyAmount - baselineSubsidy;

  // Quick Preset Scenarios
  const applyPreset = (preset: 'max_subsidy' | 'scale_mfg' | 'micro_credit' | 'reset') => {
    if (preset === 'reset') {
      setSimLoanAmount(profile.requiredLoanAmount || 250000);
      setSimProjectCost(profile.totalProjectCost || 300000);
      setSimPromoterContribution(profile.promoterContributionAvailable || 15000);
      setSimSector(profile.sector || 'ArtisanHandicraft');
      setSimCategory(profile.category || 'SC');
      setSimLocation(profile.locationType || 'Rural');
      setSimHasUdyam(profile.hasExistingUdyam || false);
      setSimHasCasteCert(profile.hasCasteCertificate || true);
      setSimHasDpr(profile.hasProjectReport || false);
    } else if (preset === 'max_subsidy') {
      setSimCategory('SC');
      setSimLocation('Rural');
      setSimSector('Manufacturing');
      setSimProjectCost(1000000);
      setSimLoanAmount(900000);
      setSimPromoterContribution(50000);
      setSimHasUdyam(true);
      setSimHasCasteCert(true);
      setSimHasDpr(true);
    } else if (preset === 'scale_mfg') {
      setSimSector('Manufacturing');
      setSimProjectCost(2500000);
      setSimLoanAmount(2250000);
      setSimPromoterContribution(250000);
      setSimHasUdyam(true);
      setSimHasDpr(true);
    } else if (preset === 'micro_credit') {
      setSimSector('Trading');
      setSimProjectCost(80000);
      setSimLoanAmount(70000);
      setSimPromoterContribution(10000);
      setSimHasUdyam(false);
      setSimHasDpr(false);
    }
  };

  // Commit Simulated Profile back to Workspace Context
  const applyToProfile = () => {
    const updatedProfile = {
      ...profile,
      requiredLoanAmount: simLoanAmount,
      totalProjectCost: simProjectCost,
      promoterContributionAvailable: simPromoterContribution,
      sector: simSector,
      category: simCategory,
      locationType: simLocation,
      hasExistingUdyam: simHasUdyam,
      hasCasteCertificate: simHasCasteCert,
      hasProjectReport: simHasDpr
    };
    setProfile(updatedProfile);
    runMatching(updatedProfile);
    setIsAppliedNotice(true);
    setTimeout(() => setIsAppliedNotice(false), 3000);
  };

  return (
    <div className="whatif-simulator-container" style={{ padding: '8px 0' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '26px 30px', marginBottom: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 250, height: 250, background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald">Real-Time Parameter Sensitivity</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              What-If Scheme Simulator
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
              Tweak financial requirements, sector classifications, location types, and registration parameters in real-time to observe dynamic changes in capital subsidy, match probability, and monthly repayment liability.
            </p>
          </div>

          {/* Quick Apply Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={applyToProfile}
              className="btn-primary"
              style={{
                padding: '10px 18px',
                fontSize: '0.88rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)'
              }}
            >
              {isAppliedNotice ? <Check size={16} /> : <Zap size={16} />}
              <span>{isAppliedNotice ? 'Profile Synchronized!' : 'Apply to Active Profile'}</span>
            </button>
          </div>
        </div>

        {/* Preset Scenarios Strip */}
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Instant Presets:
          </span>
          <button
            onClick={() => applyPreset('max_subsidy')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '5px 12px', borderRadius: '20px' }}
          >
            🎯 Max 35% Rural Subsidy
          </button>
          <button
            onClick={() => applyPreset('scale_mfg')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '5px 12px', borderRadius: '20px' }}
          >
            🏭 Scale-Up Mfg (₹25L)
          </button>
          <button
            onClick={() => applyPreset('micro_credit')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '5px 12px', borderRadius: '20px' }}
          >
            ⚡ Micro-Loan (&lt; ₹1L)
          </button>
          <button
            onClick={() => applyPreset('reset')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '5px 12px', borderRadius: '20px', borderColor: 'var(--border-subtle)' }}
          >
            <RefreshCw size={12} style={{ marginRight: '4px' }} />
            Reset to My Profile
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls (Sliders) + Right Live Impact Engine */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1.1fr)', gap: '24px' }}>
        
        {/* Left Column: Interactive Simulation Sliders & Switches */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} style={{ color: '#4F46E5' }} />
            <span>Simulation Parameters</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Slider 1: Total Project Cost */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Total Project Cost
                </label>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#4F46E5' }}>
                  ₹{simProjectCost.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={5000000}
                step={25000}
                value={simProjectCost}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSimProjectCost(val);
                  if (simLoanAmount > val) setSimLoanAmount(Math.round(val * 0.9));
                }}
                style={{ width: '100%', accentColor: '#4F46E5', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>₹50,000 (Micro)</span>
                <span>₹25,00,000 (MSME)</span>
                <span>₹50,00,000 (Max PMEGP)</span>
              </div>
            </div>

            {/* Slider 2: Required Loan Amount */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Bank Loan Requested
                </label>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#10B981' }}>
                  ₹{simLoanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={25000}
                max={simProjectCost}
                step={25000}
                value={simLoanAmount}
                onChange={(e) => setSimLoanAmount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>₹25,000</span>
                <span>Loan portion: {Math.round((simLoanAmount / simProjectCost) * 100)}% of cost</span>
                <span>₹{simProjectCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Slider 3: Promoter Contribution */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Promoter Margin Money (Own Investment)
                </label>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F59E0B' }}>
                  ₹{simPromoterContribution.toLocaleString('en-IN')} ({marginPercent.toFixed(1)}%)
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={Math.round(simProjectCost * 0.4)}
                step={5000}
                value={simPromoterContribution}
                onChange={(e) => setSimPromoterContribution(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>₹5,000 (Min 5% for SC/ST)</span>
                <span>Min 10% for General</span>
                <span>40% Max Self-Finance</span>
              </div>
            </div>

            {/* Selectors Grid: Sector, Category, Location */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Business Sector
                </label>
                <select
                  value={simSector}
                  onChange={(e) => setSimSector(e.target.value as SectorType)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.82rem', borderRadius: '8px' }}
                >
                  <option value="ArtisanHandicraft">Artisan & Craft</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Services">Services</option>
                  <option value="Trading">Retail / Trading</option>
                  <option value="Textiles">Textiles & Weaving</option>
                  <option value="AgroAllied">Agro-Allied</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Social Category
                </label>
                <select
                  value={simCategory}
                  onChange={(e) => setSimCategory(e.target.value as SocialCategory)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.82rem', borderRadius: '8px' }}
                >
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="OBC">OBC</option>
                  <option value="General">General</option>
                  <option value="Minority">Minority</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Location Type
                </label>
                <select
                  value={simLocation}
                  onChange={(e) => setSimLocation(e.target.value as LocationType)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.82rem', borderRadius: '8px' }}
                >
                  <option value="Rural">Rural (35% Subsidy)</option>
                  <option value="Urban">Urban (25% Subsidy)</option>
                  <option value="Semi-Urban">Semi-Urban</option>
                </select>
              </div>
            </div>

            {/* Verification Toggles */}
            <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                Simulate Registration / Document Status:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={simHasUdyam}
                    onChange={(e) => setSimHasUdyam(e.target.checked)}
                    style={{ accentColor: '#4F46E5' }}
                  />
                  <span>Has Udyam</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={simHasCasteCert}
                    onChange={(e) => setSimHasCasteCert(e.target.checked)}
                    style={{ accentColor: '#4F46E5' }}
                  />
                  <span>Caste Certificate</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={simHasDpr}
                    onChange={(e) => setSimHasDpr(e.target.checked)}
                    style={{ accentColor: '#4F46E5' }}
                  />
                  <span>Bankable DPR</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Simulation Outcomes & Delta Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Key Outcome Highlights */}
          <div 
            className="glass-panel" 
            style={{ 
              padding: '24px', 
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
              border: '1px solid rgba(79, 70, 229, 0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Simulated Financial Outcome
              </h3>
              <span className="badge badge-emerald">Live Calculated</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                  Govt. Capital Subsidy
                </span>
                <strong style={{ fontSize: '1.35rem', color: '#059669', display: 'block', margin: '4px 0' }}>
                  ₹{simSubsidyAmount.toLocaleString('en-IN')}
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>
                  {simSubsidyRate}% rate ({simLocation})
                </span>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                  Est. Monthly EMI
                </span>
                <strong style={{ fontSize: '1.35rem', color: '#4F46E5', display: 'block', margin: '4px 0' }}>
                  ₹{simEmi.toLocaleString('en-IN')}
                </strong>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {(simAnnualRate * 100).toFixed(1)}% p.a. • 5 yr tenure
                </span>
              </div>
            </div>

            {/* Subsidy Delta Notice */}
            <div style={{ padding: '12px 14px', background: subsidyDelta >= 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {subsidyDelta >= 0 ? (
                <TrendingUp size={18} style={{ color: '#059669', flexShrink: 0 }} />
              ) : (
                <TrendingDown size={18} style={{ color: '#DC2626', flexShrink: 0 }} />
              )}
              <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                {subsidyDelta >= 0 ? (
                  <><strong>+₹{subsidyDelta.toLocaleString('en-IN')}</strong> higher subsidy compared to your baseline profile!</>
                ) : (
                  <><strong>-₹{Math.abs(subsidyDelta).toLocaleString('en-IN')}</strong> lower subsidy due to changed parameters.</>
                )}
              </span>
            </div>
          </div>

          {/* Scheme Feasibility Matrix */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
              Scheme Eligibility Under Current Simulation:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* PMEGP */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                <div>
                  <strong style={{ fontSize: '0.86rem', display: 'block' }}>PMEGP Credit Subsidy</strong>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {simProjectCost <= 5000000 ? '✅ Cost within ceiling' : '❌ Exceeds 50L limit'}
                  </span>
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                  {simHasUdyam && simHasDpr ? '95% Fit' : '78% Fit'}
                </span>
              </div>

              {/* Stand-Up India */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                <div>
                  <strong style={{ fontSize: '0.86rem', display: 'block' }}>Stand-Up India (₹10L - ₹1Cr)</strong>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {simLoanAmount >= 1000000 && isSpecialCategory ? '✅ Eligible for Greenfield' : 'Requires min ₹10L loan & SC/ST/Women'}
                  </span>
                </div>
                <span className={`badge ${simLoanAmount >= 1000000 && isSpecialCategory ? 'badge-emerald' : 'badge-saffron'}`} style={{ fontSize: '0.75rem' }}>
                  {simLoanAmount >= 1000000 && isSpecialCategory ? 'Eligible' : 'Conditional'}
                </span>
              </div>

              {/* Mudra / NSFDC */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                <div>
                  <strong style={{ fontSize: '0.86rem', display: 'block' }}>Mudra (Tarun) / NSFDC Term Loan</strong>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Up to ₹10 Lakhs with 4-6% concessional rate
                  </span>
                </div>
                <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
                  {simLoanAmount <= 1000000 ? 'High Priority' : 'Bridge Option'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WhatIfSimulator;
