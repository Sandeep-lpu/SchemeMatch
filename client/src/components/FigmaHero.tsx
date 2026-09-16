import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export const FigmaHero: React.FC = () => {
  const { t, language } = useLanguage();
  const { setActiveTab } = useProfile();

  return (
    <section className="figma-hero-section">
      <div className="container">
        {/* Top Kicker Pill */}
        <div className="figma-kicker-pill">
          <Sparkles size={14} />
          <span>{language === 'hi' ? 'स्कीममैच AI' : 'INTRODUCING SCHEMEMATCH AI'}</span>
        </div>

        {/* Big Editorial Headline */}
        <h1 className="figma-hero-title">
          {language === 'hi' ? 'वह प्लेटफॉर्म जो आपको' : 'The platform you'} <br />
          <span className="cursor-tag-highlight">
            {language === 'hi' ? 'योजना मिलान में मदद करे' : 'need to match'}
            <span className="cursor-badge">AI</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="figma-hero-subtitle">
          {language === 'hi' 
            ? 'हाशिए के उद्यमियों के लिए एक बुद्धिमान निर्णय-समर्थन प्रणाली, जो 35% तक पूंजी सब्सिडी, 4% रियायती ऋण, और बैंक-स्वीकार्य DPR तैयार करती है।'
            : 'An intelligent decision-support and application copilot for marginalized entrepreneurs, unlocking up to 35% capital subsidies, 4% concessional credit, and bank-ready DPRs.'
          }
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            onClick={() => setActiveTab('matcher')}
            style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
          >
            <span>{language === 'hi' ? 'योजनाएं मिलाएं' : 'Match Your Schemes'}</span>
            <ArrowRight size={18} />
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => setActiveTab('dpr')}
            style={{ padding: '14px 26px', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
          >
            <span>{language === 'hi' ? 'बैंक-रेडी DPR बनाएं' : 'Build Bank-Ready DPR'}</span>
          </button>
        </div>

        {/* Hero Visual Showcase */}
        <div className="hero-showcase-viewport">
          {/* Background Window: Scheme Matrix */}
          <div className="mac-window hero-bg-window">
            <div className="mac-titlebar">
              <div className="mac-dots">
                <span className="mac-dot red" />
                <span className="mac-dot yellow" />
                <span className="mac-dot green" />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '12px' }}>
                {language === 'hi' ? 'स्कीममैच — सामाजिक न्याय एवं अधिकारिता मंत्रालय' : 'SchemeMatch — Ministry of Social Justice & Empowerment'}
              </span>
            </div>
            <div style={{ padding: '40px 30px', background: 'var(--bg-surface-subtle)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-saffron" style={{ marginBottom: '8px' }}>PMEGP 2026</span>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>{language === 'hi' ? 'ग्रामीण SC 35% सब्सिडी' : 'Rural SC 35% Subsidy'}</strong>
                <small style={{ color: 'var(--text-muted)' }}>KVIC & DIC</small>
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>NSFDC</span>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>{language === 'hi' ? 'महिला समृद्धि 4%' : 'Mahila Samriddhi 4%'}</strong>
                <small style={{ color: 'var(--text-muted)' }}>MoSJE</small>
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>PM Vishwakarma</span>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>₹15k Tool Grant + 5%</strong>
                <small style={{ color: 'var(--text-muted)' }}>{language === 'hi' ? '18 पारंपरिक शिल्प' : '18 Traditional Crafts'}</small>
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-saffron" style={{ marginBottom: '8px' }}>PM SVANidhi</span>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>₹50,000 Micro-Credit</strong>
                <small style={{ color: 'var(--text-muted)' }}>{language === 'hi' ? '7% ब्याज छूट' : '7% Interest Subvention'}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
