import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { INITIAL_DUTIES, FACULTY_MEMBERS, OFFICIAL_INFO } from './data/duties';
import { DutyItem, FacultyMember, SecurityConfig, DutySwapRequest } from './types';
import { Header } from './components/Header';
import { AntiCopyOverlay } from './components/AntiCopyOverlay';
import { FacultySelector } from './components/FacultySelector';
import { FacultyDutyCard } from './components/FacultyDutyCard';
import { MasterTable } from './components/MasterTable';
import { DateCalendarView } from './components/DateCalendarView';
import { DutySwapModal } from './components/DutySwapModal';
import { PrintView } from './components/PrintView';
import { StatsOverview } from './components/StatsOverview';
import { AntiCopyPolicyCenter } from './components/AntiCopyPolicyCenter';
import { GoogleCalendarModal, CalendarModalRequest } from './components/GoogleCalendarModal';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  listSyncedDutyEvents,
  createDutyCalendarEvent,
  deleteDutyCalendarEvent,
  SyncedCalendarEvent,
} from './services/googleCalendar';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [duties, setDuties] = useState<DutyItem[]>(INITIAL_DUTIES);
  const [facultyList] = useState<FacultyMember[]>(FACULTY_MEMBERS);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember>(
    FACULTY_MEMBERS.find(f => f.name.includes("Thakur")) || FACULTY_MEMBERS[1]
  );
  const [activeTab, setActiveTab] = useState<'faculty' | 'master' | 'calendar' | 'swaps' | 'stats' | 'security'>('faculty');

  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    copyProtectionEnabled: true,
    rightClickDisabled: true,
    watermarkVisible: true,
    printWatermark: true,
  });

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printTargetFaculty, setPrintTargetFaculty] = useState<FacultyMember | null>(null);

  const [activeSwapDuty, setActiveSwapDuty] = useState<DutyItem | null>(null);
  const [swapRequests, setSwapRequests] = useState<DutySwapRequest[]>([]);

  // Google Calendar OAuth & Sync State (access token stored strictly in memory)
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [syncedEvents, setSyncedEvents] = useState<Record<string, SyncedCalendarEvent>>({});
  const [calendarModalRequest, setCalendarModalRequest] = useState<CalendarModalRequest | null>(null);

  const refreshSyncedCalendarEvents = useCallback(async (accessToken: string) => {
    try {
      const map = await listSyncedDutyEvents(accessToken);
      setSyncedEvents(map);
    } catch (err: any) {
      if (err?.message === 'AUTH_EXPIRED') {
        setNeedsAuth(true);
        setGoogleUser(null);
      } else {
        console.error('Failed to load synced calendar events:', err);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setNeedsAuth(false);
        refreshSyncedCalendarEvents(token);
      },
      () => {
        setGoogleUser(null);
        setNeedsAuth(true);
        setSyncedEvents({});
      }
    );
    return () => unsubscribe();
  }, [refreshSyncedCalendarEvents]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setNeedsAuth(false);
        await refreshSyncedCalendarEvents(result.accessToken);
      }
    } catch (err) {
      console.error('Google Calendar sign-in failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setGoogleUser(null);
    setNeedsAuth(true);
    setSyncedEvents({});
  };

  const handleConfirmAddToCalendar = async (
    targetDuties: DutyItem[],
    popupMinutes: number[]
  ): Promise<{ added: number; skipped: number }> => {
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      throw new Error('AUTH_EXPIRED');
    }

    let added = 0;
    let skipped = 0;
    const newlySynced: Record<string, SyncedCalendarEvent> = {};

    for (const duty of targetDuties) {
      if (syncedEvents[duty.id]) {
        skipped += 1;
        continue;
      }
      const created = await createDutyCalendarEvent(token, duty, popupMinutes);
      newlySynced[duty.id] = created;
      added += 1;
    }

    if (Object.keys(newlySynced).length > 0) {
      setSyncedEvents(prev => ({ ...prev, ...newlySynced }));
    }

    return { added, skipped };
  };

  const handleConfirmRemoveFromCalendar = async (targetDuties: DutyItem[]): Promise<number> => {
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      throw new Error('AUTH_EXPIRED');
    }

    let removed = 0;
    const removedDutyIds: string[] = [];

    for (const duty of targetDuties) {
      const synced = syncedEvents[duty.id];
      if (!synced) continue;
      await deleteDutyCalendarEvent(token, synced.eventId);
      removedDutyIds.push(duty.id);
      removed += 1;
    }

    if (removedDutyIds.length > 0) {
      setSyncedEvents(prev => {
        const next = { ...prev };
        removedDutyIds.forEach(id => delete next[id]);
        return next;
      });
    }

    return removed;
  };

  // Toggle duty acknowledgment
  const handleToggleAcknowledge = (dutyId: string) => {
    setDuties(prev =>
      prev.map(d => {
        if (d.id === dutyId) {
          const nextStatus = d.status === 'Acknowledged' ? 'Scheduled' : 'Acknowledged';
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  // Open Swap Modal
  const handleOpenSwapModal = (duty: DutyItem) => {
    setActiveSwapDuty(duty);
  };

  // Submit Swap Request
  const handleSubmitSwapRequest = (req: Omit<DutySwapRequest, 'id' | 'timestamp' | 'status'>) => {
    const newSwap: DutySwapRequest = {
      ...req,
      id: `swap-${Date.now()}`,
      status: 'Pending',
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setSwapRequests(prev => [newSwap, ...prev]);

    // Update duty status to Swap Requested
    setDuties(prev =>
      prev.map(d => (d.id === req.originalDutyId ? { ...d, status: 'Swap Requested' } : d))
    );
  };

  // Select Faculty by name string
  const handleSelectFacultyByName = (name: string) => {
    const found = facultyList.find(f => f.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setSelectedFaculty(found);
      setActiveTab('faculty');
    }
  };

  // Filter duties for selected faculty member
  const currentFacultyDuties = duties.filter(
    d => d.invigilator.toLowerCase() === selectedFaculty.name.toLowerCase()
  );

  return (
    <AntiCopyOverlay
      securityConfig={securityConfig}
      onTriggerPrint={() => {
        setPrintTargetFaculty(null);
        setShowPrintModal(true);
      }}
    >
      <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-16">
        
        {/* Main Application Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          securityConfig={securityConfig}
          setSecurityConfig={setSecurityConfig}
          onTriggerPrint={() => {
            setPrintTargetFaculty(null);
            setShowPrintModal(true);
          }}
          googleUser={googleUser}
          needsAuth={needsAuth}
          isLoggingIn={isLoggingIn}
          syncedCount={Object.keys(syncedEvents).length}
          onGoogleLogin={handleGoogleLogin}
          onGoogleLogout={handleGoogleLogout}
        />

        {/* Main Body Layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          
          {/* TAB 1: FACULTY DROPDOWN LOOKUP & PERSONAL CARD */}
          {activeTab === 'faculty' && (
            <div>
              <FacultySelector
                facultyList={facultyList}
                selectedFaculty={selectedFaculty}
                onSelectFaculty={(f) => setSelectedFaculty(f)}
              />

              <FacultyDutyCard
                faculty={selectedFaculty}
                duties={currentFacultyDuties}
                syncedEvents={syncedEvents}
                onToggleAcknowledge={handleToggleAcknowledge}
                onRequestSwap={handleOpenSwapModal}
                onPrintFacultySlip={(f) => {
                  setPrintTargetFaculty(f);
                  setShowPrintModal(true);
                }}
                onAddDutiesToCalendar={(targetDuties, facultyLabel) =>
                  setCalendarModalRequest({ mode: 'add', duties: targetDuties, facultyLabel })
                }
                onRemoveDutyFromCalendar={(duty) =>
                  setCalendarModalRequest({ mode: 'remove', duties: [duty], facultyLabel: duty.invigilator })
                }
              />
            </div>
          )}

          {/* TAB 2: MASTER TIMETABLE */}
          {activeTab === 'master' && (
            <MasterTable
              duties={duties}
              facultyList={facultyList}
              syncedEvents={syncedEvents}
              onToggleAcknowledge={handleToggleAcknowledge}
              onRequestSwap={handleOpenSwapModal}
              onSelectFacultyByName={handleSelectFacultyByName}
              onAddDutiesToCalendar={(targetDuties, facultyLabel) =>
                setCalendarModalRequest({ mode: 'add', duties: targetDuties, facultyLabel })
              }
              onRemoveDutyFromCalendar={(duty) =>
                setCalendarModalRequest({ mode: 'remove', duties: [duty], facultyLabel: duty.invigilator })
              }
            />
          )}

          {/* TAB 3: DAY-WISE CALENDAR GRID */}
          {activeTab === 'calendar' && (
            <DateCalendarView
              duties={duties}
              onSelectFacultyByName={handleSelectFacultyByName}
            />
          )}

          {/* TAB 4: DUTY RELIEF & SWAPS CENTER */}
          {activeTab === 'swaps' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 mb-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-amber-600" />
                    <span>Duty Swap & Relief Applications Center</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage and review faculty duty substitution requests for {OFFICIAL_INFO.term} (O.N. {OFFICIAL_INFO.orderNumber}).
                  </p>
                </div>
              </div>

              {/* Submitted Swaps Table */}
              <div className="mt-6">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Recent Swap Applications</h3>
                {swapRequests.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100 font-bold text-slate-800 border-b border-slate-200">
                          <th className="p-3">Date</th>
                          <th className="p-3">Applicant Faculty</th>
                          <th className="p-3">Exam Date & Shift</th>
                          <th className="p-3">Substitute Faculty</th>
                          <th className="p-3">Reason</th>
                          <th className="p-3">Approval Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {swapRequests.map(swap => (
                          <tr key={swap.id}>
                            <td className="p-3 text-slate-500">{swap.timestamp}</td>
                            <td className="p-3 font-semibold text-slate-900">{swap.facultyName}</td>
                            <td className="p-3 text-amber-900 font-medium">{swap.date} ({swap.shift})</td>
                            <td className="p-3 text-slate-800 font-semibold">{swap.requestedSubstitute}</td>
                            <td className="p-3 text-slate-600 italic">{swap.reason}</td>
                            <td className="p-3">
                              <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                                {swap.status} (Pending In-Charge Approval)
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs">
                    No active duty swap requests submitted yet. Select any duty from the Faculty or Master tab to request a swap.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: WORKLOAD STATISTICS */}
          {activeTab === 'stats' && (
            <StatsOverview
              duties={duties}
              facultyList={facultyList}
            />
          )}

          {/* TAB 6: ANTI-COPY POLICY & SECURITY */}
          {activeTab === 'security' && (
            <AntiCopyPolicyCenter
              securityConfig={securityConfig}
              setSecurityConfig={setSecurityConfig}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="mt-12 bg-slate-900 text-slate-400 py-8 border-t border-amber-500/20 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h4 className="font-serif font-bold text-amber-100 text-sm">
                {OFFICIAL_INFO.institution}
              </h4>
              <p className="text-slate-400 mt-0.5">
                {OFFICIAL_INFO.subTitle} • {OFFICIAL_INFO.term} (AY {OFFICIAL_INFO.academicYear})
              </p>
            </div>

            <div className="text-center md:text-right text-slate-400 space-y-1">
              <div>
                Principal: <strong className="text-amber-300 font-semibold">{OFFICIAL_INFO.owner.name}</strong> • App Owner: <strong className="text-amber-300 font-semibold">{OFFICIAL_INFO.appOwner.name}</strong>
              </div>
              <div>
                Exam In-Charge: <strong className="text-slate-200">Dr. K. S. Wasankar</strong> • Co-Coordinator Exam: <strong className="text-slate-200">Dr. S. D. Londhe &amp; Dr. V. R. Raut</strong>
              </div>
            </div>
          </div>
        </footer>

        {/* Swap Modal */}
        {activeSwapDuty && (
          <DutySwapModal
            duty={activeSwapDuty}
            facultyList={facultyList}
            onClose={() => setActiveSwapDuty(null)}
            onSubmitSwap={handleSubmitSwapRequest}
            swapRequests={swapRequests}
          />
        )}

        {/* Google Calendar Popup Notification Confirmation Modal */}
        {calendarModalRequest && (
          <GoogleCalendarModal
            request={calendarModalRequest}
            googleUser={googleUser}
            needsAuth={needsAuth}
            isLoggingIn={isLoggingIn}
            syncedEvents={syncedEvents}
            onGoogleLogin={handleGoogleLogin}
            onConfirmAdd={handleConfirmAddToCalendar}
            onConfirmRemove={handleConfirmRemoveFromCalendar}
            onClose={() => setCalendarModalRequest(null)}
          />
        )}

        {/* Printable View Modal */}
        {showPrintModal && (
          <PrintView
            duties={duties}
            selectedFaculty={printTargetFaculty}
            onClose={() => setShowPrintModal(false)}
          />
        )}

      </div>
    </AntiCopyOverlay>
  );
}
