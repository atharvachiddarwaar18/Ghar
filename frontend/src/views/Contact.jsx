'use client'
import React, { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { document.title = 'Contact Us — Ghar Sajaoo' }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      toast.success('Message sent! We\'ll respond within 24 hours.')
      setForm({ name: '', email: '', subject: '', message: '' })
      setSubmitting(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="bg-softgray border-b border-gold/20 py-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p className="section-subtitle">We're Here to Help</p>
          <h1 className="section-title mt-2">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12">

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-xl text-dark font-semibold mb-6">Get in Touch</h2>
            <p className="font-body text-sm text-textbrown/70 mb-8 leading-relaxed">
              Our team of artisan experts is ready to assist you with orders, styling advice, or any queries about our products.
            </p>

            <div className="space-y-6">
              {[
                { Icon: Mail, label: 'Email Us', value: 'gharsajaoo@gmail.com', href: 'mailto:gharsajaoo@gmail.com' },
                { Icon: Phone, label: 'Call Us', value: '+91 80808 47596', href: 'tel:+918080847596' },
                { Icon: MapPin, label: 'Our Office', value: 'New Delhi – 110001, India' },
                { Icon: Clock, label: 'Support Hours', value: 'Mon–Sat, 10:00 AM – 6:00 PM IST' },
              ].map(({ Icon, label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-10 h-10 bg-brown/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-brown" />
                  </div>
                  <div>
                    <p className="font-body text-xs uppercase tracking-wider text-textbrown/50 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="font-body text-sm text-dark hover:text-brown transition-colors">{value}</a>
                    ) : (
                      <p className="font-body text-sm text-dark">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-card p-8">
              <h2 className="font-heading text-xl text-dark font-semibold mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-body text-xs uppercase tracking-wider text-textbrown/60 mb-1.5">Your Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="input-field" required />
                  </div>
                  <div>
                    <label className="block font-body text-xs uppercase tracking-wider text-textbrown/60 mb-1.5">Email Address *</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} className="input-field" required />
                  </div>
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-wider text-textbrown/60 mb-1.5">Subject *</label>
                  <select value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} className="input-field" required>
                    <option value="">Select a topic...</option>
                    <option value="order">Order Status / Tracking</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="product">Product Query</option>
                    <option value="payment">Payment Issue</option>
                    <option value="custom">Custom Orders</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-wider text-textbrown/60 mb-1.5">Message *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({...p, message: e.target.value}))}
                    placeholder="Tell us how we can help..."
                    className="input-field resize-none"
                    required
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                  {submitting ? 'Sending...' : (<><Send size={14} /> Send Message</>)}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ quick links */}
        <div className="mt-16 bg-softgray p-8">
          <h3 className="font-heading text-lg text-dark font-semibold mb-5">Frequently Asked Questions</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ['When will my order arrive?', 'Standard delivery takes 5–7 business days. Check Shipping Policy for details.'],
              ['Can I return a product?', 'Yes, within 7 days of delivery. See our Returns Policy for full details.'],
              ['Do you ship outside India?', 'Currently, we ship only within India. International shipping coming soon!'],
              ['Are the products handmade?', 'Yes, every product is handcrafted by our partner artisans. Natural variations are intentional.'],
            ].map(([q, a]) => (
              <div key={q} className="bg-white p-5 shadow-sm">
                <p className="font-heading text-sm font-semibold text-dark mb-1">{q}</p>
                <p className="font-body text-xs text-textbrown/70 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
