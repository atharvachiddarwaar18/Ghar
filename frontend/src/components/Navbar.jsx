import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Search, Heart, LogOut } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { totalItems, openDrawer } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      setProfileOpen(false)
      navigate('/')
      toast.success('Signed out successfully')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const navLinks = [
    { label: 'Shop', to: '/shop' },
    { label: 'Collections', to: '/shop?category=all' },
    { label: 'Our Story', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ]

  const navBg = scrolled || !isHome
    ? 'bg-cream/95 backdrop-blur-md shadow-nav'
    : 'bg-transparent'

  const textColor = scrolled || !isHome ? 'text-dark' : 'text-white'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Ghar Sajaoo"
                className="h-10 w-auto object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="flex flex-col leading-none">
                <span className={`font-heading text-xl font-bold tracking-wide ${textColor}`}>
                  Ghar Sajaoo
                </span>
                <span className={`font-body text-xs tracking-widest uppercase opacity-70 ${textColor}`}>
                  Artisanal Living
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`font-body text-xs tracking-widest uppercase transition-colors duration-200 
                    ${textColor} hover:text-amber relative
                    after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px
                    after:bg-amber after:transition-all after:duration-300 hover:after:w-full`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                aria-label={`Wishlist (${wishlistCount} items)`}
                className={`hidden sm:flex items-center relative ${textColor} hover:text-amber transition-colors`}
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-body font-medium">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openDrawer}
                aria-label={`Cart (${totalItems} items)`}
                className={`relative ${textColor} hover:text-amber transition-colors`}
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brown text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-body font-medium">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => user ? setProfileOpen(!profileOpen) : navigate('/login')}
                  aria-label="Profile"
                  className={`${textColor} hover:text-amber transition-colors`}
                >
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-gold"
                    />
                  ) : (
                    <User size={22} />
                  )}
                </button>

                {/* Profile Dropdown */}
                {profileOpen && user && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white shadow-card-hover border border-gold/20 z-50">
                    <div className="p-4 border-b border-gold/20">
                      <p className="font-body text-sm font-medium text-dark truncate">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="font-body text-xs text-textbrown/60 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-sm font-body text-textbrown hover:bg-cream transition-colors"
                      >
                        My Profile & Orders
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm font-body text-textbrown hover:bg-cream transition-colors"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                className={`md:hidden ${textColor}`}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-cream border-t border-gold/20">
            <div className="px-6 py-4 space-y-4">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block font-body text-sm tracking-widest uppercase text-textbrown hover:text-brown transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block btn-primary text-center mt-4"
                >
                  Sign In
                </Link>
              ) : (
                <button onClick={handleSignOut} className="block btn-secondary w-full text-center mt-4">
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay to close dropdowns */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar
