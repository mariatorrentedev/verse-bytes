import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "../utils/auth.server";

// Handle callback from Google
export const loader: LoaderFunction = async ({ request }) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/me",
    failureRedirect: "/login",
  });
};
