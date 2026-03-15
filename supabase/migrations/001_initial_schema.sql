-- ================================================================
-- Ghar Sajaoo — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Run this in Supabase SQL Editor (Settings → SQL Editor)
-- ================================================================

-- ── Enable Extensions ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_cron; -- For scheduled cleanup jobs

-- ================================================================
-- TABLE: users
-- Stores public user profile data synced from Supabase Auth
-- ================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- TABLE: products
-- Main product catalog
-- ================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description    TEXT,
  price          NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  original_price NUMERIC(10, 2),
  category       TEXT NOT NULL,
  image_url      TEXT,
  stock          INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating         NUMERIC(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count   INTEGER DEFAULT 0,
  badge          TEXT,
  features       JSONB,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category    ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug        ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active   ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_rating      ON public.products(rating DESC);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- TABLE: orders
-- Customer orders with Razorpay payment details
-- ================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled','abandoned')),
  total                NUMERIC(10, 2) NOT NULL CHECK (total > 0),
  shipping_address     TEXT,
  customer_name        TEXT,
  customer_email       TEXT,
  customer_phone       TEXT,
  razorpay_order_id    TEXT UNIQUE,
  razorpay_payment_id  TEXT UNIQUE,
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id    ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_rzp_id     ON public.orders(razorpay_order_id);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- TABLE: order_items
-- Line items for each order
-- ================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_name  TEXT NOT NULL, -- snapshot at time of purchase
  product_image TEXT,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  price         NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- ================================================================
-- TABLE: reviews
-- Product reviews by authenticated users
-- ================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title       TEXT,
  comment     TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE, -- verified purchase
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, user_id) -- one review per product per user
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id    ON public.reviews(user_id);

-- ================================================================
-- TABLE: cart_sessions
-- Persists cart items for non-logged-in users or cross-device sync
-- Cleaned up automatically after 10 days
-- ================================================================
CREATE TABLE IF NOT EXISTS public.cart_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_key TEXT, -- for guest sessions
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cart_user_id     ON public.cart_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session_key ON public.cart_sessions(session_key);
CREATE INDEX IF NOT EXISTS idx_cart_created_at  ON public.cart_sessions(created_at);

CREATE TRIGGER cart_updated_at
  BEFORE UPDATE ON public.cart_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- FUNCTION: decrement_stock
-- Called after successful payment to reduce product stock
-- ================================================================
CREATE OR REPLACE FUNCTION public.decrement_stock(product_id UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, stock - quantity)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- FUNCTION: update_product_rating
-- Recalculates avg rating after a new review is inserted
-- ================================================================
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET
    rating = (
      SELECT ROUND(AVG(rating)::NUMERIC, 2)
      FROM public.reviews
      WHERE product_id = NEW.product_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE product_id = NEW.product_id
    )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_sessions ENABLE ROW LEVEL SECURITY;

-- ── users policies ───────────────────────────────────────────────
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users are inserted via service role on signup"
  ON public.users FOR INSERT WITH CHECK (true);

-- ── products policies ────────────────────────────────────────────
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Service role can manage products"
  ON public.products FOR ALL USING (true); -- Backend uses service role

-- ── orders policies ──────────────────────────────────────────────
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all orders"
  ON public.orders FOR ALL USING (true);

-- ── order_items policies ─────────────────────────────────────────
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage order items"
  ON public.order_items FOR ALL USING (true);

-- ── reviews policies ─────────────────────────────────────────────
CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can write reviews"
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- ── cart policies ────────────────────────────────────────────────
CREATE POLICY "Users can manage their own cart"
  ON public.cart_sessions FOR ALL USING (auth.uid() = user_id);

-- ================================================================
-- SEED: Initial products (sync with catalog images)
-- ================================================================
INSERT INTO public.products (name, slug, description, price, original_price, category, image_url, stock, badge, is_active)
VALUES
  ('Ram Mandir Illuminated Wall Frame', 'illuminated-wall-frame',
   'A beautifully crafted illuminated wall frame depicting the majestic Ram Mandir in Ayodhya. Made from premium engineered wood with an intricate laser-cut design. The built-in warm LED backlighting creates a spiritual, serene aura in any room. Perfect for pooja rooms, living spaces, or as a thoughtful premium gift. Features a 12V adapter and easy wall-mount hooks.',
   2499, 3299, 'Wall Decor', '/images/products/illuminated-wall-frame.png', 45, 'Bestseller', TRUE),

  ('Om Mandala LED Wall Art', 'led-wall-art',
   'Elevate your space with this stunning Om Mandala Wall Art. Hand-finished with precision, the multiple layers of wood create a mesmerizing 3D depth effect. Concealed warm LED lights cast a gentle, radiant glow outward, symbolizing peace and cosmic energy. Ideal for meditation spaces and modern homes seeking a touch of tradition.',
   3850, 4999, 'Wall Decor', '/images/products/led-wall-art.png', 30, 'New Arrival', TRUE),

  ('Metropolitan Street Canvas Painting', 'canvas-painting',
   'A bold contemporary canvas painting capturing the vibrant, chaotic beauty of Indian metropolitan streets. Rich oil colors and heavy palette knife strokes give this artwork incredible texture and movement. Stretched over a solid pine wood frame and ready to hang. A perfect statement piece for living rooms and creative studios.',
   12500, 15000, 'Canvas Art', '/images/products/canvas-painting.png', 12, 'Limited Edition', TRUE),

  ('Emerald Falls Nature Canvas', 'emerald-falls-canvas',
   'Bring the tranquility of nature indoors with this hyper-realistic canvas print of a hidden emerald waterfall. Printed with museum-quality archival inks that resist fading for decades. The lush greens and calming blues instantly relax the mind and breathe life into neutral-toned interior spaces.',
   4200, 5500, 'Canvas Art', '/images/products/emerald-falls-canvas.png', 25, 'Top Rated', TRUE),

  ('Ivory Marble Twist Vase', 'ivory-marble-vase',
   'An extraordinary sculptural twisted vase carved from a single block of premium ivory-white faux marble. Its fluid, twisting silhouette catches the light beautifully, making it stand out as a modern masterpiece even without flowers. Heavy, stable base prevents tipping.',
   3200, 4200, 'Vases', '/images/products/ivory-marble-vase.png', 18, 'Popular', TRUE),

  ('Stone Mosaic Designer Vase', 'stone-mosaic-vase',
   'Meticulously crafted by artisans, this heavy vase features hundreds of natural stones inlaid in a geometric mosaic pattern. The earthy, organic texture pairs beautifully with dried pampas grass or vibrant fresh blooms. Every single vase is uniquely distinct.',
   2800, 3600, 'Vases', '/images/products/stone-mosaic-vase.png', 20, NULL, TRUE),

  ('Amber Swirl Glass Vase', 'amber-swirl-vase',
   'A testament to the art of glassblowing. This heavy amber vase features mesmerizing organic swirls frozen in time. When placed near a window, the sunlight refracts through the golden amber glass, casting beautiful warm patterns across the room.',
   1999, 2800, 'Vases', '/images/products/amber-swirl-vase.png', 35, NULL, TRUE),

  ('Floral Glow Table Lamp', 'floral-glow-table-lamp',
   'An exquisite table lamp featuring a handcrafted ceramic base painted with delicate botanical motifs. It comes paired with a premium textured linen drum shade that diffuses light softly and evenly, creating a cozy and inviting reading nook or bedside ambiance.',
   4500, 5999, 'Lighting', '/images/products/floral-glow-table-lamp.png', 15, 'Artisan Pick', TRUE),

  ('Halo Crystal Ring Lamp', 'halo-crystal-ring-lamp',
   'A breathtaking modern centerpiece. This halo ring pendant lamp is embedded with dozens of high-grade K9 precision-cut crystals. The integrated LED strip illuminates the crystals to create a dazzling refraction effect that transforms dining rooms and entryways into luxury spaces.',
   18500, 22000, 'Lighting', '/images/products/halo-crystal-ring-lamp.png', 8, 'Luxury', TRUE),

  ('Royal Crystal Tassel Pendant Lamp', 'royal-crystal-tassel-pendant-lamp',
   'Inspired by royal palaces, this grand pendant lamp features cascading layers of delicate crystal tassels suspended from a burnished brass frame. The majestic multi-tiered design provides unparalleled elegance and a spectacular display of light and shadow.',
   24000, 28500, 'Lighting', '/images/products/royal-crystal-tassel-pendant-lamp.png', 5, 'Royal Heritage', TRUE),

  ('Ruby Crystal Fringe Pendant Lamp', 'ruby-crystal-fringe-pendant-lamp',
   'A dramatic and highly romantic lighting fixture. Countless ruby-tinted crystal fringes hang gracefully from a matte black iron hoop. When turned on, it casts a uniquely warm, blushing, atmospheric glow perfect for intimate dining settings.',
   21500, 25000, 'Lighting', '/images/products/ruby-crystal-fringe-pendant-lamp.png', 10, NULL, TRUE),

  ('Turquoise Crown Crystal Pendant Lamp', 'turquoise-crown-crystal-pendant-lamp',
   'A magnificent crown-shaped chandelier accented with rare turquoise crystals set among clear diamond-cut stones. Suspended above an island or luxury bath, it serves as the ultimate regal focal point of interior design.',
   19500, 23000, 'Lighting', '/images/products/turquoise-crown-crystal-pendant-lamp.png', 7, NULL, TRUE),

  ('Vintage Gear Wall Clock', 'vintage-gear-wall-clock',
   'An oversized industrial-style wall clock featuring exposed, silently moving golden gears. Protected behind tempered glass within a dark iron casing, this clock blends rustic steampunk aesthetics with reliable quartz precision timekeeping.',
   3200, 4500, 'Wall Decor', '/images/products/vintage-gear-wall-clock.png', 20, 'Vintage Style', TRUE),

  ('Zen Aura Lamp', 'zen-aura-lamp',
   'Designed under the principles of Wabi-Sabi, this minimalist ambient lamp rests on a smooth river-stone base. The glowing frosted orb mimics a full moon, providing soothing, dimmable, eye-friendly light designed to de-stress and calm the mind before sleep.',
   5800, 7500, 'Lighting', '/images/products/zen-aura-lamp.png', 25, 'Zen Living', TRUE)

ON CONFLICT (slug) DO NOTHING;
