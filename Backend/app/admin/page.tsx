import AdminPanel from "@/components/AdminPanel";
import { getAdminData } from "@/lib/api/admin";
import { AdminData } from "@/types/admin";

export default async function AdminPage() {
  const adminData = await getAdminData();

  return (
    <AdminPanel
      adminData={{ ...adminData, createdAt: new Date(adminData.createdAt) }}
    />
  );
}

async function fetchAdminData(): Promise<AdminData> {
  // Implement your data fetching logic here
  // This is a placeholder
  return {} as AdminData;
}
