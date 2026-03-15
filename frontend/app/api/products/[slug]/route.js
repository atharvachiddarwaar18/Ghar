import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

/**
 * GET /api/products/[slug]
 * Returns a single product by slug
 */
export async function GET(request, { params }) {
  try {
    const { slug } = await params
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product: data })
  } catch (err) {
    console.error('GET /api/products/[slug] error:', err)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
