import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Theme, useTheme } from "~/utils/theme-provider";

export default function ThemeToggleButton() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };

  return (
    <button type="submit" onClick={toggleTheme}>
      {theme === Theme.LIGHT ? (
        <MoonIcon className="w-8 h-8" />
      ) : (
        <SunIcon className="w-8 h-8" />
      )}
    </button>
  );
}
