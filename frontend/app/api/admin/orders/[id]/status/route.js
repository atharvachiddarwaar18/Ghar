import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * PATCH /api/admin/orders/[id]/status
 * Update order status.
 * Body: { status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' }
 */
export async function PATCH(request, { params }) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  try {
    const { id } = await params
    const { status } = await request.json()
    const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    return NextResponse.json({ order: data, message: `Order status updated to ${status}` })
  } catch (err) {
    console.error('PATCH /api/admin/orders/[id]/status error:', err)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }
}
