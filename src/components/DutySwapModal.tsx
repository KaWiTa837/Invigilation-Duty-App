import React, { useState } from 'react';
import { DutyItem, DutySwapRequest, FacultyMember } from '../types';
import { OFFICIAL_INFO } from '../data/duties';
import { RefreshCw, UserCheck, CheckCircle2, Clock, X, AlertCircle, FileText, Send } from 'lucide-react';

interface DutySwapModalProps {
  duty: DutyItem | null;
  facultyList: FacultyMember[];
  onClose: () => void;
  onSubmitSwap: (request: Omit<DutySwapRequest, 'id' | 'timestamp' | 'status'>) => void;
  swapRequests: DutySwapRequest[];
}

export const DutySwapModal: React.FC<DutySwapModalProps> = ({
  duty,
  facultyList,
  onClose,
  onSubmitSwap,
  swapRequests,
}) => {
  const [substitute, setSubstitute] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!duty) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!substitute || !reason) return;

    onSubmitSwap({
      originalDutyId: duty.id,
      facultyName: duty.invigilator,
      date: duty.date,
      shift: duty.shift,
      requestedSubstitute: substitute,
      reason,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl relative text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl border border-amber-300">
            <RefreshCw className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900">Invigilation Duty Relief / Swap Application</h3>
            <p className="text-xs text-slate-500">Government College of Engineering Amravati • {OFFICIAL_INFO.term}</p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Duty Swap Request Submitted!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your request has been forwarded to Exam In-Charge Dr. K. S. Wasankar and Co-Coordinators Exam Dr. S. D. Londhe &amp; Dr. V. R. Raut for approval.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {/* Assigned Duty Details Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Faculty Name:</span>
                <strong className="text-slate-900 font-bold">{duty.invigilator}</strong>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Assigned Date & Shift:</span>
                <span className="text-amber-900 font-semibold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  {duty.date} ({duty.shift} - {duty.timing})
                </span>
              </div>
            </div>

            {/* Requested Substitute */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Select Substitute Faculty Member: <span className="text-rose-500">*</span>
              </label>
              <select
                value={substitute}
                onChange={(e) => setSubstitute(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">-- Choose faculty who agreed to swap --</option>
                {facultyList
                  .filter(f => f.name !== duty.invigilator)
                  .map(f => (
                    <option key={f.id} value={f.name}>
                      {f.name} ({f.title})
                    </option>
                  ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Reason for Relief / Swap: <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Specify official reason (e.g. Valuation duty, University meeting, Medical emergency)..."
                required
                rows={3}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* In-Charge Approval Notice */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-slate-700 text-[11px] space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" /> Note on Approval:
              </span>
              <p>
                Duty swap is subject to final approval by Exam In-Charge <strong>Dr. K. S. Wasankar</strong> &amp; Co-Coordinators Exam <strong>Dr. S. D. Londhe</strong> and <strong>Dr. V. R. Raut</strong> under the authority of Principal <strong>Dr. Ashish M. Mahalle</strong>. Note: Expert Faculties are not allowed as alternatives for Examination duties.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-slate-950" />
                <span>Submit Swap Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
