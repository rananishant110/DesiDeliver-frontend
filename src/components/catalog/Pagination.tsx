import React from 'react';
import {
  Box,
  Pagination,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newPageSize = Number(event.target.value);
    onPageSizeChange(newPageSize);
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center', 
      justifyContent: 'space-between',
      gap: 2,
      mt: 4,
      p: 2,
      backgroundColor: 'grey.50',
      borderRadius: 2
    }}>
      {/* Items Info */}
      <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
        <Typography variant="body2" color="text.secondary">
          Showing {startItem}-{endItem} of {totalItems} products
        </Typography>
      </Box>

      {/* Page Size Selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Show:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            displayEmpty
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              fontSize: '1rem',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PaginationComponent;
