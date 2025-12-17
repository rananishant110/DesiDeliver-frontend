import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { ordersAPI, ticketsAPI } from '../../services/api';
import { CreateTicketData, Order } from '../../types';

interface CreateTicketFormProps {
  orderId?: number;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ orderId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const [formData, setFormData] = useState<CreateTicketData>({
    subject: '',
    description: '',
    category: 'other',
    priority: 'medium',
    order_id: orderId,
  });

  const [formErrors, setFormErrors] = useState<{
    subject?: string;
    description?: string;
  }>({});

  // Fetch user's orders for order selection
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getOrders(1, 100);
        // Convert OrderSummary to Order format (basic info is enough for dropdown)
        const orderList: Order[] = response.orders.map((summary) => ({
          ...summary,
          customer: {} as any, // Not needed for dropdown
          delivery_address: '',
          delivery_instructions: '',
          preferred_delivery_date: null,
          actual_delivery_date: null,
          business_name: summary.business_name,
          contact_person: '',
          phone_number: '',
          updated_at: summary.created_at,
          items: [],
          can_cancel: false,
        }));
        setOrders(orderList);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    
    if (!orderId) {
      fetchOrders();
    }
  }, [orderId]);

  const validateForm = (): boolean => {
    const errors: { subject?: string; description?: string } = {};

    if (formData.subject.length < 5) {
      errors.subject = 'Subject must be at least 5 characters long';
    }

    if (formData.description.length < 20) {
      errors.description = 'Description must be at least 20 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof CreateTicketData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ticket = await ticketsAPI.createTicket(formData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate(`/tickets/${ticket.id}`);
      }, 1500);
    } catch (err: any) {
      console.error('Error creating ticket:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to create ticket. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
        <Alert severity="success">
          <Typography variant="h6">Ticket Created Successfully!</Typography>
          <Typography variant="body2">
            Your support ticket has been created. Our team will review it shortly.
          </Typography>
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Support Ticket
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Having an issue with your order or our service? Let us know and we'll help you resolve it.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Subject"
          required
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          error={!!formErrors.subject}
          helperText={formErrors.subject || 'Brief description of your issue (min 5 characters)'}
          sx={{ mb: 3 }}
          disabled={loading}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Category *</InputLabel>
          <Select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            label="Category *"
            disabled={loading}
          >
            <MenuItem value="order_issue">Order Issue</MenuItem>
            <MenuItem value="product_quality">Product Quality</MenuItem>
            <MenuItem value="delivery">Delivery</MenuItem>
            <MenuItem value="billing">Billing</MenuItem>
            <MenuItem value="technical">Technical</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          <FormHelperText>Select the category that best describes your issue</FormHelperText>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            label="Priority"
            disabled={loading}
          >
            <MenuItem value="low">Low - General inquiry</MenuItem>
            <MenuItem value="medium">Medium - Normal issue</MenuItem>
            <MenuItem value="high">High - Important issue</MenuItem>
            <MenuItem value="urgent">Urgent - Critical issue</MenuItem>
          </Select>
          <FormHelperText>Select the urgency level</FormHelperText>
        </FormControl>

        {!orderId && orders.length > 0 && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Related Order (Optional)</InputLabel>
            <Select
              value={formData.order_id || ''}
              onChange={(e) => handleChange('order_id', e.target.value ? Number(e.target.value) : undefined)}
              label="Related Order (Optional)"
              disabled={loading}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {orders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  {order.order_number} - {order.status_display} ({new Date(order.created_at).toLocaleDateString()})
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select an order if your issue is related to a specific order</FormHelperText>
          </FormControl>
        )}

        <TextField
          fullWidth
          label="Description"
          required
          multiline
          rows={6}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={!!formErrors.description}
          helperText={formErrors.description || 'Detailed description of your issue (min 20 characters)'}
          sx={{ mb: 3 }}
          disabled={loading}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/tickets')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Creating...' : 'Create Ticket'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreateTicketForm;
