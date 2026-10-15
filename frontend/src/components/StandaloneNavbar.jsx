import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp, LANGUAGES } from '../context/AppContext';
import { 
  Heart, 
  Sparkles, 
  Languages, 
  ChevronDown, 
  Lock, 
  Play, 
  ShieldCheck,
  ArrowRight,
  LogIn
} from 'lucide-react';
import { DoctorAuthModal } from './DoctorAuthModal';

export const StandaloneNavbar = ({ onOpenAuth, onReplaySplash }) => {
  const { language, setLanguage, user } = useApp();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showDoctorAuth, setShowDoctorAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <header className="sticky top-0 z-30 glass-panel border-b border-white/60 select-none">
        {/* Top reassurance micro bar */}
        <div className="bg-[#561D4F] text-[#F6D6DE] text-[11px] py-1 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#EAAAB3]" />
          <span>FemCare Insight — Private, multilingual women's health guidance and consultation support.</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <Link to="/get-started" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl plum-gradient text-white flex items-center justify-center shadow-lg plum-glow group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-[#F6D6DE] fill-[#F6D6DE]/40" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading text-[#350B30] tracking-tight block leading-tight">
                FemCare Insight
              </span>
              <span className="text-[10px] font-semibold text-[#7A3572] tracking-wide block">
                Women's Health Companion
              </span>
            </div>
          </Link>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-[#D8CCE8] text-xs font-semibold text-[#350B30] shadow-2xs transition-all"
              >
                <Languages className="w-3.5 h-3.5 text-[#7A3572]" />
                <span className="hidden sm:inline">{currentLangObj.native}</span>
                <span className="sm:hidden">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-[#635860]" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1 w-44 rounded-2xl bg-white shadow-2xl border border-[#D8CCE8] py-1.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold text-[#958B92] uppercase tracking-wider">
                    Language / ಭಾಷೆ
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
                      <span className="text-[10px] text-[#958B92]">{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Replay 2s Animation Button */}
            {onReplaySplash && (
              <button
                onClick={onReplaySplash}
                title="Replay 2-second entrance animation"
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-[#D8CCE8] text-xs font-medium text-[#635860] hover:text-[#561D4F] transition-all"
              >
                <Play className="w-3 h-3 text-[#7A3572]" />
                <span className="text-[11px]">Replay Intro</span>
              </button>
            )}

            {/* Doctor Access Security Gate */}
            <button
              onClick={() => setShowDoctorAuth(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-[#561D4F]/30 text-xs font-semibold text-[#561D4F] shadow-2xs hover:bg-[#561D4F]/5 transition-all"
            >
              <Lock className="w-3 h-3 text-[#561D4F]" />
              <span className="hidden sm:inline">Doctor Portal</span>
            </button>

            {/* Navigation Switch between Get Started / Login / Dashboard */}
            {isLoginPage ? (
              <Link
                to="/get-started"
                className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-[#D8CCE8] text-xs font-semibold text-[#561D4F] shadow-2xs transition-colors"
              >
                Get Started
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl plum-gradient text-white text-xs font-bold shadow-md plum-glow hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#F6D6DE]" />
                <span>Log In</span>
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* Doctor Private Access Security Modal */}
      <DoctorAuthModal 
        isOpen={showDoctorAuth} 
        onClose={() => setShowDoctorAuth(false)} 
      />
    </>
  );
};
