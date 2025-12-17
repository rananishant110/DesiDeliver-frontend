import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import { Store, ShoppingCart, Receipt, Person, Business, ConfirmationNumber } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: 'Browse Products',
      description: 'Explore our catalog of Indian groceries and non-food items',
      icon: <Store sx={{ fontSize: 40 }} />,
      action: 'View Catalog',
      color: '#1976d2',
      route: '/catalog',
    },
    {
      title: 'Shopping Cart',
      description: 'Manage your current order items and quantities',
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      action: 'View Cart',
      color: '#dc004e',
      route: '/cart',
    },
    {
      title: 'Order History',
      description: 'Track your previous orders and delivery status',
      icon: <Receipt sx={{ fontSize: 40 }} />,
      action: 'View Orders',
      color: '#2e7d32',
      route: '/orders',
    },
    {
      title: 'Support Tickets',
      description: 'Get help with your orders and track support requests',
      icon: <ConfirmationNumber sx={{ fontSize: 40 }} />,
      action: 'View Tickets',
      color: '#9c27b0',
      route: '/tickets',
    },
    {
      title: 'Profile',
      description: 'Update your business information and preferences',
      icon: <Person sx={{ fontSize: 40 }} />,
      action: 'Edit Profile',
      color: '#ed6c02',
      route: '/profile',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.business_name || user?.username}! 🎉
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready to explore our Indian grocery catalog and place your next order?
        </Typography>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {dashboardItems.map((item, index) => (
          <Card 
            key={index}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Box sx={{ color: item.color, mb: 2 }}>
                {item.icon}
              </Box>
              <Typography variant="h6" component="h2" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button 
                variant="outlined" 
                size="small"
                sx={{ color: item.color, borderColor: item.color }}
                onClick={() => navigate(item.route)}
              >
                {item.action}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Stats
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Items in Cart
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="secondary">
              0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Orders
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {user?.is_verified ? '✓' : '⏳'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Account Status
            </Typography>
          </Box>
        </Box>

        {/* Staff Dashboard Access */}
        {user?.is_staff && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Staff Access
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Business />}
              onClick={() => navigate('/staff')}
              sx={{ minWidth: 200 }}
            >
              Staff Dashboard
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
