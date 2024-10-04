import { z } from "zod";
import type { ActionResponse } from "@/types/actions";
import { action } from "@/lib/safe-action";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

const logoutSchema = z.object({});

type LogoutResponse = ActionResponse<{ success: boolean }>;

async function logout() {
  const cookieStore = cookies();
  const session = await auth.validateSession(cookieStore.get("session")?.value);

  if (session) {
    await auth.invalidateSession(session.sessionId);
    cookieStore.delete("session");
  }

  return { success: true };
}

const logoutAction = action(logoutSchema, async () => {
  const result = await logout();
  return { data: result };
});

export { logoutAction as POST };
