import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  Typography,
  Chip,
  useTheme,
  alpha,
  Paper,
} from '@mui/material';
import { Search, Clear, FilterList, TuneRounded } from '@mui/icons-material';
import { Category } from '../../types';
import { debounce, generateSearchSuggestions } from '../../utils/searchUtils';

interface SearchFiltersProps {
  categories: Category[];
  onSearch: (searchTerm: string) => void;
  onCategoryFilter: (categoryId: number | null) => void;
  onStockFilter: (inStock: boolean | null) => void;
  onClearFilters: () => void;
  searchTerm: string;
  selectedCategory: number | null;
  selectedStockStatus: boolean | null;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories,
  onSearch,
  onCategoryFilter,
  onStockFilter,
  onClearFilters,
  searchTerm,
  selectedCategory,
  selectedStockStatus,
}) => {
  const theme = useTheme();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setIsSearching(true);
      onSearch(searchValue);
      // Small delay to show loading state
      setTimeout(() => setIsSearching(false), 300);
    }, 300), // 300ms delay
    [onSearch]
  );

  // Handle search input changes with real-time search
  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClearFilters = () => {
    setLocalSearchTerm('');
    onClearFilters();
  };

  const hasActiveFilters = localSearchTerm || selectedCategory !== null || selectedStockStatus !== null;

  return (
    <Paper
      elevation={0}
      sx={{ 
        mb: 4, 
        p: 3, 
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.6)
          : alpha(theme.palette.primary.main, 0.02),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            fontWeight: 600,
          }}
        >
          <TuneRounded sx={{ color: 'primary.main' }} />
          Search & Filters
        </Typography>
        {hasActiveFilters && (
          <Button
            variant="text"
            size="small"
            onClick={handleClearFilters}
            startIcon={<Clear />}
            sx={{ 
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': {
                color: 'error.main',
                bgcolor: alpha(theme.palette.error.main, 0.1),
              },
            }}
          >
            Clear All
          </Button>
        )}
      </Box>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
        {/* Search Input */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / 3' } }}>
          <TextField
            fullWidth
            placeholder="Search products by name, description, brand..."
            value={localSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isSearching && (
                    <Box sx={{ 
                      width: 16, 
                      height: 16, 
                      border: '2px solid', 
                      borderColor: 'primary.main', 
                      borderTopColor: 'transparent', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }} />
                  )}
                  {localSearchTerm && (
                    <Chip 
                      label={`${localSearchTerm.split(' ').filter(term => term.length > 0).length} terms`}
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
          />
          
          {/* Search Suggestions */}
          {localSearchTerm && localSearchTerm.length > 1 && (
            <Box sx={{ 
              mt: 1.5, 
              p: 2, 
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                💡 Try these searches:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {generateSearchSuggestions(localSearchTerm).map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    size="small"
                    variant="outlined"
                    onClick={() => handleSearchChange(suggestion)}
                    sx={{ 
                      cursor: 'pointer', 
                      borderRadius: 1.5,
                      '&:hover': { 
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: 'primary.main',
                      } 
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Category Filter */}
        <Box>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory || ''}
              label="Category"
              onChange={(e) => onCategoryFilter(e.target.value ? Number(e.target.value) : null)}
              sx={{
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Stock Status Filter */}
        <Box>
          <FormControl fullWidth>
            <InputLabel>Stock Status</InputLabel>
            <Select
              value={selectedStockStatus === null ? '' : selectedStockStatus}
              label="Stock Status"
              onChange={(e) => onStockFilter(e.target.value === '' ? null : e.target.value === 'true')}
              sx={{
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">In Stock</MenuItem>
              <MenuItem value="false">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Paper>
  );
};

export default SearchFilters;
