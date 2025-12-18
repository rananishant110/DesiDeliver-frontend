import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AccountCircle,
  Menu as MenuIcon,
  Close,
  Dashboard,
  Store,
  ShoppingCart,
  Receipt,
  ConfirmationNumber,
  Person,
  Logout,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import CartBadge from '../cart/CartBadge';
import CartSidebar from '../cart/CartSidebar';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { label: 'Products', path: '/catalog', icon: <Store /> },
  { label: 'Cart', path: '/cart', icon: <ShoppingCart /> },
  { label: 'Orders', path: '/orders', icon: <Receipt /> },
  { label: 'Support', path: '/tickets', icon: <ConfirmationNumber /> },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout } = useAuth();
  const { openCart, closeCart, state } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Mobile Drawer
  const mobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          width: 280,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Store sx={{ 
            fontSize: 28,
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            borderRadius: '8px',
            p: 0.5,
            color: 'white',
          }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            DesiDeliver
          </Typography>
        </Box>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      
      <Divider />
      
      {user && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            width: 48,
            height: 48,
          }}>
            {user.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.business_name || user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      )}
      
      <Divider />
      
      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                bgcolor: isActive(item.path) 
                  ? 'rgba(255, 107, 53, 0.1)' 
                  : 'transparent',
                '&:hover': {
                  bgcolor: isActive(item.path)
                    ? 'rgba(255, 107, 53, 0.15)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                minWidth: 40,
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 400,
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        
        {user?.is_staff && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation('/staff')}
              sx={{
                borderRadius: 2,
                bgcolor: isActive('/staff') 
                  ? 'rgba(255, 107, 53, 0.1)' 
                  : 'transparent',
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive('/staff') ? 'primary.main' : 'text.secondary',
                minWidth: 40,
              }}>
                <AdminPanelSettings />
              </ListItemIcon>
              <ListItemText 
                primary="Staff Portal"
                primaryTypographyProps={{
                  fontWeight: isActive('/staff') ? 600 : 400,
                  color: isActive('/staff') ? 'primary.main' : 'text.primary',
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ borderRadius: 2 }}
        >
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'background.default',
    }}>
      {/* Modern Glass Morphism AppBar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'rgba(26, 26, 46, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 }, minHeight: { xs: 64, md: 72 } }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 1, color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                cursor: 'pointer',
                mr: 4,
              }}
              onClick={() => navigate('/dashboard')}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                borderRadius: '12px',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(255, 107, 53, 0.25)',
              }}>
                <Store sx={{ fontSize: 24, color: 'white' }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                DesiDeliver
              </Typography>
            </Box>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                      bgcolor: isActive(item.path) ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                      fontWeight: isActive(item.path) ? 600 : 500,
                      '&:hover': {
                        bgcolor: isActive(item.path) 
                          ? 'rgba(255, 107, 53, 0.15)' 
                          : 'rgba(0, 0, 0, 0.04)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                
                {user?.is_staff && (
                  <Button
                    onClick={() => navigate('/staff')}
                    startIcon={<AdminPanelSettings />}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      color: isActive('/staff') ? 'primary.main' : 'text.secondary',
                      bgcolor: isActive('/staff') ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                      fontWeight: isActive('/staff') ? 600 : 500,
                    }}
                  >
                    Staff
                  </Button>
                )}
              </Box>
            )}
            
            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {isAuthenticated ? (
                <>
                  {/* Cart Badge */}
                  <CartBadge onClick={openCart} />
                  
                  {/* User Menu */}
                  <IconButton
                    onClick={handleMenu}
                    sx={{ 
                      ml: 1,
                      p: 0.5,
                      border: `2px solid ${theme.palette.divider}`,
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36,
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        minWidth: 220,
                        overflow: 'visible',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 3,
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                          borderLeft: `1px solid ${theme.palette.divider}`,
                          borderTop: `1px solid ${theme.palette.divider}`,
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user?.business_name || user?.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                    
                    <Divider />
                    
                    <MenuItem 
                      onClick={() => { navigate('/profile'); handleClose(); }}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                      <ListItemText>Profile</ListItemText>
                    </MenuItem>
                    <MenuItem 
                      onClick={() => { navigate('/orders'); handleClose(); }}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon><Receipt fontSize="small" /></ListItemIcon>
                      <ListItemText>My Orders</ListItemText>
                    </MenuItem>
                    <MenuItem 
                      onClick={() => { navigate('/tickets'); handleClose(); }}
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon><ConfirmationNumber fontSize="small" /></ListItemIcon>
                      <ListItemText>Support Tickets</ListItemText>
                    </MenuItem>
                    
                    <Divider />
                    
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{ py: 1.5, color: 'error.main' }}
                    >
                      <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                      <ListItemText>Sign Out</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button 
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    borderRadius: 2,
                    px: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(255, 107, 53, 0.25)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e55a2b 0%, #d9821a 100%)',
                      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.35)',
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile Drawer */}
      {mobileDrawer}
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: { xs: 2, md: 4 },
          px: { xs: 2, md: 0 },
        }}
      >
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
      
      {/* Modern Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: 'auto',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)'
            : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                borderRadius: '10px',
                p: 0.75,
                display: 'flex',
              }}>
                <Store sx={{ fontSize: 20, color: 'white' }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} DesiDeliver. All rights reserved.
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s ease',
                }}
              >
                Privacy Policy
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s ease',
                }}
              >
                Terms of Service
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                  transition: 'color 0.2s ease',
                }}
              >
                Contact Us
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Cart Sidebar */}
      <CartSidebar open={state.isOpen} onClose={closeCart} />
    </Box>
  );
};

export default Layout;
