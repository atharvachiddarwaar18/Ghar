'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-center px-6">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-brown/50 mb-4">404 — Page Not Found</p>
      <h1 className="font-heading text-5xl font-semibold text-dark mb-6">Oops!</h1>
      <p className="font-body text-textbrown/70 mb-8 max-w-sm">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">Back to Home</Link>
    </div>
  )
}
