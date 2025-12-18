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
  Grid,
  alpha,
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
  Inventory,
  LocalOffer,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../../types';
import OrderTimeline from './OrderTimeline';

interface OrderDetailProps {
  orderId?: number;
  onBack?: () => void;
}

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId: propOrderId, onBack: propOnBack }) => {
  const { user } = useAuth();
  const { orderId: paramOrderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  // Use prop orderId if provided, otherwise use URL param
  const orderId = propOrderId || (paramOrderId ? parseInt(paramOrderId, 10) : undefined);
  const onBack = propOnBack || (() => navigate(-1));
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;
    
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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ p: 4, borderRadius: 3 }}
      >
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error || 'Order not found'}
        </Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={onBack}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Back to Orders
        </Button>
      </MotionPaper>
    );
  }

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={onBack}
            variant="outlined"
            sx={{ borderRadius: 2, borderWidth: 2, fontWeight: 600 }}
          >
            Back
          </Button>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Order {order.order_number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.created_at)}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<Receipt />}
            label={order.status_display}
            color={getStatusColor(order.status)}
            sx={{ fontWeight: 700, borderRadius: 2, px: 1 }}
          />
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => window.open(ordersAPI.downloadOrderCSV(order.id), '_blank')}
            sx={{ borderRadius: 2, borderWidth: 2, fontWeight: 600 }}
          >
            Export CSV
          </Button>
          
          {order.can_cancel && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={handleCancelOrder}
              disabled={cancelling}
              sx={{ borderRadius: 2, borderWidth: 2, fontWeight: 600 }}
            >
              {cancelling ? 'Cancelling...' : 'Cancel'}
            </Button>
          )}
        </Box>
      </MotionBox>

      {/* Order Timeline */}
      <MotionPaper
        variants={itemVariants}
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Order Progress
        </Typography>
        <OrderTimeline 
          currentStatus={order.status} 
          createdAt={order.created_at}
          updatedAt={order.updated_at}
        />
      </MotionPaper>

      {/* Order Information Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            variants={itemVariants}
            sx={{ 
              height: '100%',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Receipt sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Order Information
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Order Number</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {order.order_number}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Created</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(order.created_at)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(order.updated_at)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Items</Typography>
                  <Chip 
                    label={order.total_items}
                    size="small"
                    sx={{ 
                      fontWeight: 700,
                      background: (theme) => alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            component={motion.div}
            variants={itemVariants}
            sx={{ 
              height: '100%',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #004E64 0%, #007991 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Business sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Business Information
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {order.business_name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {order.contact_person}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {order.phone_number}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card
            component={motion.div}
            variants={itemVariants}
            sx={{ 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocationOn sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Delivery Information
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Delivery Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {order.delivery_address}
                  </Typography>
                </Box>
                
                {order.delivery_instructions && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Delivery Instructions
                    </Typography>
                    <Typography variant="body1">
                      {order.delivery_instructions}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {order.preferred_delivery_date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Preferred Date
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatDate(order.preferred_delivery_date)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {order.actual_delivery_date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ fontSize: 18, color: 'success.main' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Delivered On
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {formatDate(order.actual_delivery_date)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Items */}
      <MotionPaper
        variants={itemVariants}
        sx={{ 
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: (theme) => alpha(theme.palette.primary.main, 0.02),
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Inventory sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Order Items ({order.items.length})
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: (theme) => alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Item Code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Unit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow 
                  key={item.id}
                  component={motion.tr}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  sx={{ 
                    '&:hover': { 
                      background: (theme) => alpha(theme.palette.primary.main, 0.03),
                    },
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.product.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<LocalOffer sx={{ fontSize: '0.9rem' }} />}
                      label={item.product.item_code}
                      size="small"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        background: (theme) => alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.product.category.name}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'primary.main',
                      }}
                    >
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

        {/* Order Summary Footer */}
        <Box 
          sx={{ 
            p: 3, 
            background: (theme) => alpha(theme.palette.primary.main, 0.05),
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">Total Items</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{order.total_items}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">Order Status</Typography>
              <Chip
                label={order.status_display}
                color={getStatusColor(order.status)}
                size="small"
                sx={{ fontWeight: 600, mt: 0.5 }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">Order Date</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {new Date(order.created_at).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">Order Number</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                {order.order_number}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </MotionPaper>
    </MotionBox>
  );
};

export default OrderDetail;
