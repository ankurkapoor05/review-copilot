# Review Copilot — Deployment Guide

## What was fixed in this build
- ✅ **Per-user reviews**: Each user's reviews are stored in their own `localStorage` key (`rc_reviews_<userId>`). New users get demo data seeded on first login; it's saved and isolated per account.
- ✅ **AI calls fixed**: The app now calls `/api/claude` (a Vercel serverless function) instead of Anthropic directly. Browsers block direct Anthropic calls with CORS errors — the proxy fixes this and keeps your API key server-side only.

---

## Deploy to Vercel (5 minutes)

### 1. Push to GitHub
```bash
cd review-copilot-prod
git init
git add .
git commit -m "Review Copilot v2 - fix API proxy and per-user data"
```
Create a repo at github.com/new, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/review-copilot.git
git push -u origin main
```

### 2. Import on Vercel
Go to **vercel.com → Add New Project → Import Git Repository**

Settings Vercel will auto-detect:
- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

Click **Deploy**.

### 3. Add your API key ← REQUIRED
After deploy, go to:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

Add this variable:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` (from console.anthropic.com) |

Set it for **Production**, **Preview**, and **Development** environments.

### 4. Redeploy
After adding the env var, you must redeploy:
- Go to **Deployments** tab → click the three dots on the latest deployment → **Redeploy**
- Or run: `npx vercel --prod`

**That's it — your app is live.**

---

## Test the API is working
After deploy, open your browser console on the live site and run:
```js
fetch('/api/claude', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    messages: [{role: 'user', content: 'Say "API working" in 3 words'}]
  })
}).then(r => r.json()).then(console.log)
```
You should see a response with `content[0].text`. If you see `"API key not set"`, the env var wasn't saved or the deployment wasn't re-triggered.

---

## Local development
```bash
npm install
npx vercel dev   # runs both frontend + API functions on localhost:3000
```
The `vercel dev` command reads your local `.env` file — create one:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## How per-user data works
Each user's reviews are stored under `localStorage` key `rc_reviews_<userId>`.
- New users get the 15 demo reviews seeded on first login
- Reviews they reply to, flag, or modify are saved immediately
- Logging out and back in preserves their exact state
- Different users on the same browser have fully separate review lists
