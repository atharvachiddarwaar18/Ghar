import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
const FALLBACK_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isValidJwt = supabaseServiceKey && supabaseServiceKey.startsWith('eyJ')
const effectiveKey = isValidJwt ? supabaseServiceKey : FALLBACK_ANON_KEY

if (!supabaseUrl) {
  console.error('❌  Missing Supabase env vars: SUPABASE_URL is required.')
}

if (!isValidJwt) {
  console.warn('⚠️  SUPABASE_SERVICE_KEY does not appear to be a valid JWT. Using anon key as fallback.')
}

/**
 * Server-side Supabase client (service role).
 * Bypasses Row Level Security. NEVER expose to the browser.
 * Only use inside API Route Handlers (app/api/).
 */
export const supabase = createClient(supabaseUrl, effectiveKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
