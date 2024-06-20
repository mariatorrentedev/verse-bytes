import type { LoginForm } from "types/auth";
import type { User } from "types/user";
import bcrypt from "bcryptjs";
import {
  createUser,
  getUserByEmail,
  getUserWithPasswordByEmail,
} from "services/user";

export async function register({ email, password }: LoginForm): Promise<User> {
  // Just double checkin, edge case.
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

export async function login({ email, password }: LoginForm): Promise<User> {
  const userWithPassword = await getUserWithPasswordByEmail(email);

  if (!userWithPassword || !userWithPassword.password) {
    throw new Error("No user registered with this password.");
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    throw new Error("Passwords don't match, please try again!");
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
