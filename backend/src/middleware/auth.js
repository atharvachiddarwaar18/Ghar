import { supabase } from '../config/supabase.js'

/**
 * requireAuth — middleware that verifies a Supabase JWT from the Authorization header.
 * Attaches req.user and req.userId on success.
 *
 * Frontend sends: Authorization: Bearer <supabase_access_token>
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }

    const token = authHeader.split(' ')[1]

    // Verify JWT with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = user
    req.userId = user.id
    next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    res.status(500).json({ error: 'Authentication error' })
  }
}

/**
 * optionalAuth — attaches user if token is present, but does not block if missing.
 * Used for routes that work both authenticated and guest.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) return next()

    const token = authHeader.split(' ')[1]
    const { data: { user } } = await supabase.auth.getUser(token)
    if (user) { req.user = user; req.userId = user.id }
    next()
  } catch {
    next()
  }
}
