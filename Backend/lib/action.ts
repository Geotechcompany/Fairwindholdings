"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { ActionResponse } from "@/types/actions";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<ActionResponse<void>> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const { userId } = await auth();

    if (!userId) {
      try {
        const signInAttempt = await clerkClient.signIn.create({
          identifier: email,
          password,
        });
        // Handle successful sign-in
      } catch (error) {
        // Handle sign-in error
      }
    }

    return { data: undefined };
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "Something went wrong" };
  }
}
