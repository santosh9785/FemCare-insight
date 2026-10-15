import React, { useState } from 'react';
import { useApp, LANGUAGES } from '../context/AppContext';
import { api } from '../services/api';
import { X, ShieldCheck, Heart, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { setUser, setLanguage, setActiveRole } = useApp();
  const [tab, setTab] = useState('demo'); // 'demo' | 'login' | 'register'
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prefLang, setPrefLang] = useState('en');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDemoLogin = async (role, lang, name) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.demoLogin(role, lang);
      if (res.user) {
        setUser(res.user);
        setActiveRole(role);
        setLanguage(lang);
        onClose();
      }
    } catch (e) {
      // Fallback
      setUser({
        id: role === 'doctor' ? 'doc-ananya' : 'user-demo-priya',
        display_name: name || (role === 'doctor' ? 'Dr. Ananya Sharma' : 'Priya Sharma'),
        email: role === 'doctor' ? 'dr.ananya@femcare.demo' : 'priya@femcare.demo',
        role,
        preferred_language: lang
      });
      setActiveRole(role);
      setLanguage(lang);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
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
        const res = await api.register(displayName, email, password, prefLang);
        if (res.error) throw new Error(res.error);
        setUser(res.user);
        setLanguage(prefLang);
        onClose();
      } else {
        const res = await api.login(email, password);
        if (res.error) throw new Error(res.error);
        setUser(res.user);
        setLanguage(res.user.preferred_language || 'en');
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#D8CCE8] overflow-hidden relative">
        {/* Header */}
        <div className="plum-gradient p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md mx-auto flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 text-[#F6D6DE]" />
          </div>
          <h2 className="text-xl font-bold font-heading">Welcome to FemCare Insight</h2>
          <p className="text-xs text-[#F6D6DE]/90 mt-1">Your private, non-judgmental women's health companion</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#FAF7F2] p-1.5 bg-[#FAF7F2]">
          <button
            onClick={() => { setTab('demo'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              tab === 'demo' ? 'bg-white text-[#561D4F] shadow-xs' : 'text-[#635860] hover:text-[#561D4F]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D77A88]" />
            Quick Demo Mode
          </button>
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              tab === 'login' ? 'bg-white text-[#561D4F] shadow-xs' : 'text-[#635860] hover:text-[#561D4F]'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              tab === 'register' ? 'bg-white text-[#561D4F] shadow-xs' : 'text-[#635860] hover:text-[#561D4F]'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {error}
            </div>
          )}

          {tab === 'demo' ? (
            <div className="space-y-3">
              <div className="p-3 bg-[#EFEAF8] rounded-xl text-xs text-[#561D4F] mb-3 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#7A3572] shrink-0 mt-0.5" />
                <span>
                  <strong>Hackathon Demo Accounts:</strong> Explore FemCare Insight immediately with pre-configured synthetic profiles. No real patient data required.
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => handleDemoLogin('patient', 'en', 'Priya Sharma')}
                  className="w-full text-left p-3 rounded-2xl border border-[#D8CCE8] hover:border-[#561D4F] bg-white hover:bg-[#FAF7F2] transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#231B22] group-hover:text-[#561D4F]">
                      Priya Sharma (Patient)
                    </div>
                    <div className="text-[11px] text-[#635860]">English / Hindi • Irregular cycle & hormonal history</div>
                  </div>
                  <span className="text-xs text-[#7A3572] font-semibold">Start &rarr;</span>
                </button>

                <button
                  onClick={() => handleDemoLogin('patient', 'kn', 'Deepa Hegde')}
                  className="w-full text-left p-3 rounded-2xl border border-[#D8CCE8] hover:border-[#561D4F] bg-white hover:bg-[#FAF7F2] transition-all flex items-center justify-between group"
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
                  onClick={() => handleDemoLogin('patient', 'te', 'Lakshmi Rao')}
                  className="w-full text-left p-3 rounded-2xl border border-[#D8CCE8] hover:border-[#561D4F] bg-white hover:bg-[#FAF7F2] transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#231B22] group-hover:text-[#561D4F]">
                      లక్ష్మి రావు (Lakshmi - Patient)
                    </div>
                    <div className="text-[11px] text-[#635860]">తెలుగు (Telugu) • క్రమం తప్పిన పీరియడ్స్ లక్షణాలు</div>
                  </div>
                  <span className="text-xs text-[#7A3572] font-semibold">ప్రారంభించండి &rarr;</span>
                </button>

                <button
                  onClick={() => {
                    setTab('login');
                    setEmail('santosh1@gmail.com');
                    setPassword('boss143');
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-[#561D4F] bg-[#561D4F]/5 hover:bg-[#561D4F]/10 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#561D4F] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Dr. Santosh (Private Doctor Access)</span>
                    </div>
                    <div className="text-[11px] text-[#635860]">Authorized ID: santosh1@gmail.com • Password protected</div>
                  </div>
                  <span className="text-xs text-[#561D4F] font-bold">Doctor Login &rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8CCE8] focus:border-[#561D4F] focus:outline-none text-xs"
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
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8CCE8] focus:border-[#561D4F] focus:outline-none text-xs"
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
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8CCE8] focus:border-[#561D4F] focus:outline-none text-xs"
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
                    id="privacy-agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-[#561D4F] focus:ring-[#561D4F]"
                  />
                  <label htmlFor="privacy-agree" className="text-[11px] text-[#635860] leading-snug">
                    I understand FemCare Insight provides supportive health information, not a medical diagnosis. Data is stored privately for my health tracking.
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl plum-gradient text-white text-xs font-bold plum-glow hover:opacity-95 transition-all mt-2"
              >
                {loading ? 'Please wait...' : (tab === 'register' ? 'Create Free Account' : 'Log In')}
              </button>
            </form>
          )}

          {/* Privacy Footnote */}
          <div className="mt-4 pt-3 border-t border-[#FAF7F2] text-center text-[10px] text-[#958B92] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#561D4F]" />
            <span>Encrypted health space • Private & non-judgmental</span>
          </div>
        </div>
      </div>
    </div>
  );
};
