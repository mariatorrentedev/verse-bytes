import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "../utils/auth.server";

// Redirect to Google OAuth2 login
export const loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/me",
    failureRedirect: "/login",
  });
};
