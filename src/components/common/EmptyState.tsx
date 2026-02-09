import React from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonProps,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForward from '@mui/icons-material/ArrowForward';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: ButtonProps['variant'];
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  size?: 'sm' | 'md' | 'lg';
}

const MotionBox = motion(Box);

/**
 * Empty State Component
 *
 * Displays a meaningful empty state with icon, title, description,
 * and call-to-action buttons. Used for empty carts, no results, etc.
 *
 * @example
 * <EmptyState
 *   icon={<ShoppingCartIcon />}
 *   title="Your cart is empty"
 *   description="Add items to get started"
 *   action={{
 *     label: 'Continue Shopping',
 *     onClick: () => navigate('/catalog')
 *   }}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
}) => {
  const theme = useTheme();

  const sizeConfig = {
    sm: {
      iconSize: 60,
      titleVariant: 'h6' as const,
      descriptionVariant: 'body2' as const,
      padding: 4,
    },
    md: {
      iconSize: 80,
      titleVariant: 'h5' as const,
      descriptionVariant: 'body2' as const,
      padding: 8,
    },
    lg: {
      iconSize: 120,
      titleVariant: 'h4' as const,
      descriptionVariant: 'body1' as const,
      padding: 12,
    },
  };

  const config = sizeConfig[size];

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      sx={{
        textAlign: 'center',
        py: config.padding,
        px: 3,
      }}
    >
      {/* Animated Icon Container */}
      {icon && (
        <Box
          component={motion.div}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
          sx={{
            width: config.iconSize,
            height: config.iconSize,
            borderRadius: '50%',
            background: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            fontSize: config.iconSize * 0.5,
            color: theme.palette.primary.main,
          }}
        >
          {icon}
        </Box>
      )}

      {/* Title */}
      <Typography
        variant={config.titleVariant}
        sx={{
          fontWeight: 700,
          mb: 1,
          color: theme.palette.text.primary,
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant={config.descriptionVariant}
        color="text.secondary"
        sx={{
          mb: 4,
          maxWidth: 320,
          mx: 'auto',
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>

      {/* Action Buttons */}
      {(action || secondaryAction) && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {action && (
            <Button
              variant={action.variant || 'contained'}
              onClick={action.onClick}
              endIcon={action.icon || <ArrowForward />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: size === 'sm' ? '0.875rem' : '1rem',
                py: size === 'sm' ? 0.75 : 1,
                px: size === 'sm' ? 2 : 3,
              }}
            >
              {action.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              variant="outlined"
              onClick={secondaryAction.onClick}
              endIcon={secondaryAction.icon}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: size === 'sm' ? '0.875rem' : '1rem',
                py: size === 'sm' ? 0.75 : 1,
                px: size === 'sm' ? 2 : 3,
              }}
            >
              {secondaryAction.label}
            </Button>
          )}
        </Box>
      )}
    </MotionBox>
  );
};

EmptyState.displayName = 'EmptyState';
export default EmptyState;
