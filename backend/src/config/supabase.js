import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
// Fallback: use the anon key (works as valid JWT so client initializes properly)
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y3p5bnVlY3F0a25xdHdiaXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTQyOTEsImV4cCI6MjA4NzY5MDI5MX0.JJD6jeM64FBB1sfFHRILqfAA0XLLeobuNg9TL8Aaa1E'

if (!supabaseUrl) {
  console.error('❌  Missing Supabase env vars: SUPABASE_URL is required.')
  process.exit(1)
}

// Detect if the service key is a valid JWT (starts with eyJ) or an invalid publishable key
const isValidJwt = supabaseServiceKey && supabaseServiceKey.startsWith('eyJ')
const effectiveKey = isValidJwt ? supabaseServiceKey : FALLBACK_ANON_KEY

if (!isValidJwt) {
  console.warn('⚠️  SUPABASE_SERVICE_KEY does not appear to be a valid JWT. Using anon key as fallback.')
  console.warn('   Please update SUPABASE_SERVICE_KEY in backend/.env with your Supabase Service Role key.')
  console.warn('   Get it from: Supabase Dashboard → Settings → API → service_role (secret)')
}

/**
 * Backend Supabase client.
 * When service key is valid, this bypasses Row Level Security.
 * Never expose service key to the frontend.
 */
export const supabase = createClient(supabaseUrl, effectiveKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

