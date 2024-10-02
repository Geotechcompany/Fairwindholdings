'use client';

import { Dashboard } from "./Dashboard";
import { UserData, Stats } from "../types/user";

interface DashboardWrapperProps {
  userData: UserData;
  stats: Stats;
}

export function DashboardWrapper({ userData, stats }: DashboardWrapperProps) {
  return <Dashboard userData={userData} stats={stats} />;
}