export function getErrorMessage(
  error: unknown,
  fallback: string = "Unknown Error"
) {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return fallback;
}
