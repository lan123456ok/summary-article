import React, {createContext, useState, useContext, ReactNode, useEffect} from 'react';
import { ThemeMode } from "@/types";


type ThemeContextType = {
    theme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
    isSystemTheme: boolean;
    useSystemTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "newsummary-theme-preference";
const SYSTEM_THEME_PREFERENCE = "system";

const ThemeProvider: React.FC<{ children: ReactNode}> = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeMode>('light');
    const [isSystemTheme, setIsSystemTheme] = useState(false);

    useEffect(() => {
        const savedPreference = localStorage.getItem(THEME_STORAGE_KEY);

        if (savedPreference === SYSTEM_THEME_PREFERENCE) {
            setIsSystemTheme(true);
            const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setCurrentTheme(preferDark ? 'dark' : 'light');
        } else if (savedPreference === 'dark' || savedPreference === 'light') {
            setCurrentTheme(savedPreference);
            setIsSystemTheme(false);
        } else {
            setIsSystemTheme(true);
            const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setCurrentTheme(preferDark ? 'dark' : 'light');
        }
    }, []);

    useEffect(() => {
       if (!isSystemTheme) return;

       const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

       const handleChange = (e: MediaQueryListEvent) => {
           setCurrentTheme(e.matches ? 'dark' : 'light');
       };

       mediaQuery.addEventListener('change', handleChange);

       return () => mediaQuery.removeEventListener('change', handleChange);
    }, [isSystemTheme]);

    useEffect(() => {
        const root = document.documentElement;

        if (currentTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        if (!isSystemTheme) {
            localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
        }
    }, [currentTheme, isSystemTheme])

    const setTheme = (theme: ThemeMode) => {
        setCurrentTheme(theme);
        setIsSystemTheme(false);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }

    const toggleTheme = () => {
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    };

    const useSystemTheme = () => {
        setIsSystemTheme(true);
        localStorage.setItem(THEME_STORAGE_KEY, SYSTEM_THEME_PREFERENCE);
        const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setCurrentTheme(preferDark ? 'dark' : 'light');
    }

    return (
        <ThemeContext.Provider
            value={{
                theme: currentTheme,
                toggleTheme,
                setTheme,
                isSystemTheme,
                useSystemTheme
        }
        }>
            {children}
        </ThemeContext.Provider>
    );
}

const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export { ThemeProvider, useTheme };