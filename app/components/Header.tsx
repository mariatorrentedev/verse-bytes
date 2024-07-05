import * as React from "react";
import { Link } from "@remix-run/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { CloudinaryImage, ThemeModeButton } from "./";
import { useTheme } from "../utils/theme-mode";

export default function Header() {
  const { theme } = useTheme();

  const navItems = [
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
  ];

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center">
          <Link to="/">
            <h1>Verse Bytes</h1>
          </Link>
        </div>
        <div className="flex items-center justify-center lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none text-primary-light dark:text-primary-dark"
          >
            {menuOpen ? (
              <XMarkIcon className="i-md" />
            ) : (
              <Bars3Icon className="i-md" />
            )}
          </button>
        </div>
        <div className="flex">
          <ThemeModeButton />
          <Link to="/login">
            <CloudinaryImage
              publicId={
                theme === "light" ? "verse_bytes_light" : "verse-bytes-dark"
              }
              alt="Verse Bytes Logo"
              options={{ width: 50, height: 50 }}
              className="transition-transform transform hover:scale-110"
            />
          </Link>
        </div>
      </div>
      <div
        className={`lg:flex justify-center items-center text-xl ${
          menuOpen ? "block mt-4" : "hidden"
        } lg:block lg:mt-0`}
      >
        <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
