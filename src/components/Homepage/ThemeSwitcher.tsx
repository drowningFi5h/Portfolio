'use client';

import React from 'react';
import { useTheme } from './ThemeContext';

const themes = {
    dark: {},
    light: {}
};

export default function ThemeSwitcher() {
    const { setTheme, theme } = useTheme();

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value as keyof typeof themes);
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                backgroundColor: theme.background,
                border: `2px solid ${theme.accent}`,
                borderRadius: '8px',
                padding: '10px',
                boxShadow: `0 4px 8px rgba(0, 0, 0, 0.2)`,
            }}
        >
            <label
                htmlFor="theme-selector"
                style={{
                    color: theme.foreground,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    display: 'block',
                }}
            >
                Theme:
            </label>
            <select
                id="theme-selector"
                onChange={handleThemeChange}
                style={{
                    backgroundColor: theme.accent,
                    color: theme.foreground,
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                }}
            >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
            </select>
        </div>
    );
}