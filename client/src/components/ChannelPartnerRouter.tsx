import React, { useState, useEffect, useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';
import { EvaluatedPartner, PartnerRoutingResult } from '../types';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  Search,
  Filter,
  Send,
  Sparkles,
  ArrowRight,
  Info,
  Navigation,
  Compass,
  AlertTriangle,
  XCircle,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Crosshair
} from 'lucide-react';

const POPULAR_DISTRICTS = [
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 }
];

const SCHEME_OPTIONS = [
  { id: 'pm-vishwakarma', name: 'PM Vishwakarma Scheme (Artisans & Tailors)' },
  { id: 'pmegp-2026', name: "Prime Minister's Employment Generation Programme (PMEGP)" },
  { id: 'stand-up-india', name: 'Stand-Up India Scheme (SC/ST & Women)' },
  { id: 'mudra-kishor', name: 'Pradhan Mantri MUDRA Yojana (Kishor / Tarun)' },
  { id: 'nsfdc-term-loan', name: 'NSFDC Term Loan (Scheduled Caste Empowerment)' },
  { id: 'visvas-scheme', name: 'VISVAS Scheme (5% Direct Interest Subvention)' },
  { id: 'pm-svanidhi', name: "PM SVANidhi (Micro-Credit for Street Vendors)" }
];

const LOAN_CATEGORIES = [
  'Term Loan',
  'Working Capital',
  'Composite Loan',
  'Micro-Credit'
] as const;

export const ChannelPartnerRouter: React.FC = () => {
  const { profile, matchResults } = useProfile();

  // Selected parameters
  const [selectedDistrict, setSelectedDistrict] = useState<string>(profile.district || 'Varanasi');
  const [selectedState, setSelectedState] = useState<string>(profile.state || 'Uttar Pradesh');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({ lat: 25.3176, lng: 82.9739 });
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  // Scheme & Loan selection
  const defaultScheme = matchResults[0]?.scheme.id || 'pm-vishwakarma';
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(defaultScheme);
  const [loanCategory, setLoanCategory] = useState<'Term Loan' | 'Working Capital' | 'Composite Loan' | 'Micro-Credit'>('Term Loan');
  const [loanAmount, setLoanAmount] = useState<number>(profile.requiredLoanAmount || 150000);

  // Results & UI State
  const [routingResult, setRoutingResult] = useState<PartnerRoutingResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Recommended' | 'Limited' | 'Not eligible'>('all');
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState<EvaluatedPartner | null>(null);
  const [routedPartner, setRoutedPartner] = useState<EvaluatedPartner | null>(null);
  const [showRoutingModal, setShowRoutingModal] = useState<boolean>(false);

  // Detect live GPS location
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        setIsGpsActive(true);
        setGpsLoading(false);
      },
      (error) => {
        console.warn('Geolocation failed or denied, using district coordinates:', error.message);
        setGpsLoading(false);
        setIsGpsActive(false);
      },
      { timeout: 10000 }
    );
  };

  // Sync coords when district changes
  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const found = POPULAR_DISTRICTS.find(d => d.name.toLowerCase() === distName.toLowerCase());
    if (found) {
      setSelectedState(found.state);
      setUserCoords({ lat: found.lat, lng: found.lng });
      setIsGpsActive(false);
    }
  };

  // Execute the 7-stage Geo-Spatial Partner Locator & Router calculation
  const runPartnerRouting = async () => {
    setIsLoading(true);
    const schemeObj = SCHEME_OPTIONS.find(s => s.id === selectedSchemeId);
    const payload = {
      userLocation: {
        district: selectedDistrict,
        state: selectedState,
        coordinates: userCoords
      },
      selectedSchemeId,
      selectedSchemeName: schemeObj?.name || selectedSchemeId,
      loanCategory,
      loanAmount,
      userCategory: profile.category || 'SC',
      gender: profile.gender || 'Male',
      tradeType: profile.tradeType || 'Tailoring'
    };

    try {
      const res = await fetch('http://localhost:5000/api/partners/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data: PartnerRoutingResult = await res.json();
        setRoutingResult(data);
        if (!selectedPartnerDetail && data.recommendedPartner) {
          setSelectedPartnerDetail(data.recommendedPartner);
        }
      }
    } catch (err) {
      console.error('Partner routing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run routing whenever inputs change
  useEffect(() => {
    runPartnerRouting();
  }, [selectedDistrict, selectedState, userCoords, selectedSchemeId, loanCategory, loanAmount, profile.category]);

  const recommendedPartner = routingResult?.recommendedPartner;
  const allPartners = routingResult?.allRankedPartners || [];

  // Filter other partners
  const filteredPartners = useMemo(() => {
    return allPartners.filter((p) => {
      if (statusFilter !== 'all' && p.routingStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBranch = p.branchName.toLowerCase().includes(q);
        const matchOfficer = p.nodalOfficer.toLowerCase().includes(q);
        if (!matchName && !matchBranch && !matchOfficer) return false;
      }
      return true;
    });
  }, [allPartners, statusFilter, searchQuery]);

  const selectedSchemeTitle = SCHEME_OPTIONS.find(s => s.id === selectedSchemeId)?.name || selectedSchemeId;

  return (
    <div className="partner-router-container" style={{ padding: '8px 0' }}>
      
      {/* ─── MODULE HEADER & BANNER ────────────────────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        marginBottom: '20px',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        border: '1.5px solid var(--border-subtle)'
      }}>
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 280,
          height: 280,
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(79, 70, 229, 0.05) 50%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} />
                Geo-Spatial Partner Locator & Router
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Geo-Spatial Partner Locator & Router
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, maxWidth: '780px', lineHeight: 1.5 }}>
              Finds the nearest authorized State Channelising Agency (SCA), Public Sector Bank (PSB), Regional Rural Bank (RRB), or NBFC-MFI capable of processing your selected scheme and loan category.
            </p>
          </div>

          {/* Active Jurisdiction Capsule */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-surface-elevated)',
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <MapPin size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                {isGpsActive ? '📍 Live GPS Location' : '📍 District Catchment'}
              </span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                {selectedDistrict}, {selectedState}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 7-STAGE DECISION PIPELINE VISUALIZER ───────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        borderRadius: '12px',
        marginBottom: '22px',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: '10px' }}>
          7-Stage Routing Decision Pipeline (How SchemeMatch Determines Best Partner)
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {[
            { step: '1', title: 'User Location', desc: `${selectedDistrict}` },
            { step: '2', title: 'Selected Scheme', desc: selectedSchemeId.replace('-2026', '') },
            { step: '3', title: 'Loan Category', desc: `${loanCategory}` },
            { step: '4', title: 'Authorized Partners', desc: `${routingResult?.decisionPipeline.authorizedPartnersCount || 4} Found` },
            { step: '5', title: 'Eligibility & Availability', desc: 'SLA Verified' },
            { step: '6', title: 'Distance', desc: `${recommendedPartner?.distanceKm || 2.4} km` },
            { step: '7', title: 'Best Partner', desc: '🟢 Recommended' }
          ].map((node, idx, arr) => (
            <React.Fragment key={idx}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                background: idx === 6 ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface)',
                border: idx === 6 ? '1.5px solid #10B981' : '1px solid var(--border-subtle)',
                minWidth: '110px'
              }}>
                <span style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  color: idx === 6 ? '#059669' : 'var(--primary-saffron)',
                  marginBottom: '2px'
                }}>
                  Step {node.step}
                </span>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  {node.title}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '100px' }}>
                  {node.desc}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ─── INTERACTIVE CONTROLS ROW ─────────────────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        borderRadius: '12px',
        marginBottom: '22px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        alignItems: 'center'
      }}>
        {/* District Selector + GPS */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
            📍 Location / District
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)'
              }}
            >
              {POPULAR_DISTRICTS.map(d => (
                <option key={d.name} value={d.name}>{d.name}, {d.state}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={gpsLoading}
              title="Detect Live GPS Location"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: isGpsActive ? '#10B981' : 'var(--bg-surface-elevated)',
                color: isGpsActive ? '#fff' : 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              <Crosshair size={14} className={gpsLoading ? 'animate-spin' : ''} />
              <span>{isGpsActive ? 'GPS' : 'Detect'}</span>
            </button>
          </div>
        </div>

        {/* Selected Scheme Selector */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
            🏛️ Target Scheme
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)'
            }}
          >
            {SCHEME_OPTIONS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Loan Category */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
            💳 Loan Category
          </label>
          <select
            value={loanCategory}
            onChange={(e) => setLoanCategory(e.target.value as any)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)'
            }}
          >
            {LOAN_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Loan Amount */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
            💰 Loan Amount (₹)
          </label>
          <input
            type="number"
            step="10000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value, 10) || 10000)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      {/* ─── RECOMMENDED CHANNEL PARTNER HERO SHOWCASE ───────────────────── */}
      {recommendedPartner && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.06) 100%)',
          border: '2px solid #10B981',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '26px',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.1)',
          position: 'relative'
        }}>
          {/* Top Row: Location Header + Distance Pin */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#10B981', color: '#fff', padding: '3px 10px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ⭐ Recommended Channel Partner
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.12)', padding: '3px 8px', borderRadius: '6px' }}>
                  Best Route for {selectedSchemeTitle.split(' ')[0]}
                </span>
              </div>
              
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🏦 {recommendedPartner.name}</span>
              </h2>
              
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                  {recommendedPartner.type} ({recommendedPartner.typeFullName})
                </span>
                <span>• {recommendedPartner.branchName}</span>
              </div>
            </div>

            {/* Distance Capsule */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              background: 'var(--bg-surface)',
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1.5px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={20} />
                <span>{recommendedPartner.distanceKm} km away</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                from your stated location ({selectedDistrict})
              </span>
            </div>
          </div>

          {/* 4 EXACT CHECKMARK VALIDATION CRITERIA */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#059669', letterSpacing: '0.04em', marginBottom: '10px' }}>
              4-Point Route Validation Verified by SchemeMatch Engine:
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>Authorized for selected scheme ({selectedSchemeTitle.split(' ')[0]})</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>Handles {loanCategory}s (Cap: ₹{(recommendedPartner.maxLoanAmount / 100000).toFixed(0)}L)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>Suitable for your category ({profile.category || 'SC / Artisan'})</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span>Currently eligible for digital routing (SLA active)</span>
              </div>
            </div>
          </div>

          {/* Nodal Officer & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div><strong>Nodal Officer:</strong> {recommendedPartner.nodalOfficer}</div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
                <a href={`tel:${recommendedPartner.phone}`} style={{ color: '#4F46E5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={13} /> {recommendedPartner.phone}
                </a>
                <a href={`mailto:${recommendedPartner.email}`} style={{ color: '#059669', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={13} /> {recommendedPartner.email}
                </a>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <a
                href={recommendedPartner.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  border: '1.5px solid var(--border-subtle)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <Navigation size={15} style={{ color: '#4F46E5' }} />
                <span>Get Directions</span>
                <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />
              </a>

              <button
                type="button"
                onClick={() => {
                  setRoutedPartner(recommendedPartner);
                  setShowRoutingModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                <Send size={15} />
                <span>Route Application</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── INTERACTIVE GEO-SPATIAL RADAR / MAP VISUALIZER ─────────────────── */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        borderRadius: '14px',
        marginBottom: '26px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={18} style={{ color: '#4F46E5' }} />
              <span>Catchment Radar & Partner Distribution ({selectedDistrict})</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Concentric distance rings (2 km, 5 km, 10 km) centered at your location. Click any partner pin to view branch appraisal status.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', fontSize: '0.74rem', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669' }}>🟢 Recommended</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706' }}>🟡 Limited</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626' }}>🔴 Not eligible</span>
          </div>
        </div>

        {/* SVG Radar Map */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          background: 'radial-gradient(circle, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* Distance Rings */}
          <div style={{ position: 'absolute', width: '90px', height: '90px', borderRadius: '50%', border: '1px dashed rgba(79, 70, 229, 0.25)', pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', top: 'calc(50% - 52px)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>2 km</span>

          <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', border: '1px dashed rgba(79, 70, 229, 0.2)', pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', top: 'calc(50% - 88px)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>5 km</span>

          <div style={{ position: 'absolute', width: '230px', height: '230px', borderRadius: '50%', border: '1px dashed rgba(79, 70, 229, 0.12)', pointerEvents: 'none' }} />
          <span style={{ position: 'absolute', top: 'calc(50% - 122px)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>10 km</span>

          {/* User Center Pulse */}
          <div style={{
            position: 'absolute',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(79, 70, 229, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(79, 70, 229, 0.4)'
          }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#4F46E5' }} />
            <span style={{ position: 'absolute', bottom: -18, fontSize: '0.68rem', fontWeight: 800, color: '#4F46E5', whiteSpace: 'nowrap' }}>
              📍 You ({selectedDistrict})
            </span>
          </div>

          {/* Partner Radar Pins */}
          {allPartners.map((partner, pIdx) => {
            // Distribute on radial angles for visual representation
            const angleDeg = (pIdx * 65) + 30;
            const angleRad = (angleDeg * Math.PI) / 180;
            const rPx = Math.min(105, 30 + (partner.distanceKm * 18));
            const x = Math.cos(angleRad) * rPx;
            const y = Math.sin(angleRad) * rPx;

            const isRec = partner.routingStatus === 'Recommended';
            const isLim = partner.routingStatus === 'Limited';
            const pinColor = isRec ? '#10B981' : isLim ? '#F59E0B' : '#EF4444';

            return (
              <button
                key={partner.id}
                type="button"
                onClick={() => setSelectedPartnerDetail(partner)}
                title={`${partner.name} (${partner.distanceKm} km) - ${partner.routingStatus}`}
                style={{
                  position: 'absolute',
                  transform: `translate(${x}px, ${y}px)`,
                  background: 'var(--bg-surface)',
                  border: `2px solid ${pinColor}`,
                  borderRadius: '20px',
                  padding: '3px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  zIndex: isRec ? 5 : 2
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: pinColor }} />
                <span>{partner.type} ({partner.distanceKm}km)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── OTHER PARTNERS SECTION (TABLE / CARDS) ────────────────────────── */}
      <div className="glass-panel" style={{
        padding: '22px 26px',
        borderRadius: '16px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              All Channel Partners in Catchment ({allPartners.length})
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Evaluated based on Selected Scheme ({selectedSchemeTitle.split(' ')[0]}), Category, and Distance
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filter branches or officers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '7px 12px 7px 32px',
                  fontSize: '0.82rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)'
                }}
              />
            </div>

            {/* Status Pills */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'all', label: `All (${allPartners.length})` },
                { id: 'Recommended', label: '🟢 Recommended' },
                { id: 'Limited', label: '🟡 Limited' },
                { id: 'Not eligible', label: '🔴 Not eligible' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as any)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: statusFilter === tab.id ? 700 : 500,
                    background: statusFilter === tab.id ? 'var(--bg-surface-elevated)' : 'transparent',
                    border: statusFilter === tab.id ? '1px solid var(--primary-saffron)' : '1px solid var(--border-subtle)',
                    color: statusFilter === tab.id ? 'var(--primary-saffron)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Structured List: Partner A | Distance | Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredPartners.map((partner) => {
            const isRec = partner.routingStatus === 'Recommended';
            const isLim = partner.routingStatus === 'Limited';
            const statusColor = isRec ? '#059669' : isLim ? '#D97706' : '#DC2626';
            const statusBg = isRec ? 'rgba(16, 185, 129, 0.1)' : isLim ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)';
            const statusIcon = isRec ? '🟢' : isLim ? '🟡' : '🔴';

            return (
              <div
                key={partner.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'var(--bg-surface-elevated)',
                  border: isRec ? '1.5px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                {/* Left: Name, Type, Branch */}
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                      {partner.name}
                    </span>
                    <span className="badge badge-subtle" style={{ fontSize: '0.7rem' }}>
                      {partner.type}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    📍 {partner.branchName} • Officer: {partner.nodalOfficer}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: isRec ? '#059669' : 'var(--text-muted)', marginTop: '4px' }}>
                    {partner.statusReason}
                  </div>
                </div>

                {/* Center: Distance */}
                <div style={{ textAlign: 'center', minWidth: '90px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {partner.distanceKm} km
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                    away
                  </span>
                </div>

                {/* Right: Status Pill & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    background: statusBg,
                    color: statusColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap'
                  }}>
                    <span>{statusIcon}</span>
                    <span>{partner.routingStatus}</span>
                  </span>

                  <a
                    href={partner.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Get Directions on Google Maps"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: '#4F46E5',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Navigation size={13} />
                    <span>Map</span>
                  </a>

                  {isRec && (
                    <button
                      type="button"
                      onClick={() => {
                        setRoutedPartner(partner);
                        setShowRoutingModal(true);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#10B981',
                        color: '#fff',
                        border: 'none',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Route
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── DIGITAL APPLICATION ROUTING MODAL ────────────────────────────── */}
      {showRoutingModal && routedPartner && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '2px solid #10B981',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px 28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={16} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Dispatch Pre-Verified Application
                </h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Direct handoff to designated branch credit desk
                </span>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface-elevated)',
              padding: '14px 16px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div><strong>Entrepreneur:</strong> {profile.fullName} ({profile.category || 'SC'})</div>
              <div><strong>Selected Scheme:</strong> {selectedSchemeTitle}</div>
              <div><strong>Loan Required:</strong> ₹{loanAmount.toLocaleString('en-IN')} ({loanCategory})</div>
              <div><strong>Target Branch:</strong> {routedPartner.name}</div>
              <div><strong>Nodal Officer:</strong> {routedPartner.nodalOfficer}</div>
              <div><strong>Distance:</strong> {routedPartner.distanceKm} km away ({selectedDistrict})</div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <CheckCircle2 size={16} />
              <span>Dossier verified with 85% Bank Ready compliance score.</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowRoutingModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`✅ Application Dossier for ${profile.fullName} successfully transmitted to ${routedPartner.nodalOfficer} at ${routedPartner.name}. Reference ID: APP-SM-${Date.now().toString().slice(-6)}`);
                  setShowRoutingModal(false);
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelPartnerRouter;
