import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * GET /api/admin/stats
 * Returns aggregate dashboard stats.
 */
export async function GET(request) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  try {
    const [
      { count: totalOrders },
      { count: totalProducts },
      { count: totalUsers },
      { data: revenueData },
      { count: pendingOrders },
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total').in('status', ['confirmed', 'shipped', 'delivered']),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ])

    const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

    return NextResponse.json({
      totalOrders: totalOrders || 0,
      totalProducts: totalProducts || 0,
      totalUsers: totalUsers || 0,
      totalRevenue,
      pendingOrders: pendingOrders || 0,
    })
  } catch (err) {
    console.error('GET /api/admin/stats error:', err)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
