import { createCookieSessionStorage } from "@remix-run/node";
import { NODE_ENV, SESSION_SECRET } from "../../config";

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set.");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "VB_SESSION",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
