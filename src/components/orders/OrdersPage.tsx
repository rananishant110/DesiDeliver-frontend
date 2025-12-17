import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  ArrowBack,
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import CheckoutForm from './CheckoutForm';
import OrderHistory from './OrderHistory';
import OrderDetail from './OrderDetail';

type OrderView = 'checkout' | 'history' | 'detail';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const cart = state.cart;
  
  const [currentView, setCurrentView] = useState<OrderView>('history');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

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
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'checkout':
        return (
          <CheckoutForm
            onOrderSuccess={handleOrderSuccess}
            onCancel={() => setCurrentView('history')}
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

  const renderHeader = () => {
    switch (currentView) {
      case 'checkout':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Button startIcon={<ArrowBack />} onClick={() => setCurrentView('history')}>
              Back to Orders
            </Button>
            <Divider orientation="vertical" flexItem />
            <Typography variant="h4">
              Checkout
            </Typography>
          </Box>
        );
      
      case 'detail':
        return null; // OrderDetail component handles its own header
      
      case 'history':
      default:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">
              Orders
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {cart && cart.items.length > 0 && (
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => setCurrentView('checkout')}
                >
                  Checkout ({cart.total_items} items)
                </Button>
              )}
              
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {renderHeader()}
      {renderContent()}
    </Box>
  );
};

export default OrdersPage;
