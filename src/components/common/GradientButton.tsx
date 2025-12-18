import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { gradients, shadows } from '../../theme/palette';

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  gradient?: 'primary' | 'secondary';
  loading?: boolean;
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'gradient',
})<{ gradient: 'primary' | 'secondary' }>(({ gradient }) => ({
  background: gradient === 'primary' ? gradients.primary : gradients.secondary,
  color: '#FFFFFF',
  fontWeight: 600,
  padding: '12px 28px',
  borderRadius: '12px',
  textTransform: 'none',
  boxShadow: shadows.button,
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: gradient === 'primary' ? gradients.primaryHover : gradients.secondaryHover,
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
  },

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: shadows.buttonHover,
    '&::before': {
      opacity: 1,
    },
  },

  '&:active': {
    transform: 'translateY(0)',
  },

  '&.Mui-disabled': {
    background: '#CBD5E1',
    color: '#94A3B8',
    boxShadow: 'none',
  },

  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
    position: 'relative',
    zIndex: 1,
  },

  '& .button-content': {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
}));

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  gradient = 'primary',
  loading = false,
  disabled,
  startIcon,
  endIcon,
  ...props
}) => {
  return (
    <StyledButton
      gradient={gradient}
      disabled={disabled || loading}
      {...props}
    >
      <span className="button-content">
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <>
            {startIcon}
            {children}
            {endIcon}
          </>
        )}
      </span>
    </StyledButton>
  );
};

export default GradientButton;
