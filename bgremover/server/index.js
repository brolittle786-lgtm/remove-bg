require('dotenv').config()

const express = require('express')
const cors    = require('cors')
const path    = require('path')

const removeRoute = require('./routes/remove')

const app  = express()
const PORT = process.env.PORT || 4000

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api', removeRoute)

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CutOut Background Remover API',
    time: new Date().toISOString(),
  })
})

// ─── 404 handler ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

// ─── Global error handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err)
  res.status(500).json({ error: 'Internal server error. Please try again.' })
})

// ─── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ CutOut server running on http://localhost:${PORT}`)
  if (!process.env.REMOVE_BG_API_KEY) {
    console.warn('⚠  REMOVE_BG_API_KEY is not set in .env — background removal will fail.')
  }
})
