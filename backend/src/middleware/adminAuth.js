import { supabase } from '../config/supabase.js'

/**
 * requireAdmin — two-layer admin guard:
 *   1. Checks X-Admin-Password header against env var ADMIN_PASSWORD
 *   2. OR checks if the authenticated user has role='admin' in the users table
 *
 * Frontend admin panel sends: X-Admin-Password: <password>
 */
export const requireAdmin = async (req, res, next) => {
  try {
    const adminPassword = req.headers['x-admin-password']
    const adminEnvPassword = process.env.ADMIN_PASSWORD

    // Layer 1: Password-based admin access
    if (adminPassword && adminEnvPassword && adminPassword === adminEnvPassword) {
      req.isAdmin = true
      return next()
    }

    // Layer 2: Role-based admin access via authenticated JWT
    const authHeader = req.headers.authorization
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
          req.user = user
          req.userId = user.id
          req.isAdmin = true
          return next()
        }
      }
    }

    return res.status(403).json({ error: 'Admin access required' })
  } catch (err) {
    console.error('Admin auth error:', err)
    res.status(500).json({ error: 'Authorization error' })
  }
}
