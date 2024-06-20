export function validateEmail(email: unknown) {
  if (typeof email !== "string" || email.length < 3) {
    throw new Error("Usernames must be at least 3 characters long");
  }
}

export function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    throw new Error(`Passwords must be at least 6 characters long`);
  }
}
