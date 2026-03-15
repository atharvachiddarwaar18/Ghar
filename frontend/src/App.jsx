'use client'
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import { useCart } from './context/CartContext'
import { MOCK_PRODUCTS, formatPrice, getDiscount } from './utils/products'
import toast from 'react-hot-toast'

// Pages
import Home          from './pages/Home'
import Shop          from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Checkout      from './pages/Checkout'
import Profile       from './pages/Profile'
import About         from './pages/About'
import Contact       from './pages/Contact'
import Legal         from './pages/Legal'
import Login         from './pages/Login'
import Admin         from './pages/Admin'
import Wishlist      from './pages/Wishlist'
import AuthCallback  from './pages/AuthCallback'
import NotFound      from './pages/NotFound'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'

// ProductDetail moved to pages/ProductDetail.jsx

/* ────────────────────────────────────────────────────
   ScrollToTop — fires on every route change
──────────────────────────────────────────────────── */
const ScrollToTop = () => {
  const { pathname } = { pathname: usePathname() || "", search: useSearchParams()?.toString() || "" }
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

/* ────────────────────────────────────────────────────
   MainLayout — Navbar + CartDrawer + Footer shell
──────────────────────────────────────────────────── */
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <CartDrawer />
    <div className="min-h-screen">{children}</div>
    <Footer />
  </>
)

/* ────────────────────────────────────────────────────
   App — root with React Router v6 config
──────────────────────────────────────────────────── */
const App = () => {
  const location = { pathname: usePathname() || "", search: useSearchParams()?.toString() || "" }
  const { pathname } = location

  const isBare = pathname.startsWith('/login')
    || pathname.startsWith('/admin')
    || pathname.startsWith('/auth')

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        {isBare ? (
          <Routes location={location} key={location.pathname + location.search}>
            <Route path="/login"         element={<PageTransition><Login /></PageTransition>} />
            <Route path="/admin"         element={<PageTransition><Admin /></PageTransition>} />
            <Route path="/auth/callback" element={<PageTransition><AuthCallback /></PageTransition>} />
            <Route path="*"              element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        ) : (
          <MainLayout>
            <Routes location={location} key={location.pathname + location.search}>
              <Route path="/"              element={<PageTransition><Home /></PageTransition>} />
              <Route path="/shop"          element={<PageTransition><Shop /></PageTransition>} />
              <Route path="/catalog"       element={<PageTransition><Shop /></PageTransition>} />
              <Route path="/collections"   element={<PageTransition><Shop /></PageTransition>} />
              <Route path="/product/:slug" element={<PageTransition><ProductDetail /></PageTransition>} />
              <Route path="/checkout"      element={<PageTransition><Checkout /></PageTransition>} />
              <Route path="/profile"       element={<PageTransition><Profile /></PageTransition>} />
              <Route path="/wishlist"      element={<PageTransition><Wishlist /></PageTransition>} />
              <Route path="/about"         element={<PageTransition><About /></PageTransition>} />
              <Route path="/contact"       element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/legal"         element={<PageTransition><Legal /></PageTransition>} />
              <Route path="*"              element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </MainLayout>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
