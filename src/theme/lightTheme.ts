// DesiDeliver Light Theme
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { palette, lightNeutrals, shadows } from './palette';
import { typography } from './typography';
import { getComponents } from './components';

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: palette.primary,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    background: lightNeutrals.background,
    text: lightNeutrals.text,
    divider: lightNeutrals.divider,
  },
  typography,
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    shadows.subtle,
    shadows.small,
    shadows.medium,
    shadows.medium,
    shadows.large,
    shadows.large,
    shadows.large,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
    shadows.elevated,
  ],
  components: getComponents('light'),
};

export const lightTheme = createTheme(lightThemeOptions);

export default lightTheme;
