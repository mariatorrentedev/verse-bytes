import { useTheme } from "../utils/theme-mode";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? (
        <MoonIcon className="w-8 h-8" />
      ) : (
        <SunIcon className="w-8 h-8" />
      )}
    </button>
  );
}
