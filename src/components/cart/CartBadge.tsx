import React, { useEffect, useState } from 'react';
import {
  Box,
  Badge,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';

interface CartBadgeProps {
  onClick: () => void;
}

const CartBadge: React.FC<CartBadgeProps> = ({ onClick }) => {
  const { getCartSummary } = useCart();
  const { itemCount } = getCartSummary();
  const [prevCount, setPrevCount] = useState(itemCount);
  const [shouldBounce, setShouldBounce] = useState(false);

  // Trigger bounce animation when item count changes
  useEffect(() => {
    if (itemCount !== prevCount && itemCount > 0) {
      setShouldBounce(true);
      setTimeout(() => setShouldBounce(false), 600);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  return (
    <Tooltip title="Shopping Cart">
      <IconButton
        color="inherit"
        onClick={onClick}
        component={motion.button}
        animate={shouldBounce ? {
          scale: [1, 1.2, 0.95, 1.05, 1],
          rotate: [0, -5, 5, -5, 0],
        } : {}}
        transition={{ duration: 0.6 }}
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
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              fontWeight: 600,
              animation: shouldBounce ? 'pulse 0.6s ease-in-out' : 'none',
              '@keyframes pulse': {
                '0%, 100%': {
                  transform: 'scale(1)',
                },
                '50%': {
                  transform: 'scale(1.3)',
                },
              },
            },
          }}
        >
          <ShoppingCart />
        </Badge>
        
        {/* Show cart summary on larger screens */}
        <AnimatePresence mode="wait">
          <Box 
            component={motion.div}
            key={itemCount}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3 }}
            sx={{ 
              display: { xs: 'none', sm: 'block' }, 
              ml: 1,
              textAlign: 'left'
            }}
          >
            <Typography variant="caption" display="block" sx={{ lineHeight: 1, fontWeight: 600 }}>
              Cart
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Typography>
          </Box>
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  );
};

export default CartBadge;
