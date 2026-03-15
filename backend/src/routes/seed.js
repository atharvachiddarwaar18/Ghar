import express from 'express'
import { supabase } from '../config/supabase.js'
import { requireAdmin } from '../middleware/adminAuth.js'

const router = express.Router()

const SEED_PRODUCTS = [
  {
    name: 'Ram Mandir Illuminated Wall Frame', slug: 'illuminated-wall-frame',
    description: 'A beautifully crafted illuminated wall frame depicting the majestic Ram Mandir in Ayodhya. Made from premium engineered wood with an intricate laser-cut design. The built-in warm LED backlighting creates a spiritual, serene aura in any room. Perfect for pooja rooms, living spaces, or as a thoughtful premium gift. Features a 12V adapter and easy wall-mount hooks.',
    price: 2499, original_price: 3299, category: 'Wall Decor', image_url: '/images/products/illuminated-wall-frame.png', stock: 45, badge: 'Bestseller', is_active: true, rating: 4.8, review_count: 124
  },
  {
    name: 'Om Mandala LED Wall Art', slug: 'led-wall-art',
    description: 'Elevate your space with this stunning Om Mandala Wall Art. Hand-finished with precision, the multiple layers of wood create a mesmerizing 3D depth effect. Concealed warm LED lights cast a gentle, radiant glow outward, symbolizing peace and cosmic energy.',
    price: 3850, original_price: 4999, category: 'Wall Decor', image_url: '/images/products/led-wall-art.png', stock: 30, badge: 'New Arrival', is_active: true, rating: 4.7, review_count: 89
  },
  {
    name: 'Metropolitan Street Canvas Painting', slug: 'canvas-painting',
    description: 'A bold contemporary canvas painting capturing the vibrant, chaotic beauty of Indian metropolitan streets. Rich oil colors and heavy palette knife strokes give this artwork incredible texture and movement. Stretched over a solid pine wood frame and ready to hang.',
    price: 12500, original_price: 15000, category: 'Canvas Art', image_url: '/images/products/canvas-painting.png', stock: 12, badge: 'Limited Edition', is_active: true, rating: 4.9, review_count: 43
  },
  {
    name: 'Emerald Falls Nature Canvas', slug: 'emerald-falls-canvas',
    description: 'Bring the tranquility of nature indoors with this hyper-realistic canvas print of a hidden emerald waterfall. Printed with museum-quality archival inks that resist fading for decades.',
    price: 4200, original_price: 5500, category: 'Canvas Art', image_url: '/images/products/emerald-falls-canvas.png', stock: 25, badge: 'Top Rated', is_active: true, rating: 4.8, review_count: 67
  },
  {
    name: 'Ivory Marble Twist Vase', slug: 'ivory-marble-vase',
    description: 'An extraordinary sculptural twisted vase carved from a single block of premium ivory-white faux marble. Its fluid, twisting silhouette catches the light beautifully, making it stand out as a modern masterpiece even without flowers.',
    price: 3200, original_price: 4200, category: 'Vases', image_url: '/images/products/ivory-marble-vase.png', stock: 18, badge: 'Popular', is_active: true, rating: 4.6, review_count: 95
  },
  {
    name: 'Stone Mosaic Designer Vase', slug: 'stone-mosaic-vase',
    description: 'Meticulously crafted by artisans, this heavy vase features hundreds of natural stones inlaid in a geometric mosaic pattern. The earthy, organic texture pairs beautifully with dried pampas grass or vibrant fresh blooms. Every vase is uniquely distinct.',
    price: 2800, original_price: 3600, category: 'Vases', image_url: '/images/products/stone-mosaic-vase.png', stock: 20, badge: null, is_active: true, rating: 4.5, review_count: 72
  },
  {
    name: 'Amber Swirl Glass Vase', slug: 'amber-swirl-vase',
    description: 'A testament to the art of glassblowing. This heavy amber vase features mesmerizing organic swirls frozen in time. When placed near a window, the sunlight refracts through the golden amber glass.',
    price: 1999, original_price: 2800, category: 'Vases', image_url: '/images/products/amber-swirl-vase.png', stock: 35, badge: null, is_active: true, rating: 4.4, review_count: 58
  },
  {
    name: 'Floral Glow Table Lamp', slug: 'floral-glow-table-lamp',
    description: 'An exquisite table lamp featuring a handcrafted ceramic base painted with delicate botanical motifs. It comes paired with a premium textured linen drum shade that diffuses light softly and evenly.',
    price: 4500, original_price: 5999, category: 'Lighting', image_url: '/images/products/floral-glow-table-lamp.png', stock: 15, badge: 'Artisan Pick', is_active: true, rating: 4.7, review_count: 81
  },
  {
    name: 'Halo Crystal Ring Lamp', slug: 'halo-crystal-ring-lamp',
    description: 'A breathtaking modern centerpiece. This halo ring pendant lamp is embedded with dozens of high-grade K9 precision-cut crystals. The integrated LED strip illuminates the crystals to create a dazzling refraction effect.',
    price: 18500, original_price: 22000, category: 'Lighting', image_url: '/images/products/halo-crystal-ring-lamp.png', stock: 8, badge: 'Luxury', is_active: true, rating: 4.9, review_count: 31
  },
  {
    name: 'Royal Crystal Tassel Pendant Lamp', slug: 'royal-crystal-tassel-pendant-lamp',
    description: 'Inspired by royal palaces, this grand pendant lamp features cascading layers of delicate crystal tassels suspended from a burnished brass frame. The majestic multi-tiered design provides unparalleled elegance.',
    price: 24000, original_price: 28500, category: 'Lighting', image_url: '/images/products/royal-crystal-tassel-pendant-lamp.png', stock: 5, badge: 'Royal Heritage', is_active: true, rating: 5.0, review_count: 22
  },
  {
    name: 'Ruby Crystal Fringe Pendant Lamp', slug: 'ruby-crystal-fringe-pendant-lamp',
    description: 'A dramatic and highly romantic lighting fixture. Countless ruby-tinted crystal fringes hang gracefully from a matte black iron hoop creating a warm, blushing, atmospheric glow perfect for intimate dining.',
    price: 21500, original_price: 25000, category: 'Lighting', image_url: '/images/products/ruby-crystal-fringe-pendant-lamp.png', stock: 10, badge: null, is_active: true, rating: 4.8, review_count: 36
  },
  {
    name: 'Turquoise Crown Crystal Pendant Lamp', slug: 'turquoise-crown-crystal-pendant-lamp',
    description: 'A magnificent crown-shaped chandelier accented with rare turquoise crystals set among clear diamond-cut stones. Suspended above an island or luxury bath, it serves as the ultimate regal focal point.',
    price: 19500, original_price: 23000, category: 'Lighting', image_url: '/images/products/turquoise-crown-crystal-pendant-lamp.png', stock: 7, badge: null, is_active: true, rating: 4.7, review_count: 29
  },
  {
    name: 'Vintage Gear Wall Clock', slug: 'vintage-gear-wall-clock',
    description: 'An oversized industrial-style wall clock featuring exposed, silently moving golden gears. Protected behind tempered glass within a dark iron casing, blending rustic steampunk aesthetics with reliable quartz precision.',
    price: 3200, original_price: 4500, category: 'Wall Decor', image_url: '/images/products/vintage-gear-wall-clock.png', stock: 20, badge: 'Vintage Style', is_active: true, rating: 4.5, review_count: 104
  },
  {
    name: 'Zen Aura Lamp', slug: 'zen-aura-lamp',
    description: 'Designed under Wabi-Sabi principles, this minimalist ambient lamp rests on a smooth river-stone base. The glowing frosted orb mimics a full moon, providing soothing, dimmable, eye-friendly light.',
    price: 5800, original_price: 7500, category: 'Lighting', image_url: '/images/products/zen-aura-lamp.png', stock: 25, badge: 'Zen Living', is_active: true, rating: 4.8, review_count: 77
  }
]

router.use(requireAdmin)

/**
 * POST /api/admin/seed
 * Seeds (upserts) all products from the server side.
 * This runs with the service role context, bypassing RLS.
 */
router.post('/seed', async (req, res) => {
  try {
    const results = []
    
    for (const product of SEED_PRODUCTS) {
      const { data, error } = await supabase
        .from('products')
        .upsert(product, { onConflict: 'slug' })
        .select()
        .single()
      
      if (error) {
        results.push({ slug: product.slug, status: 'error', error: error.message })
      } else {
        results.push({ slug: product.slug, status: 'ok', id: data?.id })
      }
    }
    
    const successCount = results.filter(r => r.status === 'ok').length
    const errorCount = results.filter(r => r.status === 'error').length
    
    res.json({
      message: `Seeded ${successCount} products${errorCount ? `, ${errorCount} failed` : ''}.`,
      results
    })
  } catch (err) {
    console.error('POST /admin/seed error:', err)
    res.status(500).json({ error: 'Seed failed', details: err.message })
  }
})

export default router
