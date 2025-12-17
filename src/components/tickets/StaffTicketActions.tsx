import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { ticketsAPI } from '../../services/api';
import { Ticket, TicketStatus, TicketPriority } from '../../types';

interface StaffTicketActionsProps {
  ticket: Ticket;
  onUpdate: (updatedTicket: Ticket) => void;
}

const StaffTicketActions: React.FC<StaffTicketActionsProps> = ({ ticket, onUpdate }) => {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'status' | 'priority' | null;
    newValue: string;
  }>({
    open: false,
    type: null,
    newValue: '',
  });

  const handleStatusChange = (event: SelectChangeEvent<TicketStatus>) => {
    const newStatus = event.target.value as TicketStatus;
    setConfirmDialog({
      open: true,
      type: 'status',
      newValue: newStatus,
    });
  };

  const handlePriorityChange = (event: SelectChangeEvent<TicketPriority>) => {
    const newPriority = event.target.value as TicketPriority;
    setConfirmDialog({
      open: true,
      type: 'priority',
      newValue: newPriority,
    });
  };

  const handleConfirmUpdate = async () => {
    if (!confirmDialog.type || !reason.trim()) {
      setError('Please provide a reason for this change');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let updatedTicket: Ticket;

      if (confirmDialog.type === 'status') {
        updatedTicket = await ticketsAPI.updateTicketStatus(ticket.id, {
          status: confirmDialog.newValue as TicketStatus,
          reason: reason.trim(),
        });
        setStatus(updatedTicket.status);
        setSuccess(`Status updated to "${updatedTicket.status}"`);
      } else {
        updatedTicket = await ticketsAPI.updateTicketPriority(ticket.id, {
          priority: confirmDialog.newValue as TicketPriority,
          reason: reason.trim(),
        });
        setPriority(updatedTicket.priority);
        setSuccess(`Priority updated to "${updatedTicket.priority}"`);
      }

      onUpdate(updatedTicket);
      setReason('');
      setConfirmDialog({ open: false, type: null, newValue: '' });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating ticket:', err);
      setError(err.response?.data?.detail || 'Failed to update ticket. Please try again.');
      // Reset to original values
      if (confirmDialog.type === 'status') {
        setStatus(ticket.status);
      } else {
        setPriority(ticket.priority);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUpdate = () => {
    // Reset to original values
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setReason('');
    setConfirmDialog({ open: false, type: null, newValue: '' });
    setError(null);
  };

  const getStatusLabel = (status: TicketStatus): string => {
    const labels: Record<TicketStatus, string> = {
      open: 'Open',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: TicketPriority): string => {
    const labels: Record<TicketPriority, string> = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
    };
    return labels[priority];
  };

  const statusColors: Record<TicketStatus, string> = {
    open: 'info',
    in_progress: 'warning',
    resolved: 'success',
    closed: 'default',
  };

  const priorityColors: Record<TicketPriority, string> = {
    low: 'default',
    medium: 'primary',
    high: 'warning',
    urgent: 'error',
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Staff Actions
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                label="Status"
                onChange={handleStatusChange}
                disabled={loading}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                value={priority}
                label="Priority"
                onChange={handlePriorityChange}
                disabled={loading}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelUpdate}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm {confirmDialog.type === 'status' ? 'Status' : 'Priority'} Change
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" gutterBottom>
              You are about to change the {confirmDialog.type} from{' '}
              <strong>
                {confirmDialog.type === 'status'
                  ? getStatusLabel(ticket.status)
                  : getPriorityLabel(ticket.priority)}
              </strong>{' '}
              to{' '}
              <strong>
                {confirmDialog.type === 'status'
                  ? getStatusLabel(confirmDialog.newValue as TicketStatus)
                  : getPriorityLabel(confirmDialog.newValue as TicketPriority)}
              </strong>
            </Typography>

            <TextField
              label="Reason for change (required)"
              multiline
              rows={3}
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for this change..."
              sx={{ mt: 2 }}
              required
              error={!reason.trim() && error !== null}
              helperText={!reason.trim() && error !== null ? 'Reason is required' : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelUpdate}
            startIcon={<CancelIcon />}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUpdate}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading || !reason.trim()}
          >
            {loading ? 'Updating...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StaffTicketActions;
