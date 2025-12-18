import React from 'react';
import { Box, Container, Grid, useTheme } from '@mui/material';
import {
  Inventory2,
  Groups,
  DeliveryDining,
} from '@mui/icons-material';
import SectionHeading from '../common/SectionHeading';
import StatCard from '../common/StatCard';

const stats = [
  {
    value: 500,
    label: 'Products Available',
    suffix: '+',
    icon: <Inventory2 sx={{ fontSize: 32 }} />,
  },
  {
    value: 100,
    label: 'Happy Customers',
    suffix: '+',
    icon: <Groups sx={{ fontSize: 32 }} />,
  },
  {
    value: 24,
    label: 'Hour Delivery',
    prefix: '<',
    icon: <DeliveryDining sx={{ fontSize: 32 }} />,
  },
];

const StatsSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        background: theme.palette.mode === 'light'
          ? `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`
          : `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading
          title="Trusted by DFW Restaurants"
          subtitle="Join hundreds of businesses that rely on DesiDeliver for their supply needs"
          align="center"
        />

        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 4 }}>
              <StatCard
                value={stat.value}
                label={stat.label}
                prefix={stat.prefix}
                suffix={stat.suffix}
                icon={stat.icon}
                delay={index * 0.15}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;
