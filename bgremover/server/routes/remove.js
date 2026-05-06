const express  = require('express')
const multer   = require('multer')
const axios    = require('axios')
const FormData = require('form-data')

const router = express.Router()

// ─── Multer: store file in memory (no disk I/O needed) ────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and WebP images are supported.'))
    }
    cb(null, true)
  },
})

// ─── POST /api/remove-bg ──────────────────────────────────────────────────
router.post('/remove-bg', upload.single('image'), async (req, res) => {
  // 1. Validate file presence
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' })
  }

  // 2. Validate API key
  const apiKey = process.env.REMOVE_BG_API_KEY
  if (!apiKey) {
    return res.status(503).json({
      error: 'Background removal service is not configured. Please set REMOVE_BG_API_KEY.',
    })
  }

  try {
    // 3. Build multipart form for remove.bg
    const form = new FormData()
    form.append('image_file', req.file.buffer, {
      filename: req.file.originalname || 'image.png',
      contentType: req.file.mimetype,
    })
    form.append('size', 'auto')    // let remove.bg choose best output size

    // 4. Call remove.bg API
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
      headers: {
        'X-Api-Key': apiKey,
        ...form.getHeaders(),
      },
      responseType: 'arraybuffer',
      timeout: 60000, // 60s timeout
    })

    // 5. Convert binary response to base64 data URL
    const base64 = Buffer.from(response.data).toString('base64')
    const dataUrl = `data:image/png;base64,${base64}`

    return res.json({ imageUrl: dataUrl })

  } catch (err) {
    // ── Handle remove.bg API errors gracefully ──────────────────────────
    if (err.response) {
      const status = err.response.status

      // remove.bg sends errors as JSON even when responseType is arraybuffer
      let errorMessage = 'Background removal failed.'
      try {
        const bodyText = Buffer.from(err.response.data).toString('utf8')
        const parsed   = JSON.parse(bodyText)
        const apiError = parsed?.errors?.[0]?.title || parsed?.message
        if (apiError) errorMessage = apiError
      } catch (_) { /* ignore parse error */ }

      if (status === 402) {
        return res.status(402).json({
          error: 'API credit limit reached. Please check your remove.bg account.',
        })
      }
      if (status === 403) {
        return res.status(403).json({
          error: 'Invalid API key. Please check your REMOVE_BG_API_KEY in .env.',
        })
      }
      if (status === 429) {
        return res.status(429).json({
          error: 'Too many requests. Please wait a moment and try again.',
        })
      }
      if (status === 400) {
        return res.status(400).json({
          error: `Invalid image: ${errorMessage}`,
        })
      }

      return res.status(status).json({ error: errorMessage })
    }

    // Network / timeout error
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'The request timed out. Your image may be too large — please try a smaller one.',
      })
    }

    console.error('[remove-bg] Unexpected error:', err.message)
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again.',
    })
  }
})

// ─── Multer error handler ─────────────────────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large. Maximum size is 25 MB.' })
    }
    return res.status(400).json({ error: err.message })
  }
  if (err?.message) {
    return res.status(400).json({ error: err.message })
  }
  next(err)
})

module.exports = router
