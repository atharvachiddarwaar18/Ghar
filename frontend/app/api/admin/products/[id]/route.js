import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * PUT /api/admin/products/[id] — Update a product.
 * DELETE /api/admin/products/[id] — Hard-delete a product.
 */

export async function PUT(request, { params }) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  try {
    const { id } = await params
    const body = await request.json()
    const allowed = ['name', 'description', 'price', 'original_price', 'category', 'image_url', 'stock', 'badge', 'is_active']
    const updates = {}

    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key]
    }
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    return NextResponse.json({ product: data, message: 'Product updated successfully' })
  } catch (err) {
    console.error('PUT /api/admin/products/[id] error:', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  try {
    const { id } = await params
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ message: 'Product permanently deleted successfully' })
  } catch (err) {
    console.error('DELETE /api/admin/products/[id] error:', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
