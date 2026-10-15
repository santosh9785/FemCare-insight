import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  Bell, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Topbar = ({ onOpenMobileMenu, onOpenAuth }) => {
  const { notifications, unreadCount, language, activeRole, t } = useApp();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Welcome to FemCare Insight';
      case '/get-started': return 'Get Started with FemCare Insight';
      case '/login': return 'Sign In to FemCare Insight';
      case '/dashboard': return t.dashboard;
      case '/assistant': return t.aiAssistant;
      case '/tracker': return t.myTracker;
      case '/learn': return t.pcosHub;
      case '/doctors': return t.findDoctor;
      case '/appointments': return t.appointments;
      case '/doctor-portal': return t.doctorPortal;
      case '/translate': return t.liveTranslate;
      case '/reports': return t.reports;
      case '/medicines': return t.medicineOrder;
      default: return 'FemCare Insight';
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-white/60">
      {/* Top micro emergency caution bar */}
      <div className="bg-[#561D4F] text-[#F6D6DE] text-[11px] py-1 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#EAAAB3]" />
        <span>FemCare Insight is an educational health companion. In acute emergencies, visit an emergency room immediately.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        
        {/* Left: Mobile hamburger & current route breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-white/80 hover:bg-white text-[#561D4F] border border-[#D8CCE8] shadow-xs"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#350B30] text-sm sm:text-base font-heading">
              {getPageTitle(location.pathname)}
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFEAF8] text-[#561D4F] border border-[#D8CCE8]">
              {activeRole === 'doctor' ? 'Doctor View' : 'Patient View'}
            </span>
          </div>
        </div>

        {/* Right: Notifications & Quick Demo Switch */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl bg-white/80 hover:bg-white text-[#635860] hover:text-[#561D4F] border border-[#D8CCE8] shadow-2xs transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D77A88] rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-[#D8CCE8] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#FAF7F2] flex items-center justify-between">
                  <span className="font-heading font-semibold text-xs text-[#561D4F]">Notifications</span>
                  <span className="text-[10px] text-[#958B92]">{notifications.length} recent</span>
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

          {/* Quick Demo Switcher Button */}
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white plum-gradient plum-glow hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F6D6DE]" />
            <span className="hidden sm:inline">Demo Switch</span>
          </button>
        </div>

      </div>
    </header>
  );
};
