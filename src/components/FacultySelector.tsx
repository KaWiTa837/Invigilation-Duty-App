import React, { useState } from 'react';
import { FacultyMember } from '../types';
import { Search, UserCheck, ChevronDown, Sparkles, Filter, Award, CheckCircle } from 'lucide-react';

interface FacultySelectorProps {
  facultyList: FacultyMember[];
  selectedFaculty: FacultyMember | null;
  onSelectFaculty: (faculty: FacultyMember) => void;
}

export const FacultySelector: React.FC<FacultySelectorProps> = ({
  facultyList,
  selectedFaculty,
  onSelectFaculty,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredFaculty = facultyList.filter(f => {
    return f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.title && f.title.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <UserCheck className="w-5 h-5 text-amber-700" />
            </span>
            <h2 className="text-lg font-serif font-bold text-slate-900">
              Select Faculty Member / Invigilator
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Choose any faculty member from the dropdown menu to inspect their personalized ESE Winter-2026 invigilation duties, timing, and printable duty slip.
          </p>
        </div>

        {/* Quick select owner Dr. Kawita D. Thakur shortcut */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const thakur = facultyList.find(f => f.name.includes("Thakur"));
              if (thakur) onSelectFaculty(thakur);
            }}
            className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Dr. Kawita D. Thakur (App Owner)</span>
          </button>
        </div>
      </div>

      {/* Dropdown Search Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-4 py-3 text-left font-medium text-slate-800 flex items-center justify-between cursor-pointer transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              {selectedFaculty ? (
                <div>
                  <span className="font-semibold text-slate-900">{selectedFaculty.name}</span>
                  <span className="text-xs text-slate-500 ml-2 font-normal">
                    ({selectedFaculty.totalDuties} Duties Assigned)
                  </span>
                </div>
              ) : (
                <span className="text-slate-500">Search or select an invigilator from dropdown...</span>
              )}
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Expanded Dropdown Options */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-30 overflow-hidden max-h-80 flex flex-col animate-fade-in">
              <div className="p-3 bg-slate-50 border-b border-slate-200">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Type faculty name..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>
              </div>

              <div className="overflow-y-auto divide-y divide-slate-100 p-1">
                {filteredFaculty.length > 0 ? (
                  filteredFaculty.map((f) => {
                    const isSelected = selectedFaculty?.id === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => {
                          onSelectFaculty(f);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-amber-50 text-amber-950 font-bold' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            <span className="text-xs text-slate-400 mr-1.5">#{f.srNo}</span>
                            {f.name}
                          </span>
                          <span className="text-xs text-slate-500 font-normal">{f.category} • {f.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            isSelected ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {f.totalDuties} Duties
                          </span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-amber-600" />}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No matching faculty member found for "{searchTerm}".
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-4 flex items-center">
          <div className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-slate-500">Total Faculty Registered:</span>
            <span className="font-bold text-slate-900 text-sm bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-300">
              {facultyList.length} Members
            </span>
          </div>
        </div>
      </div>

      {/* Fast Faculty Chip Carousel */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 flex items-center gap-1 font-medium flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Select:
        </span>
        {facultyList.slice(0, 8).map(f => (
          <button
            key={f.id}
            onClick={() => onSelectFaculty(f)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer border ${
              selectedFaculty?.id === f.id
                ? 'bg-slate-900 text-amber-300 border-slate-900 font-semibold shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            {f.name} ({f.totalDuties})
          </button>
        ))}
      </div>
    </div>
  );
};
