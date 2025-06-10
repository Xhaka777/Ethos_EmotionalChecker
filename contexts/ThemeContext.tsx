import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

type ThemeColors = {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  card: string;
  shadow: string;
};

const lightColors: ThemeColors = {
  background: '#FAFBFC',
  surface: '#FFFFFF',
  primary: '#3B82F6',
  secondary: '#14B8A6',
  accent: '#F97316',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  card: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkColors: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#60A5FA',
  secondary: '#2DD4BF',
  accent: '#FB923C',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  border: '#334155',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  card: '#1E293B',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

type ThemeContextType = {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const systemColorScheme = useColorScheme();

  // const actualTheme = theme === 'system' ? (systemColorScheme || 'light') : theme;
  const actualTheme = theme === 'system' ? (systemColorScheme || 'dark') : theme;
  // const colors = actualTheme === 'light' ? lightColors : darkColors;
  const colors = actualTheme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}