'use client'
import React, { useState } from 'react'
import { Mail, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const NewsletterSection = () => {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      toast.success('You\'re subscribed! Welcome to the Ghar Sajaoo family. 🏠')
      setEmail('')
      setSubmitting(false)
    }, 1000)
  }

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #8B4513 0%, #6B3410 40%, #1C0A00 100%)',
      }}
      aria-label="Newsletter signup"
    >
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-48 translate-y-48" />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <Mail size={36} className="text-gold mx-auto mb-6" />

        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold/70 mb-3">
          Stay Inspired
        </p>

        <h2 className="font-heading text-3xl md:text-4xl text-white font-semibold mb-4">
          Curated Decor Ideas, Delivered Weekly
        </h2>

        <p className="font-body text-base text-white/70 mb-10 leading-relaxed">
          Subscribe for seasonal inspiration, exclusive member discounts up to 20% off,
          and first access to new artisan collections.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto shadow-lg">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            aria-label="Email address for newsletter"
            className="flex-1 px-5 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-gold text-dark px-6 py-4 font-body text-xs tracking-widest uppercase hover:bg-gold-light transition-colors flex items-center justify-center gap-2 group flex-shrink-0"
          >
            {submitting ? 'Joining...' : (
              <>
                Subscribe
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <p className="font-body text-xs text-white/40 mt-4">
          No spam, ever. Unsubscribe any time.
        </p>
      </div>
    </section>
  )
}

export default NewsletterSection
