import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp, LANGUAGES } from '../context/AppContext';
import { 
  Heart, 
  Sparkles, 
  Stethoscope, 
  Calendar, 
  BookOpen, 
  Activity, 
  FileText, 
  Pill, 
  Globe, 
  Home, 
  LayoutDashboard, 
  User, 
  LogOut, 
  LogIn, 
  ChevronDown, 
  ShieldCheck, 
  AlertTriangle,
  Menu,
  X,
  Languages,
  Lock
} from 'lucide-react';
import { DoctorAuthModal } from './DoctorAuthModal';

export const Sidebar = ({ onOpenAuth, mobileOpen, setMobileOpen }) => {
  const { user, language, setLanguage, activeRole, setActiveRole, t, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showDoctorAuth, setShowDoctorAuth] = useState(false);

  const isDoctor = activeRole === 'doctor' && user?.email === 'santosh1@gmail.com';

  const navLinks = [
    {
      category: "CARE & ASSIST",
      items: [
        { to: "/dashboard", label: t.dashboard, icon: LayoutDashboard },
        { 
          to: "/assistant", 
          label: t.aiAssistant, 
          icon: Sparkles, 
          special: true,
          badge: "AI Multilingual"
        },
        { to: "/doctors", label: t.findDoctor, icon: Stethoscope },
        { to: "/appointments", label: t.appointments, icon: Calendar },
        ...(isDoctor ? [{ to: "/doctor-portal", label: t.doctorPortal, icon: ShieldCheck, badge: "Doctor Role" }] : [])
      ]
    },
    {
      category: "HEALTH JOURNAL",
      items: [
        { to: "/tracker", label: t.myTracker, icon: Activity },
        { to: "/reports", label: t.reports, icon: FileText },
        { to: "/medicines", label: t.medicineOrder, icon: Pill, badge: "Demo" }
      ]
    },
    {
      category: "LEARN & COMMUNICATE",
      items: [
        { to: "/learn", label: t.pcosHub, icon: BookOpen },
        { to: "/translate", label: t.liveTranslate, icon: Globe, badge: "Dual-Panel" }
      ]
    }
  ];

  const handleRoleToggle = (newRole) => {
    if (newRole === 'doctor') {
      if (user?.email === 'santosh1@gmail.com') {
        setActiveRole('doctor');
        navigate('/doctor-portal');
      } else {
        setShowDoctorAuth(true);
      }
    } else {
      setActiveRole('patient');
      navigate('/dashboard');
    }
  };

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 select-none">
      
      {/* TOP: Brand & Role Switcher */}
      <div className="space-y-4">
        {/* Brand Logo */}
        <NavLink 
          to="/" 
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="flex items-center gap-3 group px-2 py-1"
        >
          <div className="w-11 h-11 rounded-2xl plum-gradient text-white flex items-center justify-center shadow-lg plum-glow group-hover:scale-105 transition-transform shrink-0">
            <Heart className="w-6 h-6 text-[#F6D6DE] fill-[#F6D6DE]/40" />
          </div>
          <div className="overflow-hidden">
            <div className="text-lg font-bold font-heading text-[#350B30] tracking-tight leading-none">
              FemCare Insight
            </div>
            <div className="text-[10px] font-semibold text-[#7A3572] mt-1 truncate">
              {t.appName !== 'FemCare Insight' ? t.appName : "Women's Health Companion"}
            </div>
          </div>
        </NavLink>

        {/* Hackathon Patient/Doctor Role Switcher */}
        <div className="p-1 rounded-2xl bg-white/70 border border-[#D8CCE8] flex items-center text-xs font-semibold shadow-xs">
          <button
            onClick={() => handleRoleToggle('patient')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              !isDoctor 
                ? 'bg-[#561D4F] text-white shadow-xs' 
                : 'text-[#635860] hover:text-[#561D4F]'
            }`}
          >
            Patient View
          </button>
          <button
            onClick={() => handleRoleToggle('doctor')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all ${
              isDoctor 
                ? 'bg-[#561D4F] text-white shadow-xs' 
                : 'text-[#635860] hover:text-[#561D4F]'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor View</span>
          </button>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/80 hover:bg-white border border-[#D8CCE8] text-xs font-semibold text-[#350B30] shadow-2xs transition-all"
          >
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-[#7A3572]" />
              <span>{currentLangObj.native}</span>
              <span className="text-[10px] text-[#958B92]">({currentLangObj.label})</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#635860]" />
          </button>

          {showLangMenu && (
            <div className="absolute left-0 right-0 mt-1 rounded-2xl bg-white shadow-2xl border border-[#D8CCE8] py-1.5 z-50 animate-in fade-in">
              <div className="px-3 py-1 text-[10px] font-bold text-[#958B92] uppercase tracking-wider">
                Select Language
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                    language === l.code ? 'font-bold text-[#561D4F] bg-[#EFEAF8]/60' : 'text-[#231B22]'
                  }`}
                >
                  <span>{l.native}</span>
                  <span className="text-[11px] text-[#958B92]">{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* NAVIGATION SECTIONS */}
        <nav className="space-y-4 pt-1 overflow-y-auto max-h-[calc(100vh-22rem)] pr-1">
          {navLinks.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-[#958B92] uppercase tracking-wider">
                {section.category}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group ${
                      item.special && isActive
                        ? 'plum-gradient text-white shadow-md plum-glow'
                        : item.special && !isActive
                        ? 'bg-[#F6D6DE]/50 hover:bg-[#F6D6DE]/80 text-[#561D4F] border border-[#EAAAB3]/40'
                        : isActive
                        ? 'bg-[#561D4F] text-white shadow-xs'
                        : 'text-[#635860] hover:text-[#561D4F] hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? (item.special ? 'text-[#F6D6DE]' : 'text-white') : 'text-[#7A3572]'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[#EFEAF8] text-[#561D4F] border border-[#D8CCE8]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* Quick link to Landing Page */}
          <div className="pt-2">
            <NavLink
              to="/"
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-medium text-[#635860] hover:text-[#561D4F] hover:bg-white/60 transition-colors ${
                location.pathname === '/' ? 'bg-white text-[#561D4F] font-bold shadow-2xs' : ''
              }`}
            >
              <Home className="w-4 h-4 text-[#7A3572]" />
              <span>Landing Page Preview</span>
            </NavLink>
          </div>
        </nav>
      </div>

      {/* BOTTOM: USER PROFILE & QUICK DEMO SWITCH */}
      <div className="pt-3 border-t border-[#D8CCE8]/60 space-y-2">
        {user ? (
          <div className="p-3 bg-white/90 rounded-2xl border border-[#D8CCE8] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl plum-gradient text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user.display_name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-[#350B30] truncate">
                  {user.display_name}
                </div>
                <div className="text-[10px] text-[#958B92] truncate">
                  {user.email}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-xl hover:bg-[#FAF7F2] text-[#958B92] hover:text-rose-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full py-2.5 rounded-2xl plum-gradient text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md plum-glow hover:opacity-95 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Demo Mode</span>
          </button>
        )}

        {/* Quick Demo Switcher Button for Judges */}
        <button
          onClick={onOpenAuth}
          className="w-full py-1.5 rounded-xl bg-[#EFEAF8] hover:bg-[#EAE3F7] text-[11px] font-bold text-[#561D4F] border border-[#D8CCE8] transition-colors flex items-center justify-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-[#D77A88]" />
          <span>Switch Demo Account</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 flex-col glass-sidebar z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in"
          />
          {/* Slide-out Menu */}
          <aside className="relative w-72 max-w-[85%] h-full bg-[#FAF5EE] shadow-2xl border-r border-[#D8CCE8] flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="p-3 flex justify-end">
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#561D4F] rounded-xl hover:bg-white/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </aside>
        </div>
      )}

      {/* Doctor Private Access Security Modal */}
      <DoctorAuthModal 
        isOpen={showDoctorAuth} 
        onClose={() => setShowDoctorAuth(false)} 
      />
    </>
  );
};
