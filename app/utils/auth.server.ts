import type { LoginForm } from "types/auth";
import type { User } from "types/user";
import type { ActionData } from "types/common";
import type { TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { FormStrategy } from "services/form";
import bcrypt from "bcryptjs";
import {
  createUser,
  getUserByEmail,
  getUserWithPasswordByEmail,
} from "services/user";
import { getOAuthAccount, createOAuthAccount } from "services/auth";
import { sessionStorage } from "./session.server";
import { config } from "config";

export const authenticator = new Authenticator<
  User | null | TypedResponse<ActionData>
>(sessionStorage);

// Google OAuth2 Strategy using under the hood remix-auth-oauth2
const googleStrategy = new GoogleStrategy<User | null>(
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

export const requireAuth = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Error("Unauthorized: You need to Login to access this page.");
  }
  return user;
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

export async function login({
  email,
  password,
}: LoginForm): Promise<User | null> {
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

const badRequest = (data: ActionData) => json(data, { status: 400 });

// Use the custom Form Strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");
    const loginType = form.get("loginType");

    if (
      typeof loginType !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return badRequest({
        error: "Error while signing up.",
      });
    }

    const fields = { loginType, email, password };
    const fieldErrors = {
      username: validateUsername(email),
      password: validatePassword(password),
    };
    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({
        error: "Error while signing up.",
      });
    }

    let user = null;

    if (loginType == "login") {
      user = await login({ email, password });
    } else if (loginType === "register") {
      try {
        user = await register({ email, password });
      } catch (error) {
        return badRequest({
          error: "Error while signing up.",
        });
      }
    } else {
      badRequest({
        error: "Something went wrong.",
      });
    }

    return user;
  })
);
