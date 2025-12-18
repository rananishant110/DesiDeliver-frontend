import React from 'react';
import { Box, Container, Grid, useTheme } from '@mui/material';
import SectionHeading from '../common/SectionHeading';
import TestimonialCard from '../common/TestimonialCard';

const testimonials = [
  {
    quote: 'DesiDeliver has transformed how we manage our kitchen inventory. The quality of products is consistent, and same-day delivery means we never run out of essential ingredients.',
    author: 'Rajesh Kumar',
    company: 'Spice Garden Restaurant',
    rating: 5,
  },
  {
    quote: 'As a small restaurant owner, finding reliable wholesale suppliers was always challenging. DesiDeliver made it simple with their easy ordering system and competitive prices.',
    author: 'Priya Sharma',
    company: 'Namaste Kitchen',
    rating: 5,
  },
  {
    quote: 'The product selection is excellent, and the customer service team is always responsive. They truly understand the needs of Indian restaurants.',
    author: 'Mohammed Ali',
    company: 'Biryani House',
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
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
          title="What Our Customers Say"
          subtitle="Hear from restaurant owners who trust DesiDeliver for their supply needs"
          align="center"
        />

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <TestimonialCard
                quote={testimonial.quote}
                author={testimonial.author}
                company={testimonial.company}
                rating={testimonial.rating}
                delay={index * 0.1}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
