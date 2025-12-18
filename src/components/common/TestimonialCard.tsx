import React from 'react';
import { Box, Typography, Avatar, Rating, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FormatQuote } from '@mui/icons-material';

interface TestimonialCardProps {
  quote: string;
  author: string;
  company: string;
  avatar?: string;
  rating?: number;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  company,
  avatar,
  rating = 5,
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
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme.palette.mode === 'light' 
              ? '0 8px 30px rgba(0,0,0,0.12)' 
              : '0 8px 30px rgba(0,0,0,0.5)',
          },
        }}
      >
        {/* Quote Icon */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: theme.palette.primary.main,
            opacity: 0.2,
          }}
        >
          <FormatQuote sx={{ fontSize: 48 }} />
        </Box>

        {/* Rating */}
        {rating > 0 && (
          <Rating
            value={rating}
            readOnly
            sx={{
              mb: 2,
              '& .MuiRating-iconFilled': {
                color: theme.palette.warning.main,
              },
            }}
          />
        )}

        {/* Quote */}
        <Typography
          variant="body1"
          sx={{
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
            lineHeight: 1.8,
            mb: 3,
            fontSize: '1.05rem',
          }}
        >
          "{quote}"
        </Typography>

        {/* Author */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={avatar}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: theme.palette.primary.main,
              fontWeight: 600,
            }}
          >
            {author.charAt(0)}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {author}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              {company}
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default TestimonialCard;
