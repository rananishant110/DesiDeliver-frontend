import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  alpha,
  Card,
} from '@mui/material';
import {
  Visibility,
  Cancel,
  Receipt,
  Refresh,
  Download,
  TrendingUp,
  Pending,
  LocalShipping,
  CheckCircle,
  FilterList,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI } from '../../services/api';
import { OrderSummary, OrderStats } from '../../types';

interface OrderHistoryProps {
  onViewOrder?: (orderId: number) => void;
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

const OrderHistory: React.FC<OrderHistoryProps> = ({ onViewOrder }) => {
  const { user } = useAuth();
  
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // Filtering state
  const [statusFilter, setStatusFilter] = useState<string>('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ordersAPI.getOrders(page, pageSize, statusFilter);
      setOrders(response.orders);
      setTotalPages(response.pagination.total_pages);
      setTotalOrders(response.pagination.total_orders);
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await ordersAPI.getOrderStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load order stats:', err);
    }
  };

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [page, pageSize, statusFilter]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      await ordersAPI.cancelOrder(orderId);
      loadOrders();
      loadStats();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cancel order');
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
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  const statCards = [
    { 
      label: 'Total Orders', 
      value: stats?.total_orders || 0, 
      icon: Receipt,
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    },
    { 
      label: 'Pending', 
      value: stats?.pending_orders || 0, 
      icon: Pending,
      gradient: 'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)',
    },
    { 
      label: 'Processing', 
      value: stats?.processing_orders || 0, 
      icon: LocalShipping,
      gradient: 'linear-gradient(135deg, #29B6F6 0%, #0288D1 100%)',
    },
    { 
      label: 'Delivered', 
      value: stats?.delivered_orders || 0, 
      icon: CheckCircle,
      gradient: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    },
  ];

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stats Cards */}
      {stats && (
        <MotionBox 
          variants={itemVariants}
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 2, 
            mb: 4 
          }}
        >
          {statCards.map((stat, index) => (
            <Card
              key={stat.label}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: stat.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${alpha('#FF6B35', 0.3)}`,
                  }}
                >
                  <stat.icon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </MotionBox>
      )}

      {/* Main Content */}
      <MotionPaper
        variants={itemVariants}
        sx={{ 
          borderRadius: 3, 
          border: '1px solid', 
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: (theme) => alpha(theme.palette.primary.main, 0.02),
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Order History
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              startIcon={<Download />}
              variant="outlined"
              onClick={() => window.open(ordersAPI.downloadOrdersSummaryCSV(), '_blank')}
              disabled={loading || orders.length === 0}
              sx={{ borderRadius: 2, borderWidth: 2, fontWeight: 600 }}
            >
              Export CSV
            </Button>
            
            <Button
              startIcon={<Refresh />}
              variant="outlined"
              onClick={() => {
                setPage(1);
                loadOrders();
                loadStats();
              }}
              disabled={loading}
              sx={{ borderRadius: 2, borderWidth: 2, fontWeight: 600 }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FilterList sx={{ color: 'text.secondary' }} />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="ready">Ready</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          
          <Chip 
            label={`${orders.length} of ${totalOrders} orders`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mx: 3, mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Orders Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: (theme) => alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Business</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow 
                  key={order.id}
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
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 700, 
                        fontFamily: 'monospace',
                        color: 'primary.main',
                      }}
                    >
                      {order.order_number}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {order.business_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {order.item_count} items
                      </Typography>
                      <Chip 
                        label={`${order.total_items} qty`}
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          background: (theme) => alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status_display}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{ fontWeight: 600, borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => onViewOrder?.(order.id)}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': {
                              background: (theme) => alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      
                      {order.status === 'pending' && (
                        <Tooltip title="Cancel Order">
                          <IconButton
                            size="small"
                            onClick={() => handleCancelOrder(order.id)}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': {
                                background: (theme) => alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                },
              }}
            />
          </Box>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 3,
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
                mx: 'auto',
                mb: 3,
              }}
            >
              <Receipt sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              No Orders Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {statusFilter ? `No orders with status "${statusFilter}"` : 'You haven\'t placed any orders yet.'}
            </Typography>
          </Box>
        )}
      </MotionPaper>
    </MotionBox>
  );
};

export default OrderHistory;
