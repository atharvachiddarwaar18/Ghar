import express from 'express'
import { supabase } from '../config/supabase.js'

const router = express.Router()

/**
 * GET /api/products
 * Returns all products, optionally filtered by category
 * Query params: ?category=Wall+Decor&sort=price_asc&limit=20
 */
router.get('/', async (req, res) => {
  try {
    const { category, sort = 'popular', limit = 50, search } = req.query

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    // Category filter
    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    // Search
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    // Sorting
    switch (sort) {
      case 'price_asc':    query = query.order('price', { ascending: true }); break
      case 'price_desc':   query = query.order('price', { ascending: false }); break
      case 'rating':       query = query.order('rating', { ascending: false }); break
      case 'new':          query = query.order('created_at', { ascending: false }); break
      default:             query = query.order('review_count', { ascending: false }) // popular
    }

    query = query.limit(parseInt(limit))

    const { data, error } = await query

    if (error) throw error

    res.json({ products: data || [], count: data?.length || 0 })
  } catch (err) {
    console.error('GET /products error:', err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

/**
 * GET /api/products/:slug
 * Returns a single product by slug
 */
router.get('/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', req.params.slug)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ product: data })
  } catch (err) {
    console.error('GET /products/:slug error:', err)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

export default router
