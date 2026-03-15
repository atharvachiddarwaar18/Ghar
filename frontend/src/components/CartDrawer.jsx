import React from 'react'
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/products'

const CartDrawer = () => {
  const { items, isOpen, closeDrawer, updateQuantity, removeItem, totalPrice, totalItems } = useCart()

  const shipping = totalPrice > 999 ? 0 : 99
  const orderTotal = totalPrice + shipping

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-dark/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-cream z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingCart size={20} className="text-brown" />
            <h2 className="font-heading text-lg font-semibold text-dark">
              Your Cart
            </h2>
            {totalItems > 0 && (
              <span className="bg-brown text-white text-xs px-2 py-0.5 font-body">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="text-textbrown hover:text-brown transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingCart size={48} className="text-gold/40 mb-4" />
              <h3 className="font-heading text-xl text-dark mb-2">Your cart is empty</h3>
              <p className="font-body text-sm text-textbrown/60 mb-8">
                Discover our handcrafted pieces and fill your home with artisanal beauty.
              </p>
              <button
                onClick={closeDrawer}
                className="btn-primary"
              >
                <Link to="/shop">Shop Now</Link>
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(item => (
                <li key={item.id} className="flex gap-4 py-4 border-b border-gold/10">
                  {/* Product image */}
                  <div className="w-20 h-24 bg-softgray flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl">🏺</div>'
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-sm font-medium text-dark leading-snug line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <p className="font-body text-sm font-bold text-brown mb-3">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gold/30">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center text-textbrown hover:text-brown hover:bg-cream-dark transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center font-body text-sm text-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center text-textbrown hover:text-brown hover:bg-cream-dark transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="text-textbrown/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with totals and checkout */}
        {items.length > 0 && (
          <div className="border-t border-gold/20 px-6 py-6 flex-shrink-0 bg-white">
            {/* Shipping note */}
            {shipping === 0 ? (
              <p className="font-body text-xs text-green-700 bg-green-50 px-3 py-2 mb-4 text-center tracking-wide">
                🎉 You qualify for FREE shipping!
              </p>
            ) : (
              <p className="font-body text-xs text-textbrown/60 text-center mb-4">
                Add {formatPrice(999 - totalPrice)} more for free shipping
              </p>
            )}

            {/* Price breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between font-body text-sm text-textbrown">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-textbrown">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-body text-base font-bold text-dark pt-2 border-t border-gold/20">
                <span>Total</span>
                <span className="text-brown tracking-tight">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/checkout"
              onClick={closeDrawer}
              className="flex items-center justify-center gap-2 w-full bg-brown text-white py-4 font-body text-xs tracking-widest uppercase hover:bg-brown-dark transition-colors group"
            >
              Proceed to Checkout
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/shop"
              onClick={closeDrawer}
              className="block text-center font-body text-xs tracking-wider text-textbrown/60 hover:text-brown transition-colors mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
