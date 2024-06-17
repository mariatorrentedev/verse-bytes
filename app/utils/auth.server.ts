import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { SESSION_SECRET } from "config";
import {
  createUser,
  getUserByEmail,
  getUserWithPasswordByEmail,
} from "services/user";

type LoginForm = {
  email: string;
  password: string;
  name?: string;
};

export async function register({ email, password }: LoginForm) {
  // Validate input
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Check if the email is already registered
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // Hash the pasword
  const passwordHash = await bcrypt.hash(password, 10);

  return createUser(email, passwordHash);
}

export async function login({ email, password }: LoginForm) {
  const userWithPassword = await getUserWithPasswordByEmail(email);

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

if (!SESSION_SECRET) throw new Error("SESSION_SECRET must be set");

const storage = createCookieSessionStorage({
  cookie: {
    name: "VB_SESSION",
    secrets: [SESSION_SECRET],
    secure: true,
    httpOnly: true,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(
      redirectTo && redirectTo !== "/" ? `/login?${searchParams}` : `/login`
    );
  }
  return userId;
}
