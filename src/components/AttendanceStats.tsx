import React from 'react';
import { AttendanceStats as Stats } from '../types/attendance';
import {
  StatsContainer,
  TotalStatCard,
  PresentStatCard,
  AbsentStatCard,
  StatNumber,
  StatLabel,
} from './styled/StatsCard';

interface AttendanceStatsProps {
  stats: Stats;
  session: 'FN' | 'AN';
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ stats, session }) => {
  // Get the appropriate statistics based on the session
  const presentCount = session === 'FN' ? stats.presentFN : stats.presentAN;
  const absentCount = session === 'FN' ? stats.absentFN : stats.absentAN;
  
  return (
    <StatsContainer>
      <TotalStatCard>
        <StatNumber variant="h3">{stats.total}</StatNumber>
        <StatLabel variant="body1">Total Students</StatLabel>
      </TotalStatCard>
      
      <PresentStatCard>
        <StatNumber variant="h3">{presentCount}</StatNumber>
        <StatLabel variant="body1">Present</StatLabel>
      </PresentStatCard>
      
      <AbsentStatCard>
        <StatNumber variant="h3">{absentCount}</StatNumber>
        <StatLabel variant="body1">Absent</StatLabel>
      </AbsentStatCard>
    </StatsContainer>
  );
};

export default AttendanceStats;