import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ConfirmationNumber as TicketIcon,
  HourglassEmpty as OpenIcon,
  PlayArrow as InProgressIcon,
  CheckCircle as ResolvedIcon,
  Cancel as ClosedIcon,
  PriorityHigh as UrgentIcon,
} from '@mui/icons-material';
import { ticketsAPI } from '../../services/api';
import { TicketStats as TicketStatsType } from '../../types';

const TicketStats: React.FC = () => {
  const [stats, setStats] = useState<TicketStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await ticketsAPI.getTicketStats();
      setStats(data);
    } catch (err: any) {
      console.error('Error fetching ticket stats:', err);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error || 'Failed to load statistics'}
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Ticket Statistics</Typography>
        <Tooltip title="Refresh statistics">
          <IconButton onClick={fetchStats} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Stats */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total_tickets}
                  </Typography>
                  <Typography variant="body2">Total Tickets</Typography>
                </Box>
                <TicketIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <Card sx={{ bgcolor: 'info.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.by_status.open}
                  </Typography>
                  <Typography variant="body2">Open</Typography>
                </Box>
                <OpenIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.by_status.in_progress}
                  </Typography>
                  <Typography variant="body2">In Progress</Typography>
                </Box>
                <InProgressIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <Card sx={{ bgcolor: 'success.light', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.by_status.resolved}
                  </Typography>
                  <Typography variant="body2">Resolved</Typography>
                </Box>
                <ResolvedIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <Card sx={{ bgcolor: 'grey.500', color: 'white', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.by_status.closed}
                  </Typography>
                  <Typography variant="body2">Closed</Typography>
                </Box>
                <ClosedIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Priority Breakdown */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: '1 1 400px', minWidth: 300 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Tickets by Priority
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <UrgentIcon color="error" fontSize="small" />
                    <Typography variant="body2">Urgent</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="error.main">
                    {stats.by_priority.urgent}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ pl: 4 }}>High</Typography>
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {stats.by_priority.high}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ pl: 4 }}>Medium</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {stats.by_priority.medium}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ pl: 4 }}>Low</Typography>
                  <Typography variant="h6" fontWeight="bold" color="text.secondary">
                    {stats.by_priority.low}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 400px', minWidth: 300 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Tickets by Category
              </Typography>
              <Box sx={{ mt: 2 }}>
                {Object.entries(stats.by_category).map(([category, count]) => (
                  <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {category.replace('_', ' ')}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {count as number}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketStats;
