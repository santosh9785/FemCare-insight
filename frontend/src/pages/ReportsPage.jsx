import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  FileText, 
  Upload, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Stethoscope
} from 'lucide-react';

export const ReportsPage = () => {
  const { user } = useApp();
  const [reports, setReports] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Term Explainer state
  const [activeTerm, setActiveTerm] = useState('follicles');
  const [termExplanation, setTermExplanation] = useState(null);
  const [termLoading, setTermLoading] = useState(false);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('Ultrasound');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    loadReportsData();
    handleExplainTerm('follicles');
  }, [user]);

  const loadReportsData = async () => {
    setLoading(true);
    try {
      const [repRes, refRes] = await Promise.all([
        api.getReports(user?.id || 'user-demo-priya'),
        api.getReferrals(user?.id || 'user-demo-priya')
      ]);
      if (repRes.reports) setReports(repRes.reports);
      if (refRes.referrals) setReferrals(refRes.referrals);
    } catch (e) {
      console.warn('Reports load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleExplainTerm = async (term) => {
    setActiveTerm(term);
    setTermLoading(true);
    try {
      const res = await api.explainTerm(term);
      setTermExplanation(res);
    } catch (e) {
      console.error(e);
    } finally {
      setTermLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!reportTitle) return;
    try {
      await api.uploadReport({
        patient_id: user?.id || 'user-demo-priya',
        report_title: reportTitle,
        report_type: reportType,
        storage_url: `/uploads/${reportTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        summary: `Patient uploaded ${reportType} report for upcoming consultation.`
      });
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadModal(false);
        setReportTitle('');
        loadReportsData();
      }, 1200);
    } catch (e) {
      console.error(e);
    }
  };

  const COMMON_TERMS = [
    { key: 'follicles', label: 'Ovarian Follicles' },
    { key: 'endometrial thickness', label: 'Endometrial Thickness' },
    { key: 'tsh', label: 'Thyroid Stimulating Hormone (TSH)' },
    { key: 'free testosterone', label: 'Free Testosterone' },
    { key: 'lh/fsh ratio', label: 'LH to FSH Ratio' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAF8] text-xs font-semibold text-[#561D4F] mb-1.5">
            <FileText className="w-3.5 h-3.5 text-[#7A3572]" />
            <span>Encrypted Records & Diagnostic Insights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#350B30]">
            Medical Reports & Doctor Referrals
          </h1>
          <p className="text-xs sm:text-sm text-[#635860] max-w-xl">
            Store ultrasound scans, pathology panels, and doctor-issued clinical test orders securely.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-2xl plum-gradient text-white text-xs font-bold shadow-xs hover:opacity-95 transition-opacity flex items-center gap-1.5 self-start md:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Lab Report</span>
        </button>
      </div>

      {/* AI Terminology Explainer Feature (PRD Feature 14) */}
      <div className="bg-white rounded-3xl p-6 border border-[#D8CCE8] soft-shadow space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl plum-gradient text-white flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#F6D6DE]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#350B30]">
                AI Medical Terminology Explainer
              </h3>
              <p className="text-[11px] text-[#635860]">
                Understand complex terms on your ultrasound or blood report in plain language.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-[#7A3572] bg-[#EFEAF8] px-2.5 py-1 rounded-full">
            Educational Guide
          </span>
        </div>

        {/* Term Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {COMMON_TERMS.map((term) => (
            <button
              key={term.key}
              onClick={() => handleExplainTerm(term.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTerm === term.key
                  ? 'bg-[#561D4F] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#635860] hover:text-[#561D4F] border border-[#D8CCE8]'
              }`}
            >
              {term.label}
            </button>
          ))}
        </div>

        {/* Term Explanation Box */}
        {termExplanation && (
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D8CCE8] space-y-2">
            <div className="text-xs font-bold text-[#350B30] capitalize flex items-center gap-1.5">
              <span>Understanding "{termExplanation.term}":</span>
            </div>
            <p className="text-xs text-[#635860] leading-relaxed">
              {termExplanation.general_explanation}
            </p>
            <div className="text-[10px] text-[#958B92] pt-1 border-t border-[#D8CCE8]/50">
              Disclaimer: {termExplanation.disclaimer} Always review values with your doctor.
            </div>
          </div>
        )}
      </div>

      {/* TWO SECTIONS: UPLOADED REPORTS & DOCTOR-ISSUED REFERRALS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Uploaded Reports */}
        <div className="bg-white rounded-3xl p-6 border border-[#D8CCE8] soft-shadow space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]">
            <h3 className="font-heading font-bold text-base text-[#350B30] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#561D4F]" />
              <span>Diagnostic Reports</span>
            </h3>
            <span className="text-xs text-[#958B92]">{reports.length} records</span>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D8CCE8] space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#350B30]">{rep.report_title}</h4>
                    <div className="text-[11px] text-[#635860] mt-0.5">
                      Category: <span className="font-semibold text-[#561D4F]">{rep.report_type}</span> • {rep.uploaded_at?.split(' ')[0]}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Encrypted
                  </span>
                </div>

                <p className="text-xs text-[#635860] bg-white p-2.5 rounded-xl border border-[#D8CCE8]">
                  "{rep.summary}"
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-[#958B92]">Shared with Dr. Ananya Sharma</span>
                  <a
                    href="#download"
                    onClick={(e) => { e.preventDefault(); alert("Demo Report Download Simulation: File verified."); }}
                    className="text-[#561D4F] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Doctor-Generated Referrals / Test Requests (Feature 13) */}
        <div className="bg-white rounded-3xl p-6 border border-[#D8CCE8] soft-shadow space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]">
            <h3 className="font-heading font-bold text-base text-[#350B30] flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#561D4F]" />
              <span>Doctor Test & Referral Orders</span>
            </h3>
            <span className="text-xs text-[#958B92]">{referrals.length} active</span>
          </div>

          <div className="space-y-3">
            {referrals.map((ref) => (
              <div key={ref.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#561D4F]/30 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#561D4F]">{ref.test_name}</h4>
                    <div className="text-[11px] text-[#635860] mt-0.5">
                      Ordered by: <strong>{ref.doctor_name}</strong>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFEAF8] text-[#561D4F]">
                    Order Active
                  </span>
                </div>

                <div className="text-xs text-[#231B22] space-y-1 bg-white p-3 rounded-xl border border-[#D8CCE8]">
                  <div><strong>Clinical Indication:</strong> {ref.clinical_reason}</div>
                  <div><strong>Patient Instructions:</strong> {ref.instructions}</div>
                </div>

                <div className="pt-1 text-[10px] text-[#958B92] flex items-center justify-between">
                  <span>Issued for diagnostic center review</span>
                  <button
                    onClick={() => alert("Digital Referral Order Downloaded (Demo). Present at laboratory.")}
                    className="text-[#561D4F] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Referral Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#D8CCE8] space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#350B30]">Upload Diagnostic Report</h3>

            {uploadSuccess ? (
              <div className="text-center py-6 space-y-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>Report Encrypted & Stored Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Report Title</label>
                  <input
                    type="text"
                    required
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="e.g. Pelvic Ultrasound Scan (USG)"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs focus:border-[#561D4F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CCE8] text-xs bg-white"
                  >
                    <option value="Ultrasound">Ultrasound / Sonography</option>
                    <option value="Pathology">Pathology / Blood Hormone Panel</option>
                    <option value="Thyroid">Thyroid Profile (TSH)</option>
                    <option value="General">Other Clinical Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#231B22] mb-1">Simulated File Upload</label>
                  <div className="border-2 border-dashed border-[#D8CCE8] p-4 rounded-xl text-center text-xs text-[#958B92]">
                    <Upload className="w-5 h-5 mx-auto mb-1 text-[#561D4F]" />
                    <span>Select PDF or Image (Synthetic file simulated)</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#D8CCE8] text-xs font-semibold text-[#635860]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl plum-gradient text-white text-xs font-bold shadow-xs hover:opacity-95"
                  >
                    Upload Report
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
