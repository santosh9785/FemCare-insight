import React, { useState } from 'react';
import { 
  Pill, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Truck, 
  Clock, 
  FileText,
  CreditCard
} from 'lucide-react';

export const MedicinePage = () => {
  const [orderStep, setOrderStep] = useState(1);

  const PRESCRIBED_ITEMS = [
    {
      id: 1,
      name: "Myo-Inositol & D-Chiro Inositol (40:1 Ratio) + Folate",
      dosage: "1 sachet daily in water",
      purpose: "Nutritional support for insulin sensitivity and ovulatory regularity",
      prescribedBy: "Dr. Ananya Sharma, MD (OB-GYN)",
      price: 680
    },
    {
      id: 2,
      name: "Vitamin D3 60,000 IU (Oral Chewable)",
      dosage: "1 tablet weekly for 8 weeks",
      purpose: "Correction of vitamin D deficiency associated with metabolic health",
      prescribedBy: "Dr. Ananya Sharma, MD (OB-GYN)",
      price: 240
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAF8] text-xs font-semibold text-[#561D4F] mb-1.5">
          <Pill className="w-3.5 h-3.5 text-[#7A3572]" />
          <span>Feature 15: Prescription-Based Fulfillment Prototype</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#350B30]">
          Prescription Supplements & Pharmacy Pathway
        </h1>
        <p className="text-xs sm:text-sm text-[#635860] max-w-xl">
          Visual prototype of post-consultation medicine delivery. Requires authorized clinical prescription verification.
        </p>
      </div>

      {/* Safety Notice per PRD */}
      <div className="p-4 bg-[#EFEAF8] rounded-2xl border border-[#D8CCE8] text-xs text-[#561D4F] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#7A3572] shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Strict Regulatory Safety Framework:</strong>
          FemCare Insight AI never prescribes medications. Medicines and clinical supplements may only be fulfilled following an authenticated consultation with a licensed doctor.
        </div>
      </div>

      {/* TWO COLUMNS: PRESCRIBED MEDICINES & ORDER PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Prescriptions from Dr. Ananya */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#D8CCE8] soft-shadow space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]">
            <h3 className="font-heading font-bold text-base text-[#350B30] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#561D4F]" />
              <span>Doctor-Issued Clinical Prescription</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified by Dr. Ananya Sharma
            </span>
          </div>

          <div className="space-y-3">
            {PRESCRIBED_ITEMS.map((item) => (
              <div key={item.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D8CCE8] space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#350B30]">{item.name}</h4>
                    <div className="text-[11px] text-[#561D4F] font-semibold mt-0.5">
                      Instructions: {item.dosage}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#350B30]">₹{item.price}</span>
                </div>

                <div className="text-[11px] text-[#635860] bg-white p-2.5 rounded-xl border border-[#D8CCE8]">
                  Clinical Purpose: {item.purpose}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#FAF7F2] flex items-center justify-between">
            <span className="text-xs text-[#635860]">Estimated Total (Demo):</span>
            <span className="text-base font-bold text-[#350B30]">₹920</span>
          </div>
        </div>

        {/* Right: Simulated Fulfillment Pipeline */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#D8CCE8] soft-shadow space-y-5">
          <div className="pb-3 border-b border-[#FAF7F2]">
            <h3 className="font-heading font-bold text-base text-[#350B30] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#561D4F]" />
              <span>Fulfillment Status Pipeline</span>
            </h3>
            <span className="text-[11px] text-[#958B92]">Demonstration workflow</span>
          </div>

          {/* Stepper */}
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <strong className="block text-[#350B30]">1. Clinical Prescription Issued</strong>
                <span className="text-[#635860]">Doctor reviewed cycle logs and authorized nutrition regimen.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <strong className="block text-[#350B30]">2. Licensed Pharmacy Availability Confirmed</strong>
                <span className="text-[#635860]">Partner fulfillment inventory checked.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#561D4F] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 animate-pulse">
                3
              </div>
              <div>
                <strong className="block text-[#561D4F]">3. Ready for Patient Confirmation</strong>
                <span className="text-[#635860]">Select delivery address and payment option.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 opacity-60">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                4
              </div>
              <div>
                <strong className="block text-gray-700">4. Processing & Discrete Dispatch</strong>
                <span className="text-gray-500">Tamper-evident, non-descript packaging.</span>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => alert("Demo Order Submitted! Discrete delivery dispatched to registered address (Demo).")}
              className="w-full py-3 rounded-xl plum-gradient text-white text-xs font-bold shadow-xs hover:opacity-95"
            >
              Confirm Delivery Request (Demo)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
