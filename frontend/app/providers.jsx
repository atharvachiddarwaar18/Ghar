'use client'

import React from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/src/context/AuthContext'
import { CartProvider } from '@/src/context/CartContext'
import { WishlistProvider } from '@/src/context/WishlistContext'
import Navbar from '@/src/components/Navbar'
import Footer from '@/src/components/Footer'
import CartDrawer from '@/src/components/CartDrawer'

/**
 * Client-side Providers wrapper.
 * All context providers + global UI (Navbar, CartDrawer, Footer, Toaster).
 * Navbar/Footer are NOT rendered on login/admin pages — those use bare layouts.
 */
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#FBF7F0',
                color: '#4A3728',
                border: '1px solid #D4A574',
                borderRadius: '0',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#8B4513', secondary: '#FBF7F0' },
              },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
