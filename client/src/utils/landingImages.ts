import { SupportedLanguage } from '../types';
import heroShowcaseImg from '../assets/hero-showcase.png';
import superpoweredShowcaseImg from '../assets/superpowered-showcase.png';
import bentoShowcaseImg from '../assets/bento-showcase.png';

/**
 * Delivers pristine, crystal-clear, uncompressed native PNG quality
 * directly from ImageKit CDN without lossy JPEG compression or blurry interpolation.
 */
function to4kUrl(rawUrl: string): string {
  if (!rawUrl || !rawUrl.includes('ik.imagekit.io')) return rawUrl;
  if (rawUrl.includes('tr=')) {
    return rawUrl.replace(/tr=[^&]+/, 'tr=orig-true');
  }
  const separator = rawUrl.includes('?') ? '&' : '?';
  return `${rawUrl}${separator}tr=orig-true`;
}

/**
 * Online Cloud CDN Image Assets for Landing Page across 6 languages in both Light and Dark themes,
 * automatically upscaled to 4K Ultra-HD.
 */
export const LANDING_IMAGES: {
  light: {
    hero: Record<SupportedLanguage, string>;
    superpowered: Record<SupportedLanguage, string>;
    bento: Record<SupportedLanguage, string>;
  };
  dark: {
    hero: Record<SupportedLanguage, string>;
    superpowered: Record<SupportedLanguage, string>;
    bento: Record<SupportedLanguage, string>;
  };
} = {
  // ─── Light Mode ────────────────────────────────────────────────────────
  light: {
    // 1st Showcase Picture: Hero Window (HeroScrollWindow.tsx) - Light
    hero: {
      en: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_English.png?updatedAt=1789467345441'),
      hi: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Hindi.png'),
      te: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Telugu.png?updatedAt=1789467328066'),
      pa: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Punjabi.png'),
      mr: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Marathi.png'),
      bn: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201/Image_1_Bangla.png')
    },

    // 2nd Showcase Picture: Superpowered Cards Window (SuperpoweredCardsSection.tsx) - Light
    superpowered: {
      en: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_english.png'),
      hi: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_hindi.png'),
      te: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_telugu.png'),
      pa: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_punjabi.png'),
      mr: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_marathi.png'),
      bn: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202/image_2_bangla.png')
    },

    // 3rd Showcase Picture: Bento Showcase Window (BentoShowcase.tsx) - Light
    bento: {
      en: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_english.png'),
      hi: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_hindi.png'),
      te: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_telugu.png'),
      pa: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_marathi.png'),
      mr: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_marathi.png'),
      bn: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203/Image_03_bangali.png')
    }
  },

  // ─── Dark Mode ─────────────────────────────────────────────────────────
  dark: {
    // 1st Showcase Picture: Hero Window (HeroScrollWindow.tsx) - Dark
    hero: {
      en: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201%20Dark/Image_1_black_english.png'),
      hi: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201%20Dark/Image_1_black_hindi.png'),
      te: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201%20Dark/Image_1_black_telugu.png'),
      pa: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201%20Dark/Image_1_black_punjabi.png'),
      mr: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201%20Dark/Image_1_black_marathi.png'),
      bn: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%201%20Dark/Image_1_black_bangla.png')
    },

    // 2nd Showcase Picture: Superpowered Cards Window (SuperpoweredCardsSection.tsx) - Dark
    superpowered: {
      en: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202%20Dark/image_2_black_english.png?updatedAt=1789502113608'),
      hi: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202%20Dark/image_2_black_hindi.png?updatedAt=1789502113450'),
      te: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202%20Dark/image_2_black_telugu.png?updatedAt=1789502113692'),
      pa: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202%20Dark/image_2_black_punjabi.png?updatedAt=1789502113680'),
      mr: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202%20Dark/image_2_black_marathi.png?updatedAt=1789502113564'),
      bn: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%202%20Dark/image_2_black_bangla.png?updatedAt=1789502113458')
    },

    // 3rd Showcase Picture: Bento Showcase Window (BentoShowcase.tsx) - Dark
    bento: {
      en: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203%20DARK/Image_03_English_dark.png?updatedAt=1789502071103'),
      hi: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203%20DARK/Image_03_hindi_dark.png?updatedAt=1789502071089'),
      te: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203%20DARK/Iamge_03_telugu_dark.png?updatedAt=1789502071109'),
      pa: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203%20DARK/Image_03_punjabi_dark.png?updatedAt=1789502071101'),
      mr: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203%20DARK/Image_03_marathi_dark.png?updatedAt=1789502071111'),
      bn: to4kUrl('https://ik.imagekit.io/AnubhavAkhil/SIH%202026/Image%203%20DARK/Image_03_bangali_dark.png?updatedAt=1789502071092')
    }
  }
};

const LOCAL_FALLBACKS = {
  hero: heroShowcaseImg,
  superpowered: superpoweredShowcaseImg,
  bento: bentoShowcaseImg
};

/**
 * Helper function to retrieve the active 4K image with graceful fallback,
 * respecting both current language and theme (light or dark).
 */
export function getLandingImage(
  section: 'hero' | 'superpowered' | 'bento',
  lang: SupportedLanguage,
  theme: 'light' | 'dark' = 'light'
): string {
  const themeGroup = LANDING_IMAGES[theme] || LANDING_IMAGES.light;
  return themeGroup[section]?.[lang] || LOCAL_FALLBACKS[section];
}

/**
 * Preloads all 4K landing images across all 6 languages in both Light & Dark themes
 * into the browser's HTTP and memory cache so language & theme switching happens seamlessly.
 */
export function preloadAllLandingImages(): void {
  if (typeof window === 'undefined') return;

  const sections: Array<'hero' | 'superpowered' | 'bento'> = ['hero', 'superpowered', 'bento'];
  const languages: SupportedLanguage[] = ['en', 'hi', 'te', 'pa', 'mr', 'bn'];
  const themes: Array<'light' | 'dark'> = ['light', 'dark'];

  // Stagger preload so as not to choke the initial page rendering
  const schedulePreload = () => {
    themes.forEach((th, tIdx) => {
      languages.forEach((lang, lIdx) => {
        setTimeout(() => {
          sections.forEach((sec) => {
            const url = getLandingImage(sec, lang, th);
            if (url) {
              const img = new Image();
              img.decoding = 'async';
              img.src = url;
            }
          });
        }, (tIdx * languages.length + lIdx) * 50);
      });
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(schedulePreload, { timeout: 1200 });
  } else {
    setTimeout(schedulePreload, 200);
  }
}
