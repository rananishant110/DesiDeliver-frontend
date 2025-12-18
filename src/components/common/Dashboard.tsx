import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  Store, 
  ShoppingCart, 
  Receipt, 
  Person, 
  Business, 
  ConfirmationNumber,
  TrendingUp,
  LocalShipping,
  Inventory,
  ArrowForward,
  Verified,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import api from '../../services/api';

import { Easing } from 'framer-motion';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as Easing },
  },
};

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  gradient: string;
  route: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { state: cartState } = useCart();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    // Fetch order count
    const fetchOrderCount = async () => {
      try {
        const response = await api.get('/orders/list/');
        setOrderCount(response.data.orders?.length || response.data.pagination?.total_orders || 0);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrderCount();
  }, []);

  const quickActions: QuickAction[] = [
    {
      title: 'Browse Products',
      description: 'Explore our catalog of authentic Indian groceries',
      icon: <Store />,
      action: 'View Catalog',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      route: '/catalog',
    },
    {
      title: 'Shopping Cart',
      description: 'Review and manage your current order',
      icon: <ShoppingCart />,
      action: 'View Cart',
      gradient: 'linear-gradient(135deg, #00C9A7 0%, #00D4AA 100%)',
      route: '/cart',
    },
    {
      title: 'Order History',
      description: 'Track deliveries and view past orders',
      icon: <Receipt />,
      action: 'View Orders',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/orders',
    },
    {
      title: 'Support Center',
      description: 'Get help with your orders and requests',
      icon: <ConfirmationNumber />,
      action: 'Get Support',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      route: '/tickets',
    },
  ];

  const stats = [
    {
      label: 'Cart Items',
      value: cartState.cart?.items?.length || 0,
      icon: <ShoppingCart sx={{ fontSize: 28 }} />,
      color: '#FF6B35',
    },
    {
      label: 'Total Orders',
      value: orderCount,
      icon: <Receipt sx={{ fontSize: 28 }} />,
      color: '#667eea',
    },
    {
      label: 'Account Status',
      value: user?.is_verified ? 'Verified' : 'Pending',
      icon: user?.is_verified ? <Verified sx={{ fontSize: 28 }} /> : <Schedule sx={{ fontSize: 28 }} />,
      color: user?.is_verified ? '#00C9A7' : '#F7931E',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ py: { xs: 2, md: 4 } }}
    >
      {/* Welcome Banner */}
      <MotionBox variants={itemVariants}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            mb: 4,
            background: `linear-gradient(135deg, ${alpha('#FF6B35', 0.9)} 0%, ${alpha('#F7931E', 0.9)} 100%)`,
            p: { xs: 3, md: 5 },
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '50%',
              opacity: 0.1,
              background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
          
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  {getGreeting()}, {user?.business_name || user?.username}!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  Ready to explore authentic Indian groceries?
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/catalog')}
                sx={{
                  bgcolor: 'white',
                  color: '#FF6B35',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Start Shopping
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/orders')}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Track Orders
              </Button>
            </Box>
          </Box>
        </Box>
      </MotionBox>

      {/* Stats Cards */}
      <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {stats.map((stat, index) => (
            <MotionCard
              key={index}
              variants={itemVariants}
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                  borderColor: alpha(stat.color, 0.3),
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: stat.color, mb: 0.5 }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(stat.color, 0.1),
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          ))}
        </Box>
      </MotionBox>

      {/* Quick Actions */}
      <MotionBox variants={itemVariants}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 3 }}
        >
          Quick Actions
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {quickActions.map((action, index) => (
            <MotionCard
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: 'none',
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
                },
              }}
              onClick={() => navigate(action.route)}
            >
              <Box
                sx={{
                  height: 8,
                  background: action.gradient,
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: action.gradient,
                    color: 'white',
                    mb: 2,
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {action.description}
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    p: 0,
                    '&:hover': {
                      background: 'transparent',
                    },
                  }}
                >
                  {action.action}
                </Button>
              </CardContent>
            </MotionCard>
          ))}
        </Box>
      </MotionBox>

      {/* Profile Card */}
      <MotionBox variants={itemVariants} sx={{ mt: 4 }}>
        <MotionCard
          variants={itemVariants}
          sx={{
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {user?.business_name || user?.username}
                    </Typography>
                    {user?.is_verified && (
                      <Chip
                        icon={<Verified sx={{ fontSize: 16 }} />}
                        label="Verified"
                        size="small"
                        color="success"
                        sx={{ height: 24 }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Person />}
                onClick={() => navigate('/profile')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </CardContent>
        </MotionCard>
      </MotionBox>

      {/* Staff Dashboard Access */}
      {user?.is_staff && (
        <MotionBox variants={itemVariants} sx={{ mt: 4 }}>
          <MotionCard
            variants={itemVariants}
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha('#004E64', 0.9)} 0%, ${alpha('#00728f', 0.9)} 100%)`,
              border: 'none',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                    Staff Portal
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Manage orders, products, and customer support
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Business />}
                  onClick={() => navigate('/staff')}
                  sx={{
                    bgcolor: 'white',
                    color: '#004E64',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Open Staff Dashboard
                </Button>
              </Box>
            </CardContent>
          </MotionCard>
        </MotionBox>
      )}
    </MotionBox>
  );
};

export default Dashboard;
