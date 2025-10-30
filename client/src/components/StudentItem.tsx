import React from 'react';
import { Student } from '../types/attendance';
import {
  StudentItemContainer,
  StudentName,
  ButtonGroup,
  TickButton,
  CrossButton,
  EditButton,
} from './styled/StudentItem';

interface StudentItemProps {
  student: Student;
  onAttendanceChange: (studentId: string, status: 'present' | 'absent' | 'unmarked') => void;
  onEditStart?: (studentId: string) => void; // Optional callback for when edit starts
  session?: 'FN' | 'AN'; // Session information
  isEditing?: boolean; // Whether this student is currently being edited
}

const StudentItem: React.FC<StudentItemProps> = ({ student, onAttendanceChange, onEditStart, session = 'FN', isEditing = false }) => {
  const handleTick = () => {
    onAttendanceChange(student.id, 'present');
  };

  const handleCross = () => {
    onAttendanceChange(student.id, 'absent');
  };

  const handleEdit = () => {
    // Notify parent that edit has started if callback is provided
    if (onEditStart) {
      onEditStart(student.id);
    }
  };

  // Determine attendance status based on session
  const attendanceStatus = session === 'FN' ? student.fnStatus : student.anStatus;

  const isPresent = attendanceStatus === 'present';
  const isAbsent = attendanceStatus === 'absent';
  // const isUnmarked = !isPresent && !isAbsent; // Removed unused variable

  return (
    <StudentItemContainer>
      <StudentName>{student.name}</StudentName>
      <ButtonGroup>
        {!isEditing ? (
          // Not in edit mode
          isPresent || isAbsent ? (
            // Show current status with edit button
            <>
              {isPresent && (
                <TickButton variant="contained" disabled>
                  ✓
                </TickButton>
              )}
              {isAbsent && (
                <CrossButton variant="contained" disabled>
                  ✗
                </CrossButton>
              )}
              <EditButton onClick={handleEdit}>
                ✏️ Edit
              </EditButton>
            </>
          ) : (
            // Show both buttons for unmarked students
            <>
              <TickButton
                variant="outlined"
                onClick={handleTick}
              >
                ✓
              </TickButton>
              <CrossButton
                variant="outlined"
                onClick={handleCross}
              >
                ✗
              </CrossButton>
            </>
          )
        ) : (
          // In edit mode - show both buttons as selectable options
          <>
            <TickButton
              variant="outlined"
              onClick={handleTick}
            >
              ✓
            </TickButton>
            <CrossButton
              variant="outlined"
              onClick={handleCross}
            >
              ✗
            </CrossButton>
          </>
        )}
      </ButtonGroup>
    </StudentItemContainer>
  );
};

export default StudentItem;