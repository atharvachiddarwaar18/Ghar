'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

import { supabase } from '../utils/supabase'

/**
 * AuthCallback — handles the redirect from Google OAuth via Supabase.
 * Supabase automatically exchanges the code in the URL for a session.
 * We just need to wait for onAuthStateChange and redirect.
 */
const AuthCallback = () => {
  const navigate = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/', { replace: true })
      } else if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true })
      }
    })

    // Fallback: if already signed in on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/', { replace: true })
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brown/30 border-t-brown rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-sm text-textbrown/60">Signing you in...</p>
      </div>
    </div>
  )
}

export default AuthCallback
