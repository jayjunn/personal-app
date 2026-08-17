'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME_COOKIE_NAME, ThemeType } from '@/constants/theme';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: ThemeType;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeType>(initialTheme);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(THEME_COOKIE_NAME, newTheme);
        document.cookie = `${THEME_COOKIE_NAME}=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.warn('Theme storage error:', e);
      }

      fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
      }).catch((e) => console.warn('Server theme sync error:', e));
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light' as ThemeType,
      isDark: false,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
