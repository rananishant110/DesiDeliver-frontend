import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Testimonials', href: '#testimonials' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <LinkedIn />, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: theme.palette.mode === 'light' 
          ? '#1A1A2E' 
          : '#0F172A',
        color: '#FFFFFF',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                DesiDeliver
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.8,
                  maxWidth: 300,
                }}
              >
                Your trusted partner for premium Indian grocery supply. 
                Serving restaurants and stores across the DFW metropolitan area.
              </Typography>
            </Box>

            {/* Contact Info */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Email sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  contact@desideliverdfw.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Phone sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  (469) 555-0123
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOn sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Dallas-Fort Worth, Texas
                </Typography>
              </Box>
            </Box>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      color: '#FFFFFF',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links Columns */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: '#FFFFFF' }}
            >
              Product
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {footerLinks.product.map((link, index) => (
                <Box component="li" key={index} sx={{ mb: 1.5 }}>
                  <Link
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: '#FFFFFF' }}
            >
              Company
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {footerLinks.company.map((link, index) => (
                <Box component="li" key={index} sx={{ mb: 1.5 }}>
                  <Link
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: '#FFFFFF' }}
            >
              Support
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {footerLinks.support.map((link, index) => (
                <Box component="li" key={index} sx={{ mb: 1.5 }}>
                  <Link
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.5)', textAlign: { xs: 'center', sm: 'left' } }}
          >
            © {currentYear} DesiDeliver. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.5)', textAlign: { xs: 'center', sm: 'right' } }}
          >
            Made with ❤️ in Dallas, Texas
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
