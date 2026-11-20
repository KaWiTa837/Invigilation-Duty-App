import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { DutyItem } from '../types';
import { OFFICIAL_INFO } from '../data/duties';

export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events.owned',
];

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));
provider.setCustomParameters({ prompt: 'select_account' });

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// Cache the OAuth access token strictly in memory (never in localStorage/sessionStorage).
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Calendar access token. Please try signing in again.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

export interface SyncedCalendarEvent {
  eventId: string;
  dutyId: string;
  htmlLink?: string;
  summary?: string;
}

const MONTH_INDEX: Record<string, string> = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12',
};

function buildIsoDateTimes(duty: DutyItem): { start: string; end: string } {
  // Parse formats like "17 November 2026"
  const parts = duty.date.trim().split(/\s+/);
  const day = parts[0].padStart(2, '0');
  const month = MONTH_INDEX[parts[1].toLowerCase()] || '11';
  const year = parts[2] || '2026';
  const dateStr = `${year}-${month}-${day}`;

  if (duty.shift === 'Morning') {
    return {
      start: `${dateStr}T11:00:00+05:30`,
      end: `${dateStr}T13:30:00+05:30`,
    };
  }
  return {
    start: `${dateStr}T14:30:00+05:30`,
    end: `${dateStr}T17:00:00+05:30`,
  };
}

export async function listSyncedDutyEvents(
  accessToken: string
): Promise<Record<string, SyncedCalendarEvent>> {
  const params = new URLSearchParams({
    privateExtendedProperty: 'gcoeaTerm=ESE-Winter-2026',
    maxResults: '250',
    singleEvents: 'true',
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (res.status === 401) {
    cachedAccessToken = null;
    throw new Error('AUTH_EXPIRED');
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || 'Failed to read Google Calendar events');
  }

  const data = await res.json();
  const map: Record<string, SyncedCalendarEvent> = {};
  for (const item of data.items || []) {
    const dutyId = item?.extendedProperties?.private?.gcoeaDutyId;
    if (dutyId && item.status !== 'cancelled') {
      map[dutyId] = {
        eventId: item.id,
        dutyId,
        htmlLink: item.htmlLink,
        summary: item.summary,
      };
    }
  }
  return map;
}

export async function createDutyCalendarEvent(
  accessToken: string,
  duty: DutyItem,
  popupMinutes: number[]
): Promise<SyncedCalendarEvent> {
  const { start, end } = buildIsoDateTimes(duty);
  const reportingTime = duty.shift === 'Morning' ? '10:30 AM' : '2:00 PM';

  const uniqueMinutes = Array.from(new Set(popupMinutes))
    .filter(m => m >= 0 && m <= 40320)
    .sort((a, b) => b - a);

  const overrides = (uniqueMinutes.length > 0 ? uniqueMinutes : [30, 60]).map(minutes => ({
    method: 'popup' as const,
    minutes,
  }));

  const eventPayload = {
    summary: `Invigilation Duty (${duty.slotCode || duty.shift}) - ${duty.invigilator} | GCOEA ${OFFICIAL_INFO.term}`,
    location: 'Examination Control Room, Government College of Engineering, Amravati',
    description: [
      `${OFFICIAL_INFO.institution}`,
      `${OFFICIAL_INFO.term} Invigilation Duty (${OFFICIAL_INFO.orderNumber})`,
      ``,
      `Invigilator: ${duty.invigilator}`,
      `Date: ${duty.date}`,
      `Shift: ${duty.shift} (${duty.timing})`,
      `Mandatory Reporting Time: ${reportingTime} (30 minutes prior at Examination Control Room)`,
      ``,
      `Important Note:`,
      `- Question papers will be handed over at the control room to invigilators only.`,
      `- Expert Faculties are not allowed as alternatives for Examination duties.`,
      ``,
      `Exam In-Charge: Dr. K. S. Wasankar`,
      `Co-Coordinators Exam: Dr. S. D. Londhe & Dr. V. R. Raut`,
      `Principal: ${OFFICIAL_INFO.owner.name}`,
    ].join('\n'),
    start: {
      dateTime: start,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: end,
      timeZone: 'Asia/Kolkata',
    },
    reminders: {
      useDefault: false,
      overrides,
    },
    extendedProperties: {
      private: {
        gcoeaTerm: 'ESE-Winter-2026',
        gcoeaDutyId: duty.id,
        gcoeaInvigilator: duty.invigilator,
      },
    },
  };

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventPayload),
    }
  );

  if (res.status === 401) {
    cachedAccessToken = null;
    throw new Error('AUTH_EXPIRED');
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || 'Failed to create Google Calendar event');
  }

  const created = await res.json();
  return {
    eventId: created.id,
    dutyId: duty.id,
    htmlLink: created.htmlLink,
    summary: created.summary,
  };
}

export async function deleteDutyCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (res.status === 401) {
    cachedAccessToken = null;
    throw new Error('AUTH_EXPIRED');
  }

  if (!res.ok && res.status !== 404 && res.status !== 410) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || 'Failed to remove Google Calendar event');
  }
}
