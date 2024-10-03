'use client'

import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { TradingDashboard } from "@/components/trading-dashboard"
import { UserData, Stats } from "@/types/user"

export default function TradingDashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    redirect("/sign-in")
  }

  const userData: UserData = {
    balance: 0.00,
    leverage: '1:100',
    credit: 0.00,
    totalDeposits: 0.00,
    fullName: user?.fullName || 'User',
    email: user?.primaryEmailAddress?.emailAddress || '',
    profileImage: user?.imageUrl || '/placeholder-avatar.png',
  }

  const stats: Stats = {
    pnl: 0.00,
    profit: 0,
    loss: 100,
    profitableOrders: '0/0',
  }

  return <TradingDashboard userData={userData} stats={stats} />
}