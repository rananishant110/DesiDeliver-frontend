import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay = 0,
}) => {
  const theme = useTheme();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Box
        sx={{
          p: 4,
          height: '100%',
          borderRadius: '20px',
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.palette.mode === 'light' 
            ? '0 4px 20px rgba(0,0,0,0.08)' 
            : '0 4px 20px rgba(0,0,0,0.4)',
          border: `1px solid ${theme.palette.mode === 'light' 
            ? 'rgba(0,0,0,0.05)' 
            : 'rgba(255,255,255,0.05)'}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme.palette.mode === 'light' 
              ? '0 8px 30px rgba(0,0,0,0.12)' 
              : '0 8px 30px rgba(0,0,0,0.5)',
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            color: '#FFFFFF',
            mb: 3,
            fontSize: '28px',
          }}
        >
          {icon}
        </Box>
        
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default FeatureCard;
