'use client'

import Home from '@/src/views/Home'
import Navbar from '@/src/components/Navbar'
import CartDrawer from '@/src/components/CartDrawer'
import Footer from '@/src/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <div className="min-h-screen">
        <Home />
      </div>
      <Footer />
    </>
  )
}
