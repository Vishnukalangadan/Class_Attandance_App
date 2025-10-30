import styled from 'styled-components';
import { Container, Paper } from '@mui/material';

export const StyledContainer = styled(Container)`
  padding: 2rem 1rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
  }
`;

export const AttendancePaper = styled(Paper)`
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  margin: 2rem 0.5rem;

  @media (max-width: 600px) {
    padding: 1rem;
    border-radius: 12px;
    margin: 0.5rem;
  }
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  border-bottom: 2px solid #e0e0e0;

  @media (max-width: 600px) {
    margin-bottom: 1rem;
    padding: 0.5rem;
  }
`;

export const StudentListSection = styled.div`
  margin-bottom: 2rem;
  padding: 0;

  @media (max-width: 600px) {
    margin-bottom: 1rem;
  }
`;

export const StatsSection = styled.div`
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;

  @media (max-width: 600px) {
    padding: 1rem;
    border-radius: 8px;
    margin: 0.5rem 0;
  }
`;