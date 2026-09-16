import React, { useState, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../types';
import { getLandingImage } from '../utils/landingImages';
import { Sparkles, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

const heroTooltips: Record<SupportedLanguage, { scheme: string; roadmap: string; dpr: string }> = {
  en: { scheme: 'View Scheme Details & 35% Subsidy', roadmap: 'Open Application Roadmap', dpr: 'Generate Bank-Ready DPR' },
  hi: { scheme: 'योजना विवरण व 35% सब्सिडी देखें', roadmap: 'आवेदन रोडमैप खोलें', dpr: 'बैंक-रेडी DPR बनाएं' },
  te: { scheme: 'పథకం వివరాలు & 35% సబ్సిడీ చూడండి', roadmap: 'దరఖాస్తు రోడ్‌మ్యాప్ తెరవండి', dpr: 'బ్యాంక్-రెడీ DPR రూపొందించండి' },
  pa: { scheme: 'ਸਕੀਮ ਵੇਰਵੇ ਅਤੇ 35% ਸਬਸਿਡੀ ਵੇਖੋ', roadmap: 'ਅਰਜ਼ੀ ਰੋਡਮੈਪ ਖੋਲ੍ਹੋ', dpr: 'ਬੈਂਕ-ਤਿਆਰ DPR ਬਣਾਓ' },
  mr: { scheme: 'योजना तपशील व 35% अनुदान पहा', roadmap: 'अर्ज रोडमॅप उघडा', dpr: 'बँक-सज्ज DPR तयार करा' },
  bn: { scheme: 'প্রকল্পের বিবরণ ও ৩৫% ভর্তুকি দেখুন', roadmap: 'আবেদন রোডম্যাপ খুলুন', dpr: 'ব্যাংক-রেডি DPR তৈরি করুন' }
};

export const HeroScrollWindow: React.FC = () => {
  const { setActiveTab, navigateToFeature, setSelectedSchemeModal, matchResults } = useProfile();
  const { t, language, theme } = useLanguage();

  const tt = heroTooltips[language] || heroTooltips.en;

  const targetHeroImg = getLandingImage('hero', language, theme);
  const [displayedImg, setDisplayedImg] = useState<string>(targetHeroImg);
  const [isImgReady, setIsImgReady] = useState<boolean>(true);

  React.useEffect(() => {
    if (targetHeroImg === displayedImg) return;
    const img = new Image();
    img.src = targetHeroImg;
    if (img.complete) {
      setDisplayedImg(targetHeroImg);
      setIsImgReady(true);
    } else {
      img.onload = () => {
        setDisplayedImg(targetHeroImg);
        setIsImgReady(true);
      };
      img.onerror = () => {
        setDisplayedImg(targetHeroImg);
        setIsImgReady(true);
      };
    }
  }, [targetHeroImg]);

  // 3D Tilt & Specular Glare State
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within container
    const y = e.clientY - rect.top;  // y position within container
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth subtle tilt (-4.5 deg to +4.5 deg)
    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;

    // Specular Glare coordinate in percentage
    const glareX = Math.round((x / rect.width) * 100);
    const glareY = Math.round((y / rect.height) * 100);

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.16 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
    setActiveTooltip(null);
  };

  const handleOpenPmegp = () => {
    const found = matchResults.find(m => m.scheme.id === 'pmegp-2026') || matchResults[0];
    if (found) {
      setSelectedSchemeModal(found);
    } else {
      navigateToFeature('matcher');
    }
  };

  return (
    <section className="hero-scroll-window-section" id="hero-scroll-window">
      <div className="container">
        {/* Kicker Label matching Image 1 */}
        <div className="hero-scroll-kicker">
          <span>{t.landing.heroKicker}</span>
        </div>

        {/* Big Bold Headline matching Image 1 */}
        <h1 className="hero-scroll-heading">
          {t.landing.heroHeadingLine1} <br />
          <span className="hero-scroll-highlight">
            {t.landing.heroHeadingLine2}
            <span className="hero-cursor-line" />
            <span className="hero-cursor-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ flexShrink: 0 }}>
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
              <span>{t.landing.heroCursorTag}</span>
            </span>
          </span>
        </h1>

        {/* Subtitle matching Image 1 rhythm */}
        <p className="hero-scroll-subtitle">
          {t.landing.heroSubtitle}
        </p>

        {/* Visual Element Container (Image 2 with Movement Animations & 3D Tilt) */}
        <div
          ref={containerRef}
          className={`hero-visual-stage ${isHovered ? 'hovered' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isHovered
              ? `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`
              : undefined
          }}
        >
          {/* Main Visual Image matching Image 2 */}
          <div className="hero-image-wrapper">
            <img
              src={displayedImg}
              alt="SchemeMatch AI Interactive Showcase"
              className={`hero-image-asset ${isImgReady ? 'img-loaded' : 'img-loading'}`}
              loading="eager"
              decoding="async"
            />

            {/* Dynamic Specular Glare Reflection moving with cursor */}
            <div
              className="hero-glare-sheen"
              style={{
                background: isHovered
                  ? `radial-gradient(circle 500px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}), transparent 75%)`
                  : undefined
              }}
            />

            {/* Interactive Hotspot 1: Scheme Details */}
            <div
              className="hero-hotspot hotspot-header"
              onClick={handleOpenPmegp}
              onMouseEnter={() => setActiveTooltip(tt.scheme)}
              onMouseLeave={() => setActiveTooltip(null)}
              title="View Scheme Details"
            >
              <div className="hotspot-pulse-ring" />
            </div>

            {/* Interactive Hotspot 2: Application Roadmap */}
            <div
              className="hero-hotspot hotspot-fast-track"
              onClick={() => navigateToFeature('roadmap')}
              onMouseEnter={() => setActiveTooltip(tt.roadmap)}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Application Roadmap"
            >
              <div className="hotspot-pulse-ring blue" />
            </div>

            {/* Interactive Hotspot 3: DPR Generator */}
            <div
              className="hero-hotspot hotspot-auto-gen"
              onClick={() => navigateToFeature('dpr')}
              onMouseEnter={() => setActiveTooltip(tt.dpr)}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Generate DPR"
            >
              <div className="hotspot-pulse-ring gold" />
            </div>

            {/* Floating Interactive Live Tooltip */}
            {activeTooltip && (
              <div className="hero-floating-tooltip">
                <Sparkles size={14} style={{ color: '#F59E0B' }} />
                <span>{activeTooltip}</span>
              </div>
            )}
          </div>

          {/* Ambient Glow Aura behind visual */}
          <div className="hero-ambient-glow" />
        </div>
      </div>
    </section>
  );
};
