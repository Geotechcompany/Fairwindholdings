'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardWrapper } from "@/components/DashboardWrapper"
import { UserData, Stats } from "@/types/user"

export default function TradingDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/register')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null // This will prevent any flash of content before redirect
  }

  // Mock data (replace with actual data fetching logic)
  const userData: UserData = {
    balance: 0.00,
    leverage: '1:100',
    credit: 0.00,
    totalDeposits: 0.00,
    fullName: session.user?.name || 'User',
    email: session.user?.email || '',
    profileImage: '/placeholder-avatar.png',
  }

  const stats: Stats = {
    pnl: 0.00,
    profit: 0,
    loss: 100,
    profitableOrders: '0/0',
  }

  return <DashboardWrapper userData={userData} stats={stats} />
}