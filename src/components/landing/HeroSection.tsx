import React from 'react';
import { Box, Container, Typography, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowForward, PlayArrow } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../common/GradientButton';

const HeroSection: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 10, md: 12 },
        pb: { xs: 8, md: 10 },
      }}
    >
      {/* Background Gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #FFF5F0 0%, #FFFFFF 50%, #F0F9FF 100%)'
            : 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #1E293B 100%)',
          zIndex: 0,
        }}
      />
      
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.secondary.main}10 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Text Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Badge */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.75,
                  mb: 3,
                  borderRadius: '100px',
                  backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(255, 107, 53, 0.1)' 
                    : 'rgba(255, 107, 53, 0.15)',
                  border: `1px solid ${theme.palette.primary.main}30`,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.success.main,
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Now Serving DFW Area
                </Typography>
              </Box>

              {/* Main Headline */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                Premium{' '}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Indian Grocery
                </Box>{' '}
                Supply for Your Business
              </Typography>

              {/* Subheadline */}
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 500,
                }}
              >
                Streamline your restaurant's supply chain with same-day delivery, 
                wholesale prices, and a curated selection of authentic Indian groceries.
              </Typography>

              {/* CTA Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  mb: 5,
                }}
              >
                <GradientButton
                  size="large"
                  onClick={() => navigate('/register')}
                  endIcon={<ArrowForward />}
                >
                  Get Started Free
                </GradientButton>
                <GradientButton
                  gradient="secondary"
                  size="large"
                  onClick={() => navigate('/login')}
                  startIcon={<PlayArrow />}
                >
                  View Demo
                </GradientButton>
              </Box>

              {/* Trust Indicators */}
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: 'block',
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                  }}
                >
                  Trusted by 100+ DFW Restaurants
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    opacity: 0.6,
                    flexWrap: 'wrap',
                  }}
                >
                  {['🍛', '🥘', '🍜', '🥗'].map((emoji, index) => (
                    <Box
                      key={index}
                      sx={{
                        fontSize: '2rem',
                        filter: theme.palette.mode === 'dark' ? 'grayscale(50%)' : 'none',
                      }}
                    >
                      {emoji}
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Hero Image/Illustration */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 300, md: 500 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Main Card */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 450,
                    p: 4,
                    borderRadius: '24px',
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.palette.mode === 'light'
                      ? '0 20px 60px rgba(0,0,0,0.1)'
                      : '0 20px 60px rgba(0,0,0,0.5)',
                    border: `1px solid ${theme.palette.mode === 'light' 
                      ? 'rgba(0,0,0,0.05)' 
                      : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  <Typography variant="h5" fontWeight={700} mb={3}>
                    Popular Products
                  </Typography>
                  
                  {[
                    { name: 'Basmati Rice', price: '$45.99', qty: '25 lb' },
                    { name: 'Ghee Butter', price: '$28.99', qty: '64 oz' },
                    { name: 'Garam Masala', price: '$12.99', qty: '14 oz' },
                  ].map((product, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        mb: 2,
                        borderRadius: '12px',
                        backgroundColor: theme.palette.mode === 'light' 
                          ? '#F8FAFC' 
                          : 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            backgroundColor: theme.palette.primary.main + '20',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                          }}
                        >
                          {index === 0 ? '🍚' : index === 1 ? '🧈' : '🌶️'}
                        </Box>
                        <Box>
                          <Typography fontWeight={600} fontSize="0.95rem">
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.qty}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography 
                        fontWeight={700} 
                        color="primary.main"
                        fontSize="1.1rem"
                      >
                        {product.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Floating Badge */}
                <Box
                  component={motion.div}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  sx={{
                    position: 'absolute',
                    top: { xs: -20, md: 20 },
                    right: { xs: 10, md: -30 },
                    px: 2,
                    py: 1,
                    borderRadius: '100px',
                    backgroundColor: theme.palette.success.main,
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    boxShadow: '0 8px 24px rgba(0, 168, 120, 0.3)',
                  }}
                >
                  Same-Day Delivery ⚡
                </Box>

                {/* Stats Badge */}
                <Box
                  component={motion.div}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  sx={{
                    position: 'absolute',
                    bottom: { xs: -20, md: 40 },
                    left: { xs: 10, md: -20 },
                    px: 3,
                    py: 2,
                    borderRadius: '16px',
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h5" fontWeight={800} color="primary.main">
                    500+
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Products Available
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
