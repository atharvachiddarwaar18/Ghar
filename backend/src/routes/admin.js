import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../config/supabase.js'
import { requireAdmin } from '../middleware/adminAuth.js'

const router = express.Router()

// All admin routes require admin auth
router.use(requireAdmin)

/* ── Dashboard Stats ────────────────────────────── */
/**
 * GET /api/admin/stats
 * Returns aggregate stats for the dashboard overview.
 */
router.get('/stats', async (req, res) => {
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

    res.json({
      totalOrders: totalOrders || 0,
      totalProducts: totalProducts || 0,
      totalUsers: totalUsers || 0,
      totalRevenue,
      pendingOrders: pendingOrders || 0,
    })
  } catch (err) {
    console.error('GET /admin/stats error:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

/* ── Orders Management ──────────────────────────── */
/**
 * GET /api/admin/orders
 * Returns all orders with customer details.
 */
router.get('/orders', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query

    let query = supabase
      .from('orders')
      .select(`
        id, total, status, customer_name, customer_email, customer_phone,
        shipping_address, created_at, razorpay_order_id, razorpay_payment_id,
        order_items (id, quantity, price, product_name)
      `)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (status) query = query.eq('status', status)

    const { data, error, count } = await query

    if (error) throw error

    res.json({ orders: data || [], total: count })
  } catch (err) {
    console.error('GET /admin/orders error:', err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

/**
 * PATCH /api/admin/orders/:id/status
 * Update order status.
 * Body: { status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' }
 */
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    const { status } = req.body

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` })
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Order not found' })

    res.json({ order: data, message: `Order status updated to ${status}` })
  } catch (err) {
    console.error('PATCH /admin/orders/:id/status error:', err)
    res.status(500).json({ error: 'Failed to update order status' })
  }
})

/* ── Product Management ─────────────────────────── */
/**
 * GET /api/admin/products
 * Returns all products including inactive.
 */
router.get('/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ products: data || [] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

/**
 * POST /api/admin/products
 * Create a new product.
 */
router.post('/products', async (req, res) => {
  try {
    const {
      name, description, price, original_price, category,
      image_url, stock, slug, badge,
    } = req.body

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'name, price, and category are required' })
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        id: uuidv4(),
        name,
        description,
        price: parseFloat(price),
        original_price: original_price ? parseFloat(original_price) : null,
        category,
        image_url,
        stock: parseInt(stock) || 0,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        badge,
        is_active: true,
        rating: 0,
        review_count: 0,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ product: data, message: 'Product created successfully' })
  } catch (err) {
    console.error('POST /admin/products error:', err)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

/**
 * PUT /api/admin/products/:id
 * Update an existing product.
 */
router.put('/products/:id', async (req, res) => {
  try {
    const allowed = ['name', 'description', 'price', 'original_price', 'category', 'image_url', 'stock', 'badge', 'is_active']
    const updates = {}

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }

    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Product not found' })

    res.json({ product: data, message: 'Product updated successfully' })
  } catch (err) {
    console.error('PUT /admin/products/:id error:', err)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

/**
 * DELETE /api/admin/products/:id
 * Hard-delete a product from Supabase.
 */
router.delete('/products/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error

    res.json({ message: 'Product permanently deleted successfully' })
  } catch (err) {
    console.error('DELETE /admin/products/:id error:', err)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

/* ── Logistics (Shiprocket Mock) ────────────────── */
/**
 * POST /api/admin/shiprocket/create-order
 * Mocks the Shiprocket API to assign a shipping AWB.
 */
router.post('/shiprocket/create-order', async (req, res) => {
  try {
    const { order_id } = req.body
    if (!order_id) return res.status(400).json({ error: 'Order ID required' })

    // Simulate Shiprocket API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Update the local order status to 'shipped' as it passed to logistics
    const { error } = await supabase
      .from('orders')
      .update({ status: 'shipped', updated_at: new Date().toISOString() })
      .eq('id', order_id)

    if (error) throw error

    // Mock successful response from Shiprocket
    res.json({
      success: true,
      message: 'Order pushed to Delhivery successfully via Shiprocket.',
      shipment_id: 'SHP' + Math.floor(Math.random() * 900000 + 100000),
      awb_code: 'AWB' + Math.floor(Math.random() * 90000000 + 10000000)
    })
  } catch (err) {
    console.error('POST /admin/shiprocket/create-order error:', err)
    res.status(500).json({ error: 'Logistics assignment failed' })
  }
})

/* ── Users ──────────────────────────────────────── */
/**
 * GET /api/admin/users
 * Returns all registered users.
 */
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ users: data || [] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

export default router
