import React from 'react';
import {
  Box,
  Chip,
  Typography,
  Skeleton,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { Category as CategoryIcon, LocalOffer } from '@mui/icons-material';
import { Category } from '../../types';

interface CategoryNavProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  loading,
  error,
  selectedCategory,
  onCategorySelect,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CategoryIcon sx={{ color: 'primary.main' }} />
          Browse by Category
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {[...Array(6)].map((_, index) => (
            <Skeleton 
              key={index} 
              variant="rectangular" 
              width={100} 
              height={36} 
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
        }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 600, 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <CategoryIcon sx={{ color: 'primary.main' }} />
        Browse by Category
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Chip
          icon={<LocalOffer />}
          label="All Products"
          onClick={() => onCategorySelect(null)}
          sx={{
            px: 1,
            py: 2.5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '0.875rem',
            bgcolor: selectedCategory === null 
              ? 'primary.main' 
              : theme.palette.mode === 'dark' 
                ? alpha(theme.palette.common.white, 0.05)
                : alpha(theme.palette.common.black, 0.04),
            color: selectedCategory === null ? 'white' : 'text.primary',
            border: `1px solid ${selectedCategory === null ? 'transparent' : theme.palette.divider}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: selectedCategory === null 
                ? 'primary.dark'
                : alpha(theme.palette.primary.main, 0.1),
              borderColor: selectedCategory === null 
                ? 'transparent' 
                : 'primary.main',
            },
            '& .MuiChip-icon': {
              color: selectedCategory === null ? 'white' : 'primary.main',
            },
          }}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            onClick={() => onCategorySelect(category.id)}
            sx={{
              px: 1,
              py: 2.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.875rem',
              bgcolor: selectedCategory === category.id 
                ? 'primary.main' 
                : theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.common.white, 0.05)
                  : alpha(theme.palette.common.black, 0.04),
              color: selectedCategory === category.id ? 'white' : 'text.primary',
              border: `1px solid ${selectedCategory === category.id ? 'transparent' : theme.palette.divider}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: selectedCategory === category.id 
                  ? 'primary.dark'
                  : alpha(theme.palette.primary.main, 0.1),
                borderColor: selectedCategory === category.id 
                  ? 'transparent' 
                  : 'primary.main',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryNav;
