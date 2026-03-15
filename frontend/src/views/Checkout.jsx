'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

import { ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/products'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
const API_URL = ''

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useRouter()

  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const shipping = totalPrice > 999 ? 0 : 99
  const total = totalPrice + shipping

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode']
    for (const field of required) {
      if (!form[field].trim()) {
        toast.error(`Please fill in ${field.charAt(0).toUpperCase() + field.slice(1)}`)
        return false
      }
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Please enter a valid 10-digit phone number')
      return false
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error('Please enter a valid 6-digit pincode')
      return false
    }
    return true
  }

  const initiatePayment = async () => {
    if (!validateForm()) return
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      // Step 1: Create Razorpay order via backend
      const res = await fetch(`${API_URL}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, currency: 'INR' }),
      })
      const orderData = await res.json()

      if (!orderData.id) throw new Error('Failed to create payment order')

      // Step 2: Open Razorpay modal
      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Ghar Sajaoo',
        description: `Order for ${items.length} item(s)`,
        image: '/images/logo.png',
        order_id: orderData.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
        },
        theme: { color: '#8B4513' },
        modal: { ondismiss: () => setLoading(false) },

        handler: async (response) => {
          try {
            // Step 3: Verify payment on backend
            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items,
                total,
                shipping_address: form,
                user_id: user?.id || null,
              }),
            })
            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              clearCart()
              setOrderId(verifyData.orderId)
              setOrderSuccess(true)
              toast.success('🎉 Order placed successfully!')
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (err) {
            toast.error('Payment verification failed. Please contact support.')
            setLoading(false)
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`)
        setLoading(false)
      })
      rzp.open()

    } catch (err) {
      console.error(err)
      toast.error('Failed to initiate payment. Please try again.')
      setLoading(false)
    }
  }

  // ── Order Success State ────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full text-center py-16">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h1 className="font-heading text-3xl text-dark mb-3">Order Confirmed!</h1>
          <p className="font-body text-textbrown/70 mb-2">
            Thank you for your purchase, {form.name.split(' ')[0]}!
          </p>
          {orderId && (
            <p className="font-body text-xs text-textbrown/50 mb-8">
              Order ID: <span className="font-mono text-brown">{orderId}</span>
            </p>
          )}
          <p className="font-body text-sm text-textbrown/60 mb-10 leading-relaxed">
            Your order will be shipped to {form.address}, {form.city} within 5–7 business days.
            You'll receive a confirmation email at {form.email}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/shop')} className="btn-primary">
              Continue Shopping
            </button>
            {user && (
              <button onClick={() => navigate('/profile')} className="btn-secondary">
                Track Order
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Empty Cart ─────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center pt-20 px-6">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="font-heading text-2xl text-dark mb-2">Your cart is empty</h2>
        <p className="font-body text-sm text-textbrown/60 mb-6">Add some items before checking out.</p>
        <button onClick={() => navigate('/shop')} className="btn-primary">Browse Products</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-body text-sm text-textbrown/60 hover:text-brown transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Cart
        </button>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Left: Shipping Form ─────────────────── */}
          <div className="flex-1">
            <h1 className="font-heading text-2xl text-dark mb-8">Shipping Details</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { name: 'name', label: 'Full Name', type: 'text', colSpan: 2 },
                { name: 'email', label: 'Email Address', type: 'email' },
                { name: 'phone', label: 'Phone Number', type: 'tel' },
                { name: 'address', label: 'Street Address', type: 'text', colSpan: 2 },
                { name: 'city', label: 'City', type: 'text' },
                { name: 'state', label: 'State', type: 'text' },
                { name: 'pincode', label: 'PIN Code', type: 'text' },
              ].map(field => (
                <div key={field.name} className={field.colSpan === 2 ? 'sm:col-span-2' : ''}>
                  <label className="block font-body text-xs text-textbrown/70 uppercase tracking-wider mb-1.5">
                    {field.label} *
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="input-field"
                    required
                    aria-label={field.label}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-8 p-4 bg-green-50 border border-green-100">
              <ShieldCheck size={18} className="text-green-600 flex-shrink-0" />
              <p className="font-body text-xs text-green-700">
                Your payment is secured by Razorpay with 256-bit SSL encryption.
                We never store your card details.
              </p>
            </div>
          </div>

          {/* ── Right: Order Summary ────────────────── */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white shadow-card p-6 sticky top-24">
              <h2 className="font-heading text-lg text-dark mb-5">Order Summary</h2>

              <ul className="space-y-4 mb-5">
                {items.map(item => (
                  <li key={item.id} className="flex gap-3">
                    <div className="w-14 h-16 bg-softgray flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={e => e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center">🏺</div>'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-dark line-clamp-2">{item.name}</p>
                      <p className="font-body text-xs text-textbrown/50 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-body text-sm font-medium text-dark flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gold/20 pt-4 space-y-2">
                <div className="flex justify-between font-body text-sm text-textbrown">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-textbrown">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-heading text-base font-semibold text-dark pt-2 border-t border-gold/20">
                  <span>Total</span>
                  <span className="text-brown">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={initiatePayment}
                disabled={loading}
                className="w-full mt-6 bg-brown text-white py-4 font-body text-xs tracking-widest uppercase hover:bg-brown-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${formatPrice(total)} via Razorpay`
                )}
              </button>

              <p className="font-body text-xs text-textbrown/40 text-center mt-3">
                By placing the order, you agree to our Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
