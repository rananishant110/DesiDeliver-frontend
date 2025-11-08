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
} from '@mui/material';
import { Search, Clear, FilterList } from '@mui/icons-material';
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
    <Box sx={{ mb: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterList />
        Search & Filters
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {/* Search Input */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / 3' } }}>
          <TextField
            fullWidth
            label="Search Products"
            placeholder="Search by: Product Name, Description, Item Code, Brand, Origin, Category..."
            value={localSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            helperText="Search updates in real-time as you type. Use multiple words for better results."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isSearching && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
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
                    </Box>
                  )}
                  {localSearchTerm && (
                    <Typography variant="caption" color="text.secondary">
                      {localSearchTerm.split(' ').filter(term => term.length > 0).length} terms
                    </Typography>
                  )}
                </Box>
              ),
            }}
          />
          
          {/* Search Suggestions */}
          {localSearchTerm && localSearchTerm.length > 1 && (
            <Box sx={{ 
              gridColumn: '1 / -1', 
              mt: 1, 
              p: 1.5, 
              backgroundColor: 'grey.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200'
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
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'primary.50' } }}
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
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">In Stock</MenuItem>
              <MenuItem value="false">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {hasActiveFilters && (
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<Clear />}
              >
                Clear All Filters
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchFilters;
