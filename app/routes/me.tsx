import type { User } from "types/user";
import type { LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "../utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
};

export default function Me() {
  const user = useLoaderData<User | null>();

  return (
    <div className="max-w-md mx-auto my-8 p-4 border rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{`Here's your profile.`}</h1>
        <Form method="post" action="/logout">
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Logout
          </button>
        </Form>
      </div>
      <Form method="put">
        <div className="mb-4">
          <label className="block mb-1 text-gray-700" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            name="name"
            defaultValue={user?.name ?? ""}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            name="email"
            defaultValue={user?.email}
            readOnly
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Save Changes
        </button>
      </Form>
    </div>
  );
}
