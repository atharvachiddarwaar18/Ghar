import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import ProductCard from './ProductCard'
import { formatPrice } from '../utils/products'

/**
 * ProductCarousel — infinite auto-scroll carousel (left → right)
 * Duplicates items for seamless looping via CSS animation.
 * Hover pauses the scroll.
 */
const ProductCarousel = ({ products = [], title, subtitle, ctaLink = '/shop' }) => {
  const trackRef = useRef(null)

  // Duplicate items for seamless infinite scroll
  const doubled = [...products, ...products]

  return (
    <section className="py-20 overflow-hidden" aria-label={title}>
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {subtitle && (
            <p className="section-subtitle">{subtitle}</p>
          )}
          <h2 className="section-title mt-2">{title}</h2>
          <div className="w-14 h-0.5 bg-gold mt-4" />
        </div>
        <Link
          to={ctaLink}
          className="font-body text-xs tracking-widest uppercase text-brown border-b border-brown pb-0.5 hover:text-amber hover:border-amber transition-colors self-start sm:self-auto flex-shrink-0"
        >
          View All →
        </Link>
      </div>

      {/* Carousel Track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div
          ref={trackRef}
          className="carousel-track"
          style={{ willChange: 'transform' }}
          aria-label="Scrolling product showcase"
        >
          {doubled.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 w-[260px] sm:w-[280px] mx-3"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductCarousel
