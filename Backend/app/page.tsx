import Dashboard from '../components/Dashboard';

// Mock data
const userData = {
  balance: 0.00,
  leverage: '1:100',
  credit: 0.00,
  totalDeposits: 0.00,
};

const stats = {
  pnl: 0.00,
  profit: 0,
  loss: 100,
  profitableOrders: '0/0',
};

export default function Page() {
  return (
    <Dashboard userData={userData} stats={stats} />
  );
}
