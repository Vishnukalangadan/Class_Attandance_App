import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Student, DailyAttendance } from '../types/attendance';
import { AttendanceService } from '../services/attendanceService';

interface AttendanceContextType {
  attendanceData: { [date: string]: DailyAttendance };
  students: Student[];
  loading: boolean;
  error: string | null;
  updateAttendance: (date: string, studentId: string, session: 'FN' | 'AN', status: 'present' | 'absent' | 'unmarked') => Promise<void>;
  getAttendanceForDate: (date: string) => Promise<DailyAttendance>;
  refreshData: () => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attendanceData, setAttendanceData] = useState<{ [date: string]: DailyAttendance }>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [attendanceDataResult, studentsResult] = await Promise.all([
        AttendanceService.fetchAttendanceData(),
        AttendanceService.fetchStudents()
      ]);
      
      setAttendanceData(attendanceDataResult);
      setStudents(studentsResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error initializing data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const getAttendanceForDate = useCallback(async (date: string): Promise<DailyAttendance> => {
    try {
      // Check if we already have this date in memory
      if (attendanceData[date]) {
        return attendanceData[date];
      }

      // Fetch from API
      const attendance = await AttendanceService.fetchAttendanceForDate(date);
      
      // Update local state
      setAttendanceData(prev => ({
        ...prev,
        [date]: attendance
      }));
      
      return attendance;
    } catch (err) {
      console.error('Error fetching attendance for date:', err);
      throw err;
    }
  }, [attendanceData]);

  const updateAttendance = useCallback(async (date: string, studentId: string, session: 'FN' | 'AN', status: 'present' | 'absent' | 'unmarked') => {
    try {
      // Get current attendance for the date
      const currentAttendance = attendanceData[date] || await getAttendanceForDate(date);
      
      // Update the student's status for the specified session
      const updatedStudents = currentAttendance.students.map(student => {
        if (student.id === studentId) {
          if (session === 'FN') {
            return { ...student, fnStatus: status };
          } else {
            return { ...student, anStatus: status };
          }
        }
        return student;
      });
      
      // Save to API
      const updatedAttendance = await AttendanceService.updateAttendanceForDate(date, updatedStudents);
      
      // Update local state
      setAttendanceData(prev => ({
        ...prev,
        [date]: updatedAttendance
      }));
    } catch (err) {
      console.error('Error updating attendance:', err);
      setError(err instanceof Error ? err.message : 'Failed to update attendance');
      throw err;
    }
  }, [attendanceData, getAttendanceForDate]);

  const refreshData = useCallback(async () => {
    await initializeData();
  }, [initializeData]);

  const contextValue = useMemo(() => ({
    attendanceData,
    students,
    loading,
    error,
    updateAttendance,
    getAttendanceForDate,
    refreshData
  }), [attendanceData, students, loading, error, updateAttendance, getAttendanceForDate, refreshData]);

  return (
    <AttendanceContext.Provider value={contextValue}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};