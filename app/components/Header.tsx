import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <nav className="flex items-center justify-between bg-gray-800 text-white p-4">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl">Verse Bytes</span>
      </div>
      <div className="block lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <Link
            to="/login"
            className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300 mr-4"
          >
            Login
          </Link>
          <Link
            to="/blog"
            className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300"
          >
            Blog
          </Link>
        </div>
      </div>
    </nav>
  );
}
