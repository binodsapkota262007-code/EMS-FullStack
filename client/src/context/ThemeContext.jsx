import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const getSystemPrefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const ThemeProvider = ({ children }) => {
  // "theme" is the user's chosen mode: "light" | "dark" | "system"
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system"
  );

  // "resolvedTheme" is what's actually applied ("light" | "dark")
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    theme === "system" ? (getSystemPrefersDark() ? "dark" : "light") : theme
  );

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark) => {
      root.classList.toggle("dark", isDark);
      root.style.colorScheme = isDark ? "dark" : "light";
      setResolvedTheme(isDark ? "dark" : "light");
    };

    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(media.matches);

      const handleChange = (e) => applyTheme(e.matches);
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    applyTheme(theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
