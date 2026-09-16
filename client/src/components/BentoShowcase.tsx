import React, { useState, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../types';
import { getLandingImage } from '../utils/landingImages';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const bentoTooltips: Record<SupportedLanguage, { search: string; simulator: string; docs: string }> = {
  en: { search: 'Scheme Search & Matcher', simulator: 'What-If Eligibility Simulator', docs: 'Document Readiness Scanner' },
  hi: { search: 'योजना खोज व मिलान', simulator: 'क्या-अगर पात्रता सिम्युलेटर', docs: 'दस्तावेज़ तत्परता स्कॅनर' },
  te: { search: 'పథక శోధన & సరిపోలిక', simulator: 'అర్హత సిమ్యులేటర్', docs: 'పత్రాల సన్నద్ధత స్కానర్' },
  pa: { search: 'ਸਕੀਮ ਖੋਜ ਅਤੇ ਮੈਚਰ', simulator: 'ਯੋਗਤਾ ਸਿਮੂਲੇਟਰ', docs: 'ਦਸਤਾਵੇਜ਼ ਤਿਆਰੀ ਸਕੈਨਰ' },
  mr: { search: 'योजना शोध व जुळवणी', simulator: 'पात्रता सिम्युलेटर', docs: 'दस्तावेज सज्जता स्कॅनर' },
  bn: { search: 'প্রকল্প সন্ধান ও ম্যাচিং', simulator: 'যোগ্যতা সিমুলেটর', docs: 'নথি প্রস্তুতি স্ক্যানার' },
};

export const BentoShowcase: React.FC = () => {
  const { setActiveTab, navigateToFeature } = useProfile();
  const { language, theme } = useLanguage();

  const tt = bentoTooltips[language] || bentoTooltips.en;

  const targetBentoImg = getLandingImage('bento', language, theme);
  const [displayedImg, setDisplayedImg] = useState<string>(targetBentoImg);
  const [isImgReady, setIsImgReady] = useState<boolean>(true);

  React.useEffect(() => {
    if (targetBentoImg === displayedImg) return;
    const img = new Image();
    img.src = targetBentoImg;
    if (img.complete) {
      setDisplayedImg(targetBentoImg);
      setIsImgReady(true);
    } else {
      img.onload = () => {
        setDisplayedImg(targetBentoImg);
        setIsImgReady(true);
      };
      img.onerror = () => {
        setDisplayedImg(targetBentoImg);
        setIsImgReady(true);
      };
    }
  }, [targetBentoImg]);

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

    // Subtle tilt (-3.5 deg to +3.5 deg)
    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;

    const glareX = Math.round((x / rect.width) * 100);
    const glareY = Math.round((y / rect.height) * 100);

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.14 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
    setActiveTooltip(null);
  };

  return (
    <section className="bento-showcase-section" id="bento-showcase">
      <div className="container">
        {/* Visual Element Container (Image 3 with 3D Tilt, Glare & Interactive Hotspots) */}
        <div
          ref={containerRef}
          className={`bento-visual-stage ${isHovered ? 'hovered' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isHovered
              ? `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`
              : undefined
          }}
        >
          <div className="bento-image-wrapper">
            <img
              src={displayedImg}
              alt="Find the Right Government Schemes - SchemeMatch Interactive Bento Showcase"
              className={`bento-image-asset ${isImgReady ? 'img-loaded' : 'img-loading'}`}
              loading="eager"
              decoding="async"
            />

            {/* Interactive Hotspot Overlays */}

            {/* Hotspot 1: Scheme Search */}
            <div
              className="bento-hotspot hotspot-tool-search"
              onClick={() => navigateToFeature('matcher')}
              onMouseEnter={() => setActiveTooltip(tt.search)}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Scheme Search"
            >
              <div className="bento-pulse-dot blue" />
            </div>

            {/* Hotspot 2: What-If Simulator */}
            <div
              className="bento-hotspot hotspot-tool-simulator"
              onClick={() => navigateToFeature('whatif')}
              onMouseEnter={() => setActiveTooltip(tt.simulator)}
              onMouseLeave={() => setActiveTooltip(null)}
              title="What-If Simulator"
            >
              <div className="bento-pulse-dot pink" />
            </div>

            {/* Hotspot 3: Document Readiness */}
            <div
              className="bento-hotspot hotspot-tool-docs"
              onClick={() => navigateToFeature('documents')}
              onMouseEnter={() => setActiveTooltip(tt.docs)}
              onMouseLeave={() => setActiveTooltip(null)}
              title="Document Readiness"
            >
              <div className="bento-pulse-dot amber" />
            </div>

            {/* Floating Action Tooltip */}
            {activeTooltip && (
              <div className="bento-floating-tooltip">
                <Sparkles size={14} style={{ color: '#38BDF8' }} />
                <span>{activeTooltip}</span>
              </div>
            )}
          </div>

          {/* Ambient Glow Aura */}
          <div className="bento-ambient-glow" />
        </div>
      </div>
    </section>
  );
};
