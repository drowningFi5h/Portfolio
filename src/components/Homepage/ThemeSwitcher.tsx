// ThemeSwitcher.tsx
'use client';

import React from 'react';
import { useTheme } from './ThemeContext';

export default function ThemeSwitcher() {
    const { toggleTheme, theme } = useTheme();

    return (
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <button
                onClick={toggleTheme}
                style={{
                    backgroundColor: theme.accent,
                    color: theme.foreground,
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Switch Theme
            </button>
        </div>
    );
}