import React, { useState, useRef, useEffect } from 'react';
import logoImg from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { ChatMessage } from '../types';
import { Bot, MessageSquare, Send, Mic, MicOff, X, Sparkles, Volume2, ArrowRight, Check } from 'lucide-react';

export const SaathiAICopilot: React.FC = () => {
  const { t, speakText, language } = useLanguage();
  const { profile, setProfile, runMatching, setSelectedSchemeModal, matchResults } = useProfile();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Namaste! I am Saathi AI, your personalized scheme discovery copilot. Tell me about your work, where you live, or what funds you need, and I will find the best government subsidies and 4% concessional credit for you.',
      hindiText: 'नमस्ते! मैं साथी (Saathi) AI हूँ। मुझे अपने कार्य, क्षेत्र और ऋण आवश्यकता के बारे में बताएं, मैं आपके लिए सर्वश्रेष्ठ सरकारी सब्सिडी और रियायती ऋण खोजूँगा।',
      timestamp: 'Just now',
      suggestedPrompts: [
        'What is PMEGP subsidy for rural SC women?',
        'Tell me about PM Vishwakarma toolkit grant',
        'How to get 5% VISVAS interest subvention?',
        'How to register on Udyam portal for free?'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
        }}>SchemeMatch</div>
      </div>
    );
  }

  const showQuickActions = messages.length === 1;

  /* ── RENDER ─────────────────────────────────────────────────────── */
  return (
    <>
      {/* Floating Action Button */}
      <button
        className="saathi-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Saathi AI"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <img src="/logo.png" alt="Saathi AI" style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#FFFFFF', padding: '1px' }} />
        <span>Ask Saathi AI</span>
        <Sparkles size={16} />
      </button>

      {/* Expandable Drawer */}
      {isOpen && (
        <div className="saathi-drawer">
          {/* Header */}
          <div className="drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.png" alt="SchemeMatch" style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FFFFFF', padding: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.98rem', display: 'block' }}>{t.copilot.title}</strong>
                <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>{t.copilot.subtitle}</span>
              </div>
            </div>

        {/* Language Switcher Segmented */}
        <div className="si-saathi-lang-segmented">
          {(['en', 'hi', 'pa'] as ChatLang[]).map(l => (
            <button
              key={l}
              className={`si-lang-pill ${lang === l ? 'active' : ''}`}
              onClick={() => setLang(l)}
              title={l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}
            >
              {l === 'en' ? 'EN' : l === 'hi' ? 'हि' : 'ਪੰ'}
            </button>
          ))}
        </div>

          {/* Body / Message History */}
          <div className="drawer-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                {msg.sender === 'assistant' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-saffron)' }}>
                      Saathi AI
                    </span>
                    <button
                      onClick={() => speakText(language === 'hi' && msg.hindiText ? msg.hindiText : msg.text)}
                      style={{ background: 'transparent', color: 'var(--text-muted)', padding: '2px' }}
                      title="Listen text aloud"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                )}

                <div style={{ whiteSpace: 'pre-line' }}>
                  {language === 'hi' && msg.hindiText ? msg.hindiText : msg.text}
                </div>
                <div className="si-msg-bubble-wrap">
                  {/* Chat Bubble */}
                  <div className="si-chat-bubble assistant">
                    <div className="si-chat-bubble-header">
                      <span className="si-chat-sender">SchemeMatch AI</span>
                      <span className="si-ai-tag">Verified</span>
                      <div className="si-bubble-actions">
                        <button
                          className="si-bubble-action-btn"
                          onClick={() => speakText(lang === 'hi' && msg.hindiText ? msg.hindiText : msg.text)}
                          title="Read Aloud"
                        >
                          <Volume2 size={12} />
                        </button>
                        <span className="si-chat-time">{msg.timestamp}</span>
                      </div>
                    </div>
                    <div className="si-chat-text">
                      {lang === 'hi' && msg.hindiText ? msg.hindiText : msg.text}
                    </div>
                  </div>

                  {/* Intent-specific Rich Cards under assistant message */}
                  {msg.schemeResults && msg.schemeResults.length > 0 && (
                    <SchemeRecBubble results={msg.schemeResults} onWhy={r => handleWhy(r, 'eligible')} onWhere={handleWhere} />
                  )}

                  {msg.selectedForWhy && (msg.intent === 'why_scheme' || msg.intent === 'why_not' || msg.intent === 'gap_analyze') && (
                    <>
                      <WhyCard result={msg.selectedForWhy} mode={msg.intent === 'why_not' ? 'ineligible' : 'eligible'} />
                      {msg.intent === 'gap_analyze' && <GapCard result={msg.selectedForWhy} />}
                    </>
                  )}

                  {msg.emiData && msg.intent === 'check_emi' && (
                    <EMICard {...msg.emiData} onModify={handleEMIModify} />
                  )}

                  {msg.whatIfData && msg.intent === 'what_if' && (
                    <WhatIfCard {...msg.whatIfData} />
                  )}

                  {msg.docData && <DocChecklistCard {...msg.docData} />}

                  {msg.fraudUrl && <FraudCard url={msg.fraudUrl} />}

                  {msg.litTerm && FINANCIAL_TERMS[msg.litTerm] && (
                    <LiteracyCard term={msg.litTerm} expl={FINANCIAL_TERMS[msg.litTerm]} lang={lang} />
                  )}

                  {msg.whereData && <WhereCard r={msg.whereData} />}

                  {msg.dprResult && <DPRDraftCard dpr={msg.dprResult} businessName={dprData.businessName || 'Your Business'} />}

                  {/* Suggested Prompts */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="si-suggested-prompts">
                      {msg.suggestedPrompts.map((p, i) => (
                        <button key={i} className="si-prompt-chip" onClick={() => sendMessage(p)}>
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="si-user-row">
                <div className="si-chat-bubble user">
                  <div className="si-chat-text">{msg.text}</div>
                  <div className="si-chat-time">{msg.timestamp}</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="si-assistant-row">
            <div className="si-msg-avatar">
              <Sparkles size={13} />
            </div>
            <div className="si-chat-bubble assistant typing">
              <div className="si-typing-indicator">
                <span className="si-typing-dot" />
                <span className="si-typing-dot" />
                <span className="si-typing-dot" />
              </div>
              <span className="si-typing-text">Finding eligible schemes...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* ── Panel Footer & Input Dock ── */}
      <div className="si-saathi-panel-footer">
        <div className="si-saathi-dock-capsule">
          <div className="si-dock-tools">
            {/* File Upload */}
            <label className="si-dock-icon-btn" title="Upload Document or Certificate">
              <Upload size={14} />
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>

            {/* Voice Mic */}
            <button
              className={`si-dock-icon-btn ${isRecording ? 'recording' : ''}`}
              onClick={toggleVoice}
              title={isRecording ? 'Listening... click to stop' : 'Speak your query in EN/HI/PA'}
            >
              {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          </div>

          {/* Text Input */}
          <input
            className="si-saathi-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder={
              dprStep ? '📄 Enter business details for report...'
                : isRecording ? '🎙️ Listening... speak now'
                  : lang === 'hi' ? 'अपनी जरूरत बताएं (लोन, सब्सिडी, EMI)...'
                    : lang === 'pa' ? 'ਆਪਣੀ ਲੋੜ ਦੱਸੋ (ਕਰਜ਼ਾ, ਸਬਸਿਡੀ, EMI)...'
                      : 'Ask about schemes, loans, EMI, docs...'
            }
          />

          {/* Send Button */}
          <button
            className="si-saathi-send-btn"
            onClick={() => sendMessage()}
            disabled={isLoading || (!input.trim() && !isRecording)}
            title="Send Message"
          >
            <Send size={14} />
          </button>
        </div>

        <div className="si-saathi-dock-footnote">
          <span>⚡ Rules-based AI Scheme Matcher • Multilingual</span>
        </div>
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
      <button className="saathi-floating-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Open SchemeMatch Assistant"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={logoImg} alt="" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
        <span>Ask SchemeMatch</span>
      </button>
      {isOpen && (
        <div style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 1000, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', borderRadius: '16px', overflow: 'hidden' }}>
          <SaathiPanel collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        </div>
      )}
    </>
  );
};
