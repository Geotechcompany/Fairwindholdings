export interface AdminData {
    id: string;
    users: number;
    totalUsers: number;
    activeTraders: number;
    revenue: number;
    totalTrades: number;
    totalVolume: number;
    username: string;
    email: string;
    role: 'admin' | 'superadmin';
    createdAt: Date;
    lastLogin?: Date;
  }