import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import * as React from "react";
import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import {
  createUserSession,
  login,
  register,
  authenticator,
} from "../utils/auth.server";
import { safeRedirect } from "../utils";
import { AtSymbolIcon } from "@heroicons/react/24/outline";

function validateUsername(email: unknown) {
  if (typeof email !== "string" || email.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  fields?: {
    loginType: string;
    email: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (user) {
    return redirect("/me");
  }
  return { user };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const loginType = formData.get("loginType");
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/me");

  if (
    typeof loginType !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { loginType, email, password };
  const fieldErrors = {
    username: validateUsername(email),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case "login": {
      const user = await login({ email, password });
      if (!user) {
        return badRequest({
          fields,
          formError: "Incorrect username or password",
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const user = await register({ email, password });
      if (!user) {
        return badRequest({
          fields,
          formError: "Something went wrong, please try again!",
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = React.useState(false);
  const [loginType, setLoginType] = React.useState("register");

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="max-w-md mx-auto mt-32 p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {loginType === "login" ? "Login with Email" : "Create an Account"}
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <a
          href="/auth/google"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex justify-center items-center"
        >
          <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.35 11.1H12v2.8h5.25c-.4 1.9-2 3.1-5.25 3.1-3.25 0-5.75-2.45-5.75-5.6s2.5-5.6 5.75-5.6c1.45 0 2.75.5 3.8 1.4l2.6-2.6C15.8 3.3 14 2.8 12 2.8 6.75 2.8 2.5 6.7 2.5 12s4.25 9.2 9.5 9.2c4.8 0 8.5-3.25 8.5-8.2 0-.7-.1-1.3-.15-1.9z" />
          </svg>
          Login with Google
        </a>
        <button
          onClick={toggleForm}
          className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-300 flex justify-center items-center"
        >
          <AtSymbolIcon className="h-6 w-6 mr-2" />
          {showForm ? "Cancel" : "Sign In with Email"}
        </button>
      </div>
      {showForm && (
        <form
          method="post"
          className="mt-6"
          aria-describedby={
            actionData?.formError ? "form-error-message" : undefined
          }
        >
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <div className="mb-4">
            <label
              htmlFor="email-input"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email-input"
              name="email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              defaultValue={actionData?.fields?.email}
              aria-invalid={Boolean(actionData?.fieldErrors?.email)}
              aria-describedby={
                actionData?.fieldErrors?.email ? "email-error" : undefined
              }
            />
            {actionData?.fieldErrors?.email && (
              <p
                className="text-red-600 text-sm mt-1"
                role="alert"
                id="email-error"
              >
                {actionData.fieldErrors.email}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password-input"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password-input"
              name="password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-describedby={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />
            {actionData?.fieldErrors?.password && (
              <p
                className="text-red-600 text-sm mt-1"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            )}
          </div>
          {actionData?.formError && (
            <div id="form-error-message" className="mb-4">
              <p className="text-red-600 text-sm" role="alert">
                {actionData.formError}
              </p>
            </div>
          )}
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            type="submit"
          >
            Submit
          </button>
        </form>
      )}
      <p className="text-center mt-6 mb-4">
        {loginType === "login" ? "New here?" : "Already have an account?"}
        <button
          onClick={() =>
            setLoginType(loginType === "login" ? "register" : "login")
          }
          className="text-blue-500 hover:underline ml-1 focus:outline-none"
        >
          {loginType === "login" ? "Create an account" : "Login"}
        </button>
      </p>
      <p className="text-center text-gray-600 mt-2">
        {`Click “Sign Up” to agree to Verse Byte's Terms of Service and
        acknowledge that Verse Byte's Privacy Policy applies to you.`}
      </p>
    </div>
  );
}
