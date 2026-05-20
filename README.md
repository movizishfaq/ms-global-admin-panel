# ms-global-admin-panel

Owner **Site Studio** for MS-GLOBAL — edit and publish the public shop website.

- **Not** the customer shop (see [Ms-Global](https://github.com/movizishfaq/Ms-Global))
- **Not** the API (see [ms-global-server](https://github.com/movizishfaq/ms-global-server))

## Owner access

1. Deploy this repo on Vercel (build: `npm run build:studio`).
2. Set environment variables (see below).
3. Open **`/admin`** on the studio URL and sign in with an **admin** account (`npm run seed:admin` in the API repo).

## Vercel settings

| Setting | Value |
|---------|--------|
| Build command | `npm run build:studio` |
| Output directory | `dist` |
| Framework | Vite |

## Environment variables (Production)

```
VITE_APP_MODE=studio
VITE_API_URL=https://YOUR-API-URL
VITE_PUBLIC_SITE_URL=https://ms-global-zeta.vercel.app
VITE_STUDIO_URL=https://YOUR-STUDIO-VERCEL-URL
```

Redeploy after changing env vars.

## Local development

```bash
npm install
# Terminal 1 — API (ms-global-server repo or ../MS-Global/server)
# Terminal 2:
npm run dev:studio
```

Open http://localhost:5174/admin

## Related repos

| Repo | Purpose |
|------|---------|
| [Ms-Global](https://github.com/movizishfaq/Ms-Global) | Public shop |
| [ms-global-server](https://github.com/movizishfaq/ms-global-server) | API + MongoDB |
| **ms-global-admin-panel** (this repo) | Owner website editor |

When you change editor UI code, update **Ms-Global** and this repo (same frontend codebase).
