import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticator } from "../utils/auth.server";
import { redirect } from "react-router-dom";

export const loader: LoaderFunction = () => redirect("/login");

export const action: ActionFunction = async ({ request }) => {
  return await authenticator.logout(request, {
    redirectTo: "/login",
  });
};
