import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * GET /api/orders/[id]
 * Returns a single order belonging to the authenticated user.
 */
export async function GET(request, { params }) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id, quantity, price, product_name, product_image, product_id
        )
      `)
      .eq('id', id)
      .eq('user_id', auth.userId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order: data })
  } catch (err) {
    console.error('GET /api/orders/[id] error:', err)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}
