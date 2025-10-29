import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Email,
  School,
} from '@mui/icons-material';
import styled from 'styled-components';

const LoginContainer = styled(Box)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const LoginPaper = styled(Paper)`
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  max-width: 450px;
  width: 100%;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 2rem;
`;

const TabPanel = styled(Box)`
  margin-top: 2rem;
`;

const FormField = styled(TextField)`
  margin-bottom: 1.5rem !important;
  width: 100% !important;
`;

const SubmitButton = styled(Button)`
  width: 100% !important;
  padding: 1rem !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  text-transform: none !important;
  margin-top: 1rem !important;
`;

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
  loading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSignup, loading, error }) => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Handle error dialog
  React.useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setOpenErrorDialog(true);
    }
  }, [error]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginData.email, loginData.password);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please make sure both password fields are identical.');
      setOpenErrorDialog(true);
      return;
    }
    onSignup(signupData.name, signupData.email, signupData.password);
  };

  const handleInputChange = (field: string, value: string, form: 'login' | 'signup') => {
    if (form === 'login') {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setSignupData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
    setErrorMessage('');
  };

  return (
    <LoginContainer>
      <LoginPaper elevation={3}>
        <HeaderSection>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <School sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
            <Typography variant="h3" component="h1" color="primary" fontWeight="bold">
              Attendance
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary">
            Manage your class attendance efficiently
          </Typography>
        </HeaderSection>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>

        <TabPanel>
          {tabValue === 0 ? (
            // Login Form
            <form onSubmit={handleLoginSubmit}>
              <FormField
                label="Email"
                type="email"
                value={loginData.email}
                onChange={(e) => handleInputChange('email', e.target.value, 'login')}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              
              <FormField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => handleInputChange('password', e.target.value, 'login')}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <SubmitButton
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Person />}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </SubmitButton>
            </form>
          ) : (
            // Signup Form
            <form onSubmit={handleSignupSubmit}>
              <FormField
                label="Full Name"
                type="text"
                value={signupData.name}
                onChange={(e) => handleInputChange('name', e.target.value, 'signup')}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <FormField
                label="Email"
                type="email"
                value={signupData.email}
                onChange={(e) => handleInputChange('email', e.target.value, 'signup')}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              
              <FormField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={signupData.password}
                onChange={(e) => handleInputChange('password', e.target.value, 'signup')}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <FormField
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={signupData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value, 'signup')}
                required
                error={signupData.password !== signupData.confirmPassword && signupData.confirmPassword !== ''}
                helperText={
                  signupData.password !== signupData.confirmPassword && signupData.confirmPassword !== ''
                    ? 'Passwords do not match'
                    : ''
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <SubmitButton
                type="submit"
                variant="contained"
                disabled={loading || signupData.password !== signupData.confirmPassword}
                startIcon={loading ? <CircularProgress size={20} /> : <Person />}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </SubmitButton>
            </form>
          )}
        </TabPanel>
      </LoginPaper>

      {/* Error Dialog */}
      <Dialog
        open={openErrorDialog}
        onClose={handleCloseErrorDialog}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">
          {tabValue === 0 ? "Login Error" : "Signup Error"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            {errorMessage || "An unexpected error occurred. Please try again."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </LoginContainer>
  );
};

export default LoginForm;