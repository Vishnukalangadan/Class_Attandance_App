import styled from 'styled-components';
import { Box, Typography } from '@mui/material';

export const StatsContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-top: 0.75rem;
  }
`;

export const StatCard = styled(Box)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 600px) {
    padding: 1rem;
    border-radius: 8px;
  }
`;

export const StatNumber = styled(Typography)`
  font-size: 2.5rem !important;
  font-weight: bold !important;
  margin-bottom: 0.5rem !important;

  @media (max-width: 600px) {
    font-size: 2rem !important;
    margin-bottom: 0.25rem !important;
  }
`;

export const StatLabel = styled(Typography)`
  font-size: 1rem !important;
  color: #666 !important;
  font-weight: 500 !important;

  @media (max-width: 600px) {
    font-size: 0.9rem !important;
  }
`;

export const TotalStatCard = styled(StatCard)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  ${StatNumber} {
    color: white !important;
  }

  ${StatLabel} {
    color: rgba(255, 255, 255, 0.9) !important;
  }

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

export const PresentStatCard = styled(StatCard)`
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;

  ${StatNumber} {
    color: white !important;
  }

  ${StatLabel} {
    color: rgba(255, 255, 255, 0.9) !important;
  }

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

export const AbsentStatCard = styled(StatCard)`
  background: linear-gradient(135deg, #f44336 0%, #da190b 100%);
  color: white;

  ${StatNumber} {
    color: white !important;
  }

  ${StatLabel} {
    color: rgba(255, 255, 255, 0.9) !important;
  }

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;