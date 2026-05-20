# Deploy: public website + owner control panel (two Vercel projects)

You can use **one GitHub repo** twice on Vercel (recommended), or **two GitHub repos** with the same code. Each Vercel project gets different build settings and environment variables.

You also need the **API** (`server/`) running somewhere with MongoDB (Railway, Render, Fly.io, VPS, etc.).

---

## Architecture

| Deploy | Vercel project | Build | Who uses it |
|--------|----------------|-------|-------------|
| **Website** | `ms-global-shop` (example) | `npm run build:storefront` | Customers |
| **Control panel** | `ms-global-studio` (example) | `npm run build:studio` | Owner (admin login) |
| **API** | Not Vercel (Node server) | `npm run build` in `server/` | Both frontends |

---

## 1. Deploy the API first

1. Host `server/` (Node 20+, MongoDB Atlas URI in env).
2. Set server env (see `server/.env.example`):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PUBLIC_SITE_URL` = your **shop** Vercel URL (after step 2)
   - `STUDIO_URL` = your **studio** Vercel URL (after step 3)
   - `FRONTEND_URL` = shop URL (or comma list of both origins)
3. Run `npm run seed:admin` once to create the owner account.
4. Note the API base URL, e.g. `https://ms-global-api.onrender.com`.

---

## 2. Vercel — public website (repo #1 or project A)

**Import** your GitHub repo in Vercel → **New Project**.

| Setting | Value |
|---------|--------|
| Framework | Vite |
| Root directory | `.` (repo root) |
| Build command | `npm run build:storefront` |
| Output directory | `dist` |

Or copy `vercel.json` from this repo (already set for storefront).

**Environment variables** (Vercel → Settings → Environment Variables):

```
VITE_APP_MODE=storefront
VITE_API_URL=https://YOUR-API-URL
VITE_PUBLIC_SITE_URL=https://YOUR-SHOP.vercel.app
```

Use the real shop URL after the first deploy (then redeploy).

Deploy. Customers only see the shop; `/admin` redirects home.

---

## 3. Vercel — owner control panel (repo #2 or project B)

**Second** Vercel project from the **same repo** (or second GitHub repo with identical code).

| Setting | Value |
|---------|--------|
| Framework | Vite |
| Root directory | `.` |
| Build command | `npm run build:studio` |
| Output directory | `dist` |

If Vercel does not read a second config file, set the build command manually (do **not** use the default `npm run build` from the shop project).

**Environment variables:**

```
VITE_APP_MODE=studio
VITE_API_URL=https://YOUR-API-URL
VITE_PUBLIC_SITE_URL=https://YOUR-SHOP.vercel.app
VITE_STUDIO_URL=https://YOUR-STUDIO.vercel.app
```

Optional — lock studio to your studio hostname only:

```
VITE_STUDIO_HOSTS=your-studio.vercel.app,studio.yourdomain.com
```

Deploy. Only **admin** users can sign in; everyone else is blocked.

---

## 4. Two separate GitHub repositories

If you use **two repos** (same codebase in each):

1. **Repo A (website)** — push code, connect to Vercel project A with settings in §2.
2. **Repo B (control panel)** — push the **same** code, connect to Vercel project B with settings in §3.

Keep both repos in sync when you change code (or use one repo + two Vercel projects instead).

---

## 5. After deploy — owner workflow

1. Open **studio** URL → sign in with admin email/password.
2. Edit site → **Publish to live** (saves to MongoDB).
3. Open **shop** URL → visitors see the published site.

Preview in the studio iframe uses `VITE_PUBLIC_SITE_URL` (the shop domain).

---

## 6. Local check (before Vercel)

```bash
npm run dev:api
npm run dev              # shop  → http://localhost:5173
npm run dev:studio       # studio → http://localhost:5174
```

---

## Quick checklist

- [ ] API live + `MONGODB_URI` set  
- [ ] Admin user seeded (`npm run seed:admin` in `server/`)  
- [ ] Vercel **shop** project: `VITE_APP_MODE=storefront` + `VITE_API_URL`  
- [ ] Vercel **studio** project: `VITE_APP_MODE=studio` + same `VITE_API_URL`  
- [ ] `PUBLIC_SITE_URL` / `STUDIO_URL` on API match both Vercel URLs  
- [ ] Redeploy shop after URLs are final  

When you have the two GitHub repo URLs, add them as Vercel Git connections and plug the deployed URLs into the env vars above.
