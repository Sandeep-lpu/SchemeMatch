import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { 
  Calculator, 
  Sparkles, 
  DollarSign, 
  Percent, 
  Calendar, 
  CheckCircle, 
  FileText, 
  TrendingDown, 
  PieChart, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface SchemeFinancialPreset {
  id: string;
  name: string;
  interestRate: number; // % per annum
  interestSubvention: number; // % subsidy on interest
  maxSubsidyPercent: number;
  maxSubsidyAmount: number;
  promoterContributionMin: number; // %
  defaultTenureYears: number;
  defaultMoratoriumMonths: number;
}

const SCHEME_PRESETS: SchemeFinancialPreset[] = [
  {
    id: 'pmegp',
    name: 'PMEGP (Prime Minister Employment Generation Programme)',
    interestRate: 8.5,
    interestSubvention: 0,
    maxSubsidyPercent: 35, // For special category rural
    maxSubsidyAmount: 1750000,
    promoterContributionMin: 5,
    defaultTenureYears: 5,
    defaultMoratoriumMonths: 6
  },
  {
    id: 'standup',
    name: 'Stand-Up India (SC/ST & Women Greenfields)',
    interestRate: 7.75,
    interestSubvention: 0,
    maxSubsidyPercent: 15,
    maxSubsidyAmount: 1500000,
    promoterContributionMin: 15,
    defaultTenureYears: 7,
    defaultMoratoriumMonths: 18
  },
  {
    id: 'nsfdc-term',
    name: 'NSFDC Term Loan (Concessional for SC Entrepreneurs)',
    interestRate: 5.0,
    interestSubvention: 1.5,
    maxSubsidyPercent: 20,
    maxSubsidyAmount: 500000,
    promoterContributionMin: 5,
    defaultTenureYears: 5,
    defaultMoratoriumMonths: 6
  },
  {
    id: 'mudra-tarun',
    name: 'PM MUDRA Yojana (Tarun Category)',
    interestRate: 8.75,
    interestSubvention: 0,
    maxSubsidyPercent: 0,
    maxSubsidyAmount: 0,
    promoterContributionMin: 10,
    defaultTenureYears: 5,
    defaultMoratoriumMonths: 3
  },
  {
    id: 'pmsvanidhi',
    name: 'PM SVANidhi (Micro-Credit with 7% Subvention)',
    interestRate: 9.0,
    interestSubvention: 7.0,
    maxSubsidyPercent: 0,
    maxSubsidyAmount: 0,
    promoterContributionMin: 0,
    defaultTenureYears: 1,
    defaultMoratoriumMonths: 0
  },
  {
    id: 'custom',
    name: 'Custom Parameter Calculation',
    interestRate: 8.5,
    interestSubvention: 0,
    maxSubsidyPercent: 25,
    maxSubsidyAmount: 1000000,
    promoterContributionMin: 10,
    defaultTenureYears: 5,
    defaultMoratoriumMonths: 6
  }
];

export const FinancialCalculator: React.FC = () => {
  const { profile, setActiveTab } = useProfile();

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('pmegp');
  const [projectCost, setProjectCost] = useState<number>(profile.totalProjectCost || 300000);
  const [promoterContributionPercent, setPromoterContributionPercent] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [interestSubvention, setInterestSubvention] = useState<number>(0);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(6);
  const [subsidyRatePercent, setSubsidyRatePercent] = useState<number>(35);

  // Sync with preset when scheme selection changes
  const handleSchemeChange = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    const preset = SCHEME_PRESETS.find(p => p.id === schemeId);
    if (preset) {
      setInterestRate(preset.interestRate);
      setInterestSubvention(preset.interestSubvention);
      setPromoterContributionPercent(preset.promoterContributionMin);
      setTenureYears(preset.defaultTenureYears);
      setMoratoriumMonths(preset.defaultMoratoriumMonths);
      setSubsidyRatePercent(preset.maxSubsidyPercent);
    }
  };

  // Financial Computations
  const ownContributionAmount = Math.round(projectCost * (promoterContributionPercent / 100));
  const rawBankLoan = projectCost - ownContributionAmount;
  
  // Subsidy calculation
  const calculatedSubsidy = Math.round(projectCost * (subsidyRatePercent / 100));
  const preset = SCHEME_PRESETS.find(p => p.id === selectedSchemeId);
  const eligibleSubsidy = preset && preset.maxSubsidyAmount > 0 
    ? Math.min(calculatedSubsidy, preset.maxSubsidyAmount)
    : calculatedSubsidy;

  // Net loan upon which interest is serviced (under capital subsidy back-ended model or principal deduction)
  const netLoanLiability = Math.max(1000, rawBankLoan - eligibleSubsidy);

  // Effective interest rate after subvention
  const effectiveAnnualRate = Math.max(0.01, (interestRate - interestSubvention) / 100);
  const monthlyRate = effectiveAnnualRate / 12;
  const totalMonths = tenureYears * 12;
  const repaymentMonths = Math.max(1, totalMonths - moratoriumMonths);

  // Standard amortized EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyEmi = Math.round(
    (netLoanLiability * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
    (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
  );

  const totalRepaymentAmount = (monthlyEmi * repaymentMonths) + ownContributionAmount;
  const totalInterestPayable = Math.max(0, (monthlyEmi * repaymentMonths) - netLoanLiability);
  const subventionSavings = Math.round((netLoanLiability * (interestSubvention / 100)) * tenureYears);

  // Year-by-year schedule preview
  const generateAmortizationSchedule = () => {
    let balance = netLoanLiability;
    const schedule = [];
    const annualPayment = monthlyEmi * 12;

    for (let yr = 1; yr <= tenureYears; yr++) {
      const interestForYear = Math.round(balance * effectiveAnnualRate);
      const principalForYear = Math.min(balance, annualPayment - interestForYear);
      balance = Math.max(0, balance - principalForYear);

      schedule.push({
        year: yr,
        openingBalance: balance + principalForYear,
        principalPaid: principalForYear,
        interestPaid: interestForYear,
        closingBalance: balance
      });
      if (balance <= 0) break;
    }
    return schedule;
  };

  const schedule = generateAmortizationSchedule();

  return (
    <div className="financial-calculator-container" style={{ padding: '8px 0' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '26px 30px', marginBottom: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 250, height: 250, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald">Scheme-Aware Banking Math</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Scheme-Aware Financial Calculator
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
              Calculates bank appraisal metrics, back-ended capital subsidies, interest subvention concessions, and monthly EMIs calibrated to exact Government scheme guidelines.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('dpr')}
            className="btn-primary"
            style={{
              padding: '10px 18px',
              fontSize: '0.88rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.2)'
            }}
          >
            <FileText size={16} />
            <span>Transfer to Bank DPR</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs Column + Output Column */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1.1fr)', gap: '24px' }}>
        
        {/* Left Column: Form & Sliders */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
          
          {/* Preset Scheme Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Select Concessional Scheme Rules:
            </label>
            <select
              value={selectedSchemeId}
              onChange={(e) => handleSchemeChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.9rem',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)'
              }}
            >
              {SCHEME_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Project Cost Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Total Project Cost
                </label>
                <strong style={{ color: '#4F46E5', fontSize: '0.94rem' }}>
                  ₹{projectCost.toLocaleString('en-IN')}
                </strong>
              </div>
              <input
                type="range"
                min={50000}
                max={5000000}
                step={25000}
                value={projectCost}
                onChange={(e) => setProjectCost(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#4F46E5' }}
              />
            </div>

            {/* Promoter Margin Money % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Promoter Contribution (Margin Money)
                </label>
                <strong style={{ color: '#F59E0B', fontSize: '0.94rem' }}>
                  {promoterContributionPercent}% (₹{ownContributionAmount.toLocaleString('en-IN')})
                </strong>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={promoterContributionPercent}
                onChange={(e) => setPromoterContributionPercent(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F59E0B' }}
              />
            </div>

            {/* Subsidy Rate % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Government Capital Subsidy Rate
                </label>
                <strong style={{ color: '#10B981', fontSize: '0.94rem' }}>
                  {subsidyRatePercent}% (₹{eligibleSubsidy.toLocaleString('en-IN')})
                </strong>
              </div>
              <input
                type="range"
                min={0}
                max={35}
                step={5}
                value={subsidyRatePercent}
                onChange={(e) => setSubsidyRatePercent(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
            </div>

            {/* Grid of Interest Rate, Tenure, Moratorium */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Bank Interest (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.86rem', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Tenure (Years)
                </label>
                <select
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.86rem', borderRadius: '8px' }}
                >
                  <option value={1}>1 Year (12 Mo)</option>
                  <option value={3}>3 Years (36 Mo)</option>
                  <option value={5}>5 Years (60 Mo)</option>
                  <option value={7}>7 Years (84 Mo)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Moratorium (Months)
                </label>
                <select
                  value={moratoriumMonths}
                  onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '0.86rem', borderRadius: '8px' }}
                >
                  <option value={0}>No Grace Period</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                </select>
              </div>
            </div>

            {/* Interest Subvention Notification */}
            {interestSubvention > 0 && (
              <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} style={{ color: '#059669' }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  <strong>{interestSubvention}% Govt Subvention Applied:</strong> Effective interest drops from {interestRate}% to {(interestRate - interestSubvention).toFixed(2)}% p.a.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Financial Results Cards & Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Main Key Metric Card */}
          <div 
            className="glass-panel" 
            style={{ 
              padding: '24px', 
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
              border: '1px solid rgba(79, 70, 229, 0.25)'
            }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Estimated Monthly Repayment
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '6px 0 16px 0' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#4F46E5', letterSpacing: '-0.02em' }}>
                ₹{monthlyEmi.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>/ month</span>
            </div>

            {/* Three-Tier Capital Breakdown Bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
                <span>Capital Distribution</span>
                <span>₹{projectCost.toLocaleString('en-IN')} Total Cost</span>
              </div>
              <div style={{ width: '100%', height: '12px', borderRadius: '6px', display: 'flex', overflow: 'hidden' }}>
                <div 
                  title={`Own Margin: ₹${ownContributionAmount.toLocaleString('en-IN')}`} 
                  style={{ width: `${promoterContributionPercent}%`, background: '#F59E0B' }} 
                />
                <div 
                  title={`Govt Subsidy: ₹${eligibleSubsidy.toLocaleString('en-IN')}`} 
                  style={{ width: `${subsidyRatePercent}%`, background: '#10B981' }} 
                />
                <div 
                  title={`Bank Loan: ₹${netLoanLiability.toLocaleString('en-IN')}`} 
                  style={{ width: `${100 - promoterContributionPercent - subsidyRatePercent}%`, background: '#4F46E5' }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: '#F59E0B' }} />
                  Margin: ₹{ownContributionAmount.toLocaleString('en-IN')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: '#10B981' }} />
                  Subsidy: ₹{eligibleSubsidy.toLocaleString('en-IN')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: '#4F46E5' }} />
                  Bank Loan: ₹{netLoanLiability.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Financial Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Total Interest Payable:</span>
                <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)' }}>₹{totalInterestPayable.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Total Outflow (Principal+Int):</span>
                <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)' }}>₹{totalRepaymentAmount.toLocaleString('en-IN')}</strong>
              </div>
              {subventionSavings > 0 && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.72rem', color: '#059669', display: 'block' }}>Govt. Subvention Savings:</span>
                  <strong style={{ fontSize: '0.94rem', color: '#059669' }}>+₹{subventionSavings.toLocaleString('en-IN')} interest saved</strong>
                </div>
              )}
            </div>
          </div>

          {/* Repayment Schedule Mini Table */}
          <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
              Year-by-Year Amortization Trajectory:
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '4px 6px' }}>Year</th>
                    <th style={{ padding: '4px 6px' }}>Principal</th>
                    <th style={{ padding: '4px 6px' }}>Interest</th>
                    <th style={{ padding: '4px 6px' }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.slice(0, 5).map((row) => (
                    <tr key={row.year} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td style={{ padding: '6px 6px', fontWeight: 600 }}>Yr {row.year}</td>
                      <td style={{ padding: '6px 6px', color: '#4F46E5' }}>₹{row.principalPaid.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '6px 6px', color: 'var(--text-muted)' }}>₹{row.interestPaid.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '6px 6px', fontWeight: 600 }}>₹{row.closingBalance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FinancialCalculator;
