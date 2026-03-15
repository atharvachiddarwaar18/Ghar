'use client'
import Link from 'next/link';
import React, { useEffect } from 'react'

import { Heart, Award, Leaf, Users } from 'lucide-react'

const About = () => {
  useEffect(() => {
    document.title = 'Our Story — Ghar Sajaoo'
  }, [])

  return (
    <div className="min-h-screen bg-cream pt-20">

      {/* Hero */}
      <section
        className="relative py-28 flex items-center justify-center text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #8B4513 0%, #1C0A00 100%)' }}
      >
        <div className="absolute inset-0 bg-grain opacity-20" />
        <div className="relative px-6">
          <p className="section-subtitle text-gold/70 mb-3">Our Heritage</p>
          <h1 className="font-heading text-4xl md:text-6xl text-white font-bold leading-tight mb-6">
            Preserving the Soul of<br />
            <span className="italic text-gold">Indian Craftsmanship</span>
          </h1>
          <p className="font-body text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            For generations, our artisans have mastered the dance of thread and clay.
            Ghar Sajaoo was born from a passion to bring these timeless traditions into the modern home.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-subtitle">How It Started</p>
              <h2 className="section-title mt-2 mb-6">Born from a Love of Heritage</h2>
              <div className="space-y-4 font-body text-sm text-textbrown/80 leading-relaxed">
                <p>
                  Ghar Sajaoo began in 2018 when our founder, on a journey through Rajasthan's artisan villages,
                  saw first-hand how centuries-old crafts were struggling to find their place in modern homes.
                  Skilled potters, weavers, and metalworkers — masters of their craft — had no platform to reach
                  customers who would truly appreciate their work.
                </p>
                <p>
                  The name "Ghar Sajaoo" — meaning "Decorate Your Home" in Hindi — captures our simple mission:
                  to be the bridge between India's extraordinary artisan heritage and the modern home.
                </p>
                <p>
                  Today, we work with over 500 artisans across 24 regional craft forms, from the block printers
                  of Jaipur to the brass craftsmen of Moradabad and the terracotta artists of Khurja.
                  Every purchase directly supports these artisan families.
                </p>
              </div>
            </div>
            <div className="bg-softgray aspect-square flex items-center justify-center text-8xl">
              🏺
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-softgray">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subtitle">What We Stand For</p>
            <h2 className="section-title mt-2">Our Core Values</h2>
            <div className="divider" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Authentic Craft', desc: 'Every product is genuinely handmade — no mass production.' },
              { icon: Users, title: 'Artisan First', desc: 'Fair wages, credited authorship, and long-term partnerships.' },
              { icon: Leaf, title: 'Sustainability', desc: 'Natural materials, recyclable packaging, low carbon logistics.' },
              { icon: Award, title: 'Quality Promise', desc: 'Every piece inspected before it leaves our artisan\'s workshop.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-8 text-center shadow-card">
                <div className="w-14 h-14 bg-brown/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-brown" />
                </div>
                <h3 className="font-heading text-base font-semibold text-dark mb-2">{title}</h3>
                <p className="font-body text-sm text-textbrown/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-brown">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ['500+', 'Partner Artisans'],
              ['24', 'Craft Traditions'],
              ['12,000+', 'Happy Homes'],
              ['8', 'States Covered'],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="font-heading text-4xl font-bold text-gold">{num}</p>
                <p className="font-body text-xs text-white/60 uppercase tracking-wider mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-heading text-3xl text-dark font-semibold mb-4">
            Ready to Bring Heritage Home?
          </h2>
          <p className="font-body text-sm text-textbrown/70 mb-8">
            Every purchase is a story of craft, culture, and connection.
          </p>
          <Link href="/shop" className="btn-primary">
            Explore the Collection
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
