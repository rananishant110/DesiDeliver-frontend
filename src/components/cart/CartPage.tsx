import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import {
  ShoppingCart,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';


interface CartPageProps {
  onBackToDashboard: () => void;
  onNavigateToCheckout: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ onBackToDashboard, onNavigateToCheckout }) => {
  const { state } = useCart();
  const cart = state.cart;

  if (!cart || cart.items.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add some items to your cart before proceeding to checkout.
          </Typography>
          <Button
            variant="contained"
            onClick={onBackToDashboard}
            startIcon={<ArrowBack />}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Shopping Cart
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            onClick={onNavigateToCheckout}
            size="large"
          >
            Proceed to Checkout ({cart.total_items} items)
          </Button>
          
          <Button
            variant="outlined"
            onClick={onBackToDashboard}
            startIcon={<ArrowBack />}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cart Summary
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 1 }}>
            <Typography variant="h6">{cart.total_items}</Typography>
            <Typography variant="body2">Total Items</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', color: 'white', borderRadius: 1 }}>
            <Typography variant="h6">{cart.total_quantity}</Typography>
            <Typography variant="body2">Total Quantity</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', color: 'white', borderRadius: 1 }}>
            <Typography variant="h6">{cart.items.length}</Typography>
            <Typography variant="body2">Unique Products</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Cart Items
        </Typography>
        
        {/* Display cart items */}
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {cart.items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 2,
                '&:last-child': { mb: 0 }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {item.product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.product.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Item Code: {item.product.item_code} | Category: {item.product.category.name}
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'right', ml: 2 }}>
                <Typography variant="h6" color="primary">
                  Qty: {item.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unit: {item.product.unit}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default CartPage;
