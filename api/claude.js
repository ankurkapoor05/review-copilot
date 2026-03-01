/**
 * api/claude.js  —  Vercel Serverless Function (CommonJS)
 *
 * Secure proxy between your React app and the Anthropic API.
 * The ANTHROPIC_API_KEY env var is read here — it never reaches the browser.
 *
 * Set in Vercel dashboard → Project → Settings → Environment Variables:
 *   ANTHROPIC_API_KEY   your key from console.anthropic.com
 */

module.exports = async function handler(req, res) {
  // ── CORS: allow all origins (lock down to your domain in production if desired)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Check API key is configured
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[claude proxy] ANTHROPIC_API_KEY is not set");
    return res.status(500).json({
      error: "Server misconfiguration: API key not set. Add ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables, then redeploy."
    });
  }

  // ── Parse + validate body
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }

  const { model, max_tokens, system, messages } = body || {};
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const payload = {
    model: model || "claude-sonnet-4-20250514",
    max_tokens: Math.min(Number(max_tokens) || 1000, 4096),
    messages,
    ...(system ? { system } : {}),
  };

  // ── Proxy to Anthropic
  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      console.error("[claude proxy] Anthropic error:", upstream.status, data);
      return res.status(upstream.status).json({
        error: data?.error?.message || `Anthropic returned ${upstream.status}`
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("[claude proxy] fetch error:", err.message);
    return res.status(502).json({ error: "Failed to reach Anthropic API: " + err.message });
  }
};
