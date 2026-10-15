import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { StandaloneNavbar } from './components/StandaloneNavbar';
import { SplashScreen } from './components/SplashScreen';
import { AuthModal } from './components/AuthModal';

import { GetStartedPage } from './pages/GetStartedPage';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssistantPage } from './pages/AssistantPage';
import { TrackerPage } from './pages/TrackerPage';
import { PcosHubPage } from './pages/PcosHubPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { DoctorPortalPage } from './pages/DoctorPortalPage';
import { LiveTranslatePage } from './pages/LiveTranslatePage';
import { ReportsPage } from './pages/ReportsPage';
import { MedicinePage } from './pages/MedicinePage';

const AppContent = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Show starting 2-second animation when opening website
  const [showSplash, setShowSplash] = useState(() => {
    // Check if splash was already played in this browser session
    const hasSeen = sessionStorage.getItem('femcare_splash_shown');
    return !hasSeen;
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('femcare_splash_shown', 'true');
    setShowSplash(false);
  };

  const handleReplaySplash = () => {
    setShowSplash(true);
  };

  // Determine if current route is a standalone onboarding page
  const isStandalonePage = 
    location.pathname === '/' || 
    location.pathname === '/get-started' || 
    location.pathname === '/login';

  return (
    <div className="min-h-screen aurora-bg text-[#231B22] flex font-sans relative overflow-x-hidden">
      {/* 2-Second Entrance Animation */}
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {/* Show left vertical sidebar only for internal dashboard & clinical features */}
      {!isStandalonePage && (
        <Sidebar 
          onOpenAuth={() => setAuthModalOpen(true)}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {!isStandalonePage ? (
          <Topbar 
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        ) : (
          <StandaloneNavbar 
            onOpenAuth={() => setAuthModalOpen(true)} 
            onReplaySplash={handleReplaySplash}
          />
        )}

        <main className="flex-1 overflow-y-auto">
          <Routes>
            {/* Initial Entrance: 2s Splash -> Get Started Separate Page -> Login */}
            <Route path="/" element={<GetStartedPage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Dashboard & Full Health Features */}
            <Route path="/landing" element={<LandingPage onOpenAuth={() => setAuthModalOpen(true)} />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/learn" element={<PcosHubPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/doctor-portal" element={<DoctorPortalPage />} />
            <Route path="/translate" element={<LiveTranslatePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/medicines" element={<MedicinePage />} />
            <Route path="*" element={<Navigate to="/get-started" replace />} />
          </Routes>
        </main>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
