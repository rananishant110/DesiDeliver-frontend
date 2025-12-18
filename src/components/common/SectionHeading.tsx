import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4';
  gradient?: boolean;
  maxWidth?: number | string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  align = 'center',
  titleVariant = 'h2',
  gradient = false,
  maxWidth = 700,
}) => {
  const theme = useTheme();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Box
        sx={{
          textAlign: align,
          mb: 6,
          mx: align === 'center' ? 'auto' : 0,
          maxWidth: align === 'center' ? maxWidth : 'none',
        }}
      >
        <Typography
          variant={titleVariant}
          component="h2"
          sx={{
            fontWeight: 700,
            mb: subtitle ? 2 : 0,
            ...(gradient && {
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }),
          }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '1.125rem',
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default SectionHeading;
