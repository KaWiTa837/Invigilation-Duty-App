import React from 'react';
import { User } from 'firebase/auth';
import { OFFICIAL_INFO } from '../data/duties';
import { SecurityConfig } from '../types';
import { GoogleSignInButton } from './GoogleSignInButton';
import { ShieldCheck, ShieldAlert, Lock, Printer, Search, Calendar, Table, RefreshCw, BarChart2, Award, BellRing, LogOut } from 'lucide-react';

interface HeaderProps {
  activeTab: 'faculty' | 'master' | 'calendar' | 'swaps' | 'stats' | 'security';
  setActiveTab: (tab: 'faculty' | 'master' | 'calendar' | 'swaps' | 'stats' | 'security') => void;
  securityConfig: SecurityConfig;
  setSecurityConfig: React.Dispatch<React.SetStateAction<SecurityConfig>>;
  onTriggerPrint: () => void;
  googleUser: User | null;
  needsAuth: boolean;
  isLoggingIn: boolean;
  syncedCount: number;
  onGoogleLogin: () => void;
  onGoogleLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  securityConfig,
  setSecurityConfig,
  onTriggerPrint,
  googleUser,
  needsAuth,
  isLoggingIn,
  syncedCount,
  onGoogleLogin,
  onGoogleLogout,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-amber-500/30 shadow-xl relative overflow-hidden">
      {/* Top Banner with Government Seal styling */}
      <div className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 text-amber-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide border-b border-amber-400/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AUTONOMOUS INSTITUTE • GOVT. OF MAHARASHTRA</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-amber-200 flex-wrap justify-center">
          <span>Principal: <strong className="text-white font-semibold">{OFFICIAL_INFO.owner.name}</strong></span>
          <span>•</span>
          <span>Exam In-Charge: <strong className="text-white font-semibold">Dr. K. S. Wasankar</strong></span>
          <span>•</span>
          <span>Co-Coordinator Exam: <strong className="text-white font-semibold">Dr. S. D. Londhe &amp; Dr. V. R. Raut</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
          <Lock className="w-3 h-3 text-amber-300" />
          <span>Copy Protected System</span>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & College Info */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-700 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center border border-amber-400/30">
                <Award className="w-8 h-8 text-amber-400" />
                <span className="text-[9px] font-bold tracking-tighter text-amber-200 mt-0.5">GCOEA</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-0.5">
                Invigilation Duty App GCoEA
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 tracking-tight">
                {OFFICIAL_INFO.institution}
              </h1>
              <p className="text-xs text-slate-300 font-sans tracking-wide mt-0.5">
                {OFFICIAL_INFO.subTitle}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1.5 text-xs">
                <span className="bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-md font-semibold border border-amber-500/40">
                  {OFFICIAL_INFO.term}
                </span>
                <span className="text-slate-400">
                  O.N.: {OFFICIAL_INFO.orderNumber} • Date: {OFFICIAL_INFO.orderDate} • AY {OFFICIAL_INFO.academicYear}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Official Signatory Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {needsAuth || !googleUser ? (
              <GoogleSignInButton
                onClick={onGoogleLogin}
                disabled={isLoggingIn}
                label={isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
                compact
              />
            ) : (
              <div className="flex items-center gap-2 bg-slate-800/90 border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs">
                <BellRing className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <div className="flex flex-col leading-tight">
                  <span className="text-emerald-300 font-semibold">Calendar Ready</span>
                  <span className="text-[10px] text-slate-300 max-w-[140px] truncate">
                    {syncedCount > 0 ? `${syncedCount} alert${syncedCount === 1 ? '' : 's'} synced` : googleUser.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onGoogleLogout}
                  className="ml-1 p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition cursor-pointer"
                  title="Sign out of Google Calendar"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={onTriggerPrint}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 cursor-pointer active:scale-95"
              title="Print Official Duty Schedule / Roster"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Print Schedule</span>
            </button>

            <button
              onClick={() => setSecurityConfig(prev => ({ ...prev, copyProtectionEnabled: !prev.copyProtectionEnabled }))}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                securityConfig.copyProtectionEnabled
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                  : 'bg-rose-950/60 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
              }`}
              title="Toggle Anti-Copy Protection"
            >
              {securityConfig.copyProtectionEnabled ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Anti-Copy ON</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Anti-Copy OFF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Officials Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-amber-400 font-semibold">Authority:</span>
            <span className="bg-slate-800 text-amber-200 px-2 py-0.5 rounded border border-slate-700">
              {OFFICIAL_INFO.owner.name} ({OFFICIAL_INFO.owner.title})
            </span>
            <span className="bg-amber-500/20 text-amber-200 px-2.5 py-0.5 rounded border border-amber-500/40 font-semibold">
              App Made By Dr. Kawita D Thakur
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-amber-400 font-semibold">Exam Cell:</span>
            {OFFICIAL_INFO.incharges.map((inc, i) => (
              <span key={i} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                {inc.name} ({inc.designation})
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-3">
          <button
            onClick={() => setActiveTab('faculty')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'faculty'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Faculty Duty Dropdown</span>
          </button>

          <button
            onClick={() => setActiveTab('master')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'master'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Master Duty Timetable</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Day-wise Schedule Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('swaps')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'swaps'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Duty Relief / Swaps</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Duty Statistics</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Anti-Copy Policy</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
