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
        await clerkClient.signIns.create({
          identifier: email,
          password,
        });
        return { data: undefined };
      } catch (error) {
        console.error("Sign-in error:", error);
        return { error: "Invalid credentials" };
      }
    }

    return { data: undefined };
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "Something went wrong" };
  }
}
