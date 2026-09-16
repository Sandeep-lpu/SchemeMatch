import dotenv from 'dotenv';
dotenv.config();

export interface TtsRequest {
  text: string;
  language?: string; // 'en' | 'hi' | 'te' | 'pa' | 'mr' | 'bn'
  speaker?: string;
}

export interface TtsResponse {
  audioBase64: string;
  format: string; // 'audio/wav' | 'audio/mpeg'
  source: 'sarvam' | 'elevenlabs';
  cached?: boolean;
}

export class TtsService {
  private sarvamApiKey: string;
  private elevenLabsApiKey: string;
  private cache: Map<string, TtsResponse> = new Map();

  constructor() {
    this.sarvamApiKey = process.env.SARVAM_API_KEY || 'sk_ohm78s0d_rSuSyLYskgC1SzPQxCwFrYQT';
    this.elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || 'sk_ca64e4a7ffa3711a4895c46106f01ed0ecb16cd9e7bf54d4';
  }

  private mapLangCode(lang: string = 'en'): string {
    const clean = lang.toLowerCase().trim();
    const map: Record<string, string> = {
      en: 'en-IN',
      'en-in': 'en-IN',
      hi: 'hi-IN',
      'hi-in': 'hi-IN',
      te: 'te-IN',
      'te-in': 'te-IN',
      pa: 'pa-IN',
      'pa-in': 'pa-IN',
      mr: 'mr-IN',
      'mr-in': 'mr-IN',
      bn: 'bn-IN',
      'bn-in': 'bn-IN'
    };
    return map[clean] || 'hi-IN';
  }

  public async generateSpeech(req: TtsRequest): Promise<TtsResponse> {
    const langCode = this.mapLangCode(req.language || 'en');
    const cleanText = req.text
      .replace(/[*_#`[\]()]/g, ' ')
      .replace(/₹/g, 'Rupees ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      throw new Error('Text to speak cannot be empty.');
    }

    // Check cache
    const cacheKey = `${langCode}:${cleanText}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return { ...cached, cached: true };
    }

    // 1. Primary Engine: Sarvam AI (Supports Telugu, Punjabi, Marathi, Bengali, Hindi, English natively)
    if (this.sarvamApiKey) {
      try {
        const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'api-subscription-key': this.sarvamApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: [cleanText],
            target_language_code: langCode,
            speaker: req.speaker || 'ritu',
            model: 'bulbul:v3'
          })
        });

        if (sarvamRes.ok) {
          const data = (await sarvamRes.json()) as { audios?: string[] };
          if (data.audios && data.audios[0]) {
            const result: TtsResponse = {
              audioBase64: `data:audio/wav;base64,${data.audios[0]}`,
              format: 'audio/wav',
              source: 'sarvam'
            };
            this.cache.set(cacheKey, result);
            return result;
          }
        } else {
          const errText = await sarvamRes.text();
          console.warn(`Sarvam AI TTS returned ${sarvamRes.status}: ${errText.slice(0, 160)}`);
        }
      } catch (err: any) {
        console.warn(`Sarvam AI TTS failed: ${err.message}. Trying ElevenLabs fallback...`);
      }
    }

    // 2. Secondary Engine: ElevenLabs (Multilingual V2 fallback)
    if (this.elevenLabsApiKey) {
      try {
        // Use Rachel or default multilingual voice
        const voiceId = '21m00Tcm4TlvDq8ikWAM';
        const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': this.elevenLabsApiKey,
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg'
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8
            }
          })
        });

        if (elevenRes.ok) {
          const arrayBuffer = await elevenRes.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const result: TtsResponse = {
            audioBase64: `data:audio/mpeg;base64,${base64}`,
            format: 'audio/mpeg',
            source: 'elevenlabs'
          };
          this.cache.set(cacheKey, result);
          return result;
        } else {
          const errText = await elevenRes.text();
          console.warn(`ElevenLabs TTS returned ${elevenRes.status}: ${errText.slice(0, 160)}`);
        }
      } catch (err: any) {
        console.error(`ElevenLabs TTS failed: ${err.message}`);
      }
    }

    throw new Error('Both Sarvam AI and ElevenLabs TTS services failed to generate audio.');
  }
}
