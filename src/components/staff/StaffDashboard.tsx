import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Grid,
  alpha,
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  LocalShipping,
  Schedule,
  Cancel,
  Search,
  Refresh,
  ArrowBack,
  AttachMoney,
  ShoppingCart,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderForStaff {
  id: number;
  order_number: string;
  status: string;
  status_display: string;
  business_name: string;
  contact_person: string;
  phone_number: string;
  delivery_address: string;
  total_items: number;
  created_at: string;
  updated_at: string;
  preferred_delivery_date?: string;
  delivery_instructions?: string;
  can_be_updated: boolean;
  next_available_statuses: string[];
}

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_CONFIG: Record<OrderStatus, { color: 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error'; icon: React.ReactElement; gradient: string }> = {
  pending: { color: 'warning', icon: <Schedule />, gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' },
  confirmed: { color: 'info', icon: <CheckCircle />, gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' },
  processing: { color: 'primary', icon: <Schedule />, gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' },
  shipped: { color: 'secondary', icon: <LocalShipping />, gradient: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)' },
  delivered: { color: 'success', icon: <CheckCircle />, gradient: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' },
  cancelled: { color: 'error', icon: <Cancel />, gradient: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' },
};

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const StaffDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderForStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      if (!user?.is_staff) {
        navigate('/');
        return;
      }
      fetchOrders();
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/orders/staff/');
      setOrders(response.data.orders || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingOrder(orderId);
      await api.patch('/orders/' + orderId + '/status/', { status: newStatus });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update order status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getOrdersByStatus = (status: string) => orders.filter(o => o.status === status);

  const statCards = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, gradient: 'linear-gradient(135deg, #FF6B35 0%, #f44336 100%)' },
    { label: 'Pending', value: getOrdersByStatus('pending').length, icon: Schedule, gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' },
    { label: 'Confirmed', value: getOrdersByStatus('confirmed').length, icon: CheckCircle, gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' },
    { label: 'Processing', value: getOrdersByStatus('processing').length, icon: Schedule, gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)' },
    { label: 'Delivered', value: getOrdersByStatus('delivered').length, icon: CheckCircle, gradient: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' },
    { label: 'Cancelled', value: getOrdersByStatus('cancelled').length, icon: Cancel, gradient: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' },
  ];

  if (authLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{ borderRadius: 2 }} 
          action={
            <Button color="inherit" size="small" onClick={fetchOrders}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 4, 
          gap: 2 
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #FF6B35 0%, #004E64 100%)', 
              backgroundClip: 'text', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              mb: 0.5 
            }}
          >
            Staff Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage orders and track deliveries
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Orders">
            <IconButton onClick={fetchOrders} sx={{ bgcolor: 'action.hover', borderRadius: 2 }}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')} 
            startIcon={<ArrowBack />} 
            sx={{ borderRadius: 2, borderWidth: 2, fontWeight: 600 }}
          >
            Dashboard
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid 
        container 
        spacing={2} 
        sx={{ mb: 4 }} 
        component={motion.div} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
      >
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 6, sm: 4, md: 2 }} key={stat.label}>
            <Card 
              component={motion.div} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.05 }} 
              sx={{ 
                borderRadius: 3, 
                border: '1px solid', 
                borderColor: 'divider', 
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: (theme) => '0 8px 25px ' + alpha(theme.palette.primary.main, 0.15)
                }, 
                transition: 'all 0.3s ease' 
              }}
            >
              <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 2, 
                    background: stat.gradient, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mx: 'auto', 
                    mb: 1.5 
                  }}
                >
                  <stat.icon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Card 
        sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }} 
        component={motion.div} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
      >
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by business, contact, or order #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Status</InputLabel>
                <Select 
                  value={filterStatus} 
                  label="Filter by Status" 
                  onChange={(e) => setFilterStatus(e.target.value)} 
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Orders</MenuItem>
                  {Object.keys(STATUS_CONFIG).map((status) => (
                    <MenuItem key={status} value={status}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {STATUS_CONFIG[status as OrderStatus].icon}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {Object.entries(STATUS_CONFIG).slice(0, 4).map(([status, config]) => (
                  <Chip
                    key={status}
                    label={status + ': ' + getOrdersByStatus(status).length}
                    size="small"
                    sx={{ background: config.gradient, color: 'white', fontWeight: 600 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card 
        sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }} 
        component={motion.div} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Business / Contact</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                      <Box sx={{ color: 'text.secondary' }}>
                        <ShoppingCart sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                        <Typography>No orders found</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      component={motion.tr}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {order.order_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.business_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.contact_person}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={order.total_items + ' items'} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {order.delivery_address}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={STATUS_CONFIG[order.status as OrderStatus]?.icon}
                          label={order.status}
                          size="small"
                          sx={{
                            background: STATUS_CONFIG[order.status as OrderStatus]?.gradient,
                            color: 'white',
                            fontWeight: 600,
                            '& .MuiChip-icon': { color: 'white' },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => navigate('/orders/' + order.id)} 
                              sx={{ 
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { 
                                  bgcolor: 'primary.dark' 
                                }
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {order.can_be_updated && order.next_available_statuses?.length > 0 && (
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value=""
                                displayEmpty
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                disabled={updatingOrder === order.id}
                                sx={{ borderRadius: 2, fontSize: '0.75rem' }}
                              >
                                <MenuItem value="" disabled>Update</MenuItem>
                                {order.next_available_statuses.map((nextStatus) => (
                                  <MenuItem key={nextStatus} value={nextStatus}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      {STATUS_CONFIG[nextStatus as OrderStatus]?.icon}
                                      {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                          {updatingOrder === order.id && <CircularProgress size={20} />}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default StaffDashboard;
