import React from 'react';
import { Box, Container, Typography, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  PersonAdd,
  Search,
  ShoppingCartCheckout,
  LocalShipping,
} from '@mui/icons-material';
import SectionHeading from '../common/SectionHeading';

const steps = [
  {
    number: '01',
    icon: <PersonAdd sx={{ fontSize: 32 }} />,
    title: 'Create Your Account',
    description: 'Sign up in minutes with your business details. Get instant access to our full product catalog.',
  },
  {
    number: '02',
    icon: <Search sx={{ fontSize: 32 }} />,
    title: 'Browse & Select Products',
    description: 'Explore our wide selection of authentic Indian groceries. Search, filter, and add items to your cart.',
  },
  {
    number: '03',
    icon: <ShoppingCartCheckout sx={{ fontSize: 32 }} />,
    title: 'Place Your Order',
    description: 'Review your cart, confirm quantities, and submit your order. It is that simple.',
  },
  {
    number: '04',
    icon: <LocalShipping sx={{ fontSize: 32 }} />,
    title: 'Receive Your Delivery',
    description: 'We will deliver directly to your business. Track your order in real-time.',
  },
];

const HowItWorks: React.FC = () => {
  const theme = useTheme();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          title="How It Works"
          subtitle="Get started with DesiDeliver in four simple steps"
          align="center"
        />

        <Box ref={ref} sx={{ position: 'relative' }}>
          {/* Connecting Line (Desktop) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: 60,
              left: '12.5%',
              right: '12.5%',
              height: 2,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              zIndex: 0,
            }}
          />

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {/* Step Number Circle */}
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        color: '#FFFFFF',
                        mb: 3,
                        boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)',
                        position: 'relative',
                      }}
                    >
                      {step.icon}
                      
                      {/* Step Number Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          backgroundColor: theme.palette.secondary.main,
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: `2px solid ${theme.palette.background.paper}`,
                        }}
                      >
                        {step.number}
                      </Box>
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {step.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.7,
                        maxWidth: 280,
                        mx: 'auto',
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;
