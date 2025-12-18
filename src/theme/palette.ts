// DesiDeliver Modern Color Palette
// Inspired by Indian spices (Orange) and professional trust (Teal)

export const palette = {
  // Primary - Vibrant Orange (represents Indian spices/warmth)
  primary: {
    main: '#FF6B35',
    light: '#FF8F66',
    dark: '#E55A2B',
    contrastText: '#FFFFFF',
  },

  // Secondary - Deep Teal (professional, trustworthy)
  secondary: {
    main: '#004E64',
    light: '#0A7389',
    dark: '#003847',
    contrastText: '#FFFFFF',
  },

  // Success - Fresh Green
  success: {
    main: '#00A878',
    light: '#33B993',
    dark: '#008A62',
    contrastText: '#FFFFFF',
  },

  // Warning - Golden Yellow
  warning: {
    main: '#FFB800',
    light: '#FFC633',
    dark: '#CC9300',
    contrastText: '#1A1A2E',
  },

  // Error - Warm Red
  error: {
    main: '#E63946',
    light: '#EB616B',
    dark: '#B82D38',
    contrastText: '#FFFFFF',
  },

  // Info - Sky Blue
  info: {
    main: '#0EA5E9',
    light: '#38BDF8',
    dark: '#0284C7',
    contrastText: '#FFFFFF',
  },
};

// Light Theme Neutrals
export const lightNeutrals = {
  background: {
    default: '#FAFBFC',
    paper: '#FFFFFF',
    subtle: '#F1F5F9',
  },
  text: {
    primary: '#1A1A2E',
    secondary: '#4A5568',
    disabled: '#A0AEC0',
  },
  divider: '#E2E8F0',
  border: '#E2E8F0',
};

// Dark Theme Neutrals
export const darkNeutrals = {
  background: {
    default: '#0F172A',
    paper: '#1E293B',
    subtle: '#334155',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    disabled: '#64748B',
  },
  divider: '#334155',
  border: '#475569',
};

// Gradients
export const gradients = {
  primary: 'linear-gradient(135deg, #FF6B35 0%, #FF8F66 100%)',
  primaryHover: 'linear-gradient(135deg, #E55A2B 0%, #FF6B35 100%)',
  secondary: 'linear-gradient(135deg, #004E64 0%, #0A7389 100%)',
  secondaryHover: 'linear-gradient(135deg, #003847 0%, #004E64 100%)',
  hero: 'linear-gradient(135deg, #FF6B35 0%, #FF8F66 50%, #FFB800 100%)',
  heroDark: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
  surface: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
  surfaceDark: 'linear-gradient(180deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.7) 100%)',
};

// Shadows
export const shadows = {
  subtle: '0 1px 3px rgba(0,0,0,0.08)',
  small: '0 2px 6px rgba(0,0,0,0.08)',
  medium: '0 4px 12px rgba(0,0,0,0.1)',
  large: '0 8px 24px rgba(0,0,0,0.12)',
  elevated: '0 12px 40px rgba(0,0,0,0.15)',
  card: '0 4px 20px rgba(0,0,0,0.08)',
  cardHover: '0 8px 30px rgba(0,0,0,0.12)',
  button: '0 4px 14px rgba(255,107,53,0.4)',
  buttonHover: '0 6px 20px rgba(255,107,53,0.5)',
};

// Dark mode shadows
export const darkShadows = {
  subtle: '0 1px 3px rgba(0,0,0,0.3)',
  small: '0 2px 6px rgba(0,0,0,0.3)',
  medium: '0 4px 12px rgba(0,0,0,0.4)',
  large: '0 8px 24px rgba(0,0,0,0.5)',
  elevated: '0 12px 40px rgba(0,0,0,0.6)',
  card: '0 4px 20px rgba(0,0,0,0.4)',
  cardHover: '0 8px 30px rgba(0,0,0,0.5)',
  button: '0 4px 14px rgba(255,107,53,0.3)',
  buttonHover: '0 6px 20px rgba(255,107,53,0.4)',
};
