/**
 * api/claude.js — Vercel Serverless Function
 * Secure proxy: keeps ANTHROPIC_API_KEY server-side only.
 * Set in Vercel → Project → Settings → Environment Variables
 */
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set in Vercel environment variables." });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Invalid JSON" }); } }

  const { model, max_tokens, system, messages } = body || {};
  if (!messages?.length) return res.status(400).json({ error: "messages array required" });

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: model || "claude-sonnet-4-20250514", max_tokens: Math.min(Number(max_tokens)||1000, 4096), messages, ...(system ? { system } : {}) }),
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: data?.error?.message || "Anthropic error" });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Failed to reach Anthropic: " + err.message });
  }
};
