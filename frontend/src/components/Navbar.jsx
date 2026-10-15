import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp, LANGUAGES } from '../context/AppContext';
import { 
  Heart, 
  Globe, 
  Bell, 
  User, 
  ShieldCheck, 
  Stethoscope, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const { user, language, setLanguage, activeRole, setActiveRole, t, notifications, unreadCount, logout } = useApp();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const isPatient = activeRole === 'patient';

  return (
    <header className="sticky top-0 z-50 glass-nav">
      {/* Top emergency disclaimer bar */}
      <div className="bg-[#561D4F] text-[#F6D6DE] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#EAAAB3]" />
        <span>FemCare Insight is an educational health companion. In case of acute medical emergencies, please visit an emergency care facility immediately.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl plum-gradient flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-[#F6D6DE] fill-[#F6D6DE]/40" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading text-[#561D4F] tracking-tight">FemCare Insight</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-[#635860] bg-[#FAF7F2] border border-[#EAAAB3]/40 px-2 py-0.5 rounded-full">
                {t.appName !== 'FemCare Insight' ? t.appName : "Women's Health"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/dashboard' 
                  ? 'text-[#561D4F] bg-[#EFEAF8]' 
                  : 'text-[#635860] hover:text-[#561D4F] hover:bg-white/60'
              }`}
            >
              {t.dashboard}
            </Link>
            <Link 
              to="/assistant" 
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                location.pathname === '/assistant' 
                  ? 'text-white plum-gradient shadow-sm' 
                  : 'text-[#561D4F] bg-[#F6D6DE]/40 hover:bg-[#F6D6DE]/70'
              }`}
            >
              <span>✨</span>
              <span>{t.aiAssistant}</span>
            </Link>
            <Link 
              to="/tracker" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/tracker' 
                  ? 'text-[#561D4F] bg-[#EFEAF8]' 
                  : 'text-[#635860] hover:text-[#561D4F] hover:bg-white/60'
              }`}
            >
              {t.myTracker}
            </Link>
            <Link 
              to="/learn" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/learn' 
                  ? 'text-[#561D4F] bg-[#EFEAF8]' 
                  : 'text-[#635860] hover:text-[#561D4F] hover:bg-white/60'
              }`}
            >
              {t.pcosHub}
            </Link>
            <Link 
              to="/doctors" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/doctors' 
                  ? 'text-[#561D4F] bg-[#EFEAF8]' 
                  : 'text-[#635860] hover:text-[#561D4F] hover:bg-white/60'
              }`}
            >
              {t.findDoctor}
            </Link>
            <Link 
              to="/appointments" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/appointments' 
                  ? 'text-[#561D4F] bg-[#EFEAF8]' 
                  : 'text-[#635860] hover:text-[#561D4F] hover:bg-white/60'
              }`}
            >
              {t.appointments}
            </Link>
          </nav>

          {/* Right Controls: Role Switcher, Language Selector, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hackathon Role Switcher Toggle */}
            <div className="hidden lg:flex items-center bg-[#EFEAF8] p-0.5 rounded-full border border-[#D8CCE8]">
              <button
                onClick={() => setActiveRole('patient')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                  isPatient 
                    ? 'bg-[#561D4F] text-white shadow-xs' 
                    : 'text-[#635860] hover:text-[#561D4F]'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => setActiveRole('doctor')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 transition-all ${
                  !isPatient 
                    ? 'bg-[#561D4F] text-white shadow-xs' 
                    : 'text-[#635860] hover:text-[#561D4F]'
                }`}
              >
                <Stethoscope className="w-3 h-3" />
                Doctor View
              </button>
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-white/80 hover:bg-white text-[#561D4F] border border-[#EAAAB3]/40 shadow-2xs transition-all"
                title="Select Language"
              >
                <Globe className="w-4 h-4 text-[#561D4F]" />
                <span className="hidden sm:inline font-semibold">
                  {LANGUAGES.find(l => l.code === language)?.native || 'English'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#635860]" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-[#D8CCE8] py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-[#958B92] uppercase tracking-wider">
                    Select Language / ಭಾಷೆ
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                        language === lang.code ? 'font-bold text-[#561D4F] bg-[#FAF7F2]' : 'text-[#231B22]'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-xs text-[#958B92]">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-[#635860] hover:text-[#561D4F] hover:bg-white/80 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D77A88] rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-[#D8CCE8] py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#FAF7F2] flex items-center justify-between">
                    <span className="font-heading font-semibold text-sm text-[#561D4F]">Notifications</span>
                    <span className="text-xs text-[#958B92]">{notifications.length} recent</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[#FAF7F2]">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#958B92]">No notifications yet</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-[#FAF7F2] transition-colors">
                          <div className="text-xs font-semibold text-[#231B22]">{n.title}</div>
                          <div className="text-xs text-[#635860] mt-0.5">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Log In */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={activeRole === 'doctor' ? '/doctor-portal' : '/dashboard'}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/90 border border-[#D8CCE8] hover:border-[#EAAAB3] shadow-2xs transition-all"
                >
                  <div className="w-7 h-7 rounded-full plum-gradient text-white flex items-center justify-center text-xs font-bold">
                    {user.display_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-[#561D4F] hidden sm:inline max-w-[100px] truncate">
                    {user.display_name?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-[#958B92] hover:text-[#561D4F] px-1 py-1"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-white plum-gradient plum-glow hover:opacity-95 transition-all"
              >
                Log In
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-[#561D4F] rounded-lg hover:bg-white/80"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {showMobileMenu && (
          <div className="md:hidden py-3 px-2 border-t border-[#D8CCE8] bg-white/95 rounded-2xl shadow-xl mt-2 mb-4 space-y-1">
            <div className="p-2 mb-2 bg-[#EFEAF8] rounded-xl flex items-center justify-between">
              <span className="text-xs font-medium text-[#635860]">Current View:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveRole('patient')}
                  className={`px-2 py-0.5 text-xs rounded-md ${isPatient ? 'bg-[#561D4F] text-white' : 'text-[#635860]'}`}
                >
                  Patient
                </button>
                <button
                  onClick={() => setActiveRole('doctor')}
                  className={`px-2 py-0.5 text-xs rounded-md ${!isPatient ? 'bg-[#561D4F] text-white' : 'text-[#635860]'}`}
                >
                  Doctor
                </button>
              </div>
            </div>

            <Link
              to="/dashboard"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#231B22] hover:bg-[#FAF7F2]"
            >
              {t.dashboard}
            </Link>
            <Link
              to="/assistant"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#561D4F] bg-[#F6D6DE]/40"
            >
              ✨ {t.aiAssistant}
            </Link>
            <Link
              to="/tracker"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#231B22] hover:bg-[#FAF7F2]"
            >
              {t.myTracker}
            </Link>
            <Link
              to="/learn"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#231B22] hover:bg-[#FAF7F2]"
            >
              {t.pcosHub}
            </Link>
            <Link
              to="/doctors"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#231B22] hover:bg-[#FAF7F2]"
            >
              {t.findDoctor}
            </Link>
            <Link
              to="/appointments"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#231B22] hover:bg-[#FAF7F2]"
            >
              {t.appointments}
            </Link>
            <Link
              to="/translate"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#231B22] hover:bg-[#FAF7F2]"
            >
              {t.liveTranslate}
            </Link>
            <Link
              to="/reports"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#231B22] hover:bg-[#FAF7F2]"
            >
              {t.reports}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
