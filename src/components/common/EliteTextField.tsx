import React from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import styled from '@emotion/styled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface EliteTextFieldProps extends TextFieldProps {
  validating?: boolean;
  validated?: boolean;
  customError?: string | null;
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) =>
    !['validating', 'validated', 'customError'].includes(prop as string),
})(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    backgroundColor:
      theme.palette.mode === 'light'
        ? '#FAFBFC'
        : 'rgba(255, 255, 255, 0.08)',
    border: `1px solid ${theme.palette.divider}`,

    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'light'
          ? '#F1F5F9'
          : 'rgba(255, 255, 255, 0.12)',
      borderColor: theme.palette.primary.main,
    },

    '&.Mui-focused': {
      backgroundColor:
        theme.palette.mode === 'light'
          ? '#FFFFFF'
          : theme.palette.background.paper,
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
    },

    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.main,
    },

    '&.Mui-disabled': {
      backgroundColor: theme.palette.action.disabledBackground || alpha(theme.palette.common.black, 0.04),
      cursor: 'not-allowed',
    },
  },

  '& .MuiInputBase-input': {
    fontSize: '1rem',
    fontFamily: 'inherit',

    '&::placeholder': {
      color: theme.palette.text.disabled,
      opacity: 1,
    },

    '&:-webkit-autofill': {
      WebkitBoxShadow: `0 0 0 1000px ${
        theme.palette.mode === 'light' ? '#FAFBFC' : 'rgba(255, 255, 255, 0.08)'
      } inset`,
      WebkitTextFillColor: theme.palette.text.primary,
    },
  },

  '& .MuiInputBase-adornedEnd': {
    paddingRight: '8px',
  },

  '& .MuiFormHelperText-root': {
    fontSize: '0.75rem',
    marginTop: '4px',
  },
}));

/**
 * Elite TextField Component
 *
 * Enhanced text input with validation states, real-time feedback,
 * and smooth transitions. Includes support for loading and validation states.
 *
 * @example
 * <EliteTextField
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   validated={emailValid}
 *   error={!!emailError}
 *   helperText={emailError}
 * />
 *
 * @example
 * // With validation in progress
 * <EliteTextField
 *   label="Username"
 *   value={username}
 *   validating={isChecking}
 *   onChange={(e) => setUsername(e.target.value)}
 *   validated={usernameAvailable}
 * />
 */
export const EliteTextField: React.FC<EliteTextFieldProps> = ({
  validating = false,
  validated = false,
  customError = null,
  error: errorProp,
  helperText,
  disabled,
  ...props
}) => {
  const theme = useTheme();

  // Determine if field has error
  const hasError = errorProp || !!customError;

  // Get validation icon
  const getValidationIcon = () => {
    if (validating) {
      return (
        <InputAdornment position="end">
          <CircularProgress
            size={20}
            sx={{
              color: theme.palette.primary.main,
            }}
          />
        </InputAdornment>
      );
    }

    if (hasError) {
      return (
        <InputAdornment position="end">
          <ErrorIcon
            sx={{
              color: theme.palette.error.main,
              fontSize: '1.25rem',
            }}
          />
        </InputAdornment>
      );
    }

    if (validated && !hasError) {
      return (
        <InputAdornment position="end">
          <CheckCircleIcon
            sx={{
              color: theme.palette.success.main,
              fontSize: '1.25rem',
            }}
          />
        </InputAdornment>
      );
    }

    return null;
  };

  // Build final error text
  const finalError = hasError;
  const finalHelperText = customError || helperText;

  return (
    <StyledTextField
      {...props}
      error={finalError}
      helperText={finalHelperText}
      disabled={disabled || validating}
      InputProps={{
        ...props.InputProps,
        endAdornment: getValidationIcon(),
      }}
      sx={{
        width: '100%',
        ...props.sx,
      }}
    />
  );
};

EliteTextField.displayName = 'EliteTextField';
export default EliteTextField;
