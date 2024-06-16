import type { LoginResponse } from "types/auth";
import axios from "axios";
import { API_URL } from "config";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/api/auth/login`,
      { email, password }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}
