# XDynamic Codebase Architecture

This repository now isolates each deployable surface so backend and frontend code no longer overlap.

## Components
- **Backend API** (`backend/`): FastAPI application, ML inference, auth, payments. Owns data (`backend/data/`) and model weights.
- **Extension** (`frontend/extension/`): Browser extension (React + Vite) that calls the API.
- **Admin Dashboard** (`frontend/admin-dashboard/`): Standalone React app for admin-facing features.
- **Callback Pages** (`frontend/callback-pages/`): Plain HTML pages for OAuth/payment redirects, served by the API at `/fe` in debug mode.

## Layout
```
backend/                # API + services
  app/                  # FastAPI code
  data/                 # Local sqlite data dir (created automatically)
  run.py                # Dev/prod runner (uses backend/.env)
frontend/
  extension/            # Chrome/Firefox extension
  admin-dashboard/      # Admin web app
  callback-pages/       # Static redirect pages (no build step)
docs/                   # Repo-level documentation
```

## Running
- Backend: `cd backend && python run.py --reload` (needs Python 3.8+, `.env`, model weights in `backend/`).
- Extension: `cd frontend/extension && npm install && npm run dev|build`.
- Admin: `cd frontend/admin-dashboard && npm install && npm run dev|build`.

## Boundaries
- Keep backend-only assets (DB, models) inside `backend/`. Paths are resolved relative to `backend/`, not the shell cwd.
- Frontend build artefacts (`dist/`, `node_modules/`) stay within each app and are git-ignored globally.
- Callback HTML lives outside `backend/` and is mounted read-only by FastAPI when `DEBUG=true`.

## Integration
- API base URL: frontends read `VITE_API_BASE_URL`; backend serves at `http://localhost:8000` by default.
- Callback host: backend `APP_URL` controls where OAuth/payment redirects land. In dev it targets `/fe` which serves `frontend/callback-pages/`.
- CORS: backend allows `*`, `chrome-extension://*`, `http://localhost:5173`, `http://localhost:3000` for local development.
- Auth flow: `/api/auth/google/callback` redirects to `${APP_URL}/auth/callback`; extension exchanges `code` via `/api/auth/google`.
- Payment flow: `/api/payment/success` redirects to `${APP_URL}/payment/success`; extension/dashboard can read params from that page.
