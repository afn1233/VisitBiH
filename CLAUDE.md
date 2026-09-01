# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

VisitBiH: save and organize tourist locations in Bosnia and Herzegovina, grouped by city. Two fully separate projects living in one repo, each with its own venv/deps and README:

- `backend/` — FastAPI + SQLAlchemy + Alembic + PostgreSQL
- `frontend/` — React (Vite) + Tailwind + Zustand

There are no tests and no linters configured in either project. Not present in this repo yet: mobile.

## Running locally

**Backend** (from `backend/`):
```
docker compose up -d              # Postgres
.venv\Scripts\activate
uvicorn app.main:app --reload     # http://localhost:8000, docs at /docs
```
After changing a model in `app/models/`, generate + apply a migration:
```
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
```

**Frontend** (from `frontend/`):
```
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

Both `.env` files are copied from `.env.example`; `frontend/.env`'s `VITE_API_URL` must point at the running backend.

## Architecture

### Auth model (drives everything else)

Login (`POST /auth/login`) takes only an email — no password. If the email is unknown, a user is created on the spot; either way a JWT (7-day expiry) comes back. The frontend sends it as `Authorization: Bearer <token>` on every subsequent request.

The critical invariant: **the current user is always resolved from the verified JWT, never from anything in the request body or URL.** `app/deps.py`'s `get_current_user` decodes the token and loads the user; every router depends on it rather than accepting a user id as a param. `links.py`'s `_get_owned_link_or_404` further checks `link.user_id == user.id` before any update/delete — ownership is enforced per-request, not by query filtering alone. Preserve this pattern for any new endpoint that touches user-owned data.

### Backend request flow

`routers/` (HTTP layer, depends on `deps.get_current_user` + `db.session.get_db`) → `crud/` (plain functions, all DB access) → `models/` (SQLAlchemy ORM). `schemas/` (Pydantic) define request/response shapes and are kept separate from ORM models. Settings (`core/config.py`) load from `.env` via `pydantic_settings`; JWT encode/decode lives in `core/security.py`.

Two tables: `users` (id, email, created_at) and `links` (id, user_id, city, title, url, description, created_at, updated_at) — see `backend/alembic/versions/` for the migration history. `links` is intentionally one clean row per link, addressable by UUID, so it doesn't need reshaping if AI/RAG features get added later — there's no such feature yet, don't build toward it speculatively.

Stats (`routers/stats.py`) are computed on the fly from the user's links (`Counter` over city names) — there's no separate stats table.

### Frontend structure

`App.jsx` picks `Welcome` (login) vs `Dashboard` purely on whether `useAuthStore` has a token — that's the whole routing story, there's no router library. `store/` holds two Zustand stores: `useAuthStore` (token/user, persisted to `localStorage`) and `useLinksStore` (links/stats). All backend calls go through `src/api/*` — `client.js` is a shared fetch wrapper (attaches the bearer token, throws on non-2xx using the backend's `detail` message); components never call `fetch` directly. `LinkForm` is shared between the add and edit flows.
