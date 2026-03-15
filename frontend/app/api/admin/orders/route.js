import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * GET /api/admin/orders
 * Returns all orders with customer details.
 * Query params: ?status=&limit=50&offset=0
 */
export async function GET(request) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('orders')
      .select(`
        id, total, status, customer_name, customer_email, customer_phone,
        shipping_address, created_at, razorpay_order_id, razorpay_payment_id,
        order_items (id, quantity, price, product_name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({ orders: data || [], total: count })
  } catch (err) {
    console.error('GET /api/admin/orders error:', err)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
