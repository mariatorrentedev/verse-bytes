export function validateEmail(email: unknown): void {
  if (typeof email !== "string") {
    throw new Error("Email must be a string.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format.");
  }
}

export function validatePassword(password: unknown): void {
  if (typeof password !== "string") {
    throw new Error("Password must be a string.");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character."
    );
  }
}
