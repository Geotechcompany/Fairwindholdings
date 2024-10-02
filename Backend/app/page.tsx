import { DashboardWrapper } from "../components/DashboardWrapper";
import { UserData, Stats } from "../types/user"; // Make sure to create and import these types

// Mock data
const userData: UserData = {
  balance: 0.00,
  leverage: '1:100',
  credit: 0.00,
  totalDeposits: 0.00,
  fullName: 'John Doe',
  email: 'john@example.com',
  profileImage: '/images/placeholder-avatar.png',
};

const stats: Stats = {
  pnl: 0.00,
  profit: 0,
  loss: 100,
  profitableOrders: '0/0',
};

export default function Page() {
  return (
    <DashboardWrapper userData={userData} stats={stats} />
  );
}