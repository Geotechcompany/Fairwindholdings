import type { User } from "@/types/user";
import type { AdminData } from "@/types/admin";

function transformUserToAdminData(user: User): AdminData {
  // Assuming these properties are available on the User type
  // You may need to adjust based on your actual User type
  return {
    users: 0, // This should be populated from elsewhere
    totalUsers: 0, // This should be populated from elsewhere
    activeTraders: 0, // This should be populated from elsewhere
    revenue: 0, // This should be populated from elsewhere
    username: user.fullName,
    email: user.email,
    role: user.admin ? "superadmin" : "admin",
    createdAt: new Date(),
    lastLogin: new Date(),
    totalTrades: 0,
    totalVolume: 0,
    id: user.id,
    // Add any other required properties for AdminData
  };
}

export { transformUserToAdminData };
