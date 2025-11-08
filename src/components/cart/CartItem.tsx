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
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  Inventory,
} from '@mui/icons-material';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

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
    try {
      await removeFromCart(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
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
    <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 2 }}>
        {/* Product Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600 }}>
              {item.product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.product.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`Item Code: ${item.product.item_code}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`Unit: ${item.product.unit}`}
                size="small"
                variant="outlined"
              />
              {item.product.brand && (
                <Chip
                  label={`Brand: ${item.product.brand}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          
          {/* Stock Status */}
          <Box sx={{ textAlign: 'right', ml: 2 }}>
            <Chip
              icon={<Inventory />}
              label="In Stock"
              color="success"
              size="small"
              variant="outlined"
            />
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Available for order
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Quantity Controls and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Quantity Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Quantity:
            </Typography>
            
            <IconButton
              size="small"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || isUpdating}
              sx={{ border: '1px solid', borderColor: 'divider' }}
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
              sx={{ width: 80, mx: 1 }}
              inputProps={{
                min: 1,
                step: 1,
                style: { textAlign: 'center' }
              }}
            />
            
            <IconButton
              size="small"
              onClick={incrementQuantity}
              disabled={isUpdating}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>

          {/* Remove Button */}
          <IconButton
            color="error"
            onClick={handleRemove}
            size="small"
            sx={{ 
              border: '1px solid', 
              borderColor: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'white'
              }
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>

        {/* Total Quantity Display */}
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            Total: {item.quantity} {item.product.unit}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItemComponent;
