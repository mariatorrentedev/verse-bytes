import type { User } from "types/user";
import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { FormStrategy } from "remix-auth-form";
import { createUser, getUserByEmail } from "models/user";
import { getOAuthAccount, createOAuthAccount } from "models/auth";
import { sessionStorage } from "./session.server";
import { config } from "config";
import { login, register } from "./register.server";
import { validateEmail, validatePassword } from "./validator";

export const authenticator = new Authenticator<User | null>(sessionStorage, {
  sessionErrorKey: "authenticator-error",
});

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
      throw new Error("No providerId related to this account.");
    }

    const oauthAccount = getOAuthAccount(provider, providerId);

    if (!oauthAccount) {
      await createOAuthAccount(provider, providerId, user.id);
    }

    return user;
  }
);

authenticator.use(googleStrategy);

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
      throw new Error("Form not submitted correctly.");
    }

    validateEmail(email);
    validatePassword(password);

    let user: User | null = null;

    if (loginType === "register") {
      user = await register({ email, password });
    } else {
      user = await login({ email, password });
    }

    return user;
  })
);

export const requireAuth = async (request: Request): Promise<User | null> => {
  const user = authenticator.isAuthenticated(request);

  if (!user) {
    throw new Error("Unauthorized: You need to Login to access this page.");
  }

  return user;
};
