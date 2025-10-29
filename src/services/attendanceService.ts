import { DailyAttendance, Student } from '../types/attendance';

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class AttendanceService {
  // API methods for attendance data
  static async fetchAttendanceData(): Promise<{ [date: string]: DailyAttendance }> {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching attendance data from API:', error);
      throw error;
    }
  }

  static async fetchAttendanceForDate(date: string): Promise<DailyAttendance> {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${date}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching attendance for date:', error);
      throw error;
    }
  }

  static async saveAttendanceForDate(date: string, students: Student[]): Promise<DailyAttendance> {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, students }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving attendance data:', error);
      throw error;
    }
  }

  static async updateAttendanceForDate(date: string, students: Student[]): Promise<DailyAttendance> {
    try {
      // First try to update existing record
      let response = await fetch(`${API_BASE_URL}/attendance/${date}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students }),
      });

      // If record doesn't exist (404), create it
      if (response.status === 404) {
        response = await fetch(`${API_BASE_URL}/attendance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date, students }),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating attendance data:', error);
      throw error;
    }
  }

  // API methods for students
  static async fetchStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const students = await response.json();
      // Transform to match frontend format
      return students.map((student: any) => ({
        id: student._id, // Use MongoDB ObjectId
        name: student.name,
        fnStatus: 'unmarked',
        anStatus: 'unmarked'
      }));
    } catch (error) {
      console.error('Error fetching students from API:', error);
      throw error;
    }
  }

  static async createStudent(studentData: { name: string; email?: string; rollNumber?: string }): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const student = await response.json();
      return {
        id: student._id,
        name: student.name,
        fnStatus: 'unmarked',
        anStatus: 'unmarked'
      };
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  static async updateStudent(studentId: string, studentData: { name: string; email?: string; rollNumber?: string }): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const student = await response.json();
      return {
        id: student._id,
        name: student.name,
        fnStatus: 'unmarked',
        anStatus: 'unmarked'
      };
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  static async deleteStudent(studentId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}