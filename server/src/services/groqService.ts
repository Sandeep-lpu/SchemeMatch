import { Scheme, UserProfile, DprRequest } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_FAST_MODEL = 'qwen/qwen3.8-27b';
const DEFAULT_REASONING_MODEL = 'openai/gpt-oss-120b';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class GroqAIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
  }

  /**
   * Helper to make robust HTTP calls to Groq Cloud API
   */
  private async callGroq(
    messages: GroqMessage[],
    options: {
      model?: string;
      jsonMode?: boolean;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    const model = options.model || DEFAULT_FAST_MODEL;
    const body: any = {
      model,
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 1024
    };

    if (options.jsonMode) {
      body.response_format = { type: 'json_object' };
    }

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Groq API returned status ${response.status}:`, errText);
        // Fallback to reasoning model if fast model had issues
        if (model !== DEFAULT_REASONING_MODEL) {
          return this.callGroq(messages, { ...options, model: DEFAULT_REASONING_MODEL });
        }
        throw new Error(`Groq API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (err: any) {
      console.error('Groq request failed:', err.message);
      throw err;
    }
  }

  /**
   * Saathi AI Chat: Conversational Scheme Advisor grounded in Government Schemes
   */
  public async chatWithSaathi(
    userQuery: string,
    currentProfile?: Partial<UserProfile>,
    schemesList?: Scheme[]
  ): Promise<{
    text: string;
    hindiText?: string;
    extractedProfileUpdates?: Partial<UserProfile>;
    suggestedPrompts?: string[];
  }> {
    const schemeContext = (schemesList || []).slice(0, 8).map(s => (
      `- ${s.name} (${s.categoryTag}): Max Loan Rs.${s.maxLoanAmount.toLocaleString('en-IN')}, Subsidy: ${s.subsidyRate?.specialRural || s.subsidyRate?.specialUrban || 25}%, Target: ${s.targetGroups.join(', ')}`
    )).join('\n');

    const profileContext = currentProfile ? JSON.stringify({
      name: currentProfile.fullName,
      category: currentProfile.category,
      gender: currentProfile.gender,
      state: currentProfile.state,
      sector: currentProfile.sector,
      tradeType: currentProfile.tradeType,
      requiredLoan: currentProfile.requiredLoanAmount
    }) : 'Not provided yet';

    const systemPrompt = `You are "Saathi AI" (साथी AI), an empathetic, expert government scheme advisory copilot for marginalized and micro-entrepreneurs in India under the Ministry of Social Justice and Empowerment (MoSJE).
Your goal is to guide SC, ST, OBC, Divyang, Women, and Safai Karamchari entrepreneurs to national credit subsidies, lower interest loans, and bankable project advice.

Available Schemes Context:
${schemeContext}

Current User Profile:
${profileContext}

Instructions:
1. Respond warmly and authoritatively in English, with brief Hindi/Hinglish terms where appropriate for empathy.
2. Directly answer the user's question, mentioning relevant scheme names, estimated subsidies, and loan caps.
3. If the user mentions any personal or business details (like their age, gender, caste category SC/ST/OBC, state/city, loan amount, trade/business type), extract them into a JSON block so their profile updates.
4. Always respond in valid JSON with this exact schema:
{
  "text": "Your helpful response to the user in English",
  "hindiText": "Your helpful response in simple conversational Hindi (Devanagari)",
  "extractedProfileUpdates": {
    "category": "SC" | "ST" | "OBC" | "General" | "Minority" | "SafaiKaramchari" (only if detected),
    "gender": "Female" | "Male" | "Other" (only if detected),
    "locationType": "Rural" | "Urban" (only if detected),
    "sector": "Textiles" | "AgroAllied" | "Services" | "Manufacturing" | "ArtisanHandicraft" | "StreetVending" | "Sanitation" | "Retail" (only if detected),
    "tradeType": "string" (only if detected),
    "requiredLoanAmount": number (only if detected),
    "totalProjectCost": number (only if detected)
  },
  "suggestedPrompts": ["Next question prompt 1", "Next question prompt 2", "Next question prompt 3"]
}`;

    const userPrompt = `User question: "${userQuery}"`;

    try {
      const rawJson = await this.callGroq([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], { jsonMode: true, temperature: 0.3 });

      const parsed = JSON.parse(rawJson);
      return {
        text: parsed.text || 'I am ready to help you find the best government schemes.',
        hindiText: parsed.hindiText || 'मैं आपकी सरकारी योजनाओं की सहायता के लिए तैयार हूँ।',
        extractedProfileUpdates: parsed.extractedProfileUpdates && Object.keys(parsed.extractedProfileUpdates).length > 0
          ? parsed.extractedProfileUpdates
          : undefined,
        suggestedPrompts: parsed.suggestedPrompts || [
          'Which scheme offers 35% subsidy?',
          'What documents do I need for Stand-Up India?',
          'How can I get loan for tailoring machine?'
        ]
      };
    } catch (err) {
      console.warn('Groq Saathi Chat fallback:', err);
      return {
        text: `Based on your request "${userQuery}", I recommend exploring PMEGP (up to 35% capital subsidy for SC/ST/Women) and Stand-Up India (Rs. 10L to 1 Cr loans). Would you like to check your full eligibility score?`,
        hindiText: `आपके प्रश्न के अनुसार, PMEGP (35% तक सब्सिडी) और स्टैंड-अप इंडिया आपके लिए सबसे उपयुक्त योजनाएं हैं।`,
        suggestedPrompts: [
          'Show me all eligible schemes',
          'Calculate my monthly EMI',
          'Check my document readiness'
        ]
      };
    }
  }

  /**
   * AI Profile Extraction: Extracts structured user profile from freeform text / voice input
   */
  public async extractProfileFromText(text: string): Promise<{
    fullName?: string;
    age?: number;
    gender?: 'Female' | 'Male' | 'Other';
    category?: 'SC' | 'ST' | 'OBC' | 'General' | 'Minority' | 'SafaiKaramchari';
    state?: string;
    locationType?: 'Rural' | 'Urban';
    sector?: 'Textiles' | 'AgroAllied' | 'Services' | 'Manufacturing' | 'ArtisanHandicraft' | 'StreetVending' | 'Sanitation' | 'Retail';
    tradeType?: string;
    requiredLoanAmount?: number;
    totalProjectCost?: number;
    annualFamilyIncome?: number;
    isDifferentlyAbled?: boolean;
    confidenceScore: number;
    summary: string;
  }> {
    const systemPrompt = `You are an expert AI entity extractor for Indian government welfare and entrepreneurship portals.
Analyze the provided user description (which may be in English, Hindi, or Hinglish) and extract all entrepreneur demographic, financial, and business attributes into a strictly formatted JSON object.

Allowed Enum Values:
- category: "SC", "ST", "OBC", "General", "Minority", "SafaiKaramchari" (ONLY IF EXPLICITLY STATED)
- gender: "Female", "Male", "Other"
- locationType: "Rural", "Urban" (ONLY IF EXPLICITLY STATED)
- sector: "Textiles", "AgroAllied", "Services", "Manufacturing", "ArtisanHandicraft", "StreetVending", "Sanitation", "Retail"

CRITICAL EXTRACTION RULES (STRICT NON-HALLUCINATION POLICY):
1. DO NOT GUESS OR INVENT ATTRIBUTES: If an attribute is NOT mentioned in the text (such as social category/caste, location type Rural/Urban, state, annual income, or education level), you MUST set that field to null.
   - For example: if the text is "i am sandeep kumar , a men of 30yr , interested in tailoring business loan amount needed is 150000", caste/category is NOT mentioned, so "category": null. Location (village/city/rural/urban) is NOT mentioned, so "locationType": null. State is NOT mentioned, so "state": null.
2. Gender Extraction: "men", "man", "male", "guy", "ladka", "purush" -> "Male". "women", "woman", "female", "lady", "ladki", "mahila" -> "Female".
3. Trade & Sector:
   - "tailoring", "tailor", "darzi", "stitching", "cloth", "garment", "boutique", "apparel" -> sector: "Textiles", tradeType: "Tailoring"
   - "carpenter", "potter", "blacksmith", "handloom", "weaver", "artisan" -> sector: "ArtisanHandicraft"
   - "street food", "vendor", "thela", "cart" -> sector: "StreetVending"
4. Loan Amount: Extract digits like "150000", "1.5 lakh", "1.5L", "150k", "150000 INR" into integer 150000.
5. If totalProjectCost is not specified, set it to Math.round(requiredLoanAmount * 1.15) if requiredLoanAmount exists, otherwise null.
6. Return confidenceScore (0 to 100) and a clean English summary.

Output format (Strict JSON):
{
  "fullName": string or null,
  "age": number or null,
  "gender": "Female" | "Male" | "Other" or null,
  "category": "SC" | "ST" | "OBC" | "General" | "Minority" | "SafaiKaramchari" or null,
  "state": string or null,
  "locationType": "Rural" | "Urban" or null,
  "sector": "Textiles" | "AgroAllied" | "Services" | "Manufacturing" | "ArtisanHandicraft" | "StreetVending" | "Sanitation" | "Retail" or null,
  "tradeType": string or null,
  "requiredLoanAmount": number or null,
  "totalProjectCost": number or null,
  "annualFamilyIncome": number or null,
  "isDifferentlyAbled": boolean,
  "confidenceScore": number,
  "summary": string
}`;

    try {
      const rawJson = await this.callGroq([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ], { jsonMode: true, temperature: 0.1 });

      const parsed = JSON.parse(rawJson);
      // Clean up nulls
      const cleaned: any = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (value !== null && value !== undefined && value !== '') {
          cleaned[key] = value;
        }
      }
      cleaned.confidenceScore = cleaned.confidenceScore || 90;
      cleaned.summary = cleaned.summary || 'Extracted profile details from user description.';
      return cleaned;
    } catch (err) {
      console.warn('Groq profile extraction fallback activated:', err);
      return this.heuristicExtraction(text);
    }
  }

  /**
   * Deterministic entity extractor that strictly extracts only stated fields
   */
  private heuristicExtraction(text: string) {
    const lower = text.toLowerCase();
    const result: any = {
      isDifferentlyAbled: false,
      confidenceScore: 88,
      summary: 'Extracted stated details from user description.'
    };

    // 1. Name extraction (e.g. "i am sandeep kumar", "my name is sunita devi")
    const nameMatch = text.match(/(?:i am|my name is|im|i'm)\s+([a-zA-Z\s]+?)(?:,|\.|\bof\b|\ba\b|\baged\b|\byears\b|\binterested\b|\bneed\b|$)/i);
    if (nameMatch && nameMatch[1]) {
      const cleanedName = nameMatch[1].trim();
      if (cleanedName.length > 2 && !['a', 'an', 'the', 'looking', 'interested'].includes(cleanedName.toLowerCase())) {
        result.fullName = cleanedName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
    }

    // 2. Age extraction (e.g. "30yr", "30 yr", "30 years", "age 30")
    const ageMatch = text.match(/\b(\d{2})\s*(?:yr|yrs|year|years|yo|saal)?\b/i);
    if (ageMatch) {
      const ageNum = parseInt(ageMatch[1], 10);
      if (ageNum >= 18 && ageNum <= 80) {
        result.age = ageNum;
      }
    }

    // 3. Gender extraction ("men", "man", "male" -> Male; "woman", "women", "female" -> Female)
    if (/\b(men|man|male|guy|ladka|purush)\b/i.test(lower)) {
      result.gender = 'Male';
    } else if (/\b(woman|women|female|lady|ladki|mahila)\b/i.test(lower)) {
      result.gender = 'Female';
    } else if (/\b(transgender|trans)\b/i.test(lower)) {
      result.gender = 'Transgender';
    }

    // 4. Trade and Sector
    if (/\b(tailor|tailoring|darzi|stitching|garment|apparel|clothes|boutique)\b/i.test(lower)) {
      result.sector = 'Textiles';
      result.tradeType = 'Tailoring';
    } else if (/\b(handloom|weaver|weaving|potter|blacksmith|carpenter|handicraft|artisan|craft)\b/i.test(lower)) {
      result.sector = 'ArtisanHandicraft';
      result.tradeType = lower.includes('weaver') ? 'Weaving' : lower.includes('carpenter') ? 'Carpentry' : 'Artisan Handloom';
    } else if (/\b(street\s*food|vendor|vending|thela|cart|panipuri|chaat|chai)\b/i.test(lower)) {
      result.sector = 'StreetVending';
      result.tradeType = 'Street Food / Vending Cart';
    } else if (/\b(sanitation|cleaning|safai|waste)\b/i.test(lower)) {
      result.sector = 'Sanitation';
      result.tradeType = 'Sanitation / Cleaning Equipment';
    } else if (/\b(dairy|farming|poultry|agro|food processing)\b/i.test(lower)) {
      result.sector = 'AgroAllied';
      result.tradeType = 'Agro-Allied Processing';
    } else if (/\b(manufacturing|factory|fabrication|workshop)\b/i.test(lower)) {
      result.sector = 'Manufacturing';
      result.tradeType = 'Micro Manufacturing Workshop';
    }

    // 5. Loan Amount (e.g. "150000", "1.5 lakh", "1.5L", "4L", "10 lakh")
    const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|l)\b/i);
    const rawNumberMatch = text.match(/(?:loan|amount|needed|need|require|required)?\s*(?:is|of|rs\.?|inr|₹)?\s*(\d{5,8})\b/i);

    if (lakhMatch) {
      const val = parseFloat(lakhMatch[1]);
      result.requiredLoanAmount = Math.round(val * 100000);
      result.totalProjectCost = Math.round(result.requiredLoanAmount * 1.15);
    } else if (rawNumberMatch) {
      const val = parseInt(rawNumberMatch[1], 10);
      result.requiredLoanAmount = val;
      result.totalProjectCost = Math.round(val * 1.15);
    }

    // 6. Category - ONLY set if explicitly present in text!
    if (/\b(sc|scheduled caste|dalit)\b/i.test(lower)) {
      result.category = 'SC';
    } else if (/\b(st|scheduled tribe|adivasi)\b/i.test(lower)) {
      result.category = 'ST';
    } else if (/\b(obc|other backward class)\b/i.test(lower)) {
      result.category = 'OBC';
    } else if (/\b(safai karamchari|valmiki)\b/i.test(lower)) {
      result.category = 'SafaiKaramchari';
    } else if (/\b(minority|muslim|sikh|christian|jain|buddhist)\b/i.test(lower)) {
      result.category = 'Minority';
    } else if (/\b(general|open category)\b/i.test(lower)) {
      result.category = 'General';
    }

    // 7. Location Type - ONLY set if explicitly present in text!
    if (/\b(rural|village|gram|panchayat|dehat)\b/i.test(lower)) {
      result.locationType = 'Rural';
    } else if (/\b(urban|city|metro|town|nagar)\b/i.test(lower)) {
      result.locationType = 'Urban';
    }

    // 8. State - ONLY set if mentioned
    const indianStates = ['Bihar', 'Uttar Pradesh', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'West Bengal', 'Gujarat', 'Tamil Nadu', 'Karnataka', 'Punjab', 'Haryana', 'Odisha', 'Kerala', 'Assam', 'Jharkhand'];
    for (const st of indianStates) {
      if (new RegExp(`\\b${st}\\b`, 'i').test(text)) {
        result.state = st;
        break;
      }
    }

    if (/\b(handicap|disabled|divyang|pwd)\b/i.test(lower)) {
      result.isDifferentlyAbled = true;
    }

    return result;
  }

  /**
   * Explainable Match Score: Generates deep, personalized rationale for why a user qualifies
   */
  public async explainMatch(
    scheme: Scheme,
    profile: UserProfile,
    score: number
  ): Promise<{
    rationale: string;
    subsidyBenefitExplanation: string;
    keyStrengthPoints: string[];
    actionableTips: string[];
  }> {
    const maxSub = scheme.subsidyRate?.maxSubsidyAmount || 500000;
    const subRate = scheme.subsidyRate?.specialRural || scheme.subsidyRate?.specialUrban || 25;
    const prompt = `Scheme: ${scheme.name} (${scheme.categoryTag})
Scheme Subsidies: Up to ${subRate}% subsidy (Max Rs.${maxSub.toLocaleString('en-IN')}), Interest: ${scheme.interestRatePerAnnum}
User: ${profile.fullName}, Category: ${profile.category}, Gender: ${profile.gender}, State: ${profile.state}, Sector: ${profile.sector}, Loan Needed: Rs.${profile.requiredLoanAmount.toLocaleString('en-IN')}
Calculated Match Score: ${score}%

Provide an explainable match evaluation in JSON format:
{
  "rationale": "Clear 2-sentence explanation of why the user matches this scheme",
  "subsidyBenefitExplanation": "Exact financial advantage the user receives under this scheme",
  "keyStrengthPoints": ["Strength 1", "Strength 2", "Strength 3"],
  "actionableTips": ["Tip 1 to expedite loan approval", "Tip 2 for bank interview"]
}`;

    try {
      const rawJson = await this.callGroq([
        { role: 'system', content: 'You are an RBI & MoSJE certified loan appraisal expert. Output JSON only.' },
        { role: 'user', content: prompt }
      ], { jsonMode: true, temperature: 0.2 });

      return JSON.parse(rawJson);
    } catch (err) {
      return {
        rationale: `You qualify for ${scheme.name} as a ${profile.category} entrepreneur in ${profile.sector}.`,
        subsidyBenefitExplanation: `Eligible for up to ${subRate}% capital subsidy amounting to Rs. ${maxSub.toLocaleString('en-IN')}.`,
        keyStrengthPoints: [
          `Category criteria (${profile.category}) matched with priority allocation`,
          `Loan requirement within permitted ceiling of Rs. ${scheme.maxLoanAmount.toLocaleString('en-IN')}`,
          `Sector alignment with National Priority Sector lending guidelines`
        ],
        actionableTips: [
          'Ensure Caste Certificate is digitally verified on the state portal',
          'Keep 3-year projected cash flow statement ready for the branch manager'
        ]
      };
    }
  }

  /**
   * AI DPR Narrative Generator
   */
  public async generateDprNarrative(
    dprReq: DprRequest,
    financials: any
  ): Promise<{
    executiveSummary: string;
    marketAnalysis: string;
    socioEconomicImpact: string;
    repaymentFeasibility: string;
  }> {
    const prompt = `Generate a formal banking project appraisal narrative for:
Business: ${dprReq.businessName}
Entrepreneur: Category ${dprReq.category}, Gender: ${dprReq.gender}, Location: ${dprReq.locationType}
Trade: ${dprReq.tradeType} (Sector: ${dprReq.sector})
Financials:
- Total Project Cost: Rs.${financials.totalProjectCost}
- Bank Loan Needed: Rs.${financials.termLoanAmount}
- Working Capital: Rs.${financials.workingCapitalAmount}
- Estimated Monthly Net Profit: Rs.${financials.netMonthlyProfit}
- Debt Service Coverage Ratio (DSCR): ${financials.dscr}

Output JSON format:
{
  "executiveSummary": "2-3 paragraphs formal banking appraisal summary",
  "marketAnalysis": "Demand drivers, target local customer base, and competitive edge",
  "socioEconomicImpact": "Job creation and livelihood elevation for marginalized community",
  "repaymentFeasibility": "Clear rationale on how DSCR ensures timely debt servicing without default"
}`;

    try {
      const rawJson = await this.callGroq([
        { role: 'system', content: 'You are an expert NABARD/SIDBI bank credit appraisal officer. Output JSON only.' },
        { role: 'user', content: prompt }
      ], { jsonMode: true, temperature: 0.2 });

      return JSON.parse(rawJson);
    } catch (err) {
      return {
        executiveSummary: `Project proposal for ${dprReq.businessName} involved in ${dprReq.tradeType}. The total outlay of Rs. ${financials.totalProjectCost} demonstrates sound commercial viability with high debt-servicing capability.`,
        marketAnalysis: `High localized demand for ${dprReq.tradeType} across ${dprReq.locationType} catchment areas with minimal organized competition.`,
        socioEconomicImpact: `Direct employment generation for marginalized families and sustainable income enhancement for the promoter.`,
        repaymentFeasibility: `With an average DSCR of ${financials.dscr}, the enterprise generates sufficient operating surplus to comfortably cover principal and interest obligations.`
      };
    }
  }
}
