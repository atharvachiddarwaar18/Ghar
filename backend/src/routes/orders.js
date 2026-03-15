import express from 'express'
import { supabase } from '../config/supabase.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

/**
 * GET /api/orders
 * Returns all orders for the authenticated user.
 * Includes order items and product details.
 */
router.get('/', requireAuth, async (req, res) => {
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
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ orders: data || [] })
  } catch (err) {
    console.error('GET /orders error:', err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

/**
 * GET /api/orders/:id
 * Returns a single order by ID (must belong to authenticated user).
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id, quantity, price, product_name, product_image, product_id
        )
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json({ order: data })
  } catch (err) {
    console.error('GET /orders/:id error:', err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

export default router
