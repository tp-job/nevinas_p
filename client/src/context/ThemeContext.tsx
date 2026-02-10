import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface CardProps {
    title: string;
    children: ReactNode; // 👈 บอกว่า props นี้รองรับอะไรก็ได้ที่ React render ได้
}

export function Card({ title, children }: CardProps) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <div>{children}</div> {/* 👈 แสดงสิ่งที่ส่งมา */}
        </div>
    );
}


// Define the shape of the context value
interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (theme: 'dark' | 'light') => void;
    theme: 'dark' | 'light';
}

// Create the context with an initial value of null
const ThemeContext = createContext<ThemeContextType | null>(null);

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Define the props for the provider component
interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [isDark, setIsDark] = useState<boolean>(() => {
        const saved = localStorage.getItem('theme');
        if (saved) {
            return saved === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    const setTheme = (theme: 'dark' | 'light') => {
        setIsDark(theme === 'dark');
    };

    const value: ThemeContextType = {
        isDark,
        toggleTheme,
        setTheme,
        theme: isDark ? 'dark' : 'light'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};