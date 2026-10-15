import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Globe, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRightLeft,
  Volume2,
  Stethoscope,
  Sparkles
} from 'lucide-react';

export const LiveTranslatePage = () => {
  const [sourceLang, setSourceLang] = useState('te');
  const [targetLang, setTargetLang] = useState('en');
  const [inputText, setInputText] = useState('');
  const [translationHistory, setTranslationHistory] = useState([
    {
      id: 1,
      sender: 'patient',
      original: 'నాకు మూడు నెలలుగా పీరియడ్స్ రాలేదు, కడుపులో స్వల్పంగా నొప్పి ఉంది',
      translated: 'My periods have not come for three months, and I have mild discomfort in my lower abdomen.',
      sourceLang: 'te',
      targetLang: 'en',
      medicalTerms: ['Amenorrhea / Missed cycle (3 months)', 'Mild lower abdominal discomfort'],
      verified: true
    },
    {
      id: 2,
      sender: 'doctor',
      original: 'Please do not worry. We will do a pelvic ultrasound and a basic hormone panel to check your ovaries.',
      translated: 'దయచేసి ఆందోళన చెందకండి. మీ అండాశయాల పరిస్థితిని పరీక్షించడానికి మేము పెల్విక్ అల్ట్రాసౌండ్ మరియు ప్రాథమిక హಾರ್మోన్ పరీక్షలను చేస్తాము.',
      sourceLang: 'en',
      targetLang: 'te',
      medicalTerms: ['Pelvic Ultrasound (USG)', 'Hormone blood panel (LH/FSH/TSH)'],
      verified: true
    }
  ]);
  const [loading, setLoading] = useState(false);

  const SAMPLE_INPUTS = [
    {
      lang: 'te',
      label: 'Telugu: 3 Months No Period & Pimples',
      text: 'నాకు మూడు నెలలుగా పీరియಡ್స్ రాలేదు, ముఖంపై మొటిమలు ఎక్కువగా ఉన్నాయి'
    },
    {
      lang: 'kn',
      label: 'Kannada: 2 Months Delay & Acne',
      text: 'ನನಗೆ ಎರಡು ತಿಂಗಳಿಂದ ಪೀರಿಯಡ್ಸ್ ಬಂದಿಲ್ಲ, ಮುಖದಲ್ಲಿ ಮೊಡವೆಗಳು ಹೆಚ್ಚಾಗಿವೆ'
    },
    {
      lang: 'hi',
      label: 'Hindi: Periods Delayed & Face Breakouts',
      text: 'पीरियड्स तीन महीने से रुके हुए हैं और चेहरे पर पिंपल्स निकल रहे हैं'
    }
  ];

  const handleTranslate = async (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await api.translateConsultation(text, sourceLang, targetLang);
      const newEntry = {
        id: Date.now(),
        sender: sourceLang === 'en' ? 'doctor' : 'patient',
        original: res.original_text,
        translated: res.translated_text,
        sourceLang: res.source_language,
        targetLang: res.target_language,
        medicalTerms: res.medical_terms_identified || ['General clinical dialogue'],
        verified: false
      };
      setTranslationHistory(prev => [...prev, newEntry]);
      setInputText('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const verifyTranslation = (id) => {
    setTranslationHistory(prev => prev.map(item => item.id === id ? { ...item, verified: true } : item));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAF8] text-xs font-semibold text-[#561D4F] mb-1.5">
          <Globe className="w-3.5 h-3.5 text-[#7A3572]" />
          <span>Feature 12: Dual-Panel Consultation Translation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#350B30]">
          AI-Assisted Live Consultation Translation
        </h1>
        <p className="text-xs sm:text-sm text-[#635860] max-w-2xl">
          Enables Indian patients and doctors to communicate across language barriers. Preserves medical terminology with mandatory clinician confirmation.
        </p>
      </div>

      {/* Safety Notice per PRD */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Clinical Interpretation Caveat:</strong>
          AI translation is supportive. To ensure patient safety, critical clinical instructions and medication dosages require clinician verification before implementation.
        </div>
      </div>

      {/* Quick Test Chips */}
      <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#D8CCE8] flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#561D4F] mr-1">Quick Sample Dialogue:</span>
        {SAMPLE_INPUTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSourceLang(item.lang);
              setTargetLang('en');
              setInputText(item.text);
              handleTranslate(item.text);
            }}
            className="text-xs px-2.5 py-1 rounded-xl bg-white hover:bg-[#EFEAF8] border border-[#D8CCE8] text-[#350B30] font-medium"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* DUAL PANELS: CONSULTATION FEED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Patient Panel (Regional Language) */}
        <div className="bg-white rounded-3xl p-6 border border-[#D8CCE8] soft-shadow space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F6D6DE] text-[#561D4F] flex items-center justify-center font-bold text-xs">
                  P
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#350B30]">Patient View</h3>
                  <div className="text-[10px] text-[#958B92]">Telugu / Kannada / Hindi</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFEAF8] text-[#561D4F]">
                Source Language
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {translationHistory.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl text-xs space-y-1.5 border ${
                    item.sender === 'patient'
                      ? 'bg-[#FAF7F2] border-[#D8CCE8]'
                      : 'bg-[#EFEAF8]/60 border-[#D8CCE8]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#7A3572]">
                    <span>{item.sender === 'patient' ? 'Patient (Original Speech)' : 'Doctor (Translated into Local Language)'}</span>
                    <span className="uppercase text-[9px] text-[#958B92]">{item.sourceLang === 'en' ? item.targetLang : item.sourceLang}</span>
                  </div>
                  <p className="text-[#231B22] font-medium">
                    {item.sender === 'patient' ? item.original : item.translated}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Input Area */}
          <div className="pt-3 border-t border-[#FAF7F2]">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type in Telugu, Kannada, or Hindi..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
              />
              <button
                onClick={() => handleTranslate()}
                disabled={loading || !inputText.trim()}
                className="px-4 py-2 rounded-xl plum-gradient text-white text-xs font-bold shadow-xs hover:opacity-95"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Right: Doctor Panel (English with Clinician Verification) */}
        <div className="bg-white rounded-3xl p-6 border border-[#561D4F]/30 soft-shadow space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl plum-gradient text-white flex items-center justify-center font-bold text-xs">
                  Dr
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#350B30]">Doctor View (Dr. Ananya Sharma)</h3>
                  <div className="text-[10px] text-[#958B92]">English Translation Feed</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Clinician Verification Mode
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {translationHistory.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl text-xs space-y-2 border ${
                    item.sender === 'patient'
                      ? 'bg-white border-[#D8CCE8]'
                      : 'bg-[#FAF7F2] border-[#D8CCE8]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#561D4F]">
                    <span>{item.sender === 'patient' ? 'Translated for Clinician' : 'Your Original Words (English)'}</span>
                    <span className="text-[9px] text-[#958B92]">English</span>
                  </div>

                  <p className="text-[#231B22] font-medium">
                    {item.sender === 'patient' ? item.translated : item.original}
                  </p>

                  {/* Medical Terms Tagging */}
                  {item.medicalTerms?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.medicalTerms.map((term, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-[#EFEAF8] text-[#561D4F] px-2 py-0.5 rounded-md">
                          🔬 {term}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Clinician confirmation check */}
                  {item.sender === 'patient' && (
                    <div className="pt-2 border-t border-[#FAF7F2] flex items-center justify-between">
                      <span className="text-[10px] text-[#958B92]">
                        {item.verified ? "✅ Verified by Doctor" : "⚠️ Needs Clinician Confirmation"}
                      </span>
                      {!item.verified && (
                        <button
                          onClick={() => verifyTranslation(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                        >
                          Confirm Interpretation
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl text-[11px] text-[#635860] border border-[#D8CCE8]">
            Clinician can speak or reply in English; translation engine automatically translates back to patient's native dialect.
          </div>
        </div>

      </div>
    </div>
  );
};
