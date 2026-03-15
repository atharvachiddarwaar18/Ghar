import express from 'express'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { razorpay } from '../config/razorpay.js'
import { supabase } from '../config/supabase.js'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()

/**
 * POST /api/payment/create
 * Creates a Razorpay order. Returns order_id used by the frontend Razorpay modal.
 *
 * Body: { amount: number (in INR), currency: 'INR' }
 */
router.post('/create', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    // Razorpay expects amount in paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `rcpt_${uuidv4().slice(0, 16)}`,
      payment_capture: 1, // Auto capture
    }

    const order = await razorpay.orders.create(options)

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    })
  } catch (err) {
    console.error('POST /payment/create error:', err)
    res.status(500).json({ error: 'Failed to create payment order' })
  }
})

/**
 * POST /api/payment/verify
 * Verifies Razorpay signature to confirm payment authenticity.
 * On success, saves the order to Supabase.
 *
 * Body: {
 *   razorpay_order_id, razorpay_payment_id, razorpay_signature,
 *   items, total, shipping_address, user_id
 * }
 */
router.post('/verify', optionalAuth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      total,
      shipping_address,
      user_id,
    } = req.body

    // ── Signature Verification ────────────────────────────────────────────────
    // HMAC-SHA256(order_id + "|" + payment_id, secret) must match signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' })
    }

    // ── Save Order to Supabase ────────────────────────────────────────────────
    const orderId = uuidv4()
    const shippingLine = shipping_address
      ? `${shipping_address.address}, ${shipping_address.city}, ${shipping_address.state} - ${shipping_address.pincode}`
      : 'Not provided'

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: user_id || req.userId || null,
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
      // The Razorpay dashboard is the source of truth for payment
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

      // ── Update stock ──────────────────────────────────────────────────────
      for (const item of items) {
        await supabase.rpc('decrement_stock', {
          product_id: item.id,
          quantity: item.quantity,
        }).catch(err => console.error('Stock decrement error:', err))
      }
    }

    res.json({
      success: true,
      orderId,
      message: 'Payment verified and order placed successfully',
    })
  } catch (err) {
    console.error('POST /payment/verify error:', err)
    res.status(500).json({ success: false, error: 'Payment verification failed' })
  }
})

export default router
