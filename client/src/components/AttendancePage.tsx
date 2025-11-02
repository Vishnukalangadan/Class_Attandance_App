import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Button,
  Snackbar,
  Backdrop
} from '@mui/material';
import { CalendarToday, School, ArrowBack, Save, CheckCircle } from '@mui/icons-material';
import { useAttendance } from '../context/AttendanceContext';
import StudentItem from './StudentItem';
import AttendanceStatsComponent from './AttendanceStats';
import {
  AttendancePaper,
  HeaderSection,
  StudentListSection,
  StatsSection,
} from './styled/AttendanceContainer';
import {
  AttendancePageContainer,
  BackButton,
} from './styled/CalendarContainer';
import { Student, AttendanceStats } from '../types/attendance';

interface AttendancePageProps {
  selectedDate: string;
  onBackToCalendar: () => void;
}

interface EditingStudent {
  studentId: string;
  originalStatus: 'present' | 'absent' | 'unmarked';
  session: 'FN' | 'AN';
}

const AttendancePage: React.FC<AttendancePageProps> = ({ selectedDate, onBackToCalendar }) => {
  const { getAttendanceForDate, batchUpdateAttendance, loading, error, students } = useAttendance();
  const [attendance, setAttendance] = useState<{date: string; students: Student[]} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<'FN' | 'AN'>('FN'); // Default to Forenoon
  // Track students currently being edited
  const [editingStudents, setEditingStudents] = useState<EditingStudent[]>([]);
  // Track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // Track saving state
  const [isSaving, setIsSaving] = useState(false);
  // Snackbar for success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const loadAttendanceData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAttendanceForDate(selectedDate);
      
      // Always show all students, not just the ones with attendance marked
      if (students && students.length > 0) {
        const allStudents = students.map(student => {
          const attendanceStudent = data.students.find(s => s.id === student.id);
          return {
            ...student,
            fnStatus: attendanceStudent ? attendanceStudent.fnStatus : 'unmarked',
            anStatus: attendanceStudent ? attendanceStudent.anStatus : 'unmarked'
          };
        });
        
        setAttendance({
          ...data,
          students: allStudents
        });
      } else {
        // Fallback to the data from API if students not loaded yet
        setAttendance(data);
      }
      
      // Clear editing students when loading fresh data
      setEditingStudents([]);
    } catch (err) {
      console.error('Error loading attendance data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, students, getAttendanceForDate]);

  useEffect(() => {
    loadAttendanceData();
  }, [loadAttendanceData]);
  
  const attendanceStats = useMemo((): AttendanceStats => {
    if (!attendance) return { total: 0, presentFN: 0, absentFN: 0, presentAN: 0, absentAN: 0 };
    
    const total = attendance.students.length;
    
    // Calculate stats with editing students taken into account
    let presentFN = 0;
    let absentFN = 0;
    let presentAN = 0;
    let absentAN = 0;
    
    attendance.students.forEach(student => {
      // Check if this student is currently being edited
      const isEditingFN = editingStudents.some(
        edit => edit.studentId === student.id && edit.session === 'FN'
      );
      
      // If not editing, count the actual status
      if (!isEditingFN) {
        if (student.fnStatus === 'present') presentFN++;
        if (student.fnStatus === 'absent') absentFN++;
      }
    });
    
    // Recalculate for afternoon session
    attendance.students.forEach(student => {
      // Check if this student is currently being edited
      const isEditingAN = editingStudents.some(
        edit => edit.studentId === student.id && edit.session === 'AN'
      );
      
      // If not editing, count the actual status
      if (!isEditingAN) {
        if (student.anStatus === 'present') presentAN++;
        if (student.anStatus === 'absent') absentAN++;
      }
    });
    
    return { total, presentFN, absentFN, presentAN, absentAN };
  }, [attendance, editingStudents]);

  const handleAttendanceChange = async (studentId: string, status: 'present' | 'absent' | 'unmarked') => {
    // Remove only the specific student from editing students when change is made
    setEditingStudents(prev => 
      prev.filter(edit => !(edit.studentId === studentId && edit.session === session))
    );
    
    // Update local state only (no API call)
    setAttendance(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        students: prev.students.map(student => {
          if (student.id === studentId) {
            // Update only the specific student's status for the current session
            if (session === 'FN') {
              return { ...student, fnStatus: status };
            } else {
              return { ...student, anStatus: status };
            }
          }
          return student;
        })
      };
    });
    
    // Mark that there are unsaved changes
    setHasUnsavedChanges(true);
  };

  // Handler for when student enters edit mode (this will be called from the StudentItem)
  const handleStudentEdit = (studentId: string) => {
    if (!attendance) return;
    
    // Find the student and their current status
    const student = attendance.students.find(s => s.id === studentId);
    if (!student) return;
    
    const currentStatus = session === 'FN' ? student.fnStatus : student.anStatus;
    
    // Add to editing students
    const editingStudent: EditingStudent = {
      studentId,
      originalStatus: currentStatus,
      session
    };
    
    setEditingStudents(prev => {
      // Remove any existing edit for this student/session
      const filtered = prev.filter(
        edit => !(edit.studentId === studentId && edit.session === session)
      );
      // Add the new editing student
      return [...filtered, editingStudent];
    });
  };

  // Handler for session button clicks
  const handleSessionChange = (sessionValue: 'FN' | 'AN') => {
    setSession(sessionValue);
    // Clear editing students when session changes
    setEditingStudents([]);
  };

  // Handler for saving all attendance changes
  const handleSaveAttendance = async () => {
    if (!attendance || !hasUnsavedChanges) return;
    
    try {
      setIsSaving(true);
      
      // Save all students' attendance in a single API call
      await batchUpdateAttendance(selectedDate, attendance.students);
      
      setHasUnsavedChanges(false);
      setShowSuccessMessage(true);
    } catch (err) {
      console.error('Error saving attendance:', err);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSuccessMessage(false);
  };

  const formatDate = (dateString: string) => {
    // Parse the date string as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day+1);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || isLoading) {
    return (
      <AttendancePageContainer maxWidth="md">
        <AttendancePaper elevation={3}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading attendance data...
            </Typography>
          </Box>
        </AttendancePaper>
      </AttendancePageContainer>
    );
  }

  if (error) {
    return (
      <AttendancePageContainer maxWidth="md">
        <AttendancePaper elevation={3}>
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
          <BackButton onClick={onBackToCalendar}>
            <ArrowBack sx={{ mr: 1 }} />
            Back to Calendar
          </BackButton>
        </AttendancePaper>
      </AttendancePageContainer>
    );
  }

  if (!attendance) {
    return (
      <AttendancePageContainer maxWidth="md">
        <AttendancePaper elevation={3}>
          <Alert severity="warning" sx={{ m: 2 }}>
            No attendance data found for this date.
          </Alert>
          <BackButton onClick={onBackToCalendar}>
            <ArrowBack sx={{ mr: 1 }} />
            Back to Calendar
          </BackButton>
        </AttendancePaper>
      </AttendancePageContainer>
    );
  }

  return (
    <>
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={isSaving}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Saving attendance...
        </Typography>
      </Backdrop>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            alignItems: 'center',
            fontSize: '1rem',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
          icon={<CheckCircle />}
        >
          Attendance saved successfully!
        </Alert>
      </Snackbar>

      <AttendancePageContainer maxWidth="md">
      <AttendancePaper elevation={3}>
        <BackButton onClick={onBackToCalendar}>
          <ArrowBack sx={{ mr: 1 }} />
          Back to Calendar
        </BackButton>

        <HeaderSection>
          <Box display="flex" alignItems="center" justifyContent="center" mb={{ xs: 1, sm: 2 }}>
            <School sx={{ 
              fontSize: { xs: 30, sm: 40 }, 
              color: 'primary.main', 
              mr: { xs: 1, sm: 2 } 
            }} />
            <Typography variant="h4" component="h1" color="primary" sx={{ 
              fontSize: { xs: '1.5rem', sm: '2.125rem' }
            }}>
              Class Attendance
            </Typography>
          </Box>
          
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="center" mb={{ xs: 1, sm: 2 }} gap={1}>
            <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 0 }}>
              <CalendarToday sx={{ 
                fontSize: { xs: 20, sm: 24 }, 
                color: 'text.secondary', 
                mr: 1 
              }} />
              <Typography variant="h6" color="text.secondary" sx={{ 
                fontSize: { xs: '0.9rem', sm: '1.25rem' },
                mr: { xs: 0, sm: 3 }
              }}>
                {formatDate(selectedDate)}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 0.5, sm: 1 },
              width: { xs: '100%', sm: 'auto' },
              justifyContent: 'center'
            }}>
              <button
                onClick={() => handleSessionChange('FN')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: session === 'FN' ? '#1976d2' : '#f5f5f5',
                  color: session === 'FN' ? 'white' : 'black',
                  cursor: 'pointer',
                  fontWeight: session === 'FN' ? 'bold' : 'normal',
                  fontSize: '0.8rem',
                  flex: 1
                }}
              >
                Forenoon (FN)
              </button>
              <button
                onClick={() => handleSessionChange('AN')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: session === 'AN' ? '#1976d2' : '#f5f5f5',
                  color: session === 'AN' ? 'white' : 'black',
                  cursor: 'pointer',
                  fontWeight: session === 'AN' ? 'bold' : 'normal',
                  fontSize: '0.8rem',
                  flex: 1
                }}
              >
                Afternoon (AN)
              </button>
            </Box>
          </Box>
        </HeaderSection>

        <StudentListSection>
          <Typography variant="h6" gutterBottom sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontWeight: 600,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            Student List - {session === 'FN' ? 'Forenoon' : 'Afternoon'} Session
          </Typography>
          {attendance.students.map((student) => (
            <StudentItem
              key={student.id}
              student={student}
              onAttendanceChange={handleAttendanceChange}
              onEditStart={handleStudentEdit}
              session={session}
              isEditing={editingStudents.some(edit => edit.studentId === student.id && edit.session === session)}
            />
          ))}
        </StudentListSection>

        <StatsSection>
          <Typography variant="h6" gutterBottom sx={{ 
            mb: { xs: 1, sm: 2 }, 
            fontWeight: 600,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            Attendance Summary - {session === 'FN' ? 'Forenoon' : 'Afternoon'} Session
          </Typography>
          <AttendanceStatsComponent stats={attendanceStats} session={session} />
        </StatsSection>

        {/* Save Button */}
        {hasUnsavedChanges && (
          <Box sx={{ 
            mt: 3, 
            display: 'flex', 
            justifyContent: 'center',
            borderTop: '2px solid #e0e0e0',
            pt: 3
          }}>
            <Button
              variant="contained"
              size="large"
              startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <Save />}
              disabled={isSaving}
              onClick={handleSaveAttendance}
              sx={{
                minWidth: { xs: '100%', sm: '250px' },
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                }
              }}
            >
              {isSaving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </Box>
        )}
      </AttendancePaper>
    </AttendancePageContainer>
    </>
  );
};

export default AttendancePage;