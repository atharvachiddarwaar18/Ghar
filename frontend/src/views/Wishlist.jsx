'use client'
import Link from 'next/link';
import React from 'react'

import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react'
import { formatPrice } from '../utils/products'
import toast from 'react-hot-toast'
import { getImageUrl } from '../utils/images'

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem, openDrawer } = useCart()

  React.useEffect(() => {
    document.title = 'Wishlist — Ghar Sajaoo'
  }, [])

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
    })
    toast.success(`${product.name.substring(0, 28)}... added to cart!`)
    openDrawer()
  }

  const handleRemove = (id, name) => {
    removeItem(id)
    toast('💔 Removed from wishlist', { icon: null })
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-body text-sm text-textbrown/60 hover:text-brown transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <p className="section-subtitle">Your</p>
              <h1 className="section-title mt-1 flex items-center gap-3">
                <Heart size={28} className="text-rose-400 fill-rose-400" />
                Wishlist
              </h1>
              <p className="font-body text-sm text-textbrown/60 mt-2">
                {items.length === 0 ? 'No saved items yet' : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved`}
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={() => {
                  clearWishlist()
                  toast('Wishlist cleared')
                }}
                className="flex items-center gap-2 font-body text-xs text-textbrown/50 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
              <Heart size={36} className="text-rose-300" />
            </div>
            <h2 className="font-heading text-2xl text-dark mb-3">Your wishlist is empty</h2>
            <p className="font-body text-textbrown/60 mb-8 max-w-xs mx-auto">
              Save products you love by clicking the heart icon on any product.
            </p>
            <Link href="/shop" className="btn-primary">
              Explore Collection
            </Link>
          </div>
        )}

        {/* Wishlist Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(product => (
              <WishlistCard
                key={product.id}
                product={product}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const WishlistCard = ({ product, onRemove, onAddToCart }) => {
  const [imgError, setImgError] = React.useState(false)
  const imgSrc = imgError
    ? 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80'
    : (product.image || getImageUrl(product.image_url) || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80')

  return (
    <div className="bg-white border border-gold/20 shadow-card hover:shadow-card-hover transition-all duration-300 group">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden aspect-square">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-brown text-white text-xs font-body px-2 py-1">
            {product.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); onRemove(product.id, product.name) }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-rose-50 flex items-center justify-center transition-colors"
          aria-label="Remove from wishlist"
        >
          <Heart size={14} className="text-rose-500 fill-rose-500" />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="font-body text-xs text-amber uppercase tracking-widest mb-1">{product.category}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-heading text-base text-dark leading-snug hover:text-brown transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="font-heading text-lg font-semibold text-brown mb-4">
          {formatPrice(product.price)}
        </p>
        <button
          onClick={() => onAddToCart(product)}
          className="w-full flex items-center justify-center gap-2 btn-primary text-sm py-2"
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default Wishlist
