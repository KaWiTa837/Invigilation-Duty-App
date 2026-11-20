import React from 'react';
import { DutyItem, FacultyMember } from '../types';
import { OFFICIAL_INFO } from '../data/duties';
import { BarChart2, Users, Calendar, Sun, Moon, Award, TrendingUp, ShieldCheck } from 'lucide-react';

interface StatsOverviewProps {
  duties: DutyItem[];
  facultyList: FacultyMember[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  duties,
  facultyList,
}) => {
  const totalDuties = duties.length;
  const morningDuties = duties.filter(d => d.shift === 'Morning').length;
  const afternoonDuties = duties.filter(d => d.shift === 'Afternoon').length;

  // Compute top invigilators
  const facultyDutyCounts: { [name: string]: number } = {};
  duties.forEach(d => {
    facultyDutyCounts[d.invigilator] = (facultyDutyCounts[d.invigilator] || 0) + 1;
  });

  const sortedFacultyByDuty = Object.entries(facultyDutyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Compute duties per date
  const dateDutyCounts: { [date: string]: number } = {};
  duties.forEach(d => {
    dateDutyCounts[d.date] = (dateDutyCounts[d.date] || 0) + 1;
  });

  const sortedDatesByDuty = Object.entries(dateDutyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8">
      <div className="flex items-center justify-between pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-600" />
            <span>Invigilation Duty Workload Statistics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Analytics breakdown for {OFFICIAL_INFO.term} Examination (O.N. {OFFICIAL_INFO.orderNumber}) at Government College of Engineering Amravati
          </p>
        </div>

        <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-bold flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>Principal: {OFFICIAL_INFO.owner.name} • Exam In-Charge: Dr. K. S. Wasankar • Co-Coordinator Exam: Dr. S. D. Londhe &amp; Dr. V. R. Raut</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
            <span>Total Faculty Members</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-amber-300">{facultyList.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Registered Invigilators</p>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
            <span>Total Exam Duties</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-amber-300">{totalDuties}</div>
          <p className="text-[11px] text-slate-400 mt-1">Total Scheduled Slots</p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-amber-900 text-xs mb-2 font-bold">
            <span>Morning Shift Duties</span>
            <Sun className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-amber-950">{morningDuties}</div>
          <p className="text-[11px] text-amber-800 mt-1">11:00 AM - 1:30 PM ({Math.round((morningDuties/totalDuties)*100)}%)</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-indigo-900 text-xs mb-2 font-bold">
            <span>Afternoon Shift Duties</span>
            <Moon className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-indigo-950">{afternoonDuties}</div>
          <p className="text-[11px] text-indigo-800 mt-1">2:30 PM - 5:00 PM ({Math.round((afternoonDuties/totalDuties)*100)}%)</p>
        </div>
      </div>

      {/* Top Invigilators & Peak Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Top Duty Allocations */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Faculty Workload (Top Assigned Duties)</span>
          </h3>
          <div className="space-y-2 text-xs">
            {sortedFacultyByDuty.map(([name, count], i) => (
              <div key={name} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-300 font-bold text-[10px] flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-slate-900">{name}</span>
                </div>
                <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  {count} Duties
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Exam Days */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Peak Invigilation Dates (Highest Capacity)</span>
          </h3>
          <div className="space-y-2 text-xs">
            {sortedDatesByDuty.map(([date, count], i) => (
              <div key={date} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-100 text-amber-900 rounded-lg font-bold text-[10px]">
                    {date.split(" ")[0]}
                  </span>
                  <span className="font-semibold text-slate-800">{date}</span>
                </div>
                <span className="bg-slate-900 text-amber-300 font-bold px-2.5 py-0.5 rounded-full">
                  {count} Slots
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
