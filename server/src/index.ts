import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import schemesData from './data/schemes.json';
import { SAMPLE_PERSONAS } from './data/samplePersonas';
import { Scheme, UserProfile, DprRequest } from './types';
import { SchemeMatchingEngine } from './services/matchingEngine';
import { DprGeneratorService } from './services/dprGenerator';
import { DocumentService } from './services/documentService';
import { SaathiChatService } from './services/chatService';
import { GroqAIService } from './services/groqService';
import { GeoSpatialPartnerRouterService, PartnerRoutingRequest } from './services/geoPartnerRouter';
import { TtsService } from './services/ttsService';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const schemes: Scheme[] = schemesData as Scheme[];
const matchingEngine = new SchemeMatchingEngine(schemes);
const dprService = new DprGeneratorService();
const documentService = new DocumentService();
const chatService = new SaathiChatService(schemes);
const groqService = new GroqAIService();
const partnerRouterService = new GeoSpatialPartnerRouterService();
const ttsService = new TtsService();

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'SchemeMatch API',
    description: 'National Scheme Intelligence Platform for Marginalized Entrepreneurs',
    sponsoringMinistry: 'Ministry of Social Justice and Empowerment (MoSJE)',
    schemesIndexed: schemes.length,
    timestamp: new Date().toISOString()
  });
});

// Get all schemes (with optional filtering)
app.get('/api/schemes', (req: Request, res: Response) => {
  const { category, sector, location, maxLoan } = req.query;
  let filtered = [...schemes];

  if (category && typeof category === 'string') {
    filtered = filtered.filter((s) => s.targetGroups.includes(category) || s.eligibility.allowedCategories.includes(category as any));
  }
  if (sector && typeof sector === 'string') {
    filtered = filtered.filter((s) => s.eligibility.allowedSectors.includes(sector as any));
  }
  if (location && typeof location === 'string') {
    filtered = filtered.filter((s) => s.eligibility.allowedLocations.includes(location as any));
  }
  if (maxLoan && typeof maxLoan === 'string') {
    const loanNum = parseInt(maxLoan, 10);
    if (!isNaN(loanNum)) {
      filtered = filtered.filter((s) => s.minLoanAmount <= loanNum);
    }
  }

  res.json({
    count: filtered.length,
    schemes: filtered
  });
});

// Get single scheme by ID
app.get('/api/schemes/:id', (req: Request, res: Response) => {
  const scheme = schemes.find((s) => s.id === req.params.id);
  if (!scheme) {
    return res.status(404).json({ error: 'Scheme not found' });
  }
  res.json(scheme);
});

// Get sample marginalized personas
app.get('/api/personas', (req: Request, res: Response) => {
  res.json({
    personas: SAMPLE_PERSONAS
  });
});

// AI Scheme Matching Engine
app.post('/api/match', (req: Request, res: Response) => {
  try {
    const rawProfile: UserProfile = req.body;
    if (!rawProfile) {
      return res.status(400).json({ error: 'User profile is required.' });
    }

    // Gracefully infer sector if not explicitly set
    let inferredSector = rawProfile.sector;
    if (!inferredSector) {
      const tradeLower = (rawProfile.tradeType || '').toLowerCase();
      if (tradeLower.includes('tailor') || tradeLower.includes('darzi') || tradeLower.includes('stitching') || tradeLower.includes('cloth') || tradeLower.includes('garment')) {
        inferredSector = 'Textiles';
      } else if (tradeLower.includes('weaver') || tradeLower.includes('potter') || tradeLower.includes('carpenter') || tradeLower.includes('artisan')) {
        inferredSector = 'ArtisanHandicraft';
      } else if (tradeLower.includes('street') || tradeLower.includes('vendor') || tradeLower.includes('thela') || tradeLower.includes('cart')) {
        inferredSector = 'StreetVending';
      } else {
        inferredSector = 'Services';
      }
    }

    const profile: UserProfile = {
      ...rawProfile,
      sector: inferredSector,
      category: rawProfile.category || ('' as any),
      locationType: rawProfile.locationType || ('' as any)
    };

    const matches = matchingEngine.matchSchemes(profile);
    const topMatches = matches.filter((m) => m.isEligible);
    const otherSchemes = matches.filter((m) => !m.isEligible);

    // Calculate aggregate highlights
    const totalPotentialSubsidy = topMatches.reduce((max, m) => Math.max(max, m.estimatedSubsidyAmount), 0);
    const lowestInterestRate = '4% p.a. (Concessional / Subsidized)';

    res.json({
      totalSchemesEvaluated: schemes.length,
      eligibleMatchesCount: topMatches.length,
      totalPotentialSubsidy,
      lowestInterestRate,
      topMatches,
      otherSchemes,
      evaluatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error processing scheme matching' });
  }
});

// Bank-Ready Detailed Project Report (DPR) Generator
app.post('/api/dpr/generate', (req: Request, res: Response) => {
  try {
    const dprReq: DprRequest = req.body;
    const model = dprService.generateFinancialModel(dprReq);
    res.json({
      model,
      generatedAt: new Date().toISOString(),
      complianceNote: 'Prepared according to standard RBI / KVIC / MoSJE micro-enterprise project appraisal standards.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error generating DPR' });
  }
});

// Document Readiness & Gap Analysis
app.post('/api/documents/analyze', (req: Request, res: Response) => {
  try {
    const { profile, uploadedDocIds } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'User profile is required for document analysis.' });
    }
    const report = documentService.analyzeReadiness(profile, uploadedDocIds || []);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error analyzing documents' });
  }
});

// Geo-Spatial Partner Locator & Router Endpoint
app.post('/api/partners/route', (req: Request, res: Response) => {
  try {
    const routingReq: PartnerRoutingRequest = req.body;
    const result = partnerRouterService.routePartners(routingReq);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error processing partner routing' });
  }
});

// Get all channel partners
app.get('/api/partners', (req: Request, res: Response) => {
  try {
    const { district, type } = req.query;
    let partners = partnerRouterService.getAllPartners();
    if (district && typeof district === 'string') {
      partners = partners.filter(p => p.district.toLowerCase() === district.toLowerCase());
    }
    if (type && typeof type === 'string') {
      partners = partners.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }
    res.json({
      count: partners.length,
      partners
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching partners' });
  }
});

// Saathi AI Conversational Copilot (Powered by Groq Cloud)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { query, profile } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }

    try {
      const aiResponse = await groqService.chatWithSaathi(query, profile, schemes);
      
      // Also cross-reference with matching engine if query asks about schemes
      const deterministicReply = chatService.processMessage(query, profile);

      // Merge entity extraction for maximum reliability
      const mergedUpdates = {
        ...(deterministicReply.extractedProfileUpdates || {}),
        ...(aiResponse.extractedProfileUpdates || {})
      };

      res.json({
        id: `saathi-${Date.now()}`,
        sender: 'assistant',
        text: aiResponse.text,
        hindiText: aiResponse.hindiText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        matchedSchemes: deterministicReply.matchedSchemes,
        suggestedPrompts: aiResponse.suggestedPrompts,
        extractedProfileUpdates: Object.keys(mergedUpdates).length > 0 ? mergedUpdates : undefined
      });
    } catch (groqErr) {
      console.warn('Groq AI chat encountered an issue, falling back to deterministic chat engine:', groqErr);
      const fallbackReply = chatService.processMessage(query, profile);
      res.json(fallbackReply);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error processing chat query' });
  }
});

// AI Profile Extraction (Natural Language / Voice to Structured Profile)
app.post('/api/ai/extract-profile', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text prompt is required for AI extraction.' });
    }

    const extracted = await groqService.extractProfileFromText(text);
    res.json(extracted);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error extracting profile from text' });
  }
});

// AI Explainable Match Score Evaluation
app.post('/api/ai/explain-match', async (req: Request, res: Response) => {
  try {
    const { scheme, profile, score } = req.body;
    if (!scheme || !profile) {
      return res.status(400).json({ error: 'Scheme and User Profile are required.' });
    }

    const explanation = await groqService.explainMatch(scheme, profile, score || 85);
    res.json(explanation);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error generating match explanation' });
  }
});

// AI DPR Banking Narrative Generator
app.post('/api/ai/dpr-narrative', async (req: Request, res: Response) => {
  try {
    const { dprReq, financials } = req.body;
    if (!dprReq || !financials) {
      return res.status(400).json({ error: 'DPR Request and Financials are required.' });
    }

    const narrative = await groqService.generateDprNarrative(dprReq, financials);
    res.json(narrative);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error generating DPR narrative' });
  }
});

// Text-To-Speech (Sarvam AI with ElevenLabs fallback)
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, language, speaker } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS speech synthesis.' });
    }

    const result = await ttsService.generateSpeech({ text, language, speaker });
    res.json(result);
  } catch (err: any) {
    console.error('TTS endpoint error:', err);
    res.status(500).json({ error: err.message || 'Error generating TTS speech' });
  }
});

app.listen(PORT, () => {
  console.log(`SchemeMatch Backend Server running on port ${PORT}`);
});
