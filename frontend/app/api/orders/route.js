import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * GET /api/orders
 * Returns all orders for the authenticated user.
 */
export async function GET(request) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total,
        status,
        shipping_address,
        customer_name,
        created_at,
        razorpay_order_id,
        order_items (
          id,
          quantity,
          price,
          product_name,
          product_image,
          product_id
        )
      `)
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ orders: data || [] })
  } catch (err) {
    console.error('GET /api/orders error:', err)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
