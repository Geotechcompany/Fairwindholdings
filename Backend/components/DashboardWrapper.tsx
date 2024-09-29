'use client';

import Dashboard from './Dashboard';

export function DashboardWrapper({ userData, stats }) {
  return <Dashboard userData={userData} stats={stats} />;
}