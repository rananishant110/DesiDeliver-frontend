import React from 'react';
import {
  Card,
  CardProps,
  useTheme,
  alpha,
} from '@mui/material';
import styled from '@emotion/styled';

interface EliteCardProps extends CardProps {
  elevation?: 'subtle' | 'medium' | 'high';
  interactive?: boolean;
  hoverLift?: number;
}

const EliteCardBase = styled(Card, {
  shouldForwardProp: (prop) =>
    !['elevation', 'interactive', 'hoverLift'].includes(prop as string),
})<Omit<EliteCardProps, 'elevation' | 'interactive' | 'hoverLift'>>(
  ({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
    borderRadius: '12px',
    background:
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
    },
  })
);

const InteractiveCard = styled(EliteCardBase, {
  shouldForwardProp: (prop) =>
    !['elevation', 'interactive', 'hoverLift'].includes(prop as string),
})<Omit<EliteCardProps, 'elevation' | 'interactive' | 'hoverLift'>>(
  ({ theme }) => ({
    cursor: 'pointer',

    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow:
        theme.palette.mode === 'light'
          ? '0 16px 32px rgba(0, 0, 0, 0.12)'
          : '0 16px 32px rgba(0, 0, 0, 0.4)',

      '&::before': {
        opacity: 1,
      },
    },

    '&:active': {
      transform: 'translateY(-2px)',
    },
  })
);

const NonInteractiveCard = styled(EliteCardBase, {
  shouldForwardProp: (prop) =>
    !['elevation', 'interactive', 'hoverLift'].includes(prop as string),
})<Omit<EliteCardProps, 'elevation' | 'interactive' | 'hoverLift'>>(
  ({ theme }) => ({
    '&:hover': {
      boxShadow:
        theme.palette.mode === 'light'
          ? '0 8px 16px rgba(0, 0, 0, 0.08)'
          : '0 8px 16px rgba(0, 0, 0, 0.3)',
    },
  })
);

/**
 * Elite Card Component
 *
 * An elevated card component with sophisticated hover effects,
 * smooth transitions, and professional styling.
 *
 * @example
 * <EliteCard interactive>
 *   <CardContent>
 *     Your content here
 *   </CardContent>
 * </EliteCard>
 */
export const EliteCard: React.FC<EliteCardProps> = ({
  elevation = 'subtle',
  interactive = false,
  hoverLift = 4,
  children,
  ...props
}) => {
  const theme = useTheme();

  const shadowMap = {
    subtle: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
    medium: `0 4px 12px ${alpha(theme.palette.common.black, 0.12)}`,
    high: `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,
  };

  const CardComponent = interactive ? InteractiveCard : NonInteractiveCard;

  return (
    <CardComponent
      elevation={0}
      {...props}
      sx={{
        boxShadow: shadowMap[elevation],
        ...props.sx,
      }}
    >
      {children}
    </CardComponent>
  );
};

EliteCard.displayName = 'EliteCard';
export default EliteCard;
