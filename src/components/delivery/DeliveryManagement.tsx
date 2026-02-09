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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { DeliveryPersonnel, DeliveryPersonnelList, PaginatedResponse } from '../../types';
import { deliveryApi } from '../../services/api';

const DeliveryManagement: React.FC = () => {
  const [personnel, setPersonnel] = useState<DeliveryPersonnelList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DeliveryPersonnel | null>(null);

  const fetchPersonnel = async () => {
    setLoading(true);
    try {
      const params: any = {};
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response: PaginatedResponse<DeliveryPersonnelList> = await deliveryApi.getDeliveryPersonnel(params);
      setPersonnel(response.results);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch delivery personnel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, [statusFilter]);

  const handleViewDriver = async (id: number) => {
    try {
      const driver = await deliveryApi.getDeliveryPersonnelDetail(id);
      setSelectedDriver(driver);
      setDialogOpen(true);
    } catch (err) {
      console.error('Failed to fetch driver details:', err);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await deliveryApi.updateDriverStatus(id, newStatus);
      fetchPersonnel();
    } catch (err) {
      console.error('Failed to update driver status:', err);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: 'default' | 'success' | 'warning' | 'error' } = {
      available: 'success',
      on_delivery: 'warning',
      off_duty: 'default',
    };
    return colors[status] || 'default';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Delivery Personnel Management</Typography>
        <Stack direction="row" spacing={2}>
          <IconButton onClick={fetchPersonnel} color="primary">
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* Navigate to add driver page */}}
          >
            Add Driver
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              select
              label="Status Filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 200 }}
              size="small"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="on_delivery">On Delivery</MenuItem>
              <MenuItem value="off_duty">Off Duty</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {/* Personnel Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : personnel.length === 0 ? (
        <Alert severity="info">No delivery personnel found</Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {personnel.map((driver) => (
            <Card key={driver.id}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {driver.user.first_name} {driver.user.last_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {driver.employee_id}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip 
                      label={formatStatus(driver.status)}
                      color={getStatusColor(driver.status)}
                      size="small"
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Vehicle:
                      </Typography>
                      <Typography variant="body2">
                        {driver.vehicle_type.charAt(0).toUpperCase() + driver.vehicle_type.slice(1)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Deliveries:
                      </Typography>
                      <Typography variant="body2">
                        {driver.total_deliveries}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Rating:
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <StarIcon fontSize="small" color="warning" />
                        <Typography variant="body2">
                          {driver.average_rating.toFixed(1)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDriver(driver.id)}
                    >
                      View Details
                    </Button>
                    <TextField
                      select
                      size="small"
                      value={driver.status}
                      onChange={(e: any) => handleUpdateStatus(driver.id, e.target.value)}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="on_delivery">On Delivery</MenuItem>
                      <MenuItem value="off_duty">Off Duty</MenuItem>
                    </TextField>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Driver Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedDriver && (
          <>
            <DialogTitle>
              Driver Details - {selectedDriver.user.first_name} {selectedDriver.user.last_name}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Employee ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedDriver.employee_id}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">
                    {selectedDriver.phone_number}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {selectedDriver.user.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip 
                    label={formatStatus(selectedDriver.status)}
                    color={getStatusColor(selectedDriver.status)}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Vehicle Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedDriver.vehicle_type.charAt(0).toUpperCase() + 
                     selectedDriver.vehicle_type.slice(1)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Vehicle Number
                  </Typography>
                  <Typography variant="body1">
                    {selectedDriver.vehicle_number}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    License Number
                  </Typography>
                  <Typography variant="body1">
                    {selectedDriver.license_number}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Deliveries
                  </Typography>
                  <Typography variant="body1">
                    {selectedDriver.total_deliveries}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Successful Deliveries
                  </Typography>
                  <Typography variant="body1">
                    {selectedDriver.successful_deliveries}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Average Rating
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <StarIcon fontSize="small" color="warning" />
                    <Typography variant="body1">
                      {selectedDriver.average_rating.toFixed(2)} / 5.00
                    </Typography>
                  </Stack>
                </Box>

                {selectedDriver.current_latitude && selectedDriver.current_longitude && (
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Known Location
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body1">
                        {selectedDriver.current_latitude.toFixed(6)}, {selectedDriver.current_longitude.toFixed(6)}
                      </Typography>
                    </Stack>
                    {selectedDriver.last_location_update && (
                      <Typography variant="caption" color="text.secondary">
                        Updated: {new Date(selectedDriver.last_location_update).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default DeliveryManagement;
