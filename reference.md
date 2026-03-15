# 📖 reference.md — Ghar Sajaoo Build Reference

## 🧲 Antigravity Prompt
> *Use this prompt when continuing development with any AI assistant*

```
You are a senior full-stack web developer and UI/UX designer specializing in 
luxury e-commerce experiences for Indian artisanal brands. You are building 
"Ghar Sajaoo" — a premium home decor e-commerce platform.

CONTEXT:
- Reference brand: gharsajaoo.com (warm cream, terracotta, gold palette)
- Tech: React 18 + Vite + Tailwind CSS (frontend), Node.js + Express (backend)
- Database: Supabase (PostgreSQL), Auth: Supabase Google OAuth
- Payment: Razorpay, Deployment: Vercel + Railway
- Images live in: frontend/images/ (background image.png, logo.png, products/)

DESIGN RULES:
- Colors: Primary #8B4513, Secondary #D4A574, BG #FBF7F0, Dark #1C0A00
- Fonts: Playfair Display (headings, serif), Inter (body, sans)
- Aesthetic: Warm, artisanal, premium Indian decor — like a luxury boutique
- Motion: Subtle, elegant — Framer Motion for carousels and transitions
- NO generic Bootstrap look — every pixel should feel intentional and crafted

QUALITY BAR:
- Code must be production-ready, not prototype quality
- Components must be modular and reusable
- All API calls must have error handling
- Mobile responsive (320px → 4K)
- Accessibility: aria-labels, semantic HTML, keyboard nav
- SEO: meta tags, og:image, structured data

OUTPUT FORMAT:
- Always write complete files, not fragments
- Always add JSDoc-style comments for complex functions
- Always reference TASK_PLANNER.md before adding new features
- Maintain folder structure as defined in TASK_PLANNER.md
```

---

## 🏗️ Architecture Decisions

### Why Vite over CRA?
Faster HMR, smaller bundle, native ESM, better DX.

### Why Supabase over custom Auth?
Built-in Google OAuth, Row Level Security, real-time subscriptions, free tier.

### Why Razorpay over Stripe?
Indian market support, UPI/NetBanking/Cards in one SDK, INR native.

### Why Express over Next.js API?
Separation of concerns, easier Railway deployment, Razorpay webhook handling.

### Why Context API over Redux?
App scope is manageable, no need for Redux overhead. Cart + Auth are the only globals.

---

## 🎨 Component Design System

### Color Tokens (Tailwind Config)
```js
cream:     '#FBF7F0'   // bg-cream
brown:     '#8B4513'   // bg-brown (primary)
gold:      '#D4A574'   // bg-gold (secondary)
dark:      '#1C0A00'   // bg-dark
amber:     '#C17F24'   // bg-amber (accent)
text:      '#4A3728'   // text-textbrown
```

### Typography Scale
```
h1: Playfair Display, 3.5rem, font-bold
h2: Playfair Display, 2.5rem, font-semibold
h3: Playfair Display, 1.5rem, font-medium
body: Inter, 1rem, font-normal
small: Inter, 0.875rem, font-normal
```

### Spacing System
Uses Tailwind default 4px base. Key spacings: 4, 8, 12, 16, 24, 32, 48, 64.

---

## 📡 API Routes Map

### Frontend → Backend
```
GET    /api/products           → All products
GET    /api/products/:id       → Single product
POST   /api/payment/create     → Create Razorpay order
POST   /api/payment/verify     → Verify Razorpay payment
GET    /api/orders             → User orders (auth required)
POST   /api/orders             → Create order (auth required)
GET    /api/admin/orders       → All orders (admin only)
GET    /api/admin/products     → Admin product list
POST   /api/admin/products     → Add product (admin only)
PUT    /api/admin/products/:id → Edit product (admin only)
DELETE /api/admin/products/:id → Delete product (admin only)
GET    /api/admin/stats        → Dashboard stats (admin only)
```

---

## 🗄️ Database Schema

### Tables
```sql
users         — id, email, name, avatar_url, role, created_at
products      — id, name, description, price, category, image_url, stock, rating, slug
orders        — id, user_id, status, total, razorpay_order_id, created_at
order_items   — id, order_id, product_id, quantity, price
reviews       — id, product_id, user_id, rating, comment, created_at
cart_sessions — id, user_id, product_id, quantity, created_at
```

### RLS Policies
- `users`: users can read/update own row
- `products`: public read, admin write
- `orders`: users see own orders, admin sees all
- `reviews`: public read, auth write

---

## 🔐 Auth Flow

```
1. User clicks "Sign in with Google"
2. Supabase redirects to Google OAuth
3. Google returns token to Supabase callback URL
4. Supabase creates/updates user in auth.users
5. AuthContext picks up session via onAuthStateChange
6. User row upserted in public.users table
7. JWT used for all protected API calls
```

### Admin Auth
- Admin login at `/admin` uses **separate password** stored in .env
- Supabase checks `users.role = 'admin'` for admin API routes
- No Google OAuth for admin — direct password challenge

---

## 💳 Razorpay Payment Flow

```
1. User clicks "Place Order" on Checkout page
2. Frontend calls POST /api/payment/create with cart total
3. Backend creates Razorpay order → returns order_id
4. Frontend opens Razorpay checkout modal
5. User pays → Razorpay sends payment_id, signature
6. Frontend calls POST /api/payment/verify
7. Backend verifies HMAC signature
8. On success: order saved to Supabase, cart cleared
9. User redirected to Order Confirmation page
```

---

## 🧹 Supabase Cleanup Strategy

Cron job (pg_cron or Supabase Edge Function) runs daily at midnight IST:
```sql
DELETE FROM cart_sessions WHERE created_at < NOW() - INTERVAL '10 days';
DELETE FROM orders WHERE status = 'abandoned' AND created_at < NOW() - INTERVAL '10 days';
```
Supabase free tier has 500MB limit — cleanup keeps DB lean.

---

## 📦 Image Naming Convention

Place in `frontend/images/`:
```
background image.png        ← Hero section background (exact name)
logo.png                    ← Brand logo
products/
  illuminated-wall-frame.png
  led-wall-art.png
  canvas-painting.png
  emerald-falls-canvas.png
  ivory-marble-vase.png
  stone-mosaic-vase.png
  amber-swirl-vase.png
  jute-table-runner.png
  brass-diya-set.png
  block-print-cushion.png
  bamboo-wind-chime.png
  terracotta-planter.png
```

---

## 🚀 Deployment Guide

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Connect GitHub repo to Vercel
# Set environment variables in Vercel dashboard
```

### Backend (Railway)
```bash
# Push backend to Railway
railway up
# Set environment variables in Railway dashboard
```

### Supabase
```bash
# Run migrations in Supabase SQL editor
# Enable pg_cron extension for cleanup jobs
# Configure Google OAuth in Auth settings
```

---

## 📝 Build Log

| Date       | Action                          | Status |
|------------|---------------------------------|--------|
| 2026-03-15 | Project initialized             | ✅     |
| 2026-03-15 | Folder structure created        | ✅     |
| 2026-03-15 | TASK_PLANNER.md written         | ✅     |
| 2026-03-15 | reference.md written            | ✅     |
| 2026-03-15 | Frontend scaffold               | ✅     |
| 2026-03-15 | All components built            | ✅     |
| 2026-03-15 | All pages built                 | ✅     |
| 2026-03-15 | Backend API built               | ✅     |
| 2026-03-15 | Supabase migrations written     | ✅     |
| 2026-03-15 | README + deployment docs        | ✅     |
