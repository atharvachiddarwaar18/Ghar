# 🏠 Ghar Sajaoo — Project Task Planner

## Project Overview
A full-stack e-commerce website for Indian artisanal home decor — "Ghar Sajaoo".
Inspired by gharsajaoo.com with matching color theme, fonts, and brand identity.

---

## 🎨 Design Specification
| Element         | Value                                      |
|-----------------|--------------------------------------------|
| Primary Color   | `#8B4513` (Saddle Brown / Terracotta)      |
| Secondary Color | `#D4A574` (Warm Gold / Sand)              |
| Background      | `#FBF7F0` (Warm Cream)                    |
| Dark Accent     | `#1C0A00` (Deep Brown)                    |
| Amber Accent    | `#C17F24` (Amber / Gold)                  |
| Text Color      | `#4A3728` (Medium Brown)                  |
| Heading Font    | Playfair Display (Google Fonts, Serif)    |
| Body Font       | Inter (Google Fonts, Sans-serif)          |

---

## 🧰 Tech Stack
| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Frontend     | React 18 + Vite + Tailwind CSS          |
| Routing      | React Router v6                         |
| State        | Context API (Cart + Auth)               |
| Animations   | Framer Motion                           |
| Icons        | Lucide React                            |
| Backend      | Node.js + Express.js                    |
| Database     | Supabase (PostgreSQL)                   |
| Auth         | Supabase Auth + Google OAuth            |
| Payment      | Razorpay                                |
| Deployment   | Vercel (Frontend) + Railway (Backend)   |

---

## 📁 Folder Structure
```
ghar-sajaoo/
├── frontend/
│   ├── images/                    ← PRE-CREATED (put your images here)
│   │   ├── background image.png   ← Hero background
│   │   ├── logo.png               ← Brand logo
│   │   └── products/              ← Product images (name as product slug)
│   ├── public/
│   ├── src/
│   │   ├── components/            ← Reusable UI components
│   │   ├── pages/                 ← Route-level pages
│   │   ├── context/               ← Global state (Cart, Auth)
│   │   ├── hooks/                 ← Custom React hooks
│   │   ├── utils/                 ← Supabase client, helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── routes/                ← API route handlers
│   │   ├── middleware/            ← Auth, admin guards
│   │   ├── config/                ← Supabase client config
│   │   └── index.js               ← Express app entry
│   ├── package.json
│   └── .env.example
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_cleanup_function.sql
├── TASK_PLANNER.md
├── reference.md
└── README.md
```

---

## ✅ Task Checklist

### Phase 1 — Foundation
- [x] Define color palette & fonts
- [x] Choose tech stack
- [x] Create folder structure
- [x] Write TASK_PLANNER.md
- [x] Write reference.md

### Phase 2 — Frontend Core
- [x] `index.css` — Tailwind + custom CSS variables
- [x] `tailwind.config.js` — Custom theme
- [x] `App.jsx` — Router setup
- [x] `main.jsx` — Entry point
- [x] `AuthContext.jsx` — Google OAuth state
- [x] `CartContext.jsx` — Cart state

### Phase 3 — Components
- [x] `Navbar.jsx` — Logo, nav, cart, profile icons
- [x] `Footer.jsx` — Links, newsletter, legal
- [x] `HeroBanner.jsx` — Background image + CTA
- [x] `ProductCarousel.jsx` — Auto-scrolling product cards (L→R)
- [x] `ProductCard.jsx` — Interactive card with add-to-cart
- [x] `ReviewSection.jsx` — Mock 5-star reviews
- [x] `CartDrawer.jsx` — Slide-in cart panel
- [x] `WhyChooseUs.jsx` — Trust badges section
- [x] `NewsletterSection.jsx` — Email subscribe

### Phase 4 — Pages
- [x] `Home.jsx` — Full home page
- [x] `Shop.jsx` — Catalog with filter + grid
- [x] `Cart.jsx` — Cart page
- [x] `Checkout.jsx` — Razorpay integration
- [x] `Login.jsx` — Google OAuth login page
- [x] `Profile.jsx` — User profile + orders
- [x] `Admin.jsx` — Password-protected admin dashboard
- [x] `Legal.jsx` — Privacy, Terms, Shipping, Returns

### Phase 5 — Backend
- [x] `index.js` — Express server
- [x] `routes/products.js` — CRUD products
- [x] `routes/orders.js` — Order management
- [x] `routes/payment.js` — Razorpay create order + verify
- [x] `routes/admin.js` — Admin-only endpoints
- [x] `middleware/auth.js` — JWT/Supabase token verify
- [x] `middleware/adminAuth.js` — Admin password guard

### Phase 6 — Database
- [x] `001_initial_schema.sql` — All tables
- [x] `002_cleanup_function.sql` — 10-day auto-cleanup cron

### Phase 7 — Configuration
- [x] `frontend/.env.example`
- [x] `backend/.env.example`
- [x] `README.md` — Full deployment guide

---

## 🚀 Deployment Checklist
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Supabase project created + migrations run
- [ ] Google OAuth credentials configured
- [ ] Razorpay keys configured
- [ ] Cron job for DB cleanup enabled
- [ ] Custom domain pointed (optional)
- [ ] Environment variables set on all platforms

---

## 📦 Product Catalog (Initial)
| Name                                | Price   | Category    |
|-------------------------------------|---------|-------------|
| Ram Mandir Illuminated Wall Frame   | ₹2,499  | Wall Decor  |
| Om Mandala LED Wall Art             | ₹3,850  | Wall Decor  |
| Metropolitan Street Canvas Painting | ₹12,500 | Canvas Art  |
| Emerald Falls Nature Canvas         | ₹4,200  | Canvas Art  |
| Ivory Marble Twist Vase             | ₹3,200  | Vases       |
| Stone Mosaic Designer Vase          | ₹2,800  | Vases       |
| Amber Swirl Glass Vase              | ₹1,999  | Vases       |
| Handwoven Jute Table Runner         | ₹899    | Textiles    |
| Brass Diya Set (6 pcs)              | ₹1,499  | Festive     |
| Rajasthani Block Print Cushion      | ₹649    | Textiles    |
| Bamboo Wind Chime                   | ₹799    | Garden      |
| Terracotta Planter (Set of 3)       | ₹1,299  | Garden      |
