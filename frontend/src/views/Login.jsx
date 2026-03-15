'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

import { Chrome, ShieldCheck, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const { signInWithGoogle, user, loading } = useAuth()
  const navigate = useRouter()

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      toast.error('Failed to sign in with Google. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #8B4513 0%, #1C0A00 100%)' }}
      >
        <div className="absolute inset-0 bg-grain opacity-20" />
        <div className="relative text-center">
          <img
            src="/images/logo.png"
            alt="Ghar Sajaoo"
            className="h-16 mx-auto mb-6 object-contain"
            onError={e => { e.target.style.display = 'none' }}
          />
          <h2 className="font-heading text-4xl text-white font-bold mb-4 leading-snug">
            Modern Elegance,<br />
            <span className="italic text-gold">Indian Soul</span>
          </h2>
          <p className="font-body text-white/60 text-base max-w-xs leading-relaxed">
            Sign in to track orders, save your wishlist, and enjoy a personalised shopping experience.
          </p>
          <div className="flex justify-center gap-8 mt-12">
            {[['500+', 'Artisans'], ['12K+', 'Homes'], ['4.9★', 'Rating']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="font-heading text-2xl text-gold font-bold">{num}</p>
                <p className="font-body text-xs text-white/50 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img
              src="/images/logo.png"
              alt="Ghar Sajaoo"
              className="h-10 object-contain"
              onError={e => { e.target.style.display = 'none' }}
            />
            <div>
              <p className="font-heading text-xl font-bold text-dark">Ghar Sajaoo</p>
              <p className="font-body text-xs text-textbrown/50 tracking-widest uppercase">Artisanal Living</p>
            </div>
          </div>

          <h1 className="font-heading text-3xl text-dark font-semibold mb-2">Welcome Back</h1>
          <p className="font-body text-sm text-textbrown/60 mb-10">
            Sign in to your account to continue.
          </p>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gold/30 px-6 py-4 font-body text-sm font-medium text-dark hover:border-brown hover:shadow-card transition-all duration-300 disabled:opacity-60 group"
          >
            {/* Google SVG icon */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gold/20" />
            <span className="font-body text-xs text-textbrown/40 uppercase tracking-wider">Secure Login</span>
            <div className="flex-1 h-px bg-gold/20" />
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col gap-3">
            {[
              'Your data is encrypted and never shared',
              'No password required — Google handles your security',
              'Instant access to order tracking and wishlist',
            ].map(text => (
              <div key={text} className="flex items-start gap-2">
                <ShieldCheck size={14} className="text-brown mt-0.5 flex-shrink-0" />
                <p className="font-body text-xs text-textbrown/60">{text}</p>
              </div>
            ))}
          </div>

          {/* Back link */}
          <div className="mt-10 pt-6 border-t border-gold/20">
            <Link
              href="/"
              className="flex items-center gap-2 font-body text-xs text-textbrown/50 hover:text-brown transition-colors"
            >
              <ArrowLeft size={12} />
              Continue as Guest — Browse without signing in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
