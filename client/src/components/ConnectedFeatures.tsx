import React from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../types';
import { 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Target,
  Calculator,
  Building2
} from 'lucide-react';

const cfLabels: Record<SupportedLanguage, {
  schemeDiscovery: string;
  schemeDiscoveryDesc: string;
  aiSmartMatching: string;
  pmegpSubsidy: string;
  vishwakarmaToolkit: string;
  standUpIndia: string;
  viewSchemes: string;
  docManagement: string;
  docManagementDesc: string;
  dossierTitle: string;
  docsTab: string;
  verifiedTab: string;
  aadhaarDone: string;
  dprDone: string;
  landNocPending: string;
  roadmapTitle: string;
  roadmapDesc: string;
  activeTab: string;
  completeTab: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  viewFullRoadmap: string;
}> = {
  en: {
    schemeDiscovery: 'Scheme Discovery',
    schemeDiscoveryDesc: 'Instantly discover the best government schemes based on your profile. AI matches across 23+ central schemes with explainable scoring.',
    aiSmartMatching: 'AI Smart Matching',
    pmegpSubsidy: 'PMEGP • SC/ST 35% Subsidy',
    vishwakarmaToolkit: 'PM Vishwakarma • ₹15k Toolkit',
    standUpIndia: 'Stand-Up India • Up to ₹1 Crore',
    viewSchemes: 'View Schemes',
    docManagement: 'Document Management',
    docManagementDesc: 'Organize all your documents in structured dossiers. Never miss a required document — auto-generate bank-ready DPRs.',
    dossierTitle: '📁 Scheme Dossiers',
    docsTab: 'Documents',
    verifiedTab: 'Verified',
    aadhaarDone: 'Aadhaar Verification',
    dprDone: 'SIDBI DPR Formatted',
    landNocPending: 'Land Lease NOC',
    roadmapTitle: 'Application Roadmap',
    roadmapDesc: 'See all your tasks, bank checklists, and action items from across your applications in one place.',
    activeTab: 'Active',
    completeTab: 'Complete',
    step1Title: 'Udyam Registration',
    step2Title: 'Prepare Bank-Ready DPR',
    step3Title: 'Upload Documents',
    step4Title: 'Apply at Bank Branch',
    viewFullRoadmap: 'View Full Roadmap'
  },
  hi: {
    schemeDiscovery: 'योजना खोज',
    schemeDiscoveryDesc: 'अपनी प्रोफ़ाइल के आधार पर सर्वश्रेष्ठ सरकारी योजनाओं की तुरंत खोज करें। AI 23+ केंद्रीय योजनाओं का मिलान करता है।',
    aiSmartMatching: 'AI स्मार्ट मिलान',
    pmegpSubsidy: 'PMEGP • SC/ST 35% सब्सिडी',
    vishwakarmaToolkit: 'PM विश्वकर्मा • ₹15k टूलकिट',
    standUpIndia: 'स्टैंड-अप इंडिया • ₹1 करोड़ तक',
    viewSchemes: 'योजनाएं देखें',
    docManagement: 'दस्तावेज़ प्रबंधन',
    docManagementDesc: 'सभी दस्तावेज़ व्यवस्थित रूप से प्रबंधित करें। कोई भी आवश्यक कागज़ात न छूटे, बैंक-स्वीकार्य DPR स्वतः तैयार करें।',
    dossierTitle: '📁 दस्तावेज़ डोसियर',
    docsTab: 'दस्तावेज़',
    verifiedTab: 'सत्यापित',
    aadhaarDone: 'आधार सत्यापन',
    dprDone: 'DPR तैयार',
    landNocPending: 'भूमि पट्टा NOC',
    roadmapTitle: 'आवेदन रोडमैप',
    roadmapDesc: 'अपने सभी कार्य, बैंक चेकलिस्ट और कार्रवाई आइटम एक ही स्थान पर देखें।',
    activeTab: 'सक्रिय',
    completeTab: 'पूर्ण',
    step1Title: 'उद्यम पंजीकरण',
    step2Title: 'बैंक DPR तैयार करें',
    step3Title: 'दस्तावेज़ अपलोड करें',
    step4Title: 'बैंक शाखा में आवेदन करें',
    viewFullRoadmap: 'पूरा रोडमैप देखें'
  },
  te: {
    schemeDiscovery: 'పథక అన్వేషణ',
    schemeDiscoveryDesc: 'మీ ప్రొఫైల్ ఆధారంగా ఉత్తమ ప్రభుత్వ పథకాలను వెంటనే కనుగొనండి. AI 23+ కేంద్ర పథకాలను విశ్లేషిస్తుంది.',
    aiSmartMatching: 'AI స్మార్ట్ సరిపోలిక',
    pmegpSubsidy: 'PMEGP • SC/ST 35% సబ్సిడీ',
    vishwakarmaToolkit: 'PM విశ్వకర్మ • ₹15 వేల టూల్‌కిట్',
    standUpIndia: 'స్టాండ్-అప్ ఇండియా • ₹1 కోటి వరకు',
    viewSchemes: 'పథకాలను చూడండి',
    docManagement: 'పత్రాల నిర్వహణ',
    docManagementDesc: 'మీ అన్ని పత్రాలను క్రమపద్ధతిలో నిర్వహించండి. బ్యాంక్-ఆమోదిత DPRలను స్వయంచాలకంగా పొందండి.',
    dossierTitle: '📁 పథక పత్రాలు',
    docsTab: 'పత్రాలు',
    verifiedTab: 'ధృవీకరించబడింది',
    aadhaarDone: 'ఆధార్ ధృవీకరణ',
    dprDone: 'DPR సిద్ధమైంది',
    landNocPending: 'భూమి లీజు NOC',
    roadmapTitle: 'దరఖాస్తు రోడ్‌మ్యాప్',
    roadmapDesc: 'మీ పనులు, బ్యాంక్ చెక్‌లిస్ట్‌లు మరియు తదుపరి దశలను ఒకే చోట చూడండి.',
    activeTab: 'క్రియాశీలం',
    completeTab: 'పూర్తయింది',
    step1Title: 'ఉద్యమ్ నమోదు',
    step2Title: 'బ్యాంక్ DPR సిద్ధం చేయండి',
    step3Title: 'పత్రాలు అప్‌లోడ్ చేయండి',
    step4Title: 'బ్యాంక్ శాఖలో దరఖాస్తు చేయండి',
    viewFullRoadmap: 'పూర్తి రోడ్‌మ్యాప్ చూడండి'
  },
  pa: {
    schemeDiscovery: 'ਸਕੀਮ ਖੋਜ',
    schemeDiscoveryDesc: 'ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਅਧਾਰਿਤ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਤੁਰੰਤ ਲੱਭੋ। AI 23+ ਕੇਂਦਰੀ ਸਕੀਮਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਦਾ ਹੈ।',
    aiSmartMatching: 'AI ਸਮਾਰਟ ਮੈਚਿੰਗ',
    pmegpSubsidy: 'PMEGP • SC/ST 35% ਸਬਸਿਡੀ',
    vishwakarmaToolkit: 'PM ਵਿਸ਼ਵਕਰਮਾ • ₹15 ਹਜ਼ਾਰ ਟੂਲਕਿੱਟ',
    standUpIndia: 'ਸਟੈਂਡ-ਅੱਪ ਇੰਡੀਆ • ₹1 ਕਰੋੜ ਤੱਕ',
    viewSchemes: 'ਸਕੀਮਾਂ ਵੇਖੋ',
    docManagement: 'ਦਸਤਾਵੇਜ਼ ਪ੍ਰਬੰਧਨ',
    docManagementDesc: 'ਸਾਰੇ ਦਸਤਾਵੇਜ਼ ਵਿਵਸਥਿਤ ਤਰੀਕੇ ਨਾਲ ਸੰਭਾਲੋ ਅਤੇ ਬੈਂਕ-ਮਨਜ਼ੂਰ DPR ਆਪਣੇ ਆਪ ਤਿਆਰ ਕਰੋ।',
    dossierTitle: '📁 ਸਕੀਮ ਦਸਤਾਵੇਜ਼',
    docsTab: 'ਦਸਤਾਵੇਜ਼',
    verifiedTab: 'ਤਸਦੀਕਸ਼ੁਦਾ',
    aadhaarDone: 'ਆਧਾਰ ਤਸਦੀਕ',
    dprDone: 'DPR ਤਿਆਰ',
    landNocPending: 'ਜ਼ਮੀਨੀ ਲੀਜ਼ NOC',
    roadmapTitle: 'ਅਰਜ਼ੀ ਰੋਡਮੈਪ',
    roadmapDesc: 'ਆਪਣੇ ਸਾਰੇ ਕੰਮ, ਬੈਂਕ ਚੈੱਕਲਿਸਟ ਅਤੇ ਕਾਰਵਾਈਆਂ ਇੱਕੋ ਥਾਂ ਵੇਖੋ।',
    activeTab: 'ਸਰਗਰਮ',
    completeTab: 'ਮੁਕੰਮਲ',
    step1Title: 'ਉੱਦਮ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
    step2Title: 'ਬੈਂਕ DPR ਤਿਆਰ ਕਰੋ',
    step3Title: 'ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਕਰੋ',
    step4Title: 'ਬੈਂਕ ਬ੍ਰਾਂਚ ਵਿੱਚ ਅਰਜ਼ੀ ਦਿਓ',
    viewFullRoadmap: 'ਪੂਰਾ ਰੋਡਮੈਪ ਵੇਖੋ'
  },
  mr: {
    schemeDiscovery: 'योजना शोध',
    schemeDiscoveryDesc: 'आपल्या प्रोफाइलच्या आधारे सर्वोत्तम शासकीय योजना त्वरित शोधा. AI 23+ योजनांचे मूल्यांकन करते.',
    aiSmartMatching: 'AI स्मार्ट जुळवणी',
    pmegpSubsidy: 'PMEGP • SC/ST 35% अनुदान',
    vishwakarmaToolkit: 'PM विश्वकर्मा • ₹15k टूलकिट',
    standUpIndia: 'स्टँड-अप इंडिया • ₹1 कोटी पर्यंत',
    viewSchemes: 'योजना पहा',
    docManagement: 'दस्तावेज व्यवस्थापन',
    docManagementDesc: 'सर्व कागदपत्रे सुव्यवस्थित ठेवा आणि बँक-मान्य DPR स्वयंचलितपणे मिळवा.',
    dossierTitle: '📁 योजना डॉसियर',
    docsTab: 'दस्तावेज',
    verifiedTab: 'पडताळलेले',
    aadhaarDone: 'आधार पडताळणी',
    dprDone: 'DPR तयार',
    landNocPending: 'जमीन भाडेपट्टा NOC',
    roadmapTitle: 'अर्ज रोडमॅप',
    roadmapDesc: 'तुमची सर्व कामे, बँक चेकलिस्ट आणि पुढील पायऱ्या एकाच ठिकाणी पहा.',
    activeTab: 'सक्रिय',
    completeTab: 'पूर्ण',
    step1Title: 'उद्यम नोंदणी',
    step2Title: 'बँक DPR तयार करा',
    step3Title: 'दस्तावेज अपलोड करा',
    step4Title: 'बँक शाखेत अर्ज करा',
    viewFullRoadmap: 'संपूर्ण रोडमॅप पहा'
  },
  bn: {
    schemeDiscovery: 'প্রকল্প সন্ধান',
    schemeDiscoveryDesc: 'আপনার প্রোফাইলের ওপর ভিত্তি করে সরকারি প্রকল্পগুলি দ্রুত খুঁজুন। AI ২৩+ কেন্দ্রীয় প্রকল্প মেলায়।',
    aiSmartMatching: 'AI স্মার্ট ম্যাচিং',
    pmegpSubsidy: 'PMEGP • SC/ST ৩৫% ভর্তুকি',
    vishwakarmaToolkit: 'PM বিশ্বকর্মা • ১৫ হাজার টাকা টুলকিট',
    standUpIndia: 'স্ট্যান্ড-আপ ইন্ডিয়া • ১ কোটি টাকা পর্যন্ত',
    viewSchemes: 'প্রকল্প দেখুন',
    docManagement: 'নথি ব্যবস্থাপনা',
    docManagementDesc: 'আপনার সমস্ত নথি সুশৃঙ্খলভাবে সাজান এবং ব্যাংক-অনুমোদিত DPR স্বয়ংক্রিয়ভাবে পান।',
    dossierTitle: '📁 প্রকল্প নথি',
    docsTab: 'নথি',
    verifiedTab: 'যাচাইকৃত',
    aadhaarDone: 'আধার যাচাইকরণ',
    dprDone: 'DPR প্রস্তুত',
    landNocPending: 'জমি লিজ NOC',
    roadmapTitle: 'আবেদন রোডম্যাপ',
    roadmapDesc: 'আপনার সমস্ত কাজ, ব্যাংক চেকলিস্ট এবং পদক্ষেপ এক জায়গায় দেখুন।',
    activeTab: 'সক্রিয়',
    completeTab: 'সম্পূর্ণ',
    step1Title: 'উদ্যম নিবন্ধন',
    step2Title: 'ব্যাংক DPR তৈরি করুন',
    step3Title: 'নথি আপলোড করুন',
    step4Title: 'ব্যাংক শাখায় আবেদন করুন',
    viewFullRoadmap: 'সম্পূর্ণ রোডম্যাপ দেখুন'
  }
};

export const ConnectedFeatures: React.FC = () => {
  const { navigateToFeature } = useProfile();
  const { t, language } = useLanguage();

  const labels = cfLabels[language] || cfLabels.en;

  return (
    <section className="connected-features-section" id="connected-features">
      <div className="container">
        {/* Section Headline */}
        <div className="connected-header">
          <h2 className="connected-title">
            {t.landing.connectedTitlePrefix}{' '}
            <span className="sketched-circle-wrap">
              {t.landing.connectedTitleHighlight}
              <svg className="sketched-circle-svg" viewBox="0 0 120 54" fill="none">
                <path
                  d="M15,28 C12,12 55,4 95,8 C115,10 118,34 92,44 C55,54 18,48 8,30 C3,18 35,8 80,12"
                  stroke="#3B82F6"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>{' '}
            {t.landing.connectedTitleSuffix}
          </h2>
          <p className="connected-subtitle">
            {t.landing.connectedSubtitle}
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="connected-cards-grid">
          {/* Left Column */}
          <div className="connected-col-left">
            {/* Card 1: Scheme Discovery */}
            <div className="cf-card card-time-travel">
              <div className="cf-card-header">
                <h3 className="cf-card-title">{labels.schemeDiscovery}</h3>
                <p className="cf-card-desc">
                  {labels.schemeDiscoveryDesc}
                </p>
              </div>

              {/* Feature highlights */}
              <div className="cf-mini-window">
                <div className="cf-window-bar">
                  <div className="mac-dots mini">
                    <span className="mac-dot red" />
                    <span className="mac-dot yellow" />
                    <span className="mac-dot green" />
                  </div>
                </div>
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Target size={16} style={{ color: '#10B981' }} />
                    <strong style={{ fontSize: '0.85rem' }}>{labels.aiSmartMatching}</strong>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} style={{ color: '#10B981' }} />
                      <span>{labels.pmegpSubsidy}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} style={{ color: '#10B981' }} />
                      <span>{labels.vishwakarmaToolkit}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} style={{ color: '#10B981' }} />
                      <span>{labels.standUpIndia}</span>
                    </div>
                  </div>
                  <button 
                    className="cf-join-btn" 
                    onClick={() => navigateToFeature('matcher')}
                    style={{ marginTop: '12px' }}
                  >
                    <span className="cf-pulse-dot" />
                    <span>{labels.viewSchemes}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Document Management */}
            <div className="cf-card card-threads">
              <div className="cf-card-header">
                <h3 className="cf-card-title">{labels.docManagement}</h3>
                <p className="cf-card-desc">
                  {labels.docManagementDesc}
                </p>
              </div>

              <div className="cf-threads-window dark">
                <div className="cf-threads-titlebar">
                  <div className="mac-dots mini">
                    <span className="mac-dot red" />
                    <span className="mac-dot yellow" />
                    <span className="mac-dot green" />
                  </div>
                  <span className="cf-threads-app-title">{labels.dossierTitle}</span>
                </div>
                <div className="cf-threads-body">
                  <div className="cf-threads-sidebar">
                    <span className="active" onClick={() => navigateToFeature('documents')} style={{ cursor: 'pointer' }}><FileText size={12} /> {labels.docsTab}</span>
                    <span onClick={() => navigateToFeature('dpr')} style={{ cursor: 'pointer' }}><FileText size={12} /> DPR</span>
                    <span onClick={() => navigateToFeature('documents')} style={{ cursor: 'pointer' }}><ShieldCheck size={12} /> {labels.verifiedTab}</span>
                  </div>
                  <div className="cf-threads-tasks">
                    <div className="cf-task-item done" onClick={() => navigateToFeature('documents')} style={{ cursor: 'pointer' }}>
                      <CheckCircle2 size={13} className="text-emerald" />
                      <span>{labels.aadhaarDone}</span>
                    </div>
                    <div className="cf-task-item done" onClick={() => navigateToFeature('dpr')} style={{ cursor: 'pointer' }}>
                      <CheckCircle2 size={13} className="text-emerald" />
                      <span>{labels.dprDone}</span>
                    </div>
                    <div className="cf-task-item pending" onClick={() => navigateToFeature('documents')} style={{ cursor: 'pointer' }}>
                      <div className="cf-circle-radio" />
                      <span>{labels.landNocPending}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="connected-col-right">
            <div className="cf-card card-task-sidebar">
              <div className="cf-card-header">
                <h3 className="cf-card-title">{labels.roadmapTitle}</h3>
                <p className="cf-card-desc">
                  {labels.roadmapDesc}
                </p>
              </div>

              <div className="cf-task-board">
                <div className="cf-board-header">
                  <div className="cf-board-tabs">
                    <span className="active">{labels.activeTab}</span>
                    <span>{labels.completeTab}</span>
                  </div>
                </div>

                <div className="cf-board-list">
                  <div className="cf-board-item" onClick={() => navigateToFeature('roadmap')} style={{ cursor: 'pointer' }}>
                    <div className="cf-item-check" />
                    <div className="cf-item-details">
                      <strong>{labels.step1Title}</strong>
                      <span className="cf-tag blue">1</span>
                    </div>
                  </div>

                  <div className="cf-board-item highlight" onClick={() => navigateToFeature('dpr')} style={{ cursor: 'pointer' }}>
                    <div className="cf-item-check" />
                    <div className="cf-item-details">
                      <strong>{labels.step2Title}</strong>
                      <span className="cf-tag gold">2</span>
                    </div>
                  </div>

                  <div className="cf-board-item" onClick={() => navigateToFeature('documents')} style={{ cursor: 'pointer' }}>
                    <div className="cf-item-check" />
                    <div className="cf-item-details">
                      <strong>{labels.step3Title}</strong>
                      <span className="cf-tag purple">3</span>
                    </div>
                  </div>

                  <div className="cf-board-item" onClick={() => navigateToFeature('partners')} style={{ cursor: 'pointer' }}>
                    <div className="cf-item-check" />
                    <div className="cf-item-details">
                      <strong>{labels.step4Title}</strong>
                      <span className="cf-tag green">4</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="cf-board-btn"
                  onClick={() => navigateToFeature('roadmap')}
                >
                  <span>{labels.viewFullRoadmap}</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="cf-doodle-lines right" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
