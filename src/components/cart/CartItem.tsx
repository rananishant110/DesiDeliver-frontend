import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Chip,
  Divider,
  alpha,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  Inventory,
  LocalOffer,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setQuantity(newQuantity);
    setIsUpdating(true);
    
    // Debounce the update to avoid too many API calls
    setTimeout(async () => {
      try {
        await updateCartItem(item.id, newQuantity);
      } catch (error) {
        // Revert on error
        setQuantity(item.quantity);
      } finally {
        setIsUpdating(false);
      }
    }, 500);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromCart(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setIsRemoving(false);
    }
  };

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  return (
    <AnimatePresence>
      {!isRemoving && (
        <Card
          component={motion.div}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100, height: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ 
            mb: 2, 
            border: '1px solid', 
            borderColor: 'divider',
            overflow: 'hidden',
            position: 'relative',
            '&:hover': {
              boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
              borderColor: 'primary.light',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Product Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom 
                  sx={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  {item.product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                  {item.product.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<LocalOffer sx={{ fontSize: '0.9rem' }} />}
                    label={item.product.item_code}
                    size="small"
                    sx={{
                      background: (theme) => alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      fontWeight: 600,
                      border: 'none',
                    }}
                  />
                  <Chip
                    label={`${item.product.unit}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                  {item.product.brand && (
                    <Chip
                      label={item.product.brand}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                  {item.product.category && (
                    <Chip
                      label={item.product.category.name}
                      size="small"
                      sx={{
                        background: (theme) => alpha(theme.palette.secondary.main, 0.1),
                        color: 'secondary.main',
                        fontWeight: 500,
                        border: 'none',
                      }}
                    />
                  )}
                </Box>
              </Box>
              
              {/* Stock Status */}
              <Box sx={{ textAlign: 'right', ml: 2 }}>
                <Chip
                  icon={<Inventory sx={{ fontSize: '0.9rem' }} />}
                  label="In Stock"
                  color="success"
                  size="small"
                  sx={{ 
                    fontWeight: 600,
                    background: (theme) => alpha(theme.palette.success.main, 0.15),
                    color: 'success.dark',
                  }}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                  Available
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Quantity Controls and Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              {/* Quantity Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 600 }}>
                  Quantity:
                </Typography>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1 || isUpdating}
                    sx={{ 
                      borderRadius: 0,
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        background: (theme) => alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  
                  <TextField
                    size="small"
                    value={quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value);
                      if (!isNaN(newQuantity) && newQuantity > 0) {
                        setQuantity(newQuantity);
                      }
                    }}
                    onBlur={() => handleQuantityChange(quantity)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuantityChange(quantity)}
                    sx={{ 
                      width: 80,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                      },
                    }}
                    inputProps={{
                      min: 1,
                      step: 1,
                      style: { textAlign: 'center', fontWeight: 700, fontSize: '1rem' }
                    }}
                  />
                  
                  <IconButton
                    size="small"
                    onClick={incrementQuantity}
                    disabled={isUpdating}
                    sx={{ 
                      borderRadius: 0,
                      borderLeft: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        background: (theme) => alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    ml: 1, 
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    background: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                >
                  = {item.quantity} {item.product.unit}
                </Typography>
              </Box>

              {/* Remove Button */}
              <IconButton
                color="error"
                onClick={handleRemove}
                size="small"
                sx={{ 
                  border: '2px solid', 
                  borderColor: 'error.main',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'error.main',
                    color: 'white',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )}
    </AnimatePresence>
  );
};

export default CartItemComponent;
