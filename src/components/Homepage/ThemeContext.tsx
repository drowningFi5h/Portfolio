// ThemeContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Theme {
    background: string;
    foreground: string;
    accent: string;
    secondary: string;
    fog: string;
}

interface ThemeContextProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const darkTheme: Theme = {
    background: '#121212',
    foreground: '#ffffff',
    accent: '#00ff95',
    secondary: '#7000ff',
    fog: '#1e1e1e',
};

const lightTheme: Theme = {
    background: '#f5f5f5',
    foreground: '#262626',
    accent: '#007bff',
    secondary: '#6c757d',
    fog: '#e9ecef',
};

const ThemeContext = createContext<ThemeContextProps>({
    theme: darkTheme,
    setTheme: () => {},
    toggleTheme: () => {},
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(darkTheme);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState((prevTheme) => (prevTheme === darkTheme ? lightTheme : darkTheme));
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);