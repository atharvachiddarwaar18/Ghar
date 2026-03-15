'use client'
import React, { useState } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const REVIEWS = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    avatar: '👩',
    rating: 5,
    date: 'February 2026',
    title: 'Absolutely stunning wall art!',
    review:
      'I ordered the Ram Mandir Illuminated Frame for our new home and it exceeded every expectation. The quality is impeccable and the warm LED lighting transforms the entire room in the evenings. Our guests always ask about it. Will definitely order again!',
    product: 'Ram Mandir Illuminated Wall Frame',
    verified: true,
  },
  {
    id: 2,
    name: 'Rajesh Mehta',
    location: 'Bengaluru, Karnataka',
    avatar: '👨',
    rating: 5,
    date: 'January 2026',
    title: 'Delivery was fast, product is exceptional',
    review:
      'Received the Ivory Marble Vase in perfect condition — packed with so much care. It looks even more beautiful in person than in the photos. The marble texture and twist design is genuinely unique. Ghar Sajaoo has become my go-to for gifting.',
    product: 'Ivory Marble Twist Vase',
    verified: true,
  },
  {
    id: 3,
    name: 'Ananya Reddy',
    location: 'Hyderabad, Telangana',
    avatar: '👩‍🦱',
    rating: 5,
    date: 'March 2026',
    title: 'Transformed my living room completely',
    review:
      'Bought the Om Mandala LED Wall Art and three block print cushions. The combination looks like a professional interior designer curated it. My Instagram reel featuring my living room got over 5000 likes! Worth every rupee.',
    product: 'Om Mandala LED Wall Art',
    verified: true,
  },
  {
    id: 4,
    name: 'Vikram Nair',
    location: 'Pune, Maharashtra',
    avatar: '🧔',
    rating: 5,
    date: 'February 2026',
    title: 'Authentic Indian craftsmanship, premium quality',
    review:
      'What sets Ghar Sajaoo apart is the authenticity. Every piece tells a story of real craftsmanship. I bought the Terracotta Planter set and the Brass Diya set — both arrived exactly as shown, with beautiful packaging. Feels like supporting real artisans.',
    product: 'Terracotta Planter Set',
    verified: true,
  },
  {
    id: 5,
    name: 'Meera Iyer',
    location: 'Chennai, Tamil Nadu',
    avatar: '👩‍🦳',
    rating: 5,
    date: 'January 2026',
    title: 'My Diwali decorations were the talk of the colony!',
    review:
      'Ordered the Brass Diya set and multiple wall frames for Diwali. The house looked absolutely divine. My neighbours were so impressed they all ordered from Ghar Sajaoo too. The customer support is also superb — very responsive and helpful.',
    product: 'Brass Diya Set (6 pcs)',
    verified: true,
  },
  {
    id: 6,
    name: 'Arjun Kapoor',
    location: 'New Delhi',
    avatar: '👦',
    rating: 5,
    date: 'March 2026',
    title: 'Best home decor purchase I\'ve ever made',
    review:
      'The Metropolitan Street Canvas is a work of art. I was worried about ordering something this premium online, but the painting arrived in perfect condition with a certificate. It\'s the focal point of my home office now. Highly recommend!',
    product: 'Metropolitan Street Canvas',
    verified: true,
  },
]

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <Star
        key={star}
        size={14}
        className={star <= rating ? 'star-filled' : 'star-empty'}
      />
    ))}
  </div>
)

const ReviewCard = ({ review }) => (
  <div className="bg-white p-8 shadow-card flex flex-col h-full relative">
    {/* Quote icon */}
    <Quote size={32} className="text-gold/30 absolute top-6 right-6" />

    {/* Stars */}
    <StarRating rating={review.rating} />

    {/* Title */}
    <h4 className="font-heading text-base font-semibold text-dark mt-3 mb-3">
      "{review.title}"
    </h4>

    {/* Review text */}
    <p className="font-body text-sm text-textbrown/80 leading-relaxed flex-1">
      {review.review}
    </p>

    {/* Product tag */}
    <div className="mt-4 pt-4 border-t border-gold/20">
      <p className="font-body text-xs text-amber tracking-wide">
        Purchased: {review.product}
      </p>
    </div>

    {/* Reviewer */}
    <div className="flex items-center gap-3 mt-4">
      <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-xl flex-shrink-0">
        {review.avatar}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-body text-sm font-semibold text-dark">{review.name}</p>
          {review.verified && (
            <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 font-body">✓ Verified</span>
          )}
        </div>
        <p className="font-body text-xs text-textbrown/50">{review.location} · {review.date}</p>
      </div>
    </div>
  </div>
)

const ReviewSection = () => {
  const [page, setPage] = useState(0)
  const perPage = 3
  const totalPages = Math.ceil(REVIEWS.length / perPage)
  const visible = REVIEWS.slice(page * perPage, page * perPage + perPage)

  return (
    <section className="py-24 bg-softgray" aria-label="Customer reviews">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-subtitle">Customer Stories</p>
          <h2 className="section-title mt-2">Loved by 12,000+ Happy Homes</h2>
          <div className="divider" />

          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={20} className="star-filled" />
              ))}
            </div>
            <span className="font-heading text-2xl font-bold text-dark">4.9</span>
            <span className="font-body text-sm text-textbrown/60">
              based on 1,240+ reviews
            </span>
          </div>
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous reviews"
            className="w-10 h-10 flex items-center justify-center border border-gold/40 text-textbrown hover:border-brown hover:text-brown transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                i === page ? 'bg-brown scale-125' : 'bg-gold/50 hover:bg-gold'
              }`}
              aria-label={`Page ${i + 1}`}
            />
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            aria-label="Next reviews"
            className="w-10 h-10 flex items-center justify-center border border-gold/40 text-textbrown hover:border-brown hover:text-brown transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Trust line */}
        <p className="text-center font-body text-xs text-textbrown/40 tracking-wider mt-8">
          All reviews are from verified purchasers on Ghar Sajaoo
        </p>
      </div>
    </section>
  )
}

export default ReviewSection
