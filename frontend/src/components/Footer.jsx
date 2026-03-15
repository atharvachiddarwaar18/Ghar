'use client'
import Link from 'next/link';
import React from 'react'

import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white/80" aria-label="Site footer">

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/images/logo.png"
                alt="Ghar Sajaoo"
                className="h-10 w-auto object-contain"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div>
                <p className="font-heading text-white text-lg font-bold">Ghar Sajaoo</p>
                <p className="font-body text-xs text-gold/70 tracking-widest uppercase">Artisanal Living</p>
              </div>
            </div>
            <p className="font-body text-sm text-white/50 leading-relaxed mb-6">
              Bringing the soul of Indian craftsmanship into the modern home.
              Every piece tells a story of heritage, culture, and artisan skill.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-white text-sm font-semibold tracking-widest uppercase mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'New Arrivals', to: '/shop?sort=new' },
                { label: 'Best Sellers', to: '/shop?sort=popular' },
                { label: 'Wall Decor', to: '/shop?category=Wall+Decor' },
                { label: 'Vases & Planters', to: '/shop?category=Vases' },
                { label: 'Festive Decor', to: '/shop?category=Festive' },
                { label: 'Gift Ideas', to: '/shop?tag=gift' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    href={to}
                    className="font-body text-sm text-white/50 hover:text-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-heading text-white text-sm font-semibold tracking-widest uppercase mb-5">
              Customer Care
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Track Your Order', to: '/profile' },
                { label: 'Shipping Policy', to: '/legal?tab=shipping' },
                { label: 'Returns & Exchanges', to: '/legal?tab=returns' },
                { label: 'Care Instructions', to: '/legal?tab=care' },
                { label: 'FAQ', to: '/contact' },
                { label: 'Contact Us', to: '/contact' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    href={to}
                    className="font-body text-sm text-white/50 hover:text-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-white text-sm font-semibold tracking-widest uppercase mb-5">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={16} className="text-gold flex-shrink-0 mt-0.5" />
                <span className="font-body text-sm text-white/50 leading-relaxed">
                  Ghar Sajaoo Prints Limited<br />
                  New Delhi – 110001, India
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <a href="tel:+918080847596" className="font-body text-sm text-white/50 hover:text-gold transition-colors">
                  +91 80808 47596
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <a href="mailto:gharsajaoo@gmail.com" className="font-body text-sm text-white/50 hover:text-gold transition-colors">
                  gharsajaoo@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 border border-white/10">
              <p className="font-body text-xs text-white/40 uppercase tracking-wider mb-1">Support Hours</p>
              <p className="font-body text-sm text-white/60">Monday – Saturday</p>
              <p className="font-body text-sm text-white/60">10:00 AM – 6:00 PM IST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/30 text-center sm:text-left">
            © {year} Ghar Sajaoo Prints Limited. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {[
              { label: 'Privacy Policy', to: '/legal?tab=privacy' },
              { label: 'Terms of Service', to: '/legal?tab=terms' },
              { label: 'Cookie Policy', to: '/legal?tab=cookies' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                href={to}
                className="font-body text-xs text-white/30 hover:text-gold transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Payment icons */}
          <div className="flex items-center gap-2">
            {['UPI', 'Visa', 'MC', 'RuPay'].map(method => (
              <span
                key={method}
                className="bg-white/10 text-white/40 text-xs font-body px-2 py-1 tracking-wider"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
