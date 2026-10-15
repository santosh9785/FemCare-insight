import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Calendar, 
  Stethoscope, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  Lock,
  AlertCircle
} from 'lucide-react';

export const LandingPage = ({ onOpenAuth }) => {
  const { t, language, setLanguage } = useApp();
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/assistant');
  };

  return (
    <div className="min-h-full pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft background ambient gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F6D6DE]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-24 left-10 w-80 h-80 bg-[#EFEAF8]/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Trust Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEAF8] border border-[#D8CCE8] text-xs font-semibold text-[#561D4F]">
                <Sparkles className="w-3.5 h-3.5 text-[#D77A88]" />
                <span>Multilingual AI Companion for Indian Women</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-[#350B30] tracking-tight leading-[1.15]">
                {t.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-[#635860] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.heroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={handleStart}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl plum-gradient text-white text-sm font-bold shadow-lg plum-glow hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{t.getStarted}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/learn')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#561D4F] border border-[#D8CCE8] text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#7A3572]" />
                  <span>{t.exploreHealth}</span>
                </button>
              </div>

              {/* Trust Box */}
              <div className="p-4 rounded-2xl bg-white/80 border border-[#EAAAB3]/30 soft-shadow flex items-start gap-3 text-left">
                <ShieldCheck className="w-5 h-5 text-[#561D4F] shrink-0 mt-0.5" />
                <p className="text-xs text-[#635860] leading-relaxed">
                  <strong className="text-[#350B30]">Our Trust Commitment: </strong>
                  {t.trustNote}
                </p>
              </div>

              {/* Supported Languages Pills */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-[#635860]">
                <span className="font-semibold text-[#350B30]">Speak naturally in:</span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D8CCE8] font-medium">English</span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D8CCE8] font-medium">ಕನ್ನಡ (Kannada)</span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D8CCE8] font-medium">తెలుగు (Telugu)</span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D8CCE8] font-medium">हिंदी (Hindi)</span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D8CCE8] font-medium">தமிழ் (Tamil)</span>
              </div>
            </div>

            {/* Right Column: Hero Visual Card / Interactive Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Visual card */}
                <div className="rounded-3xl p-6 bg-white soft-shadow border border-[#EAAAB3]/40 relative overflow-hidden">
                  
                  {/* Card top banner */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#FAF7F2]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl plum-gradient text-white flex items-center justify-center">
                        <Heart className="w-4 h-4 text-[#F6D6DE]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#350B30]">FemCare Insight AI Companion</div>
                        <div className="text-[10px] text-[#958B92]">Multilingual Symptom Triage</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Private & Secure
                    </span>
                  </div>

                  {/* Simulated Multilingual Chat Bubble */}
                  <div className="my-4 space-y-3 text-xs">
                    <div className="bg-[#FAF7F2] p-3 rounded-2xl rounded-tr-none text-[#231B22] border border-[#D8CCE8]">
                      <span className="text-[10px] font-bold text-[#7A3572] block mb-1">You said (Code-Mixed):</span>
                      "My periods have not come for 3 months, face pe pimples bhi hain, and hair fall is increasing."
                    </div>

                    <div className="bg-[#EFEAF8] p-3 rounded-2xl rounded-tl-none text-[#231B22] border border-[#D8CCE8] space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#561D4F]">
                        <Sparkles className="w-3.5 h-3.5 text-[#D77A88]" />
                        <span>FemCare Insight Clinical Analysis</span>
                      </div>
                      <p className="text-[11px] text-[#635860] leading-snug">
                        Understood: Delayed menstrual cycle, hormonal facial breakouts, and hair shedding.
                      </p>
                      <div className="p-2 rounded-xl bg-white/80 border border-[#D8CCE8] text-[10px] text-[#350B30]">
                        <strong>Evidence Insight:</strong> These signs frequently correlate with endocrine variations (such as PCOS or androgen sensitivity), but require clinical evaluation. Symptoms alone do not diagnose PCOS.
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-semibold text-[#7A3572]">Guidance: Level 2 (Clinical Consult)</span>
                        <span className="text-[10px] text-[#958B92]">3 Follow-ups ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Action prompt */}
                  <button
                    onClick={handleStart}
                    className="w-full py-2.5 rounded-xl plum-gradient text-white text-xs font-bold text-center block hover:opacity-95 transition-opacity"
                  >
                    Try the Symptom Assistant Now &rarr;
                  </button>
                </div>

                {/* Floating mini badge */}
                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-[#D8CCE8] flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-semibold text-[#350B30]">Doctors Available for Video Consult</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THREE TRUST-FOCUSED BENEFITS SECTION */}
      <section className="py-16 glass-panel border-y border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#350B30]">
              Three Pillars of Safe Care
            </h2>
            <p className="text-xs sm:text-sm text-[#635860] mt-2">
              Designed specifically to overcome language barriers, medical jargon, and healthcare hesitation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Understand */}
            <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#D8CCE8] card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#EFEAF8] text-[#561D4F] flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-[#350B30] mb-2">1. Understand</h3>
              <p className="text-xs sm:text-sm text-[#635860] leading-relaxed">
                Describe symptoms in your own words. FemCare Insight handles informal speech, code-mixing (Hinglish, Kanglish, Tenglish), and voice input, translating concerns into clear health concepts.
              </p>
            </div>

            {/* Pillar 2: Explore */}
            <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#D8CCE8] card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#F6D6DE] text-[#561D4F] flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-[#350B30] mb-2">2. Explore</h3>
              <p className="text-xs sm:text-sm text-[#635860] leading-relaxed">
                Discover medically accurate PCOS knowledge, log your cycles securely, debunk common myths, and receive tailored questions to ask your doctor without feeling overwhelmed.
              </p>
            </div>

            {/* Pillar 3: Find Care */}
            <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#D8CCE8] card-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#EFEAF8] text-[#561D4F] flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-[#350B30] mb-2">3. Find Care</h3>
              <p className="text-xs sm:text-sm text-[#635860] leading-relaxed">
                Connect seamlessly with verified gynecologists speaking your language. Book appointments, manage confirmation workflows, and share diagnostic reports privately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MULTILINGUAL FEATURE SHOWCASE */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl plum-gradient p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#F6D6DE]">
                <Globe className="w-3.5 h-3.5" />
                <span>Regional Language Empowerment</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-heading">
                Healthcare in your mother tongue breaks fear and confusion.
              </h2>
              <p className="text-xs sm:text-sm text-[#F6D6DE]/90 leading-relaxed">
                Whether you type in Kannada script, speak in Telugu, or describe your concerns in Hindi, FemCare Insight extracts relevant medical context, asks thoughtful follow-ups, and guides you calmly.
              </p>

              <div className="pt-4 flex flex-wrap gap-2.5">
                <button
                  onClick={() => { setLanguage('kn'); navigate('/assistant'); }}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-medium backdrop-blur-md transition-colors"
                >
                  ಕನ್ನಡದಲ್ಲಿ ತಿಳಿಯಿರಿ (Kannada)
                </button>
                <button
                  onClick={() => { setLanguage('te'); navigate('/assistant'); }}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-medium backdrop-blur-md transition-colors"
                >
                  తెలుగులో తెలుసుకోండి (Telugu)
                </button>
                <button
                  onClick={() => { setLanguage('hi'); navigate('/assistant'); }}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-medium backdrop-blur-md transition-colors"
                >
                  हिंदी में समझें (Hindi)
                </button>
                <button
                  onClick={() => { setLanguage('ta'); navigate('/assistant'); }}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-medium backdrop-blur-md transition-colors"
                >
                  தமிழில் அறிக (Tamil)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PCOS KNOWLEDGE & SAFETY PREVIEW */}
      <section className="py-16 glass-panel border-y border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAF8] text-xs font-semibold text-[#561D4F] mb-3">
                <BookOpen className="w-3.5 h-3.5 text-[#7A3572]" />
                <span>Evidence-Informed Education</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#350B30] mb-4">
                PCOS is manageable when understood without myth or stigma.
              </h2>
              <p className="text-xs sm:text-sm text-[#635860] leading-relaxed mb-6">
                Over 1 in 5 Indian women experience symptoms consistent with PCOS. Yet misinformation abounds. FemCare Insight grounds every insight in Rotterdam clinical criteria and safe nutrition habits.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-[#231B22]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Learn why symptoms alone cannot confirm PCOS without blood tests and ultrasound.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Debunk myths regarding fertility, rapid fixes, and restrictive fad diets.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Practical checklist of questions to bring to your gynecologist consultation.</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigate('/learn')}
                  className="px-6 py-3 rounded-2xl bg-[#561D4F] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 transition-all"
                >
                  Explore PCOS Knowledge Hub &rarr;
                </button>
              </div>
            </div>

            {/* Safety Triage Card */}
            <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#D8CCE8] space-y-4">
              <div className="flex items-center gap-2.5 text-[#561D4F] font-heading font-bold text-base">
                <AlertCircle className="w-5 h-5 text-[#D77A88]" />
                <span>3-Tier Clinical Guidance Model</span>
              </div>
              <p className="text-xs text-[#635860] leading-relaxed">
                FemCare Insight never makes alarming leaps. We triage every symptom into 3 clear, safe care levels:
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-800 block">Level 1: Self-Care & Tracking</span>
                  <span className="text-[#635860]">Sleep consistency, hydration, balanced meals, and symptom journaling for mild signs.</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-800 block">Level 2: Arrange Medical Consultation</span>
                  <span className="text-[#635860]">Persistent cycle delays, cystic acne, or metabolic shifts needing doctor review.</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-300 bg-rose-50/50">
                  <span className="font-bold text-rose-800 block">Level 3: Urgent Emergency Evaluation</span>
                  <span className="text-[#635860]">Immediate routing for severe lower abdominal pain, fainting, or flooding bleeding.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#350B30]">
            Ready to understand your health on your terms?
          </h2>
          <p className="text-sm text-[#635860] max-w-xl mx-auto">
            No judgment, no complicated medical jargon. Start talking to your multilingual companion right away.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStart}
              className="px-8 py-4 rounded-2xl plum-gradient text-white text-sm font-bold shadow-xl plum-glow hover:opacity-95 transition-all inline-flex items-center gap-2"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="glass-panel border-t border-white/60 py-12 text-xs text-[#635860]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg plum-gradient text-white flex items-center justify-center font-bold">F</div>
                <span className="text-base font-bold font-heading text-[#561D4F]">FemCare Insight</span>
              </div>
              <p className="text-[11px] text-[#958B92]">
                Multilingual AI Women's Health Companion. Built for the national hackathon.
              </p>
            </div>

            <div>
              <div className="font-bold text-[#350B30] mb-2 uppercase text-[10px] tracking-wider">Features</div>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => navigate('/assistant')} className="hover:text-[#561D4F]">Symptom Assistant</button></li>
                <li><button onClick={() => navigate('/tracker')} className="hover:text-[#561D4F]">Cycle & Symptom Tracker</button></li>
                <li><button onClick={() => navigate('/learn')} className="hover:text-[#561D4F]">PCOS Knowledge Hub</button></li>
                <li><button onClick={() => navigate('/doctors')} className="hover:text-[#561D4F]">Doctor Discovery & Booking</button></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-[#350B30] mb-2 uppercase text-[10px] tracking-wider">Languages</div>
              <ul className="space-y-1.5 text-[11px]">
                <li>English • Kannada (ಕನ್ನಡ)</li>
                <li>Telugu (తెలుగు) • Hindi (हिंदी)</li>
                <li>Tamil (தமிழ்) • Code-Mixed Speech</li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-[#350B30] mb-2 uppercase text-[10px] tracking-wider">Privacy & Trust</div>
              <p className="text-[11px] text-[#958B92] leading-relaxed">
                All demonstration records use synthetic data. FemCare Insight never sells medical information or promises unverified medical claims.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#FAF7F2] text-center text-[11px] text-[#958B92] space-y-2">
            <p className="text-[#635860] font-medium">
              Medical Disclaimer: FemCare Insight is an educational health information platform and does not offer professional medical diagnosis or clinical treatment. Always consult a qualified healthcare provider for personal health concerns.
            </p>
            <p>© 2026 FemCare Insight Health. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
