import React, { useState } from 'react';
import { DutyItem, FacultyMember } from '../types';
import { Search, Calendar, RefreshCw, CheckCircle2, User, FileText, ArrowUpDown, BellRing } from 'lucide-react';
import { DATE_ORDER_MAP } from '../data/duties';
import { SyncedCalendarEvent } from '../services/googleCalendar';

interface MasterTableProps {
  duties: DutyItem[];
  facultyList: FacultyMember[];
  syncedEvents: Record<string, SyncedCalendarEvent>;
  onToggleAcknowledge: (dutyId: string) => void;
  onRequestSwap: (duty: DutyItem) => void;
  onSelectFacultyByName: (name: string) => void;
  onAddDutiesToCalendar: (duties: DutyItem[], facultyLabel: string) => void;
  onRemoveDutyFromCalendar: (duty: DutyItem) => void;
}

export const MasterTable: React.FC<MasterTableProps> = ({
  duties,
  facultyList,
  syncedEvents,
  onToggleAcknowledge,
  onRequestSwap,
  onSelectFacultyByName,
  onAddDutiesToCalendar,
  onRemoveDutyFromCalendar,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState<'ALL' | 'Morning' | 'Afternoon'>('ALL');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'faculty'>('date');

  // Extract unique dates in chronological order
  const uniqueDates = Array.from(new Set<string>(duties.map(d => d.date))).sort(
    (a, b) => (DATE_ORDER_MAP[a] ?? 999) - (DATE_ORDER_MAP[b] ?? 999)
  );

  const filteredDuties = duties
    .filter(d => {
      const matchesSearch =
        d.invigilator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.slotCode && d.slotCode.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesShift = shiftFilter === 'ALL' || d.shift === shiftFilter;
      const matchesDate = selectedDateFilter === 'ALL' || d.date === selectedDateFilter;
      return matchesSearch && matchesShift && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === 'faculty') {
        return a.invigilator.localeCompare(b.invigilator);
      }
      const dateDiff = (DATE_ORDER_MAP[a.date] ?? 999) - (DATE_ORDER_MAP[b.date] ?? 999);
      if (dateDiff !== 0) return dateDiff;
      if (a.shift !== b.shift) return a.shift === 'Morning' ? -1 : 1;
      return a.invigilator.localeCompare(b.invigilator);
    });

  const morningCount = duties.filter(d => d.shift === 'Morning').length;
  const afternoonCount = duties.filter(d => d.shift === 'Afternoon').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden mb-8">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white p-6 border-b border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Master Invigilation Duty Timetable</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Government College of Engineering Amravati • ESE Winter-2026 Complete Master Duty Roster (O.N. W-26/443Me)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800 text-xs px-3 py-1.5 rounded-xl border border-slate-700 text-amber-300 font-semibold flex items-center gap-2">
              <span>Total Duties: <strong className="text-white font-bold">{duties.length}</strong></span>
              <span>•</span>
              <span className="text-amber-400">☀️ Morning: {morningCount}</span>
              <span>•</span>
              <span className="text-indigo-400">🌙 Afternoon: {afternoonCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 text-xs">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculty name or date..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Shift Filter */}
          <div className="md:col-span-3">
            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value as any)}
              className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">All Shifts (Morning & Afternoon)</option>
              <option value="Morning">Morning Shift (11:00 AM - 1:30 PM)</option>
              <option value="Afternoon">Afternoon Shift (2:30 PM - 5:00 PM)</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">All Exam Dates</option>
              {uniqueDates.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Sort Option */}
          <div className="md:col-span-2">
            <button
              onClick={() => setSortBy(sortBy === 'date' ? 'faculty' : 'date')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium rounded-xl px-3 py-2 border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort: {sortBy === 'date' ? 'By Date' : 'By Faculty'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="p-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span>Showing <strong>{filteredDuties.length}</strong> of {duties.length} scheduled duties</span>
          {(searchTerm || shiftFilter !== 'ALL' || selectedDateFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setShiftFilter('ALL');
                setSelectedDateFilter('ALL');
              }}
              className="text-amber-700 font-semibold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredDuties.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">Faculty / Invigilator Name</th>
                  <th className="p-3.5">Exam Date</th>
                  <th className="p-3.5">Shift & Time Slot</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDuties.map((duty, idx) => {
                  const isMorning = duty.shift === 'Morning';
                  const isAck = duty.status === 'Acknowledged';
                  const isOwner = duty.invigilator.includes("Thakur");

                  return (
                    <tr key={duty.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => onSelectFacultyByName(duty.invigilator)}
                          className="font-bold text-slate-900 hover:text-amber-700 transition flex items-center gap-1.5 cursor-pointer text-left"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{duty.invigilator}</span>
                          {isOwner && (
                            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-bold border border-amber-300">
                              App Owner
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>{duty.date}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            isMorning ? 'bg-amber-100 text-amber-900' : 'bg-indigo-100 text-indigo-900'
                          }`}>
                            {duty.shift}
                          </span>
                          <span className="text-slate-600 font-medium">{duty.timing}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => onToggleAcknowledge(duty.id)}
                          className={`px-2.5 py-1 rounded-md font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition ${
                            isAck
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                          }`}
                        >
                          <CheckCircle2 className={`w-3 h-3 ${isAck ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>{isAck ? 'Confirmed' : 'Pending'}</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {syncedEvents[duty.id] ? (
                            <button
                              type="button"
                              onClick={() => onRemoveDutyFromCalendar(duty)}
                              className="bg-emerald-50 hover:bg-rose-50 text-emerald-800 hover:text-rose-700 text-xs px-2.5 py-1 rounded-lg font-semibold transition border border-emerald-300 hover:border-rose-300 inline-flex items-center gap-1 cursor-pointer"
                              title="Synced with Google Calendar popup alert (click to remove)"
                            >
                              <BellRing className="w-3 h-3" />
                              <span>Alert Set</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onAddDutiesToCalendar([duty], duty.invigilator)}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-lg font-semibold transition border border-blue-200 inline-flex items-center gap-1 cursor-pointer"
                              title="Add to Google Calendar with popup notification"
                            >
                              <BellRing className="w-3 h-3 text-blue-600" />
                              <span>Alert</span>
                            </button>
                          )}
                          <button
                            onClick={() => onRequestSwap(duty)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-semibold transition border border-slate-300 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3 text-slate-500" />
                            <span>Swap</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            No duties found matching the applied filters.
          </div>
        )}
      </div>
    </div>
  );
};
