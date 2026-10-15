import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, LANGUAGES } from '../context/AppContext';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  Calendar, 
  Stethoscope, 
  BookOpen, 
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';

export const GetStartedPage = () => {
  const { t, language, setLanguage, loginAsDemo } = useApp();
  const navigate = useNavigate();

  const handleGuestExplore = async () => {
    await loginAsDemo('patient', language);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in">
      <div className="max-w-4xl w-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/90 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Soft background ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F6D6DE]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D8CCE8]/40 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Logo */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-14 h-14 rounded-3xl plum-gradient text-white flex items-center justify-center mx-auto shadow-xl plum-glow">
            <Heart className="w-8 h-8 text-[#F6D6DE] fill-[#F6D6DE]/40" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAF8] text-xs font-semibold text-[#561D4F]">
            <Sparkles className="w-3.5 h-3.5 text-[#D77A88]" />
            <span>Welcome to FemCare Insight</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-[#350B30] tracking-tight leading-[1.15]">
            Your health deserves understanding, not judgment.
          </h1>

          <p className="text-xs sm:text-sm text-[#635860] max-w-2xl mx-auto leading-relaxed">
            Not sure how to explain what you're feeling? You're welcome to share your concerns here, in your own words and your own language. FemCare Insight helps you understand health information, explore possible next steps and find the right care when you need it.
          </p>
        </div>

        {/* 3 Core Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          <div className="glass-card p-4 rounded-2xl border border-white/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#EFEAF8] text-[#561D4F] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs text-[#350B30]">1. Speak in Your Language</h3>
            <p className="text-[11px] text-[#635860] leading-snug">
              Describe cycle delays, acne, or discomfort in Kannada, Telugu, Hindi, Tamil, or English.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#F6D6DE] text-[#561D4F] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs text-[#350B30]">2. Safe Health Explanations</h3>
            <p className="text-[11px] text-[#635860] leading-snug">
              Learn about PCOS and hormones without diagnostic fear, grounded in Rotterdam clinical criteria.
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#EFEAF8] text-[#561D4F] flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs text-[#350B30]">3. Care When Needed</h3>
            <p className="text-[11px] text-[#635860] leading-snug">
              Find verified gynecologists, manage consultation requests, and keep diagnostic records private.
            </p>
          </div>
        </div>

        {/* Trust Commitment Card */}
        <div className="p-4 rounded-2xl bg-white/70 border border-[#D8CCE8] text-xs text-[#635860] flex items-start gap-3 relative z-10">
          <ShieldCheck className="w-5 h-5 text-[#561D4F] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#350B30] block">Trust & Privacy Commitment:</strong>
            Your concerns matter. Share only what you're comfortable sharing. FemCare Insight provides health information, not a medical diagnosis.
          </div>
        </div>

        {/* Action Buttons: Leads to Login / Demo Mode */}
        <div className="space-y-3 pt-2 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl plum-gradient text-white text-xs sm:text-sm font-bold shadow-xl plum-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Log In & Demo Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/login?tab=register')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white border border-[#D8CCE8] hover:bg-[#FAF7F2] text-[#561D4F] text-xs sm:text-sm font-semibold transition-colors"
            >
              Create Free Account
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              onClick={handleGuestExplore}
              className="text-xs text-[#7A3572] font-semibold hover:underline"
            >
              Or explore immediately with Guest Demo Profile &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
