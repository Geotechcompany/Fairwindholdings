export interface Stats {
  totalPosts: number
  totalLikes: number
  totalComments: number
  averageEngagement: number
  lastActiveDate: string
  pnl: number
  profit: number
  loss: number
  profitableOrders: string
}

export type StatKey = keyof Stats

export const defaultStats: Stats = {
  totalPosts: 0,
  totalLikes: 0,
  totalComments: 0,
  averageEngagement: 0,
  lastActiveDate: '',
  pnl: 0,
  profit: 0,
  loss: 0,
  profitableOrders: '0/0'
}

export function calculateAverageEngagement(stats: Stats): number {
  const { totalPosts, totalLikes, totalComments } = stats
  return totalPosts ? (totalLikes + totalComments) / totalPosts : 0
}
