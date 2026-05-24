'use server'

import { createAdminClient } from '@/utils/supabase/admin'

export async function getDashboardStats(period: string = 'week') {
  const supabase = createAdminClient()

  const now = new Date()
  let startDate = new Date()

  if (period === 'today') {
    // Calculate IST midnight properly regardless of server timezone
    const istOffset = 5.5 * 60 * 60 * 1000
    const istNow = new Date(now.getTime() + istOffset)
    const istDateStr = istNow.toISOString().split('T')[0]
    startDate = new Date(`${istDateStr}T00:00:00+05:30`)
  } else if (period === 'week') {
    startDate.setDate(now.getDate() - 7)
  } else if (period === 'month') {
    startDate.setMonth(now.getMonth() - 1)
  } else if (period === 'all') {
    startDate = new Date(2000, 0, 1)
  }

  const startDateIso = startDate.toISOString()

  // Run all queries concurrently for better performance
  const [
    { data: collections },
    { data: lotteryExpenses },
    { data: trips },
    { data: travelExpenses }
  ] = await Promise.all([
    supabase.from('collections').select('amount, expense, advance, prize, created_at, date').gte('created_at', startDateIso),
    supabase.from('expenses').select('amount').eq('module', 'lottery').gte('created_at', startDateIso),
    supabase.from('trips').select('total_amount, received_amount, date').gte('date', startDateIso.split('T')[0]),
    supabase.from('expenses').select('amount').eq('module', 'travel').gte('created_at', startDateIso)
  ]);

  // Aggregations
  const totalLotteryCollection = collections?.reduce((sum, c) => sum + Number(c.amount || 0), 0) || 0
  const totalLotteryDeductions = collections?.reduce((sum, c) => 
    sum + Number(c.expense || 0) + Number(c.advance || 0) + Number(c.prize || 0), 0) || 0
  const totalExternalLotteryExpense = lotteryExpenses?.reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0
  
  const totalTripIncome = trips?.reduce((sum, t) => sum + Number(t.received_amount || 0), 0) || 0
  const totalTravelExpense = travelExpenses?.reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0
  const pendingTripAmount = trips?.reduce((sum, t) => sum + (Number(t.total_amount || 0) - Number(t.received_amount || 0)), 0) || 0

  // 3. Generate Daily Chart Data (Last 7 Days)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dayName = days[d.getDay()]
    const dateStr = d.toISOString().split('T')[0]

    const lotteryDay = collections?.filter(c => (c.date === dateStr || (c.created_at && c.created_at.startsWith(dateStr))))
      .reduce((sum, c) => sum + Number(c.amount || 0), 0) || 0
    
    const travelDay = trips?.filter(t => t.date === dateStr)
      .reduce((sum, t) => sum + Number(t.received_amount || 0), 0) || 0

    return { day: dayName, lottery: lotteryDay, travel: travelDay }
  })

  return {
    lottery: {
      totalCollection: totalLotteryCollection,
      totalExpense: totalLotteryDeductions + totalExternalLotteryExpense,
      netBalance: totalLotteryCollection - (totalLotteryDeductions + totalExternalLotteryExpense)
    },
    travel: {
      totalIncome: totalTripIncome,
      totalExpense: totalTravelExpense,
      pendingAmount: pendingTripAmount,
      netProfit: totalTripIncome - totalTravelExpense
    },
    revenueData,
    period
  }
}
