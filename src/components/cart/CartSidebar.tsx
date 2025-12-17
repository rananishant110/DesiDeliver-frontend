import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  Typography,
  Button,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Close,
  ShoppingCart,
  DeleteSweep,
  ShoppingBasket,
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import CartItemComponent from './CartItem';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ open, onClose }) => {
  const { state, clearCart, getCartSummary } = useCart();
  const navigate = useNavigate();
  const { cart, loading, error } = state;
  const { totalItems, totalQuantity, itemCount } = getCartSummary();

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  const handleCheckout = () => {
    navigate('/orders');
    onClose(); // Close the cart sidebar
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400, md: 500 },
          maxWidth: '90vw',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        backgroundColor: 'primary.main', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ShoppingCart fontSize="large" />
          <Typography variant="h5" component="h2">
            Shopping Cart
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Cart Summary */}
      <Paper sx={{ m: 2, p: 2, backgroundColor: 'grey.50' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary">
            Cart Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            Total Items: <strong>{totalItems}</strong>
          </Typography>
          <Typography variant="body1">
            Total Quantity: <strong>{totalQuantity}</strong>
          </Typography>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Cart Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {!loading && !error && (
          <>
            {cart && cart.items.length > 0 ? (
              <>
                {/* Cart Items */}
                <Box sx={{ mb: 3 }}>
                  {cart.items.map((item) => (
                    <CartItemComponent key={item.id} item={item} />
                  ))}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingBasket />}
                    onClick={handleCheckout}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteSweep />}
                    onClick={handleClearCart}
                    fullWidth
                  >
                    Clear Cart
                  </Button>
                </Box>
              </>
            ) : (
              /* Empty Cart State */
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}>
                <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary">
                  Your cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start shopping to add items to your cart
                </Typography>
                <Button
                  variant="contained"
                  onClick={onClose}
                  sx={{ mt: 2 }}
                >
                  Browse Products
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Footer */}
      {cart && cart.items.length > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Cart will be saved automatically
            </Typography>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default CartSidebar;
