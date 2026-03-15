import { supabase } from './supabase.js'
import { NextResponse } from 'next/server'

/**
 * requireAuth — parses Supabase JWT from Authorization header.
 * Returns { userId, user } on success, or a 401 NextResponse on failure.
 *
 * Usage inside a Route Handler:
 *   const auth = await requireAuth(request)
 *   if (auth instanceof NextResponse) return auth  // 401
 *   const { userId } = auth
 */
export async function requireAuth(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header' },
      { status: 401 }
    )
  }

  const token = authHeader.split(' ')[1]
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  return { user, userId: user.id }
}

/**
 * optionalAuth — attaches user if token present, returns {} if not.
 * Never blocks the request.
 */
export async function optionalAuth(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return {}
    const token = authHeader.split(' ')[1]
    const { data: { user } } = await supabase.auth.getUser(token)
    if (user) return { user, userId: user.id }
    return {}
  } catch {
    return {}
  }
}

/**
 * requireAdmin — two-layer admin guard:
 *   1. X-Admin-Password header compared to ADMIN_PASSWORD env var
 *   2. OR authenticated user with role='admin' in the users table
 *
 * Returns { isAdmin: true } on success, or a 403 NextResponse on failure.
 */
export async function requireAdmin(request) {
  const adminPassword = request.headers.get('x-admin-password')
  const adminEnvPassword = process.env.ADMIN_PASSWORD

  // Layer 1: password-based
  if (adminPassword && adminEnvPassword && adminPassword === adminEnvPassword) {
    return { isAdmin: true }
  }

  // Layer 2: JWT role-based
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (!error && user) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData?.role === 'admin') {
        return { isAdmin: true, user, userId: user.id }
      }
    }
  }

  return NextResponse.json(
    { error: 'Admin access required' },
    { status: 403 }
  )
}
