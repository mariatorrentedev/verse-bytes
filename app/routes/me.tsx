import type { User } from "types/user";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getUserById, updateUser } from "services/user";
import { requireUserId } from "../utils/auth.server";

type MeLoader = {
  user: User | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/login");
  const user = await getUserById(userId);
  return { user };
};

export default function Me() {
  const { user } = useLoaderData<MeLoader>();

  return (
    <div className="max-w-md mx-auto my-8 p-4 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Here's your profile.</h1>
      <Form method="put">
        <div className="mb-4">
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            name="name"
            defaultValue={user?.name}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            name="email"
            defaultValue={user?.email}
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
