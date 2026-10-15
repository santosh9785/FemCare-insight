import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Stethoscope, 
  Star, 
  Globe, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Video, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  X
} from 'lucide-react';

export const DoctorsPage = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLang, setSelectedLang] = useState('');
  const [loading, setLoading] = useState(true);

  // Booking Modal
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [bookDate, setBookDate] = useState('2026-10-18');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultationType, setConsultationType] = useState('video');
  const [symptomsSummary, setSymptomsSummary] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, [selectedSpecialty, selectedLang]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.getDoctors(selectedSpecialty, selectedLang);
      if (res.doctors) setDoctors(res.doctors);
    } catch (e) {
      console.warn('Doctors fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = async (doc) => {
    setActiveDoctor(doc);
    setBookingSuccess(null);
    setSelectedSlot('');
    try {
      const res = await api.getDoctorSlots(doc.id, bookDate);
      if (res.slots) {
        setAvailableSlots(res.slots);
        const firstAvail = res.slots.find(s => s.available);
        if (firstAvail) setSelectedSlot(`${bookDate} ${firstAvail.time}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setBookingLoading(true);
    try {
      const res = await api.createAppointment({
        patient_id: user?.id || 'user-demo-priya',
        patient_name: user?.display_name || 'Priya Sharma',
        patient_phone: '+91 98765 43210',
        doctor_id: activeDoctor.id,
        requested_slot: selectedSlot,
        consultation_type: consultationType,
        symptoms_summary: symptomsSummary || 'Consultation regarding irregular menstrual cycles and acne',
        amount: activeDoctor.consultation_fee
      });

      if (res.appointment) {
        setBookingSuccess(res.appointment);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAF8] text-xs font-semibold text-[#561D4F] mb-1.5">
          <Stethoscope className="w-3.5 h-3.5 text-[#7A3572]" />
          <span>Multilingual Specialist Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#350B30]">
          Find Qualified Healthcare Professionals
        </h1>
        <p className="text-xs sm:text-sm text-[#635860] max-w-2xl">
          Connect with trusted gynecologists, endocrinologists, and specialists who speak your regional language and understand your health history.
        </p>
      </div>

      {/* Filters Strip */}
      <div className="glass-panel p-4 rounded-3xl border border-white/80 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div>
            <label className="text-[11px] font-bold text-[#635860] mr-2">Specialty:</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-[#D8CCE8] bg-[#FAF7F2] text-[#231B22] focus:outline-none"
            >
              <option value="">All Specialties</option>
              <option value="Gynecologist">Gynecologist & PCOS</option>
              <option value="Reproductive">Reproductive Health</option>
              <option value="Dermatologist">Dermatologist & Acne</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#635860] mr-2">Language Spoken:</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-[#D8CCE8] bg-[#FAF7F2] text-[#231B22] focus:outline-none"
            >
              <option value="">All Languages</option>
              <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[#958B92]">
          Showing {doctors.length} verified clinicians
        </div>
      </div>

      {/* DOCTORS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="glass-card rounded-3xl p-6 border border-white/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Doctor Avatar & Identity */}
              <div className="flex items-start gap-4">
                <img
                  src={doc.avatar_url}
                  alt={doc.display_name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D8CCE8] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base font-heading text-[#350B30]">
                      {doc.display_name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Medical Credentials" />
                  </div>
                  <div className="text-xs font-semibold text-[#561D4F]">{doc.specialty}</div>
                  <div className="text-[11px] text-[#635860] mt-0.5">{doc.qualifications}</div>
                  <div className="text-[11px] text-[#958B92]">{doc.experience_years} years clinical experience</div>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-[#635860] leading-relaxed">
                {doc.bio}
              </p>

              {/* Languages & Rating tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{doc.rating}</span>
                  <span className="text-[#958B92] font-normal">({doc.reviews_count})</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-[#635860] bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#D8CCE8]">
                  <Globe className="w-3 h-3 text-[#561D4F]" />
                  <span>{doc.supported_languages?.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Bottom: Fee & Book Button */}
            <div className="pt-4 border-t border-[#FAF7F2] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#958B92] block uppercase tracking-wider">Consultation Fee</span>
                <span className="text-base font-bold text-[#350B30]">₹{doc.consultation_fee}</span>
              </div>
              <button
                onClick={() => handleOpenBooking(doc)}
                className="px-5 py-2.5 rounded-xl plum-gradient text-white text-xs font-bold shadow-xs hover:opacity-95 transition-opacity"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL (Feature 10: Step-by-step workflow with Demo Payment) */}
      {activeDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D8CCE8] space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveDoctor(null)}
              className="absolute top-4 right-4 text-[#958B92] hover:text-[#231B22] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              /* Success / Status View (Test F: Pending Confirmation!) */
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <Clock className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-heading text-[#350B30]">
                    Appointment Request Submitted
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Status: Pending Doctor Confirmation
                  </div>
                </div>
                <p className="text-xs text-[#635860] max-w-sm mx-auto leading-relaxed">
                  Your request for <strong>{bookingSuccess.requested_slot}</strong> has been transmitted to {activeDoctor.display_name}.
                  Once confirmed by the doctor, you will receive an in-app alert.
                </p>

                <div className="p-3 bg-[#FAF7F2] rounded-xl text-left text-xs border border-[#D8CCE8] space-y-1">
                  <div><strong>Consultation:</strong> Video Consultation</div>
                  <div><strong>Payment Status:</strong> Demo Paid (₹{bookingSuccess.amount})</div>
                  <div><strong>Transaction Ref:</strong> {bookingSuccess.payment_id}</div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      setActiveDoctor(null);
                      navigate('/appointments');
                    }}
                    className="flex-1 py-2.5 rounded-xl plum-gradient text-white text-xs font-bold"
                  >
                    View My Appointments &rarr;
                  </button>
                  <button
                    onClick={() => setActiveDoctor(null)}
                    className="py-2.5 px-4 rounded-xl border border-[#D8CCE8] text-xs font-semibold text-[#635860]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#350B30]">
                    Schedule with {activeDoctor.display_name}
                  </h3>
                  <p className="text-xs text-[#635860]">{activeDoctor.specialty} • ₹{activeDoctor.consultation_fee}</p>
                </div>

                {/* Consultation Type Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1.5">Consultation Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultationType('video')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                        consultationType === 'video'
                          ? 'bg-[#561D4F] text-white border-[#561D4F]'
                          : 'bg-white text-[#635860] border-[#D8CCE8]'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video Consultation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultationType('clinic')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                        consultationType === 'clinic'
                          ? 'bg-[#561D4F] text-white border-[#561D4F]'
                          : 'bg-white text-[#635860] border-[#D8CCE8]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>In-Clinic Visit</span>
                    </button>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Select Consultation Date</label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={(e) => {
                      setBookDate(e.target.value);
                      handleOpenBooking(activeDoctor);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
                  />
                </div>

                {/* Available Slots */}
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1.5">Available Time Slots</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot, idx) => {
                      const fullSlotStr = `${bookDate} ${slot.time}`;
                      const isSelected = selectedSlot === fullSlotStr;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(fullSlotStr)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all ${
                            !slot.available
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#561D4F] text-white border-[#561D4F] shadow-xs'
                              : 'bg-white text-[#231B22] border-[#D8CCE8] hover:border-[#561D4F]'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Patient Symptoms Summary */}
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">
                    Describe Concerns for Doctor (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={symptomsSummary}
                    onChange={(e) => setSymptomsSummary(e.target.value)}
                    placeholder="e.g. Irregular cycles (3 months delayed), severe jawline acne, requesting hormonal evaluation"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
                  />
                </div>

                {/* Demo Payment Notice & Total Fee */}
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#D8CCE8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#561D4F]" />
                    <div>
                      <div className="text-xs font-bold text-[#350B30]">Demo Payment Checkout</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">Demo Mode — No Money Charged</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[#350B30]">₹{activeDoctor.consultation_fee}</div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading || !selectedSlot}
                  className="w-full py-3 rounded-xl plum-gradient text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity disabled:opacity-50"
                >
                  {bookingLoading ? "Transmitting Request..." : "Submit Appointment Request (Demo)"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
