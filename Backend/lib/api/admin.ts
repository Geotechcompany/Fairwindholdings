import { AdminData } from "../../types/admin";

const mockAdminData: Omit<AdminData, 'createdAt'> & { createdAt: string } = {
  id: "1",
  users: 1000,
  totalUsers: 1000, // Add this line
  activeTraders: 500,
  revenue: 50000,
  totalTrades: 10000,
  totalVolume: 1000000,
  username: "admin",
  email: "admin@example.com",
  role: "admin",
  createdAt: new Date().toISOString(),
};

export async function getAdminData(): Promise<Omit<AdminData, 'createdAt'> & { createdAt: string }> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockAdminData;
}

// You can add more admin-related API functions here
export async function updateAdminSettings(
  settings: Partial<AdminData>
): Promise<void> {
  // Implement the logic to update admin settings
  console.log("Updating admin settings:", settings);
  // In a real app, you would send this data to your backend
}

export async function getAdminAnalytics(): Promise<any> {
  // Implement the logic to fetch admin analytics
  // This is just a placeholder
  return {
    dailyActiveUsers: 250,
    weeklyRevenue: 10000,
    monthlyGrowth: 0.05,
  };
}

// Add more functions as needed for various admin operations
