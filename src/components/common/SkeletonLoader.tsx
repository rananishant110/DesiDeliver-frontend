import React from 'react';
import { Box, BoxProps, keyframes, useTheme } from '@mui/material';
import styled from '@emotion/styled';

interface SkeletonLoaderProps extends BoxProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  count?: number;
  spacing?: number;
  animation?: 'pulse' | 'wave' | 'none';
}

// Pulse animation
const pulseAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
`;

// Wave animation (shimmer effect)
const waveAnimation = keyframes`
  0% {
    backgroundPosition: -1000px 0;
  }
  100% {
    backgroundPosition: 1000px 0;
  }
`;

const SkeletonBase = styled(Box, {
  shouldForwardProp: (prop) =>
    ![
      'variant',
      'animation',
    ].includes(prop as string),
})<Omit<SkeletonLoaderProps, 'variant' | 'animation'>>(
  ({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'light'
        ? 'rgba(0, 0, 0, 0.08)'
        : 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
  })
);

const PulseSkeleton = styled(SkeletonBase)(
  ({ theme }) => ({
    animation: `${pulseAnimation} 2s ease-in-out infinite`,
  })
);

const WaveSkeleton = styled(SkeletonBase)(
  ({ theme }) => ({
    backgroundImage: `linear-gradient(90deg, 
      ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)'} 25%, 
      ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.15)'} 50%, 
      ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)'} 75%)`,
    backgroundSize: '1000px 100%',
    animation: `${waveAnimation} 2s infinite`,
  })
);

/**
 * Skeleton Loader Component
 *
 * Displays a loading placeholder that matches the shape of actual content.
 * Reduces cognitive load compared to spinners and improves perceived performance.
 *
 * @example
 * // Text skeleton
 * <SkeletonLoader variant="text" width="100%" height={20} />
 *
 * // Multiple skeleton loaders
 * <SkeletonLoader count={3} height={100} spacing={2} />
 *
 * // Circular avatar skeleton
 * <SkeletonLoader variant="circular" width={40} height={40} />
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = 20,
  count = 1,
  spacing = 1,
  animation = 'pulse',
  ...props
}) => {
  const theme = useTheme();

  const variantStyles: Record<string, React.CSSProperties> = {
    text: {
      height: '1em',
      marginBottom: spacing,
      borderRadius: '4px',
    },
    rectangular: {
      height,
      borderRadius: '8px',
    },
    circular: {
      borderRadius: '50%',
      width: height,
      height: height,
    },
  };

  const SkeletonComponent = animation === 'wave' ? WaveSkeleton : PulseSkeleton;

  if (count && count > 1) {
    return (
      <Box>
        {[...Array(count)].map((_, i) => (
          <SkeletonComponent
            key={i}
            sx={{
              width,
              height,
              ...variantStyles[variant],
              marginBottom: i < count - 1 ? spacing : 0,
              ...props.sx,
            }}
            {...props}
          />
        ))}
      </Box>
    );
  }

  return (
    <SkeletonComponent
      sx={{
        width,
        height,
        ...variantStyles[variant],
        ...props.sx,
      }}
      {...props}
    />
  );
};

SkeletonLoader.displayName = 'SkeletonLoader';
export default SkeletonLoader;
