export type ShiftType = 'Morning' | 'Afternoon';

export interface DutyItem {
  id: string;
  invigilator: string;
  date: string; // e.g. "17 November 2026"
  dateLabel: string; // e.g. "17 Nov"
  shift: ShiftType;
  timing: string; // "11:00 AM - 1:30 PM" or "2:30 PM - 5:00 PM"
  slotCode?: string; // e.g. "17M", "17A"
  dayOfWeek?: string;
  hallNo?: string;
  status: 'Scheduled' | 'Acknowledged' | 'Swap Requested' | 'Reassigned';
}

export interface FacultyMember {
  id: string;
  srNo: number;
  name: string;
  title: string;
  category: string;
  totalDuties: number;
  email?: string;
  department?: string;
  phone?: string;
}

export interface OfficialInfo {
  owner: {
    name: string;
    designation: string;
    title: string;
  };
  appOwner: {
    name: string;
    designation: string;
  };
  incharges: {
    name: string;
    designation: string;
  }[];
  institution: string;
  subTitle: string;
  term: string;
  academicYear: string;
  orderNumber: string;
  orderDate: string;
}

export interface DutySwapRequest {
  id: string;
  originalDutyId: string;
  facultyName: string;
  date: string;
  shift: ShiftType;
  requestedSubstitute: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface SecurityConfig {
  copyProtectionEnabled: boolean;
  rightClickDisabled: boolean;
  watermarkVisible: boolean;
  printWatermark: boolean;
}
