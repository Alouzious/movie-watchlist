import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    const toggleTheme = () => {
        setIsDark(prev => {
            const newVal = !prev;
            localStorage.setItem('theme', newVal ? 'dark' : 'light');
            return newVal;
        });
    };

    const theme = {
        isDark,
        toggleTheme,
        colors: {
            background: isDark ? '#0f0f0f' : '#f0f0f0',
            surface: isDark ? '#1a1a1a' : '#ffffff',
            surface2: isDark ? '#2a2a2a' : '#e8e8e8',
            text: isDark ? '#ffffff' : '#111111',
            textMuted: isDark ? '#aaaaaa' : '#555555',
            border: isDark ? '#333333' : '#dddddd',
            primary: '#e50914',
        },
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);