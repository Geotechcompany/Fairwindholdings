// /Backend/lib/api/auth.ts

import axios from "axios";
import { UserRegistrationData } from "@/types/user";

export async function registerUser(userData: UserRegistrationData) {
  try {
    const response = await axios.post("/api/auth/register", userData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message;
    }
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const apiError = error as { response?: { data?: unknown } };
      throw apiError.response?.data || 'Unknown error';
    }
    throw 'Unknown error';
  }
}
