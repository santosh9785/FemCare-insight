import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp, LANGUAGES } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  User, 
  AlertCircle, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export const LoginPage = () => {
  const { setUser, setLanguage, setActiveRole } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
  
  // Login inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register inputs
  const [displayName, setDisplayName] = useState('');
  const [prefLang, setPrefLang] = useState('en');
  const [agreed, setAgreed] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'register') {
        if (!agreed) {
          setError('Please accept the privacy notice to continue.');
          setLoading(false);
          return;
        }
        const res = await api.register(displayName, email.trim().toLowerCase(), password, prefLang);
        if (res.error) throw new Error(res.error);
        setUser(res.user);
        setActiveRole('patient');
        setLanguage(prefLang);
        navigate('/dashboard');
      } else {
        const res = await api.login(email.trim().toLowerCase(), password);
        if (res.error) throw new Error(res.error);

        setUser(res.user);
        if (res.user.role === 'doctor' || res.user.email === 'santosh1@gmail.com') {
          setActiveRole('doctor');
          navigate('/doctor-portal');
        } else {
          setActiveRole('patient');
          setLanguage(res.user.preferred_language || 'en');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role, lang, emailToUse, name) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.demoLogin(role, lang);
      if (res.user) {
        setUser(res.user);
        setActiveRole(role);
        setLanguage(lang);
        navigate(role === 'doctor' ? '/doctor-portal' : '/dashboard');
      }
    } catch (e) {
      const demoUser = {
        id: role === 'doctor' ? 'doc-santosh' : 'user-demo-priya',
        display_name: name,
        email: emailToUse,
        role,
        preferred_language: lang
      };
      setUser(demoUser);
      setActiveRole(role);
      navigate(role === 'doctor' ? '/doctor-portal' : '/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="max-w-md w-full glass-panel rounded-3xl shadow-2xl border border-white/90 overflow-hidden relative">
        
        {/* Card Header */}
        <div className="plum-gradient p-6 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md mx-auto flex items-center justify-center mb-2 shadow-lg">
            <Heart className="w-6 h-6 text-[#F6D6DE]" />
          </div>
          <h2 className="text-xl font-bold font-heading">FemCare Insight</h2>
          <p className="text-xs text-[#F6D6DE]/90 mt-0.5">
            {tab === 'register' ? "Create your confidential health space" : "Sign in to access your personalized companion"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#FAF5EE] p-1.5 bg-[#FAF5EE]/80">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              tab === 'login' ? 'bg-white text-[#561D4F] shadow-xs' : 'text-[#635860] hover:text-[#561D4F]'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setTab('demo'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              tab === 'demo' ? 'bg-white text-[#561D4F] shadow-xs' : 'text-[#635860] hover:text-[#561D4F]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D77A88]" />
            Quick Demo
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              tab === 'register' ? 'bg-white text-[#561D4F] shadow-xs' : 'text-[#635860] hover:text-[#561D4F]'
            }`}
          >
            Register
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'demo' ? (
            /* Quick Demo Mode for Hackathon Judges */
            <div className="space-y-3">
              <div className="p-3 bg-[#EFEAF8] rounded-2xl text-xs text-[#561D4F] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#7A3572] shrink-0 mt-0.5" />
                <span>
                  <strong>Instant Demo Access:</strong> Select a synthetic profile below to evaluate FemCare Insight without manual input.
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleQuickDemo('patient', 'en', 'priya@femcare.demo', 'Priya Sharma')}
                  className="w-full text-left p-3 rounded-2xl border border-[#D8CCE8] bg-white hover:bg-[#FAF7F2] transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div>
                    <div className="text-xs font-bold text-[#231B22] group-hover:text-[#561D4F]">
                      Priya Sharma (Patient)
                    </div>
                    <div className="text-[11px] text-[#635860]">English / Hindi • Irregular cycle & hormonal history</div>
                  </div>
                  <span className="text-xs text-[#7A3572] font-semibold">Enter &rarr;</span>
                </button>

                <button
                  onClick={() => handleQuickDemo('patient', 'kn', 'deepa@femcare.demo', 'Deepa Hegde')}
                  className="w-full text-left p-3 rounded-2xl border border-[#D8CCE8] bg-white hover:bg-[#FAF7F2] transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div>
                    <div className="text-xs font-bold text-[#231B22] group-hover:text-[#561D4F]">
                      ದೀಪಾ ಹೆಗಡೆ (Deepa - Patient)
                    </div>
                    <div className="text-[11px] text-[#635860]">ಕನ್ನಡ (Kannada) • ಮುಟ್ಟಿನ ವಿಳಂಬ ಮತ್ತು ಮೊಡವೆಗಳು</div>
                  </div>
                  <span className="text-xs text-[#7A3572] font-semibold">ಪ್ರಾರಂಭಿಸಿ &rarr;</span>
                </button>

                <button
                  onClick={() => handleQuickDemo('patient', 'te', 'lakshmi@femcare.demo', 'Lakshmi Rao')}
                  className="w-full text-left p-3 rounded-2xl border border-[#D8CCE8] bg-white hover:bg-[#FAF7F2] transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div>
                    <div className="text-xs font-bold text-[#231B22] group-hover:text-[#561D4F]">
                      లక్ష్మి రావు (Lakshmi - Patient)
                    </div>
                    <div className="text-[11px] text-[#635860]">తెలుగు (Telugu) • క్రమం తప్పిన పీరియడ్స్ లక్షణాలు</div>
                  </div>
                  <span className="text-xs text-[#7A3572] font-semibold">ప్రారంభించండి &rarr;</span>
                </button>

                {/* Doctor Credential Shortcut */}
                <button
                  onClick={() => {
                    setTab('login');
                    setEmail('santosh1@gmail.com');
                    setPassword('boss143');
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-[#561D4F]/40 bg-[#561D4F]/5 hover:bg-[#561D4F]/10 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#561D4F] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Dr. Santosh (Private Doctor Credentials)</span>
                    </div>
                    <div className="text-[11px] text-[#635860]">Auto-fill santosh1@gmail.com / boss143</div>
                  </div>
                  <span className="text-xs text-[#561D4F] font-bold">Fill &rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login & Register Form */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8CCE8] focus:border-[#561D4F] focus:outline-none text-xs bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#231B22] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8CCE8] focus:border-[#561D4F] focus:outline-none text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#231B22] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8CCE8] focus:border-[#561D4F] focus:outline-none text-xs bg-white"
                />
              </div>

              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Preferred Language</label>
                  <select
                    value={prefLang}
                    onChange={(e) => setPrefLang(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8CCE8] focus:border-[#561D4F] focus:outline-none text-xs bg-white"
                  >
                    {LANGUAGES.map(l => (
                      <option key={l.code} value={l.code}>{l.native} ({l.label})</option>
                    ))}
                  </select>
                </div>
              )}

              {tab === 'register' && (
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="privacy-terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-[#561D4F]"
                  />
                  <label htmlFor="privacy-terms" className="text-[11px] text-[#635860] leading-snug">
                    I understand FemCare Insight provides health information, not a medical diagnosis. Data is stored privately.
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl plum-gradient text-white text-xs font-bold plum-glow hover:opacity-95 transition-all mt-2"
              >
                {loading ? 'Please wait...' : (tab === 'register' ? 'Create Free Account' : 'Sign In')}
              </button>
            </form>
          )}

          {/* Bottom Link Back to Get Started */}
          <div className="mt-4 pt-3 border-t border-[#FAF5EE] text-center">
            <Link to="/get-started" className="text-xs text-[#7A3572] font-semibold hover:underline">
              &larr; Back to Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
