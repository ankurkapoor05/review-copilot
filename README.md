# Review Copilot v3 — Supabase Edition

## What changed from v2
- ✅ **Real database** — User accounts, sessions, and reviews stored in Supabase (Postgres)
- ✅ **Works across all devices** — Log in on phone, tablet, laptop — same data everywhere
- ✅ **Secure passwords** — Supabase Auth handles hashing, sessions, token refresh
- ✅ **Real password reset** — Supabase sends actual reset emails
- ✅ **Row-Level Security** — Users can only ever read/write their own data
- ✅ **Per-user review isolation** — Reviews stored with user_id FK, RLS enforced at DB level

---

## Setup: 3 services, ~15 minutes

### Step 1 — Create Supabase project (free)
1. Go to **supabase.com** → New project
2. Choose a region close to your users
3. Save your database password somewhere safe
4. Wait ~2 minutes for project to provision

### Step 2 — Run the database schema
1. In your Supabase project → **SQL Editor** → **New query**
2. Paste the entire contents of **`supabase-schema.sql`**
3. Click **Run** (should show "Success. No rows returned")
4. Verify: go to **Table Editor** — you should see `profiles` and `reviews` tables

### Step 3 — Get your Supabase API keys
Go to **Project Settings → API** and copy:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public key** → `VITE_SUPABASE_ANON_KEY`

### Step 4 — Deploy to Vercel
```bash
git init && git add . && git commit -m "Review Copilot v3 - Supabase"
git remote add origin https://github.com/YOUR_USERNAME/review-copilot.git
git push -u origin main
```
Then: **vercel.com → New Project → Import from GitHub → Deploy**

### Step 5 — Set environment variables in Vercel
**Project → Settings → Environment Variables** — add all three:

| Variable | Value | Where to get it |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | `eyJh...` | Supabase → Settings → API |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | console.anthropic.com |

Set all three for **Production + Preview + Development** environments.

### Step 6 — Set Supabase redirect URL
So password reset emails link back to your app:
1. Supabase → **Authentication → URL Configuration**
2. Set **Site URL** to your Vercel URL: `https://your-project.vercel.app`
3. Add to **Redirect URLs**: `https://your-project.vercel.app/**`

### Step 7 — Redeploy
After adding env vars: **Vercel → Deployments → Redeploy**

**You're live! 🎉**

---

## Local development
```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase + Anthropic keys
npx vercel dev   # runs frontend + /api/claude together
```

---

## How the data model works

```
auth.users (Supabase managed)
    │
    ├─ profiles (1:1)
    │    id, name, biz, biz_type,
    │    google_connected, google_account
    │
    └─ reviews (1:many)
         id, user_id, author, avatar,
         rating, text, sentiment,
         replied, reply, flagged,
         created_at
```

**Row Level Security** means even if someone found your Supabase anon key, they could only read their own rows — never another user's data.

---

## Troubleshooting

**"Invalid login credentials"** — User doesn't exist or wrong password. Supabase doesn't distinguish between the two for security.

**Profile is null after signup** — The database trigger (`on_auth_user_created`) didn't fire. Re-run `supabase-schema.sql` in the SQL editor.

**Reviews not loading** — Check browser console for RLS errors. Make sure you ran the schema SQL including all the `create policy` statements.

**API key error** — Env vars were added but Vercel wasn't redeployed. Go to Deployments → Redeploy.
