import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import "./tailwind.css";
import { ErrorPage, Footer, Header } from "./components/";

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Oh no, something went wrong!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-900">
        <Header />
        <ErrorPage error={error} />
        <Scripts />
        <Footer />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Verse Bytes | Maria Torrente</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-900">
        <Header />
        <Footer />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
