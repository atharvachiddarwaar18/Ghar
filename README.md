# 🏠 Ghar Sajaoo — Full-Stack E-Commerce Platform

> **Modern Elegance, Indian Soul** — A premium artisanal home decor e-commerce website built with React, Node.js, Supabase, and Razorpay.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Getting Started (Local Dev)](#getting-started)
5. [Adding Your Images](#adding-your-images)
6. [Environment Variables](#environment-variables)
7. [Supabase Setup](#supabase-setup)
8. [Google OAuth Setup](#google-oauth-setup)
9. [Razorpay Setup](#razorpay-setup)
10. [Deploying Frontend (Vercel)](#deploying-frontend)
11. [Deploying Backend (Railway)](#deploying-backend)
12. [Admin Dashboard](#admin-dashboard)
13. [Database Cleanup](#database-cleanup)
14. [Route Map](#route-map)
15. [Troubleshooting](#troubleshooting)

---

## Project Overview

Ghar Sajaoo is a full-featured Indian home decor e-commerce platform with:

- 🛍️ Product catalog with category/price/search filters
- 🎠 Auto-scrolling product carousel on the home page
- ⭐ Customer review section with 5-star ratings
- 🛒 Persistent cart with slide-in drawer
- 💳 Razorpay payment gateway (UPI, Cards, NetBanking, Wallets)
- 🔐 Google OAuth sign-in via Supabase
- 👤 User profile & order history
- 🔑 Password-protected admin dashboard (orders, products, stats)
- ⚖️ Full legal pages (Privacy, Terms, Shipping, Returns, Cookies, Care Guide)
- 🧹 Auto database cleanup — stale data older than 10 days is deleted nightly

---

## Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | React 18 + Vite + Tailwind CSS |
| Routing      | React Router v6               |
| State        | Context API (Cart + Auth)     |
| Icons        | Lucide React                  |
| Notifications| React Hot Toast               |
| Backend      | Node.js + Express.js          |
| Database     | Supabase (PostgreSQL)         |
| Auth         | Supabase + Google OAuth       |
| Payment      | Razorpay                      |
| Frontend Host| Vercel                        |
| Backend Host | Railway                       |

---

## Folder Structure

```
ghar-sajaoo/
├── frontend/
│   ├── images/                     ← PUT YOUR IMAGES HERE
│   │   ├── background image.png    ← Hero background (exact name with space)
│   │   ├── logo.png                ← Brand logo
│   │   └── products/               ← Product images
│   ├── src/
│   │   ├── components/             ← Navbar, Footer, ProductCard, etc.
│   │   ├── pages/                  ← Home, Shop, Checkout, Login, Admin, etc.
│   │   ├── context/                ← AuthContext, CartContext
│   │   ├── utils/                  ← Supabase client, products data
│   │   ├── App.jsx                 ← Router setup
│   │   ├── main.jsx                ← React entry point
│   │   └── index.css               ← Tailwind + global styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json
├── backend/
│   ├── src/
│   │   ├── config/                 ← Supabase + Razorpay clients
│   │   ├── middleware/             ← auth.js, adminAuth.js
│   │   ├── routes/                 ← products, payment, orders, admin
│   │   └── index.js                ← Express server entry
│   ├── package.json
│   └── railway.toml
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  ← All tables, RLS, seed data
│       └── 002_cleanup_function.sql← 10-day cron cleanup
├── .gitignore
├── TASK_PLANNER.md
├── reference.md
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)
- A Razorpay account (test mode works)
- A Google Cloud Console project (for OAuth)

### 1. Clone / Download the project

```bash
# If using git:
git clone <your-repo-url>
cd ghar-sajaoo

# Or just unzip the downloaded folder
```

### 2. Set up the Frontend

```bash
cd frontend
npm install

# Copy env template and fill in your values
cp .env.example .env
# Edit .env with your Supabase + Razorpay keys (see Environment Variables section)

npm run dev
# Frontend runs at http://localhost:5173
```

### 3. Set up the Backend

```bash
cd backend
npm install

# Copy env template and fill in your values
cp .env.example .env
# Edit .env with your Supabase service key + Razorpay secret

npm run dev
# Backend runs at http://localhost:5000
# Test: http://localhost:5000/health
```

---

## Adding Your Images

Place your images in `frontend/images/` following this exact naming:

```
frontend/images/
├── background image.png        ← REQUIRED — hero section background
├── logo.png                    ← REQUIRED — appears in navbar & footer
└── products/
    ├── illuminated-wall-frame.png
    ├── led-wall-art.png
    ├── canvas-painting.png
    ├── emerald-falls-canvas.png
    ├── ivory-marble-vase.png
    ├── stone-mosaic-vase.png
    ├── amber-swirl-vase.png
    ├── jute-table-runner.png
    ├── brass-diya-set.png
    ├── block-print-cushion.png
    ├── bamboo-wind-chime.png
    └── terracotta-planter.png
```

**Image specs:**
- Background: 1920×1080px minimum, JPG or PNG
- Logo: Square with transparent background, PNG recommended
- Products: 800×1000px (4:5 ratio) for best card display

> ⚠️ The background image filename **must** include the space: `background image.png`

---

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
VITE_APP_URL=http://localhost:5173
```

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
ADMIN_PASSWORD=GharAdmin@2026
FRONTEND_URL=http://localhost:5173
```

> 🔑 `SUPABASE_SERVICE_KEY` is the **service role** key from Supabase → Settings → API. Keep it secret — never use it in the frontend.

---

## Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Note your **Project URL** and **anon key** (for frontend) and **service role key** (for backend)
3. Go to **SQL Editor** in Supabase dashboard
4. Run `supabase/migrations/001_initial_schema.sql` (copy-paste entire file)
5. Run `supabase/migrations/002_cleanup_function.sql` (copy-paste entire file)
6. Enable the **pg_cron** extension: Go to **Extensions** → search `pg_cron` → Enable

---

## Google OAuth Setup

### Step 1 — Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URIs:
   - `https://xxxx.supabase.co/auth/v1/callback` (replace xxxx with your project ref)
   - `http://localhost:5173/auth/callback` (for local dev)
7. Save → copy **Client ID** and **Client Secret**

### Step 2 — Supabase Auth Settings

1. In Supabase → **Authentication → Providers → Google**
2. Toggle **Enable**
3. Paste your Google **Client ID** and **Client Secret**
4. Add to Redirect URLs:
   - `http://localhost:5173/auth/callback`
   - `https://your-domain.com/auth/callback`
5. Save

---

## Razorpay Setup

1. Create account at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys → Generate Key** (Test mode first)
3. Copy **Key ID** → `VITE_RAZORPAY_KEY_ID` (frontend) and `RAZORPAY_KEY_ID` (backend)
4. Copy **Key Secret** → `RAZORPAY_KEY_SECRET` (backend only — never in frontend)

**Test cards for development:**
| Card Number         | Expiry  | CVV | Result  |
|---------------------|---------|-----|---------|
| 4111 1111 1111 1111 | Any future | Any | Success |
| 5267 3181 8797 5449 | Any future | Any | Success |

For UPI test: use `success@razorpay` as UPI ID.

**Switch to live mode** before going to production: replace `rzp_test_` keys with `rzp_live_` keys.

---

## Deploying Frontend

### Vercel (Recommended)

1. Push `frontend/` folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `frontend`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Add all **Environment Variables** from `frontend/.env`
7. Click **Deploy**

Your frontend is live! Note the URL (e.g. `https://ghar-sajaoo.vercel.app`)

**Custom domain:**
- Vercel → Project → Settings → Domains → Add `gharsajaoo.com`
- Update your DNS: add CNAME pointing to `cname.vercel-dns.com`

---

## Deploying Backend

### Railway (Recommended)

1. Push `backend/` folder to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your backend repo
4. Railway auto-detects Node.js — it will run `node src/index.js`
5. Add **Environment Variables** from `backend/.env`:
   - `NODE_ENV=production`
   - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - `ADMIN_PASSWORD` (change from default!)
   - `FRONTEND_URL=https://your-vercel-url.vercel.app`
6. Railway gives you a URL like `https://ghar-sajaoo-backend.up.railway.app`

**Update frontend env:**
- In Vercel dashboard → Settings → Environment Variables
- Set `VITE_API_URL=https://your-railway-url.up.railway.app`
- Redeploy frontend

---

## Admin Dashboard

Access the admin dashboard at `/admin`.

**Login:** Enter the password set in `ADMIN_PASSWORD` env var (default: `GharAdmin@2026`)

> ⚠️ **Change the admin password before deploying to production!**

### Admin Features
| Tab | What you can do |
|-----|----------------|
| Dashboard | Revenue, order counts, pending orders overview |
| Orders | View all orders, update status (pending → confirmed → shipped → delivered) |
| Products | View all products, edit/delete, add new products |

### Making a User Admin via SQL
```sql
-- Run in Supabase SQL Editor
UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
```

Once set as admin in the DB, the user can also access admin API routes via their JWT token (in addition to password-based access).

---

## Database Cleanup

The cleanup cron job runs **daily at midnight IST** (18:30 UTC) and:
- Deletes `cart_sessions` older than 10 days
- Deletes `orders` with status `abandoned` older than 10 days
- Marks unpaid `pending` orders older than 24 hours as `abandoned`
- Removes orphaned `order_items`

**Manual cleanup** (run anytime in Supabase SQL Editor):
```sql
SELECT * FROM public.cleanup_old_data();
```

**Check cleanup stats:**
```sql
SELECT * FROM public.get_cleanup_stats();
```

**Verify cron jobs are scheduled:**
```sql
SELECT * FROM cron.job WHERE jobname LIKE 'ghar-sajaoo%';
```

---

## Route Map

### Frontend Routes
| Path | Page | Auth Required |
|------|------|---------------|
| `/` | Home page | No |
| `/shop` | Product catalog | No |
| `/catalog` | Alias for /shop | No |
| `/product/:slug` | Product detail | No |
| `/checkout` | Checkout + Razorpay | No (guest allowed) |
| `/login` | Google OAuth login | No |
| `/profile` | User profile + orders | ✅ Yes |
| `/about` | Brand story | No |
| `/contact` | Contact form + FAQ | No |
| `/legal` | Privacy, Terms, Shipping, etc. | No |
| `/admin` | Admin dashboard | 🔑 Password |
| `/auth/callback` | OAuth redirect handler | No |

### Backend API Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | None | Health check |
| GET | `/api/products` | None | All products |
| GET | `/api/products/:slug` | None | Single product |
| POST | `/api/payment/create` | None | Create Razorpay order |
| POST | `/api/payment/verify` | Optional | Verify + save order |
| GET | `/api/orders` | JWT | User's orders |
| GET | `/api/orders/:id` | JWT | Single order |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/orders` | Admin | All orders |
| PATCH | `/api/admin/orders/:id/status` | Admin | Update order status |
| GET | `/api/admin/products` | Admin | All products |
| POST | `/api/admin/products` | Admin | Create product |
| PUT | `/api/admin/products/:id` | Admin | Update product |
| DELETE | `/api/admin/products/:id` | Admin | Soft-delete product |
| GET | `/api/admin/users` | Admin | All users |

---

## Troubleshooting

### Images not showing
- Ensure `frontend/images/` files are committed to git (not in `.gitignore`)
- Check exact filenames — `background image.png` must have a space
- In Vercel, static files in `public/` and `images/` are served automatically

### Google login not working
- Check Supabase → Auth → URL Configuration → Redirect URLs includes your domain
- Check Google Cloud Console → OAuth credentials → Authorized redirect URIs includes `https://xxxx.supabase.co/auth/v1/callback`

### Razorpay modal not opening
- Confirm `VITE_RAZORPAY_KEY_ID` starts with `rzp_test_` (or `rzp_live_` in production)
- The Razorpay checkout.js script is loaded in `index.html` — ensure it's not blocked by an ad blocker in dev

### Backend CORS errors
- Set `FRONTEND_URL` in backend `.env` to match your exact frontend URL (including `https://`)
- Check the `allowedOrigins` array in `backend/src/index.js`

### Supabase RLS blocking queries
- The backend uses the **service role key** which bypasses RLS
- The frontend uses the **anon key** which respects RLS
- If frontend data queries fail, check the RLS policies in `001_initial_schema.sql`

### Admin password not working
- Default password: `GharAdmin@2026`
- Ensure `ADMIN_PASSWORD` env var is set correctly on Railway/backend
- The frontend admin sends the password in `X-Admin-Password` header

---

## Production Checklist

Before going live:

- [ ] Change `ADMIN_PASSWORD` from the default
- [ ] Switch Razorpay from test keys to live keys
- [ ] Add custom domain in Vercel
- [ ] Set `VITE_APP_URL` and `FRONTEND_URL` to production domains
- [ ] Run SQL migrations on production Supabase project
- [ ] Enable pg_cron extension in Supabase
- [ ] Test a full checkout flow with a real payment
- [ ] Confirm Google OAuth redirect URLs include production domain
- [ ] Set `NODE_ENV=production` on Railway

---

## Color Reference

| Token | Hex | Usage |
|-------|-----|-------|
| `cream` | `#FBF7F0` | Page background |
| `brown` | `#8B4513` | Primary / CTAs |
| `gold` | `#D4A574` | Accents / borders |
| `dark` | `#1C0A00` | Deep headings |
| `amber` | `#C17F24` | Labels / highlights |
| `textbrown` | `#4A3728` | Body text |

---

## License

© 2026 Ghar Sajaoo Prints Limited. All rights reserved.

---

*Built with ❤️ for Indian artisans*
