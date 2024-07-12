import * as React from "react";
import { useFetcher } from "@remix-run/react";

const prefersDarkMQ = "(prefers-color-scheme: dark)";
const getPreferredTheme = () =>
  window.matchMedia(prefersDarkMQ).matches ? Theme.DARK : Theme.LIGHT;

enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

const themes: Array<Theme> = Object.values(Theme);

type ThemeContextType = [
  Theme | null,
  React.Dispatch<React.SetStateAction<Theme | null>>
];

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

function ThemeProvider({
  children,
  specifiedTheme,
}: {
  children: React.ReactNode;
  specifiedTheme: Theme | null;
}) {
  const [theme, setTheme] = React.useState<Theme | null>(() => {
    if (specifiedTheme && themes.includes(specifiedTheme)) {
      return specifiedTheme;
    }
    return typeof document === "undefined" ? null : getPreferredTheme();
  });

  const persistTheme = useFetcher();

  const persistThemeRef = React.useRef(persistTheme);
  React.useEffect(() => {
    persistThemeRef.current = persistTheme;
  }, [persistTheme]);

  React.useEffect(() => {
    if (theme) {
      persistThemeRef.current.submit(
        { theme },
        { action: "action/set-theme", method: "post" }
      );
    }
  }, [theme]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkMQ);
    const handleChange = () =>
      setTheme(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && themes.includes(value as Theme);
}

export { Theme, ThemeProvider, useTheme, isTheme };
