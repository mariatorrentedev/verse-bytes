import { isRouteErrorResponse, Link } from "@remix-run/react";

export default function ErrorPage({ error }: { error: unknown }) {
  return (
    <div className="flex flex-col items-center justify-center mt-48 bg-gray-900 text-white p-4">
      {isRouteErrorResponse(error) ? (
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            {error.status} {error.statusText}
          </h1>
          <p className="text-lg mb-2">{error.data}</p>
        </div>
      ) : error instanceof Error ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-lg mb-2">{error.message}</p>
          <p className="text-lg mb-4">The stack trace is:</p>
          <pre className="bg-gray-800 p-4 rounded-md">{error.stack}</pre>
        </div>
      ) : (
        <h1 className="text-3xl font-bold">Unknown Error</h1>
      )}
      <Link
        to="/"
        className="mt-4 px-8 py-3 bg-gray-600 text-white font-semibold rounded shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Go Home
      </Link>
    </div>
  );
}
