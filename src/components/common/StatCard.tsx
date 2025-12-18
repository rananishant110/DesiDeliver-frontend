import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

interface StatCardProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  delay?: number;
  duration?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  prefix = '',
  suffix = '',
  icon,
  delay = 0,
  duration = 2,
}) => {
  const theme = useTheme();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      <Box
        sx={{
          textAlign: 'center',
          p: 3,
        }}
      >
        {icon && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}25 100%)`,
              color: theme.palette.primary.main,
              mb: 2,
            }}
          >
            {icon}
          </Box>
        )}
        
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3rem' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          {prefix}
          {inView ? (
            <CountUp
              end={value}
              duration={duration}
              separator=","
              useEasing={true}
            />
          ) : (
            '0'
          )}
          {suffix}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default StatCard;
