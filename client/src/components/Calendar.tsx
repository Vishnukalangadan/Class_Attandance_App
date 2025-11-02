import React, { useState } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight,  } from '@mui/icons-material';
import { CalendarViewProps } from '../types/attendance';
import styled from 'styled-components';

const CalendarContainer = styled(Paper)`
  padding: 2.5rem 2rem;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  max-width: 480px;
  margin: 0 auto;

  @media (max-width: 600px) {
    padding: 1.5rem 1rem;
    border-radius: 20px;
  }
`;

const CalendarHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 0;

  @media (max-width: 600px) {
    margin-bottom: 1.5rem;
  }
`;

const MonthYear = styled(Typography)`
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #1a1a1a !important;
  flex: 1;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 1.25rem !important;
  }
`;

const DayHeader = styled(Box)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 600px) {
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }
`;

const DayLabel = styled(Typography)`
  text-align: center !important;
  font-weight: 500 !important;
  color: #999 !important;
  font-size: 0.875rem !important;
  padding: 0.5rem 0 !important;
  
  @media (max-width: 600px) {
    padding: 0.25rem 0 !important;
    font-size: 0.75rem !important;
  }
`;

const CalendarGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  
  @media (max-width: 600px) {
    gap: 0.25rem;
  }
`;

const DayButton = styled(Box)<{ isCurrentMonth: boolean; isToday: boolean; isSelected: boolean }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: ${props => props.isToday ? '50%' : '8px'};
  background: ${props => {
    if (props.isToday) return '#2196F3';
    return 'transparent';
  }} !important;
  color: ${props => {
    if (props.isToday) return 'white';
    return props.isCurrentMonth ? '#1a1a1a' : '#bbb';
  }} !important;
  font-weight: ${props => props.isToday ? '600' : '400'} !important;

  &:hover {
    background: ${props => {
      if (props.isToday) return '#1976d2';
      return '#f5f5f5';
    }} !important;
    border-radius: 8px;
  }
  
  @media (max-width: 600px) {
    border-radius: ${props => props.isToday ? '50%' : '6px'};
  }
`;

const DayNumber = styled(Typography)`
  font-size: 0.95rem !important;
  
  @media (max-width: 600px) {
    font-size: 0.85rem !important;
  }
`;

const TodayIndicator = styled(Box)`
  margin-top: 1.5rem;
  padding-top: 1rem;
  text-align: center;
  color: #2196F3;
  font-size: 0.9rem;
  font-weight: 500;
  
  @media (max-width: 600px) {
    margin-top: 1rem;
    font-size: 0.85rem;
  }
`;

const Calendar: React.FC<CalendarViewProps> = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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

  const getTodayString = () => {
    const today = new Date();
    const month = monthNames[today.getMonth()];
    const day = today.getDate();
    return `${month} ${day} Today`;
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
        <IconButton onClick={goToPreviousMonth} size="medium" sx={{ color: '#1a1a1a' }}>
          <ChevronLeft />
        </IconButton>
        <MonthYear variant="h5">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </MonthYear>
        <IconButton onClick={goToNextMonth} size="medium" sx={{ color: '#1a1a1a' }}>
          <ChevronRight />
        </IconButton>
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
      
      <TodayIndicator>
        {getTodayString()}
      </TodayIndicator>
    </CalendarContainer>
  );
};

export default Calendar;