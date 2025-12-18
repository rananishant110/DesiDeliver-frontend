import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../common/GradientButton';

const CTASection: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <Box
      component="section"
      ref={ref}
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
          zIndex: 0,
        }}
      />

      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: '#FFFFFF',
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Ready to Streamline Your Supply Chain?
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 400,
                lineHeight: 1.7,
                mb: 5,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Join hundreds of DFW restaurants and stores that trust DesiDeliver 
              for their Indian grocery needs. Sign up today and experience the difference.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
              }}
            >
              <GradientButton
                size="large"
                onClick={() => navigate('/register')}
                endIcon={<ArrowForward />}
                sx={{
                  background: '#FFFFFF',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.9)',
                  },
                  '&::before': {
                    display: 'none',
                  },
                }}
              >
                Get Started Free
              </GradientButton>
              
              <GradientButton
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  background: 'transparent',
                  border: '2px solid rgba(255,255,255,0.5)',
                  color: '#FFFFFF',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    borderColor: '#FFFFFF',
                  },
                  '&::before': {
                    display: 'none',
                  },
                }}
              >
                Sign In
              </GradientButton>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTASection;
