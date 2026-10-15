import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ShieldCheck, 
  User, 
  Sparkles,
  Plus,
  Send,
  Lock,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DoctorPortalPage = () => {
  const { user, setUser, setActiveRole } = useApp();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Doctor Gate Authentication State
  const isAuthorizedDoctor = user?.email === 'santosh1@gmail.com';
  const [emailInput, setEmailInput] = useState('santosh1@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Referral Modal
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('user-demo-priya');
  const [testName, setTestName] = useState('Pelvic Ultrasound (USG) & Fasting Insulin');
  const [clinicalReason, setClinicalReason] = useState('Evaluation of secondary amenorrhea and hirsutism');
  const [instructions, setInstructions] = useState('Fasting 8-10 hours prior to blood sample. Drink 1L water 1 hour prior to USG.');
  const [referralSuccess, setReferralSuccess] = useState(false);

  useEffect(() => {
    if (isAuthorizedDoctor) {
      loadDoctorAppointments();
    }
  }, [user]);

  const loadDoctorAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.getAppointments();
      if (res.appointments) setAppointments(res.appointments);
    } catch (e) {
      console.warn('Doctor portal fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await api.login(emailInput.trim().toLowerCase(), passwordInput);
      if (res.error) throw new Error(res.error);

      if (res.user.email !== 'santosh1@gmail.com') {
        throw new Error('Access Denied: Only authorized doctor ID (santosh1@gmail.com) may access clinical patient records.');
      }

      setUser(res.user);
      setActiveRole('doctor');
      loadDoctorAppointments();
    } catch (err) {
      setAuthError(err.message || 'Invalid clinical authorization credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      await api.updateAppointmentStatus(
        apptId, 
        newStatus, 
        null, 
        newStatus === 'confirmed' ? "Consultation request accepted. Please be ready in the video room 5 minutes early." : "Doctor unavailable at requested time."
      );
      loadDoctorAppointments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateReferral = async (e) => {
    e.preventDefault();
    try {
      await api.createReferral({
        patient_id: selectedPatientId,
        doctor_id: 'doc-santosh',
        doctor_name: 'Dr. Santosh, MD (OB-GYN)',
        test_name: testName,
        clinical_reason: clinicalReason,
        instructions
      });
      setReferralSuccess(true);
      setTimeout(() => {
        setReferralSuccess(false);
        setShowReferralModal(false);
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  // If not logged in as the private doctor, render Doctor Verification Gate
  if (!isAuthorizedDoctor) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-in fade-in">
        <div className="glass-panel rounded-3xl p-8 border border-white/90 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl plum-gradient text-white flex items-center justify-center mx-auto shadow-lg plum-glow">
            <Lock className="w-8 h-8 text-[#F6D6DE]" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold font-heading text-[#350B30]">
              Doctor Clinical View is Private
            </h1>
            <p className="text-xs text-[#635860] leading-relaxed">
              Patient consultation requests and diagnostic history are protected under medical privacy standards. Clinician verification is required.
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Authorized Doctor Credentials Required:</strong>
              <div>Email: <code className="font-mono bg-white px-1 py-0.5 rounded text-[#561D4F]">santosh1@gmail.com</code></div>
              <div>Password: <code className="font-mono bg-white px-1 py-0.5 rounded text-[#561D4F]">boss143</code></div>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 text-left flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleDoctorLogin} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#231B22] mb-1">
                Doctor ID / Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="santosh1@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#231B22] mb-1">
                Security Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl plum-gradient text-white text-xs font-bold shadow-md plum-glow hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{authLoading ? "Verifying Credentials..." : "Unlock Doctor Portal"}</span>
            </button>
          </form>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveRole('patient');
                navigate('/dashboard');
              }}
              className="text-xs text-[#7A3572] font-semibold hover:underline"
            >
              &larr; Return to Patient Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Doctor Portal View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-[#561D4F]/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private Clinician Session Active ({user?.email})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#350B30]">
            Dr. Santosh, MD (OB-GYN)
          </h1>
          <p className="text-xs sm:text-sm text-[#635860] max-w-xl">
            Review incoming patient consultation requests, inspect symptom notes, confirm appointments, and issue structured clinical referrals.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowReferralModal(true)}
            className="px-4 py-2.5 rounded-2xl plum-gradient text-white text-xs font-bold shadow-xs hover:opacity-95 transition-opacity flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Clinical Test Order</span>
          </button>
          <button
            onClick={() => {
              setActiveRole('patient');
              navigate('/dashboard');
            }}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#D8CCE8] hover:bg-[#FAF7F2] text-xs font-semibold text-[#635860]"
          >
            Switch to Patient View
          </button>
        </div>
      </div>

      {/* Appointment Requests Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading text-[#350B30] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#561D4F]" />
            <span>Assigned Patient Requests & Status Updates</span>
          </h2>
          <span className="text-xs text-[#958B92]">{appointments.length} requests</span>
        </div>

        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EFEAF8] text-[#561D4F] flex items-center justify-center font-bold text-sm shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-heading text-[#350B30]">
                    {appt.patient_name || "Priya Sharma"}
                  </h3>
                  <div className="text-xs text-[#635860]">
                    Phone: {appt.patient_phone || "+91 98765 43210"} • Mode: <span className="capitalize">{appt.consultation_type}</span>
                  </div>
                  <div className="text-xs text-[#561D4F] font-semibold mt-1">
                    Requested Slot: {appt.requested_slot}
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  appt.status === 'confirmed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : appt.status === 'rejected'
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                }`}>
                  Status: {appt.status === 'confirmed' ? 'Confirmed by You' : appt.status === 'rejected' ? 'Declined' : 'Pending Your Confirmation'}
                </span>
              </div>
            </div>

            {/* Patient Symptoms Summary */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D8CCE8] text-xs text-[#231B22] space-y-1">
              <strong className="text-[#350B30] block">Patient's Pre-Consultation Notes:</strong>
              <p className="text-[#635860] leading-relaxed">
                {appt.symptoms_summary || "No specific symptom description provided."}
              </p>
            </div>

            {/* Doctor Actions */}
            <div className="pt-3 border-t border-[#FAF7F2] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#958B92]">
                Booking ID: <span className="font-mono text-[#231B22]">{appt.id}</span> • Consultation Fee: ₹{appt.amount}
              </div>

              <div className="flex gap-2">
                {appt.status === 'pending_confirmation' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'confirmed')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept & Confirm Appointment</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'rejected')}
                      className="px-4 py-2 rounded-xl bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline Request</span>
                    </button>
                  </>
                )}

                {appt.status === 'confirmed' && (
                  <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Appointment Confirmed. Patient notified via in-app alerts.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE REFERRAL MODAL */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D8CCE8] space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#350B30]">
              Issue Clinical Diagnostic Test Order (Dr. Santosh)
            </h3>
            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
              Note: This transmits an authorized clinical referral to the patient's record.
            </div>

            {referralSuccess ? (
              <div className="p-6 text-center text-xs font-bold text-emerald-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>Test Order Transmitted to Patient's Medical Reports tab successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleCreateReferral} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Patient</label>
                  <input
                    type="text"
                    disabled
                    value="Priya Sharma (user-demo-priya)"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] bg-gray-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Test or Referral Name</label>
                  <input
                    type="text"
                    required
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Clinical Indication</label>
                  <input
                    type="text"
                    required
                    value={clinicalReason}
                    onChange={(e) => setClinicalReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Preparation Instructions</label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReferralModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#D8CCE8] text-xs font-semibold text-[#635860]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl plum-gradient text-white text-xs font-bold shadow-xs"
                  >
                    Generate Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
