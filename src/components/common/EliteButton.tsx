import React from 'react';
import {
  Button,
  ButtonProps,
  useTheme,
  alpha,
  keyframes,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import CircularProgress from '@mui/material/CircularProgress';

const MotionButton = motion(Button);

interface EliteButtonProps extends ButtonProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'ghost'
    | 'danger'
    | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  showRipple?: boolean;
  fullWidth?: boolean;
}

// Ripple animation keyframe
const rippleAnimation = keyframes`
  0% {
    width: 0;
    height: 0;
    opacity: 0.6;
  }
  100% {
    width: 300px;
    height: 300px;
    opacity: 0;
  }
`;

// Ripple effect container
const RippleContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  pointerEvents: 'none',
  animation: `${rippleAnimation} 0.6s ease-out`,
}));

export const EliteButton: React.FC<EliteButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  showRipple = true,
  fullWidth = false,
  children,
  onClick,
  disabled,
  ...props
}) => {
  const theme = useTheme();
  const [ripples, setRipples] = React.useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const variantStyles = {
    primary: {
      base: {
        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F66 100%)',
        color: '#FFFFFF',
        border: 'none',
      },
      hover: {
        background: 'linear-gradient(135deg, #E55A2B 0%, #FF6B35 100%)',
        boxShadow: `0 12px 24px ${alpha('#FF6B35', 0.4)}`,
      },
      active: {
        scale: 0.98,
      },
    },
    secondary: {
      base: {
        background: theme.palette.mode === 'light'
          ? alpha('#004E64', 0.08)
          : alpha('#0A7389', 0.12),
        color: '#004E64',
        border: `1.5px solid #004E64`,
      },
      hover: {
        background: alpha('#004E64', 0.15),
        boxShadow: `0 8px 16px ${alpha('#004E64', 0.2)}`,
      },
      active: {
        scale: 0.98,
      },
    },
    tertiary: {
      base: {
        background: 'transparent',
        color: '#FF6B35',
        border: `1.5px solid #FF6B35`,
      },
      hover: {
        background: alpha('#FF6B35', 0.08),
        boxShadow: `0 8px 16px ${alpha('#FF6B35', 0.15)}`,
      },
      active: {
        scale: 0.98,
      },
    },
    ghost: {
      base: {
        background: 'transparent',
        color: theme.palette.text.primary,
        border: `1.5px solid ${theme.palette.divider}`,
      },
      hover: {
        background: alpha(theme.palette.primary.main, 0.05),
        borderColor: theme.palette.primary.main,
      },
      active: {
        scale: 0.98,
      },
    },
    danger: {
      base: {
        background: 'linear-gradient(135deg, #E63946 0%, #EB616B 100%)',
        color: '#FFFFFF',
        border: 'none',
      },
      hover: {
        background: 'linear-gradient(135deg, #B82D38 0%, #E63946 100%)',
        boxShadow: `0 12px 24px ${alpha('#E63946', 0.4)}`,
      },
      active: {
        scale: 0.98,
      },
    },
    success: {
      base: {
        background: 'linear-gradient(135deg, #00A878 0%, #33B993 100%)',
        color: '#FFFFFF',
        border: 'none',
      },
      hover: {
        background: 'linear-gradient(135deg, #008A62 0%, #00A878 100%)',
        boxShadow: `0 12px 24px ${alpha('#00A878', 0.4)}`,
      },
      active: {
        scale: 0.98,
      },
    },
  };

  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '0.875rem', minHeight: 32 },
    md: { padding: '12px 24px', fontSize: '1rem', minHeight: 44 },
    lg: { padding: '16px 32px', fontSize: '1.125rem', minHeight: 48 },
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (showRipple && !disabled && !loading) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const id = Date.now();
      setRipples([...ripples, { id, x, y }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 600);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const currentVariant =
    variantStyles[variant as keyof typeof variantStyles];

  return (
    <MotionButton
      whileHover={!disabled && !loading ? 'hover' : undefined}
      whileTap={!disabled && !loading ? 'active' : undefined}
      initial="base"
      animate={loading ? 'loading' : 'base'}
      variants={{
        base: currentVariant.base,
        hover: currentVariant.hover,
        active: currentVariant.active || {},
        loading: { opacity: 0.7 },
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 32,
      }}
      sx={{
        ...sizeStyles[size],
        position: 'relative',
        overflow: 'hidden',
        width: fullWidth ? '100%' : 'auto',
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: 'none',
        ...props.sx,
      }}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <RippleContainer
          key={ripple.id}
          sx={{
            left: ripple.x,
            top: ripple.y,
            background: alpha('#FFFFFF', 0.5),
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} color="inherit" />
          <span>Loading...</span>
        </Box>
      ) : (
        children
      )}
    </MotionButton>
  );
};

EliteButton.displayName = 'EliteButton';
export default EliteButton;
