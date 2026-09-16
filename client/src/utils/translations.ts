import { SupportedLanguage } from '../types';

export interface Translations {
  appTitle: string;
  appSubTitle: string;
  sponsoringMinistry: string;
  sihProblemStatement: string;
  nav: {
    signIn: string;
    createAccount: string;
    landingPage: string;
    workspace: string;
    signOut: string;
  };
  landing: {
    heroKicker: string;
    heroHeadingLine1: string;
    heroHeadingLine2: string;
    heroCursorTag: string;
    heroSubtitle: string;
    
    superpoweredTitleLine1: string;
    superpoweredTitleLine2: string;
    superpoweredTitleLine3: string;
    superpoweredSubtitle: string;
    
    connectedTitlePrefix: string;
    connectedTitleHighlight: string;
    connectedTitleSuffix: string;
    connectedSubtitle: string;

    dashboardTitleLine1: string;
    dashboardTitleHighlight: string;
    dashboardSubtitle: string;

    bottomCtaHeadingLine1: string;
    bottomCtaHeadingLine2: string;
    bottomCtaSubheading: string;
    bottomCtaSignUp: string;
    bottomCtaDownload: string;
    bottomCtaOpenWorkspace: string;
  };
  tabs: {
    matcher: string;
    dpr: string;
    documents: string;
    comparison: string;
    roadmap: string;
  };
  hero: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    tagline: string;
    personaTitle: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
    stat4Label: string;
  };
  wizard: {
    title: string;
    subtitle: string;
    personalTab: string;
    businessTab: string;
    docsTab: string;
    nameLabel: string;
    ageLabel: string;
    categoryLabel: string;
    genderLabel: string;
    locationLabel: string;
    incomeLabel: string;
    sectorLabel: string;
    loanLabel: string;
    projectCostLabel: string;
    marginLabel: string;
    matchButton: string;
    calculatingText: string;
  };
  results: {
    topMatchesTitle: string;
    matchScore: string;
    maxSubsidy: string;
    ownContribution: string;
    estimatedEmi: string;
    whyMatched: string;
    conditions: string;
    missingDocs: string;
    applyPortal: string;
    viewDetails: string;
    addToCompare: string;
    inComparison: string;
    listenAudio: string;
  };
  copilot: {
    title: string;
    subtitle: string;
    placeholder: string;
    sendBtn: string;
    listening: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  // -------------------------------------------------------------
  // 1. ENGLISH
  // -------------------------------------------------------------
  en: {
    appTitle: 'SchemeMatch',
    appSubTitle: 'AI Scheme Matching & Application Copilot for Marginalized Entrepreneurs',
    sponsoringMinistry: 'Ministry of Social Justice and Empowerment (MoSJE) & MSME',
    sihProblemStatement: 'AI-Driven Scheme Matching for Marginalized Entrepreneurs',
    nav: {
      signIn: 'Sign In',
      createAccount: 'Create Free Account',
      landingPage: 'Landing Page',
      workspace: 'Dashboard',
      signOut: 'Sign Out'
    },
    landing: {
      heroKicker: 'YOUR NEW SCHEME ENGINE',
      heroHeadingLine1: 'The scheme',
      heroHeadingLine2: 'you need to match',
      heroCursorTag: 'Saathi AI',
      heroSubtitle: 'SchemeMatch empowers marginalized entrepreneurs with intelligent scheme matching, up to 35% capital subsidies, concessional credit, and bank-ready DPRs.',
      superpoweredTitleLine1: 'A superpowered',
      superpoweredTitleLine2: 'pathway in every',
      superpoweredTitleLine3: 'scheme match',
      superpoweredSubtitle: 'SchemeMatch transforms government schemes into bank-ready opportunities designed to unlock the perfect capital subsidy and loan sanction in seconds.',
      connectedTitlePrefix: 'Leave',
      connectedTitleHighlight: 'every',
      connectedTitleSuffix: 'application feeling Confident',
      connectedSubtitle: 'Never lose track of a deadline or miss an eligibility requirement. SchemeMatch keeps you and your enterprise organized before, during, and after every application.',
      dashboardTitleLine1: 'All in one dashboard,',
      dashboardTitleHighlight: "that's a joy to use",
      dashboardSubtitle: 'An entire government scheme matching & DPR generation platform built inside a fast and modern interface you and your business will love.',
      bottomCtaHeadingLine1: "It's time.",
      bottomCtaHeadingLine2: 'Get SchemeMatched',
      bottomCtaSubheading: "Your enterprise has the power to shape your future. Don't settle for missed capital subsidies or endless bureaucratic delays. Get SchemeMatched, and let's shape the future of entrepreneurship and capital access together.",
      bottomCtaSignUp: 'Sign Up Free',
      bottomCtaDownload: 'Download Scheme Guide',
      bottomCtaOpenWorkspace: 'Open Dashboard'
    },
    tabs: {
      matcher: 'AI Scheme Matcher',
      dpr: 'Bank-Ready DPR Generator',
      documents: 'Document Readiness Scanner',
      comparison: 'Scheme Comparison',
      roadmap: 'Application Navigator'
    },
    hero: {
      badge: 'National Scheme Intelligence Platform',
      titleMain: 'Empowering Marginalized Entrepreneurs with',
      titleHighlight: 'Explainable AI Scheme Intelligence',
      tagline: 'Tailored government scheme discovery, capital subsidies up to 35%, 4% concessional credit, bank-acceptable Detailed Project Reports, and voice guidance.',
      personaTitle: 'Try Real Entrepreneur Scenarios:',
      stat1Label: 'Schemes Indexed',
      stat2Label: 'Max Capital Subsidy',
      stat3Label: 'Lowest Interest Rate',
      stat4Label: 'Apex Corporations'
    },
    wizard: {
      title: 'Personalized Eligibility Assessment',
      subtitle: 'Answer a few quick questions to unlock matching schemes, calculated subsidy amounts, and customized next steps.',
      personalTab: '1. Demographics & Category',
      businessTab: '2. Business & Capital',
      docsTab: '3. Existing Documents',
      nameLabel: 'Full Name',
      ageLabel: 'Age (Years)',
      categoryLabel: 'Social Category',
      genderLabel: 'Gender',
      locationLabel: 'Location Domicile',
      incomeLabel: 'Annual Household Income (₹)',
      sectorLabel: 'Business Sector / Trade',
      loanLabel: 'Required Loan Amount (₹)',
      projectCostLabel: 'Total Project Cost (₹)',
      marginLabel: 'Own Contribution Available (₹)',
      matchButton: 'Calculate Eligible Schemes & Subsidies',
      calculatingText: 'Evaluating 23+ Schemes with SchemeMatch AI...'
    },
    results: {
      topMatchesTitle: 'Top Recommended Schemes For You',
      matchScore: 'Match Probability',
      maxSubsidy: 'Eligible Capital Subsidy',
      ownContribution: 'Min. Margin Money',
      estimatedEmi: 'Est. Monthly EMI',
      whyMatched: 'Why You Matched (Explainable AI)',
      conditions: 'Conditions to Satisfy',
      missingDocs: 'Missing Documents',
      applyPortal: 'Official Portal Link',
      viewDetails: 'Deep-Dive Scheme Insights',
      addToCompare: 'Compare Scheme',
      inComparison: 'Added to Compare',
      listenAudio: 'Listen Voice Summary'
    },
    copilot: {
      title: 'Saathi AI',
      subtitle: 'Ask in English, Hindi, or Hinglish',
      placeholder: 'E.g., I am an SC woman weaver in Varanasi, need ₹2.5 Lakh loan...',
      sendBtn: 'Ask Saathi AI',
      listening: 'Listening to your voice...'
    }
  },

  // -------------------------------------------------------------
  // 2. HINDI (हिन्दी)
  // -------------------------------------------------------------
  hi: {
    appTitle: 'SchemeMatch (स्कीममैच)',
    appSubTitle: 'हाशिए के उद्यमियों के लिए एआई-संचालित योजना चयन एवं आवेदन सहायता',
    sponsoringMinistry: 'सामाजिक न्याय और अधिकारिता मंत्रालय (MoSJE) एवं MSME',
    sihProblemStatement: 'वंचित उद्यमियों के लिए एआई आधारित योजना चयन',
    nav: {
      signIn: 'साइन इन करें',
      createAccount: 'निःशुल्क खाता बनाएं',
      landingPage: 'मुख्य पृष्ठ',
      workspace: 'डैशबोर्ड',
      signOut: 'लॉग आउट'
    },
    landing: {
      heroKicker: 'आपका नया सरकारी योजना इंजन',
      heroHeadingLine1: 'वह योजना',
      heroHeadingLine2: 'जो आपके व्यवसाय के अनुकूल है',
      heroCursorTag: 'साथी AI',
      heroSubtitle: 'स्कीममैच वंचित उद्यमियों को बुद्धिमत्तापूर्ण योजना मिलान, 35% तक पूंजी सब्सिडी, रियायती ऋण और बैंक-स्वीकार्य DPR से सशक्त बनाता है।',
      superpoweredTitleLine1: 'हर योजना मिलान में',
      superpoweredTitleLine2: 'एक सशक्त व पारदर्शी',
      superpoweredTitleLine3: 'सहयोग',
      superpoweredSubtitle: 'स्कीममैच सरकारी योजनाओं को बैंक-स्वीकार्य अवसरों में बदलकर मात्र कुछ सेकंड में अधिकतम पूंजी सब्सिडी और ऋण मंजूरी सुनिश्चित करता है।',
      connectedTitlePrefix: 'हर',
      connectedTitleHighlight: 'आवेदन',
      connectedTitleSuffix: 'में पूर्ण आत्मविश्वास महसूस करें',
      connectedSubtitle: 'कभी भी समय-सीमा या पात्रता की शर्त न भूलें। स्कीममैच आपके व्यवसाय और आवेदनों को पूरी तरह व्यवस्थित रखता है।',
      dashboardTitleLine1: 'सब कुछ एक ही डैशबोर्ड में,',
      dashboardTitleHighlight: 'जिसका उपयोग करना अत्यंत सरल है',
      dashboardSubtitle: 'एक आधुनिक और तीव्र मंच, जो सरकारी योजना चयन और बैंक-स्वीकार्य डीपीआर तैयार करने में आपकी सहायता करता है।',
      bottomCtaHeadingLine1: 'यही सही समय है।',
      bottomCtaHeadingLine2: 'स्कीममैच से जुड़ें',
      bottomCtaSubheading: 'आपके उद्यम में आपके भविष्य को बदलने की शक्ति है। सब्सिडी या लालफीताशाही के कारण अवसर न गंवाएं। आज ही स्कीममैच से जुड़कर अपनी सफलता सुनिश्चित करें।',
      bottomCtaSignUp: 'निःशुल्क पंजीकरण करें',
      bottomCtaDownload: 'योजना मार्गदर्शिका डाउनलोड करें',
      bottomCtaOpenWorkspace: 'डैशबोर्ड खोलें'
    },
    tabs: {
      matcher: 'एआई योजना मिलान',
      dpr: 'बैंक-प्रोजेक्ट रिपोर्ट (DPR)',
      documents: 'दस्तावेज तैयारी स्कैनर',
      comparison: 'योजना तुलना',
      roadmap: 'आवेदन प्रक्रिया मार्गदर्शक'
    },
    hero: {
      badge: 'राष्ट्रीय योजना मार्गदर्शन मंच',
      titleMain: 'हाशिए पर रहने वाले उद्यमियों का सशक्तिकरण,',
      titleHighlight: 'पारदर्शी एआई योजना मार्गदर्शन के साथ',
      tagline: '35% तक पूंजीगत सब्सिडी, 4% से रियायती ब्याज दर, बैंक-स्वीकार्य विस्तृत परियोजना रिपोर्ट और अपनी भाषा में आवाज सहायता।',
      personaTitle: 'वास्तविक उद्यमी परिदृश्यों को आजमाएं:',
      stat1Label: 'सत्यापित योजनाएं',
      stat2Label: 'अधिकतम सरकारी सब्सिडी',
      stat3Label: 'न्यूनतम ब्याज दर',
      stat4Label: 'MoSJE शीर्ष निगम'
    },
    wizard: {
      title: 'व्यक्तिगत पात्रता मूल्यांकन',
      subtitle: 'कुछ आसान प्रश्नों के उत्तर दें और अपने लिए सबसे उपयुक्त योजनाओं, सब्सिडी राशि और अगले कदमों की जानकारी प्राप्त करें।',
      personalTab: '१. व्यक्तिगत विवरण व जाति वर्ग',
      businessTab: '२. व्यवसाय व ऋण आवश्यकता',
      docsTab: '३. उपलब्ध दस्तावेज',
      nameLabel: 'पूरा नाम',
      ageLabel: 'आयु (वर्ष)',
      categoryLabel: 'सामाजिक श्रेणी / वर्ग',
      genderLabel: 'लिंग',
      locationLabel: 'क्षेत्र प्रकार (ग्रामीण / शहरी)',
      incomeLabel: 'वार्षिक पारिवारिक आय (₹)',
      sectorLabel: 'व्यवसाय क्षेत्र / ट्रेड',
      loanLabel: 'अपेक्षित ऋण राशि (₹)',
      projectCostLabel: 'कुल परियोजना लागत (₹)',
      marginLabel: 'स्वयं का उपलब्ध अंशदान (₹)',
      matchButton: 'पात्र योजनाएं और सब्सिडी देखें',
      calculatingText: 'स्कीममैच एआई द्वारा 23+ योजनाओं का विश्लेषण किया जा रहा है...'
    },
    results: {
      topMatchesTitle: 'आपके लिए सर्वश्रेष्ठ अनुशंसित योजनाएं',
      matchScore: 'मिलान संभावना',
      maxSubsidy: 'अनुमानित सरकारी सब्सिडी',
      ownContribution: 'न्यूनतम स्वयं का अंशदान',
      estimatedEmi: 'अनुमानित मासिक किस्त (EMI)',
      whyMatched: 'मिलान के मुख्य कारण (एआई व्याख्या)',
      conditions: 'अनिवार्य शर्तें',
      missingDocs: 'अपेक्षित दस्तावेज',
      applyPortal: 'आधिकारिक सरकारी पोर्टल',
      viewDetails: 'योजना का विस्तृत विवरण',
      addToCompare: 'तुलना करें',
      inComparison: 'तुलना में शामिल',
      listenAudio: 'आवाज में विवरण सुनें'
    },
    copilot: {
      title: 'साथी (Saathi) AI',
      subtitle: 'हिंदी, अंग्रेजी या हिंग्लिश में पूछें',
      placeholder: 'जैसे: मैं वाराणसी से एससी महिला बुनकर हूं, मुझे ₹2.5 लाख ऋण चाहिए...',
      sendBtn: 'पूछें',
      listening: 'आपकी आवाज सुनी जा रही है...'
    }
  },

  // -------------------------------------------------------------
  // 3. TELUGU (తెలుగు) — Replaced Tamil (ta -> te)
  // -------------------------------------------------------------
  te: {
    appTitle: 'SchemeMatch (స్కీమ్‌మ్యాచ్)',
    appSubTitle: 'అణగారిన వర్గాల వ్యవస్థాపకుల కోసం AI ఆధారిత పథకాల గుర్తింపు & దరఖాస్తు సహాయం',
    sponsoringMinistry: 'సామాజిక న్యాయం మరియు సాధికారత మంత్రిత్వ శాఖ (MoSJE)',
    sihProblemStatement: 'అణగారిన వ్యవస్థాపకుల కోసం AI ఆధారిత పథక సరిపోలిక',
    nav: {
      signIn: 'సైన్ ఇన్',
      createAccount: 'ఉచిత ఖాతా తెరవండి',
      landingPage: 'హోమ్‌పేజీ',
      workspace: 'డ్యాష్‌బోర్డ్',
      signOut: 'లాగ్ అవుట్'
    },
    landing: {
      heroKicker: 'మీ నూతన ప్రభుత్వ పథకాల వేదిక',
      heroHeadingLine1: 'మీ వ్యాపారానికి సరిపోయే',
      heroHeadingLine2: 'ఉత్తమ ప్రభుత్వ పథకం',
      heroCursorTag: 'సాథీ AI',
      heroSubtitle: 'స్కీయ్‌మ్‌మ్యాచ్ అణగారిన పారిశ్రామికవేత్తలకు 35% వరకు సబ్సిడీ, రాయితీ రుణాలు మరియు బ్యాంక్-రెడీ DPRలను అందిస్తుంది.',
      superpoweredTitleLine1: 'ప్రతి పథక సరిపోలికలోనూ',
      superpoweredTitleLine2: 'అద్భుతమైన',
      superpoweredTitleLine3: 'సహాయక శక్తి',
      superpoweredSubtitle: 'స్కీయ్‌మ్‌మ్యాచ్ ప్రభుత్వ పథకాలను సెకన్లలో సరైన మూలధన సబ్సిడీ మరియు రుణ మంజూరును అన్‌లాక్ చేసేలా మారుస్తుంది.',
      connectedTitlePrefix: 'ప్రతి',
      connectedTitleHighlight: 'దరఖాస్తును',
      connectedTitleSuffix: 'పూర్తి ఆత్మవిశ్వాసంతో సమర్పించండి',
      connectedSubtitle: 'గడువు తేదీలు లేదా అర్హత నిబంధనలను ఎప్పటికీ మర్చిపోకండి. స్కీమ్‌మ్యాచ్ మీ దరఖాస్తులను సంపూర్ణంగా నిర్వహిస్తుంది.',
      dashboardTitleLine1: 'అన్నీ ఒకే డాష్‌బోర్డ్‌లో,',
      dashboardTitleHighlight: 'ఉపయోగించడం ఎంతో సులభం',
      dashboardSubtitle: 'వేగవంతమైన మరియు ఆధునిక డాష్‌బోర్డ్ లోపల రూపొందించబడిన పూర్తి ప్రభుత్వ పథకాల సరిపోలిక & DPR వేదిక.',
      bottomCtaHeadingLine1: 'ఇదే సరైన సమయం.',
      bottomCtaHeadingLine2: 'స్కీమ్‌మ్యాచ్‌తో ప్రారంభించండి',
      bottomCtaSubheading: 'మీ వ్యాపారానికి మీ భవిష్యత్తును మార్చే శక్తి ఉంది. సబ్సిడీలను కోల్పోకండి లేదా కార్యాలయ జాప్యాలకు గురికాకండి. ఈరోజే ఉచితంగా నమోదు చేసుకోండి.',
      bottomCtaSignUp: 'ఉచితంగా సైన్ అప్ చేయండి',
      bottomCtaDownload: 'పథక గైడ్ డౌన్‌లోడ్ చేసుకోండి',
      bottomCtaOpenWorkspace: 'డాష్‌బోర్డ్ తెరవండి'
    },
    tabs: {
      matcher: 'AI పథక సరిపోలిక',
      dpr: 'బ్యాంక్ ప్రాజెక్ట్ నివేదిక (DPR)',
      documents: 'పత్రాల సంసిద్ధత స్కానర్',
      comparison: 'పథకాల పోలిక',
      roadmap: 'దరఖాస్తు మార్గదర్శి'
    },
    hero: {
      badge: 'జాతీయ పథక సమాచార వేదిక',
      titleMain: 'అణగారిన వ్యవస్థాపకులకు సాధికారత,',
      titleHighlight: 'AI పథక సమాచార వ్యవస్థతో',
      tagline: '35% వరకు మూలధన సబ్సిడీ, 4% రాయితీ వడ్డీ రేటు, బ్యాంక్ ఆమోదిత ప్రాజెక్ట్ నివేదిక మరియు మీ భాషలో సహాయం.',
      personaTitle: 'వాస్తవ వ్యవస్థాపక ప్రొఫైల్స్ చూడండి:',
      stat1Label: 'లభ్యమయ్యే పథకాలు',
      stat2Label: 'గరిష్ట సబ్సిడీ',
      stat3Label: 'కనిష్ట వడ్డీ రేటు',
      stat4Label: 'MoSJE కార్పొరేషన్లు'
    },
    wizard: {
      title: 'వ్యక్తిగత అర్హత అంచనా',
      subtitle: 'కొన్ని ప్రశ్నలకు సమాధానమిచ్చి మీకు సరిపోయే ప్రభుత్వ పథకాలు మరియు సబ్సిడీలను కనుగొనండి.',
      personalTab: '1. వ్యక్తిగత వివరాలు & వర్గం',
      businessTab: '2. వ్యాపారం & మూలధన అవసరం',
      docsTab: '3. అందుబాటులో ఉన్న పత్రాలు',
      nameLabel: 'పూర్తి పేరు',
      ageLabel: 'వయస్సు',
      categoryLabel: 'సామాజిక వర్గం',
      genderLabel: 'లింగం',
      locationLabel: 'ప్రాంతం (గ్రామీణ / పట్టణ)',
      incomeLabel: 'వార్షిక కుటుంబ ఆదాయం (₹)',
      sectorLabel: 'వ్యాపార రంగం / వృత్తి',
      loanLabel: 'అవసరమైన రుణ మొత్తం (₹)',
      projectCostLabel: 'మొత్తం ప్రాజెక్ట్ వ్యయం (₹)',
      marginLabel: 'స్వంత పెట్టుబడి (₹)',
      matchButton: 'అర్హతగల పథకాలు & సబ్సిడీలను లెక్కించండి',
      calculatingText: '23+ పథకాలను విశ్లేషిస్తోంది...'
    },
    results: {
      topMatchesTitle: 'మీ కోసం ఉత్తమంగా సరిపోయే పథకాలు',
      matchScore: 'సరిపోలిక శాతం',
      maxSubsidy: 'అర్హతగల సబ్సిడీ',
      ownContribution: 'స్వంత వాటా',
      estimatedEmi: 'అంచనా వేసిన నెలవారీ EMI',
      whyMatched: 'పథకం సరిపోవడానికి కారణాలు',
      conditions: 'నెరవేర్చవలసిన నిబంధనలు',
      missingDocs: 'అవసరమైన పత్రాలు',
      applyPortal: 'అధికారిక పోర్టల్ లింక్',
      viewDetails: 'పూర్తి వివరాలు',
      addToCompare: 'పోల్చి చూడండి',
      inComparison: 'పోలికలో జోడించబడింది',
      listenAudio: 'ఆడియో వినండి'
    },
    copilot: {
      title: 'సాథీ (Saathi) AI',
      subtitle: 'తెలుగు లేదా ఇంగ్లీషులో అడగండి',
      placeholder: 'ఉదా: నాకు వారణాసిలో నేత వ్యాపారానికి ₹2.5 లక్షల రుణం కావాలి...',
      sendBtn: 'అడగండి',
      listening: 'మీ స్వరం వింటోంది...'
    }
  },

  // -------------------------------------------------------------
  // 4. PUNJABI (ਪੰਜਾਬੀ) — Newly Added (pa)
  // -------------------------------------------------------------
  pa: {
    appTitle: 'SchemeMatch (ਸਕੀਮਮੈਚ)',
    appSubTitle: 'ਵਾਂਝੇ ਉੱਦਮੀਆਂ ਲਈ AI-ਅਧਾਰਿਤ ਸਰਕਾਰੀ ਸਕੀਮ ਚੋਣ ਅਤੇ ਸਹਾਇਤਾ ਮੰਚ',
    sponsoringMinistry: 'ਸਮਾਜਿਕ ਨਿਆਂ ਅਤੇ ਅਧਿਕਾਰਤਾ ਮੰਤਰਾਲਾ (MoSJE) ਅਤੇ MSME',
    sihProblemStatement: 'ਵਾਂਝੇ ਉੱਦਮੀਆਂ ਲਈ AI-ਅਧਾਰਿਤ ਸਕੀਮ ਮੈਚਿੰਗ',
    nav: {
      signIn: 'ਸਾਈਨ ਇਨ',
      createAccount: 'ਮੁਫ਼ਤ ਖਾਤਾ ਬਣਾਓ',
      landingPage: 'ਮੁੱਖ ਪੰਨਾ',
      workspace: 'ਡੈਸ਼ਬੋਰਡ',
      signOut: 'ਲਾਗ ਆਊਟ'
    },
    landing: {
      heroKicker: 'ਤੁਹਾਡਾ ਨਵਾਂ ਸਰਕਾਰੀ ਸਕੀਮ ਇੰਜਨ',
      heroHeadingLine1: 'ਉਹ ਸਕੀਮ',
      heroHeadingLine2: 'ਜੋ ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ ਦੇ ਅਨੁਕੂਲ ਹੈ',
      heroCursorTag: 'ਸਾਥੀ AI',
      heroSubtitle: 'ਸਕੀਮਮੈਚ ਕਮਜ਼ੋਰ ਉੱਦਮੀਆਂ ਨੂੰ 35% ਤੱਕ ਪੂੰਜੀ ਸਬਸਿਡੀ, ਰਿਆਇਤੀ ਕਰਜ਼ੇ ਅਤੇ ਬੈਂਕ-ਤਿਆਰ DPR ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।',
      superpoweredTitleLine1: 'ਹਰ ਸਕੀਮ ਮੈਚ ਵਿੱਚ',
      superpoweredTitleLine2: 'ਇੱਕ ਸ਼ਕਤੀਸ਼ਾਲੀ ਤੇ ਸਪਸ਼ਟ',
      superpoweredTitleLine3: 'ਸਹਿਯੋਗ',
      superpoweredSubtitle: 'ਸਕੀਮਮੈਚ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਨੂੰ ਬੈਂਕ-ਤਿਆਰ ਮੌਕਿਆਂ ਵਿੱਚ ਬਦਲਦਾ ਹੈ ਤਾਂ ਜੋ ਸਕਿੰਟਾਂ ਵਿੱਚ ਪੂੰਜੀ ਸਬਸਿਡੀ ਅਤੇ ਕਰਜ਼ੇ ਦੀ ਪ੍ਰਵਾਨਗੀ ਮਿਲ ਸਕੇ।',
      connectedTitlePrefix: 'ਹਰ',
      connectedTitleHighlight: 'ਅਰਜ਼ੀ',
      connectedTitleSuffix: 'ਪੂਰੇ ਵਿਸ਼ਵਾਸ ਨਾਲ ਜਮ੍ਹਾਂ ਕਰੋ',
      connectedSubtitle: 'ਕਦੇ ਵੀ ਅੰਤਿਮ ਮਿਤੀ ਜਾਂ ਯੋਗਤਾ ਸ਼ਰਤਾਂ ਨਾ ਭੁੱਲੋ। ਸਕੀਮਮੈਚ ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ ਅਤੇ ਅਰਜ਼ੀਆਂ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੰਗਠਿਤ ਰੱਖਦਾ ਹੈ।',
      dashboardTitleLine1: 'ਸਭ ਕੁਝ ਇੱਕੋ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ,',
      dashboardTitleHighlight: 'ਜਿਸਨੂੰ ਵਰਤਣਾ ਬੇਹੱਦ ਆਸਾਨ ਹੈ',
      dashboardSubtitle: 'ਸਰਕਾਰੀ ਸਕੀਮ ਮਿਲਾਨ ਅਤੇ ਡੀਪੀਆਰ ਜਨਰੇਸ਼ਨ ਪਲੇਟਫਾਰਮ ਜੋ ਤੇਜ਼ ਅਤੇ ਆਧੁਨਿਕ ਡੈਸ਼ਬੋਰਡ ਅੰਦਰ ਬਣਿਆ ਹੈ।',
      bottomCtaHeadingLine1: 'ਇਹੀ ਸਹੀ ਸਮਾਂ ਹੈ।',
      bottomCtaHeadingLine2: 'ਸਕੀਮਮੈਚ ਨਾਲ ਜੁੜੋ',
      bottomCtaSubheading: 'ਤੁਹਾਡੇ ਉੱਦਮ ਵਿੱਚ ਤੁਹਾਡਾ ਭਵਿੱਖ ਬਦਲਣ ਦੀ ਸਮਰੱਥਾ ਹੈ। ਸਬਸਿਡੀ ਗੁਆਉਣ ਜਾਂ ਸਰਕਾਰੀ ਦੇਰੀ ਤੋਂ ਬਚੋ। ਅੱਜ ਹੀ ਮੁਫ਼ਤ ਰਜਿਸਟਰ ਕਰੋ।',
      bottomCtaSignUp: 'ਮੁਫ਼ਤ ਰਜਿਸਟਰ ਕਰੋ',
      bottomCtaDownload: 'ਸਕੀਮ ਗਾਈਡ ਡਾਊਨਲੋਡ ਕਰੋ',
      bottomCtaOpenWorkspace: 'ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ'
    },
    tabs: {
      matcher: 'AI ਸਕੀਮ ਮੈਚਰ',
      dpr: 'ਬੈਂਕ ਪ੍ਰੋਜੈਕਟ ਰਿਪੋਰਟ (DPR)',
      documents: 'ਦਸਤਾਵੇਜ਼ ਤਿਆਰੀ ਸਕੈਨਰ',
      comparison: 'ਸਕੀਮ ਤੁਲਨਾ',
      roadmap: 'ਅਰਜ਼ੀ ਪ੍ਰਕਿਰਿਆ ਗਾਈਡ'
    },
    hero: {
      badge: 'ਰਾਸ਼ਟਰੀ ਸਕੀਮ ਜਾਣਕਾਰੀ ਮੰਚ',
      titleMain: 'ਵਾਂਝੇ ਉੱਦਮੀਆਂ ਦਾ ਸਸ਼ਕਤੀਕਰਨ,',
      titleHighlight: 'ਸਮਾਰਟ AI ਸਕੀਮ ਜਾਣਕਾਰੀ ਨਾਲ',
      tagline: '35% ਤੱਕ ਪੂੰਜੀ ਸਬਸਿਡੀ, 4% ਰਿਆਇਤੀ ਵਿਆਜ ਦਰ, ਬੈਂਕ-ਮਨਜ਼ੂਰ ਪ੍ਰੋਜੈਕਟ ਰਿਪੋਰਟ ਅਤੇ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਹਾਇਤਾ।',
      personaTitle: 'ਅਸਲ ਉੱਦਮੀ ਉਦਾਹਰਣਾਂ ਦੇਖੋ:',
      stat1Label: 'ਸੂਚੀਬੱਧ ਸਕੀਮਾਂ',
      stat2Label: 'ਵੱਧ ਤੋਂ ਵੱਧ ਸਬਸਿਡੀ',
      stat3Label: 'ਘੱਟੋ-ਘੱਟ ਵਿਆਜ ਦਰ',
      stat4Label: 'MoSJE ਕਾਰਪੋਰੇਸ਼ਨਾਂ'
    },
    wizard: {
      title: 'ਨਿੱਜੀ ਯੋਗਤਾ ਮੁਲਾਂਕਣ',
      subtitle: 'ਕੁਝ ਆਸਾਨ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ ਅਤੇ ਆਪਣੇ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵੀਆਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ ਦੀ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ।',
      personalTab: '੧. ਨਿੱਜੀ ਵੇਰਵੇ ਅਤੇ ਵਰਗ',
      businessTab: '੨. ਕਾਰੋਬਾਰ ਅਤੇ ਕਰਜ਼ਾ ਲੋੜ',
      docsTab: '੩. ਉਪਲਬਧ ਦਸਤਾਵੇਜ਼',
      nameLabel: 'ਪੂਰਾ ਨਾਮ',
      ageLabel: 'ਉਮਰ (ਸਾਲ)',
      categoryLabel: 'ਸਮਾਜਿਕ ਵਰਗ',
      genderLabel: 'ਲਿੰਗ',
      locationLabel: 'ਖੇਤਰ (ਪੇਂਡੂ / ਸ਼ਹਿਰੀ)',
      incomeLabel: 'ਸਾਲਾਨਾ ਪਰਿਵਾਰਕ ਆਮਦਨ (₹)',
      sectorLabel: 'ਕਾਰੋਬਾਰੀ ਖੇਤਰ / ਕਿੱਤਾ',
      loanLabel: 'ਲੋੜੀਂਦੀ ਕਰਜ਼ਾ ਰਕਮ (₹)',
      projectCostLabel: 'ਕੁੱਲ ਪ੍ਰੋਜੈਕਟ ਲਾਗਤ (₹)',
      marginLabel: 'ਆਪਣਾ ਨਿਵੇਸ਼ (₹)',
      matchButton: 'ਯੋਗ ਸਕੀਮਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ ਦੇਖੋ',
      calculatingText: '23+ ਸਕੀਮਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...'
    },
    results: {
      topMatchesTitle: 'ਤੁਹਾਡੇ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਸਕੀਮਾਂ',
      matchScore: 'ਮੈਚ ਸੰਭਾਵਨਾ',
      maxSubsidy: 'ਅਨੁਮਾਨਿਤ ਸਰਕਾਰੀ ਸਬਸਿਡੀ',
      ownContribution: 'ਆਪਣਾ ਹਿੱਸਾ',
      estimatedEmi: 'ਅਨੁਮਾਨਿਤ ਮਾਸਿਕ ਕਿਸ਼ਤ (EMI)',
      whyMatched: 'ਸਕੀਮ ਮੈਚ ਹੋਣ ਦੇ ਕਾਰਨ',
      conditions: 'ਜ਼ਰੂਰੀ ਸ਼ਰਤਾਂ',
      missingDocs: 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼',
      applyPortal: 'ਅਧਿਕਾਰਤ ਪੋਰਟਲ ਲਿੰਕ',
      viewDetails: 'ਪੂਰਾ ਵੇਰਵਾ ਦੇਖੋ',
      addToCompare: 'ਤੁਲਨਾ ਕਰੋ',
      inComparison: 'ਤੁਲਨਾ ਵਿੱਚ ਸ਼ਾਮਲ',
      listenAudio: 'ਆਵਾਜ਼ ਸੁਣੋ'
    },
    copilot: {
      title: 'ਸਾਥੀ (Saathi) AI',
      subtitle: 'ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪੁੱਛੋ',
      placeholder: 'ਉਦਾਹਰਣ ਵਜੋਂ: ਮੈਨੂੰ ਛੋਟੇ ਕਾਰੋਬਾਰ ਲਈ ₹2 ਲੱਖ ਦਾ ਕਰਜ਼ਾ ਚਾਹੀਦਾ ਹੈ...',
      sendBtn: 'ਪੁੱਛੋ',
      listening: 'ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸੁਣੀ ਜਾ ਰਹੀ ਹੈ...'
    }
  },

  // -------------------------------------------------------------
  // 5. MARATHI (मराठी)
  // -------------------------------------------------------------
  mr: {
    appTitle: 'SchemeMatch (स्कीममॅच)',
    appSubTitle: 'वंचित व दुर्बल घटकांतील उद्योजकांसाठी एआय योजना निवड व सहाय्य',
    sponsoringMinistry: 'सामाजिक न्याय व सक्षमीकरण मंत्रालय (MoSJE) व MSME',
    sihProblemStatement: 'दुर्बल घटकांतील उद्योजकांसाठी एआय योजना निवड',
    nav: {
      signIn: 'साइन इन करा',
      createAccount: 'मोफत खाते उघडा',
      landingPage: 'मुख्य पृष्ठ',
      workspace: 'डॅशबोर्ड',
      signOut: 'लॉग आउट'
    },
    landing: {
      heroKicker: 'तुमचे नवीन शासकीय योजना इंजिन',
      heroHeadingLine1: 'ती शासकीय योजना',
      heroHeadingLine2: 'जी तुमच्या व्यवसायाला योग्य आहे',
      heroCursorTag: 'साथी AI',
      heroSubtitle: 'स्कीममॅच वंचित उद्योजकांना बुद्धिमत्तापूर्ण योजना जुळवणी, 35% पर्यंत भांडवली अनुदान, सवलतीचे कर्ज आणि बँक-सज्ज DPR द्वारे सक्षम करते.',
      superpoweredTitleLine1: 'प्रत्येक योजना जुळणीत',
      superpoweredTitleLine2: 'एक सक्षम व पारदर्शक',
      superpoweredTitleLine3: 'सहकार्य',
      superpoweredSubtitle: 'स्कीममॅच सरकारी योजनांना बँक-सज्ज संधींमध्ये बदलते जेणेकरून काही सेकंदात भांडवली अनुदान आणि कर्ज मंजुरी मिळेल.',
      connectedTitlePrefix: 'प्रत्येक',
      connectedTitleHighlight: 'अर्ज',
      connectedTitleSuffix: 'पूर्ण आत्मविश्वासाने सादर करा',
      connectedSubtitle: 'मुदत किंवा पात्रतेची अट कधीही विसरू नका. स्कीममॅच तुमचे अर्ज व व्यवसाय पूर्णपणे व्यवस्थापित ठेवते.',
      dashboardTitleLine1: 'सर्व एकाच डॅशबोर्डमध्ये,',
      dashboardTitleHighlight: 'वापरण्यास अत्यंत सोपे',
      dashboardSubtitle: 'एक संपूर्ण सरकारी योजना जुळवणी आणि डीपीआर निर्मिती प्लॅटफॉर्म, जो वेगवान आणि आधुनिक आहे.',
      bottomCtaHeadingLine1: 'हीच योग्य वेळ आहे.',
      bottomCtaHeadingLine2: 'स्कीममॅचशी जोडा',
      bottomCtaSubheading: 'तुमच्या उद्योगात तुमचे भविष्य घडवण्याची ताकद आहे. अनुदान गमावू नका. आजच मोफत नोंदणी करा आणि व्यवसायाला नवी दिशा द्या.',
      bottomCtaSignUp: 'मोफत नोंदणी करा',
      bottomCtaDownload: 'योजना मार्गदर्शिका डाउनलोड करा',
      bottomCtaOpenWorkspace: 'डॅशबोर्ड उघडा'
    },
    tabs: {
      matcher: 'एआय योजना शोध',
      dpr: 'बँक-प्रकल्प अहवाल (DPR)',
      documents: 'कागदपत्रे तपासणी',
      comparison: 'योजना तुलना',
      roadmap: 'अर्ज प्रक्रिया मार्गदर्शक'
    },
    hero: {
      badge: 'राष्ट्रीय योजना सहाय्य मंच',
      titleMain: 'वंचित घटकांतील नवउद्योजकांचे सक्षमीकरण,',
      titleHighlight: 'एआय आधारित शासकीय योजना सहाय्याने',
      tagline: '३५% पर्यंत अनुदान, ४% सवलतीचे व्याजदर, बँक-मान्य डीपीआर आणि आवाजी मार्गदर्शन.',
      personaTitle: 'उद्योजक उदाहरणे निवडा:',
      stat1Label: 'समाविष्ट योजना',
      stat2Label: 'कमाल सरकारी अनुदान',
      stat3Label: 'किमान व्याजदर',
      stat4Label: 'MoSJE महामंडळे'
    },
    wizard: {
      title: 'वैयक्तिक पात्रता तपासणी',
      subtitle: 'आपल्या व्यवसायानुसार योग्य शासकीय योजना आणि अनुदान शोधण्यासाठी माहिती भरा.',
      personalTab: '१. वैयक्तिक माहिती व प्रवर्ग',
      businessTab: '२. व्यवसाय व भांडवल',
      docsTab: '३. कागदपत्रे',
      nameLabel: 'पूर्ण नाव',
      ageLabel: 'वय',
      categoryLabel: 'सामाजिक प्रवर्ग',
      genderLabel: 'लिंग',
      locationLabel: 'परिसर (ग्रामीण / शहरी)',
      incomeLabel: 'वार्षिक कौटुंबिक उत्पन्न (₹)',
      sectorLabel: 'व्यवसाय क्षेत्र',
      loanLabel: 'आवश्यक कर्ज रक्कम (₹)',
      projectCostLabel: 'एकूण प्रकल्प खर्च (₹)',
      marginLabel: 'स्वतःचे भांडवल (₹)',
      matchButton: 'पात्र योजना व अनुदान तपासा',
      calculatingText: 'योजनांचे विश्लेषण सुरू आहे...'
    },
    results: {
      topMatchesTitle: 'आपल्यासाठी सर्वोत्तम शिफारस केलेल्या योजना',
      matchScore: 'पात्रता टक्केवारी',
      maxSubsidy: 'अपेक्षित सरकारी अनुदान',
      ownContribution: 'स्वतःचा वाटा',
      estimatedEmi: 'अंदाजे मासिक हप्ता (EMI)',
      whyMatched: 'योजना जुळण्याची कारणे',
      conditions: 'आवश्यक अटी',
      missingDocs: 'आवश्यक कागदपत्रे',
      applyPortal: 'अधिकृत पोर्टल',
      viewDetails: 'सविस्तर माहिती',
      addToCompare: 'तुलना करा',
      inComparison: 'तुलनेत जोडले',
      listenAudio: 'माहिती ऐका'
    },
    copilot: {
      title: 'साथी (Saathi) AI',
      subtitle: 'मराठी किंवा इंग्रजीत विचारा',
      placeholder: 'उदा. मला शिलाई कामासाठी २ लाख रुपये कर्ज हवे आहे...',
      sendBtn: 'विचारा',
      listening: 'आवाज ऐकला जात आहे...'
    }
  },

  // -------------------------------------------------------------
  // 6. BENGALI (বাংলা)
  // -------------------------------------------------------------
  bn: {
    appTitle: 'SchemeMatch (স্কিমম্যাচ)',
    appSubTitle: 'প্রান্তিক উদ্যোক্তাদের জন্য এআই ভিত্তিক সরকারি স্কিম নির্বাচন ও সহায়তা',
    sponsoringMinistry: 'সামাজিক ন্যায়বিচার ও ক্ষমতায়ন মন্ত্রক (MoSJE)',
    sihProblemStatement: 'প্রান্তিক উদ্যোক্তাদের জন্য স্কিম নির্বাচন',
    nav: {
      signIn: 'সাইন ইন',
      createAccount: 'বিনামূল্যে অ্যাকাউন্ট তৈরি করুন',
      landingPage: 'হোমপেজ',
      workspace: 'ড্যাশবোর্ড',
      signOut: 'লগ আউট'
    },
    landing: {
      heroKicker: 'আপনার নতুন সরকারি স্কিম ইঞ্জিন',
      heroHeadingLine1: 'সেই সরকারি স্কিম',
      heroHeadingLine2: 'যা আপনার ব্যবসার সাথে মেলে',
      heroCursorTag: 'সাথী AI',
      heroSubtitle: 'স্কিমম্যাচ প্রান্তিক উদ্যোক্তাদের বুদ্ধিমান প্রকল্প ম্যাচিং, ৩৫% পর্যন্ত মূলধন ভর্তুকি, রেয়াতি ঋণ এবং ব্যাংক-রেডি DPR দিয়ে ক্ষমতায়ন করে।',
      superpoweredTitleLine1: 'প্রতিটি স্কিম মেলানোর মধ্যে',
      superpoweredTitleLine2: 'একটি শক্তিশালী ও স্পষ্ট',
      superpoweredTitleLine3: 'সহায়তা',
      superpoweredSubtitle: 'স্কিমম্যাচ সরকারি প্রকল্পগুলিকে ব্যাংক-রেডি সুযোগে রূপান্তরিত করে যাতে কয়েক সেকেন্ডের মধ্যে মূলধন ভর্তুকি এবং ঋণ অনুমোদন পাওয়া যায়।',
      connectedTitlePrefix: 'প্রতিটি',
      connectedTitleHighlight: 'আবেদন',
      connectedTitleSuffix: 'সম্পূর্ণ আত্মবিশ্বাসের সাথে জমা দিন',
      connectedSubtitle: 'কখনোই সময়সীমা বা যোগ্যতার শর্ত ভুলে যাবেন না। স্কিমম্যাচ আপনার আবেদনগুলোকে পুরোপুরি সুসংগঠিত রাখে।',
      dashboardTitleLine1: 'সবকিছু একটি ড্যাশবোর্ডে,',
      dashboardTitleHighlight: 'ব্যবহার করা অত্যন্ত সহজ',
      dashboardSubtitle: 'একটি দ্রুত এবং আধুনিক ড্যাশবোর্ডে তৈরি সম্পূর্ণ সরকারি প্রকল্প ম্যাচিং এবং ডিপিআর জেনারেশন প্ল্যাটফর্ম।',
      bottomCtaHeadingLine1: 'এটাই সঠিক সময়।',
      bottomCtaHeadingLine2: 'স্কিমম্যাচের সাথে যুক্ত হন',
      bottomCtaSubheading: 'আপনার উদ্যোগের আপনার ভবিষ্যৎ গড়ার ক্ষমতা রয়েছে। সরকারি অনুদান হাতছাড়া করবেন না। আজই বিনামূল্যে যুক্ত হন।',
      bottomCtaSignUp: 'বিনামূল্যে সাইন আপ করুন',
      bottomCtaDownload: 'স্কিম গাইড ডাউনলোড করুন',
      bottomCtaOpenWorkspace: 'ড্যাশবোর্ড খুলুন'
    },
    tabs: {
      matcher: 'এআই স্কিম অনুসন্ধান',
      dpr: 'ব্যাংক প্রকল্প রিপোর্ট (DPR)',
      documents: 'নথি প্রস্তুতি স্ক্যানার',
      comparison: 'স্কিম তুলনা',
      roadmap: 'আবেদন নির্দেশিকা'
    },
    hero: {
      badge: 'জাতীয় স্কিম সহায়তা প্ল্যাটফর্ম',
      titleMain: 'প্রান্তিক ও ক্ষুদ্র উদ্যোক্তাদের ক্ষমতায়ন,',
      titleHighlight: 'স্মার্ট এআই সরকারি স্কিম প্ল্যাটফর্মে',
      tagline: '৩৫% পর্যন্ত সরকারি অনুদান, ৪% সুদের হারে ঋণ, তাত্ক্ষণিক ব্যাংক ডিপিআর এবং অডিও সহায়তা।',
      personaTitle: 'বাস্তব উদ্যোক্তা প্রোফাইল পরীক্ষা করুন:',
      stat1Label: 'অন্তর্ভুক্ত স্কিম',
      stat2Label: 'সর্বোচ্চ অনুদান',
      stat3Label: 'সর্বনিম্ন সুদের হার',
      stat4Label: 'MoSJE কর্পোরেশন'
    },
    wizard: {
      title: 'ব্যক্তিগত योग्यता মূল্যায়ন',
      subtitle: 'আপনার ব্যবসায়ের উপযোগী সরকারি স্কিম এবং অনুদান খুঁজতে তথ্য দিন।',
      personalTab: '১. ব্যক্তিগত তথ্য ও শ্রেণি',
      businessTab: '২. ব্যবসা ও ঋণ চাহিদা',
      docsTab: '৩. প্রয়োজনীয় নথি',
      nameLabel: 'সম্পূর্ণ নাম',
      ageLabel: 'বয়স',
      categoryLabel: 'সামাজিক শ্রেণি',
      genderLabel: 'লিঙ্গ',
      locationLabel: 'এলাকা (গ্রামীণ / শহুরে)',
      incomeLabel: 'বার্ষিক পারিবারিক আয় (₹)',
      sectorLabel: 'ব্যবসায়িক ক্ষেত্র',
      loanLabel: 'প্রয়োজনীয় ঋণ (₹)',
      projectCostLabel: 'মোট প্রকল্প ব্যয় (₹)',
      marginLabel: 'নিজের বিনিয়োগ (₹)',
      matchButton: 'উপযুক্ত স্কিমসমূহ দেখুন',
      calculatingText: 'স্কিম বিশ্লেষণ করা হচ্ছে...'
    },
    results: {
      topMatchesTitle: 'আপনার জন্য সেরা প্রস্তাবিত সরকারি স্কিম',
      matchScore: 'উপযোগিতা স্কোর',
      maxSubsidy: 'সরকারি অনুদান',
      ownContribution: 'নিজস্ব অংশদান',
      estimatedEmi: 'আনুমানিক মাসিক কিস্তি (EMI)',
      whyMatched: 'স্কিম মেলার কারণসমূহ',
      conditions: 'প্রয়োজনীয় শর্তাবলী',
      missingDocs: 'ঘাটতি থাকা নথি',
      applyPortal: 'অফিসিয়াল পোর্টাল',
      viewDetails: 'বিস্তারিত জানুন',
      addToCompare: 'তুলনা করুন',
      inComparison: 'তুলনায় যুক্ত',
      listenAudio: 'অডিও শুনুন'
    },
    copilot: {
      title: 'Saathi AI (ভয়েস সহকারী)',
      subtitle: 'আপনার ভাষায় প্রশ্ন করুন',
      placeholder: 'যেমন: আমি তাঁত শিল্পের জন্য ২ লাখ টাকা ঋণ চাই...',
      sendBtn: 'জানুন',
      listening: 'শোনা হচ্ছে...'
    }
  }
};
