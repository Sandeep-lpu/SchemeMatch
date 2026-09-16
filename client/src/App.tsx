import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ProfileProvider } from './context/ProfileContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { SaffronDashboard } from './components/SaffronDashboard';
import { Header } from './components/Header';
import { HeroScrollWindow } from './components/HeroScrollWindow';
import { SuperpoweredCardsSection } from './components/SuperpoweredCardsSection';
import { BentoShowcase } from './components/BentoShowcase';
import { ConnectedFeatures } from './components/ConnectedFeatures';
import { FullDashboardShowcase } from './components/FullDashboardShowcase';
import { BottomCTA } from './components/BottomCTA';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { SaathiAICopilot } from './components/SaathiAICopilot';

const MainAppContent: React.FC = () => {
  const { currentView } = useAuth();

  // View Routing: 1. Landing Page -> 2. Login/Register -> 3. Main Website (Workspace)
  if (currentView === 'auth') {
    return <AuthPage />;
  }

  if (currentView === 'app') {
    return <SaffronDashboard />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <Header />

      {/* 1st Scroll Window: Hero Section */}
      <HeroScrollWindow />

      {/* 2nd Scroll Window: Superpowered Cards Section */}
      <SuperpoweredCardsSection />

      {/* 3rd Scroll Window: Bento Showcase */}
      <BentoShowcase />

      {/* 4th Scroll Window: Connected Features */}
      <ConnectedFeatures />

      {/* 5th Scroll Window: Full-Width Workspace Showcase */}
      <FullDashboardShowcase />

      {/* Floating Saathi AI Voice Copilot */}
      <SaathiAICopilot />

      {/* Deep Dive Details Modal */}
      <SchemeDetailModal />

      {/* 6th Scroll Window: Bottom CTA & Verified Footer */}
      <BottomCTA />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProfileProvider>
          <MainAppContent />
        </ProfileProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
