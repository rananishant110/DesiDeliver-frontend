import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  Paper,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Send as SendIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { ticketsAPI } from '../../services/api';
import { Ticket, TicketComment, TicketHistory } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import StaffTicketActions from './StaffTicketActions';

const TicketDetail: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetail();
    }
  }, [ticketId]);

  const fetchTicketDetail = async () => {
    if (!ticketId) return;
    
    setLoading(true);
    setError(null);

    try {
      const data = await ticketsAPI.getTicketDetail(parseInt(ticketId));
      setTicket(data);
    } catch (err: any) {
      console.error('Error fetching ticket:', err);
      setError('Failed to load ticket details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !ticket) return;

    setSubmittingComment(true);

    try {
      await ticketsAPI.addTicketComment(ticket.id, { comment: commentText });
      setCommentText('');
      // Refresh ticket to get new comment
      await fetchTicketDetail();
    } catch (err: any) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'warning' | 'success' | 'error' => {
    switch (status) {
      case 'open':
        return 'primary';
      case 'in_progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string): 'default' | 'primary' | 'warning' | 'error' => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'primary';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !ticket) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Ticket not found'}</Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/tickets')} sx={{ mt: 2 }}>
          Back to Tickets
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/tickets')} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {ticket.subject}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label={ticket.status_display}
            color={getStatusColor(ticket.status)}
            size="medium"
          />
          <Chip
            label={ticket.priority_display}
            color={getPriorityColor(ticket.priority)}
            size="medium"
          />
        </Stack>
      </Box>

      {/* Ticket Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Ticket Number</Typography>
              <Typography variant="body1" fontWeight="bold">{ticket.ticket_number}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Category</Typography>
              <Typography variant="body1">{ticket.category.replace('_', ' ').toUpperCase()}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Created By</Typography>
              <Typography variant="body1">{ticket.customer.business_name || ticket.customer.username}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Created</Typography>
              <Typography variant="body1">{formatDate(ticket.created_at)}</Typography>
            </Box>
            {ticket.order && (
              <Box>
                <Typography variant="body2" color="text.secondary">Related Order</Typography>
                <Typography variant="body1">
                  {ticket.order.order_number}
                </Typography>
              </Box>
            )}
            {ticket.resolved_at && (
              <Box>
                <Typography variant="body2" color="text.secondary">Resolved</Typography>
                <Typography variant="body1">{formatDate(ticket.resolved_at)}</Typography>
              </Box>
            )}
            {ticket.closed_at && (
              <Box>
                <Typography variant="body2" color="text.secondary">Closed</Typography>
                <Typography variant="body1">{formatDate(ticket.closed_at)}</Typography>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>Description</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {ticket.description}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Staff Actions (only visible to staff) */}
      {user?.is_staff && (
        <Box sx={{ mb: 3 }}>
          <StaffTicketActions ticket={ticket} onUpdate={setTicket} />
        </Box>
      )}

      {/* History Toggle */}
      {ticket.history && ticket.history.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<HistoryIcon />}
            onClick={() => setShowHistory(!showHistory)}
            variant="outlined"
            size="small"
          >
            {showHistory ? 'Hide' : 'Show'} History ({ticket.history.length})
          </Button>
        </Box>
      )}

      {/* History */}
      {showHistory && ticket.history && ticket.history.length > 0 && (
        <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Change History</Typography>
            <Stack spacing={2}>
              {ticket.history.map((historyItem) => (
                <Paper key={historyItem.id} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {historyItem.changed_by.username} changed {historyItem.field_changed}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateShort(historyItem.created_at)}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    From: <Chip label={historyItem.old_value} size="small" /> → To: <Chip label={historyItem.new_value} size="small" />
                  </Typography>
                  {historyItem.change_reason && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Reason: {historyItem.change_reason}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Comments ({ticket.comments?.length || 0})
          </Typography>
          
          {/* Comment List */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            {ticket.comments && ticket.comments.length > 0 ? (
              ticket.comments.map((comment) => (
                <Paper 
                  key={comment.id} 
                  sx={{ 
                    p: 2, 
                    bgcolor: comment.is_staff_comment ? 'primary.light' : 'grey.100',
                    color: comment.is_staff_comment ? 'primary.contrastText' : 'text.primary'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: comment.is_staff_comment ? 'primary.dark' : 'grey.400' }}>
                      {comment.author.username[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="bold">
                            {comment.author.business_name || comment.author.username}
                          </Typography>
                          {comment.is_staff_comment && (
                            <Chip label="STAFF" size="small" color="secondary" />
                          )}
                        </Box>
                        <Typography variant="caption">
                          {formatDateShort(comment.created_at)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {comment.comment}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Stack>

          {/* Add Comment Form */}
          {ticket.status !== 'closed' && (
            <Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Add Comment
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Type your comment here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={submittingComment}
                />
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  disabled={submittingComment || !commentText.trim()}
                  startIcon={submittingComment ? <CircularProgress size={20} /> : <SendIcon />}
                  sx={{ alignSelf: 'flex-end' }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          )}

          {ticket.status === 'closed' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This ticket is closed. You cannot add new comments.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TicketDetail;
