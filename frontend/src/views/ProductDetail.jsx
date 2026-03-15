'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'

import { useCart } from '../context/CartContext'
import { Truck, ShieldCheck, RefreshCw } from 'lucide-react'
import { API_URL, formatPrice, getDiscount } from '../utils/products'
import { getImageUrl } from '../utils/images'
import toast from 'react-hot-toast'

/* ────────────────────────────────────────────────────
   ProductDetail — /product/:slug
   Full product page with gallery, details, add-to-cart,
   quantity selector, features list, and related products.
──────────────────────────────────────────────────── */
const ProductDetail = () => {
  const { slug }                      = useParams()
  const navigate                      = useRouter()
  const { addItem, openDrawer }       = useCart()
  const [qty, setQty]                 = useState(1)
  const [added, setAdded]             = useState(false)
  const [imgError, setImgError]       = useState(false)
  const [product, setProduct]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [related, setRelated]         = useState([])

  useEffect(() => {
    fetchProductAndRelated()
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (product) document.title = `${product.name} — Ghar Sajaoo`
  }, [product])

  const fetchProductAndRelated = async () => {
    setLoading(true)
    try {
      // 1. Fetch main product
      const res = await fetch(`${API_URL}/api/products/${slug}`)
      if (!res.ok) throw new Error('Product not found')
      const data = await res.json()
      
      const formattedProduct = {
        ...data.product,
        image: getImageUrl(data.product.image_url)
      }
      setProduct(formattedProduct)

      // 2. Fetch related products in same category
      if (formattedProduct.category) {
        const relatedRes = await fetch(`${API_URL}/api/products?category=${encodeURIComponent(formattedProduct.category)}&limit=5`)
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json()
          const relatedFormatted = (relatedData.products || [])
            .filter(p => p.id !== formattedProduct.id)
            .slice(0, 4)
            .map(p => ({ ...p, image: getImageUrl(p.image_url) }))
          setRelated(relatedFormatted)
        }
      }
    } catch (err) {
      console.error('Error fetching product details:', err)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-brown border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-6xl">🔍</p>
        <h2 className="font-heading text-2xl text-dark">Product not found</h2>
        <p className="font-body text-sm text-textbrown/60 mb-4">
          This product may have been removed or the link is incorrect.
        </p>
        <button onClick={() => navigate('/shop')} className="btn-primary">
          Browse All Products
        </button>
      </div>
    )
  }

  const discount = getDiscount(product.price, product.originalPrice)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug })
    }
    setAdded(true)
    toast.success(`${qty} × ${product.name.substring(0, 28)}... added to cart 🛒`)
    setTimeout(() => { setAdded(false); openDrawer() }, 800)
  }

  const handleBuyNow = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug })
    navigate('/checkout')
  }
  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-body text-xs text-textbrown/50 mb-10 uppercase tracking-wider flex-wrap">
          <Link href="/" className="hover:text-brown transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brown transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brown transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-brown truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-14">

          {/* ── Image Panel ───────────────────────────────── */}
          <div className="space-y-4">
            <div className="aspect-square bg-softgray overflow-hidden relative">
              {!imgError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-textbrown/20">
                  <span className="text-8xl mb-3">🏺</span>
                  <p className="font-body text-sm text-center px-8">{product.name}</p>
                </div>
              )}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-brown text-white font-body text-xs tracking-wider px-3 py-1.5">
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 bg-amber text-white font-body text-xs font-semibold px-2.5 py-1.5">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Trust icons */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { Icon: Truck, title: 'Free Shipping', sub: 'Orders above ₹999' },
                { Icon: ShieldCheck, title: 'Secure Payment', sub: 'Razorpay encrypted' },
                { Icon: RefreshCw, title: 'Easy Returns', sub: '7-day policy' }
              ].map(({ Icon, title, sub }) => (
                <div key={title} className="bg-white p-3 text-center shadow-sm flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center mb-2">
                    <Icon size={20} className="text-brown" strokeWidth={1.5} />
                  </div>
                  <p className="font-body text-xs font-medium text-dark">{title}</p>
                  <p className="font-body text-xs text-textbrown/50">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Details Panel ─────────────────────────────── */}
          <div>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-amber mb-3">{product.category}</p>

            <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4 leading-snug">
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-base ${s <= Math.round(product.rating || 5) ? 'text-amber' : 'text-gold/30'}`}>★</span>
                ))}
              </div>
              <span className="font-body text-sm text-textbrown/60">
                {product.rating || 5.0} ({product.review_count || 0} verified reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-gold/20">
              <span className="font-body text-3xl font-bold text-brown tracking-tight">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="font-body text-xl text-textbrown/40 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {discount && (
                <span className="bg-amber/10 text-amber text-sm font-body font-semibold px-3 py-1">Save {discount}%</span>
              )}
            </div>

            <p className="font-body text-sm text-textbrown/80 leading-relaxed mb-6">{product.description}</p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <p className="font-heading text-xs font-semibold text-dark uppercase tracking-wider mb-3">Key Features</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  {product.features.map(f => (
                    <li key={f} className="flex items-center gap-2 font-body text-sm text-textbrown/80">
                      <span className="w-4 h-4 bg-brown/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-brown text-xs">✓</span>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock */}
            <div className="mb-6">
              {product.stock <= 10 ? (
                <p className="font-body text-xs text-red-600 bg-red-50 px-3 py-2 inline-block">
                  ⚠️ Only {product.stock} left — order soon!
                </p>
              ) : (
                <p className="font-body text-xs text-green-700 bg-green-50 px-3 py-2 inline-block">
                  ✓ In Stock ({product.stock} units available)
                </p>
              )}
            </div>

            {/* Qty selector */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-gold/40">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-11 h-11 flex items-center justify-center text-lg text-textbrown hover:text-brown hover:bg-cream-dark transition-colors" aria-label="Decrease">−</button>
                <span className="w-12 h-11 flex items-center justify-center font-body text-sm font-medium text-dark border-x border-gold/40">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="w-11 h-11 flex items-center justify-center text-lg text-textbrown hover:text-brown hover:bg-cream-dark transition-colors" aria-label="Increase">+</button>
              </div>
              <p className="font-body text-sm text-textbrown/60">
                Total: <span className="font-body text-brown font-bold">{formatPrice(product.price * qty)}</span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={added || product.stock === 0} className="flex-1 bg-brown text-white py-4 font-body text-xs tracking-widest uppercase hover:bg-brown-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {added ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0} className="flex-1 btn-gold py-4">
                Buy Now
              </button>
            </div>

            {/* Artisan note */}
            <div className="border border-gold/30 p-4 bg-cream-dark">
              <p className="font-body text-xs text-textbrown/70 leading-relaxed">
                <span className="font-semibold text-brown">🏺 Handcrafted with care.</span> Natural variations in colour, texture, and pattern are marks of authentic craftsmanship — not defects.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl text-dark font-semibold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group">
                  <div className="aspect-[4/5] bg-softgray overflow-hidden mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-3xl">🏺</div>' }} />
                  </div>
                  <p className="font-heading text-sm font-medium text-dark group-hover:text-brown transition-colors line-clamp-2">{p.name}</p>
                  <p className="font-body text-sm font-bold text-brown mt-1">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
