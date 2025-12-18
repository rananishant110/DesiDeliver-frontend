// DesiDeliver Dark Theme
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { palette, darkNeutrals, darkShadows } from './palette';
import { typography } from './typography';
import { getComponents } from './components';

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: palette.primary,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    background: darkNeutrals.background,
    text: darkNeutrals.text,
    divider: darkNeutrals.divider,
  },
  typography,
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    darkShadows.subtle,
    darkShadows.small,
    darkShadows.medium,
    darkShadows.medium,
    darkShadows.large,
    darkShadows.large,
    darkShadows.large,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
    darkShadows.elevated,
  ],
  components: getComponents('dark'),
};

export const darkTheme = createTheme(darkThemeOptions);

export default darkTheme;
