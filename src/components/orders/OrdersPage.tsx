import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  alpha,
} from '@mui/material';
import {
  ShoppingCart,
  ArrowBack,
  History,
  AddShoppingCart,
  Receipt,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import CheckoutForm from './CheckoutForm';
import OrderHistory from './OrderHistory';
import OrderDetail from './OrderDetail';

type OrderView = 'checkout' | 'history' | 'detail';

const MotionBox = motion(Box);

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const cart = state.cart;
  
  const [currentView, setCurrentView] = useState<OrderView>('history');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleViewOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCurrentView('detail');
  };

  const handleOrderSuccess = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCurrentView('detail');
  };

  const handleBackToHistory = () => {
    setCurrentView('history');
    setSelectedOrderId(null);
    setActiveTab(0);
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      setCurrentView('history');
    } else if (newValue === 1) {
      setCurrentView('checkout');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'checkout':
        return (
          <CheckoutForm
            onOrderSuccess={handleOrderSuccess}
            onCancel={() => {
              setCurrentView('history');
              setActiveTab(0);
            }}
          />
        );
      
      case 'detail':
        return selectedOrderId ? (
          <OrderDetail
            orderId={selectedOrderId}
            onBack={handleBackToHistory}
          />
        ) : (
          <Typography>Order not found</Typography>
        );
      
      case 'history':
      default:
        return (
          <OrderHistory
            onViewOrder={handleViewOrder}
          />
        );
    }
  };

  // Don't show tabs for detail view
  if (currentView === 'detail') {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 3 } }}>
        {renderContent()}
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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
            Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your orders and checkout
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBackToDashboard}
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
          Back to Dashboard
        </Button>
      </MotionBox>

      {/* Tab Navigation */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        sx={{ mb: 3 }}
      >
        <Box
          sx={{
            background: (theme) => theme.palette.background.paper,
            borderRadius: 3,
            p: 1,
            border: '1px solid',
            borderColor: 'divider',
            display: 'inline-flex',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 48,
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTab-root': {
                minHeight: 48,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                px: 3,
                mr: 1,
                '&:last-child': { mr: 0 },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  color: 'white',
                },
              },
            }}
          >
            <Tab 
              icon={<History sx={{ fontSize: 20 }} />} 
              iconPosition="start" 
              label="Order History" 
            />
            <Tab 
              icon={<AddShoppingCart sx={{ fontSize: 20 }} />} 
              iconPosition="start" 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  New Order
                  {cart && cart.items.length > 0 && (
                    <Box
                      sx={{
                        background: activeTab === 1 ? 'rgba(255,255,255,0.3)' : 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        color: 'white',
                        borderRadius: 10,
                        px: 1,
                        py: 0.25,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {cart.total_items}
                    </Box>
                  )}
                </Box>
              }
              disabled={!cart || cart.items.length === 0}
            />
          </Tabs>
        </Box>
      </MotionBox>

      {/* Content */}
      <AnimatePresence mode="wait">
        <MotionBox
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
};

export default OrdersPage;
