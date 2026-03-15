import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { razorpay } from '@/lib/razorpay'

export const runtime = 'nodejs'

/**
 * POST /api/payment/create
 * Creates a Razorpay order.
 * Body: { amount: number (INR), currency: 'INR' }
 */
export async function POST(request) {
  try {
    const { amount, currency = 'INR' } = await request.json()

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt: `rcpt_${uuidv4().slice(0, 16)}`,
      payment_capture: 1,
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    })
  } catch (err) {
    console.error('POST /api/payment/create error:', err)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
