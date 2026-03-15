'use client'

import Navbar from '@/src/components/Navbar'
import CartDrawer from '@/src/components/CartDrawer'
import Footer from '@/src/components/Footer'

/**
 * Layout for all storefront routes (shop, product, checkout, profile, etc.)
 * Renders the Navbar, CartDrawer, and Footer.
 */
export default function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <div className="min-h-screen">
        {children}
      </div>
      <Footer />
    </>
  )
}
