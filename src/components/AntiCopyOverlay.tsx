import React, { useEffect, useState } from 'react';
import { SecurityConfig } from '../types';
import { ShieldAlert, Lock, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface AntiCopyOverlayProps {
  securityConfig: SecurityConfig;
  onTriggerPrint: () => void;
  children: React.ReactNode;
}

export const AntiCopyOverlay: React.FC<AntiCopyOverlayProps> = ({
  securityConfig,
  onTriggerPrint,
  children,
}) => {
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [attemptType, setAttemptType] = useState<string>('');

  useEffect(() => {
    if (!securityConfig.copyProtectionEnabled) return;

    // Prevent right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setAttemptType('Right-click Context Menu');
      setShowCopyModal(true);
    };

    // Prevent copy/select/print keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setAttemptType('Keyboard Copy (Ctrl+C / Cmd+C)');
        setShowCopyModal(true);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setAttemptType('Select All (Ctrl+A / Cmd+A)');
        setShowCopyModal(true);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        // Route Ctrl+P directly to official print view
        onTriggerPrint();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setAttemptType('Save Web Page (Ctrl+S / Cmd+S)');
        setShowCopyModal(true);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        setAttemptType('View Page Source (Ctrl+U)');
        setShowCopyModal(true);
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setAttemptType('Text Copy Operation');
      setShowCopyModal(true);
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('copy', handleCopy);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('copy', handleCopy);
    };
  }, [securityConfig.copyProtectionEnabled, onTriggerPrint]);

  return (
    <div className={`relative min-h-screen ${securityConfig.copyProtectionEnabled ? 'select-none' : ''}`}>
      {/* Watermark overlay when active */}
      {securityConfig.watermarkVisible && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden flex flex-wrap items-center justify-around opacity-[0.03] select-none uppercase font-black text-slate-900 tracking-widest text-xl rotate-[-25deg]">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="p-12 whitespace-nowrap">
              GCOEA • ESE WINTER-2026 • OFFICIAL SCHEDULE • DO NOT COPY
            </div>
          ))}
        </div>
      )}

      {/* Main App Children */}
      {children}

      {/* Security Warning Modal when user attempts copy/right-click */}
      {showCopyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white relative">
            <button
              onClick={() => setShowCopyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40">
                <ShieldAlert className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-amber-200">Copy Protection Restricted</h3>
                <p className="text-xs text-amber-300/80">Government College of Engineering Amravati</p>
              </div>
            </div>

            <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 mb-5 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-amber-300 font-medium pb-2 border-b border-slate-800">
                <span>Attempted Action:</span>
                <span className="bg-amber-950 text-amber-200 px-2 py-0.5 rounded border border-amber-500/30">
                  {attemptType}
                </span>
              </div>
              <p className="pt-1">
                To preserve academic integrity and official distribution control, direct text copying and raw page saving from the ESE Winter-2026 invigilation schedule are disabled.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 pt-1 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>You may use the official "Print Schedule" feature to print or export a formatted PDF slip.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowCopyModal(false);
                  onTriggerPrint();
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
              >
                <Lock className="w-3.5 h-3.5 text-slate-950" />
                <span>Open Official Print View</span>
              </button>
              <button
                onClick={() => setShowCopyModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
