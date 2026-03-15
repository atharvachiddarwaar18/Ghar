import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'

const HeroBanner = () => {
  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero banner"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('/images/background image.png')`,
          backgroundPosition: 'center center',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/75 via-dark/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-20 bg-grain" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-6 animate-fade-in">
            Modern Elegance · Indian Soul
          </p>

          {/* Headline */}
          <h1 className="font-heading text-5xl md:text-7xl text-white font-bold leading-[1.05] mb-6 animate-slide-up">
            Transform Your
            <span className="italic text-gold"> Living Space</span>
          </h1>

          {/* Subtext */}
          <p className="font-body text-lg text-white/80 mb-10 leading-relaxed max-w-lg animate-fade-in">
            Authentic artisanal pieces inspired by centuries of Indian heritage.
            Curated for the modern home that tells a story.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-brown text-white px-10 py-4 font-body text-xs tracking-widest uppercase transition-all duration-300 hover:bg-amber hover:gap-4 group"
            >
              Shop Collection
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-transparent border border-white/60 text-white px-10 py-4 font-body text-xs tracking-widest uppercase transition-all duration-300 hover:bg-white/10 hover:border-white"
            >
              Explore Heritage
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-14 animate-fade-in">
            {[
              { num: '500+', label: 'Artisans' },
              { num: '24', label: 'Craft Forms' },
              { num: '12K+', label: 'Happy Homes' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-heading text-3xl font-bold text-gold">{stat.num}</p>
                <p className="font-body text-xs tracking-wider text-white/60 uppercase mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-gold transition-colors animate-bounce"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  )
}

export default HeroBanner
