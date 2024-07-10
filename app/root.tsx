import type { LoaderFunction } from "@remix-run/node";
import type { Theme } from "./utils/theme-provider";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  json,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import { ErrorPage, Footer, Header, ThemeModeButton } from "./components/";
import { ThemeProvider, useTheme } from "./utils/theme-provider";
import { getThemeSession } from "./utils/theme.server";

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  return json({ theme: themeSession.getTheme() });
};

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

export function App() {
  const [theme] = useTheme();

  return (
    <html lang="en" className={`${theme ?? ""} h-full`}>
      <head>
        <title>Verse Bytes | Maria Torrente</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<{ theme: Theme }>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}
