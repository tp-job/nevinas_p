import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
  theme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const getInitialTheme = (): "dark" | "light" => {
  if (typeof window === "undefined") return "light";

  const root = document.documentElement;
  const fromData = root.dataset.theme;
  if (fromData === "dark" || fromData === "light") return fromData;

  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<"dark" | "light">(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transitioning");

    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);

    // Enable transitions only after the initial hydration frame to prevent flash.
    // rAF alone can be starved on heavy routes (WebGL, chunk hydration), which
    // left "theme-transitioning" stuck and transitions permanently disabled —
    // the timeout guarantees re-enabling either way.
    const enableTransitions = () => {
      root.classList.remove("theme-transitioning");
      root.classList.add("theme-transition-ready");
    };
    const raf = requestAnimationFrame(enableTransitions);
    const timeout = window.setTimeout(enableTransitions, 150);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (nextTheme: "dark" | "light") => {
    setThemeState(nextTheme);
  };

  const value: ThemeContextType = {
    isDark,
    toggleTheme,
    setTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
