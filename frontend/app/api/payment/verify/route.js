import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import { optionalAuth } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * POST /api/payment/verify
 * Verifies Razorpay signature, then saves order to Supabase.
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature,
 *         items, total, shipping_address, user_id }
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      total,
      shipping_address,
      user_id,
    } = body

    // ── Signature Verification ────────────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // ── Get optional user from token ──────────────────────────────────────────
    const auth = await optionalAuth(request)
    const resolvedUserId = user_id || auth.userId || null

    // ── Save Order to Supabase ────────────────────────────────────────────────
    const orderId = uuidv4()
    const shippingLine = shipping_address
      ? `${shipping_address.address}, ${shipping_address.city}, ${shipping_address.state} - ${shipping_address.pincode}`
      : 'Not provided'

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: resolvedUserId,
        total,
        status: 'confirmed',
        razorpay_order_id,
        razorpay_payment_id,
        shipping_address: shippingLine,
        customer_name: shipping_address?.name || null,
        customer_email: shipping_address?.email || null,
        customer_phone: shipping_address?.phone || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order insert error:', orderError)
      // Payment succeeded but DB save failed — log and still return success
    }

    // ── Save Order Items ──────────────────────────────────────────────────────
    if (items && items.length > 0 && orderData) {
      const orderItems = items.map(item => ({
        id: uuidv4(),
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        product_name: item.name,
        product_image: item.image,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Order items insert error:', itemsError)
      }

      // ── Update stock ─────────────────────────────────────────────────────
      for (const item of items) {
        await supabase
          .rpc('decrement_stock', { product_id: item.id, quantity: item.quantity })
          .catch(err => console.error('Stock decrement error:', err))
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Payment verified and order placed successfully',
    })
  } catch (err) {
    console.error('POST /api/payment/verify error:', err)
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
