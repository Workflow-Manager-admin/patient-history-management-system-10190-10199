import React, { createContext, useState, useContext, useEffect } from "react";

// Context to manage theme
const ThemeContext = createContext();

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  /** Provides theme and toggler to child components */
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useTheme() {
  /** Access current theme and toggle function */
  return useContext(ThemeContext);
}
