import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { theme } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';

// Replace with your actual Google Client ID from Google Cloud Console
// For development, you can use a placeholder or leave empty to disable Google Sign-In
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'placeholder-client-id'; 

const AppContent: React.FC = () => {
  const { isAuthenticated, loading, login, signup, googleLogin, error } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginForm 
        onLogin={login}
        onSignup={signup}
        googleLogin={googleLogin}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <AttendanceProvider>
      <Dashboard />
    </AttendanceProvider>
  );
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/*" element={<AppContent />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

