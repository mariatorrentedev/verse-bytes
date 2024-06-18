import type { LoginForm } from "types/auth";
import { redirect } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import bcrypt from "bcryptjs";
import {
  createUser,
  getUserByEmail,
  getUserWithPasswordByEmail,
} from "services/user";
import { getOAuthAccount, createOAuthAccount } from "services/auth";
import { sessionStorage } from "./session.server";
import { config } from "config";

export const authenticator = new Authenticator(sessionStorage);

// Google OAuth2 Strategy using under the hood remix-auth-oauth2
const googleStrategy = new GoogleStrategy(
  {
    clientID: config.GOOGLE_CLIENT_ID!,
    clientSecret: config.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${config.BASE_URL}/auth/google/callback`,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const email = profile.emails[0].value;
    const providerId = profile.id;
    const provider = "google";

    let user = await getUserByEmail(email);
    if (!user) {
      user = await createUser(email, undefined, profile.displayName);
    }

    if (!providerId) {
      return null;
    }

    const oauthAccount = getOAuthAccount(provider, providerId);

    if (!oauthAccount) {
      await createOAuthAccount(provider, providerId, user.id);
    }

    return user;
  }
);

authenticator.use(googleStrategy);

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

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export const requireAuth = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
};

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<string> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(
      redirectTo && redirectTo !== "/" ? `/login?${searchParams}` : `/login`
    );
  }
  return userId;
}
