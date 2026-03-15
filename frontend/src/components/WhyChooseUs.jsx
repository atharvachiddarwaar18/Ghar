import React from 'react'
import { Truck, ShieldCheck, RefreshCw, Headphones, Award, Leaf } from 'lucide-react'

const FEATURES = [
  {
    icon: Truck,
    title: 'Free Shipping',
    desc: 'On all orders above ₹999. Delivered within 5–7 business days across India.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    desc: '100% secure checkout via Razorpay. UPI, Cards, NetBanking all accepted.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    desc: '7-day hassle-free return policy. No questions asked on damaged items.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    desc: 'Our artisan experts are available Mon–Sat, 10am–6pm to assist you.',
  },
  {
    icon: Award,
    title: 'Certified Artisans',
    desc: 'Every product is handcrafted by certified artisans from across India.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    desc: 'Sustainably sourced materials. All packaging is 100% recyclable.',
  },
]

const WhyChooseUs = () => (
  <section className="py-20 bg-cream" aria-label="Why choose us">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">

      {/* Header */}
      <div className="text-center mb-14">
        <p className="section-subtitle">The Ghar Sajaoo Promise</p>
        <h2 className="section-title mt-2">Why Thousands Choose Us</h2>
        <div className="divider" />
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex gap-5 p-6 bg-white shadow-card hover:shadow-card-hover transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-cream-dark flex items-center justify-center flex-shrink-0 group-hover:bg-brown/10 transition-colors">
              <Icon size={22} className="text-brown" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-dark mb-1">{title}</h3>
              <p className="font-body text-sm text-textbrown/70 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default WhyChooseUs
