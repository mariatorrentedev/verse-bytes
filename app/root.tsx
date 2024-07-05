import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import "./tailwind.css";
import { ErrorPage, Footer, Header, ThemeModeButton } from "./components/";

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
      <body className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        <ThemeModeButton />
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
      <body className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        <Header />
        <main className="min-h-screen">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
