import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData } from '../../types';

interface FormErrors {
  [key: string]: string;
}

const RegistrationForm: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
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

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validatePhone = (phone: string): boolean => {
    // Accept formats like: +14695550123, 14695550123, 469-555-0123, (469) 555-0123
    const phoneRegex = /^(\+?1)?[\s.-]?(\()?\d{3}(\))?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const formatPhoneForBackend = (phone: string): string => {
    // Extract only digits
    const digits = phone.replace(/\D/g, '');
    // Format as +1XXXXXXXXXX for backend
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    return `+${digits}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (error) {
      clearError();
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Required field validation
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.password_confirm) errors.password_confirm = 'Please confirm your password';
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.business_name.trim()) errors.business_name = 'Business name is required';
    if (!formData.phone_number.trim()) errors.phone_number = 'Phone number is required';
    if (!formData.address_line1.trim()) errors.address_line1 = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zip_code.trim()) errors.zip_code = 'ZIP code is required';

    // Format validation
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.password && !validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password && formData.password_confirm && formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }

    if (formData.phone_number && !validatePhone(formData.phone_number)) {
      errors.phone_number = 'Please enter a valid phone number';
    }

    if (formData.zip_code && !validateZipCode(formData.zip_code)) {
      errors.zip_code = 'Please enter a valid ZIP code (e.g., 75001 or 75001-1234)';
    }

    if (formData.state && formData.state.length !== 2) {
      errors.state = 'Please enter a 2-letter state code (e.g., TX)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    clearError();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Format phone number for backend
      const dataToSubmit = {
        ...formData,
        phone_number: formatPhoneForBackend(formData.phone_number),
      };

      await register(dataToSubmit);
      
      // Show success message briefly
      setShowSuccess(true);
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      // Error is handled by AuthContext
      console.error('Registration error:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 2,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 600,
          my: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create Your DesiDeliver Account
        </Typography>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Join us to start ordering Indian groceries for your business
        </Typography>

        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Redirecting to dashboard...
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Account Information */}
          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
            Account Information
          </Typography>
          
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            margin="normal"
            required
            error={!!validationErrors.username}
            helperText={validationErrors.username}
            autoComplete="username"
          />
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            autoComplete="email"
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            required
            error={!!validationErrors.password}
            helperText={validationErrors.password || 'Minimum 8 characters'}
            autoComplete="new-password"
          />
          
          <TextField
            fullWidth
            label="Confirm Password"
            name="password_confirm"
            type="password"
            value={formData.password_confirm}
            onChange={handleInputChange}
            margin="normal"
            required
            error={!!validationErrors.password_confirm}
            helperText={validationErrors.password_confirm}
            autoComplete="new-password"
          />

          {/* Personal Information */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Personal Information
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              error={!!validationErrors.first_name}
              helperText={validationErrors.first_name}
              autoComplete="given-name"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
              error={!!validationErrors.last_name}
              helperText={validationErrors.last_name}
              autoComplete="family-name"
            />
          </Box>

          {/* Business Information */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Business Information
          </Typography>
          
          <TextField
            fullWidth
            label="Business Name"
            name="business_name"
            value={formData.business_name}
            onChange={handleInputChange}
            margin="normal"
            required
            error={!!validationErrors.business_name}
            helperText={validationErrors.business_name}
            autoComplete="organization"
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Business Type</InputLabel>
            <Select
              name="business_type"
              value={formData.business_type}
              onChange={handleSelectChange}
              label="Business Type"
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
            margin="normal"
            required
            error={!!validationErrors.phone_number}
            helperText={validationErrors.phone_number || 'e.g., (469) 555-0123 or 469-555-0123'}
            autoComplete="tel"
          />

          {/* Address Information */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Address Information
          </Typography>
          
          <TextField
            fullWidth
            label="Address Line 1"
            name="address_line1"
            value={formData.address_line1}
            onChange={handleInputChange}
            margin="normal"
            required
            error={!!validationErrors.address_line1}
            helperText={validationErrors.address_line1}
            autoComplete="address-line1"
          />
          
          <TextField
            fullWidth
            label="Address Line 2 (Optional)"
            name="address_line2"
            value={formData.address_line2}
            onChange={handleInputChange}
            margin="normal"
            autoComplete="address-line2"
          />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1.5fr' }, gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              error={!!validationErrors.city}
              helperText={validationErrors.city}
              autoComplete="address-level2"
            />
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
              error={!!validationErrors.state}
              helperText={validationErrors.state}
              placeholder="TX"
              inputProps={{ maxLength: 2 }}
              autoComplete="address-level1"
            />
            <TextField
              fullWidth
              label="ZIP Code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              required
              error={!!validationErrors.zip_code}
              helperText={validationErrors.zip_code}
              autoComplete="postal-code"
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading || showSuccess}
            sx={{ mt: 4, mb: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Account'
            )}
          </Button>

          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Button
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none' }}
            >
              Sign in
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegistrationForm;
