import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  accentColor: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [theme, setTheme] = useState<ThemeMode>('corporate');

  // Automatically adapt theme according to active vertical route
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/agro')) {
      setTheme('agro');
    } else if (path.startsWith('/development')) {
      setTheme('development');
    } else if (path.startsWith('/it')) {
      setTheme('it');
    } else {
      setTheme('corporate');
    }
  }, [location.pathname]);

  // Apply data-theme attribute on <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const accentColorMap: Record<ThemeMode, string> = {
    corporate: '#1e3a8a',
    agro: '#16a34a',
    development: '#d97706',
    it: '#0284c7',
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accentColor: accentColorMap[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
