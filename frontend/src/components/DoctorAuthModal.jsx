import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  Lock, 
  Stethoscope, 
  X, 
  AlertCircle, 
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DoctorAuthModal = ({ isOpen, onClose }) => {
  const { setUser, setActiveRole } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('santosh1@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login(email.trim().toLowerCase(), password);
      if (res.error) {
        throw new Error(res.error);
      }

      if (res.user.role !== 'doctor' && res.user.email !== 'santosh1@gmail.com') {
        throw new Error('Unauthorized: This account does not possess verified clinical doctor privileges.');
      }

      setUser(res.user);
      setActiveRole('doctor');
      onClose();
      navigate('/doctor-portal');
    } catch (err) {
      setError(err.message || 'Invalid clinical authorization credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#561D4F]/30 overflow-hidden relative">
        {/* Header */}
        <div className="plum-gradient p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md mx-auto flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-[#F6D6DE]" />
          </div>

          <h2 className="text-xl font-bold font-heading">Private Doctor Portal Access</h2>
          <p className="text-xs text-[#F6D6DE]/90 mt-1">
            Restricted clinical area for authorized healthcare personnel only
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block">Clinical Privacy Security Gate:</strong>
              Patient consultation requests and diagnostic reports are strictly protected. Enter authorized doctor credentials to proceed.
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#231B22] mb-1">
                Doctor ID / Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="santosh1@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCE8] focus:border-[#561D4F] focus:outline-none text-xs bg-[#FAF7F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231B22] mb-1">
                Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCE8] focus:border-[#561D4F] focus:outline-none text-xs bg-[#FAF7F2]"
              />
              <span className="text-[10px] text-[#958B92] mt-1 block">
                Authorized doctor credentials: <code className="bg-gray-100 px-1 py-0.5 rounded text-[#561D4F]">santosh1@gmail.com</code> / <code className="bg-gray-100 px-1 py-0.5 rounded text-[#561D4F]">boss143</code>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl plum-gradient text-white text-xs font-bold shadow-md plum-glow hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? "Verifying Clinical Credentials..." : "Unlock Doctor Portal"}</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#958B92] hover:text-[#561D4F]"
            >
              Return to Patient View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
