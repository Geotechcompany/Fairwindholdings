// /Backend/lib/api/auth.ts

import axios from "axios";
import { UserRegistrationData } from "@/types/user";

export async function registerUser(userData: UserRegistrationData) {
  try {
    const response = await axios.post("/api/auth/register", userData);
    if (response.status === 201) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.data.error || 'Registration failed');
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'An error occurred during registration');
    }
    throw new Error('An unexpected error occurred');
  }
}
