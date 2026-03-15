'use client'
import Link from 'next/link';
import React from 'react'


const NotFound = () => (
  <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
    <p className="text-8xl mb-6">🏺</p>
    <h1 className="font-heading text-6xl font-bold text-brown mb-3">404</h1>
    <h2 className="font-heading text-2xl text-dark mb-4">Page Not Found</h2>
    <p className="font-body text-sm text-textbrown/60 max-w-sm mb-10 leading-relaxed">
      Looks like this page wandered off on its own artisan journey. Let's get you back home.
    </p>
    <div className="flex gap-4">
      <Link href="/" className="btn-primary">Go Home</Link>
      <Link href="/shop" className="btn-secondary">Browse Products</Link>
    </div>
  </div>
)

export default NotFound
