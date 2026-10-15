import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Heart, 
  MessageSquare, 
  Mic, 
  Calendar, 
  BookOpen, 
  Stethoscope, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Video
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, language, t } = useApp();
  const navigate = useNavigate();

  const [trackerSummary, setTrackerSummary] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [recentConv, setRecentConv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const userId = user?.id || 'user-demo-priya';
      
      const [trackerRes, apptRes, convRes] = await Promise.all([
        api.getTrackerData(userId),
        api.getAppointments(userId),
        api.getConversations(userId)
      ]);

      if (trackerRes) setTrackerSummary(trackerRes);
      if (apptRes?.appointments) setAppointments(apptRes.appointments);
      if (convRes?.conversations?.length > 0) setRecentConv(convRes.conversations[0]);
    } catch (e) {
      console.warn('Dashboard fetch issue:', e);
    } finally {
      setLoading(false);
    }
  };

  const nextAppt = appointments.length > 0 ? appointments[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Personalized Welcome */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-white/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAF8] text-xs font-semibold text-[#561D4F]">
            <Sparkles className="w-3.5 h-3.5 text-[#D77A88]" />
            <span>Private Healthcare Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#350B30]">
            Welcome back, {user?.display_name?.split(' ')[0] || 'Priya'} ✨
          </h1>
          <p className="text-xs sm:text-sm text-[#635860] max-w-xl">
            This is your secure, confidential space. Describe what you feel, explore evidence-based health insights, and stay on top of your reproductive wellness.
          </p>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#D8CCE8]/80 self-start md:self-center">
          <div className="w-10 h-10 rounded-xl bg-[#F6D6DE] text-[#561D4F] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-[#350B30]">Cycle Status</div>
            <div className="text-[#635860]">
              {trackerSummary?.cycles?.length > 0
                ? `Last logged: ${trackerSummary.cycles[0].period_start}`
                : "No recent cycle recorded"}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 3: HERO PRIMARY ACTION — "Talk About Your Health" */}
      <div className="rounded-3xl plum-gradient p-6 sm:p-8 text-white shadow-xl plum-glow relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-[#F6D6DE]">
            <span>Primary Symptom Companion</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Not sure what you're feeling? Talk to FemCare Insight.
          </h2>
          <p className="text-xs sm:text-sm text-[#F6D6DE]/90 leading-relaxed">
            Speak or type in your native language (English, Kannada, Telugu, Hindi, Tamil) about irregular periods, pelvic discomfort, cystic acne, or sudden weight shifts. FemCare Insight triages and explains safely.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate('/assistant')}
              className="px-6 py-3 rounded-2xl bg-white text-[#561D4F] text-xs sm:text-sm font-bold shadow-md hover:bg-[#FAF7F2] transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Talk About Your Health</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/assistant')}
              className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-semibold backdrop-blur-md transition-colors flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-[#F6D6DE]" />
              <span>Voice Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID: 4 CORE TILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Cycle & Symptoms Tracker */}
        <div 
          onClick={() => navigate('/tracker')}
          className="glass-card p-5 rounded-3xl border border-white/80 cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#EFEAF8] text-[#561D4F] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base font-heading text-[#350B30]">Cycle & Symptoms Tracker</h3>
          <p className="text-xs text-[#635860] line-clamp-2">
            Log period dates, flow intensity, hormonal acne, cramps, and mood observations.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#7A3572] flex items-center gap-1">
            <span>View Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: PCOS Knowledge Hub */}
        <div 
          onClick={() => navigate('/learn')}
          className="glass-card p-5 rounded-3xl border border-white/80 cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F6D6DE] text-[#561D4F] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base font-heading text-[#350B30]">PCOS Knowledge Hub</h3>
          <p className="text-xs text-[#635860] line-clamp-2">
            Understand the Rotterdam criteria, debunk popular fertility myths, and access lifestyle tips.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#7A3572] flex items-center gap-1">
            <span>Explore Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Find a Doctor */}
        <div 
          onClick={() => navigate('/doctors')}
          className="glass-card p-5 rounded-3xl border border-white/80 cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#EFEAF8] text-[#561D4F] flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base font-heading text-[#350B30]">Find a Doctor</h3>
          <p className="text-xs text-[#635860] line-clamp-2">
            Browse verified gynecologists and specialists speaking Kannada, Telugu, Hindi, Tamil & English.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#7A3572] flex items-center gap-1">
            <span>Find Doctors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: Medical Reports & Referrals */}
        <div 
          onClick={() => navigate('/reports')}
          className="glass-card p-5 rounded-3xl border border-white/80 cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] text-[#561D4F] border border-[#D8CCE8] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base font-heading text-[#350B30]">Diagnostic Reports</h3>
          <p className="text-xs text-[#635860] line-clamp-2">
            Securely upload ultrasound scans or blood panels and explore medical terminology explanations.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#7A3572] flex items-center gap-1">
            <span>View Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* LOWER SECTION: APPOINTMENT STATUS & RECENT CHAT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Upcoming Appointment Card */}
        <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-heading text-[#350B30] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#561D4F]" />
              <span>Appointment Status</span>
            </h3>
            <button 
              onClick={() => navigate('/appointments')}
              className="text-xs font-semibold text-[#7A3572] hover:underline"
            >
              All Appointments &rarr;
            </button>
          </div>

          {nextAppt ? (
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D8CCE8] space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-[#350B30]">
                    {nextAppt.doctor_name || "Dr. Ananya Sharma"}
                  </div>
                  <div className="text-xs text-[#635860]">
                    {nextAppt.specialty || "Gynecologist & PCOS Specialist"}
                  </div>
                </div>
                {/* Real status pill */}
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  nextAppt.status === 'confirmed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}>
                  {nextAppt.status === 'confirmed' ? 'Confirmed' : 'Pending Doctor Confirmation'}
                </span>
              </div>

              <div className="text-xs text-[#231B22] flex items-center gap-4">
                <span className="flex items-center gap-1 text-[#635860]">
                  <Clock className="w-3.5 h-3.5" />
                  {nextAppt.confirmed_slot || nextAppt.requested_slot}
                </span>
                <span className="flex items-center gap-1 text-[#635860]">
                  <Video className="w-3.5 h-3.5 text-[#561D4F]" />
                  Video Consultation
                </span>
              </div>

              <div className="pt-2 border-t border-[#D8CCE8]/60 flex items-center justify-between text-xs">
                <span className="text-[#958B92]">Fee: ₹{nextAppt.amount} (Demo Paid)</span>
                <button
                  onClick={() => navigate('/appointments')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#D8CCE8] hover:bg-[#EFEAF8] text-[#561D4F] font-semibold transition-colors"
                >
                  Manage Booking
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#958B92] space-y-2">
              <p>No active consultations scheduled.</p>
              <button
                onClick={() => navigate('/doctors')}
                className="px-4 py-2 rounded-xl plum-gradient text-white font-semibold"
              >
                Book a Doctor Consultation
              </button>
            </div>
          )}
        </div>

        {/* Right: Continue Conversation or Safety Summary */}
        <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-heading text-[#350B30] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#561D4F]" />
              <span>Recent Health Conversation</span>
            </h3>
            <button 
              onClick={() => navigate('/assistant')}
              className="text-xs font-semibold text-[#7A3572] hover:underline"
            >
              Open Assistant &rarr;
            </button>
          </div>

          {recentConv ? (
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D8CCE8] space-y-2">
              <div className="text-xs font-bold text-[#350B30]">Topic:</div>
              <p className="text-xs text-[#635860] line-clamp-2">
                "{recentConv.first_query}"
              </p>
              <div className="text-[11px] text-[#958B92]">
                Language: {recentConv.language?.toUpperCase()} • {recentConv.message_count} messages
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/assistant')}
                  className="w-full py-2 rounded-xl bg-white border border-[#D8CCE8] text-xs font-semibold text-[#561D4F] hover:bg-[#EFEAF8] transition-colors"
                >
                  Resume Discussion &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-[#EFEAF8] rounded-2xl border border-[#D8CCE8] space-y-3 text-xs text-[#561D4F]">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#7A3572]" />
                <span>Zero Pressure Health Companion</span>
              </div>
              <p className="text-[#635860] leading-relaxed">
                You haven't started a symptom discussion yet. FemCare Insight never rushes you into diagnosis. Whenever you feel comfortable, start by describing what you feel in your own language.
              </p>
              <button
                onClick={() => navigate('/assistant')}
                className="px-4 py-2 rounded-xl bg-[#561D4F] text-white font-semibold shadow-xs"
              >
                Start First Conversation
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Live Translation Teaser Bar (Feature 12) */}
      <div className="bg-[#FAF7F2] rounded-3xl p-5 border border-[#EAAAB3]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EFEAF8] text-[#561D4F] flex items-center justify-center font-bold">
            🌐
          </div>
          <div>
            <div className="text-sm font-bold text-[#350B30]">Doctor-Patient Live Translation Demo</div>
            <div className="text-xs text-[#635860]">
              Simulate bilingual clinical consultations (Telugu, Kannada, Hindi to English) with doctor verification.
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/translate')}
          className="px-4 py-2 rounded-xl bg-white border border-[#D8CCE8] hover:border-[#561D4F] text-xs font-bold text-[#561D4F] shadow-2xs transition-colors shrink-0"
        >
          Open Live Translation Demo &rarr;
        </button>
      </div>

    </div>
  );
};
