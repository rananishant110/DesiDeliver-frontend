import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  LocalShipping as TruckIcon,
  Schedule as ClockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  DirectionsCar as VehicleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { DeliveryTracking, CustomerFeedback } from '../../types';
import { deliveryApi } from '../../services/api';
import DeliveryMap from './DeliveryMap';

interface DeliveryTrackerProps {
  orderId: number;
  refreshInterval?: number;
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({
  orderId,
  refreshInterval = 30000, // 30 seconds
}) => {
  const [tracking, setTracking] = useState<DeliveryTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState<CustomerFeedback>({ rating: 5, feedback: '' });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchTracking = async () => {
    try {
      const data = await deliveryApi.getDeliveryTrackingByOrder(orderId);
      setTracking(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch delivery tracking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    
    // Set up auto-refresh
    const interval = setInterval(fetchTracking, refreshInterval);
    
    return () => clearInterval(interval);
  }, [orderId, refreshInterval]);

  const handleSubmitFeedback = async () => {
    if (!tracking) return;
    
    setSubmittingFeedback(true);
    try {
      await deliveryApi.submitFeedback(tracking.id, feedback);
      setFeedbackOpen(false);
      fetchTracking();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { label: 'Assigned', status: 'assigned', time: tracking?.assigned_at },
      { label: 'Picked Up', status: 'picked_up', time: tracking?.picked_up_at },
      { label: 'In Transit', status: 'in_transit', time: null },
      { label: 'Nearby', status: 'nearby', time: null },
      { label: 'Delivered', status: 'delivered', time: tracking?.delivered_at },
    ];

    const currentStatusIndex = steps.findIndex(step => step.status === tracking?.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStatusIndex,
      active: index === currentStatusIndex,
    }));
  };

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return 'Pending';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !tracking) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || 'No tracking information available'}
      </Alert>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <Box>
      {/* Delivery Map */}
      <DeliveryMap tracking={tracking} height="400px" />

      <Box sx={{ mt: 3, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' } }}>
        {/* Delivery Status Timeline */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Delivery Status
            </Typography>
            
            <Stepper activeStep={statusSteps.findIndex(s => s.active)} orientation="vertical">
              {statusSteps.map((step, index) => (
                <Step key={step.status} completed={step.completed}>
                  <StepLabel
                    StepIconComponent={() => (
                      step.completed ? 
                        <CheckIcon color="success" /> : 
                        <ClockIcon color={step.active ? 'primary' : 'disabled'} />
                    )}
                  >
                    <Typography variant="subtitle1">{step.label}</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(step.time)}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {tracking.status === 'delivered' && !tracking.customer_rating && (
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => setFeedbackOpen(true)}
                  fullWidth
                >
                  Rate Your Delivery
                </Button>
              </Box>
            )}

            {tracking.customer_rating && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Your Feedback
                </Typography>
                <Rating value={tracking.customer_rating} readOnly size="small" />
                {tracking.customer_feedback && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {tracking.customer_feedback}
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Driver Information */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Delivery Information
            </Typography>

            {tracking.driver ? (
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="subtitle2">Driver</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ ml: 3 }}>
                    {tracking.driver.user.first_name} {tracking.driver.user.last_name}
                  </Typography>
                </Box>

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="subtitle2">Phone</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ ml: 3 }}>
                    {tracking.driver.phone_number}
                  </Typography>
                </Box>

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VehicleIcon fontSize="small" color="action" />
                    <Typography variant="subtitle2">Vehicle</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ ml: 3 }}>
                    {tracking.driver.vehicle_type.charAt(0).toUpperCase() + 
                     tracking.driver.vehicle_type.slice(1)} - {tracking.driver.vehicle_number}
                  </Typography>
                </Box>

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckIcon fontSize="small" color="action" />
                    <Typography variant="subtitle2">Rating</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 3 }}>
                    <Rating value={tracking.driver.average_rating} readOnly size="small" precision={0.1} />
                    <Typography variant="body2" color="text.secondary">
                      ({tracking.driver.total_deliveries} deliveries)
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            ) : (
              <Alert severity="info">Driver not yet assigned</Alert>
            )}

            {tracking.estimated_delivery_time && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary.contrastText">
                  Estimated Delivery
                </Typography>
                <Typography variant="h6" color="primary.contrastText">
                  {formatDateTime(tracking.estimated_delivery_time)}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Status History */}
      {tracking.status_history && tracking.status_history.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Status History
            </Typography>
            <Stack spacing={1.5}>
              {tracking.status_history.map((history: any) => (
                <Box 
                  key={history.id}
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'background.default', 
                    borderRadius: 1,
                    borderLeft: 3,
                    borderColor: 'primary.main'
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip 
                      label={history.status.split('_').map((w: any) => 
                        w.charAt(0).toUpperCase() + w.slice(1)
                      ).join(' ')}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(history.timestamp)}
                    </Typography>
                  </Stack>
                  {history.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {history.notes}
                    </Typography>
                  )}
                  {history.changed_by_name && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      By: {history.changed_by_name}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Your Delivery</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                How was your delivery experience?
              </Typography>
              <Rating
                value={feedback.rating}
                onChange={(_, newValue: any) => setFeedback({ ...feedback, rating: newValue || 5 })}
                size="large"
              />
            </Box>
            <TextField
              label="Additional Comments (Optional)"
              multiline
              rows={4}
              value={feedback.feedback}
              onChange={(e: any) => setFeedback({ ...feedback, feedback: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitFeedback} 
            variant="contained"
            disabled={submittingFeedback}
          >
            {submittingFeedback ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryTracker;
