import React, { useState, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../types';
import { getLandingImage } from '../utils/landingImages';
import { Sparkles, MapPin, Compass, CheckCircle2, ArrowRight, Building2, Scale, ShieldCheck } from 'lucide-react';

const spTooltips: Record<SupportedLanguage, { discover: string; topMatch: string; compare: string; partners: string }> = {
  en: { discover: 'Discover Matching Schemes', topMatch: 'View Top Match Details', compare: 'Compare Schemes Side-by-Side', partners: 'Find Channel Partners' },
  hi: { discover: 'अनुकूल योजनाएं खोजें', topMatch: 'सर्वश्रेष्ठ मिलान देखें', compare: 'योजनाओं की साथ-साथ तुलना करें', partners: 'निकटतम चैनल पार्टनर खोजें' },
  te: { discover: 'సరిపోయే పథకాలను కనుగొనండి', topMatch: 'ఉత్తమ పథక వివరాలు చూడండి', compare: 'పథకాలను పోల్చండి', partners: 'చానల్ భాగస్వాములను కనుగొనండి' },
  pa: { discover: 'ਸਹੀ ਸਕੀਮਾਂ ਲੱਭੋ', topMatch: 'ਸਿਖਰਲੀ ਸਕੀਮ ਵੇਰਵੇ ਵੇਖੋ', compare: 'ਸਕੀਮਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ', partners: 'ਚੈਨਲ ਭਾਗੀਦਾਰ ਲੱਭੋ' },
  mr: { discover: 'योग्य योजना शोधा', topMatch: 'सर्वोत्तम योजनेचे तपशील पहा', compare: 'योजनांची तुलना करा', partners: 'चॅनेल पार्टनर शोधा' },
  bn: { discover: 'উপযুক্ত প্রকল্প খুঁজুন', topMatch: 'সেরা প্রকল্পের বিবরণ দেখুন', compare: 'প্রকল্প তুলনা করুন', partners: 'চ্যানেল পার্টনার খুঁজুন' },
};

export const SuperpoweredCardsSection: React.FC = () => {
  const { setActiveTab, navigateToFeature, setSelectedSchemeModal, matchResults } = useProfile();
  const { t, language, theme } = useLanguage();

  const tt = spTooltips[language] || spTooltips.en;

  const targetSpImg = getLandingImage('superpowered', language, theme);
  const [displayedImg, setDisplayedImg] = useState<string>(targetSpImg);
  const [isImgReady, setIsImgReady] = useState<boolean>(true);

  React.useEffect(() => {
    if (targetSpImg === displayedImg) return;
    const img = new Image();
    img.src = targetSpImg;
    if (img.complete) {
      setDisplayedImg(targetSpImg);
      setIsImgReady(true);
    } else {
      img.onload = () => {
        setDisplayedImg(targetSpImg);
        setIsImgReady(true);
      };
      img.onerror = () => {
        setDisplayedImg(targetSpImg);
        setIsImgReady(true);
      };
    }
  }, [targetSpImg]);

  // 3D Tilt & Specular Glare State
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth subtle tilt (-4 deg to +4 deg)
    const rotateX = ((y - centerY) / centerY) * -4.0;
    const rotateY = ((x - centerX) / centerX) * 4.0;

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

  const handleOpenTermLoan = () => {
    const found = matchResults.find(m => 
      m.scheme.id.includes('nsfdc-term-loan') || 
      m.scheme.name.toLowerCase().includes('term loan')
    ) || matchResults[0];

    if (found) {
      setSelectedSchemeModal(found);
    } else {
      navigateToFeature('matcher');
    }
  };

  return (
    <section className="superpowered-section" id="superpowered-showcase">
      <div className="container">
        {/* Section Headline matching Reference Design */}
        <div className="superpowered-header">
          <h2 className="superpowered-title">
            {t.landing.superpoweredTitleLine1} <br />
            {t.landing.superpoweredTitleLine2} <br />
            {t.landing.superpoweredTitleLine3}
          </h2>
          <p className="superpowered-subtitle">
            {t.landing.superpoweredSubtitle}
          </p>
        </div>

        {/* 2nd Visual Element Stage (4K Image Showcase with 3D Tilt, Floating & Hotspots) */}
        <div
          ref={containerRef}
          className={`sp-visual-stage ${isHovered ? 'hovered' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isHovered
              ? `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`
              : undefined
          }}
        >
          <div className="sp-image-wrapper">
            {/* 4K Visual Asset */}
            <img
              src={displayedImg}
              alt="SchemeMatch 3-Card Multi-Window Workspace Showcase"
              className={`sp-image-asset ${isImgReady ? 'img-loaded' : 'img-loading'}`}
              loading="eager"
              decoding="async"
            />

            {/* Dynamic Specular Glare Reflection moving with cursor */}
            <div
              className="sp-glare-sheen"
              style={{
                background: isHovered
                  ? `radial-gradient(circle 500px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}), transparent 75%)`
                  : undefined
              }}
            />

            {/* Hotspot 1: Scheme Discovery */}
            <div
              className="sp-hotspot sp-hotspot-start-biz"
              onClick={() => navigateToFeature('matcher')}
              onMouseEnter={() => setActiveTooltip(tt.discover)}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Discover Schemes"
            >
              <div className="sp-pulse-ring blue" />
            </div>

            {/* Hotspot 2: Top Match Details */}
            <div
              className="sp-hotspot sp-hotspot-header"
              onClick={handleOpenTermLoan}
              onMouseEnter={() => setActiveTooltip(tt.topMatch)}
              onMouseLeave={() => setActiveTooltip(null)}
              title="View Top Match"
            >
              <div className="sp-pulse-ring green" />
            </div>

            {/* Hotspot 3: Compare Schemes */}
            <div
              className="sp-hotspot sp-hotspot-compare-schemes"
              onClick={() => navigateToFeature('comparison')}
              onMouseEnter={() => setActiveTooltip(tt.compare)}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Compare Schemes"
            >
              <div className="sp-pulse-ring blue" />
            </div>

            {/* Hotspot 4: Channel Partners */}
            <div
              className="sp-hotspot sp-hotspot-map-btn"
              onClick={() => navigateToFeature('partners')}
              onMouseEnter={() => setActiveTooltip(tt.partners)}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Channel Partners"
            >
              <div className="sp-pulse-ring purple" />
            </div>

            {/* Dynamic Floating Interactive Live Tooltip */}
            {activeTooltip && (
              <div className="sp-floating-tooltip">
                <Sparkles size={14} style={{ color: '#10B981' }} />
                <span>{activeTooltip}</span>
              </div>
            )}
          </div>

          {/* Ambient Glow Aura behind 2nd Visual Element */}
          <div className="sp-ambient-glow" />
        </div>
      </div>
    </section>
  );
};
