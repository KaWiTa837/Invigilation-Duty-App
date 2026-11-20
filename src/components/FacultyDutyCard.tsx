import React from 'react';
import { DutyItem, FacultyMember } from '../types';
import { GENERAL_INSTRUCTIONS, OFFICIAL_INFO } from '../data/duties';
import { SyncedCalendarEvent } from '../services/googleCalendar';
import { Calendar, Clock, CheckCircle2, RefreshCw, Printer, AlertCircle, Award, ShieldCheck, BellRing, Trash2 } from 'lucide-react';

interface FacultyDutyCardProps {
  faculty: FacultyMember;
  duties: DutyItem[];
  syncedEvents: Record<string, SyncedCalendarEvent>;
  onToggleAcknowledge: (dutyId: string) => void;
  onRequestSwap: (duty: DutyItem) => void;
  onPrintFacultySlip: (faculty: FacultyMember) => void;
  onAddDutiesToCalendar: (duties: DutyItem[], facultyLabel: string) => void;
  onRemoveDutyFromCalendar: (duty: DutyItem) => void;
}

export const FacultyDutyCard: React.FC<FacultyDutyCardProps> = ({
  faculty,
  duties,
  syncedEvents,
  onToggleAcknowledge,
  onRequestSwap,
  onPrintFacultySlip,
  onAddDutiesToCalendar,
  onRemoveDutyFromCalendar,
}) => {
  const isOwner = faculty.name.includes("Thakur");
  const unsyncedCount = duties.filter(d => !syncedEvents[d.id]).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden mb-8 transition-all">
      {/* Top Card Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative">
        <div className="absolute top-0 right-0 w-64 h-full bg-amber-500/10 clip-path-polygon pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 flex-shrink-0 shadow-lg">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-serif font-bold text-xl text-amber-300">
                {faculty.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-serif font-bold text-amber-100">{faculty.name}</h3>
                {isOwner && (
                  <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Award className="w-3 h-3" /> App Owner
                  </span>
                )}
              </div>

              <p className="text-xs text-amber-300 font-medium mt-1">
                {faculty.title}
              </p>

              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> GCOEA • {faculty.category}
                </span>
                <span>•</span>
                <span>Session: {OFFICIAL_INFO.term}</span>
              </div>
            </div>
          </div>

          {/* Duties Count Stat */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 text-center min-w-[110px]">
              <span className="text-xs text-slate-400 block uppercase font-medium">Assigned Duties</span>
              <span className="text-2xl font-serif font-bold text-amber-400">{duties.length}</span>
              <span className="text-[10px] text-slate-400 block">{OFFICIAL_INFO.term}</span>
            </div>

            {duties.length > 0 && (
              <button
                type="button"
                onClick={() => onAddDutiesToCalendar(duties, faculty.name)}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-lg cursor-pointer active:scale-95"
                title="Add all duties for this faculty to Google Calendar with popup reminders"
              >
                <BellRing className="w-4 h-4 text-slate-950" />
                <span>
                  {unsyncedCount === 0
                    ? 'All Alerts Set in Calendar ✓'
                    : `Add ${unsyncedCount} to Google Calendar`}
                </span>
              </button>
            )}

            <button
              onClick={() => onPrintFacultySlip(faculty)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-lg cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Print Faculty Duty Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Duty Table Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Invigilation Schedule Roster ({duties.length} Slots)</span>
          </h4>
          <span className="text-xs text-slate-500">
            Timings: Morning (11:00 AM - 1:30 PM) | Afternoon (2:30 PM - 5:00 PM)
          </span>
        </div>

        {duties.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">Exam Date</th>
                  <th className="p-3.5">Shift</th>
                  <th className="p-3.5">Timing</th>
                  <th className="p-3.5">Status & Action</th>
                  <th className="p-3.5">Google Calendar Alert</th>
                  <th className="p-3.5 text-right">Relief / Swap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {duties.map((duty, idx) => {
                  const isMorning = duty.shift === 'Morning';
                  const isAck = duty.status === 'Acknowledged';
                  const synced = syncedEvents[duty.id];

                  return (
                    <tr key={duty.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-3.5 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3.5 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>{duty.date}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isMorning
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                        }`}>
                          {isMorning ? '☀️ Morning' : '🌙 Afternoon'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{duty.timing}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => onToggleAcknowledge(duty.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                            isAck
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isAck ? 'text-emerald-600' : 'text-amber-600'}`} />
                          <span>{isAck ? 'Acknowledged' : 'Click to Acknowledge'}</span>
                        </button>
                      </td>
                      <td className="p-3.5">
                        {synced ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-[11px]">
                              <BellRing className="w-3 h-3 text-emerald-600" />
                              <span>Popup Alert Set</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => onRemoveDutyFromCalendar(duty)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition cursor-pointer"
                              title="Remove from Google Calendar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onAddDutiesToCalendar([duty], faculty.name)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold text-[11px] transition cursor-pointer"
                          >
                            <BellRing className="w-3 h-3 text-blue-600" />
                            <span>Add Popup Alert</span>
                          </button>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onRequestSwap(duty)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold px-2.5 py-1 rounded-lg text-xs transition border border-slate-300 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3 text-slate-500" />
                          <span>Swap Duty</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            No invigilation duty records found for this faculty member.
          </div>
        )}

        {/* Instructions for Faculty */}
        <div className="mt-6 bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-2">
          <div className="font-bold text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Important Guidelines for Invigilators ({OFFICIAL_INFO.term}):</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            {GENERAL_INSTRUCTIONS.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
