import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
  alpha,
} from '@mui/material';
import {
  ShoppingCart,
  ArrowBack,
  CheckCircle,
  LocalShipping,
  Inventory,
  ShoppingBag,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import CartItemComponent from './CartItem';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const cart = state.cart;

  if (!cart || cart.items.length === 0) {
    return (
      <Box 
        sx={{ 
          maxWidth: 600, 
          mx: 'auto', 
          p: 3,
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MotionPaper 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 4,
            background: (theme) => theme.palette.mode === 'dark' 
              ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`
              : 'white',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: (theme) => alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <ShoppingCart sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/catalog')}
            startIcon={<ShoppingBag />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #E55A2B 0%, #E8820D 100%)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Browse Products
          </Button>
        </MotionPaper>
      </Box>
    );
  }

  return (
    <Box 
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 3 } }}
    >
      {/* Header */}
      <MotionBox 
        variants={itemVariants}
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', md: 'center' }, 
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            Shopping Cart
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {cart.total_items} {cart.total_items === 1 ? 'item' : 'items'} in your cart
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/catalog')}
            startIcon={<ArrowBack />}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Continue Shopping
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            onClick={() => navigate('/orders')}
            size="large"
            sx={{
              px: 4,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              fontWeight: 600,
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
        </Box>
      </MotionBox>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <MotionBox variants={itemVariants}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Cart Items
            </Typography>
            <Box sx={{ maxHeight: { xs: 'auto', lg: 600 }, overflow: 'auto', pr: 1 }}>
              {cart.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CartItemComponent item={item} />
                </motion.div>
              ))}
            </Box>
          </MotionBox>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} lg={4}>
          <MotionPaper
            variants={itemVariants}
            sx={{
              p: 3,
              borderRadius: 3,
              position: { lg: 'sticky' },
              top: { lg: 100 },
              border: '1px solid',
              borderColor: 'divider',
              background: (theme) => theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : 'white',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              Order Summary
            </Typography>

            {/* Summary Stats */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  background: (theme) => alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <ShoppingBag sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {cart.total_items}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Items
                  </Typography>
                </Box>
              </Box>

              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  background: (theme) => alpha(theme.palette.secondary.main, 0.1),
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #004E64 0%, #007991 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <Inventory sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {cart.total_quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Quantity
                  </Typography>
                </Box>
              </Box>

              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  background: (theme) => alpha(theme.palette.success.main, 0.1),
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <LocalShipping sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {cart.items.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unique Products
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Info Note */}
            <Box 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                background: (theme) => alpha(theme.palette.info.main, 0.1),
                mb: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                💡 <strong>Note:</strong> Final pricing will be confirmed at checkout based on current market rates.
              </Typography>
            </Box>

            {/* Checkout Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<CheckCircle />}
              onClick={() => navigate('/orders')}
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
          </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;
