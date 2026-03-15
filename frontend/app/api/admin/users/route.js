import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'

/**
 * GET /api/admin/users
 * Returns all registered users.
 */
export async function GET(request) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ users: data || [] })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
