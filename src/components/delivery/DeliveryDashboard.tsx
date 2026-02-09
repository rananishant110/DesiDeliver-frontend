import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  LocalShipping as TruckIcon,
  CheckCircle as CheckIcon,
  Schedule as ClockIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { DeliveryTrackingList, PaginatedResponse } from '../../types';
import { deliveryApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import DeliveryMapDemo from './DeliveryMapDemo';

const DeliveryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<DeliveryTrackingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    delivered: 0,
    pending: 0,
  });

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const params: any = {};
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response: PaginatedResponse<DeliveryTrackingList> = await deliveryApi.getDeliveryTrackings(params);
      setDeliveries(response.results);
      
      // Calculate stats
      const allDeliveries: PaginatedResponse<DeliveryTrackingList> = await deliveryApi.getDeliveryTrackings();
      const active = allDeliveries.results.filter(d => 
        ['assigned', 'picked_up', 'in_transit', 'nearby'].includes(d.status)
      ).length;
      const delivered = allDeliveries.results.filter(d => d.status === 'delivered').length;
      const pending = allDeliveries.results.filter(d => d.status === 'assigned').length;
      
      setStats({
        total: allDeliveries.count,
        active,
        delivered,
        pending,
      });
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [statusFilter]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
      assigned: 'default',
      picked_up: 'info',
      in_transit: 'primary',
      nearby: 'warning',
      delivered: 'success',
      failed: 'error',
      cancelled: 'default'
    };
    return colors[status] || 'default';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, HH:mm');
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Delivery Dashboard</Typography>
        <IconButton onClick={fetchDeliveries} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <TruckIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4">{stats.total}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Deliveries
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <ClockIcon color="warning" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4">{stats.active}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Deliveries
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <CheckIcon color="success" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4">{stats.delivered}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <TruckIcon color="info" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4">{stats.pending}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Assignment
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Live Tracking Map */}
      <Box sx={{ mb: 3 }}>
        <DeliveryMapDemo />
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              select
              label="Status Filter"
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 200 }}
              size="small"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="picked_up">Picked Up</MenuItem>
              <MenuItem value="in_transit">In Transit</MenuItem>
              <MenuItem value="nearby">Nearby</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Active Deliveries
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : deliveries.length === 0 ? (
            <Alert severity="info">No deliveries found</Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Driver</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned At</TableCell>
                    <TableCell>Est. Delivery</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveries.map((delivery: any) => (
                    <TableRow key={delivery.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {delivery.order_number}
                        </Typography>
                      </TableCell>
                      <TableCell>{delivery.customer_name}</TableCell>
                      <TableCell>
                        {delivery.driver ? (
                          <Typography variant="body2">
                            {delivery.driver.user.first_name} {delivery.driver.user.last_name}
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {delivery.driver.vehicle_type}
                            </Typography>
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not assigned
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={formatStatus(delivery.status)}
                          color={getStatusColor(delivery.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateTime(delivery.assigned_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {delivery.estimated_delivery_time ? (
                          <Typography variant="body2">
                            {formatDateTime(delivery.estimated_delivery_time)}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/delivery/track/${delivery.order}`)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DeliveryDashboard;
