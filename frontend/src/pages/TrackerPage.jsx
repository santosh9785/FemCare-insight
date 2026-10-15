import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Heart, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Activity,
  Smile,
  Zap,
  Info
} from 'lucide-react';

export const TrackerPage = () => {
  const { user } = useApp();
  const [data, setData] = useState({ cycles: [], symptoms: [], metrics: {} });
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [showSymptomModal, setShowSymptomModal] = useState(false);

  // Form states
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [flow, setFlow] = useState('medium');
  const [cramps, setCramps] = useState('moderate');
  const [cycleNotes, setCycleNotes] = useState('');

  const [symptomType, setSymptomType] = useState('Hormonal Acne (Jawline)');
  const [severity, setSeverity] = useState('moderate');
  const [onsetDate, setOnsetDate] = useState(new Date().toISOString().split('T')[0]);
  const [symptomNotes, setSymptomNotes] = useState('');

  useEffect(() => {
    loadTracker();
  }, [user]);

  const loadTracker = async () => {
    setLoading(true);
    try {
      const res = await api.getTrackerData(user?.id || 'user-demo-priya');
      if (res) setData(res);
    } catch (e) {
      console.warn('Tracker fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCycle = async (e) => {
    e.preventDefault();
    if (!periodStart || !periodEnd) return;
    try {
      await api.logCycle({
        user_id: user?.id || 'user-demo-priya',
        period_start: periodStart,
        period_end: periodEnd,
        flow,
        cramps_severity: cramps,
        notes: cycleNotes
      });
      setShowCycleModal(false);
      setCycleNotes('');
      loadTracker();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSymptom = async (e) => {
    e.preventDefault();
    if (!symptomType) return;
    try {
      await api.logSymptom({
        user_id: user?.id || 'user-demo-priya',
        symptom_type: symptomType,
        severity,
        onset_date: onsetDate,
        notes: symptomNotes
      });
      setShowSymptomModal(false);
      setSymptomNotes('');
      loadTracker();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await api.deleteRecord(id);
      loadTracker();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAF8] text-xs font-semibold text-[#561D4F] mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#7A3572]" />
            <span>Optional Health Logging</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#350B30]">
            Cycle & Symptom Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#635860] max-w-xl">
            Keep track of your cycle dates, discomfort, and skin/hair changes. Helps you and your doctor observe natural patterns without automated diagnostic judgment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowCycleModal(true)}
            className="px-4 py-2.5 rounded-2xl plum-gradient text-white text-xs font-bold shadow-xs hover:opacity-95 transition-opacity flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Period Dates</span>
          </button>
          <button
            onClick={() => setShowSymptomModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#D8CCE8] hover:bg-[#FAF7F2] text-[#561D4F] text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Symptom</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#EFEAF8] border border-[#D8CCE8] text-xs text-[#561D4F] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#7A3572] shrink-0 mt-0.5" />
        <div>
          <strong className="block font-heading font-semibold text-[#350B30]">
            Privacy & Non-Diagnostic Guarantee:
          </strong>
          {data.metrics?.privacy_notice || "Your cycle records are strictly confidential and optional. FemCare Insight never infers a medical diagnosis from cycle irregularities."}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-3xl border border-white/80">
          <div className="text-xs font-semibold text-[#635860] mb-1">Total Cycles Logged</div>
          <div className="text-2xl font-bold font-heading text-[#350B30]">
            {data.metrics?.total_cycles_logged || 0}
          </div>
          <div className="text-[11px] text-[#958B92] mt-1">Sufficient for doctor review</div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-white/80">
          <div className="text-xs font-semibold text-[#635860] mb-1">Average Cycle Gap</div>
          <div className="text-2xl font-bold font-heading text-[#350B30]">
            {data.metrics?.average_cycle_length_days ? `${data.metrics.average_cycle_length_days} Days` : "Observing..."}
          </div>
          <div className="text-[11px] text-[#958B92] mt-1">Normal interval: 21–35 days</div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-white/80">
          <div className="text-xs font-semibold text-[#635860] mb-1">Logged Symptoms</div>
          <div className="text-2xl font-bold font-heading text-[#350B30]">
            {data.symptoms?.length || 0}
          </div>
          <div className="text-[11px] text-[#958B92] mt-1">Acne, hair shedding, pain</div>
        </div>
      </div>

      {/* TWO COLUMNS: CYCLES TIMELINE & SYMPTOM LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Cycle History Timeline */}
        <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]">
            <h3 className="font-heading font-bold text-base text-[#350B30] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#561D4F]" />
              <span>Cycle Records</span>
            </h3>
            <span className="text-xs text-[#958B92]">{data.cycles?.length || 0} recorded</span>
          </div>

          <div className="space-y-3">
            {data.cycles?.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#958B92]">
                No cycle entries logged yet. Click "Log Period Dates" to start.
              </div>
            ) : (
              data.cycles?.map((c) => (
                <div key={c.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D8CCE8] space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#350B30]">
                        {c.period_start} to {c.period_end}
                      </div>
                      <div className="text-[11px] text-[#635860] mt-0.5">
                        Flow: <span className="capitalize font-semibold text-[#561D4F]">{c.flow}</span> • Cramps: <span className="capitalize font-semibold text-[#561D4F]">{c.cramps_severity}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRecord(c.id)}
                      className="text-[#958B92] hover:text-rose-600 p-1"
                      title="Permanently Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {c.notes && (
                    <p className="text-xs text-[#635860] bg-white p-2.5 rounded-xl border border-[#D8CCE8]">
                      "{c.notes}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Symptoms Log */}
        <div className="glass-panel rounded-3xl p-6 border border-white/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]">
            <h3 className="font-heading font-bold text-base text-[#350B30] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#561D4F]" />
              <span>Symptom Observations</span>
            </h3>
            <span className="text-xs text-[#958B92]">{data.symptoms?.length || 0} recorded</span>
          </div>

          <div className="space-y-3">
            {data.symptoms?.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#958B92]">
                No symptom observations added.
              </div>
            ) : (
              data.symptoms?.map((s) => (
                <div key={s.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D8CCE8] space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#350B30]">{s.symptom_type}</div>
                      <div className="text-[11px] text-[#635860] mt-0.5">
                        Severity: <span className="capitalize font-semibold text-[#561D4F]">{s.severity}</span> • Onset: {s.onset_date}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRecord(s.id)}
                      className="text-[#958B92] hover:text-rose-600 p-1"
                      title="Permanently Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {s.notes && (
                    <p className="text-xs text-[#635860] bg-white p-2.5 rounded-xl border border-[#D8CCE8]">
                      "{s.notes}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* LOG CYCLE MODAL */}
      {showCycleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#D8CCE8] space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#350B30]">Log Period Cycle</h3>
            <form onSubmit={handleAddCycle} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#231B22] mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#231B22] mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Flow</label>
                  <select
                    value={flow}
                    onChange={(e) => setFlow(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs bg-white"
                  >
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Cramps / Pain</label>
                  <select
                    value={cramps}
                    onChange={(e) => setCramps(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs bg-white"
                  >
                    <option value="none">None</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#231B22] mb-1">Personal Notes</label>
                <textarea
                  rows={2}
                  value={cycleNotes}
                  onChange={(e) => setCycleNotes(e.target.value)}
                  placeholder="e.g. Delayed by 15 days, experienced bloating or mood shift"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCycleModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#D8CCE8] text-xs font-semibold text-[#635860] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl plum-gradient text-white text-xs font-bold shadow-xs hover:opacity-95"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG SYMPTOM MODAL */}
      {showSymptomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#D8CCE8] space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#350B30]">Log Symptom</h3>
            <form onSubmit={handleAddSymptom} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#231B22] mb-1">Symptom Type</label>
                <select
                  value={symptomType}
                  onChange={(e) => setSymptomType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs bg-white"
                >
                  <option value="Hormonal Acne (Jawline)">Hormonal Acne (Jawline / Cheeks)</option>
                  <option value="Hair Thinning / Scalp Shedding">Hair Thinning / Scalp Shedding</option>
                  <option value="Unwanted Facial Hair (Hirsutism)">Unwanted Facial Hair (Hirsutism)</option>
                  <option value="Pelvic Discomfort / Bloating">Pelvic Discomfort / Bloating</option>
                  <option value="Sudden Weight Changes">Sudden Weight Changes</option>
                  <option value="Low Energy / Mood Shifts">Low Energy / Mood Shifts</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs bg-white"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Onset Date</label>
                  <input
                    type="date"
                    required
                    value={onsetDate}
                    onChange={(e) => setOnsetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#231B22] mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={symptomNotes}
                  onChange={(e) => setSymptomNotes(e.target.value)}
                  placeholder="Details for your upcoming doctor consultation..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSymptomModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#D8CCE8] text-xs font-semibold text-[#635860] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl plum-gradient text-white text-xs font-bold shadow-xs hover:opacity-95"
                >
                  Save Symptom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
