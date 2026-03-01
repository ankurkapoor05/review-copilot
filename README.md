# Review Copilot ✦

> AI-powered Google Review management dashboard — built with React + Vite, deployed on Vercel.

## Live Features
- 🔐 **Auth** — Sign up, login, forgot password (localStorage-backed; swap for Supabase in production)
- 🔗 **Google Business OAuth** — Connect/disconnect/reconnect your Google Business Profile
- 📊 **Dashboard** — Real-time stats with time-period filtering (1 week → 3 years)
- 💬 **AI Replies** — Generate & post responses with tone control (Claude Sonnet)
- 🧠 **Business Insights** — AI-powered analysis: what's working, what's not, how to improve
- 🔔 **Email Notifications** — Trigger alerts for negative/neutral/all reviews
- 🤖 **Auto-Reply Copilot** — Automatically reply to positive/neutral/negative reviews
- 🗑 **Account Management** — Disconnect Google, delete account

---

## 🚀 Deploy to Vercel in 5 Minutes

### Prerequisites
- [Node.js 18+](https://nodejs.org)
- [Git](https://git-scm.com)
- A free [Vercel account](https://vercel.com)
- An [Anthropic API key](https://console.anthropic.com)

---

### Step 1 — Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
# Create a repo at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/review-copilot.git
git push -u origin main
```

### Step 3 — Deploy to Vercel
```bash
vercel
```
Follow the prompts:
- Link to existing project? **No** → create new
- Project name: `review-copilot`
- Framework: **Vite** (auto-detected)
- Build command: `npm run build` (default)
- Output dir: `dist` (default)

Or deploy directly from GitHub at **vercel.com → New Project → Import from GitHub**.

### Step 4 — Set Environment Variables
In the Vercel dashboard → **Project → Settings → Environment Variables**, add:

| Variable | Value | Environments |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Production, Preview, Development |
| `ALLOWED_ORIGIN` | `https://your-project.vercel.app` | Production |

> 💡 Get your API key at [console.anthropic.com](https://console.anthropic.com)

### Step 5 — Redeploy
After adding env vars, trigger a redeploy:
```bash
vercel --prod
```

**Your app is live! 🎉**

---

## 🔧 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create local env file
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 3. Start dev server (React on :3000, proxies /api to :3001)
npm run dev
```

The Vite dev server proxies `/api/*` requests to `http://localhost:3001`. In local dev, Vercel serverless functions aren't available directly — use `vercel dev` instead:

```bash
# Runs both frontend and API functions locally
npx vercel dev
```

---

## 🏗 Architecture

```
review-copilot/
├── index.html              # HTML entry point
├── vite.config.js          # Vite build + dev proxy config
├── vercel.json             # Vercel deployment + security headers
├── package.json
├── .env.example            # Template for environment variables
├── api/
│   └── claude.js           # ⭐ Serverless function — API key lives HERE only
│                           #    Handles CORS, rate limiting, input validation
└── src/
    ├── main.jsx            # React root
    └── App.jsx             # Full application (auth + dashboard + all views)
```

### Security Model
```
Browser (React)  →  POST /api/claude  →  Vercel Serverless  →  Anthropic API
                         ↑                      ↑
                   No API key here         Key lives here only
                                           (env var, never in code)
```

The `api/claude.js` function:
- ✅ Validates request origin (CORS)
- ✅ Rate-limits per IP (20 req/min)
- ✅ Sanitises and caps request parameters
- ✅ Never exposes the API key to clients

---

## 🔄 Swap Demo Auth for Real Auth (Optional)

The current auth stores users in `localStorage` — great for demos, not for production with multiple devices/users. To use a real database:

### Option A: Supabase (recommended, free tier)
```bash
npm install @supabase/supabase-js
```
1. Create a project at [supabase.com](https://supabase.com)
2. Enable **Email Auth** under Authentication
3. Replace `getUsers`/`saveUsers`/`getSession` helpers with Supabase calls
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to env vars

### Option B: Firebase Auth
```bash
npm install firebase
```
Use `createUserWithEmailAndPassword` / `signInWithEmailAndPassword`.

---

## 🔗 Real Google Business Profile API

The Google connect flow is currently simulated. To wire up real OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable **Business Profile API**
3. Create OAuth 2.0 credentials (Web application)
4. Add your Vercel URL to Authorised Redirect URIs
5. Create `api/google-auth.js` to handle the OAuth callback and store tokens
6. Call `https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews`

---

## 💰 Estimated Running Costs

| Service | Free Tier | Paid |
|---|---|---|
| Vercel (hosting) | 100GB bandwidth/mo | ~$20/mo Pro |
| Anthropic API | Pay-per-use | ~$0.003 per AI reply |
| Supabase (auth/db) | 500MB, 50k MAU | $25/mo Pro |
| Custom domain | — | ~$12/year |

A typical small business using 50 AI replies/day costs roughly **$4–6/month** in API fees.

---

## 📄 License
MIT
