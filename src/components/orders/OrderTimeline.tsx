import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import {
  Pending,
  CheckCircle,
  LocalShipping,
  Inventory,
  Done,
  Cancel,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface OrderTimelineProps {
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
}

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: Pending, description: 'Order received' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Order confirmed' },
  { key: 'processing', label: 'Processing', icon: Inventory, description: 'Being prepared' },
  { key: 'ready', label: 'Ready', icon: LocalShipping, description: 'Ready for delivery' },
  { key: 'delivered', label: 'Delivered', icon: Done, description: 'Successfully delivered' },
];

const getStatusIndex = (status: string) => {
  if (status === 'cancelled') return -1;
  return statusSteps.findIndex(s => s.key === status);
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, createdAt, updatedAt }) => {
  const currentIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          borderRadius: 3,
          background: (theme) => alpha(theme.palette.error.main, 0.1),
          border: '1px dashed',
          borderColor: 'error.main',
        }}
      >
        <Cancel sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
        <Box>
          <Typography variant="h6" color="error.main" sx={{ fontWeight: 700 }}>
            Order Cancelled
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This order has been cancelled
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        {/* Progress line */}
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            left: 24,
            right: 24,
            height: 4,
            background: (theme) => alpha(theme.palette.divider, 0.3),
            borderRadius: 2,
            zIndex: 0,
          }}
        />
        <Box
          component={motion.div}
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          sx={{
            position: 'absolute',
            top: 24,
            left: 24,
            height: 4,
            background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)',
            borderRadius: 2,
            zIndex: 1,
          }}
        />

        {/* Steps */}
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <Box
              key={step.key}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Icon Circle */}
              <Box
                component={motion.div}
                animate={isCurrent ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(255, 107, 53, 0.4)',
                    '0 0 0 10px rgba(255, 107, 53, 0)',
                    '0 0 0 0 rgba(255, 107, 53, 0)',
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCompleted
                    ? 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
                    : (theme) => theme.palette.background.paper,
                  border: '3px solid',
                  borderColor: isCompleted ? 'transparent' : 'divider',
                  color: isCompleted ? 'white' : 'text.secondary',
                  transition: 'all 0.3s ease',
                  boxShadow: isCompleted
                    ? '0 4px 12px rgba(255, 107, 53, 0.3)'
                    : 'none',
                }}
              >
                <Icon sx={{ fontSize: 24 }} />
              </Box>

              {/* Label */}
              <Typography
                variant="body2"
                sx={{
                  mt: 1.5,
                  fontWeight: isCompleted ? 700 : 500,
                  color: isCompleted ? 'text.primary' : 'text.secondary',
                  textAlign: 'center',
                }}
              >
                {step.label}
              </Typography>

              {/* Description */}
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {step.description}
              </Typography>

              {/* Current indicator */}
              {isCurrent && (
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  sx={{
                    mt: 1,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'white', fontWeight: 700, fontSize: '0.65rem' }}
                  >
                    CURRENT
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default OrderTimeline;
