import * as React from "react";
import { Link } from "@remix-run/react";
import VerseBytesLogo from "assets/verse-bytes-light.png";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const navItems = [{ name: "Blog", path: "/blog" }];

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav className="text-white px-8 py-10 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-5xl font-semibold">Verse Bytes</h1>
          </Link>
        </div>
        <div className="flex items-center justify-center lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
        <div>
          <Link to="/login">
            <img
              src={VerseBytesLogo}
              alt="Verse Bytes Logo"
              className="h-14 w-14 transition-transform transform hover:scale-110"
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
            <li
              key={item.name}
              className="text-white hover:text-gray-300 transition-colors duration-300 mb-4 lg:mb-0"
            >
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
