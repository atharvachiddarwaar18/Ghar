import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

/**
 * GET /api/products
 * Query params: ?category=&sort=popular&limit=50&search=
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'popular'
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')

    let query = supabase.from('products').select('*').eq('is_active', true)

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    switch (sort) {
      case 'price_asc':  query = query.order('price', { ascending: true }); break
      case 'price_desc': query = query.order('price', { ascending: false }); break
      case 'rating':     query = query.order('rating', { ascending: false }); break
      case 'new':        query = query.order('created_at', { ascending: false }); break
      default:           query = query.order('review_count', { ascending: false })
    }

    query = query.limit(limit)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ products: data || [], count: data?.length || 0 })
  } catch (err) {
    console.error('GET /api/products error:', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
