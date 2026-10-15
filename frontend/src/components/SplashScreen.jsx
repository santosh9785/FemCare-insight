import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 2-second timer (2000 ms)
    const startTime = Date.now();
    const duration = 2000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => {
          onComplete();
        }, 350); // smooth fade transition
      }
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center aurora-bg transition-opacity duration-300 ${
      fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Ambient background glows */}
      <div className="absolute w-96 h-96 bg-[#F6D6DE]/60 rounded-full blur-3xl animate-pulse" />
      <div className="absolute w-80 h-80 bg-[#D8CCE8]/50 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4">
        
        {/* Animated Brand Emblem with multi-layer glowing rings */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-3xl bg-[#561D4F]/15 animate-ping opacity-60" />
          <div className="w-24 h-24 rounded-3xl plum-gradient text-white flex items-center justify-center shadow-2xl plum-glow transform animate-bounce duration-1000">
            <Heart className="w-12 h-12 text-[#F6D6DE] fill-[#F6D6DE]/50" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-[#350B30] tracking-tight">
            FemCare Insight
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#7A3572] tracking-wide">
            Your Multilingual Women's Health Companion
          </p>
        </div>

        {/* Language Strip Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-medium text-[#635860] pt-1">
          <span className="px-2 py-0.5 rounded-full bg-white/70 border border-[#D8CCE8]">English</span>
          <span className="px-2 py-0.5 rounded-full bg-white/70 border border-[#D8CCE8]">ಕನ್ನಡ</span>
          <span className="px-2 py-0.5 rounded-full bg-white/70 border border-[#D8CCE8]">తెలుగు</span>
          <span className="px-2 py-0.5 rounded-full bg-white/70 border border-[#D8CCE8]">हिंदी</span>
          <span className="px-2 py-0.5 rounded-full bg-white/70 border border-[#D8CCE8]">தமிழ்</span>
        </div>

        {/* 2-Second Progress Line Indicator */}
        <div className="w-48 sm:w-60 h-1.5 bg-white/60 rounded-full overflow-hidden shadow-inner mt-4">
          <div 
            className="h-full plum-gradient rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Optional Skip text */}
        <button
          onClick={() => {
            setFadeOut(true);
            setTimeout(onComplete, 200);
          }}
          className="text-[11px] text-[#958B92] hover:text-[#561D4F] transition-colors pt-1"
        >
          Skip animation &rarr;
        </button>
      </div>
    </div>
  );
};
