import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Link,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AutoAwesome,
  Apple,
} from '@mui/icons-material';
import styled from 'styled-components';

const LoginContainer = styled(Box)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
  padding: 1rem;
  
  @media (max-width: 600px) {
    padding: 0.5rem;
  }
`;

const LoginPaper = styled(Paper)`
  padding: 3rem 2.5rem;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  background: #ffffff;
  max-width: 480px;
  width: 100%;
  
  @media (max-width: 600px) {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
`;

const HeaderSection = styled(Box)`
  text-align: left;
  margin-bottom: 2rem;
`;

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const LogoBox = styled(Box)`
  width: 48px;
  height: 48px;
  background: #1a1a1a;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled(Typography)`
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #1a1a1a !important;
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  width: 100%;
  margin-bottom: 2rem !important;
  
  .MuiToggleButton-root {
    flex: 1;
    padding: 0.75rem 2rem;
    border-radius: 50px !important;
    text-transform: none;
    font-size: 1rem;
    font-weight: 500;
    border: 1px solid #e0e0e0 !important;
    color: #666;
    
    &.Mui-selected {
      background: #4a90e2 !important;
      color: white !important;
      border-color: #4a90e2 !important;
      
      &:hover {
        background: #3a7bc8 !important;
      }
    }
    
    &:hover {
      background: #f5f5f5;
    }
  }
  
  @media (max-width: 600px) {
    .MuiToggleButton-root {
      padding: 0.6rem 1.5rem;
      font-size: 0.9rem;
    }
  }
`;

const FormField = styled(TextField)`
  margin-bottom: 1.25rem !important;
  width: 100% !important;
  
  .MuiOutlinedInput-root {
    border-radius: 50px !important;
    background: #f8f8f8;
    
    fieldset {
      border-color: #f8f8f8 !important;
    }
    
    &:hover fieldset {
      border-color: #e0e0e0 !important;
    }
    
    &.Mui-focused fieldset {
      border-color: #4a90e2 !important;
      border-width: 1px !important;
    }
  }
  
  .MuiOutlinedInput-input {
    padding: 1rem 1.25rem !important;
  }
  
  .MuiInputLabel-root {
    &.Mui-focused {
      color: #4a90e2 !important;
    }
  }
  
  @media (max-width: 600px) {
    .MuiOutlinedInput-input {
      padding: 0.85rem 1rem !important;
    }
  }
`;

const RememberMeSection = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  .MuiFormControlLabel-root {
    margin: 0;
  }
  
  .MuiCheckbox-root {
    color: #4a90e2;
    
    &.Mui-checked {
      color: #4a90e2;
    }
  }
  
  @media (max-width: 600px) {
    font-size: 0.875rem;
  }
`;

const SubmitButton = styled(Button)`
  width: 100% !important;
  padding: 1rem !important;
  font-size: 1.05rem !important;
  font-weight: 500 !important;
  border-radius: 50px !important;
  text-transform: none !important;
  background: #4a90e2 !important;
  box-shadow: none !important;
  margin-bottom: 1.5rem !important;
  
  &:hover {
    background: #3a7bc8 !important;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3) !important;
  }
  
  @media (max-width: 600px) {
    padding: 0.85rem !important;
    font-size: 0.95rem !important;
  }
`;

const DividerSection = styled(Box)`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #999;
  font-size: 0.875rem;
  
  .MuiDivider-root {
    flex: 1;
  }
  
  span {
    margin: 0 1rem;
  }
`;

const SocialButton = styled(Button)`
  width: 100% !important;
  padding: 0.85rem !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  border-radius: 50px !important;
  text-transform: none !important;
  margin-bottom: 0.75rem !important;
  box-shadow: none !important;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
  
  @media (max-width: 600px) {
    padding: 0.75rem !important;
    font-size: 0.9rem !important;
  }
`;

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
  googleLogin: (credential: string) => void;
  loading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSignup, googleLogin, loading, error }) => {
  const [tabValue, setTabValue] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  
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

  const handleTabChange = (event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue !== null) {
      setTabValue(newValue);
      setLoginData({ email: '', password: '' });
      setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
    }
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

  // Google Login Handler - only initialize if client ID is configured
  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      // Get user info from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });
      
      const userInfo = await userInfoResponse.json();
      
      // Send to backend for verification and user creation
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/auth/google`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: tokenResponse.access_token,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            googleId: userInfo.sub,
          }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        // Save token and user data
        localStorage.setItem('attendance_token', data.token);
        // Trigger login by reloading or updating auth state
        window.location.reload();
      } else {
        setErrorMessage(data.error || 'Google authentication failed');
        setOpenErrorDialog(true);
      }
    } catch (error) {
      console.error('Google login error:', error);
      setErrorMessage('Failed to authenticate with Google. Please try again.');
      setOpenErrorDialog(true);
    }
  };

  // Only use Google login if client ID is properly configured
  const isGoogleConfigured = process.env.REACT_APP_GOOGLE_CLIENT_ID && 
    process.env.REACT_APP_GOOGLE_CLIENT_ID !== 'placeholder-client-id';

  const googleLoginHandler = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setErrorMessage('Google Sign-In was cancelled or failed.');
      setOpenErrorDialog(true);
    },
  });

  return (
    <LoginContainer>
      <LoginPaper elevation={3}>
        <HeaderSection>
          <LogoContainer>
            <LogoBox>
              <AutoAwesome sx={{ color: 'white', fontSize: 28 }} />
            </LogoBox>
            <LogoText>Mark Your Attendance</LogoText>
          </LogoContainer>
          
          <Typography variant="h5" fontWeight="600" color="#1a1a1a" mb={0.5}>
            Welcome Back!
          </Typography>
          <Typography variant="body2" color="#999">
            We Are Happy To See You Again
          </Typography>
        </HeaderSection>

        <StyledToggleButtonGroup
          value={tabValue}
          exclusive
          onChange={handleTabChange}
        >
          <ToggleButton value="signin">Sign in</ToggleButton>
          <ToggleButton value="signup">Sign Up</ToggleButton>
        </StyledToggleButtonGroup>

        <Box>
          {tabValue === 'signin' ? (
            // Login Form
            <form onSubmit={handleLoginSubmit}>
              <FormField
                placeholder="Enter your email"
                type="email"
                value={loginData.email}
                onChange={(e) => handleInputChange('email', e.target.value, 'login')}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Email sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              
              <FormField
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) => handleInputChange('password', e.target.value, 'login')}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff sx={{ color: '#999' }} /> : <Visibility sx={{ color: '#999' }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <RememberMeSection>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2" color="#666">Remember me</Typography>}
                />
                <Link
                  href="#"
                  underline="none"
                  sx={{ color: '#4a90e2', fontSize: '0.875rem', fontWeight: 500 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenForgotPassword(true);
                  }}
                >
                  Forgot Password?
                </Link>
              </RememberMeSection>

              <SubmitButton
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </SubmitButton>
              
              <DividerSection>
                <Divider />
                <span>OR</span>
                <Divider />
              </DividerSection>
              
              <SocialButton
                variant="outlined"
                sx={{
                  borderColor: '#e0e0e0 !important',
                  color: '#666 !important',
                }}
                startIcon={
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                }
                onClick={() => {
                  if (isGoogleConfigured) {
                    googleLoginHandler();
                  } else {
                    setErrorMessage('Google Sign-In is not configured. Please add REACT_APP_GOOGLE_CLIENT_ID to your .env.development file.');
                    setOpenErrorDialog(true);
                  }
                }}
              >
                Log in with Google
              </SocialButton>
            </form>
          ) : (
            // Signup Form
            <form onSubmit={handleSignupSubmit}>
              <FormField
                placeholder="Enter your full name"
                type="text"
                value={signupData.name}
                onChange={(e) => handleInputChange('name', e.target.value, 'signup')}
                required
                variant="outlined"
              />

              <FormField
                placeholder="Enter your email"
                type="email"
                value={signupData.email}
                onChange={(e) => handleInputChange('email', e.target.value, 'signup')}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Email sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              
              <FormField
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                value={signupData.password}
                onChange={(e) => handleInputChange('password', e.target.value, 'signup')}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff sx={{ color: '#999' }} /> : <Visibility sx={{ color: '#999' }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              <FormField
                placeholder="Confirm your password"
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
                variant="outlined"
              />

              <SubmitButton
                type="submit"
                variant="contained"
                disabled={loading || signupData.password !== signupData.confirmPassword}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </SubmitButton>
              
              <DividerSection>
                <Divider />
                <span>OR</span>
                <Divider />
              </DividerSection>
              
              <SocialButton
                variant="outlined"
                sx={{
                  borderColor: '#e0e0e0 !important',
                  color: '#666 !important',
                }}
                startIcon={
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                }
                onClick={() => {
                  if (isGoogleConfigured) {
                    googleLoginHandler();
                  } else {
                    setErrorMessage('Google Sign-In is not configured. Please add REACT_APP_GOOGLE_CLIENT_ID to your .env.development file.');
                    setOpenErrorDialog(true);
                  }
                }}
              >
                Sign up with Google
              </SocialButton>
            </form>
          )}
        </Box>
      </LoginPaper>

      {/* Error Dialog */}
      <Dialog
        open={openErrorDialog}
        onClose={handleCloseErrorDialog}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">
          {tabValue === 'signin' ? "Login Error" : "Signup Error"}
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

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={openForgotPassword}
        onClose={() => setOpenForgotPassword(false)}
      />
    </LoginContainer>
  );
};

export default LoginForm;