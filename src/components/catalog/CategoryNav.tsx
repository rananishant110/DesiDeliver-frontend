import React from 'react';
import {
  Box,
  Chip,
  Typography,
  Skeleton,
  Alert,
} from '@mui/material';
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
  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" width={100} height={32} />
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label="All Categories"
          onClick={() => onCategorySelect(null)}
          color={selectedCategory === null ? 'primary' : 'default'}
          variant={selectedCategory === null ? 'filled' : 'outlined'}
          clickable
          sx={{ mb: 1 }}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            onClick={() => onCategorySelect(category.id)}
            color={selectedCategory === category.id ? 'primary' : 'default'}
            variant={selectedCategory === category.id ? 'filled' : 'outlined'}
            clickable
            sx={{ mb: 1 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryNav;
