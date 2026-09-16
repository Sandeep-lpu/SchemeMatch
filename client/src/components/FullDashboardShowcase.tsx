import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../types';
import { 
  CheckCircle2,
  ArrowRight,
  Target,
  FileText,
  Calculator,
  Building2,
  SearchCheck,
  Sliders,
  Cpu,
  FileCheck2,
  Scale,
  Compass
} from 'lucide-react';

const featureTranslations: Record<SupportedLanguage, Record<string, { label: string; desc: string }>> = {
  en: {
    profile: { label: 'AI Profile', desc: 'Natural-language profile builder' },
    matcher: { label: 'Scheme Matcher', desc: 'Personalized scheme recommendations' },
    gap: { label: 'Gap Analyzer', desc: 'Eligibility gap diagnostic & steps' },
    whatif: { label: 'What-If Simulator', desc: 'Live scenario & criteria testing' },
    calculator: { label: 'Financial Calculator', desc: 'EMI, subsidy & DSCR computation' },
    partners: { label: 'Partner Router', desc: 'Find nearest authorized nodal banks' },
    documents: { label: 'Document Readiness', desc: 'OCR verification & checklist' },
    dpr: { label: 'Bank-Ready DPR', desc: 'SIDBI-compliant project report' },
    comparison: { label: 'Scheme Compare', desc: 'Side-by-side scheme comparison' },
    roadmap: { label: 'Application Roadmap', desc: 'End-to-end sanction navigator' },
  },
  hi: {
    profile: { label: 'AI प्रोफ़ाइल', desc: 'प्राकृतिक भाषा में प्रोफ़ाइल निर्माण' },
    matcher: { label: 'योजना मिलान', desc: 'व्यक्तिगत योजना सिफारिशें' },
    gap: { label: 'पात्रता जांच', desc: 'कमियों की पहचान और समाधान' },
    whatif: { label: 'सिम्युलेटर', desc: 'मापदंड बदलकर लाइव परीक्षण' },
    calculator: { label: 'कैलकुलेटर', desc: 'EMI और सब्सिडी की सटीक गणना' },
    partners: { label: 'पार्टनर राउटर', desc: 'निकटतम अधिकृत बैंक खोजें' },
    documents: { label: 'दस्तावेज़ तत्परता', desc: 'OCR जांच और सत्यापन' },
    dpr: { label: 'बैंक-रेडी DPR', desc: 'बैंक-स्वीकार्य परियोजना रिपोर्ट' },
    comparison: { label: 'योजना तुलना', desc: 'योजनाओं की साथ-साथ तुलना' },
    roadmap: { label: 'आवेदन रोडमैप', desc: 'आवेदन से स्वीकृति तक मार्गदर्शन' },
  },
  te: {
    profile: { label: 'AI ప్రొఫైల్', desc: 'సహజ భాషా ప్రొఫైల్ బిల్డర్' },
    matcher: { label: 'పథక సరిపోలిక', desc: 'వ్యక్తిగతీకరించిన పథక సిఫార్సులు' },
    gap: { label: 'అర్హత విశ్లేషణ', desc: 'లోపాల గుర్తింపు & పరిష్కారం' },
    whatif: { label: 'సిమ్యులేటర్', desc: 'ప్రత్యక్ష దృశ్యాల పరీక్ష' },
    calculator: { label: 'ఆర్థిక కాలిక్యులేటర్', desc: 'EMI మరియు సబ్సిడీ లెక్కింపు' },
    partners: { label: 'పార్ట్‌నర్ రూటర్', desc: 'సమీప అధీకృత బ్యాంకుల గుర్తింపు' },
    documents: { label: 'పత్రాల సన్నద్ధత', desc: 'OCR తనిఖీ మరియు ధృవీకరణ' },
    dpr: { label: 'బ్యాంక్-రెడీ DPR', desc: 'బ్యాంక్ ఆమోదిత ప్రాజెక్ట్ నివేదిక' },
    comparison: { label: 'పథకాల పోలిక', desc: 'పథకాల ముఖాముఖి పోలిక' },
    roadmap: { label: 'దరఖాస్తు రోడ్‌మ్యాప్', desc: 'దరఖాస్తు ప్రక్రియ మార్గదర్శి' },
  },
  pa: {
    profile: { label: 'AI ਪ੍ਰੋਫਾਈਲ', desc: 'ਕੁਦਰਤੀ ਭਾਸ਼ਾ ਪ੍ਰੋਫਾਈਲ ਬਿਲਡਰ' },
    matcher: { label: 'ਸਕੀਮ ਮੈਚਰ', desc: 'ਨਿੱਜੀ ਸਕੀਮ ਸਿਫ਼ਾਰਸ਼ਾਂ' },
    gap: { label: 'ਯੋਗਤਾ ਜਾਂਚ', desc: 'ਘਾਟਾਂ ਦੀ ਪਛਾਣ ਅਤੇ ਹੱਲ' },
    whatif: { label: 'ਸਿਮੂਲੇਟਰ', desc: 'ਲਾਈਵ ਸਥਿਤੀਆਂ ਦੀ ਜਾਂਚ' },
    calculator: { label: 'ਵਿੱਤੀ ਕੈਲਕੁਲੇਟਰ', desc: 'EMI ਅਤੇ ਸਬਸਿਡੀ ਗਣਨਾ' },
    partners: { label: 'ਪਾਰਟਨਰ ਰਾਊਟਰ', desc: 'ਨੇੜਲੇ ਅਧਿਕਾਰਤ ਬੈਂਕ ਲੱਭੋ' },
    documents: { label: 'ਦਸਤਾਵੇਜ਼ ਤਿਆਰੀ', desc: 'OCR ਜਾਂਚ ਅਤੇ ਤਸਦੀਕ' },
    dpr: { label: 'ਬੈਂਕ-ਤਿਆਰ DPR', desc: 'ਬੈਂਕ-ਮਨਜ਼ੂਰ ਪ੍ਰੋਜੈਕਟ ਰਿਪੋਰਟ' },
    comparison: { label: 'ਸਕੀਮ ਤੁਲਨਾ', desc: 'ਸਕੀਮਾਂ ਦੀ ਆਹਮੋ-ਸਾਹਮਣੇ ਤੁਲਨਾ' },
    roadmap: { label: 'ਅਰਜ਼ੀ ਰੋਡਮੈਪ', desc: 'ਅਰਜ਼ੀ ਪ੍ਰਕਿਰਿਆ ਮਾਰਗਦਰਸ਼ਨ' },
  },
  mr: {
    profile: { label: 'AI प्रोफाइल', desc: 'नैसर्गिक भाषा प्रोफाइल बिल्डर' },
    matcher: { label: 'योजना शिफारस', desc: 'वैयक्तिकृत योजना शिफारसी' },
    gap: { label: 'पात्रता विश्लेषण', desc: 'तफावत निदान आणि उपाय' },
    whatif: { label: 'सिम्युलेटर', desc: 'थेट निकषांची चाचणी' },
    calculator: { label: 'आर्थिक कॅल्क्युलेटर', desc: 'EMI व अनुदानाची अचूक गणना' },
    partners: { label: 'पार्टनर राउटर', desc: 'जवळची अधिकृत बँक शोधा' },
    documents: { label: 'दस्तावेज सज्जता', desc: 'OCR पडताळणी आणि तपासणी' },
    dpr: { label: 'बँक-सज्ज DPR', desc: 'बँक-मान्य प्रकल्प अहवाल' },
    comparison: { label: 'योजना तुलना', desc: 'योजनांची समोरासमोर तुलना' },
    roadmap: { label: 'अर्ज रोडमॅप', desc: 'अर्ज प्रक्रियेचे संपूर्ण मार्गदर्शन' },
  },
  bn: {
    profile: { label: 'AI প্রোফাইল', desc: 'প্রাকৃতিক ভাষার প্রোফাইল নির্মাতা' },
    matcher: { label: 'প্রকল্প ম্যাচিং', desc: 'ব্যক্তিগতকৃত প্রকল্প সুপারিশ' },
    gap: { label: 'যোগ্যতা বিশ্লেষণ', desc: 'ঘাটতি নির্ণয় ও সমাধান' },
    whatif: { label: 'সিমুলেটর', desc: 'পরিস্থিতি ও মানদণ্ড পরীক্ষা' },
    calculator: { label: 'আর্থিক ক্যালকুলেটর', desc: 'EMI ও ভর্তুকি হিসাব' },
    partners: { label: 'পার্টনার রাউটার', desc: 'নিকটতম অনুমোদিত ব্যাংক খুঁজুন' },
    documents: { label: 'নথি প্রস্তুতি', desc: 'OCR যাচাইকরণ ও চেকলিস্ট' },
    dpr: { label: 'ব্যাংক-রেডি DPR', desc: 'ব্যাংক-অনুমোদিত প্রকল্প রিপোর্ট' },
    comparison: { label: 'প্রকল্প তুলনা', desc: 'প্রকল্পসমূহের পাশাপাশি তুলনা' },
    roadmap: { label: 'আবেদন রোডম্যাপ', desc: 'আবেদন প্রক্রিয়ার পূর্ণ রূপরেখা' },
  },
};

export const FullDashboardShowcase: React.FC = () => {
  const { navigateToFeature } = useProfile();
  const { t, language } = useLanguage();

  const langFeatures = featureTranslations[language] || featureTranslations.en;

  const features = [
    { id: 'profile', icon: Cpu, label: langFeatures.profile.label, desc: langFeatures.profile.desc, color: '#6366F1' },
    { id: 'matcher', icon: Target, label: langFeatures.matcher.label, desc: langFeatures.matcher.desc, color: '#10B981' },
    { id: 'gap', icon: SearchCheck, label: langFeatures.gap.label, desc: langFeatures.gap.desc, color: '#F59E0B' },
    { id: 'whatif', icon: Sliders, label: langFeatures.whatif.label, desc: langFeatures.whatif.desc, color: '#8B5CF6' },
    { id: 'calculator', icon: Calculator, label: langFeatures.calculator.label, desc: langFeatures.calculator.desc, color: '#06B6D4' },
    { id: 'partners', icon: Building2, label: langFeatures.partners.label, desc: langFeatures.partners.desc, color: '#EC4899' },
    { id: 'documents', icon: FileCheck2, label: langFeatures.documents.label, desc: langFeatures.documents.desc, color: '#14B8A6' },
    { id: 'dpr', icon: FileText, label: langFeatures.dpr.label, desc: langFeatures.dpr.desc, color: '#F97316' },
    { id: 'comparison', icon: Scale, label: langFeatures.comparison.label, desc: langFeatures.comparison.desc, color: '#3B82F6' },
    { id: 'roadmap', icon: Compass, label: langFeatures.roadmap.label, desc: langFeatures.roadmap.desc, color: '#84CC16' },
  ];

  return (
    <section className="dashboard-showcase-section" id="dashboard-showcase">
      <div className="container">
        {/* Section Headline */}
        <div className="dashboard-showcase-header">
          <h2 className="dashboard-showcase-title">
            {t.landing.dashboardTitleLine1} <br />
            <span className="smile-underline-wrap">
              {t.landing.dashboardTitleHighlight}
              <svg className="smile-underline-svg" viewBox="0 0 240 24" fill="none">
                <path
                  d="M6,14 C60,24 180,24 234,10"
                  stroke="#3B82F6"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="dashboard-showcase-subtitle">
            {t.landing.dashboardSubtitle}
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '16px', 
          maxWidth: '1000px', 
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div 
                key={f.id}
                onClick={() => navigateToFeature(f.id as any)}
                style={{
                  padding: '20px 18px',
                  background: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                className="dash-feature-tile"
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: `${f.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={20} style={{ color: f.color }} />
                </div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{f.label}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{f.desc}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-saffron)', marginTop: 'auto' }}>
                  <span>{language === 'hi' ? 'खोलें' : (language === 'te' ? 'తెరవండి' : (language === 'pa' ? 'ਖੋਲ੍ਹੋ' : (language === 'mr' ? 'उघडा' : (language === 'bn' ? 'খুলুন' : 'Open'))))}</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
