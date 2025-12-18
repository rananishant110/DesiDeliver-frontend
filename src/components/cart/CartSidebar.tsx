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
  alpha,
} from '@mui/material';
import {
  Close,
  ShoppingCart,
  DeleteSweep,
  ShoppingBasket,
  ArrowForward,
  Inventory,
  LocalOffer,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import CartItemComponent from './CartItem';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const MotionBox = motion(Box);

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
    onClose();
  };

  const handleViewCart = () => {
    navigate('/cart');
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 420, md: 480 },
          maxWidth: '95vw',
          background: (theme) => theme.palette.mode === 'dark'
            ? theme.palette.background.default
            : '#FAFAFA',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingCart fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
              Shopping Cart
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Close />
        </IconButton>
      </Box>

      {/* Cart Summary */}
      <AnimatePresence>
        {cart && cart.items.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            sx={{ px: 2, pt: 2 }}
          >
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                background: (theme) => theme.palette.background.paper,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box 
                  sx={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    background: (theme) => alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <LocalOffer sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {totalItems}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Items
                    </Typography>
                  </Box>
                </Box>
                <Box 
                  sx={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    background: (theme) => alpha(theme.palette.secondary.main, 0.1),
                  }}
                >
                  <Inventory sx={{ color: 'secondary.main', fontSize: '1.2rem' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {totalQuantity}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Quantity
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ m: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: 'primary.main' }} />
        </Box>
      )}

      {/* Cart Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {!loading && !error && (
          <>
            {cart && cart.items.length > 0 ? (
              <Box>
                {cart.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CartItemComponent item={item} />
                  </motion.div>
                ))}
              </Box>
            ) : (
              /* Empty Cart State */
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: (theme) => alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <ShoppingCart sx={{ fontSize: 48, color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Your cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250 }}>
                  Start shopping to add items to your cart
                </Typography>
                <Button
                  variant="contained"
                  onClick={onClose}
                  sx={{ 
                    mt: 2,
                    px: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E55A2B 0%, #E8820D 100%)',
                    },
                  }}
                >
                  Browse Products
                </Button>
              </MotionBox>
            )}
          </>
        )}
      </Box>

      {/* Footer Actions */}
      <AnimatePresence>
        {cart && cart.items.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Divider />
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleCheckout}
                fullWidth
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E55A2B 0%, #E8820D 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Proceed to Checkout
              </Button>
              
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<ShoppingBasket />}
                  onClick={handleViewCart}
                  fullWidth
                  sx={{ 
                    borderRadius: 2,
                    borderWidth: 2,
                    fontWeight: 600,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }}
                >
                  View Cart
                </Button>
                
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteSweep />}
                  onClick={handleClearCart}
                  sx={{ 
                    borderRadius: 2,
                    borderWidth: 2,
                    fontWeight: 600,
                    minWidth: 'auto',
                    px: 2,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'error.main',
                      color: 'white',
                    },
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
            
            {/* Info Footer */}
            <Box sx={{ 
              p: 2, 
              pt: 0,
              textAlign: 'center',
            }}>
              <Typography variant="caption" color="text.secondary">
                💾 Cart saved automatically
              </Typography>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </Drawer>
  );
};

export default CartSidebar;
