import styled from 'styled-components';
import { Box, Button } from '@mui/material';

export const StudentItemContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 600px) {
    padding: 0.75rem;
    margin: 0.25rem 0;
    flex-direction: column;
    align-items: stretch;
  }
`;

export const StudentName = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  flex: 1;

  @media (max-width: 600px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 600px) {
    justify-content: center;
    width: 100%;
  }
`;

export const TickButton = styled(Button)`
  background: #4caf50 !important;
  color: white !important;
  border-radius: 20px !important;
  padding: 0.5rem 1.5rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  min-width: 50px !important;
  font-size: 1rem !important;

  &:hover:not(:disabled) {
    background: #45a049 !important;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.8 !important;
    cursor: not-allowed !important;
  }

  @media (max-width: 600px) {
    padding: 0.4rem 1rem !important;
    font-size: 0.9rem !important;
    flex: 1;
  }
`;

export const CrossButton = styled(Button)`
  background: #f44336 !important;
  color: white !important;
  border-radius: 20px !important;
  padding: 0.5rem 1.5rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  min-width: 50px !important;
  font-size: 1rem !important;

  &:hover:not(:disabled) {
    background: #da190b !important;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.8 !important;
    cursor: not-allowed !important;
  }

  @media (max-width: 600px) {
    padding: 0.4rem 1rem !important;
    font-size: 0.9rem !important;
    flex: 1;
  }
`;

export const EditButton = styled(Button)`
  background: #ff9800 !important;
  color: white !important;
  border-radius: 20px !important;
  padding: 0.5rem 1rem !important;
  font-weight: 600 !important;
  text-transform: none !important;
  min-width: 80px !important;
  font-size: 0.9rem !important;

  &:hover {
    background: #f57c00 !important;
    transform: scale(1.05);
  }

  @media (max-width: 600px) {
    padding: 0.4rem 0.8rem !important;
    font-size: 0.8rem !important;
    min-width: 60px !important;
  }
`;