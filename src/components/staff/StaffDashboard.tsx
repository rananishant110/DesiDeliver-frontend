import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Refresh,
  Search,
  FilterList,
  Update,
  CheckCircle,
  PlayArrow,
  LocalShipping,
  Done,
  Cancel,
  Visibility,
  Edit,
} from '@mui/icons-material';
import { ordersAPI } from '../../services/api';
import { Order } from '../../types';

interface OrderForStaff extends Order {
  can_be_updated: boolean;
  next_available_statuses: string[];
}

interface StaffDashboardState {
  orders: OrderForStaff[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    total_orders: number;
    has_next: boolean;
    has_previous: boolean;
  };
  summary: {
    total_orders: number;
    pending_orders: number;
    confirmed_orders: number;
    processing_orders: number;
    ready_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
  };
}

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<StaffDashboardState>({
    orders: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      page_size: 20,
      total_pages: 1,
      total_orders: 0,
      has_next: false,
      has_previous: false,
    },
    summary: {
      total_orders: 0,
      pending_orders: 0,
      confirmed_orders: 0,
      processing_orders: 0,
      ready_orders: 0,
      delivered_orders: 0,
      cancelled_orders: 0,
    },
  });

  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: '',
  });

  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkNotes, setBulkNotes] = useState('');
  const [processingBulk, setProcessingBulk] = useState(false);
  const [editOrderDialog, setEditOrderDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [processingEdit, setProcessingEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  });

  // Fetch orders for staff
  const fetchOrders = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await ordersAPI.getOrdersForStaff({
        page: state.pagination.page,
        page_size: state.pagination.page_size,
        status: filters.status,
        date: filters.date,
        search: filters.search,
      });

      setState(prev => ({
        ...prev,
        orders: response.orders,
        pagination: response.pagination,
        summary: response.summary,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        loading: false,
      }));
    }
  }, [state.pagination.page, state.pagination.page_size, filters]);

  // Load orders on component mount and filter changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);



  // Handle filter changes
  const handleFilterChange = (filter: string, value: string) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
    setState(prev => ({ ...prev, pagination: { ...prev.pagination, page: 1 } }));
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setState(prev => ({ ...prev, pagination: { ...prev.pagination, page: value } }));
  };

  // Handle order selection
  const handleOrderSelection = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  // Handle edit order
  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setEditStatus(order.status);
    setEditNotes(order.notes || '');
    setEditOrderDialog(true);
  };

  // Handle order status update
  const handleOrderStatusUpdate = async () => {
    if (!editingOrder || !editStatus) return;

    setProcessingEdit(true);
    try {
      const response = await ordersAPI.updateOrderStatus(editingOrder.id, {
        status: editStatus,
        notes: editNotes,
      });

      setSnackbar({
        open: true,
        message: response.message,
        severity: 'success',
      });

      // Close dialog and refresh orders
      setEditOrderDialog(false);
      setEditingOrder(null);
      setEditStatus('');
      setEditNotes('');
      fetchOrders();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to update order',
        severity: 'error',
      });
    } finally {
      setProcessingEdit(false);
    }
  };

  // Handle bulk action
  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;

    setProcessingBulk(true);
    try {
      const response = await ordersAPI.bulkProcessOrders({
        order_ids: selectedOrders,
        action: bulkAction,
        notes: bulkNotes,
      });

      setSnackbar({
        open: true,
        message: response.message,
        severity: 'success',
      });

      // Refresh orders and reset selection
      setSelectedOrders([]);
      setBulkActionDialog(false);
      setBulkAction('');
      setBulkNotes('');
      fetchOrders();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Bulk action failed',
        severity: 'error',
      });
    } finally {
      setProcessingBulk(false);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      ready: 'success',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      pending: <CheckCircle />,
      confirmed: <CheckCircle />,
      processing: <PlayArrow />,
      ready: <LocalShipping />,
      delivered: <Done />,
      cancelled: <Cancel />,
    };
    return icons[status] || <CheckCircle />;
  };

  if (state.loading && state.orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Staff Dashboard - Order Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/staff-tickets')}>
            Manage Tickets
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' }, 
        gap: 3, 
        mb: 3 
      }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {state.summary.total_orders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Orders
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {state.summary.pending_orders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              {state.summary.confirmed_orders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confirmed
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main">
              {state.summary.processing_orders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Processing
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {state.summary.ready_orders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ready
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {state.summary.delivered_orders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Delivered
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              label="Search Orders"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by: Order #, Business Name, Contact Person, Phone, Address, Status, Customer Info..."
              size="small"
              sx={{ minWidth: 300 }}
              helperText="Search across all fields. Use multiple words for better results."
              InputProps={{
                endAdornment: filters.search && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {filters.search.split(' ').filter(term => term.length > 0).length} terms
                    </Typography>
                  </Box>
                ),
              }}
            />
            

          </Box>
          

          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
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

          <TextField
            label="Date"
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchOrders}
            disabled={state.loading}
          >
            Refresh
          </Button>

          {selectedOrders.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setBulkActionDialog(true)}
            >
              Bulk Action ({selectedOrders.length})
            </Button>
          )}
        </Box>
      </Paper>

      {/* Error Display */}
      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      )}

      {/* Orders Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedOrders.length === state.orders.length && state.orders.length > 0}
                    indeterminate={selectedOrders.length > 0 && selectedOrders.length < state.orders.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(state.orders.map(order => order.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Order #</TableCell>
                <TableCell>Business</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => handleOrderSelection(order.id, e.target.checked)}
                      disabled={!order.can_be_updated}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {order.order_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {order.business_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {order.contact_person}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {order.phone_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status_display}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.total_items}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {new Date(order.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {order.can_be_updated && (
                        <Tooltip title="Update Status">
                          <IconButton 
                            size="small" 
                            color="secondary"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit />
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
      </Paper>

      {/* Pagination */}
      {state.pagination.total_pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={state.pagination.total_pages}
            page={state.pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialog} onClose={() => setBulkActionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Order Processing</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Action</InputLabel>
              <Select
                value={bulkAction}
                label="Action"
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <MenuItem value="confirm">Confirm Orders</MenuItem>
                <MenuItem value="process">Start Processing</MenuItem>
                <MenuItem value="ready">Mark Ready for Delivery</MenuItem>
                <MenuItem value="deliver">Mark as Delivered</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Notes (Optional)"
              multiline
              rows={3}
              value={bulkNotes}
              onChange={(e) => setBulkNotes(e.target.value)}
              placeholder="Add any notes about this status change..."
            />

            <Typography variant="body2" color="text.secondary">
              This action will update {selectedOrders.length} order(s) and send notifications to customers.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBulkAction}
            variant="contained"
            disabled={!bulkAction || processingBulk}
          >
            {processingBulk ? <CircularProgress size={20} /> : 'Process Orders'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={editOrderDialog} onClose={() => setEditOrderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          {editingOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Order #{editingOrder.order_number} - {editingOrder.business_name}
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editStatus}
                  label="Status"
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="ready">Ready for Delivery</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Notes (Optional)"
                multiline
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add any notes about this status change..."
              />

              <Typography variant="body2" color="text.secondary">
                This will update the order status and send notifications to the customer.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOrderDialog(false)}>Cancel</Button>
          <Button
            onClick={handleOrderStatusUpdate}
            variant="contained"
            disabled={!editStatus || processingEdit}
          >
            {processingEdit ? <CircularProgress size={20} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StaffDashboard;
