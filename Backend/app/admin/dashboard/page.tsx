import AdminPanel from "@/components/AdminPanel";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { redirect } from "next/navigation";
import { transformUserToAdminData } from "@/lib/utils/admin";

export default async function AdminDashboard() {
  const { userId } = auth();
  if (!userId) {
    redirect("/signin");
  }

  const user = await clerkClient.users.getUser(userId);
  if (user.publicMetadata.role !== "admin") {
    redirect("/unauthorized");
  }

  return <AdminPanel adminData={transformUserToAdminData(user)} />;
}
