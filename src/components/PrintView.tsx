import React from 'react';
import { DutyItem, FacultyMember } from '../types';
import { GENERAL_INSTRUCTIONS, OFFICIAL_INFO } from '../data/duties';
import { Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PrintViewProps {
  duties: DutyItem[];
  selectedFaculty: FacultyMember | null;
  onClose: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({
  duties,
  selectedFaculty,
  onClose,
}) => {
  // If selectedFaculty is provided, print faculty specific duties; otherwise print master table
  const printDuties = selectedFaculty
    ? duties.filter(d => d.invigilator.toLowerCase() === selectedFaculty.name.toLowerCase())
    : duties;

  const handleSystemPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 overflow-y-auto p-2 sm:p-6 flex flex-col items-center">
      {/* Non-printable Control Toolbar */}
      <div className="print:hidden bg-slate-900 border border-amber-500/40 rounded-2xl p-4 mb-6 max-w-4xl w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-2xl">
        <div>
          <h3 className="font-serif font-bold text-amber-200 text-lg">
            {selectedFaculty ? `Faculty Duty Slip: ${selectedFaculty.name}` : 'Master Invigilation Duty Schedule (All Faculty)'}
          </h3>
          <p className="text-xs text-slate-300">
            Formatted A4 Print Preview • Government College of Engineering Amravati
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSystemPrint}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer transition active:scale-95"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <X className="w-4 h-4" />
            <span>Close Preview</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="bg-white text-slate-950 p-8 sm:p-12 rounded-xl shadow-2xl max-w-4xl w-full border border-slate-300 print:border-none print:shadow-none print:p-0 print:w-full font-serif">
        
        {/* Official College Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-widest mb-1">
            <span>Official Government Document</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {OFFICIAL_INFO.institution}
          </h1>
          <h2 className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
            {OFFICIAL_INFO.subTitle}
          </h2>
          <div className="mt-3 inline-block bg-slate-100 border border-slate-300 rounded-md px-4 py-1 text-xs font-bold text-slate-900 uppercase tracking-wide">
            {OFFICIAL_INFO.term} • ACADEMIC YEAR {OFFICIAL_INFO.academicYear}
          </div>
        </div>

        {/* Document Title & Reference Code */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div>
            <span className="text-slate-500 block">Office Order No.:</span>
            <strong className="text-slate-900">O.N.: {OFFICIAL_INFO.orderNumber}</strong>
          </div>
          <div className="mt-2 sm:mt-0 text-right">
            <span className="text-slate-500 block">Issue Date:</span>
            <strong className="text-slate-900">{OFFICIAL_INFO.orderDate}</strong>
          </div>
        </div>

        {/* Individual Faculty Info if selected */}
        {selectedFaculty && (
          <div className="mb-6 p-4 bg-amber-50/60 border border-amber-300 rounded-lg text-xs space-y-1">
            <div className="text-sm font-bold text-amber-950">{selectedFaculty.name}</div>
            <div className="text-slate-700">{selectedFaculty.title}</div>
            <div className="text-slate-600">Total Invigilation Duties Assigned: <strong>{printDuties.length} Slots</strong></div>
          </div>
        )}

        {/* Duty Roster Table */}
        <div className="mb-8">
          <table className="w-full text-left text-xs border-collapse border border-slate-800">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-800">
                <th className="p-2 border border-slate-800">Sr. No.</th>
                {!selectedFaculty && <th className="p-2 border border-slate-800">Invigilator Name</th>}
                <th className="p-2 border border-slate-800">Date of Exam</th>
                <th className="p-2 border border-slate-800">Shift</th>
                <th className="p-2 border border-slate-800">Exam Timing</th>
                <th className="p-2 border border-slate-800 text-center">Invigilator Sign</th>
              </tr>
            </thead>
            <tbody>
              {printDuties.map((duty, index) => (
                <tr key={duty.id} className="border-b border-slate-800">
                  <td className="p-2 border border-slate-800 text-center font-bold">{index + 1}</td>
                  {!selectedFaculty && (
                    <td className="p-2 border border-slate-800 font-semibold text-slate-900">
                      {duty.invigilator}
                    </td>
                  )}
                  <td className="p-2 border border-slate-800 font-medium">{duty.date}</td>
                  <td className="p-2 border border-slate-800">{duty.shift}</td>
                  <td className="p-2 border border-slate-800">{duty.timing}</td>
                  <td className="p-2 border border-slate-800 text-center min-w-[100px]"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instructions */}
        <div className="mb-10 text-[11px] text-slate-800 space-y-1.5 border-t border-slate-300 pt-4">
          <p className="font-bold text-slate-900">Important Instructions to Invigilators:</p>
          <ol className="list-decimal pl-5 space-y-0.5 text-slate-700">
            {GENERAL_INSTRUCTIONS.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ol>
        </div>

        {/* Signatures Block */}
        <div className="mt-12 pt-6 border-t-2 border-slate-900 grid grid-cols-4 gap-3 text-center text-xs">
          <div className="flex flex-col justify-end h-24">
            <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
              Dr. K. S. Wasankar
            </div>
            <div className="text-[10px] text-slate-600">Exam In-Charge</div>
          </div>

          <div className="flex flex-col justify-end h-24">
            <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
              Dr. S. D. Londhe
            </div>
            <div className="text-[10px] text-slate-600">Co-Coordinator Exam</div>
          </div>

          <div className="flex flex-col justify-end h-24">
            <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
              Dr. V. R. Raut
            </div>
            <div className="text-[10px] text-slate-600">Co-Coordinator Exam</div>
          </div>

          <div className="flex flex-col justify-end h-24">
            <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
              {OFFICIAL_INFO.owner.name}
            </div>
            <div className="text-[10px] text-slate-600">Principal, Govt. COE Amravati</div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
          <span>Government College of Engineering Amravati • {OFFICIAL_INFO.term} • Date: {OFFICIAL_INFO.orderDate}</span>
          <span>Certified Confidential Roster</span>
        </div>
      </div>
    </div>
  );
};
