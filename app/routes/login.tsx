import * as React from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { ActionData } from "types/common";
import { AuthorizationError } from "remix-auth";
import { json } from "@remix-run/node";
import { useActionData, Form, Link } from "@remix-run/react";
import { authenticator } from "../utils/auth.server";
import { AtSymbolIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/me",
  });
};

export const action: ActionFunction = async ({ request }) => {
  try {
    await authenticator.authenticate("form", request, {
      successRedirect: "/me",
      throwOnError: true,
    });
  } catch (error) {
    // Because redirects work by throwing a Response, you need to check if the
    // caught error is a response and return it or throw it again
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      // here the error is related to the authentication process
      return json({ error: error.message });
    }
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [showForm, setShowForm] = React.useState(false);
  const [loginType, setLoginType] = React.useState("register");

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="login-container">
      <h2>
        {loginType === "login" ? "Login with Email" : "Create an Account"}
      </h2>

      <div className="flex flex-col items-center space-y-4">
        <Link to="/auth/google" className="btn-primary">
          <GlobeAltIcon className="i-s" />
          Login with Google
        </Link>
        <button onClick={toggleForm} className="btn-primary">
          <AtSymbolIcon className="i-s" />
          {showForm ? "Cancel" : "Sign In with Email"}
        </button>
      </div>
      {showForm && (
        <Form method="post" className="mt-6">
          <input type="hidden" name="loginType" value={loginType} />
          <div className="mb-4">
            <label htmlFor="email-input">Email</label>
            <input
              type="email"
              id="email-input"
              name="email"
              placeholder="versebytes@gmail.com"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password-input">Password</label>
            <input
              type="password"
              id="password-input"
              required
              placeholder="Password"
              name="password"
            />
          </div>
          {actionData?.error && (
            <div id="form-error-message" className="mb-4">
              <p className="text-red-600 text-sm m-3" role="alert">
                {actionData.error}
              </p>
            </div>
          )}
          <button className="btn-primary" type="submit">
            Submit
          </button>
        </Form>
      )}
      <p className="text-center mt-6 mb-4">
        {loginType === "login" ? "New here?" : "Already have an account?"}
        <button
          onClick={() =>
            setLoginType(loginType === "login" ? "register" : "login")
          }
          className="text-accent-light dark:text-accent-dark hover:underline ml-1 focus:outline-none"
        >
          {loginType === "login" ? "Create an account" : "Login"}
        </button>
      </p>
      <p className="text-center text-text-light dark:text-text-dark mt-2">
        {`Click “Sign Up” to agree to Verse Byte's Terms of Service and
    acknowledge that Verse Byte's Privacy Policy applies to you.`}
      </p>
    </div>
  );
}
