import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('nexusai_theme');
    if (saved === 'light') {
      setIsDark(false);
      applyLightTheme();
    } else {
      setIsDark(true);
      applyDarkTheme();
    }
  }, []);

  const applyDarkTheme = () => {
    document.documentElement.style.setProperty('--bg-primary', '#050508');
    document.documentElement.style.setProperty('--bg-card', '#0d0d14');
    document.documentElement.style.setProperty('--text-primary', '#ffffff');
    document.documentElement.style.setProperty('--border-color', 'rgba(255,255,255,0.07)');
    document.body.style.backgroundColor = '#050508';
  };

  const applyLightTheme = () => {
    document.documentElement.style.setProperty('--bg-primary', '#f5f5f5');
    document.documentElement.style.setProperty('--bg-card', '#ffffff');
    document.documentElement.style.setProperty('--text-primary', '#1a1a1a');
    document.documentElement.style.setProperty('--border-color', 'rgba(0,0,0,0.1)');
    document.body.style.backgroundColor = '#f5f5f5';
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('nexusai_theme', newIsDark ? 'dark' : 'light');
    
    if (newIsDark) {
      applyDarkTheme();
    } else {
      applyLightTheme();
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}