/**
 * api/claude.js  —  Vercel Serverless Function
 *
 * Proxies requests to the Anthropic API so the ANTHROPIC_API_KEY
 * is never exposed to the browser. All AI calls from the React app
 * hit POST /api/claude instead of calling Anthropic directly.
 *
 * Environment variables required (set in Vercel dashboard):
 *   ANTHROPIC_API_KEY   — your Anthropic API key
 *   ALLOWED_ORIGIN      — your production domain, e.g. https://review-copilot.vercel.app
 */

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean)

// Simple in-memory rate limiter (per serverless instance — use Redis/Upstash for multi-region)
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW_MS = 60_000   // 1 minute
const RATE_LIMIT_MAX_REQS  = 20       // max 20 AI calls per minute per IP

function checkRateLimit(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now }

  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, windowStart: now })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX_REQS) return false
  entry.count++
  rateLimitMap.set(ip, entry)
  return true
}

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  const origin = req.headers.origin || ''
  const isDev  = process.env.NODE_ENV !== 'production'

  if (isDev || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', isDev ? '*' : origin)
  } else if (ALLOWED_ORIGINS.length > 0) {
    return res.status(403).json({ error: 'Origin not allowed' })
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // ── Rate limit ─────────────────────────────────────────────────────────────
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown'
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' })
  }

  // ── Validate API key ───────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // ── Validate & sanitise body ───────────────────────────────────────────────
  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  // Only allow fields we know about — never forward arbitrary keys
  const { model, max_tokens, system, messages } = body || {}
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  // Cap max_tokens to prevent runaway costs
  const safeMaxTokens = Math.min(Number(max_tokens) || 1000, 2000)

  const payload = {
    model: model || 'claude-sonnet-4-20250514',
    max_tokens: safeMaxTokens,
    ...(system ? { system } : {}),
    messages,
  }

  // ── Proxy to Anthropic ─────────────────────────────────────────────────────
  try {
    const upstream = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      console.error('Anthropic error:', data)
      return res.status(upstream.status).json({ error: data?.error?.message || 'Anthropic API error' })
    }

    return res.status(200).json(data)

  } catch (err) {
    console.error('Proxy error:', err)
    return res.status(502).json({ error: 'Failed to reach AI service' })
  }
}
