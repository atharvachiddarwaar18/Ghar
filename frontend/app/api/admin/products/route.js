import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * GET /api/admin/products — Returns all products including inactive.
 * POST /api/admin/products — Creates a new product.
 */

export async function GET(request) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ products: data || [] })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  try {
    const {
      name, description, price, original_price, category,
      image_url, stock, slug, badge,
    } = await request.json()

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'name, price, and category are required' },
        { status: 400 }
      )
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
    return NextResponse.json(
      { product: data, message: 'Product created successfully' },
      { status: 201 }
    )
  } catch (err) {
    console.error('POST /api/admin/products error:', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
