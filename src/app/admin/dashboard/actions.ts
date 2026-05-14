'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function getDashboardStats() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Fetch Lottery Data
  const { data: collections } = await supabase.from('collections').select('amount')
  const { data: lotteryExpenses } = await supabase.from('expenses').select('amount').eq('module', 'lottery')
  
  // Fetch Travel Data
  const { data: trips } = await supabase.from('trips').select('total_amount, received_amount')
  const { data: travelExpenses } = await supabase.from('expenses').select('amount').eq('module', 'travel')

  // Aggregations
  const totalLotteryCollection = collections?.reduce((sum, c) => sum + Number(c.amount), 0) || 0
  const totalLotteryExpense = lotteryExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
  
  const totalTripIncome = trips?.reduce((sum, t) => sum + Number(t.received_amount), 0) || 0
  const totalTravelExpense = travelExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
  const pendingTripAmount = trips?.reduce((sum, t) => sum + (Number(t.total_amount) - Number(t.received_amount)), 0) || 0

  // Mock chart data for now based on actual sums (can be expanded to daily/monthly groups)
  const revenueData = [
    { day: "Mon", lottery: totalLotteryCollection * 0.1, travel: totalTripIncome * 0.1 },
    { day: "Tue", lottery: totalLotteryCollection * 0.15, travel: totalTripIncome * 0.12 },
    { day: "Wed", lottery: totalLotteryCollection * 0.12, travel: totalTripIncome * 0.18 },
    { day: "Thu", lottery: totalLotteryCollection * 0.2, travel: totalTripIncome * 0.15 },
    { day: "Fri", lottery: totalLotteryCollection * 0.18, travel: totalTripIncome * 0.2 },
    { day: "Sat", lottery: totalLotteryCollection * 0.25, travel: totalTripIncome * 0.25 },
    { day: "Sun", lottery: totalLotteryCollection * 0.1, travel: totalTripIncome * 0.1 },
  ]

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
