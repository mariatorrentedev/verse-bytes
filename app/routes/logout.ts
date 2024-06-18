import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticator } from "../utils/auth.server";
import { safeRedirect } from "../utils";

export const loader: LoaderFunction = () => safeRedirect("/login");

export const action: ActionFunction = async ({ request }) => {
  return authenticator.logout(request, {
    redirectTo: "/login",
  });
};
