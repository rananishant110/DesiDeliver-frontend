import React from 'react';
import { Box, Container, Grid, useTheme } from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  Savings,
  QueryStats,
} from '@mui/icons-material';
import SectionHeading from '../common/SectionHeading';
import FeatureCard from '../common/FeatureCard';

const features = [
  {
    icon: <ShoppingCart sx={{ fontSize: 28 }} />,
    title: 'Easy Online Ordering',
    description: 'Browse our catalog, add items to your cart, and place orders in minutes. No phone calls or paper forms needed.',
  },
  {
    icon: <LocalShipping sx={{ fontSize: 28 }} />,
    title: 'Same-Day Delivery',
    description: 'Order by noon and receive your products the same day. We deliver throughout the DFW metropolitan area.',
  },
  {
    icon: <Savings sx={{ fontSize: 28 }} />,
    title: 'Wholesale Prices',
    description: 'Get competitive bulk pricing designed specifically for restaurants and food service businesses.',
  },
  {
    icon: <QueryStats sx={{ fontSize: 28 }} />,
    title: 'Order Tracking',
    description: 'Real-time order status updates and complete order history. Know exactly where your delivery is.',
  },
];

const FeaturesSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.mode === 'light' 
          ? '#FAFBFC' 
          : theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          title="Everything You Need to Run Your Kitchen"
          subtitle="We handle the supply chain so you can focus on what matters most — serving great food to your customers."
          align="center"
        />

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
