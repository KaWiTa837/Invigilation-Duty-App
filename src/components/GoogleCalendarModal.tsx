import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { DutyItem } from '../types';
import { SyncedCalendarEvent } from '../services/googleCalendar';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  BellRing,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  X,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export interface CalendarModalRequest {
  mode: 'add' | 'remove';
  duties: DutyItem[];
  facultyLabel?: string;
}

interface GoogleCalendarModalProps {
  request: CalendarModalRequest | null;
  googleUser: User | null;
  needsAuth: boolean;
  isLoggingIn: boolean;
  syncedEvents: Record<string, SyncedCalendarEvent>;
  onGoogleLogin: () => Promise<void>;
  onConfirmAdd: (duties: DutyItem[], popupMinutes: number[]) => Promise<{ added: number; skipped: number }>;
  onConfirmRemove: (duties: DutyItem[]) => Promise<number>;
  onClose: () => void;
}

const POPUP_OPTIONS = [
  { minutes: 30, label: '30 minutes before (Control Room reporting time)' },
  { minutes: 60, label: '1 hour before exam start' },
  { minutes: 1440, label: '1 day before exam date' },
  { minutes: 15, label: '15 minutes before exam start' },
];

export const GoogleCalendarModal: React.FC<GoogleCalendarModalProps> = ({
  request,
  googleUser,
  needsAuth,
  isLoggingIn,
  syncedEvents,
  onGoogleLogin,
  onConfirmAdd,
  onConfirmRemove,
  onClose,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number[]>([30, 60, 1440]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  if (!request) return null;

  const isRemove = request.mode === 'remove';
  const dutiesToAdd = request.duties.filter(d => !syncedEvents[d.id]);
  const dutiesAlreadySynced = request.duties.filter(d => Boolean(syncedEvents[d.id]));

  const toggleMinute = (min: number) => {
    setSelectedMinutes(prev =>
      prev.includes(min) ? prev.filter(m => m !== min) : [...prev, min]
    );
  };

  const handleProceed = async () => {
    setErrorMsg(null);
    if (!isRemove && selectedMinutes.length === 0) {
      setErrorMsg('Please select at least one popup notification reminder time.');
      return;
    }

    setIsProcessing(true);
    try {
      if (isRemove) {
        const removedCount = await onConfirmRemove(dutiesAlreadySynced);
        setResultMessage(
          `Removed ${removedCount} invigilation duty event${removedCount === 1 ? '' : 's'} from your Google Calendar.`
        );
      } else {
        const { added, skipped } = await onConfirmAdd(request.duties, selectedMinutes);
        if (added === 0 && skipped > 0) {
          setResultMessage(
            `All ${skipped} selected duty slot${skipped === 1 ? ' is' : 's are'} already synced on your Google Calendar with popup alerts.`
          );
        } else {
          setResultMessage(
            `Added ${added} invigilation duty event${added === 1 ? '' : 's'} with Google Calendar popup notifications${
              skipped > 0 ? ` (${skipped} already synced)` : ''
            }.`
          );
        }
      }
    } catch (err: any) {
      if (err?.message === 'AUTH_EXPIRED') {
        setErrorMsg('Your Google session expired. Please sign in with Google again to continue.');
      } else {
        setErrorMsg(err?.message || 'Unable to update Google Calendar. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl relative text-slate-800 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer disabled:opacity-40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div
            className={`p-3 rounded-xl border ${
              isRemove
                ? 'bg-rose-100 text-rose-800 border-rose-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {isRemove ? (
              <Trash2 className="w-6 h-6 text-rose-700" />
            ) : (
              <BellRing className="w-6 h-6 text-amber-700" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-900">
              {isRemove
                ? 'Remove Google Calendar Alert?'
                : 'Add Google Calendar Popup Notification'}
            </h3>
            <p className="text-xs text-slate-500">
              {request.facultyLabel
                ? `${request.facultyLabel} • ESE Winter-2026`
                : 'GCOEA ESE Winter-2026 Invigilation Schedule'}
            </p>
          </div>
        </div>

        {/* Auth Required State */}
        {needsAuth || !googleUser ? (
          <div className="py-6 text-center space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 text-left space-y-1.5">
              <p className="font-bold text-slate-900 text-sm">Connect your Google Calendar</p>
              <p>
                Sign in with your Google account to add invigilation duties directly to your primary Google Calendar with automatic popup notifications before each exam shift.
              </p>
            </div>
            <div className="flex justify-center">
              <GoogleSignInButton
                onClick={onGoogleLogin}
                disabled={isLoggingIn}
                label={isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
              />
            </div>
          </div>
        ) : resultMessage ? (
          /* Success State */
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Google Calendar Updated</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">{resultMessage}</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs inline-flex items-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Google Calendar</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Form State */
          <div className="mt-4 space-y-4 text-xs">
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
              <span className="text-slate-500">Connected Google Account:</span>
              <span className="font-semibold text-slate-900">{googleUser.email || googleUser.displayName}</span>
            </div>

            {/* Affected Duties List */}
            <div>
              <div className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                <span>
                  {isRemove
                    ? `Events to Remove (${dutiesAlreadySynced.length}):`
                    : `Duty Events to Schedule (${request.duties.length}):`}
                </span>
                {!isRemove && dutiesAlreadySynced.length > 0 && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {dutiesAlreadySynced.length} already synced
                  </span>
                )}
              </div>

              <div className="max-h-44 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-slate-50/70">
                {(isRemove ? dutiesAlreadySynced : request.duties).map(duty => {
                  const alreadySynced = Boolean(syncedEvents[duty.id]);
                  return (
                    <div key={duty.id} className="px-3 py-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <div className="truncate">
                          <span className="font-semibold text-slate-900">{duty.date}</span>
                          <span className="text-slate-500 ml-1.5">
                            • {duty.shift} ({duty.timing})
                          </span>
                        </div>
                      </div>
                      {!isRemove && alreadySynced && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                          Synced
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popup Notification Selector (for Add mode) */}
            {!isRemove && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5 text-amber-700" />
                  <span>Google Calendar Popup Notification Alerts (IST):</span>
                </div>
                <div className="space-y-1.5">
                  {POPUP_OPTIONS.map(opt => {
                    const checked = selectedMinutes.includes(opt.minutes);
                    return (
                      <label
                        key={opt.minutes}
                        className="flex items-center gap-2 text-slate-800 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMinute(opt.minutes)}
                          className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                        <Clock className="w-3 h-3 text-amber-700 flex-shrink-0" />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Confirmation Explanation */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>
                {isRemove
                  ? `Confirming will permanently remove ${dutiesAlreadySynced.length} synced invigilation event${
                      dutiesAlreadySynced.length === 1 ? '' : 's'
                    } from your Google Calendar.`
                  : `Confirming will add ${dutiesToAdd.length} new event${
                      dutiesToAdd.length === 1 ? '' : 's'
                    } to your primary Google Calendar with popup reminder notifications enabled.`}
              </p>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceed}
                disabled={isProcessing || (!isRemove && dutiesToAdd.length === 0) || (isRemove && dutiesAlreadySynced.length === 0)}
                className={`px-5 py-2 font-bold rounded-xl flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRemove
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isRemove ? 'Removing...' : 'Syncing to Calendar...'}</span>
                  </>
                ) : isRemove ? (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Remove</span>
                  </>
                ) : (
                  <>
                    <BellRing className="w-3.5 h-3.5" />
                    <span>
                      Confirm &amp; Add {dutiesToAdd.length > 1 ? `${dutiesToAdd.length} Alerts` : 'Popup Alert'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
