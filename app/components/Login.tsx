import { Form, useActionData } from "@remix-run/react";
import type { LoginResponse } from "types/auth";

export default function LoginForm() {
  const loginData = useActionData<LoginResponse>();

  return (
    <div className="max-w-sm mx-auto mt-8">
      <Form method="post" className="max-w-sm mx-auto mt-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
            <input
              type="email"
              name="email"
              className="form-input mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </label>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password:
            <input
              type="password"
              name="password"
              className="form-input mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </label>
        </div>
        {loginData?.error && (
          <p className="form-input text-red-600">{loginData.error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
      </Form>
    </div>
  );
}
