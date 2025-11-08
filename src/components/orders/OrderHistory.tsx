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
} from '@mui/material';
import {
  Visibility,
  Cancel,
  Receipt,
  Refresh,
  Download,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI } from '../../services/api';
import { OrderSummary, OrderStats } from '../../types';

interface OrderHistoryProps {
  onViewOrder?: (orderId: number) => void;
}

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
      // Don't show error for stats, just log it
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
    setPage(1); // Reset to first page when filter changes
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      await ordersAPI.cancelOrder(orderId);
      // Reload orders after cancellation
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
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading orders...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Order History
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<Download />}
            variant="outlined"
            onClick={() => window.open(ordersAPI.downloadOrdersSummaryCSV(), '_blank')}
            disabled={loading || orders.length === 0}
          >
            Download Summary CSV
          </Button>
          
          <Button
            startIcon={<Refresh />}
            onClick={() => {
              setPage(1);
              loadOrders();
              loadStats();
            }}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Order Statistics */}
      {stats && (
        <Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 1 }}>
            <Typography variant="h6">{stats.total_orders}</Typography>
            <Typography variant="body2">Total Orders</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', color: 'white', borderRadius: 1 }}>
            <Typography variant="h6">{stats.pending_orders}</Typography>
            <Typography variant="body2">Pending</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', color: 'white', borderRadius: 1 }}>
            <Typography variant="h6">{stats.processing_orders}</Typography>
            <Typography variant="body2">Processing</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', color: 'white', borderRadius: 1 }}>
            <Typography variant="h6">{stats.delivered_orders}</Typography>
            <Typography variant="body2">Delivered</Typography>
          </Box>
        </Box>
      )}

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={handleStatusFilterChange}
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
        
        <Typography variant="body2" color="text.secondary">
          Showing {orders.length} of {totalOrders} orders
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Orders Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Business</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {order.order_number}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>{order.business_name}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {order.item_count} items ({order.total_items} total)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status_display}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Order">
                      <IconButton
                        size="small"
                        onClick={() => onViewOrder?.(order.id)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    
                    {order.status === 'pending' && (
                      <Tooltip title="Cancel Order">
                        <IconButton
                          size="small"
                          onClick={() => handleCancelOrder(order.id)}
                          color="error"
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
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Receipt sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Orders Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {statusFilter ? `No orders with status "${statusFilter}"` : 'You haven\'t placed any orders yet.'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default OrderHistory;
