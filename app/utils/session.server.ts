import { createCookieSessionStorage } from "@remix-run/node";
import { config } from "config";

if (!config.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set.");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "VB_SESSION",
    secrets: [config.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
