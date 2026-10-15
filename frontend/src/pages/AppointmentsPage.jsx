import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  FileText,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AppointmentsPage = () => {
  const { user } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCallAppt, setActiveCallAppt] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.getAppointments(user?.id || 'user-demo-priya');
      if (res.appointments) setAppointments(res.appointments);
    } catch (e) {
      console.warn('Appointments fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed by Doctor
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Declined / Reschedule Needed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Doctor Confirmation
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAF8] text-xs font-semibold text-[#561D4F] mb-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#7A3572]" />
          <span>Consultation Schedule</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#350B30]">
          My Doctor Consultations
        </h1>
        <p className="text-xs sm:text-sm text-[#635860] max-w-xl">
          Track the confirmation status of your consultation requests and join your secure video room when confirmed.
        </p>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#D8CCE8] soft-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#958B92] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#350B30]">No scheduled appointments</h3>
            <p className="text-xs text-[#635860]">
              You can search for verified gynecologists and book an appointment in the Find a Doctor tab.
            </p>
          </div>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl plum-gradient text-white flex items-center justify-center font-bold text-sm shrink-0">
                    <Stethoscope className="w-6 h-6 text-[#F6D6DE]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base font-heading text-[#350B30]">
                      {appt.doctor_name || "Dr. Ananya Sharma"}
                    </h3>
                    <div className="text-xs text-[#561D4F] font-semibold">
                      {appt.specialty || "Gynecologist & PCOS Specialist"}
                    </div>
                    <div className="text-xs text-[#635860] mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#7A3572]" />
                        {appt.confirmed_slot || appt.requested_slot}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 capitalize">
                        <Video className="w-3.5 h-3.5 text-[#561D4F]" />
                        {appt.consultation_type} Consultation
                      </span>
                    </div>
                  </div>
                </div>

                <div>{getStatusBadge(appt.status)}</div>
              </div>

              {/* Patient Submitted Symptoms */}
              {appt.symptoms_summary && (
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#D8CCE8] text-xs text-[#635860]">
                  <strong className="text-[#350B30] block mb-0.5">Submitted Health Concerns:</strong>
                  {appt.symptoms_summary}
                </div>
              )}

              {/* Doctor Consultation Notes if any */}
              {appt.doctor_notes && (
                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
                  <strong className="text-emerald-900 block mb-0.5">Doctor's Pre-Consultation Notes:</strong>
                  {appt.doctor_notes}
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-3 border-t border-[#FAF7F2] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#958B92]">
                  Booking Ref: <span className="font-mono text-[#231B22]">{appt.id}</span> • Fee: ₹{appt.amount} (Demo Paid)
                </div>

                <div className="flex gap-2">
                  {appt.status === 'confirmed' ? (
                    <button
                      onClick={() => setActiveCallAppt(appt)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Enter Consultation Room</span>
                    </button>
                  ) : (
                    <div className="text-xs text-amber-700 font-medium">
                      Awaiting doctor schedule confirmation. Please check back shortly.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SIMULATED CONSULTATION ROOM MODAL */}
      {activeCallAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#D8CCE8] space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-pulse">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#350B30]">
              Secure Video Consultation Room
            </h3>
            <p className="text-xs text-[#635860] max-w-md mx-auto">
              Connected with <strong>{activeCallAppt.doctor_name}</strong>. Encrypted peer-to-peer session.
            </p>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D8CCE8] text-xs text-left space-y-2">
              <div className="font-bold text-[#561D4F] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Doctor Verification & Clinical Standards:</span>
              </div>
              <ul className="list-disc list-inside text-[#635860] space-y-1">
                <li>End-to-end encrypted video and audio feed</li>
                <li>Live translation capability enabled for regional languages</li>
                <li>Digital test referrals will be issued directly to your FemCare Insight Reports tab</li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveCallAppt(null)}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                Leave Consultation Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
