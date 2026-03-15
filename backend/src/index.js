import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

// Route imports
import productsRouter from './routes/products.js'
import paymentRouter from './routes/payment.js'
import ordersRouter from './routes/orders.js'
import adminRouter from './routes/admin.js'
import seedRouter from './routes/seed.js'

const app = express()
const PORT = process.env.PORT || 5000

/* ── Security Middleware ────────────────────────── */
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Needed for Razorpay modal
}))

/* ── CORS ───────────────────────────────────────── */
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://gharsajaoo.com',
  'https://www.gharsajaoo.com',
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Password'],
}))

/* ── Rate Limiting ──────────────────────────────── */
// General API limit
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
}))

// Stricter limit for payment endpoints
app.use('/api/payment', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many payment requests, please wait before retrying.' },
}))

/* ── Body Parsing ───────────────────────────────── */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/* ── Logging ────────────────────────────────────── */
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

/* ── Health Check ───────────────────────────────── */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Ghar Sajaoo API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  })
})

/* ── API Routes ─────────────────────────────────── */
app.use('/api/products', productsRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/admin', adminRouter)
app.use('/api/admin', seedRouter)

/* ── 404 Handler ────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
})

/* ── Global Error Handler ───────────────────────── */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)

  // CORS error
  if (err.message?.startsWith('CORS blocked')) {
    return res.status(403).json({ error: err.message })
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
  })
})

/* ── Start Server ───────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n🏠  Ghar Sajaoo API running on port ${PORT}`)
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Health check: http://localhost:${PORT}/health`)
  console.log(`   API base    : http://localhost:${PORT}/api\n`)
})

export default app
