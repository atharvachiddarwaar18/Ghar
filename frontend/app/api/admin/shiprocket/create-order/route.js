import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * POST /api/admin/shiprocket/create-order
 * Mocks the Shiprocket API to assign a shipping AWB.
 * Body: { order_id }
 */
export async function POST(request) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  try {
    const { order_id } = await request.json()
    if (!order_id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    // Simulate Shiprocket API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const { error } = await supabase
      .from('orders')
      .update({ status: 'shipped', updated_at: new Date().toISOString() })
      .eq('id', order_id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Order pushed to Delhivery successfully via Shiprocket.',
      shipment_id: 'SHP' + Math.floor(Math.random() * 900000 + 100000),
      awb_code: 'AWB' + Math.floor(Math.random() * 90000000 + 10000000)
    })
  } catch (err) {
    console.error('POST /api/admin/shiprocket/create-order error:', err)
    return NextResponse.json({ error: 'Logistics assignment failed' }, { status: 500 })
  }
}
