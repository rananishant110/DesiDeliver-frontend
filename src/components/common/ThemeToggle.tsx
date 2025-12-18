import React from 'react';
import { IconButton, Tooltip, useTheme as useMuiTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'medium' }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  const iconSize = {
    small: 20,
    medium: 24,
    large: 28,
  };

  return (
    <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          width: size === 'small' ? 36 : size === 'large' ? 48 : 42,
          height: size === 'small' ? 36 : size === 'large' ? 48 : 42,
          borderRadius: '12px',
          backgroundColor: muiTheme.palette.mode === 'light' 
            ? 'rgba(0, 0, 0, 0.04)' 
            : 'rgba(255, 255, 255, 0.08)',
          '&:hover': {
            backgroundColor: muiTheme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.08)' 
              : 'rgba(255, 255, 255, 0.12)',
          },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isDarkMode ? 'dark' : 'light'}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isDarkMode ? (
              <DarkMode 
                sx={{ 
                  fontSize: iconSize[size],
                  color: muiTheme.palette.primary.main,
                }} 
              />
            ) : (
              <LightMode 
                sx={{ 
                  fontSize: iconSize[size],
                  color: muiTheme.palette.warning.main,
                }} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
