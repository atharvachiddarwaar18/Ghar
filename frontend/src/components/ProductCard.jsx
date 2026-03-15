'use client'
import Link from 'next/link';
import React, { useState } from 'react'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'

import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatPrice, getDiscount } from '../utils/products'
import toast from 'react-hot-toast'

const ProductCard = ({ product, layout = 'grid' }) => {
  const [imgError, setImgError] = useState(false)
  const [adding, setAdding] = useState(false)
  const { addItem, openDrawer } = useCart()
  const { toggleItem, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  const discount = getDiscount(product.price, product.originalPrice)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
    })

    toast.success(`${product.name.substring(0, 30)}... added to cart`)

    setTimeout(() => {
      setAdding(false)
      openDrawer()
    }, 600)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({ id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug, category: product.category, badge: product.badge })
    toast(wishlisted ? '💔 Removed from wishlist' : '❤️ Added to wishlist!')
  }

  return (
    <div className="card-product group relative">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/5] bg-softgray">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10">
          <span className="sr-only">View product</span>
        </Link>
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-textbrown/20 p-6 bg-white/50">
            <span className="text-4xl mb-3">🏺</span>
            <p className="font-body text-[10px] uppercase tracking-widest mt-4 text-center">{product.name}</p>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-brown text-white text-xs font-body tracking-wider px-3 py-1">
            {product.badge}
          </span>
        )}

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-3 right-3 bg-amber text-white text-xs font-body font-medium px-2 py-1">
            -{discount}%
          </span>
        )}

        {/* Quick Actions (visible on hover) */}
        <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3 pointer-events-none z-20">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="bg-white text-brown hover:bg-brown hover:text-white px-5 py-2 font-body text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-2 shadow-lg pointer-events-auto"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={13} />
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>

          <Link
            href={`/product/${product.slug}`}
            className="bg-white/90 text-brown hover:bg-brown hover:text-white p-2 transition-all duration-200 shadow-lg pointer-events-auto"
            aria-label={`View ${product.name}`}
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 bg-white/90 p-1.5 transition-all duration-200 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 pointer-events-auto z-20"
          style={discount ? { top: '2.5rem' } : {}}
        >
          <Heart
            size={16}
            className={wishlisted ? 'fill-red-500 text-red-500' : 'text-textbrown'}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="font-body text-xs tracking-widest uppercase text-amber mb-1">
          {product.category}
        </p>

        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-heading text-base font-medium text-dark mb-2 leading-snug hover:text-brown transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={12}
                className={star <= Math.round(product.rating) ? 'star-filled' : 'star-empty'}
              />
            ))}
          </div>
          <span className="font-body text-[10px] tracking-wider text-textbrown/40 uppercase font-medium">
            {product.rating} / 5.0
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-body text-base font-bold text-brown tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-body text-sm text-textbrown/40 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="sm:hidden bg-brown text-white p-2 hover:bg-brown-dark transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
