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
    setTheme: (themeName: keyof typeof themes) => void;
}

const themes = {
    dark: {
        background: '#121212',
        foreground: '#ffffff',
        accent: '#29D6C5',
        secondary: '#7000ff',
        fog: '#ffffff',
    },
    light: {
        background: '#f5f5f5',
        foreground: '#262626',
        accent: '#e57536',
        secondary: '#6c757d',
        fog: '#aaaaaa',
    },
};

const ThemeContext = createContext<ThemeContextProps>({
    theme: themes.dark,
    setTheme: () => {},
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(themes.dark);

    const setTheme = (themeName: keyof typeof themes) => {
        setThemeState(themes[themeName]);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);