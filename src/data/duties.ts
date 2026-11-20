import { DutyItem, FacultyMember, OfficialInfo, ShiftType } from '../types';

export const OFFICIAL_INFO: OfficialInfo = {
  institution: "GOVERNMENT COLLEGE OF ENGINEERING, AMRAVATI",
  subTitle: "(An Autonomous Institute of Government of Maharashtra)",
  term: "ESE Winter-2026",
  academicYear: "2026 - 2027",
  orderNumber: "GCOEA/COE/Exam/W-26/443Me",
  orderDate: "12/11/2026",
  owner: {
    name: "Dr. Ashish M. Mahalle",
    designation: "Principal, Govt. COE Amravati",
    title: "Principal"
  },
  appOwner: {
    name: "Dr. Kawita D. Thakur",
    designation: "App Owner"
  },
  incharges: [
    {
      name: "Dr. K. S. Wasankar",
      designation: "Exam In-Charge"
    },
    {
      name: "Dr. S. D. Londhe",
      designation: "Co-Coordinator Exam"
    },
    {
      name: "Dr. V. R. Raut",
      designation: "Co-Coordinator Exam"
    }
  ]
};

export interface ShiftSlotMeta {
  code: string;
  date: string;
  dateLabel: string;
  shift: ShiftType;
  timing: string;
  studentsAppearing: number;
  sortOrder: number;
}

export const SHIFT_SLOTS: ShiftSlotMeta[] = [
  { code: "17M", date: "17 November 2026", dateLabel: "17 Nov", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 321, sortOrder: 1 },
  { code: "17A", date: "17 November 2026", dateLabel: "17 Nov", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 498, sortOrder: 2 },
  { code: "18M", date: "18 November 2026", dateLabel: "18 Nov", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 448, sortOrder: 3 },
  { code: "18A", date: "18 November 2026", dateLabel: "18 Nov", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 6, sortOrder: 4 },
  { code: "19M", date: "19 November 2026", dateLabel: "19 Nov", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 450, sortOrder: 5 },
  { code: "19A", date: "19 November 2026", dateLabel: "19 Nov", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 411, sortOrder: 6 },
  { code: "20M", date: "20 November 2026", dateLabel: "20 Nov", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 479, sortOrder: 7 },
  { code: "20A", date: "20 November 2026", dateLabel: "20 Nov", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 17, sortOrder: 8 },
  { code: "21M", date: "21 November 2026", dateLabel: "21 Nov", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 419, sortOrder: 9 },
  { code: "21A", date: "21 November 2026", dateLabel: "21 Nov", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 567, sortOrder: 10 },
  { code: "23M", date: "23 November 2026", dateLabel: "23 Nov", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 451, sortOrder: 11 },
  { code: "23A", date: "23 November 2026", dateLabel: "23 Nov", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 10, sortOrder: 12 },
  { code: "25M", date: "25 November 2026", dateLabel: "25 Nov", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 411, sortOrder: 13 },
  { code: "25A", date: "25 November 2026", dateLabel: "25 Nov", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 571, sortOrder: 14 },
  { code: "26M", date: "26 November 2026", dateLabel: "26 Nov", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 405, sortOrder: 15 },
  { code: "26A", date: "26 November 2026", dateLabel: "26 Nov", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 1, sortOrder: 16 },
  { code: "27M", date: "27 November 2026", dateLabel: "27 Nov", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 369, sortOrder: 17 },
  { code: "27A", date: "27 November 2026", dateLabel: "27 Nov", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 534, sortOrder: 18 },
  { code: "30M", date: "30 November 2026", dateLabel: "30 Nov", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 376, sortOrder: 19 },
  { code: "30A", date: "30 November 2026", dateLabel: "30 Nov", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 1, sortOrder: 20 },
  { code: "01M", date: "01 December 2026", dateLabel: "01 Dec", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 4, sortOrder: 21 },
  { code: "01A", date: "01 December 2026", dateLabel: "01 Dec", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 44, sortOrder: 22 },
  { code: "02M", date: "02 December 2026", dateLabel: "02 Dec", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 417, sortOrder: 23 },
  { code: "03M", date: "03 December 2026", dateLabel: "03 Dec", shift: "Morning", timing: "11:00 AM - 1:30 PM", studentsAppearing: 12, sortOrder: 24 },
  { code: "03A", date: "03 December 2026", dateLabel: "03 Dec", shift: "Afternoon", timing: "2:30 PM - 5:00 PM", studentsAppearing: 167, sortOrder: 25 },
];

const SLOT_LOOKUP: Record<string, ShiftSlotMeta> = Object.fromEntries(
  SHIFT_SLOTS.map(s => [s.code, s])
);

export const DATE_ORDER_MAP: Record<string, number> = Object.fromEntries(
  SHIFT_SLOTS.map(s => [s.date, Math.ceil(s.sortOrder / 2)])
);

export const SHIFT_STUDENT_COUNTS: Record<string, number> = Object.fromEntries(
  SHIFT_SLOTS.map(s => [`${s.date}|${s.shift}`, s.studentsAppearing])
);

interface RawFacultySchedule {
  srNo: number;
  name: string;
  title: string;
  category: string;
  slots: string[];
}

const RAW_FACULTY_SCHEDULE: RawFacultySchedule[] = [
  // Regular Faculty (Sr. No. 1 - 32)
  { srNo: 1, name: "Dr. Ashish M. Mahalle", title: "Principal, Government College of Engineering Amravati", category: "Principal", slots: [] },
  { srNo: 2, name: "Dr. Suchita K Hirde", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17A", "19A", "25M", "27M"] },
  { srNo: 3, name: "Dr. Gopilal G Bhutada", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17A", "19M", "23M", "25A"] },
  { srNo: 4, name: "Dr. Prashant R Deshmukh", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17M", "20M", "21A", "25M"] },
  { srNo: 5, name: "Dr. Rajendra R. Chaudhari", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["25M", "26M", "27M", "30M"] },
  { srNo: 6, name: "Dr Rajesh M Metkar", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["21M", "27A", "02M", "03A"] },
  { srNo: 7, name: "Prof Shilpa Pandit Tak", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["26A", "27A", "30A", "01A"] },
  { srNo: 8, name: "Prof Lavkesh R Wankhade", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["20M", "21A", "25M", "26M", "27A", "02M"] },
  { srNo: 9, name: "Prof Archana K Baile", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17M", "25A", "26M", "27A", "30M", "02M"] },
  { srNo: 10, name: "Dr Pramod R Pachghare", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17M", "19A", "21M", "25M", "27M", "02M"] },
  { srNo: 11, name: "Prof R S Mohod", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["21M", "23M", "25A", "27M", "30M", "02M"] },
  { srNo: 12, name: "Dr. Shailendra M Lawankar", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17A", "19M", "20M", "25M", "27M", "30M"] },
  { srNo: 13, name: "Dr Manush Tejrao Shete", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17A", "19M", "20A", "25A", "27A", "02M"] },
  { srNo: 14, name: "Prof H S Farkade", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17M", "19A", "21A", "25M", "27A", "02M"] },
  { srNo: 15, name: "Prof Narendra D Solanke", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17A", "19M", "21M", "25A", "27M", "01A"] },
  { srNo: 16, name: "Dr. Manisha Vasant Jape", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17M", "19A", "21A", "25A"] },
  { srNo: 17, name: "Dr. Kawita D. Thakur", title: "App Owner, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17A", "19M", "20M", "21A", "26M", "30M"] },
  { srNo: 18, name: "Dr Meghraj Sudhakar More", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17M", "18M", "19A", "21M", "25M", "27M"] },
  { srNo: 19, name: "Prof Swapna A Morkhade", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17M", "18M", "20M", "21A", "25M", "27A"] },
  { srNo: 20, name: "Dr. Dinesh V Rojatkar", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17A", "20M", "21M", "23M", "25A", "27A"] },
  { srNo: 21, name: "Prof Shweta J Meshram", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["18M", "19A", "21M", "23M", "25A", "27A"] },
  { srNo: 22, name: "Dr Prashant L Paikrao", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17A", "19M", "20M", "21A", "26M", "27A"] },
  { srNo: 23, name: "Prof Mohd A Mustafa Shah", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["18M", "20M", "21A", "25M", "27M", "02M"] },
  { srNo: 24, name: "Prof Umesh M. Thorkar", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["18M", "19M", "20M", "23M", "25M", "27M"] },
  { srNo: 25, name: "Prof Nitin Suresh Pathak", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["20M", "21A", "25M", "26M", "30M", "02M"] },
  { srNo: 26, name: "Dr Bhushan V Wakode", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["21A", "25M", "26M", "27A"] },
  { srNo: 27, name: "Dr. Premchand B Ambhore", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["18M", "19A", "21M", "23M", "26M", "30M"] },
  { srNo: 28, name: "Prof Rajesh S. Mawale", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17A", "19A", "21A", "25M", "27M", "30M"] },
  { srNo: 29, name: "Dr. Kamlesh A Waghmare", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17M", "18M", "19A", "21M", "23M", "26M"] },
  { srNo: 30, name: "Prof M B Waghmare", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["18M", "19A", "21A", "23M", "26M", "27A"] },
  { srNo: 31, name: "Prof Naresh G Gadage", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["17A", "19A", "20M", "21M", "23M", "27A"] },
  { srNo: 32, name: "Prof Vijay M Harne", title: "Faculty, Government College of Engineering Amravati", category: "Regular Faculty", slots: ["23A", "25A", "27M", "30M", "01M", "02M"] },

  // Faculty in Physics, Chemistry, Maths (Sr. No. 33 - 35)
  { srNo: 33, name: "Dr. Deepak A Zatale", title: "Faculty in Physics, Chemistry, Maths • GCOEA", category: "Physics, Chemistry, Maths", slots: ["17M", "18M", "19A", "21A", "26M", "27A"] },
  { srNo: 34, name: "Dr. Shamal K Doifode", title: "Faculty in Physics, Chemistry, Maths • GCOEA", category: "Physics, Chemistry, Maths", slots: ["17A", "19M", "20M", "23M", "25A", "30M"] },
  { srNo: 35, name: "Dr Swati S Mathurkar", title: "Faculty in Physics, Chemistry, Maths • GCOEA", category: "Physics, Chemistry, Maths", slots: ["18M", "20M", "21A", "25A", "27A", "30M"] },

  // Professor of Practice AY. 2026-27 (Sr. No. 36 - 37)
  { srNo: 36, name: "Prof Pradip R Khawale", title: "Professor of Practice AY. 2026-27 • GCOEA", category: "Professor of Practice AY. 2026-27", slots: ["17A", "19M", "20M", "21A", "25A"] },
  { srNo: 37, name: "Prof Sunil H Londhe", title: "Professor of Practice AY. 2026-27 • GCOEA", category: "Professor of Practice AY. 2026-27", slots: ["18M", "19A", "21M", "23M", "26M"] },

  // Adjunct Faculty AY. 2026-27 (Sr. No. 38 - 46)
  { srNo: 38, name: "Dr. Mangesh L Gulhane", title: "Adjunct Faculty AY. 2026-27 • GCOEA", category: "Adjunct Faculty AY. 2026-27", slots: ["17M", "18M", "19A", "21A", "25A", "27A", "02M", "03A"] },
  { srNo: 39, name: "Dr. Naresh P Jawarkar", title: "Adjunct Faculty AY. 2026-27 • GCOEA", category: "Adjunct Faculty AY. 2026-27", slots: ["17A", "18A", "19M", "21A", "25A", "27M", "02M"] },
  { srNo: 40, name: "Dr. Mir Ashfaque Ali", title: "Adjunct Faculty AY. 2026-27 • GCOEA", category: "Adjunct Faculty AY. 2026-27", slots: ["18M", "19A", "20M", "21A", "25A", "26M", "27A", "03M"] },
  { srNo: 41, name: "Dr Sharad P Kandalkar", title: "Adjunct Faculty AY. 2026-27 • GCOEA", category: "Adjunct Faculty AY. 2026-27", slots: ["17A", "19M", "20M", "21A", "25A", "27M", "03A"] },
  { srNo: 42, name: "Dr Ajay A Awate", title: "Adjunct Faculty AY. 2026-27 • GCOEA", category: "Adjunct Faculty AY. 2026-27", slots: ["17M", "18M", "19M", "20M", "30M", "02M", "03A"] },
  { srNo: 43, name: "Prof M M Deshmukh", title: "Adjunct Faculty AY. 2026-27 • GCOEA", category: "Adjunct Faculty AY. 2026-27", slots: ["18M", "19A", "21M", "23M", "25A", "27A", "03A"] },
  { srNo: 44, name: "Dr P P Bedekar", title: "Adjunct Faculty AY. 2026-27 • GCOEA", category: "Adjunct Faculty AY. 2026-27", slots: ["17A", "19A", "21M", "23M", "25A", "27A", "03A"] },
  { srNo: 45, name: "Dr V M Jape", title: "Adjunct Faculty AY. 2026-27 • GCOEA", category: "Adjunct Faculty AY. 2026-27", slots: ["17M", "18M", "19A", "21M", "23M", "25A", "30M", "02M"] },
  { srNo: 46, name: "Prof Narendra Bedare", title: "Adjunct Faculty AY. 2026-27 • GCOEA", category: "Adjunct Faculty AY. 2026-27", slots: ["17A", "19M", "20M", "21A", "23M", "25A", "26M"] },
];

export const FACULTY_MEMBERS: FacultyMember[] = RAW_FACULTY_SCHEDULE.map(f => ({
  id: `f-${f.srNo}`,
  srNo: f.srNo,
  name: f.name,
  title: f.title,
  category: f.category,
  totalDuties: f.slots.length,
}));

let dutyCounter = 0;
export const INITIAL_DUTIES: DutyItem[] = RAW_FACULTY_SCHEDULE.flatMap(faculty =>
  faculty.slots.map(code => {
    const meta = SLOT_LOOKUP[code];
    dutyCounter += 1;
    return {
      id: `d-${dutyCounter}`,
      invigilator: faculty.name,
      date: meta.date,
      dateLabel: meta.dateLabel,
      shift: meta.shift,
      timing: meta.timing,
      slotCode: code,
      status: "Scheduled" as const,
    };
  })
);

export const GENERAL_INSTRUCTIONS = [
  "All Invigilators should report to Examination control room 30 minutes before the scheduled time for start of examination (10:30 AM for Morning Shift and 2:00 PM for Afternoon Shift).",
  "The question papers will be handed over at control room and that too, to the invigilators only.",
  "Expert Faculties are not allowed as alternatives for Examination duties.",
  "Ensure identity verification of candidates using official Hall Tickets / College ID Cards; mobile phones and smartwatches are strictly prohibited inside examination halls.",
  "In case of any urgent emergency requiring duty relief, submit a formal Duty Swap Request at least 24 hours prior to Exam In-Charge Dr. K. S. Wasankar or Co-Coordinators Exam Dr. S. D. Londhe & Dr. V. R. Raut.",
  "Collection of filled answer books must be physically counted and handed over to the Examination Control Room with proper signatures."
];
