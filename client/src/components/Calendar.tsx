import React, { useState } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight, CalendarToday } from '@mui/icons-material';
import { CalendarViewProps } from '../types/attendance';
import styled from 'styled-components';

const CalendarContainer = styled(Paper)`
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const CalendarHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;

  @media (max-width: 600px) {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
  }
`;

const MonthYear = styled(Typography)`
  font-size: 1.8rem !important;
  font-weight: 600 !important;
  color: #1976d2 !important;

  @media (max-width: 600px) {
    font-size: 1.4rem !important;
  }
`;

const DayHeader = styled(Box)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  
  // Mobile responsive styles
  @media (max-width: 600px) {
    gap: 0.1rem;
    margin-bottom: 0.25rem;
  }
`;

const DayLabel = styled(Typography)`
  text-align: center !important;
  font-weight: 600 !important;
  color: #666 !important;
  padding: 0.5rem !important;
  
  // Mobile responsive styles to prevent overflow
  @media (max-width: 600px) {
    padding: 0.25rem 0 !important;
    font-size: 0.7rem !important;
  }
`;

const CalendarGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  
  // Mobile responsive styles
  @media (max-width: 600px) {
    gap: 0.1rem;
  }
`;

const DayButton = styled(Paper)<{ isCurrentMonth: boolean; isToday: boolean; isSelected: boolean }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => {
    if (props.isSelected) return '#1976d2';
    if (props.isToday) return '#e3f2fd';
    return props.isCurrentMonth ? 'white' : '#f5f5f5';
  }} !important;
  color: ${props => {
    if (props.isSelected) return 'white';
    if (props.isToday) return '#1976d2';
    return props.isCurrentMonth ? '#333' : '#999';
  }} !important;
  border: ${props => props.isToday ? '2px solid #1976d2' : '1px solid #e0e0e0'};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${props => props.isSelected ? '#1565c0' : '#f0f0f0'} !important;
  }
  
  // Mobile responsive styles
  @media (max-width: 600px) {
    aspect-ratio: 1.2;
  }
`;

const DayNumber = styled(Typography)`
  font-weight: 600 !important;
  font-size: 1rem !important;
  
  // Mobile responsive styles
  @media (max-width: 600px) {
    font-size: 0.8rem !important;
  }
`;

const Calendar: React.FC<CalendarViewProps> = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getLastDayOfPreviousMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (date: Date) => {
    const dateString = formatDate(date);
    setSelectedDate(dateString);
    onDateSelect(dateString);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const lastDayOfPrevMonth = getLastDayOfPreviousMonth(currentDate);
    
    const days = [];

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth - i;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
      days.push(
        <DayButton
          key={`prev-${day}`}
          isCurrentMonth={false}
          isToday={isToday(date)}
          isSelected={selectedDate === formatDate(date)}
          onClick={() => handleDateClick(date)}
        >
          <DayNumber>{day}</DayNumber>
        </DayButton>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push(
        <DayButton
          key={day}
          isCurrentMonth={true}
          isToday={isToday(date)}
          isSelected={selectedDate === formatDate(date)}
          onClick={() => handleDateClick(date)}
        >
          <DayNumber>{day}</DayNumber>
        </DayButton>
      );
    }

    // Next month's leading days
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      days.push(
        <DayButton
          key={`next-${day}`}
          isCurrentMonth={false}
          isToday={isToday(date)}
          isSelected={selectedDate === formatDate(date)}
          onClick={() => handleDateClick(date)}
        >
          <DayNumber>{day}</DayNumber>
        </DayButton>
      );
    }

    return days;
  };

  return (
    <CalendarContainer elevation={3}>
      <CalendarHeader>
        <Box display="flex" alignItems="center">
          <CalendarToday sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <MonthYear variant="h4">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </MonthYear>
        </Box>
        <Box>
          <IconButton onClick={goToPreviousMonth} size="large">
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={goToNextMonth} size="large">
            <ChevronRight />
          </IconButton>
        </Box>
      </CalendarHeader>

      <DayHeader>
        {dayNames.map(day => (
          <DayLabel key={day} variant="body1">
            {day}
          </DayLabel>
        ))}
      </DayHeader>

      <CalendarGrid>
        {renderCalendarDays()}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default Calendar;