export interface Student {
  id: string;
  name: string;
  fnStatus: 'present' | 'absent' | 'unmarked';
  anStatus: 'present' | 'absent' | 'unmarked';
}

export interface AttendanceStats {
  total: number;
  presentFN: number;
  absentFN: number;
  presentAN: number;
  absentAN: number;
}

export interface DailyAttendance {
  date: string; // YYYY-MM-DD format
  students: Student[];
}

export interface CalendarViewProps {
  onDateSelect: (date: string) => void;
}