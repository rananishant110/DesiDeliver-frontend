import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';

import { ShoppingCart, CheckCircle } from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI } from '../../services/api';
import { CreateOrderData } from '../../types';

interface CheckoutFormProps {
  onOrderSuccess?: (orderId: number) => void;
  onCancel?: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onOrderSuccess, onCancel }) => {
  const { state, clearCart } = useCart();
  const cart = state.cart;
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<CreateOrderData>({
    delivery_address: user?.address_line1 ? `${user.address_line1}, ${user.city}, ${user.state} ${user.zip_code}` : '',
    delivery_instructions: '',
    preferred_delivery_date: undefined,
    business_name: user?.business_name || '',
    contact_person: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : '',
    phone_number: user?.phone_number || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof CreateOrderData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || cart.items.length === 0) {
      setError('Your cart is empty. Please add items before checkout.');
      return;
    }

    // Validate required fields
    if (!formData.delivery_address || !formData.business_name || !formData.contact_person || !formData.phone_number) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const order = await ordersAPI.createOrder(formData);
      setSuccess(true);
      
      // Clear cart after successful order
      await clearCart();
      
      // Call success callback if provided
      if (onOrderSuccess) {
        onOrderSuccess(order.id);
      }
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" color="success.main" gutterBottom>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Thank you for your order. We'll process it and get back to you soon.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mr: 2 }}
        >
          Continue Shopping
        </Button>
      </Paper>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Add some items to your cart before proceeding to checkout.
        </Typography>
        <Button variant="contained" onClick={onCancel}>
          Back to Shopping
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Total Items: {cart.total_items}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Quantity: {cart.total_quantity}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
          {/* Delivery Information */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="h6" gutterBottom>
              Delivery Information
            </Typography>
          </Box>
          
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField
              fullWidth
              label="Delivery Address *"
              value={formData.delivery_address}
              onChange={(e) => handleInputChange('delivery_address', e.target.value)}
              multiline
              rows={3}
              required
            />
          </Box>
          
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField
              fullWidth
              label="Delivery Instructions"
              value={formData.delivery_instructions}
              onChange={(e) => handleInputChange('delivery_instructions', e.target.value)}
              multiline
              rows={2}
              placeholder="Any special delivery instructions..."
            />
          </Box>
          
          <Box>
            <TextField
              fullWidth
              label="Preferred Delivery Date (YYYY-MM-DD)"
              value={formData.preferred_delivery_date || ''}
              onChange={(e) => handleInputChange('preferred_delivery_date', e.target.value)}
              placeholder="2025-08-25"
              helperText="Leave blank if no preference"
            />
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Business Information
            </Typography>
          </Box>
          
          <Box>
            <TextField
              fullWidth
              label="Business Name *"
              value={formData.business_name}
              onChange={(e) => handleInputChange('business_name', e.target.value)}
              required
            />
          </Box>
          
          <Box>
            <TextField
              fullWidth
              label="Contact Person *"
              value={formData.contact_person}
              onChange={(e) => handleInputChange('contact_person', e.target.value)}
              required
            />
          </Box>
          
          <Box>
            <TextField
              fullWidth
              label="Phone Number *"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              required
            />
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <ShoppingCart />}
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CheckoutForm;
