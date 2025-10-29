import styled from 'styled-components';
import { Container } from '@mui/material';

export const CalendarPageContainer = styled(Container)`
  padding: 2rem 1rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
  }
`;

export const AttendancePageContainer = styled(Container)`
  padding: 2rem 1rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
  }
`;

export const BackButton = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
  color: #1976d2;
  font-weight: 600;
  transition: color 0.3s ease;

  &:hover {
    color: #1565c0;
  }

  @media (max-width: 600px) {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
`;