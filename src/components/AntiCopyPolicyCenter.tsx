import React from 'react';
import { SecurityConfig } from '../types';
import { ShieldCheck, ShieldAlert, Lock, Eye, CheckCircle2, AlertTriangle, FileCheck } from 'lucide-react';

interface AntiCopyPolicyCenterProps {
  securityConfig: SecurityConfig;
  setSecurityConfig: React.Dispatch<React.SetStateAction<SecurityConfig>>;
}

export const AntiCopyPolicyCenter: React.FC<AntiCopyPolicyCenterProps> = ({
  securityConfig,
  setSecurityConfig,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8">
      <div className="flex items-center justify-between pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600" />
            <span>Anti-Copy Security & Content Protection Policy</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official Anti-Extraction Settings for Government College of Engineering Amravati Duty Roster
          </p>
        </div>

        <div className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 border ${
          securityConfig.copyProtectionEnabled
            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
            : 'bg-rose-100 text-rose-900 border-rose-300'
        }`}>
          {securityConfig.copyProtectionEnabled ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Anti-Copy Protection ACTIVE</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Protection PAUSED</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-6 text-xs">
        {/* Toggle Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Main Copy Protection Toggle */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Text Selection & Copy Intercept</h3>
              <p className="text-slate-500 mt-0.5">Disables text highlight copying and Ctrl+C / Cmd+C shortcuts.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityConfig.copyProtectionEnabled}
                onChange={(e) => setSecurityConfig(prev => ({ ...prev, copyProtectionEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Right Click Context Menu */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Right-Click Context Menu Block</h3>
              <p className="text-slate-500 mt-0.5">Intercepts right-clicking with official security notice modal.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityConfig.rightClickDisabled}
                onChange={(e) => setSecurityConfig(prev => ({ ...prev, rightClickDisabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Confidential Watermark */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Confidential Background Watermark</h3>
              <p className="text-slate-500 mt-0.5">Overlays subtle "GCOEA ESE Winter-2026 Confidential" text behind the UI.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityConfig.watermarkVisible}
                onChange={(e) => setSecurityConfig(prev => ({ ...prev, watermarkVisible: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Official Print Authorized Only */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Authorized Print Route Only</h3>
              <p className="text-slate-500 mt-0.5">Directs Ctrl+P directly to the official formatted A4 document generator.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityConfig.printWatermark}
                onChange={(e) => setSecurityConfig(prev => ({ ...prev, printWatermark: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

        </div>

        {/* Security Rationale Banner */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 text-amber-950 space-y-2">
          <h4 className="font-bold text-sm text-amber-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-700" />
            <span>Why Anti-Copy Protection is Implemented:</span>
          </h4>
          <p className="text-slate-700 leading-relaxed">
            Per examination guidelines established by Principal <strong>Dr. Ashish M. Mahalle</strong>, App Owner <strong>Dr. Kawita D. Thakur</strong>, Exam In-Charge <strong>Dr. K. S. Wasankar</strong>, and Co-Coordinators Exam <strong>Dr. S. D. Londhe</strong> &amp; <strong>Dr. V. R. Raut</strong>, raw copy-pasting of invigilation schedules is restricted to avoid unauthorized alteration or distribution of exam rosters. Official copies must be generated exclusively using the "Print Schedule" or "Print Faculty Duty Slip" features.
          </p>
        </div>
      </div>
    </div>
  );
};
