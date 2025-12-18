import React from 'react';
import { Box } from '@mui/material';
import LandingHeader from './LandingHeader';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import StatsSection from './StatsSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import Footer from '../common/Footer';

const LandingPage: React.FC = () => {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <LandingHeader />
      
      <main>
        <HeroSection />
        
        <Box id="features">
          <FeaturesSection />
        </Box>
        
        <Box id="how-it-works">
          <HowItWorks />
        </Box>
        
        <StatsSection />
        
        <Box id="testimonials">
          <TestimonialsSection />
        </Box>
        
        <CTASection />
      </main>
      
      <Footer />
    </Box>
  );
};

export default LandingPage;
