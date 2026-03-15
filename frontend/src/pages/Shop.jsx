import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { API_URL, formatPrice, CATEGORIES } from '../utils/products'
import { getImageUrl } from '../utils/images'

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'new', label: 'New Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
]

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
  { label: '₹3,000 – ₹6,000', min: 3000, max: 6000 },
  { label: 'Above ₹6,000', min: 6000, max: Infinity },
]

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileFilters, setMobileFilters] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  let activeCategory = searchParams.get('category') || 'All'
  if (activeCategory.toLowerCase() === 'all') activeCategory = 'All'
  const activeSort = searchParams.get('sort') || 'popular'
  const activePriceIdx = Number(searchParams.get('price') || 0)

  useEffect(() => {
    document.title = 'Shop All — Ghar Sajaoo'
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/products?limit=100`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      
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

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value === 'All' || !value) p.delete(key)
    else p.set(key, value)
    setSearchParams(p)
  }

  const filtered = useMemo(() => {
    let list = [...products]

    // Category filter
    if (activeCategory && activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }

    // Price filter
    const range = PRICE_RANGES[activePriceIdx]
    if (range) {
      list = list.filter(p => p.price >= range.min && p.price <= range.max)
    }

    // Sort
    switch (activeSort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'new': list.sort((a, b) => b.id - a.id); break
      default: list.sort((a, b) => b.reviewCount - a.reviewCount) // popular
    }

    return list
  }, [products, activeCategory, searchQuery, activePriceIdx, activeSort])

  const FilterPanel = () => (
    <aside className="space-y-8">
      {/* Category */}
      <div>
        <h3 className="font-heading text-sm font-semibold text-dark uppercase tracking-widest mb-4">
          Category
        </h3>
        <ul className="space-y-2">
          {CATEGORIES.map(cat => (
            <li key={cat}>
              <button
                onClick={() => setParam('category', cat)}
                className={`w-full text-left font-body text-sm py-1.5 px-3 transition-colors ${
                  activeCategory === cat
                    ? 'bg-brown text-white'
                    : 'text-textbrown hover:text-brown hover:bg-cream-dark'
                }`}
              >
                {cat}
                <span className="float-right text-xs opacity-60">
                  {cat === 'All'
                    ? products.length
                    : products.filter(p => p.category === cat).length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-heading text-sm font-semibold text-dark uppercase tracking-widest mb-4">
          Price Range
        </h3>
        <ul className="space-y-2">
          {PRICE_RANGES.map((range, idx) => (
            <li key={range.label}>
              <button
                onClick={() => setParam('price', idx === 0 ? null : idx)}
                className={`w-full text-left font-body text-sm py-1.5 px-3 transition-colors ${
                  activePriceIdx === idx
                    ? 'bg-brown text-white'
                    : 'text-textbrown hover:text-brown hover:bg-cream-dark'
                }`}
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Reset */}
      {(activeCategory !== 'All' || activePriceIdx !== 0) && (
        <button
          onClick={() => setSearchParams({})}
          className="flex items-center gap-2 font-body text-xs text-textbrown/60 hover:text-red-500 transition-colors"
        >
          <X size={12} /> Clear All Filters
        </button>
      )}
    </aside>
  )

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Page Header */}
      <div className="bg-softgray border-b border-gold/20 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="section-subtitle">Handcrafted Collection</p>
          <h1 className="section-title mt-2">
            {activeCategory === 'All' ? 'All Products' : activeCategory}
          </h1>
          <p className="font-body text-sm text-textbrown/60 mt-2">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0 pt-2">
            <FilterPanel />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textbrown/40" />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                  aria-label="Search products"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={activeSort}
                  onChange={e => setParam('sort', e.target.value)}
                  className="input-field pr-10 appearance-none min-w-[180px] cursor-pointer"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-textbrown/40 pointer-events-none" />
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilters(true)}
                className="lg:hidden btn-secondary flex items-center gap-2 justify-center"
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>
            </div>

            {/* Active filter pills */}
            {(activeCategory !== 'All' || activePriceIdx !== 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeCategory !== 'All' && (
                  <span className="flex items-center gap-2 bg-brown/10 text-brown text-xs px-3 py-1.5 font-body">
                    {activeCategory}
                    <button onClick={() => setParam('category', null)} aria-label="Remove category filter">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {activePriceIdx !== 0 && (
                  <span className="flex items-center gap-2 bg-brown/10 text-brown text-xs px-3 py-1.5 font-body">
                    {PRICE_RANGES[activePriceIdx].label}
                    <button onClick={() => setParam('price', null)} aria-label="Remove price filter">
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-cream-dark animate-pulse" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="font-heading text-xl text-dark mb-2">No products found</h3>
                <p className="font-body text-sm text-textbrown/60 mb-6">
                  Try adjusting your filters or search term.
                </p>
                <button onClick={() => { setSearchParams({}); setSearchQuery('') }} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilters && (
        <>
          <div className="fixed inset-0 bg-dark/50 z-50" onClick={() => setMobileFilters(false)} />
          <div className="fixed left-0 top-0 h-full w-72 bg-cream z-50 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-lg text-dark">Filters</h2>
              <button onClick={() => setMobileFilters(false)}><X size={20} /></button>
            </div>
            <FilterPanel />
          </div>
        </>
      )}
    </div>
  )
}

export default Shop
