import React from 'react';
import { Box, Skeleton, SkeletonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

type SkeletonVariant = 'text' | 'card' | 'image' | 'avatar' | 'button' | 'table-row';

interface LoadingSkeletonProps extends Omit<SkeletonProps, 'variant'> {
  variant?: SkeletonVariant;
  lines?: number;
  spacing?: number;
}

const ShimmerSkeleton = styled(Skeleton)(({ theme }) => ({
  '&::after': {
    background: `linear-gradient(
      90deg,
      transparent,
      ${theme.palette.mode === 'light' 
        ? 'rgba(255, 255, 255, 0.4)' 
        : 'rgba(255, 255, 255, 0.1)'},
      transparent
    )`,
  },
}));

const CardSkeleton: React.FC<{ height?: number | string }> = ({ height = 200 }) => (
  <Box sx={{ width: '100%' }}>
    <ShimmerSkeleton
      variant="rectangular"
      height={height}
      sx={{ borderRadius: '16px 16px 0 0' }}
      animation="wave"
    />
    <Box sx={{ p: 2 }}>
      <ShimmerSkeleton variant="text" width="80%" height={28} animation="wave" />
      <ShimmerSkeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} animation="wave" />
      <ShimmerSkeleton variant="text" width="100%" height={16} sx={{ mt: 2 }} animation="wave" />
      <ShimmerSkeleton variant="text" width="90%" height={16} sx={{ mt: 0.5 }} animation="wave" />
      <ShimmerSkeleton 
        variant="rectangular" 
        width={100} 
        height={36} 
        sx={{ mt: 2, borderRadius: '8px' }} 
        animation="wave"
      />
    </Box>
  </Box>
);

const ImageSkeleton: React.FC<{ height?: number | string }> = ({ height = 200 }) => (
  <ShimmerSkeleton
    variant="rectangular"
    width="100%"
    height={height}
    sx={{ borderRadius: '12px' }}
    animation="wave"
  />
);

const AvatarSkeleton: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <ShimmerSkeleton
    variant="circular"
    width={size}
    height={size}
    animation="wave"
  />
);

const ButtonSkeleton: React.FC<{ width?: number | string }> = ({ width = 120 }) => (
  <ShimmerSkeleton
    variant="rectangular"
    width={width}
    height={42}
    sx={{ borderRadius: '12px' }}
    animation="wave"
  />
);

const TableRowSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
    <ShimmerSkeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: '8px' }} animation="wave" />
    <Box sx={{ flex: 1 }}>
      <ShimmerSkeleton variant="text" width="60%" height={20} animation="wave" />
      <ShimmerSkeleton variant="text" width="40%" height={16} sx={{ mt: 0.5 }} animation="wave" />
    </Box>
    <ShimmerSkeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: '6px' }} animation="wave" />
  </Box>
);

const TextSkeleton: React.FC<{ lines?: number; spacing?: number }> = ({ 
  lines = 3, 
  spacing = 1 
}) => (
  <Box>
    {Array.from({ length: lines }).map((_, index) => (
      <ShimmerSkeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '70%' : '100%'}
        height={20}
        sx={{ mt: index > 0 ? spacing : 0 }}
        animation="wave"
      />
    ))}
  </Box>
);

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  lines = 3,
  spacing = 1,
  height,
  width,
  ...props
}) => {
  switch (variant) {
    case 'card':
      return <CardSkeleton height={height} />;
    case 'image':
      return <ImageSkeleton height={height} />;
    case 'avatar':
      return <AvatarSkeleton size={typeof width === 'number' ? width : 48} />;
    case 'button':
      return <ButtonSkeleton width={width} />;
    case 'table-row':
      return <TableRowSkeleton />;
    case 'text':
    default:
      return <TextSkeleton lines={lines} spacing={spacing} />;
  }
};

export default LoadingSkeleton;

// Export individual skeletons for direct use
export { CardSkeleton, ImageSkeleton, AvatarSkeleton, ButtonSkeleton, TableRowSkeleton, TextSkeleton };
