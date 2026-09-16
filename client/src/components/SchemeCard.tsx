import React, { useState, useEffect, useRef } from 'react';
import { SchemeMatchResult, SupportedLanguage } from '../types';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { Volume2, VolumeX, ExternalLink, Check, AlertTriangle, Lightbulb, Scale, Eye, Sparkles } from 'lucide-react';

interface SchemeCardProps {
  matchResult: SchemeMatchResult;
}

const audioLabels: Record<SupportedLanguage, { play: string; stop: string }> = {
  en: { play: 'Audio Summary', stop: 'Stop Audio' },
  hi: { play: 'ऑडियो सारांश', stop: 'ऑडियो रोकें' },
  te: { play: 'ఆడియో సారాంశం', stop: 'ఆడియో ఆపండి' },
  pa: { play: 'ਆਡੀਓ ਸਾਰ', stop: 'ਆਡੀਓ ਰੋਕੋ' },
  mr: { play: 'ऑडिओ सारांश', stop: 'ऑडिओ थांबवा' },
  bn: { play: 'অডিও সারাংশ', stop: 'অডিও থামান' },
};

const recommendedLabels: Record<SupportedLanguage, string> = {
  en: 'RECOMMENDED',
  hi: 'अनुशंसित योजना',
  te: 'సిఫార్సు చేయబడిన పథకం',
  pa: 'ਸਿਫਾਰਸ਼ ਕੀਤੀ ਸਕੀਮ',
  mr: 'शिफारस केलेली योजना',
  bn: 'সুপারিশকৃত প্রকল্প'
};

const tailorLabels: Record<SupportedLanguage, string> = {
  en: 'RECOMMENDED FOR TAILORING',
  hi: 'सिलाई के लिए अनुशंसित',
  te: 'టైలరింగ్ కోసం సిఫార్సు చేయబడింది',
  pa: 'ਦਰਜ਼ੀ ਕੰਮ ਲਈ ਸਿਫਾਰਸ਼',
  mr: 'शिंपी कामासाठी शिफारस',
  bn: 'দর্জি কাজের জন্য সুপারিশকৃত'
};

const bankLoanLabels: Record<SupportedLanguage, string> = {
  en: 'Bank Loan Needed',
  hi: 'बैंक ऋण आवश्यक',
  te: 'బ్యాంకు రుణం అవసరం',
  pa: 'ਬੈਂਕ ਕਰਜ਼ਾ ਲੋੜੀਂਦਾ',
  mr: 'बँक कर्ज आवश्यक',
  bn: 'প্রয়োজনীয় ব্যাংক ঋণ'
};

const officialPortalLabels: Record<SupportedLanguage, string> = {
  en: 'Official Portal',
  hi: 'आधिकारिक पोर्टल',
  te: 'అధికారిక పోర్టల్',
  pa: 'ਅਧਿਕਾਰਤ ਪੋਰਟਲ',
  mr: 'अधिकृत पोर्टल',
  bn: 'অফিসিয়াল পোর্টাল'
};

const noteLabels: Record<SupportedLanguage, string> = {
  en: 'Note',
  hi: 'नोट',
  te: 'గమనిక',
  pa: 'ਨੋਟ',
  mr: 'टीप',
  bn: 'নোট'
};

export const SchemeCard: React.FC<SchemeCardProps> = ({ matchResult }) => {
  const { scheme, matchScore, isEligible, estimatedSubsidyAmount, estimatedLoanAmount, estimatedOwnContribution, estimatedMonthlyEmi, reasonsWhyMatched, conditionsToFulfill, subsidyOptimizationTip } = matchResult;
  const { profile, toggleCompareScheme, isSchemeCompared, setSelectedSchemeModal } = useProfile();
  const { speakText, isSpeaking, stopSpeech, language, t } = useLanguage();

  const isCompared = isSchemeCompared(scheme.id);
  
  // Track if THIS card started the audio
  const [isThisPlaying, setIsThisPlaying] = useState(false);
  const cardIdRef = useRef(`card-${scheme.id}-${Date.now()}`);

  // When global isSpeaking goes false, reset this card's playing state
  useEffect(() => {
    if (!isSpeaking) {
      setIsThisPlaying(false);
    }
  }, [isSpeaking]);

  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isThisPlaying && isSpeaking) {
      // Currently playing this card's audio → stop it immediately
      stopSpeech();
      setIsThisPlaying(false);
    } else {
      // Build narration text based on selected language
      const subsidyFmt = `₹${estimatedSubsidyAmount.toLocaleString('en-IN')}`;
      const loanFmt = `₹${estimatedLoanAmount.toLocaleString('en-IN')}`;
      const rate = scheme.interestRatePerAnnum;

      let narrationText: string;
      switch (language) {
        case 'hi':
          narrationText = `${scheme.hindiName || scheme.name}। ${scheme.hindiSummary || scheme.summary}। अनुमानित पूंजी सब्सिडी: ${subsidyFmt}। आवश्यक बैंक ऋण: ${loanFmt}। रियायती ब्याज दर: ${rate}।`;
          break;
        case 'te':
          narrationText = `${scheme.name} పథకం. ${scheme.summary}. అర్హత కలిగిన క్యాపిటల్ సబ్సిడీ: ${subsidyFmt}. అవసరమైన బ్యాంకు రుణం: ${loanFmt}. రాయితీ వడ్డీ రేటు: ${rate}.`;
          break;
        case 'pa':
          narrationText = `${scheme.name} ਸਕੀਮ. ${scheme.summary}. ਅਨੁਮਾਨਿਤ ਪੂੰਜੀ ਸਬਸਿਡੀ: ${subsidyFmt}. ਲੋੜੀਂਦਾ ਬੈਂਕ ਕਰਜ਼ਾ: ${loanFmt}. ਵਿਆਜ ਦਰ: ${rate}.`;
          break;
        case 'mr':
          narrationText = `${scheme.hindiName || scheme.name} योजना. ${scheme.hindiSummary || scheme.summary}। अंदाजित भांडवली अनुदान: ${subsidyFmt}। आवश्यक बँक कर्ज: ${loanFmt}। सवलतीचा व्याजदर: ${rate}।`;
          break;
        case 'bn':
          narrationText = `${scheme.hindiName || scheme.name} প্রকল্প। ${scheme.hindiSummary || scheme.summary}। আনুমানিক মূলধন ভর্তুকি: ${subsidyFmt}। প্রয়োজনীয় ব্যাংক ঋণ: ${loanFmt}। সুদের হার: ${rate}।`;
          break;
        default:
          narrationText = `${scheme.name}. ${scheme.summary}. Eligible Capital Subsidy: ${subsidyFmt}. Estimated loan: ${loanFmt}. Concessional interest rate: ${rate}.`;
          break;
      }

      speakText(narrationText);
      setIsThisPlaying(true);
    }
  };

  const currentAudioLabel = audioLabels[language] || audioLabels.en;

  return (
    <div className="scheme-card glass-panel">
      {/* Top Bar: Ministry / Apex Badge & Match Score Gauge */}
      <div className="scheme-card-top">
        <div className="scheme-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            {matchScore >= 80 && isEligible && (
              <span className="badge" style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', fontWeight: 800 }}>
                ⭐ {recommendedLabels[language] || recommendedLabels.en}
              </span>
            )}
            {scheme.id === 'pm-vishwakarma' && (profile.tradeType?.toLowerCase().includes('tailor') || profile.sector === 'Textiles') && (
              <span className="badge" style={{ background: 'linear-gradient(135deg, #4F46E5, #6366F1)', color: '#FFFFFF', fontWeight: 800 }}>
                🎯 {tailorLabels[language] || tailorLabels.en}
              </span>
            )}
            <span className="badge badge-indigo">
              {scheme.apexBody}
            </span>
            <span className="badge badge-saffron">
              {scheme.categoryTag}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {scheme.ministry}
            </span>
          </div>

          <h3>{scheme.name}</h3>
          <div className="hindi-title">{scheme.hindiName}</div>
        </div>

        {/* Match Probability Gauge */}
        <div className="match-score-pill">
          <span className="match-score-num">{matchScore}%</span>
          <span className="match-score-label">{t.results.matchScore.split(' ')[0]}</span>
        </div>
      </div>

      {/* Brief Summary */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '10px 0' }}>
        {language === 'hi' ? scheme.hindiSummary : scheme.summary}
      </p>

      {/* 4 Financial Highlights Grid */}
      <div className="financial-pills-grid">
        <div className="fin-pill">
          <span>{t.results.maxSubsidy}</span>
          <strong style={{ color: 'var(--emerald-growth)' }}>
            ₹{estimatedSubsidyAmount.toLocaleString('en-IN')}
          </strong>
        </div>
        <div className="fin-pill">
          <span>{bankLoanLabels[language] || bankLoanLabels.en}</span>
          <strong>₹{estimatedLoanAmount.toLocaleString('en-IN')}</strong>
        </div>
        <div className="fin-pill">
          <span>{t.results.ownContribution}</span>
          <strong>₹{estimatedOwnContribution.toLocaleString('en-IN')}</strong>
        </div>
        <div className="fin-pill">
          <span>{t.results.estimatedEmi}</span>
          <strong style={{ color: 'var(--trust-indigo)' }}>
            ₹{estimatedMonthlyEmi > 0 ? `${estimatedMonthlyEmi.toLocaleString('en-IN')}/mo` : 'Interest Subvention'}
          </strong>
        </div>
      </div>

      {/* Explainable AI: Why You Matched */}
      {reasonsWhyMatched && reasonsWhyMatched.length > 0 && (
        <div className="why-matched-box">
          <div className="why-matched-title">
            <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
            {t.results.whyMatched}
          </div>
          <ul className="why-matched-list">
            {reasonsWhyMatched.slice(0, 3).map((r, idx) => (
              <li key={idx}>
                <Check size={14} style={{ color: 'var(--emerald-growth)', flexShrink: 0 }} />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Subsidy Optimization Tip Box */}
      {subsidyOptimizationTip && (
        <div className="optimization-tip-box">
          <Lightbulb size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
          <span>{subsidyOptimizationTip}</span>
        </div>
      )}

      {/* Conditions / Gaps to Satisfy */}
      {conditionsToFulfill && conditionsToFulfill.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-amber)', marginTop: '8px' }}>
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          <span>{noteLabels[language] || noteLabels.en}: {conditionsToFulfill[0]}</span>
        </div>
      )}

      {/* Action Footer Bar */}
      <div className="scheme-card-actions">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Audio Summary Toggle Button with iOS-style pill switch (matching user attachment) */}
          <div
            className={`scheme-audio-toggle-btn ${isThisPlaying && isSpeaking ? 'is-active' : ''}`}
            onClick={handleToggleAudio}
            role="button"
            tabIndex={0}
            title={isThisPlaying && isSpeaking ? currentAudioLabel.stop : currentAudioLabel.play}
            aria-label={isThisPlaying && isSpeaking ? currentAudioLabel.stop : currentAudioLabel.play}
          >
            {isThisPlaying && isSpeaking ? (
              <VolumeX size={16} style={{ color: '#16A34A', flexShrink: 0 }} />
            ) : (
              <Volume2 size={16} style={{ color: 'var(--primary-saffron)', flexShrink: 0 }} />
            )}
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {isThisPlaying && isSpeaking ? currentAudioLabel.stop : currentAudioLabel.play}
            </span>
            {/* The iOS pill switch knob */}
            <div className={`ios-switch ${isThisPlaying && isSpeaking ? 'active' : ''}`} aria-hidden="true">
              <span className="ios-switch-knob" />
            </div>
          </div>

          {/* Deep Dive Details Modal */}
          <button
            className="btn-secondary"
            onClick={() => setSelectedSchemeModal(matchResult)}
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
          >
            <Eye size={16} />
            <span>{t.results.viewDetails.split(' ').slice(0, 2).join(' ')}</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Compare Toggle Button */}
          <button
            className={isCompared ? 'btn-success' : 'btn-secondary'}
            onClick={() => toggleCompareScheme(scheme)}
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
          >
            <Scale size={16} />
            <span>{isCompared ? t.results.inComparison : t.results.addToCompare}</span>
          </button>

          {/* Official Portal External Link */}
          <a
            href={scheme.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
          >
            <span>{officialPortalLabels[language] || officialPortalLabels.en}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
