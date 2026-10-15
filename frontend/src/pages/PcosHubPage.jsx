import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Stethoscope, 
  ShieldCheck, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Heart,
  Calendar
} from 'lucide-react';

export const PcosHubPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const FAQS = [
    {
      q: "Can symptoms alone confirm that I have PCOS?",
      a: "No. Symptoms such as irregular periods, acne, and weight gain can arise from multiple metabolic or hormonal factors (including thyroid dysfunction, elevated prolactin, stress-induced hypothalamic amenorrhea, or hyperandrogenism). Under international medical guidelines (Rotterdam Criteria), a doctor requires at least 2 out of 3 formal criteria: 1) irregular or absent ovulation, 2) clinical or biochemical signs of elevated androgens, and 3) polycystic ovaries on ultrasound, while excluding other medical causes."
    },
    {
      q: "Does having PCOS mean I cannot have children in the future?",
      a: "This is one of the most common and distressing myths. While PCOS is a leading cause of ovulatory subfertility because ovulation occurs irregularly, most individuals with PCOS can conceive successfully with appropriate lifestyle measures, cycle regulation, or standard medical ovulation induction when planned with a gynecologist."
    },
    {
      q: "Can lifestyle changes completely 'cure' PCOS?",
      a: "PCOS is considered a chronic endocrine and metabolic predisposition rather than a simple infection that can be permanently cured. However, balanced nutrition, regular physical activity, stress management, and consistent sleep can dramatically improve insulin sensitivity, restore regular ovulatory cycles, and clear skin symptoms."
    },
    {
      q: "What questions should I ask my doctor during a PCOS consultation?",
      a: "Helpful questions include: 'Do my symptoms warrant a hormonal blood panel (LH, FSH, total testosterone, fasting insulin)?', 'Would a pelvic ultrasound scan help evaluate my ovarian morphology?', and 'What personalized nutritional and physical activity approach would best support my specific symptom profile?'"
    }
  ];

  const MYTHS = [
    {
      myth: "You only have PCOS if you are overweight.",
      fact: "False. 'Lean PCOS' affects many women of normal or low body mass index who still exhibit ovulatory irregularities and elevated androgens."
    },
    {
      myth: "Every woman with irregular periods has PCOS.",
      fact: "False. Irregular cycles can stem from thyroid conditions, nutritional deficits, elevated prolactin, extreme stress, or recent medication changes."
    },
    {
      myth: "PCOS means you have painful ovarian cysts that need surgery.",
      fact: "False. The 'cysts' in PCOS are actually harmless, immature follicles arrested in development, not true pathological ovarian neoplasms requiring surgical removal."
    },
    {
      myth: "You must completely cut out all carbohydrates forever.",
      fact: "False. Restrictive elimination diets are unsustainable. Focus on low-glycemic, fiber-rich complex carbohydrates paired with protein and healthy fats."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="rounded-3xl plum-gradient p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-[#F6D6DE]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Medically Reviewed Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading">
            Demystifying PCOS: Science, Care & Compassion
          </h1>
          <p className="text-xs sm:text-sm text-[#F6D6DE]/90 leading-relaxed">
            Understanding your endocrine health without shame, fear, or false claims. Grounded in evidence-based gynecological standards.
          </p>
        </div>
      </div>

      {/* ROTTERDAM CRITERIA SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D8CCE8] soft-shadow space-y-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAF8] text-xs font-semibold text-[#561D4F] mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7A3572]" />
            <span>International Diagnostic Standard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#350B30]">
            The Rotterdam Criteria: Why Symptoms Alone Cannot Diagnose PCOS
          </h2>
          <p className="text-xs sm:text-sm text-[#635860] mt-2 leading-relaxed">
            Many online quizzes claim to diagnose PCOS from a short questionnaire. Clinically, this is inaccurate and potentially misleading. Gynecologists require at least <strong>two of the following three</strong> findings, along with ruling out other endocrine disorders:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#D8CCE8] space-y-2">
            <div className="w-8 h-8 rounded-xl plum-gradient text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="font-bold text-sm text-[#350B30]">Ovulatory Irregularity</h3>
            <p className="text-xs text-[#635860] leading-relaxed">
              Infrequent menstrual cycles (oligomenorrhea, typically cycle length &gt;35 days) or complete absence of cycles (amenorrhea).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#D8CCE8] space-y-2">
            <div className="w-8 h-8 rounded-xl plum-gradient text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="font-bold text-sm text-[#350B30]">Hyperandrogenism</h3>
            <p className="text-xs text-[#635860] leading-relaxed">
              Clinical signs (persistent cystic acne, hirsutism on chin/upper lip, scalp hair shedding) or blood tests showing elevated free testosterone.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#D8CCE8] space-y-2">
            <div className="w-8 h-8 rounded-xl plum-gradient text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="font-bold text-sm text-[#350B30]">Polycystic Ovarian Morphology</h3>
            <p className="text-xs text-[#635860] leading-relaxed">
              Confirmed on a pelvic ultrasound (USG) showing 20+ small peripheral follicles (2–9mm) per ovary or enlarged ovarian volume (&gt;10ml).
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#EFEAF8] border border-[#D8CCE8] text-xs text-[#561D4F] flex items-center justify-between">
          <span>Need to discuss your symptoms with a qualified specialist?</span>
          <button
            onClick={() => navigate('/doctors')}
            className="px-4 py-2 rounded-xl bg-[#561D4F] text-white font-semibold text-xs shrink-0 ml-3"
          >
            Find a Gynecologist &rarr;
          </button>
        </div>
      </div>

      {/* MYTH BUSTERS SECTION */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#350B30]">
            Common Misconceptions vs Medical Reality
          </h2>
          <p className="text-xs sm:text-sm text-[#635860] mt-1">
            Separating unscientific rumors from peer-reviewed evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MYTHS.map((m, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-white border border-[#D8CCE8] soft-shadow space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-rose-800 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>Myth: {m.myth}</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-emerald-900 font-medium bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Evidence: {m.fact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOCTOR VISIT PREPARATION CHECKLIST */}
      <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EAAAB3]/40 space-y-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#561D4F] mb-2 border border-[#D8CCE8]">
            <Stethoscope className="w-3.5 h-3.5 text-[#7A3572]" />
            <span>Consultation Preparation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#350B30]">
            How to Prepare for Your Doctor Appointment
          </h2>
          <p className="text-xs sm:text-sm text-[#635860] mt-1">
            Doctors appreciate organized observations. Here is what helps your clinician make an accurate evaluation:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-[#D8CCE8] space-y-1.5">
            <span className="font-bold text-[#350B30] block">1. Cycle History</span>
            <p className="text-[#635860]">Bring recorded dates of your last 3–6 menstrual cycles from your FemCare Insight Tracker.</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#D8CCE8] space-y-1.5">
            <span className="font-bold text-[#350B30] block">2. Symptom Timeline</span>
            <p className="text-[#635860]">Note when acne flare-ups, sudden hair shedding, or weight shifts first became noticeable.</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#D8CCE8] space-y-1.5">
            <span className="font-bold text-[#350B30] block">3. Prior Diagnostic Tests</span>
            <p className="text-[#635860]">Have any previous blood reports (TSH, CBC, ultrasound) ready in your FemCare Insight Reports tab.</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-[#D8CCE8] space-y-1.5">
            <span className="font-bold text-[#350B30] block">4. Medication History</span>
            <p className="text-[#635860]">List any vitamins, emergency pills, or supplements you have taken in the last 6 months.</p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE FAQ ACCORDION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D8CCE8] soft-shadow space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#350B30] mb-4">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-[#FAF7F2]">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm text-[#350B30] hover:text-[#561D4F] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#561D4F]" /> : <ChevronDown className="w-4 h-4 text-[#958B92]" />}
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-[#635860] mt-3 leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
