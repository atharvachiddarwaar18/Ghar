import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Image, Palette, Flower2, Lightbulb, Scissors } from 'lucide-react'
import HeroBanner from '../components/HeroBanner'
import ProductCarousel from '../components/ProductCarousel'
import ReviewSection from '../components/ReviewSection'
import WhyChooseUs from '../components/WhyChooseUs'
import NewsletterSection from '../components/NewsletterSection'
import ProductCard from '../components/ProductCard'
import { API_URL, formatPrice } from '../utils/products'
import { getImageUrl } from '../utils/images'

const CATEGORIES = [
  { name: 'Wall Decor', icon: Image, query: 'Wall+Decor', bg: 'from-amber/20 to-amber/5' },
  { name: 'Canvas Art', icon: Palette, query: 'Canvas+Art', bg: 'from-brown/20 to-brown/5' },
  { name: 'Vases', icon: Flower2, query: 'Vases', bg: 'from-gold/20 to-gold/5' },
  { name: 'Lighting', icon: Lightbulb, query: 'Lighting', bg: 'from-amber/20 to-amber/5' },
  { name: 'Textiles', icon: Scissors, query: 'Textiles', bg: 'from-amber/15 to-amber/5' },
]

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Ghar Sajaoo | Modern Elegance, Indian Soul'
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products?limit=20`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      // format images
      const formatted = (data.products || []).map(p => ({
        ...p,
        image: getImageUrl(p.image_url)
      }))
      setProducts(formatted)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const topRated = products.filter(p => p.rating >= 4.8)
  const wallDecor = products.filter(p => p.category === 'Wall Decor')
  const vases = products.filter(p => p.category === 'Vases')

  return (
    <main>
      {/* ── 1. Hero ──────────────────────────────────── */}
      <HeroBanner />

      {/* ── 2. Announcement Bar ─────────────────────── */}
      <div className="bg-brown text-white py-2.5 text-center overflow-hidden">
        <p className="font-body text-xs tracking-[0.2em] uppercase animate-pulse">
          🎉 Free Shipping on Orders above ₹999 &nbsp;·&nbsp; New Arrivals Every Week &nbsp;·&nbsp; Handcrafted by Indian Artisans
        </p>
      </div>

      {/* ── 3. Category Tiles ────────────────────────── */}
      <section className="py-20 bg-cream" aria-label="Shop by category">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Explore</p>
            <h2 className="section-title mt-2">Shop by Category</h2>
            <div className="divider" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/shop?category=${cat.query}`}
                className={`flex flex-col items-center gap-4 py-8 px-4 bg-gradient-to-b ${cat.bg} border border-gold/20 hover:border-brown/40 hover:shadow-card-hover transition-all duration-300 group`}
              >
                <div className="w-12 h-12 bg-white/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-300 shadow-sm">
                  <cat.icon size={24} className="text-brown group-hover:text-amber transition-colors" />
                </div>
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-textbrown group-hover:text-brown transition-colors text-center font-medium">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Top Rated Products Carousel ───────────── */}
      <div className="bg-softgray">
        {loading ? (
          <div className="py-24 flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-brown border-t-transparent animate-spin" /></div>
        ) : (
          <ProductCarousel
            products={topRated.length >= 3 ? topRated : products}
            title="Top Rated Products"
            subtitle="Customer Favourites"
            ctaLink="/shop?sort=popular"
          />
        )}
      </div>

      {/* ── 5. Heritage Band ─────────────────────────── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1C0A00 0%, #4A3728 100%)' }}
        aria-label="Heritage section"
      >
        <div className="absolute inset-0 bg-grain opacity-30" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <Sparkles size={28} className="text-gold mx-auto mb-4" />
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold/70 mb-4">Our Heritage</p>
          <h2 className="font-heading text-3xl md:text-5xl text-white font-semibold mb-6 leading-tight">
            Preserving the Soul of<br />
            <span className="italic text-gold">Indian Craftsmanship</span>
          </h2>
          <p className="font-body text-base text-white/70 max-w-2xl mx-auto leading-relaxed mb-10">
            For generations, our artisans have mastered the dance of thread and clay.
            Ghar Sajaoo was born from a passion to bring these timeless traditions
            into the modern home — ensuring every piece tells a story of heritage,
            culture, and unparalleled skill.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-10">
            {[['500+', 'Local Artisans'], ['24', 'Craft Forms'], ['12K+', 'Happy Homes']].map(([num, label]) => (
              <div key={label}>
                <p className="font-heading text-3xl font-bold text-gold">{num}</p>
                <p className="font-body text-xs text-white/50 uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
          <Link to="/about" className="btn-gold inline-flex items-center gap-2 group">
            Read Our Story
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ── 6. Wall Decor Featured ───────────────────── */}
      <section className="py-20 bg-cream" aria-label="Wall decor collection">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <p className="section-subtitle">Highlight</p>
              <h2 className="section-title mt-2">Wall Decor & Art</h2>
              <p className="font-body text-sm text-textbrown/70 mt-2 max-w-sm">
                Elevate your spaces with illuminated stories and premium canvases.
              </p>
              <div className="w-14 h-0.5 bg-gold mt-4" />
            </div>
            <Link to="/shop?category=Wall+Decor" className="btn-secondary mt-6 sm:mt-0 self-start sm:self-auto">
              View All Wall Decor
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="aspect-[4/5] bg-cream-dark animate-pulse" />)
            ) : (
              wallDecor.slice(0, 4).concat(products.filter(p => p.category === 'Canvas Art').slice(0, 2))
                .slice(0, 4)
                .map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
            )}
          </div>
        </div>
      </section>

      {/* ── 7. Designer Vases ────────────────────────── */}
      <section className="py-20 bg-softgray" aria-label="Designer vases">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Sculptural Beauty</p>
            <h2 className="section-title mt-2">Designer Vases</h2>
            <p className="font-body text-sm text-textbrown/70 mt-3 max-w-md mx-auto">
              Elegant marble, glass, and stone vases crafted to bring natural beauty to your space.
            </p>
            <div className="divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {loading ? (
              Array(3).fill(0).map((_, i) => <div key={i} className="aspect-[4/5] bg-cream animate-pulse" />)
            ) : (
              vases.slice(0, 6).map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop?category=Vases" className="btn-primary">
              Shop All Vases
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. All Products Preview ───────────────────── */}
      <div className="bg-cream">
        {!loading && (
          <ProductCarousel
            products={products.filter(p => p.category !== 'Wall Decor' && p.category !== 'Vases')}
            title="More to Love"
            subtitle="Trending Now"
            ctaLink="/shop"
          />
        )}
      </div>

      {/* ── 9. Why Choose Us ─────────────────────────── */}
      <WhyChooseUs />

      {/* ── 10. Reviews ──────────────────────────────── */}
      <ReviewSection />

      {/* ── 11. Newsletter ───────────────────────────── */}
      <NewsletterSection />
    </main>
  )
}

export default Home
