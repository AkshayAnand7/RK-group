'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function getDashboardStats(period: string = 'week') {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // 1. Fetch Lottery Data
  const { data: collections } = await supabase.from('collections').select('amount, created_at')
  const { data: lotteryExpenses } = await supabase.from('expenses').select('amount').eq('module', 'lottery')
  
  // 2. Fetch Travel Data
  const { data: trips } = await supabase.from('trips').select('total_amount, received_amount, date')
  const { data: travelExpenses } = await supabase.from('expenses').select('amount').eq('module', 'travel')

  // Aggregations
  const totalLotteryCollection = collections?.reduce((sum, c) => sum + Number(c.amount), 0) || 0
  const totalLotteryExpense = lotteryExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
  
  const totalTripIncome = trips?.reduce((sum, t) => sum + Number(t.received_amount), 0) || 0
  const totalTravelExpense = travelExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
  const pendingTripAmount = trips?.reduce((sum, t) => sum + (Number(t.total_amount) - Number(t.received_amount)), 0) || 0

  // 3. Generate REAL Daily Chart Data (Last 7 Days)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dayName = days[d.getDay()]
    const dateStr = d.toISOString().split('T')[0]

    const lotteryDay = collections?.filter(c => c.created_at.startsWith(dateStr))
      .reduce((sum, c) => sum + Number(c.amount), 0) || 0
    
    const travelDay = trips?.filter(t => t.date === dateStr)
      .reduce((sum, t) => sum + Number(t.received_amount), 0) || 0

    return { day: dayName, lottery: lotteryDay, travel: travelDay }
  })

  return {
    lottery: {
      totalCollection: totalLotteryCollection,
      totalExpense: totalLotteryExpense,
      netBalance: totalLotteryCollection - totalLotteryExpense
    },
    travel: {
      totalIncome: totalTripIncome,
      totalExpense: totalTravelExpense,
      pendingAmount: pendingTripAmount,
      netProfit: totalTripIncome - totalTravelExpense
    },
    revenueData
  }
}
