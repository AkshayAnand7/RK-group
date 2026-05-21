'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'

export async function generateReportData(reportType: string, dateRange: string, customStartDate?: string, customEndDate?: string) {
  const cookieStore = await cookies()
  const supabase = createAdminClient()

  const now = new Date()
  let startDate = new Date()
  let endDate = new Date()

  if (dateRange === 'today') {
    startDate.setHours(0, 0, 0, 0)
    startDate.setMinutes(startDate.getMinutes() - 330) // IST
  } else if (dateRange === 'week') {
    startDate.setDate(now.getDate() - 7)
  } else if (dateRange === 'month') {
    startDate.setMonth(now.getMonth() - 1)
  } else if (dateRange === 'custom' && customStartDate) {
    startDate = new Date(customStartDate)
    if (customEndDate) endDate = new Date(customEndDate)
  }

  const startDateIso = startDate.toISOString()
  const endDateIso = endDate.toISOString()

  let reportData: any[] = []
  let headers: string[] = []

  if (reportType === 'daily' || reportType === 'monthly') {
    // Combined Summary
    const { data: collections } = await supabase.from('collections').select('*').gte('created_at', startDateIso).lte('created_at', endDateIso)
    const { data: trips } = await supabase.from('trips').select('*').gte('date', startDateIso.split('T')[0]).lte('date', endDateIso.split('T')[0])
    const { data: expenses } = await supabase.from('expenses').select('*').gte('date', startDateIso.split('T')[0]).lte('date', endDateIso.split('T')[0])
    
    headers = ["Date", "Type", "Reference", "Income", "Expense", "Net"]
    
    collections?.forEach(c => {
      reportData.push([
        new Date(c.created_at).toLocaleDateString(),
        "Lottery",
        c.shop_name,
        c.amount,
        (c.expense || 0) + (c.advance || 0) + (c.prize || 0),
        c.amount - ((c.expense || 0) + (c.advance || 0) + (c.prize || 0))
      ])
    })

    trips?.forEach(t => {
      reportData.push([
        new Date(t.date).toLocaleDateString(),
        "Travel",
        t.vehicle || t.driver,
        t.received_amount || 0,
        0, // Vehicle expenses are in expenses table
        t.received_amount || 0
      ])
    })

    expenses?.forEach(e => {
      reportData.push([
        new Date(e.date).toLocaleDateString(),
        "Expense",
        e.category + " - " + (e.vehicle || 'N/A'),
        0,
        e.amount,
        -(e.amount)
      ])
    })
  } else if (reportType === 'shop') {
    const { data: collections } = await supabase.from('collections').select('*').gte('created_at', startDateIso).lte('created_at', endDateIso)
    headers = ["Date", "Shop Name", "Collection", "Expenses/Prizes", "Net Balance", "Staff"]
    collections?.forEach(c => {
      reportData.push([
        new Date(c.created_at).toLocaleDateString(),
        c.shop_name,
        c.amount,
        (c.expense || 0) + (c.advance || 0) + (c.prize || 0),
        c.amount - ((c.expense || 0) + (c.advance || 0) + (c.prize || 0)),
        c.staff_name
      ])
    })
  } else if (reportType === 'vehicle') {
    const { data: trips } = await supabase.from('trips').select('*').gte('date', startDateIso.split('T')[0]).lte('date', endDateIso.split('T')[0])
    const { data: expenses } = await supabase.from('expenses').select('*').eq('module', 'travel').gte('date', startDateIso.split('T')[0]).lte('date', endDateIso.split('T')[0])
    
    headers = ["Date", "Vehicle", "Type", "Detail", "Income", "Expense"]
    
    trips?.forEach(t => {
      reportData.push([
        new Date(t.date).toLocaleDateString(),
        t.vehicle,
        "Trip Income",
        `${t.from_location} - ${t.to_location}`,
        t.received_amount || 0,
        0
      ])
    })
    expenses?.forEach(e => {
      reportData.push([
        new Date(e.date).toLocaleDateString(),
        e.vehicle,
        "Vehicle Expense",
        e.detail,
        0,
        e.amount
      ])
    })
  } else if (reportType === 'financial') {
    // High level P&L
    const { data: collections } = await supabase.from('collections').select('*').gte('created_at', startDateIso).lte('created_at', endDateIso)
    const { data: trips } = await supabase.from('trips').select('*').gte('date', startDateIso.split('T')[0]).lte('date', endDateIso.split('T')[0])
    const { data: expenses } = await supabase.from('expenses').select('*').gte('date', startDateIso.split('T')[0]).lte('date', endDateIso.split('T')[0])
    
    let lotteryIn = collections?.reduce((s, c) => s + Number(c.amount || 0), 0) || 0
    let lotteryExp = collections?.reduce((s, c) => s + Number(c.expense || 0) + Number(c.advance || 0) + Number(c.prize || 0), 0) || 0
    let travelIn = trips?.reduce((s, t) => s + Number(t.received_amount || 0), 0) || 0
    let otherExp = expenses?.reduce((s, e) => s + Number(e.amount || 0), 0) || 0

    headers = ["Category", "Total Income", "Total Expense", "Net Profit"]
    reportData.push(["Lottery Operations", lotteryIn, lotteryExp, lotteryIn - lotteryExp])
    reportData.push(["Travel Operations", travelIn, 0, travelIn])
    reportData.push(["Other/Overhead Expenses", 0, otherExp, -otherExp])
    reportData.push(["GRAND TOTAL", lotteryIn + travelIn, lotteryExp + otherExp, (lotteryIn + travelIn) - (lotteryExp + otherExp)])
  }

  // Sort by date if Date is first column
  if (headers[0] === "Date") {
    reportData.sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
  }

  return { success: true, headers, data: reportData }
}
