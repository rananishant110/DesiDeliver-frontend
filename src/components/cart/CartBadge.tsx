import React from 'react';
import {
  Box,
  Badge,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';

interface CartBadgeProps {
  onClick: () => void;
}

const CartBadge: React.FC<CartBadgeProps> = ({ onClick }) => {
  const { getCartSummary } = useCart();
  const { itemCount } = getCartSummary();

  return (
    <Tooltip title="Shopping Cart">
      <IconButton
        color="inherit"
        onClick={onClick}
        sx={{
          position: 'relative',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Badge
          badgeContent={itemCount}
          color="secondary"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.75rem',
              height: '20px',
              minWidth: '20px',
              borderRadius: '10px',
            },
          }}
        >
          <ShoppingCart />
        </Badge>
        
        {/* Show cart summary on larger screens */}
        <Box sx={{ 
          display: { xs: 'none', sm: 'block' }, 
          ml: 1,
          textAlign: 'left'
        }}>
          <Typography variant="caption" display="block" sx={{ lineHeight: 1 }}>
            Cart
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Typography>
        </Box>
      </IconButton>
    </Tooltip>
  );
};

export default CartBadge;
