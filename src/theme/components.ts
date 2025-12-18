// DesiDeliver Component Style Overrides
// Modern, rounded, animated components

import { Components, Theme } from '@mui/material/styles';
import { palette, shadows, gradients } from './palette';

export const getComponents = (mode: 'light' | 'dark'): Components<Theme> => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: mode === 'light' ? '#f1f1f1' : '#1E293B',
        },
        '&::-webkit-scrollbar-thumb': {
          background: mode === 'light' ? '#c1c1c1' : '#475569',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: mode === 'light' ? '#a1a1a1' : '#64748B',
        },
      },
    },
  },

  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: '12px',
        padding: '10px 24px',
        fontWeight: 600,
        fontSize: '0.9375rem',
        textTransform: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      contained: {
        boxShadow: shadows.button,
        '&:hover': {
          boxShadow: shadows.buttonHover,
        },
      },
      containedPrimary: {
        background: gradients.primary,
        '&:hover': {
          background: gradients.primaryHover,
        },
      },
      containedSecondary: {
        background: gradients.secondary,
        '&:hover': {
          background: gradients.secondaryHover,
        },
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
          backgroundColor: mode === 'light' ? 'rgba(255, 107, 53, 0.04)' : 'rgba(255, 107, 53, 0.08)',
        },
      },
      outlinedPrimary: {
        borderColor: palette.primary.main,
        color: palette.primary.main,
        '&:hover': {
          borderColor: palette.primary.dark,
          color: palette.primary.dark,
        },
      },
      sizeLarge: {
        padding: '14px 32px',
        fontSize: '1rem',
        borderRadius: '14px',
      },
      sizeSmall: {
        padding: '6px 16px',
        fontSize: '0.8125rem',
        borderRadius: '10px',
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        boxShadow: mode === 'light' ? shadows.card : shadows.medium,
        transition: 'all 0.3s ease-in-out',
        border: mode === 'light' ? 'none' : '1px solid rgba(255,255,255,0.05)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: mode === 'light' ? shadows.cardHover : shadows.large,
        },
      },
    },
  },

  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px',
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: shadows.subtle,
      },
      elevation2: {
        boxShadow: shadows.small,
      },
      elevation3: {
        boxShadow: shadows.medium,
      },
      elevation4: {
        boxShadow: shadows.large,
      },
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.primary.main,
            },
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: palette.primary.main,
        },
      },
      notchedOutline: {
        borderColor: mode === 'light' ? '#E2E8F0' : '#475569',
        transition: 'border-color 0.2s ease-in-out',
      },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        backdropFilter: 'blur(10px)',
        backgroundColor: mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(15, 23, 42, 0.8)',
        borderBottom: mode === 'light' 
          ? '1px solid rgba(0, 0, 0, 0.05)' 
          : '1px solid rgba(255, 255, 255, 0.05)',
      },
      colorPrimary: {
        backgroundColor: mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(15, 23, 42, 0.8)',
        color: mode === 'light' ? '#1A1A2E' : '#F8FAFC',
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 500,
      },
      filled: {
        '&.MuiChip-colorSuccess': {
          backgroundColor: palette.success.main,
          color: palette.success.contrastText,
        },
        '&.MuiChip-colorWarning': {
          backgroundColor: palette.warning.main,
          color: palette.warning.contrastText,
        },
        '&.MuiChip-colorError': {
          backgroundColor: palette.error.main,
          color: palette.error.contrastText,
        },
      },
    },
  },

  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
      },
      standardSuccess: {
        backgroundColor: mode === 'light' ? '#E8F5E9' : 'rgba(0, 168, 120, 0.1)',
        color: mode === 'light' ? palette.success.dark : palette.success.light,
      },
      standardError: {
        backgroundColor: mode === 'light' ? '#FFEBEE' : 'rgba(230, 57, 70, 0.1)',
        color: mode === 'light' ? palette.error.dark : palette.error.light,
      },
      standardWarning: {
        backgroundColor: mode === 'light' ? '#FFF8E1' : 'rgba(255, 184, 0, 0.1)',
        color: mode === 'light' ? palette.warning.dark : palette.warning.main,
      },
      standardInfo: {
        backgroundColor: mode === 'light' ? '#E3F2FD' : 'rgba(14, 165, 233, 0.1)',
        color: mode === 'light' ? palette.info.dark : palette.info.light,
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: '20px',
        boxShadow: shadows.elevated,
      },
    },
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.9375rem',
        minHeight: '48px',
        '&.Mui-selected': {
          color: palette.primary.main,
        },
      },
    },
  },

  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: '3px',
        borderRadius: '3px 3px 0 0',
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: '8px',
        fontSize: '0.8125rem',
        fontWeight: 500,
        padding: '8px 14px',
      },
    },
  },

  MuiAvatar: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: mode === 'light' ? '#E2E8F0' : '#334155',
      },
    },
  },

  MuiSkeleton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
      },
      rectangular: {
        borderRadius: '12px',
      },
    },
  },

  MuiBackdrop: {
    styleOverrides: {
      root: {
        backdropFilter: 'blur(4px)',
        backgroundColor: mode === 'light' 
          ? 'rgba(0, 0, 0, 0.3)' 
          : 'rgba(0, 0, 0, 0.6)',
      },
    },
  },

  MuiBadge: {
    styleOverrides: {
      badge: {
        fontWeight: 600,
      },
    },
  },

  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: '12px',
        boxShadow: shadows.large,
        marginTop: '8px',
      },
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        margin: '4px 8px',
        padding: '10px 16px',
        '&:hover': {
          backgroundColor: mode === 'light' 
            ? 'rgba(255, 107, 53, 0.08)' 
            : 'rgba(255, 107, 53, 0.12)',
        },
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          backgroundColor: mode === 'light' 
            ? 'rgba(0, 0, 0, 0.04)' 
            : 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: '4px',
        height: '6px',
      },
    },
  },

  MuiCircularProgress: {
    styleOverrides: {
      root: {
        color: palette.primary.main,
      },
    },
  },

  MuiLink: {
    styleOverrides: {
      root: {
        color: palette.primary.main,
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'color 0.2s ease-in-out',
        '&:hover': {
          color: palette.primary.dark,
          textDecoration: 'underline',
        },
      },
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        margin: '4px 0',
        '&.Mui-selected': {
          backgroundColor: mode === 'light' 
            ? 'rgba(255, 107, 53, 0.08)' 
            : 'rgba(255, 107, 53, 0.12)',
          '&:hover': {
            backgroundColor: mode === 'light' 
              ? 'rgba(255, 107, 53, 0.12)' 
              : 'rgba(255, 107, 53, 0.16)',
          },
        },
      },
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottomColor: mode === 'light' ? '#E2E8F0' : '#334155',
      },
      head: {
        fontWeight: 600,
        backgroundColor: mode === 'light' ? '#F8FAFC' : '#1E293B',
      },
    },
  },

  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: mode === 'light' 
            ? 'rgba(0, 0, 0, 0.02)' 
            : 'rgba(255, 255, 255, 0.02)',
        },
      },
    },
  },

  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          margin: '16px 0',
        },
      },
    },
  },

  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        '&.Mui-expanded': {
          minHeight: '48px',
        },
      },
      content: {
        '&.Mui-expanded': {
          margin: '12px 0',
        },
      },
    },
  },

  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
        textTransform: 'none',
        fontWeight: 600,
        '&.Mui-selected': {
          backgroundColor: palette.primary.main,
          color: palette.primary.contrastText,
          '&:hover': {
            backgroundColor: palette.primary.dark,
          },
        },
      },
    },
  },

  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
      },
    },
  },

  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
      },
      switchBase: {
        padding: 1,
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          '& + .MuiSwitch-track': {
            backgroundColor: palette.primary.main,
            opacity: 1,
          },
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 13,
        backgroundColor: mode === 'light' ? '#E2E8F0' : '#475569',
        opacity: 1,
      },
    },
  },
});
