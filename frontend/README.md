<!-- markdownlint-disable -->
# Frontend Apps

This folder contains three independent frontends. Each has its own toolchain and
`node_modules`/`dist` lives locally inside the respective subfolder.

## 1) Browser Extension (`frontend/extension`)
- Stack: React + TypeScript + Vite, Chrome/Firefox MV3.
- Env: copy `.env.example` to `.env`, set `VITE_API_BASE_URL` to your backend and
  `VITE_GOOGLE_CLIENT_ID` if you use Google OAuth.
- Commands:
  - `npm install`
  - `npm run dev` (dev server / HMR)
  - `npm run build` (outputs to `dist/`)

## 2) Admin Dashboard (`frontend/admin-dashboard`)
- Stack: React + TypeScript + Vite.
- Env: copy `.env.example` to `.env`, set `VITE_API_BASE_URL` to your backend.
- Commands:
  - `npm install`
  - `npm run dev` (typically http://localhost:5173)
  - `npm run build`

## 3) Callback Pages (`frontend/callback-pages`)
- Static HTML (no build). Used for OAuth/payment redirects when served by
  FastAPI at `/fe` in DEBUG mode. Host elsewhere if you prefer and update
  `APP_URL` in `backend/.env`.

## Tips
- Keep API base URLs consistent across all `.env` files.
- Backend redirects (OAuth/payment) use `APP_URL` (set in `backend/.env`); make sure it matches where callback pages are hosted.
- Do not share `node_modules` between apps; install per folder.
- Build artefacts remain inside each app to avoid cross-contamination with the backend.
