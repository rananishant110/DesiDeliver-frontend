import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../common/ThemeToggle';
import GradientButton from '../common/GradientButton';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
];

const LandingHeader: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          transition: 'all 0.3s ease-in-out',
          backgroundColor: isScrolled
            ? theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(15, 23, 42, 0.9)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: isScrolled
            ? `1px solid ${theme.palette.mode === 'light' 
                ? 'rgba(0, 0, 0, 0.05)' 
                : 'rgba(255, 255, 255, 0.05)'}`
            : 'none',
          boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.05)' : 'none',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: { xs: 64, md: 80 },
            }}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h5"
                component="a"
                href="/"
                sx={{
                  fontWeight: 800,
                  textDecoration: 'none',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  cursor: 'pointer',
                }}
              >
                DesiDeliver
              </Typography>
            </motion.div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {navLinks.map((link) => (
                    <Button
                      key={link.label}
                      onClick={() => handleNavClick(link.href)}
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        textTransform: 'none',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          width: 0,
                          height: 2,
                          backgroundColor: theme.palette.primary.main,
                          transition: 'all 0.3s ease-in-out',
                          transform: 'translateX(-50%)',
                        },
                        '&:hover::after': {
                          width: '80%',
                        },
                      }}
                    >
                      {link.label}
                    </Button>
                  ))}
                </Box>
              </motion.nav>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ThemeToggle size="small" />
                
                {!isMobile && (
                  <>
                    <Button
                      onClick={() => navigate('/login')}
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                    >
                      Sign In
                    </Button>
                    <GradientButton
                      size="small"
                      onClick={() => navigate('/register')}
                    >
                      Get Started
                    </GradientButton>
                  </>
                )}

                {isMobile && (
                  <IconButton
                    onClick={() => setMobileMenuOpen(true)}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 320,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DesiDeliver
            </Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          {/* Navigation Links */}
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.label} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(link.href)}
                  sx={{ borderRadius: '12px' }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* CTA Buttons */}
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <GradientButton
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/register');
              }}
            >
              Get Started
            </GradientButton>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                borderRadius: '12px',
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default LandingHeader;
