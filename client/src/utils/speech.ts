import { SupportedLanguage } from '../types';

export class SpeechAssistant {
  private static isSpeaking = false;
  private static activeCallback: ((speaking: boolean) => void) | null = null;
  private static currentAudio: HTMLAudioElement | null = null;
  private static currentAbortController: AbortController | null = null;

  public static async speak(
    text: string,
    lang: SupportedLanguage = 'hi',
    onStateChange?: (speaking: boolean) => void
  ) {
    // 1. Immediately stop any currently playing speech/audio
    this.stop();

    // 2. Set new active callback and speaking state
    this.activeCallback = onStateChange || null;
    this.isSpeaking = true;
    if (this.activeCallback) {
      this.activeCallback(true);
    }

    // 3. Clean markdown formatting, currency symbols, and extra whitespace
    const cleanText = text
      .replace(/[*_#`[\]()]/g, ' ')
      .replace(/₹/g, 'Rupees ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      this.stop();
      return;
    }

    const abortController = new AbortController();
    this.currentAbortController = abortController;

    // 4. Request high-fidelity Indic/English audio from Sarvam AI / ElevenLabs via backend
    try {
      const response = await fetch('http://localhost:5000/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: cleanText,
          language: lang
        }),
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error(`TTS server responded with ${response.status}`);
      }

      const data = (await response.json()) as { audioBase64?: string; format?: string; source?: string };

      // If playback was cancelled while the network request was in-flight, discard
      if (abortController.signal.aborted || !this.isSpeaking) {
        return;
      }

      if (data.audioBase64) {
        const audio = new Audio(data.audioBase64);
        this.currentAudio = audio;

        audio.onended = () => {
          this.stop();
        };

        audio.onerror = (err) => {
          console.warn('Audio playback error, attempting browser fallback:', err);
          this.speakBrowserFallback(cleanText, lang);
        };

        await audio.play();
        return;
      } else {
        throw new Error('No audio payload returned by TTS server');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User stopped or switched speech intentionally
        return;
      }
      console.warn('Backend TTS failed, falling back to browser SpeechSynthesis:', err.message);
      
      if (!abortController.signal.aborted && this.isSpeaking) {
        this.speakBrowserFallback(cleanText, lang);
      }
    }
  }

  private static speakBrowserFallback(cleanText: string, lang: SupportedLanguage) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      this.stop();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const langMap: Record<SupportedLanguage, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        pa: 'pa-IN',
        mr: 'mr-IN',
        bn: 'bn-IN'
      };

      utterance.lang = langMap[lang] || 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (this.activeCallback) this.activeCallback(true);
      };

      utterance.onend = () => {
        this.stop();
      };

      utterance.onerror = (e) => {
        console.error('Browser speech error:', e);
        this.stop();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Failed browser speech fallback:', e);
      this.stop();
    }
  }

  public static stop() {
    // Cancel in-flight network request if any
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }

    // Stop and release HTML Audio element if playing
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.currentAudio = null;
    }

    // Cancel browser SpeechSynthesis if active
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }

    this.isSpeaking = false;
    if (this.activeCallback) {
      const cb = this.activeCallback;
      this.activeCallback = null;
      cb(false);
    }
  }

  public static isAudioSpeaking(): boolean {
    return this.isSpeaking;
  }
}

