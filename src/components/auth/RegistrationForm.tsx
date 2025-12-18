import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import {
  Person,
  Lock,
  Email,
  Business,
  Phone,
  LocationOn,
  Visibility,
  VisibilityOff,
  Store,
  ArrowBack,
  ArrowForward,
  Check,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData } from '../../types';

const MotionBox = motion(Box);

interface FormErrors {
  [key: string]: string;
}

const steps = ['Account', 'Personal', 'Business', 'Address'];

const RegistrationForm: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    business_name: '',
    business_type: 'restaurant',
    phone_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
  });

  const [validationErrors, setValidationErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+?1)?[\s.-]?(\()?\d{3}(\))?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const formatPhoneForBackend = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    return `+${digits}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (error) clearError();
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    const errors: FormErrors = {};

    if (step === 0) {
      if (!formData.username.trim()) errors.username = 'Username is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      else if (!validateEmail(formData.email)) errors.email = 'Invalid email address';
      if (!formData.password) errors.password = 'Password is required';
      else if (!validatePassword(formData.password)) errors.password = 'Minimum 8 characters';
      if (!formData.password_confirm) errors.password_confirm = 'Please confirm password';
      else if (formData.password !== formData.password_confirm) errors.password_confirm = 'Passwords do not match';
    } else if (step === 1) {
      if (!formData.first_name.trim()) errors.first_name = 'First name is required';
      if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    } else if (step === 2) {
      if (!formData.business_name.trim()) errors.business_name = 'Business name is required';
      if (!formData.phone_number.trim()) errors.phone_number = 'Phone number is required';
      else if (!validatePhone(formData.phone_number)) errors.phone_number = 'Invalid phone number';
    } else if (step === 3) {
      if (!formData.address_line1.trim()) errors.address_line1 = 'Address is required';
      if (!formData.city.trim()) errors.city = 'City is required';
      if (!formData.state.trim()) errors.state = 'State is required';
      else if (formData.state.length !== 2) errors.state = 'Use 2-letter code';
      if (!formData.zip_code.trim()) errors.zip_code = 'ZIP code is required';
      else if (!validateZipCode(formData.zip_code)) errors.zip_code = 'Invalid ZIP code';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateStep(activeStep)) return;

    try {
      const dataToSubmit = {
        ...formData,
        phone_number: formatPhoneForBackend(formData.phone_number),
      };

      await register(dataToSubmit);
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const renderStepContent = (step: number) => {
    const inputSx = {
      '& .MuiOutlinedInput-root': { borderRadius: 2 },
    };

    switch (step) {
      case 0:
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={!!validationErrors.username}
              helperText={validationErrors.username}
              autoComplete="username"
              sx={{ mb: 2.5, ...inputSx }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              autoComplete="email"
              sx={{ mb: 2.5, ...inputSx }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password || 'Minimum 8 characters'}
              autoComplete="new-password"
              sx={{ mb: 2.5, ...inputSx }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="password_confirm"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.password_confirm}
              onChange={handleInputChange}
              error={!!validationErrors.password_confirm}
              helperText={validationErrors.password_confirm}
              autoComplete="new-password"
              sx={{ ...inputSx }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </MotionBox>
        );
      case 1:
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              error={!!validationErrors.first_name}
              helperText={validationErrors.first_name}
              autoComplete="given-name"
              sx={{ mb: 2.5, ...inputSx }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              error={!!validationErrors.last_name}
              helperText={validationErrors.last_name}
              autoComplete="family-name"
              sx={{ ...inputSx }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
              }}
            />
          </MotionBox>
        );
      case 2:
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TextField
              fullWidth
              label="Business Name"
              name="business_name"
              value={formData.business_name}
              onChange={handleInputChange}
              error={!!validationErrors.business_name}
              helperText={validationErrors.business_name}
              autoComplete="organization"
              sx={{ mb: 2.5, ...inputSx }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Business color="action" /></InputAdornment>,
              }}
            />
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <InputLabel>Business Type</InputLabel>
              <Select
                name="business_type"
                value={formData.business_type}
                onChange={handleSelectChange}
                label="Business Type"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="restaurant">Restaurant</MenuItem>
                <MenuItem value="store">Store</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              error={!!validationErrors.phone_number}
              helperText={validationErrors.phone_number || 'e.g., (469) 555-0123'}
              autoComplete="tel"
              sx={{ ...inputSx }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Phone color="action" /></InputAdornment>,
              }}
            />
          </MotionBox>
        );
      case 3:
        return (
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TextField
              fullWidth
              label="Address Line 1"
              name="address_line1"
              value={formData.address_line1}
              onChange={handleInputChange}
              error={!!validationErrors.address_line1}
              helperText={validationErrors.address_line1}
              autoComplete="address-line1"
              sx={{ mb: 2.5, ...inputSx }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LocationOn color="action" /></InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              label="Address Line 2 (Optional)"
              name="address_line2"
              value={formData.address_line2}
              onChange={handleInputChange}
              autoComplete="address-line2"
              sx={{ mb: 2.5, ...inputSx }}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1.5fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={!!validationErrors.city}
                helperText={validationErrors.city}
                autoComplete="address-level2"
                sx={{ ...inputSx }}
              />
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                error={!!validationErrors.state}
                helperText={validationErrors.state}
                placeholder="TX"
                inputProps={{ maxLength: 2 }}
                autoComplete="address-level1"
                sx={{ ...inputSx }}
              />
              <TextField
                fullWidth
                label="ZIP Code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                error={!!validationErrors.zip_code}
                helperText={validationErrors.zip_code}
                autoComplete="postal-code"
                sx={{ ...inputSx }}
              />
            </Box>
          </MotionBox>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Left Side - Branding Panel */}
      {!isMobile && (
        <Box
          sx={{
            width: '40%',
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                mx: 'auto',
              }}
            >
              <Store sx={{ fontSize: 48, color: 'white' }} />
            </Box>

            <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
              Join DesiDeliver
            </Typography>

            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, maxWidth: 360 }}>
              Start ordering authentic Indian groceries for your business today
            </Typography>

            {/* Progress Indicator */}
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {steps.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: index <= activeStep ? 40 : 12,
                      height: 12,
                      borderRadius: 6,
                      bgcolor: index <= activeStep ? 'white' : 'rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mt: 2 }}>
                Step {activeStep + 1} of {steps.length}
              </Typography>
            </Box>
          </MotionBox>
        </Box>
      )}

      {/* Right Side - Registration Form */}
      <Box
        sx={{
          width: isMobile ? '100%' : '60%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, md: 6 },
          overflowY: 'auto',
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ width: '100%', maxWidth: 500 }}
        >
          {/* Mobile Logo */}
          {isMobile && (
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  mx: 'auto',
                }}
              >
                <Store sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                DesiDeliver
              </Typography>
            </Box>
          )}

          {/* Stepper */}
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#FF6B35',
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: '#FF6B35',
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {activeStep === 0 && 'Create Your Account'}
            {activeStep === 1 && 'Personal Information'}
            {activeStep === 2 && 'Business Details'}
            {activeStep === 3 && 'Delivery Address'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {activeStep === 0 && 'Set up your login credentials'}
            {activeStep === 1 && 'Tell us about yourself'}
            {activeStep === 2 && 'Add your business information'}
            {activeStep === 3 && 'Where should we deliver?'}
          </Typography>

          {showSuccess && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<Check />}
            >
              Registration successful! Redirecting to dashboard...
            </Alert>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }} 
              onClose={clearError}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {renderStepContent(activeStep)}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBack />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  visibility: activeStep === 0 ? 'hidden' : 'visible',
                }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading || showSuccess}
                  endIcon={isLoading ? null : <Check />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    boxShadow: '0 4px 14px rgba(255, 107, 53, 0.25)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e55a2b 0%, #d9821a 100%)',
                      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.35)',
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    boxShadow: '0 4px 14px rgba(255, 107, 53, 0.25)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e55a2b 0%, #d9821a 100%)',
                      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.35)',
                    },
                  }}
                >
                  Continue
                </Button>
              )}
            </Box>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': { background: 'transparent' },
                  }}
                >
                  Sign in
                </Button>
              </Typography>
            </Box>
          </Box>
        </MotionBox>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
