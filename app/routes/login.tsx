import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import {
  createUserSession,
  login,
  register,
  requireUserId,
} from "../utils/auth.server";
import { safeRedirect } from "../utils";

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
  const userId = await requireUserId(request, "/login");
  return userId ?? null;
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

  return (
    <div className="max-w-md mx-auto my-8 p-6 border rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Register or Login?
      </h1>
      <form
        method="post"
        aria-describedby={
          actionData?.formError ? "form-error-message" : undefined
        }
      >
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") ?? undefined}
        />
        <fieldset className="mb-4">
          <legend className="sr-only">Login or Register</legend>
          <div className="flex justify-around">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="loginType"
                value="login"
                className="form-radio text-blue-600"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />
              <span className="ml-2">Login</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="loginType"
                value="register"
                className="form-radio text-blue-600"
                defaultChecked={actionData?.fields?.loginType === "register"}
              />
              <span className="ml-2">Register</span>
            </label>
          </div>
        </fieldset>
        <div className="mb-4">
          <label
            htmlFor="email-input"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="text"
            id="email-input"
            name="email"
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            defaultValue={actionData?.fields?.email}
            aria-invalid={Boolean(actionData?.fieldErrors?.email)}
            aria-describedby={
              actionData?.fieldErrors?.email ? "email-error" : undefined
            }
          />
          {actionData?.fieldErrors?.email ? (
            <p
              className="text-red-600 text-sm mt-1"
              role="alert"
              id="email-error"
            >
              {actionData?.fieldErrors.email}
            </p>
          ) : null}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password-input"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            id="password-input"
            name="password"
            defaultValue={actionData?.fields?.password}
            type="password"
            aria-invalid={
              Boolean(actionData?.fieldErrors?.password) || undefined
            }
            aria-describedby={
              actionData?.fieldErrors?.password ? "password-error" : undefined
            }
          />
          {actionData?.fieldErrors?.password ? (
            <p
              className="text-red-600 text-sm mt-1"
              role="alert"
              id="password-error"
            >
              {actionData?.fieldErrors.password}
            </p>
          ) : null}
        </div>
        {actionData?.formError ? (
          <div id="form-error-message" className="mb-4">
            <p className="text-red-600 text-sm" role="alert">
              {actionData?.formError}
            </p>
          </div>
        ) : null}
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
