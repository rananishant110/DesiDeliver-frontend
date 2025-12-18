// DesiDeliver Typography Configuration
// Primary: Plus Jakarta Sans (modern, professional)
// Secondary: Inter (excellent readability)

import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import { ThemeOptions } from '@mui/material/styles';

type TypographyOptions = NonNullable<ThemeOptions['typography']>;

const fontFamilyHeading = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const fontFamilyBody = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export const typography: TypographyOptions = {
  fontFamily: fontFamilyBody,
  
  // Display - Hero headlines
  h1: {
    fontFamily: fontFamilyHeading,
    fontWeight: 800,
    fontSize: '3.5rem',      // 56px
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    '@media (max-width: 900px)': {
      fontSize: '2.5rem',    // 40px
    },
    '@media (max-width: 600px)': {
      fontSize: '2rem',      // 32px
    },
  },
  
  // Page titles / Section headers
  h2: {
    fontFamily: fontFamilyHeading,
    fontWeight: 700,
    fontSize: '2.5rem',      // 40px
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    '@media (max-width: 900px)': {
      fontSize: '2rem',      // 32px
    },
    '@media (max-width: 600px)': {
      fontSize: '1.75rem',   // 28px
    },
  },
  
  // Card titles / Major subsections
  h3: {
    fontFamily: fontFamilyHeading,
    fontWeight: 700,
    fontSize: '1.75rem',     // 28px
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    '@media (max-width: 600px)': {
      fontSize: '1.5rem',    // 24px
    },
  },
  
  // Subheadings / Feature titles
  h4: {
    fontFamily: fontFamilyHeading,
    fontWeight: 600,
    fontSize: '1.25rem',     // 20px
    lineHeight: 1.4,
    letterSpacing: '-0.005em',
  },
  
  // Small headings
  h5: {
    fontFamily: fontFamilyHeading,
    fontWeight: 600,
    fontSize: '1.125rem',    // 18px
    lineHeight: 1.4,
  },
  
  // Micro headings / Labels
  h6: {
    fontFamily: fontFamilyHeading,
    fontWeight: 600,
    fontSize: '1rem',        // 16px
    lineHeight: 1.5,
  },
  
  // Subtitle large
  subtitle1: {
    fontFamily: fontFamilyBody,
    fontWeight: 500,
    fontSize: '1.125rem',    // 18px
    lineHeight: 1.5,
  },
  
  // Subtitle small
  subtitle2: {
    fontFamily: fontFamilyBody,
    fontWeight: 500,
    fontSize: '0.875rem',    // 14px
    lineHeight: 1.5,
  },
  
  // Body text primary
  body1: {
    fontFamily: fontFamilyBody,
    fontWeight: 400,
    fontSize: '1rem',        // 16px
    lineHeight: 1.6,
  },
  
  // Body text secondary
  body2: {
    fontFamily: fontFamilyBody,
    fontWeight: 400,
    fontSize: '0.875rem',    // 14px
    lineHeight: 1.6,
  },
  
  // Button text
  button: {
    fontFamily: fontFamilyBody,
    fontWeight: 600,
    fontSize: '0.9375rem',   // 15px
    lineHeight: 1.5,
    textTransform: 'none',
    letterSpacing: '0.01em',
  },
  
  // Caption text
  caption: {
    fontFamily: fontFamilyBody,
    fontWeight: 400,
    fontSize: '0.75rem',     // 12px
    lineHeight: 1.5,
  },
  
  // Overline text
  overline: {
    fontFamily: fontFamilyHeading,
    fontWeight: 600,
    fontSize: '0.75rem',     // 12px
    lineHeight: 1.5,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
};

export default typography;
