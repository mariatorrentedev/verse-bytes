import LoginForm from "../components/Login";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { login } from "services/auth";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const password = data.get("password") as string;
  const email = data.get("email") as string;
  try {
    const response = await login(email, password);
    if (response.token) {
      return json({ success: true });
    }
  } catch (error: any) {
    return json({ error: error.response.data.error }, { status: 500 });
  }
};

export default function Login() {
  return <LoginForm />;
}
