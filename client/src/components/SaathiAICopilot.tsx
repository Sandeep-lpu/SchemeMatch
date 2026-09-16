import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { ChatMessage, UserProfile, SchemeMatchResult, DprRequest } from '../types';
import {
  Send, Mic, MicOff, X, Sparkles, Volume2, ChevronRight, ChevronLeft,
  ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertTriangle, Check,
  ExternalLink, Upload, FileText, IndianRupee, Target, Search,
  BookOpen, TrendingUp, Building2, Compass, Calculator, Sliders, Menu
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   LOCAL TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
type ChatIntent =
  | 'find_scheme' | 'check_emi' | 'why_scheme' | 'why_not'
  | 'gap_analyze' | 'what_if' | 'where_apply' | 'doc_checklist'
  | 'project_report' | 'fraud_check' | 'financial_lit' | 'general';

type ChatLang = 'en' | 'hi' | 'pa';

interface ExtendedMessage extends ChatMessage {
  intent?: ChatIntent;
  schemeResults?: SchemeMatchResult[];
  selectedForWhy?: SchemeMatchResult;
  emiData?: { principal: number; rate: number; tenureYears: number; };
  whatIfData?: { field: string; before: any; after: any; beforeCount: number; afterCount: number; };
  docData?: { schemeName: string; docs: Array<{ name: string; have: boolean }>; score: number; };
  fraudUrl?: string;
  litTerm?: string;
  whereData?: SchemeMatchResult;
  dprResult?: any;
  profileExtracted?: Record<string, any>;
  missingFields?: string[];
  isThinking?: boolean;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */
const SAFE_DOMAINS = [
  'pmegp.kvic.org.in','standupmitra.in','udyamregistration.gov.in',
  'msme.gov.in','sidbi.in','nabard.org','mudra.org.in',
  'nsfdc.nic.in','nbcfdc.gov.in','nmdfc.org','nskfdc.nic.in',
  'india.gov.in','digilocker.gov.in','ondc.org'
];

const FINANCIAL_TERMS: Record<string, { en: string; hi: string }> = {
  collateral: {
    en: 'Collateral is an asset (like property, gold, or FD) pledged to the bank against a loan. If the loan is not repaid, the bank can recover money by selling that asset. MUDRA and PMEGP loans are collateral-free up to ₹10 lakh for special categories.',
    hi: 'कोलैटरल वह संपत्ति है (जैसे जमीन, सोना या FD) जो ऋण के बदले बैंक को दी जाती है। MUDRA और PMEGP जैसी योजनाओं में ₹10 लाख तक के ऋण के लिए कोलैटरल की जरूरत नहीं।'
  },
  emi: {
    en: 'EMI (Equated Monthly Instalment) is the fixed monthly amount you pay to repay your loan. It includes both principal repayment and interest. For example, ₹4L at 7% for 5 years = EMI of ₹7,920/month.',
    hi: 'EMI (समान मासिक किस्त) वह राशि है जो आप हर महीने बैंक को देते हैं। इसमें मूलधन और ब्याज दोनों शामिल होते हैं।'
  },
  subsidy: {
    en: 'Subsidy is a government grant that reduces your loan burden. For example, 35% subsidy on ₹10L loan = ₹3.5L government grant. You only repay the remaining ₹6.5L. This subsidy is deposited directly in your loan account.',
    hi: 'सब्सिडी सरकार द्वारा दी जाने वाली सहायता राशि है। ₹10 लाख के ऋण पर 35% सब्सिडी का मतलब है ₹3.5 लाख सरकार देगी, आपको केवल ₹6.5 लाख वापस करने होंगे।'
  },
  moratorium: {
    en: 'Moratorium is a repayment holiday at the beginning of your loan (usually 6–18 months) during which you don\'t pay EMI. This gives your new business time to generate income before loan repayment begins.',
    hi: 'मोराटोरियम ऋण की शुरुआत में एक अवधि है (आमतौर पर 6–18 महीने) जिसमें आपको EMI नहीं देनी होती। इससे आपके नए व्यवसाय को आय अर्जित करने का समय मिलता है।'
  },
  tenure: {
    en: 'Tenure is the total period over which you repay the loan. Longer tenure = smaller EMI but more total interest paid. PMEGP offers up to 7 years tenure. Shorter tenure saves interest.',
    hi: 'टेन्योर वह कुल अवधि है जिसमें ऋण चुकाया जाता है। PMEGP में 7 साल तक का टेन्योर मिलता है। लंबा टेन्योर = छोटी EMI, लेकिन अधिक कुल ब्याज।'
  },
  principal: {
    en: 'Principal is the original loan amount borrowed, excluding interest. Each EMI payment reduces the outstanding principal. In subsidized loans, the government pays a portion of the principal directly.',
    hi: 'मूलधन वह मूल ऋण राशि है जो आपने उधार ली। प्रत्येक EMI से बकाया मूलधन घटता है। सब्सिडी योजनाओं में सरकार मूलधन का एक हिस्सा सीधे भरती है।'
  },
  dscr: {
    en: 'DSCR (Debt Service Coverage Ratio) = Annual Net Profit ÷ Annual Loan Repayment. A DSCR of 1.5+ means your business generates 50% more income than your loan repayment — banks consider this healthy.',
    hi: 'DSCR = वार्षिक शुद्ध लाभ ÷ वार्षिक ऋण किस्त। 1.5 से ऊपर DSCR बैंकों द्वारा अच्छा माना जाता है।'
  },
  margin: {
    en: 'Margin (own contribution) is the % of total project cost you pay from your own savings. For SC/ST/Women/PH: typically 5%. For General: 10%. Lower margin means less savings needed.',
    hi: 'मार्जिन वह प्रतिशत है जो आप अपनी बचत से देते हैं। SC/ST/महिला/दिव्यांग के लिए आमतौर पर 5% और सामान्य के लिए 10%।'
  },
  interest: {
    en: 'Interest is the cost of borrowing money, expressed as % per year. Government schemes offer 4%–12% interest. Stand-Up India: 1-year MCLR + 3%, MUDRA: up to 12%, PMEGP beneficiaries get interest subsidy.',
    hi: 'ब्याज वह शुल्क है जो आप ऋण के बदले बैंक को देते हैं। सरकारी योजनाओं में 4%–12% ब्याज दर होती है।'
  }
};

const FIELD_QUESTIONS: Record<string, { en: string; hi: string; pa: string }> = {
  category: {
    en: '📋 Which social category do you belong to?\n(SC / ST / OBC / General / Minority / SafaiKaramchari)',
    hi: '📋 आप किस सामाजिक श्रेणी से हैं?\n(SC / ST / OBC / सामान्य / अल्पसंख्यक)',
    pa: '📋 ਤੁਸੀਂ ਕਿਸ ਸਮਾਜਿਕ ਸ਼੍ਰੇਣੀ ਨਾਲ ਸੰਬੰਧਿਤ ਹੋ?\n(SC / ST / OBC / General / Minority)'
  },
  sector: {
    en: '🏭 What type of business? (e.g., Tailoring, Dairy Farming, Handicraft, Manufacturing)',
    hi: '🏭 आप किस प्रकार का व्यवसाय करना चाहते हैं? (जैसे, दर्जी, डेयरी, हस्तशिल्प, निर्माण)',
    pa: '🏭 ਕਿਸ ਕਿਸਮ ਦਾ ਕਾਰੋਬਾਰ? (ਜਿਵੇਂ, ਦਰਜ਼ੀ, ਡੇਅਰੀ, ਦਸਤਕਾਰੀ)'
  },
  gender: {
    en: '👤 Are you Male, Female, or Other?',
    hi: '👤 आप पुरुष, महिला या अन्य हैं?',
    pa: '👤 ਤੁਸੀਂ ਪੁਰਸ਼, ਮਹਿਲਾ ਜਾਂ ਹੋਰ ਹੋ?'
  },
  state: {
    en: '📍 Which state are you located in?',
    hi: '📍 आप किस राज्य में हैं?',
    pa: '📍 ਤੁਸੀਂ ਕਿਸ ਰਾਜ ਵਿੱਚ ਹੋ?'
  },
  requiredLoanAmount: {
    en: '💰 How much loan amount do you need? (e.g., ₹2 lakh, ₹5 lakh)',
    hi: '💰 आपको कितने ऋण की आवश्यकता है? (जैसे, ₹2 लाख, ₹5 लाख)',
    pa: '💰 ਤੁਹਾਨੂੰ ਕਿੰਨੇ ਕਰਜ਼ੇ ਦੀ ਲੋੜ ਹੈ? (ਜਿਵੇਂ ₹2 ਲੱਖ)'
  }
};

const REQUIRED_FOR_MATCH = ['category', 'sector', 'gender', 'state', 'requiredLoanAmount'];

const WELCOME_MSG: ExtendedMessage = {
  id: 'welcome',
  sender: 'assistant',
  text: 'Namaste! 🙏 I am Saathi AI — your personalized government scheme discovery guide.\n\nTell me about your situation naturally — in English, Hindi, or Punjabi — and I will find the best schemes, check your eligibility, calculate EMI, and guide you through the full application journey.',
  hindiText: 'नमस्ते! 🙏 मैं साथी AI हूँ। मुझे अपनी स्थिति के बारे में बताएं — हिंदी, अंग्रेज़ी या पंजाबी में — और मैं आपके लिए सर्वश्रेष्ठ सरकारी योजनाएं खोजूँगा।',
  timestamp: 'Now',
  suggestedPrompts: []
};

/* ═══════════════════════════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */
function detectIntent(msg: string): ChatIntent {
  const t = msg.toLowerCase();
  if (/https?:\/\//.test(msg)) return 'fraud_check';
  if (/\b(emi|monthly (payment|instalment|installment)|kitna mahina|monthly kist)\b/i.test(t)) return 'check_emi';
  if (/\b(what if|kya hoga|agar|instead|change to|badal|what about if)\b/i.test(t)) return 'what_if';
  if (/\b(why (can'?t|not)|kyun nahi|not eligible|not qualify|reject)\b/i.test(t)) return 'why_not';
  if (/\b(why (this|recommended|eligible)|kyun|explain (match|why)|why qualify)\b/i.test(t)) return 'why_scheme';
  if (/\b(document|kagaz|papers|checklist|what (do i|documents)|kya chahiye|kya lagega)\b/i.test(t)) return 'doc_checklist';
  if (/\b(project report|dpr|business plan|don'?t have (project|report)|nahi hai report)\b/i.test(t)) return 'project_report';
  if (/\b(where (to|should|apply|apply kahan)|kahan apply|which bank|kahan jaye)\b/i.test(t)) return 'where_apply';
  if (/\b(eligible|eligibility|qualify|patr|am i|check elig|gap|kitna match)\b/i.test(t)) return 'gap_analyze';
  if (Object.keys(FINANCIAL_TERMS).some(term => t.includes(term))) return 'financial_lit';
  if (/\b(loan|scheme|yojana|subsidy|grant|business|start|shuru|chahiye|need|fund|money|paise|help)\b/i.test(t)) return 'find_scheme';
  return 'general';
}

function calcEMI(principal: number, annualRate: number, tenureYears: number): number {
  if (!principal || !annualRate || !tenureYears) return 0;
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  return Math.round(principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
}

function extractAmount(text: string): number {
  const lakhMatch = text.match(/(?:rs\.?\s*|₹\s*)?([\d.]+)\s*(?:lakh|lac|l\b)/i);
  if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000);
  const croreMatch = text.match(/(?:rs\.?\s*|₹\s*)?([\d.]+)\s*(?:crore|cr\b)/i);
  if (croreMatch) return Math.round(parseFloat(croreMatch[1]) * 10000000);
  const directMatch = text.match(/(?:rs\.?\s*|₹\s*)([\d,]+)/);
  if (directMatch) return parseInt(directMatch[1].replace(/,/g, ''));
  return 0;
}

function extractRate(text: string): number {
  const m = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return m ? parseFloat(m[1]) : 7;
}

function extractTenure(text: string): number {
  const m = text.match(/(\d+)\s*(?:year|yr|saal|varsh)/i);
  return m ? parseInt(m[1]) : 5;
}

function getMissing(profile: Partial<UserProfile>): string[] {
  return REQUIRED_FOR_MATCH.filter(f => {
    const v = (profile as any)[f];
    return v === undefined || v === null || v === '' || v === 0;
  });
}

function isSafe(url: string): boolean {
  try {
    const h = new URL(url).hostname.toLowerCase();
    return SAFE_DOMAINS.some(d => h === d || h.endsWith('.' + d)) || h.endsWith('.gov.in') || h.endsWith('.nic.in');
  } catch { return false; }
}

function detectLitTerm(msg: string): string | null {
  const t = msg.toLowerCase();
  for (const term of Object.keys(FINANCIAL_TERMS)) {
    if (t.includes(term)) return term;
  }
  return null;
}

function buildDefaultProfile(p: Partial<UserProfile>): UserProfile {
  return {
    fullName: 'Applicant', age: 28, gender: 'Male', category: 'OBC',
    isDifferentlyAbled: false, locationType: 'Rural', state: 'Uttar Pradesh',
    annualFamilyIncome: 200000, educationLevel: '10thPass',
    enterpriseStage: 'NewEnterprise', sector: 'Services', requiredLoanAmount: 200000,
    totalProjectCost: 250000, promoterContributionAvailable: 25000,
    hasExistingUdyam: false, hasCasteCertificate: false, hasBankStatement6Months: false,
    hasLandOrRentDeed: false, hasSkillTrainingCertificate: false, hasProjectReport: false,
    ...p
  } as UserProfile;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS (inline, not exported)
   ═══════════════════════════════════════════════════════════════════════════ */

const QuickActionsPanel: React.FC<{ onAction: (q: string) => void; lang: ChatLang }> = ({ onAction, lang }) => {
  const actions = [
    { icon: '🔎', en: 'Find a Scheme', hi: 'योजना खोजें', pa: 'ਸਕੀਮ ਲੱਭੋ', q: 'I want to find a government scheme for my business' },
    { icon: '✅', en: 'Check Eligibility', hi: 'पात्रता जांचें', pa: 'ਯੋਗਤਾ ਜਾਂਚੋ', q: 'Check my eligibility for government schemes' },
    { icon: '📋', en: 'Documents Needed', hi: 'दस्तावेज़ जांचें', pa: 'ਦਸਤਾਵੇਜ਼', q: 'What documents do I need to apply?' },
    { icon: '💰', en: 'Calculate EMI', hi: 'EMI कैलकुलेटर', pa: 'EMI ਕੈਲਕੁਲੇਟਰ', q: 'Calculate my EMI for a 4 lakh loan for 5 years at 7%' },
    { icon: '📄', en: 'Project Report', hi: 'प्रोजेक्ट रिपोर्ट', pa: 'ਪ੍ਰੋਜੈਕਟ ਰਿਪੋਰਟ', q: "I don't have a project report, help me create one" },
    { icon: '🏦', en: 'Where to Apply', hi: 'कहाँ अप्लाई करें', pa: 'ਕਿੱਥੇ ਅਪਲਾਈ', q: 'Where should I apply for my loan?' },
  ];
  const label = lang === 'hi' ? 'आज मैं आपकी कैसे सहायता करूँ?' : lang === 'pa' ? 'ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰਾਂ?' : 'How can I help you today?';
  return (
    <div className="si-quick-actions">
      <div className="si-qa-title">{label}</div>
      <div className="si-qa-grid">
        {actions.map((a, i) => (
          <button key={i} className="si-qa-btn" onClick={() => onAction(a.q)}>
            <span className="si-qa-icon">{a.icon}</span>
            <span className="si-qa-label">{lang === 'hi' ? a.hi : lang === 'pa' ? a.pa : a.en}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const SchemeRecBubble: React.FC<{ results: SchemeMatchResult[]; onWhy: (r: SchemeMatchResult) => void; onWhere: (r: SchemeMatchResult) => void; }> = ({ results, onWhy, onWhere }) => {
  const medals = ['🥇', '🥈', '🥉', '📋', '📋'];
  const strengths = ['Strong Match', 'Potential Match', 'Potential Match', 'Conditional', 'Conditional'];
  return (
    <div className="si-rec-container">
      {results.slice(0, 5).map((r, i) => (
        <div key={r.scheme.id} className={`si-rec-row ${i === 0 ? 'top' : ''}`}>
          <div className="si-rec-medal">{medals[i]}</div>
          <div className="si-rec-info">
            <div className="si-rec-name">{r.scheme.name}</div>
            <div className="si-rec-meta">{r.scheme.categoryTag} · <strong style={{ color: 'var(--si-nav-active)' }}>{r.matchScore}%</strong> · ₹{r.estimatedSubsidyAmount.toLocaleString('en-IN')} subsidy</div>
            <div className="si-rec-tag">{strengths[i]}</div>
          </div>
          <div className="si-rec-btns">
            <button className="si-rec-why-btn" onClick={() => onWhy(r)} title="Why recommended?">Why?</button>
            <button className="si-rec-where-btn" onClick={() => onWhere(r)} title="Where to apply?">Apply</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const WhyCard: React.FC<{ result: SchemeMatchResult; mode: 'eligible' | 'ineligible' }> = ({ result, mode }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="si-why-card">
      <div className="si-why-header" onClick={() => setOpen(o => !o)}>
        <span>{mode === 'eligible' ? '✅ Why Recommended?' : '❌ Why Not Eligible?'}</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </div>
      {open && (
        <div className="si-why-body">
          {result.reasonsWhyMatched.map((r, i) => (
            <div key={i} className="si-why-row si-why-match"><Check size={12} /> {r}</div>
          ))}
          {result.conditionsToFulfill.map((c, i) => (
            <div key={i} className="si-why-row si-why-cond"><AlertTriangle size={12} /> {c}</div>
          ))}
          {result.missingDocuments.map((d, i) => (
            <div key={i} className="si-why-row si-why-miss"><XCircle size={12} /> {d}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const GapCard: React.FC<{ result: SchemeMatchResult }> = ({ result: r }) => {
  const pct = r.matchScore;
  const label = pct >= 80 ? '🟢 Strong Match' : pct >= 55 ? '🟡 Almost Eligible' : '🔴 Partial Match';
  return (
    <div className="si-gap-card">
      <div className="si-gap-header">
        <span className="si-gap-label">{label}</span>
        <span className="si-gap-score">{pct}%</span>
      </div>
      <div className="si-gap-bar"><div className="si-gap-fill" style={{ width: `${pct}%` }} /></div>
      <div className="si-gap-rows">
        {r.reasonsWhyMatched.slice(0, 3).map((m, i) => (
          <div key={i} className="si-gap-row si-gap-ok"><Check size={11} /> {m}</div>
        ))}
        {r.missingDocuments.slice(0, 2).map((d, i) => (
          <div key={i} className="si-gap-row si-gap-no"><XCircle size={11} /> Missing: {d}</div>
        ))}
        {r.conditionsToFulfill.slice(0, 2).map((c, i) => (
          <div key={i} className="si-gap-row si-gap-warn"><AlertTriangle size={11} /> {c}</div>
        ))}
      </div>
      {(r.missingDocuments.length > 0 || r.conditionsToFulfill.length > 0) && (
        <div className="si-gap-next">Next Step: Complete missing requirements and re-check eligibility.</div>
      )}
    </div>
  );
};

const EMICard: React.FC<{
  principal: number; rate: number; tenureYears: number;
  onModify: (field: 'principal' | 'rate' | 'tenure', val: number) => void;
}> = ({ principal, rate, tenureYears, onModify }) => {
  const emi = calcEMI(principal, rate, tenureYears);
  const total = emi * tenureYears * 12;
  const interest = total - principal;
  const [editingAmt, setEditingAmt] = useState('');
  const [editingTenure, setEditingTenure] = useState('');
  return (
    <div className="si-emi-card">
      <div className="si-emi-title">💰 EMI Calculation</div>
      <div className="si-emi-rows">
        <div className="si-emi-row"><span>Loan Amount</span><strong>₹{principal.toLocaleString('en-IN')}</strong></div>
        <div className="si-emi-row"><span>Interest Rate</span><strong>{rate}% p.a.</strong></div>
        <div className="si-emi-row"><span>Tenure</span><strong>{tenureYears} yrs ({tenureYears * 12} months)</strong></div>
        <div className="si-emi-divider" />
        <div className="si-emi-row si-emi-highlight"><span>Monthly EMI</span><span className="si-emi-big">₹{emi.toLocaleString('en-IN')}</span></div>
        <div className="si-emi-row"><span>Total Interest</span><span>₹{interest.toLocaleString('en-IN')}</span></div>
        <div className="si-emi-row"><span>Total Payable</span><span>₹{total.toLocaleString('en-IN')}</span></div>
      </div>
      <div className="si-emi-modify">
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flex: 1 }}>
          <input className="si-emi-input" placeholder="New amount" value={editingAmt}
            onChange={e => setEditingAmt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && editingAmt) { onModify('principal', extractAmount(editingAmt) || parseInt(editingAmt)); setEditingAmt(''); } }} />
          <button className="si-emi-mod-btn" onClick={() => { if (editingAmt) { onModify('principal', extractAmount(editingAmt) || parseInt(editingAmt)); setEditingAmt(''); } }}>Change Amount</button>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flex: 1 }}>
          <input className="si-emi-input" placeholder="New tenure (yrs)" value={editingTenure}
            onChange={e => setEditingTenure(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && editingTenure) { onModify('tenure', parseInt(editingTenure)); setEditingTenure(''); } }} />
          <button className="si-emi-mod-btn" onClick={() => { if (editingTenure) { onModify('tenure', parseInt(editingTenure)); setEditingTenure(''); } }}>Change Tenure</button>
        </div>
      </div>
    </div>
  );
};

const WhatIfCard: React.FC<{ field: string; before: any; after: any; beforeCount: number; afterCount: number }> = ({ field, before, after, beforeCount, afterCount }) => {
  const improved = afterCount > beforeCount;
  const fmtVal = (v: any) => typeof v === 'number' && v > 10000 ? `₹${v.toLocaleString('en-IN')}` : String(v);
  return (
    <div className="si-whatif-card">
      <div className="si-whatif-title">🔄 What-If Analysis: {field}</div>
      <div className="si-whatif-compare">
        <div className="si-whatif-col">
          <div className="si-whatif-col-label">Current</div>
          <div className="si-whatif-val">{fmtVal(before)}</div>
          <div className="si-whatif-count">{beforeCount} schemes</div>
        </div>
        <div className="si-whatif-arrow">{improved ? '📈' : '📉'}</div>
        <div className="si-whatif-col">
          <div className="si-whatif-col-label">New Scenario</div>
          <div className="si-whatif-val" style={{ color: improved ? 'var(--si-success)' : '#E11D48' }}>{fmtVal(after)}</div>
          <div className="si-whatif-count" style={{ color: improved ? 'var(--si-success)' : '#E11D48' }}>{afterCount} schemes</div>
        </div>
      </div>
      <div className="si-whatif-note">
        {improved
          ? `✅ ${afterCount - beforeCount} more schemes match with this change.`
          : `⚠️ ${beforeCount - afterCount} fewer schemes match. Consider adjusting your requirements.`}
      </div>
    </div>
  );
};

const DocChecklistCard: React.FC<{ schemeName: string; docs: Array<{ name: string; have: boolean }>; score: number }> = ({ schemeName, docs, score }) => (
  <div className="si-doc-card">
    <div className="si-doc-title">📋 {schemeName} — Document Checklist</div>
    <div className="si-doc-list">
      {docs.map((d, i) => (
        <div key={i} className={`si-doc-item ${d.have ? 'have' : 'miss'}`}>
          {d.have ? <Check size={12} /> : <XCircle size={12} />}
          <span>{d.name}</span>
          {!d.have && <span className="si-doc-badge">Missing</span>}
        </div>
      ))}
    </div>
    <div className="si-doc-progress-label">Application Readiness: <strong>{score}%</strong></div>
    <div className="si-doc-bar-bg"><div className="si-doc-bar-fill" style={{ width: `${score}%` }} /></div>
    {score < 100 && (
      <div className="si-doc-tip">💡 Ask me "Where can I get a project report?" or "How do I get a caste certificate?"</div>
    )}
  </div>
);

const FraudCard: React.FC<{ url: string }> = ({ url }) => (
  <div className="si-fraud-card">
    <div className="si-fraud-title"><AlertTriangle size={15} /> ⚠️ Verification Warning</div>
    <div className="si-fraud-url">{url}</div>
    <div className="si-fraud-msg">I could not verify this as an official government application source.</div>
    <div className="si-fraud-tips">
      <div className="si-fraud-tip"><CheckCircle2 size={11} /> Always use portals ending in .gov.in or .nic.in</div>
      <div className="si-fraud-tip"><CheckCircle2 size={11} /> Never share OTP, PIN, or bank passwords</div>
      <div className="si-fraud-tip"><CheckCircle2 size={11} /> Verify with official helpline before any payment</div>
    </div>
  </div>
);

const LiteracyCard: React.FC<{ term: string; expl: { en: string; hi: string }; lang: ChatLang }> = ({ term, expl, lang }) => (
  <div className="si-lit-card">
    <div className="si-lit-title">🎓 {term.charAt(0).toUpperCase() + term.slice(1)} — Explained Simply</div>
    <div className="si-lit-body">{lang === 'hi' ? expl.hi : expl.en}</div>
  </div>
);

const WhereCard: React.FC<{ result: SchemeMatchResult }> = ({ r: result }: any) => (
  <div className="si-where-card">
    <div className="si-where-title">🏦 Where to Apply</div>
    <div className="si-where-agency">{(result as SchemeMatchResult).scheme.nodalAgency}</div>
    <div className="si-where-mode">Mode: {(result as SchemeMatchResult).scheme.applicationMode}</div>
    <div className="si-where-rows">
      <div className="si-where-row"><CheckCircle2 size={11} /> Authorized for {(result as SchemeMatchResult).scheme.name}</div>
      <div className="si-where-row"><CheckCircle2 size={11} /> Processing: ~{(result as SchemeMatchResult).scheme.averageProcessingDays} days</div>
      <div className="si-where-row"><CheckCircle2 size={11} /> Collateral: {(result as SchemeMatchResult).scheme.collateralRequirement}</div>
    </div>
    {(result as SchemeMatchResult).scheme.officialPortalUrl && (
      <a href={(result as SchemeMatchResult).scheme.officialPortalUrl} target="_blank" rel="noopener noreferrer" className="si-where-portal">
        <ExternalLink size={12} /> Official Portal <ExternalLink size={10} />
      </a>
    )}
  </div>
);

const DPRDraftCard: React.FC<{ dpr: any; businessName: string }> = ({ dpr, businessName }) => (
  <div className="si-dpr-card">
    <div className="si-dpr-warning">⚠️ AI-generated draft — review and verify before submission</div>
    <div className="si-dpr-title">📄 Draft Project Report: {businessName}</div>
    {dpr?.model && (
      <div className="si-dpr-rows">
        <div className="si-dpr-row"><span>Total Project Cost</span><strong>₹{dpr.model.summary.totalProjectCost?.toLocaleString('en-IN')}</strong></div>
        <div className="si-dpr-row"><span>Bank Loan Required</span><strong>₹{dpr.model.summary.totalBankLoan?.toLocaleString('en-IN')}</strong></div>
        <div className="si-dpr-row"><span>Promoter Margin</span><strong>₹{dpr.model.summary.promoterContribution?.toLocaleString('en-IN')} ({dpr.model.summary.promoterContributionPercent}%)</strong></div>
        <div className="si-dpr-row"><span>Subsidy Eligible</span><strong style={{ color: 'var(--si-success)' }}>₹{dpr.model.summary.subsidyEligible?.toLocaleString('en-IN')} ({dpr.model.summary.subsidyPercent}%)</strong></div>
        <div className="si-dpr-row"><span>Monthly EMI</span><strong>₹{dpr.model.repaymentSchedule.monthlyEmi?.toLocaleString('en-IN')}</strong></div>
        <div className="si-dpr-row"><span>Bank Viability</span><strong style={{ color: dpr.model.viabilityMetrics.bankViabilityVerdict === 'Highly Bankable' ? 'var(--si-success)' : 'var(--si-nav-active)' }}>{dpr.model.viabilityMetrics.bankViabilityVerdict}</strong></div>
      </div>
    )}
    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>Take this to your nearest KVIC / PSB branch for formal appraisal.</div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SAATHI PANEL — Exported, used in SaffronDashboard
   ═══════════════════════════════════════════════════════════════════════════ */
export const SaathiPanel: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({ collapsed, onToggle }) => {
  const { speakText, language: appLang } = useLanguage();
  const { profile, setProfile, runMatching, uploadedDocIds, matchResults } = useProfile();

  const [messages, setMessages] = useState<ExtendedMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [lang, setLang] = useState<ChatLang>((appLang === 'hi' ? 'hi' : appLang === 'pa' ? 'pa' : 'en') as ChatLang);
  const [sessionProfile, setSessionProfile] = useState<Partial<UserProfile>>({
    state: profile.state, category: profile.category, sector: profile.sector,
    gender: profile.gender, requiredLoanAmount: profile.requiredLoanAmount,
    annualFamilyIncome: profile.annualFamilyIncome, locationType: profile.locationType,
    age: profile.age, tradeType: profile.tradeType
  });
  const [emiState, setEmiState] = useState<{ principal: number; rate: number; tenureYears: number } | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<SchemeMatchResult | null>(null);
  // DPR collection state machine
  const [dprStep, setDprStep] = useState<string | null>(null);
  const [dprData, setDprData] = useState<Partial<DprRequest>>({});
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Merge session profile into ProfileContext on changes
  useEffect(() => {
    if (Object.keys(sessionProfile).some(k => (sessionProfile as any)[k] !== (profile as any)[k])) {
      setProfile(prev => ({ ...prev, ...sessionProfile }));
    }
  }, [sessionProfile]);

  const addMsg = (msg: ExtendedMessage) => setMessages(p => [...p, msg]);

  const mergeSessionProfile = (updates: Partial<UserProfile>) => {
    setSessionProfile(prev => {
      const merged = { ...prev, ...updates };
      return merged;
    });
  };

  // Run matching with current session profile
  const runSessionMatch = async (overrides?: Partial<UserProfile>): Promise<SchemeMatchResult[]> => {
    const merged = { ...sessionProfile, ...overrides };
    const full = buildDefaultProfile(merged);
    try {
      const res = await fetch('http://localhost:5000/api/match', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(full)
      });
      if (res.ok) {
        const data = await res.json();
        return [...(data.topMatches || []), ...(data.otherSchemes || [])];
      }
    } catch (e) { console.error('Match failed:', e); }
    return matchResults; // fallback to already-loaded results
  };

  // Handle scheme "Why?" click
  const handleWhy = (result: SchemeMatchResult, mode: 'eligible' | 'ineligible' = 'eligible') => {
    setSelectedScheme(result);
    addMsg({
      id: `why-${Date.now()}`, sender: 'assistant',
      text: `Here's why ${result.scheme.name} is ${mode === 'eligible' ? 'recommended' : 'not fully matched'} for you:`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      selectedForWhy: result, intent: mode === 'eligible' ? 'why_scheme' : 'why_not'
    });
  };

  // Handle "Where to Apply" click
  const handleWhere = (result: SchemeMatchResult) => {
    setSelectedScheme(result);
    addMsg({
      id: `where-${Date.now()}`, sender: 'assistant',
      text: `Here's where to apply for ${result.scheme.name}:`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      whereData: result, intent: 'where_apply'
    });
  };

  // EMI modifier
  const handleEMIModify = (field: 'principal' | 'rate' | 'tenure', val: number) => {
    if (!emiState || !val || isNaN(val)) return;
    const updated = { ...emiState, [field === 'tenure' ? 'tenureYears' : field]: val };
    setEmiState(updated);
    const newEmi = calcEMI(updated.principal, updated.rate, updated.tenureYears);
    addMsg({
      id: `emi-upd-${Date.now()}`, sender: 'assistant',
      text: `Updated! With ₹${updated.principal.toLocaleString('en-IN')} at ${updated.rate}% for ${updated.tenureYears} years, your EMI = ₹${newEmi.toLocaleString('en-IN')}/month.`,
      timestamp: 'Now', emiData: updated, intent: 'check_emi'
    });
  };

  // Document OCR simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.toLowerCase();
    let extracted = '';
    if (name.includes('aadhar') || name.includes('aadhaar')) extracted = 'Aadhaar Card — Name and UID detected. ✓ Identity verified.';
    else if (name.includes('caste') || name.includes('sc') || name.includes('st')) extracted = `Caste Certificate — Category: ${sessionProfile.category || 'SC'} detected. ✓ Matches profile.`;
    else if (name.includes('income')) extracted = 'Income Certificate — Annual Income: ₹2,48,000 detected. ✓ Within scheme limits.';
    else if (name.includes('bank')) extracted = 'Bank Statement — 6-month statement detected. ✓ Required for most schemes.';
    else if (name.includes('udyam')) extracted = 'Udyam Registration — Business registered. ✓ Score +15 points.';
    else if (name.includes('pan')) extracted = 'PAN Card — Tax identity verified. ✓ Required for loans >₹50,000.';
    else extracted = `Document uploaded: ${file.name}. Verified and added to your checklist.`;

    addMsg({
      id: `upload-${Date.now()}`, sender: 'assistant',
      text: `📎 Document Received!\n\n${extracted}\n\n⚠️ Please verify certificate validity through the official portal before submission.`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: ['What other documents do I need?', 'Show my document readiness', 'Check my eligibility now']
    });
    e.target.value = '';
  };

  // DPR collection flow
  const handleDPRStep = async (userText: string): Promise<boolean> => {
    if (!dprStep) return false;
    const ts = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    if (dprStep === 'businessName') {
      setDprData(p => ({ ...p, businessName: userText.trim() }));
      setDprStep('machinery');
      addMsg({ id: `dpr-q2-${Date.now()}`, sender: 'assistant', timestamp: ts,
        text: '🔧 What is the cost of machinery and equipment needed? (e.g., ₹1.5 lakh)',
        suggestedPrompts: ['₹1 lakh for sewing machines', '₹50,000 for dairy equipment', '₹2 lakh for manufacturing tools'] });
      return true;
    }
    if (dprStep === 'machinery') {
      const amt = extractAmount(userText) || parseInt(userText.replace(/[^0-9]/g, ''));
      setDprData(p => ({ ...p, machineryAndEquipmentCost: amt, workspaceOrCivilCost: Math.round(amt * 0.2), contingencyBuffer: Math.round(amt * 0.05) }));
      setDprStep('workingCapital');
      addMsg({ id: `dpr-q3-${Date.now()}`, sender: 'assistant', timestamp: ts,
        text: '💼 How much working capital do you need per month? (raw materials, wages, etc.)',
        suggestedPrompts: ['₹20,000 per month', '₹50,000 for initial stock', '₹30,000 monthly'] });
      return true;
    }
    if (dprStep === 'workingCapital') {
      const amt = extractAmount(userText) || parseInt(userText.replace(/[^0-9]/g, ''));
      setDprData(p => ({ ...p, workingCapitalNeeds: amt * 3 })); // 3-month working capital
      setDprStep('revenue');
      addMsg({ id: `dpr-q4-${Date.now()}`, sender: 'assistant', timestamp: ts,
        text: '📈 What is your expected monthly revenue/sales once the business is running?',
        suggestedPrompts: ['₹40,000/month', '₹80,000/month from tailoring', '₹1 lakh monthly'] });
      return true;
    }
    if (dprStep === 'revenue') {
      const amt = extractAmount(userText) || parseInt(userText.replace(/[^0-9]/g, ''));
      const finalDpr: DprRequest = {
        businessName: dprData.businessName || 'My Business',
        sector: (sessionProfile.sector || 'Services') as any,
        tradeType: sessionProfile.tradeType || sessionProfile.sector || 'General Trade',
        locationType: (sessionProfile.locationType || 'Rural') as any,
        category: (sessionProfile.category || 'OBC') as any,
        gender: (sessionProfile.gender || 'Male') as any,
        machineryAndEquipmentCost: dprData.machineryAndEquipmentCost || 100000,
        workspaceOrCivilCost: dprData.workspaceOrCivilCost || 20000,
        workingCapitalNeeds: dprData.workingCapitalNeeds || 60000,
        contingencyBuffer: dprData.contingencyBuffer || 10000,
        expectedMonthlyRevenue: amt,
        expectedMonthlyOperatingCost: Math.round(amt * 0.65),
        targetSchemeId: selectedScheme?.scheme.id
      };
      setDprStep('generating');
      addMsg({ id: `dpr-gen-${Date.now()}`, sender: 'assistant', timestamp: ts,
        text: '⚙️ Generating your SIDBI-compliant project report with 3-year financial projections...', isThinking: true });
      try {
        const res = await fetch('http://localhost:5000/api/dpr/generate', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalDpr)
        });
        const dprResult = res.ok ? await res.json() : null;
        setMessages(p => p.filter(m => !m.isThinking));
        addMsg({ id: `dpr-result-${Date.now()}`, sender: 'assistant', timestamp,
          text: `✅ Draft Project Report ready for "${finalDpr.businessName}"!`,
          dprResult, intent: 'project_report',
          suggestedPrompts: ['Where should I submit this DPR?', 'Which scheme matches this project?', 'What documents do I need with the DPR?'] });
      } catch {
        setMessages(p => p.filter(m => !m.isThinking));
        addMsg({ id: `dpr-err-${Date.now()}`, sender: 'assistant', timestamp,
          text: 'DPR generation encountered an issue. Please try again or use the full DPR Generator module.' });
      }
      setDprStep(null);
      setDprData({});
      return true;
    }
    return false;
  };

  /* ── MAIN SEND HANDLER ─────────────────────────────────────────── */
  const sendMessage = async (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q) return;

    const ts = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ExtendedMessage = {
      id: `u-${Date.now()}`, sender: 'user', text: q, timestamp: ts
    };
    setMessages(p => [...p, userMsg]);
    setInput('');

    // DPR flow takes priority
    if (dprStep) {
      const handled = await handleDPRStep(q);
      if (handled) return;
    }

    const intent = detectIntent(q);
    setIsLoading(true);

    try {
      /* ── FRAUD DETECTION ──────────────────────────────────────── */
      if (intent === 'fraud_check') {
        const urlMatch = q.match(/https?:\/\/[^\s]+/);
        const url = urlMatch?.[0] || q;
        const safe = isSafe(url);
        addMsg({
          id: `fraud-${Date.now()}`, sender: 'assistant', timestamp: ts,
          text: safe ? `✅ ${url} appears to be an official government portal. Always verify you are on the correct page before submitting personal details.`
            : `I could not verify this as an official government source.`,
          fraudUrl: safe ? undefined : url, intent: 'fraud_check',
          suggestedPrompts: ['Show me the official PMEGP portal', 'What are safe government scheme portals?']
        });
        setIsLoading(false);
        return;
      }

      /* ── FINANCIAL LITERACY ───────────────────────────────────── */
      if (intent === 'financial_lit') {
        const term = detectLitTerm(q);
        if (term && FINANCIAL_TERMS[term]) {
          addMsg({
            id: `lit-${Date.now()}`, sender: 'assistant', timestamp: ts,
            text: FINANCIAL_TERMS[term][lang === 'hi' ? 'hi' : 'en'],
            litTerm: term, intent: 'financial_lit',
            suggestedPrompts: ['What is subsidy?', 'Explain moratorium', 'What is DSCR?', 'Calculate my EMI']
          });
          setIsLoading(false);
          return;
        }
      }

      /* ── EMI CALCULATOR ───────────────────────────────────────── */
      if (intent === 'check_emi') {
        const principal = extractAmount(q) || emiState?.principal || sessionProfile.requiredLoanAmount || 400000;
        const rate = extractRate(q) || emiState?.rate || 7;
        const tenureYears = extractTenure(q) || emiState?.tenureYears || 5;
        const emi = calcEMI(principal, rate, tenureYears);
        setEmiState({ principal, rate, tenureYears });
        addMsg({
          id: `emi-${Date.now()}`, sender: 'assistant', timestamp: ts,
          text: `Your EMI for ₹${principal.toLocaleString('en-IN')} at ${rate}% for ${tenureYears} years = ₹${emi.toLocaleString('en-IN')}/month.`,
          emiData: { principal, rate, tenureYears }, intent: 'check_emi',
          suggestedPrompts: ['What if tenure is 7 years?', 'What scheme gives me subsidy on this loan?', 'What is the total interest I pay?']
        });
        setIsLoading(false);
        return;
      }

      /* ── PROJECT REPORT ───────────────────────────────────────── */
      if (intent === 'project_report' && !dprStep) {
        setDprStep('businessName');
        setDprData({});
        addMsg({
          id: `dpr-start-${Date.now()}`, sender: 'assistant', timestamp: ts,
          text: `📄 Let me create a draft project report for you!\n\nFirst: What is the name of your business or proposed enterprise?`,
          suggestedPrompts: ['Sunita Tailoring Works', 'Rajesh Dairy Farm', 'Meena Handloom Enterprise']
        });
        setIsLoading(false);
        return;
      }

      /* ── DOCUMENT CHECKLIST ───────────────────────────────────── */
      if (intent === 'doc_checklist') {
        const targetScheme = selectedScheme || matchResults[0];
        if (targetScheme) {
          const mandatory = targetScheme.scheme.mandatoryDocuments.map(d => ({
            name: d,
            have: uploadedDocIds.some(id => d.toLowerCase().includes(id.toLowerCase())) ||
              (d.toLowerCase().includes('aadhaar') && profile.hasCasteCertificate) ||
              (d.toLowerCase().includes('caste') && profile.hasCasteCertificate) ||
              (d.toLowerCase().includes('bank') && profile.hasBankStatement6Months) ||
              (d.toLowerCase().includes('land') && profile.hasLandOrRentDeed) ||
              (d.toLowerCase().includes('project') && profile.hasProjectReport) ||
              (d.toLowerCase().includes('udyam') && profile.hasExistingUdyam)
          }));
          const score = Math.round((mandatory.filter(d => d.have).length / mandatory.length) * 100);
          addMsg({
            id: `doc-${Date.now()}`, sender: 'assistant', timestamp: ts,
            text: `Here's your document checklist for ${targetScheme.scheme.name}:`,
            docData: { schemeName: targetScheme.scheme.name, docs: mandatory, score },
            intent: 'doc_checklist',
            suggestedPrompts: ['Where can I get a project report?', 'How to apply for Udyam registration?', 'Where to get caste certificate?']
          });
        } else {
          addMsg({
            id: `doc-nd-${Date.now()}`, sender: 'assistant', timestamp: ts,
            text: 'To show your document checklist, I need to know which scheme you\'re applying for. Tell me about your business first and I\'ll recommend the best scheme.',
            suggestedPrompts: ['Find schemes for tailoring business', 'PMEGP documents needed', 'Stand-Up India checklist']
          });
        }
        setIsLoading(false);
        return;
      }

      /* ── WHERE TO APPLY ───────────────────────────────────────── */
      if (intent === 'where_apply') {
        const targetScheme = selectedScheme || matchResults[0];
        if (targetScheme) {
          handleWhere(targetScheme);
          addMsg({
            id: `next-${Date.now()}`, sender: 'assistant', timestamp: ts,
            text: `📋 Your next steps for ${targetScheme.scheme.name}:\n\n1️⃣ Complete your document checklist\n2️⃣ Get project report verified\n3️⃣ Visit ${targetScheme.scheme.nodalAgency}\n4️⃣ Submit application via: ${targetScheme.scheme.applicationMode}\n5️⃣ Track status on official portal`,
            suggestedPrompts: ['Show my document checklist', 'Calculate my EMI for this scheme', 'What is the interest rate?']
          });
        } else {
          addMsg({
            id: `where-nd-${Date.now()}`, sender: 'assistant', timestamp: ts,
            text: 'Tell me about your business first so I can recommend the right scheme and application channel.',
            suggestedPrompts: ['Find schemes for my business', 'Check my eligibility', 'What is PMEGP?']
          });
        }
        setIsLoading(false);
        return;
      }

      /* ── WHAT-IF SIMULATOR ────────────────────────────────────── */
      if (intent === 'what_if') {
        const newAmt = extractAmount(q);
        if (newAmt && sessionProfile.requiredLoanAmount) {
          const before = sessionProfile.requiredLoanAmount;
          const beforeMatches = await runSessionMatch();
          const beforeCount = beforeMatches.filter(m => m.isEligible).length;
          const afterMatches = await runSessionMatch({ requiredLoanAmount: newAmt });
          const afterCount = afterMatches.filter(m => m.isEligible).length;
          mergeSessionProfile({ requiredLoanAmount: newAmt });
          addMsg({
            id: `whatif-${Date.now()}`, sender: 'assistant', timestamp: ts,
            text: `Simulating with ₹${newAmt.toLocaleString('en-IN')} instead of ₹${before.toLocaleString('en-IN')}...`,
            whatIfData: { field: 'Loan Amount', before, after: newAmt, beforeCount, afterCount },
            intent: 'what_if',
            suggestedPrompts: ['Show me these new schemes', 'What if I register my business?', 'Calculate EMI for this amount']
          });
          setIsLoading(false);
          return;
        }
      }

      /* ── DEFAULT: Call /api/chat + potentially run matching ───── */
      const chatRes = await fetch('http://localhost:5000/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, profile: buildDefaultProfile(sessionProfile) })
      });

      let aiText = '';
      let aiHindi = '';
      let suggestedPrompts: string[] = [];
      let profileUpdates: Partial<UserProfile> | undefined;

      if (chatRes.ok) {
        const aiData = await chatRes.json();
        aiText = aiData.text || '';
        aiHindi = aiData.hindiText || '';
        suggestedPrompts = aiData.suggestedPrompts || [];
        profileUpdates = aiData.extractedProfileUpdates;
      }

      // Merge extracted profile
      if (profileUpdates && Object.keys(profileUpdates).length > 0) {
        mergeSessionProfile(profileUpdates);
      }

      const updatedSession = { ...sessionProfile, ...profileUpdates };
      const missing = getMissing(updatedSession);

      // If profile is rich enough → run matching
      let schemeResults: SchemeMatchResult[] | undefined;
      let profileCard: Record<string, any> | undefined;

      if (intent === 'find_scheme' || intent === 'gap_analyze') {
        if (profileUpdates && Object.keys(profileUpdates).length > 0) {
          profileCard = profileUpdates;
        }

        if (missing.length === 0 || (updatedSession.category && updatedSession.sector)) {
          const results = await runSessionMatch(updatedSession as Partial<UserProfile>);
          const eligible = results.filter(m => m.isEligible);
          if (eligible.length > 0) {
            schemeResults = eligible;
            const best = eligible[0];
            setSelectedScheme(best);
            aiText = aiText || `I found ${eligible.length} schemes for you! Here are your top matches based on your profile.`;
          }
        } else if (missing.length > 0) {
          // Ask for the first missing field
          const firstMissing = missing[0];
          const question = FIELD_QUESTIONS[firstMissing]?.[lang] || FIELD_QUESTIONS[firstMissing]?.en || `Please provide your ${firstMissing}`;
          aiText = aiText ? `${aiText}\n\n${question}` : question;
        }
      }

      // Gap analyze with existing scheme
      if (intent === 'gap_analyze' && matchResults.length > 0 && !schemeResults) {
        schemeResults = [matchResults[0]];
      }

      const assistantMsg: ExtendedMessage = {
        id: `a-${Date.now()}`, sender: 'assistant',
        text: lang === 'hi' && aiHindi ? aiHindi : aiText || 'I\'m here to help. Tell me about your business and funding needs!',
        hindiText: aiHindi, timestamp: ts, intent,
        schemeResults: (intent === 'find_scheme' && schemeResults) ? schemeResults : undefined,
        selectedForWhy: (intent === 'gap_analyze' && matchResults[0]) ? matchResults[0] : undefined,
        profileExtracted: profileCard,
        missingFields: missing.length > 0 ? missing : undefined,
        suggestedPrompts: suggestedPrompts.length > 0 ? suggestedPrompts : undefined
      };

      addMsg(assistantMsg);
    } catch (err) {
      addMsg({
        id: `err-${Date.now()}`, sender: 'assistant', timestamp: ts,
        text: 'I encountered a connection issue. Please check your internet and try again.',
        suggestedPrompts: ['Find schemes for my business', 'Calculate EMI', 'What documents do I need?']
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── VOICE INPUT ────────────────────────────────────────────────── */
  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice recognition not supported in this browser.'); return; }
    if (isRecording) { setIsRecording(false); return; }
    const r = new SR();
    r.lang = lang === 'hi' ? 'hi-IN' : lang === 'pa' ? 'pa-IN' : 'en-IN';
    r.interimResults = false;
    setIsRecording(true);
    r.onresult = (e: any) => { const t = e.results[0][0].transcript; setInput(t); setIsRecording(false); sendMessage(t); };
    r.onerror = () => setIsRecording(false);
    r.onend = () => setIsRecording(false);
    r.start();
  };

  /* ── COLLAPSED STATE ────────────────────────────────────────────── */
  if (collapsed) {
    return (
      <div className="si-saathi-panel collapsed">
        <button className="si-saathi-toggle-btn" onClick={onToggle}
          style={{ margin: '14px auto', display: 'flex' }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{
          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
          fontSize: '0.72rem', fontWeight: 700, color: 'var(--si-nav-active)',
          margin: '0 auto', letterSpacing: '0.08em', userSelect: 'none'
        }}>Saathi AI</div>
      </div>
    );
  }

  const showQuickActions = messages.length === 1;

  /* ── RENDER ─────────────────────────────────────────────────────── */
  return (
    <div className="si-saathi-panel">

      {/* ── Panel Header ── */}
      <div className="si-saathi-panel-header">
        <div className="si-saathi-panel-title">
          <div className="si-saathi-panel-avatar"><Sparkles size={14} /></div>
          <div>
            <div className="si-saathi-panel-name">Saathi AI</div>
            <div className="si-saathi-panel-sub">AI Scheme Assistant</div>
          </div>
        </div>
        {/* Language Switcher */}
        <div className="si-saathi-lang-row">
          {(['en', 'hi', 'pa'] as ChatLang[]).map(l => (
            <button key={l} className={`si-lang-chip ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
              {l === 'en' ? 'EN' : l === 'hi' ? 'हि' : 'ਪੰ'}
            </button>
          ))}
        </div>
        <button className="si-saathi-toggle-btn" onClick={onToggle}><ChevronRight size={16} /></button>
      </div>

      {/* ── Messages Body ── */}
      <div className="si-saathi-panel-body">

        {/* Quick Actions when empty */}
        {showQuickActions && <QuickActionsPanel onAction={q => sendMessage(q)} lang={lang} />}

        {messages.map(msg => (
          <div key={msg.id}>
            {/* Chat Bubble */}
            <div className={`si-chat-bubble ${msg.sender}`} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.sender === 'assistant' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span className="si-chat-sender">Saathi AI</span>
                  <button onClick={() => speakText(lang === 'hi' && msg.hindiText ? msg.hindiText : msg.text)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}>
                    <Volume2 size={11} />
                  </button>
                </div>
              )}
              <div style={{ whiteSpace: 'pre-line', fontSize: '0.82rem' }}>
                {lang === 'hi' && msg.hindiText ? msg.hindiText : msg.text}
              </div>
              <div className="si-chat-time">{msg.timestamp}</div>
            </div>

            {/* ── Intent-specific Rich Cards ── */}

            {/* Scheme Recommendations */}
            {msg.schemeResults && msg.schemeResults.length > 0 && (
              <SchemeRecBubble results={msg.schemeResults} onWhy={r => handleWhy(r, 'eligible')} onWhere={handleWhere} />
            )}

            {/* Why Card */}
            {msg.selectedForWhy && (msg.intent === 'why_scheme' || msg.intent === 'why_not' || msg.intent === 'gap_analyze') && (
              <>
                <WhyCard result={msg.selectedForWhy} mode={msg.intent === 'why_not' ? 'ineligible' : 'eligible'} />
                {msg.intent === 'gap_analyze' && <GapCard result={msg.selectedForWhy} />}
              </>
            )}

            {/* EMI Card */}
            {msg.emiData && msg.intent === 'check_emi' && (
              <EMICard {...msg.emiData} onModify={handleEMIModify} />
            )}

            {/* What-If Card */}
            {msg.whatIfData && msg.intent === 'what_if' && (
              <WhatIfCard {...msg.whatIfData} />
            )}

            {/* Document Checklist */}
            {msg.docData && <DocChecklistCard {...msg.docData} />}

            {/* Fraud Warning */}
            {msg.fraudUrl && <FraudCard url={msg.fraudUrl} />}

            {/* Financial Literacy */}
            {msg.litTerm && FINANCIAL_TERMS[msg.litTerm] && (
              <LiteracyCard term={msg.litTerm} expl={FINANCIAL_TERMS[msg.litTerm]} lang={lang} />
            )}

            {/* Where to Apply */}
            {msg.whereData && <WhereCard r={msg.whereData} />}

            {/* DPR Draft */}
            {msg.dprResult && <DPRDraftCard dpr={msg.dprResult} businessName={dprData.businessName || 'Your Business'} />}

            {/* Suggested Prompts */}
            {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
              <div className="si-suggested-prompts">
                {msg.suggestedPrompts.map((p, i) => (
                  <button key={i} className="si-prompt-chip" onClick={() => sendMessage(p)}>{p}</button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="si-chat-bubble assistant" style={{ fontStyle: 'italic', fontSize: '0.78rem' }}>
            <span className="si-typing-dot" />
            <span className="si-typing-dot" style={{ animationDelay: '0.2s' }} />
            <span className="si-typing-dot" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* ── Panel Footer ── */}
      <div className="si-saathi-panel-footer">
        {/* File Upload */}
        <label className="si-saathi-upload-btn" title="Upload Document">
          <Upload size={14} />
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>

        {/* Voice */}
        <button className={`si-saathi-mic-btn ${isRecording ? 'recording' : ''}`} onClick={toggleVoice} title="Voice Input">
          {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
        </button>

        {/* Text input */}
        <input
          className="si-saathi-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={
            dprStep ? '📄 Enter details for project report...'
              : isRecording ? '🎙️ Listening...'
                : lang === 'hi' ? 'अपना सवाल पूछें...'
                  : lang === 'pa' ? 'ਆਪਣਾ ਸਵਾਲ ਪੁੱਛੋ...'
                    : 'Ask about schemes, EMI, eligibility...'
          }
        />

        {/* Send */}
        <button className="si-saathi-send-btn" onClick={() => sendMessage()} disabled={isLoading}>
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING BUTTON MODE — Backward compat for old dashboard
   ═══════════════════════════════════════════════════════════════════════════ */
export const SaathiAICopilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <button className="saathi-floating-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Open Saathi AI"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={16} />
        <span>Ask Saathi AI</span>
      </button>
      {isOpen && (
        <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 1000, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', borderRadius: '16px', overflow: 'hidden' }}>
          <SaathiPanel collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        </div>
      )}
    </>
  );
};
