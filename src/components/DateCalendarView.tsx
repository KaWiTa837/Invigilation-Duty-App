import React, { useState } from 'react';
import { DutyItem } from '../types';
import { Calendar, Sun, Moon, Users, ChevronRight, Filter, Search, Award } from 'lucide-react';

import { DATE_ORDER_MAP, OFFICIAL_INFO, SHIFT_STUDENT_COUNTS } from '../data/duties';

interface DateCalendarViewProps {
  duties: DutyItem[];
  onSelectFacultyByName: (name: string) => void;
}

export const DateCalendarView: React.FC<DateCalendarViewProps> = ({
  duties,
  onSelectFacultyByName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<'ALL' | 'November' | 'December'>('ALL');

  // Group duties by unique date
  const dateMap: { [date: string]: { morning: DutyItem[]; afternoon: DutyItem[] } } = {};

  duties.forEach(duty => {
    if (!dateMap[duty.date]) {
      dateMap[duty.date] = { morning: [], afternoon: [] };
    }
    if (duty.shift === 'Morning') {
      dateMap[duty.date].morning.push(duty);
    } else {
      dateMap[duty.date].afternoon.push(duty);
    }
  });

  const datesList = Object.keys(dateMap).sort(
    (a, b) => (DATE_ORDER_MAP[a] ?? 999) - (DATE_ORDER_MAP[b] ?? 999)
  );

  const filteredDates = datesList.filter(date => {
    const matchesMonth =
      selectedMonth === 'ALL' ||
      (selectedMonth === 'November' && date.toLowerCase().includes('november')) ||
      (selectedMonth === 'December' && date.toLowerCase().includes('december'));

    if (!matchesMonth) return false;

    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const morningMatch = dateMap[date].morning.some(d => d.invigilator.toLowerCase().includes(searchLower));
    const afternoonMatch = dateMap[date].afternoon.some(d => d.invigilator.toLowerCase().includes(searchLower));
    const dateMatch = date.toLowerCase().includes(searchLower);

    return morningMatch || afternoonMatch || dateMatch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <span>Day-wise Exam Duty Schedule Grid</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse {OFFICIAL_INFO.term} invigilation assignments grouped by date, shift, and student count.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative text-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculty in dates..."
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedMonth('ALL')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                selectedMonth === 'ALL' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Dates ({datesList.length})
            </button>
            <button
              onClick={() => setSelectedMonth('November')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                selectedMonth === 'November' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              November 2026
            </button>
            <button
              onClick={() => setSelectedMonth('December')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                selectedMonth === 'December' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              December 2026
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Dates */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDates.map((date) => {
          const { morning, afternoon } = dateMap[date];
          const totalOnDay = morning.length + afternoon.length;

          return (
            <div
              key={date}
              className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200 hover:border-amber-400/60 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Date Header Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-amber-100 text-amber-900 rounded-xl font-bold font-serif text-sm border border-amber-300">
                      {date.split(" ")[0]}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{date}</h3>
                      <span className="text-[11px] text-slate-500 font-medium">{OFFICIAL_INFO.term}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-900 text-amber-300 px-2.5 py-1 rounded-full font-bold">
                    {totalOnDay} Invigilators
                  </span>
                </div>

                {/* Shifts Split */}
                <div className="mt-4 space-y-4 text-xs">
                  {/* Morning Shift */}
                  <div>
                    <div className="flex items-center justify-between text-amber-900 font-bold bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300/60 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-600" /> Morning Shift
                      </span>
                      <span className="text-[10px] font-medium text-amber-800">
                        11:00 AM - 1:30 PM{SHIFT_STUDENT_COUNTS[`${date}|Morning`] !== undefined ? ` • ${SHIFT_STUDENT_COUNTS[`${date}|Morning`]} Students` : ''}
                      </span>
                    </div>

                    {morning.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pl-1">
                        {morning.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => onSelectFacultyByName(d.invigilator)}
                            className="bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-slate-200 hover:border-amber-300 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <span>{d.invigilator}</span>
                            {d.invigilator.includes("Thakur") && (
                              <Award className="w-3 h-3 text-amber-600 inline" />
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic pl-1">No morning duties</span>
                    )}
                  </div>

                  {/* Afternoon Shift */}
                  <div>
                    <div className="flex items-center justify-between text-indigo-900 font-bold bg-indigo-100/80 px-2.5 py-1 rounded-lg border border-indigo-300/60 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-indigo-600" /> Afternoon Shift
                      </span>
                      <span className="text-[10px] font-medium text-indigo-800">
                        2:30 PM - 5:00 PM{SHIFT_STUDENT_COUNTS[`${date}|Afternoon`] !== undefined ? ` • ${SHIFT_STUDENT_COUNTS[`${date}|Afternoon`]} Students` : ''}
                      </span>
                    </div>

                    {afternoon.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pl-1">
                        {afternoon.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => onSelectFacultyByName(d.invigilator)}
                            className="bg-white hover:bg-indigo-50 text-slate-800 hover:text-indigo-900 border border-slate-200 hover:border-indigo-300 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <span>{d.invigilator}</span>
                            {d.invigilator.includes("Thakur") && (
                              <Award className="w-3 h-3 text-amber-600 inline" />
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic pl-1">No afternoon duties</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-400 text-right">
                Government College of Engineering Amravati
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
