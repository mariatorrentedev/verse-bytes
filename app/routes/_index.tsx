import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Verse Bytes" },
    { name: "description", content: "Simple blog by Maria Torrente" },
  ];
};

export default function Index() {
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
            to="/blogs"
            className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-300"
          >
            Posts
          </Link>
        </div>
      </div>
    </nav>
  );
}
