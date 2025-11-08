import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  Receipt,
  LocationOn,
  Business,
  Person,
  Phone,
  CalendarToday,
  Cancel,
  Download,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI } from '../../services/api';
import { Order } from '../../types';

interface OrderDetailProps {
  orderId: number;
  onBack: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId, onBack }) => {
  const { user } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const orderData = await ordersAPI.getOrder(orderId);
      setOrder(orderData);
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !order.can_cancel) return;
    
    try {
      setCancelling(true);
      await ordersAPI.cancelOrder(order.id);
      
      // Reload order to get updated status
      await loadOrder();
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
      'pending': 'warning',
      'confirmed': 'info',
      'processing': 'primary',
      'ready': 'success',
      'delivered': 'success',
      'cancelled': 'error',
    };
    return statusColors[status] || 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading order details...
        </Typography>
      </Paper>
    );
  }

  if (error || !order) {
    return (
      <Paper sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={onBack}>
          Back to Orders
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={onBack}>
            Back to Orders
          </Button>
          <Divider orientation="vertical" flexItem />
          <Typography variant="h4">
            Order Details
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<Receipt />}
            label={order.status_display}
            color={getStatusColor(order.status)}
            size="medium"
          />
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Download />}
            onClick={() => window.open(ordersAPI.downloadOrderCSV(order.id), '_blank')}
            sx={{ mr: 1 }}
          >
            Download CSV
          </Button>
          
          {order.can_cancel && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          )}
        </Box>
      </Box>

            {/* Order Information */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Receipt color="primary" />
                <Typography variant="body2">
                  <strong>Order #:</strong> {order.order_number}
                </Typography>
              </Box>
              <Typography variant="body2">
                <strong>Created:</strong> {formatDate(order.created_at)}
              </Typography>
              <Typography variant="body2">
                <strong>Updated:</strong> {formatDate(order.updated_at)}
              </Typography>
              <Typography variant="body2">
                <strong>Total Items:</strong> {order.total_items}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Business Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business color="primary" />
                <Typography variant="body2">
                  <strong>Business:</strong> {order.business_name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                <Typography variant="body2">
                  <strong>Contact:</strong> {order.contact_person}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone color="primary" />
                <Typography variant="body2">
                  <strong>Phone:</strong> {order.phone_number}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ gridColumn: '1 / -1' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOn color="primary" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Delivery Address:
                    </Typography>
                    <Typography variant="body2">
                      {order.delivery_address}
                    </Typography>
                  </Box>
                </Box>
                
                {order.delivery_instructions && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOn color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Delivery Instructions:
                      </Typography>
                      <Typography variant="body2">
                        {order.delivery_instructions}
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', gap: 4 }}>
                  {order.preferred_delivery_date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday color="primary" />
                      <Typography variant="body2">
                        <strong>Preferred Date:</strong> {formatDate(order.preferred_delivery_date)}
                      </Typography>
                    </Box>
                  )}
                  
                  {order.actual_delivery_date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday color="success" />
                      <Typography variant="body2">
                        <strong>Delivered:</strong> {formatDate(order.actual_delivery_date)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Order Items */}
      <Typography variant="h5" gutterBottom>
        Order Items
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Item Code</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {item.product.item_code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.product.category.name}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {item.quantity}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {item.product.unit}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Summary */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total Items: <strong>{order.total_items}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Order Status: <strong>{order.status_display}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Order Date: <strong>{formatDate(order.created_at)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Order Number: <strong>{order.order_number}</strong>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default OrderDetail;
