# VisitBiH

Save and organize tourist locations in Bosnia and Herzegovina, grouped by city. Log in with just your email — no password, no signup form: your account is created automatically the first time you log in.

Two fully separate projects in one repo, each with its own dependencies and README:

- `backend/` — FastAPI API ([details](backend/README.md))
- `frontend/` — React UI ([details](frontend/README.md))

## What it does

- **Log in with just an email.** No password. Unknown emails are created as new users on the spot; either way you get back a JWT (7-day expiry) that authenticates every later request.
- **Save links per city.** Each saved location is a link with a city, title, URL, and optional description.
- **Manage your links.** Add, edit, and delete inline from the dashboard — always scoped to your own account.
- **See stats at a glance.** A live breakdown of how many links you've saved per city, computed on the fly (no separate stats table to keep in sync).
- **Get links checked automatically.** Leave the title blank and skip checking the URL yourself — an n8n workflow verifies it's reachable, fills in the page title, and grabs a preview image, all in the background after you hit save.
- **Ask questions about your saved links.** A search box on the dashboard finds the links that actually answer your question and has Claude summarize them, citing which ones it used.

## Tech stack

**Backend**
- FastAPI
- SQLAlchemy + Alembic (migrations)
- PostgreSQL
- Pydantic / `pydantic-settings`
- JWT auth (`python-jose` or equivalent)

**Frontend**
- React (Vite)
- Tailwind CSS
- Zustand (state management)

**Automation**
- n8n (self-hosted, via `docker-compose`) — link reachability checks, title/preview-image fetching

**AI / RAG**
- OpenAI embeddings (`text-embedding-3-small`) — no vector database, similarity search runs in plain Python over a plain array column
- Claude (Haiku 4.5, via the official `anthropic` SDK) — answers questions using the user's own matching saved links as context

## Setup / Run

**1. Start Postgres and the API (`backend/`):**
```
cd backend
docker compose up -d
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```
API is now running at `http://localhost:8000` (interactive docs at `/docs`). `docker compose up -d` also starts a local n8n instance at `http://localhost:5678` for link enrichment — see [backend/README.md](backend/README.md#link-enrichment-n8n) to wire up the workflow (optional; the app works fine without it, links just stay in a "pending" enrichment state).

**2. Start the frontend (`frontend/`):**
```
cd frontend
npm install
copy .env.example .env
npm run dev
```
App is now running at `http://localhost:5173`. Make sure `VITE_API_URL` in `frontend/.env` points at the running backend.

**3. Use it:**
Open `http://localhost:5173`, enter any email, and you're in. Add links with a city, title, URL, and optional description; edit or delete them inline; stats update automatically.

## How auth works

Login (`POST /auth/login`) takes only an email. The backend looks it up, creating a new user if none exists, and returns a JWT plus the user's profile. The frontend stores the token and sends it as `Authorization: Bearer <token>` on every request. The current user is always resolved from that verified token — never from anything in the request body or URL — and link ownership is checked per-request before any update or delete.

## Data model

Two tables: `users` (id, email, created_at) and `links` (id, user_id, city, title, url, description, enrichment_status, preview_image_url, checked_at, embedding, created_at, updated_at). See `backend/app/models/` for the SQLAlchemy definitions and `backend/alembic/versions/` for the migration history.

## Features

What's been built so far, beyond the core CRUD app:

- **Email-only auth** with auto-provisioning of new accounts and JWT-based session handling.
- **Per-city link organization** with inline add/edit/delete and a shared `LinkForm` component for both flows.
- **Live stats** summarizing saved links by city, computed from the user's links rather than stored separately.
- **Ownership enforcement** on every link mutation, independent of query filtering (`_get_owned_link_or_404` in `links.py`).
- **Link validation / enrichment via n8n.** After a link is created, an n8n workflow checks whether the URL is actually reachable, auto-fetches the page title if you left it blank, and grabs an Open Graph preview image when one exists — results show up on the link's card (a reachable/unreachable badge, plus a thumbnail) once n8n reports back. See [backend/README.md](backend/README.md#link-enrichment-n8n) for the workflow setup.
- **Ask your links (RAG), deliberately minimal.** Every link is embedded (OpenAI) on save; asking a question runs a plain cosine-similarity search in Python — no vector database — over the matching links, then Claude (Haiku 4.5) answers using only those as context. See [backend/README.md](backend/README.md#ask-your-links-rag) for the setup and the reasoning behind skipping a vector DB.

### AI-assisted development tooling

This project is also set up to use Claude Code's extended tooling during development:

- **Context7 MCP integration** — pulls current, version-accurate documentation for libraries and frameworks (FastAPI, SQLAlchemy, React, Tailwind, etc.) directly into the assistant's context instead of relying on training data, which helps with setup questions, API usage, and version migrations.
- **Playwright MCP integration** — drives a real browser to load the running frontend, take screenshots, and inspect the rendered page, so UI changes can be checked visually rather than just by reading code.
- **`ui-ux-reviewer` subagent** — opens a given screen with Playwright, takes a screenshot, and gives focused feedback (3-5 issues) on visual design, usability, and accessibility.
- **`backend-reviewer` subagent** — reviews FastAPI endpoint code for authorization, input validation, error handling, and secrets hygiene, with findings ranked by severity and specific file/line references.

## What's deliberately not here yet

The RAG feature is intentionally the simplest version that works: no vector database, no backfill step (a link saved before the OpenAI/Anthropic keys were set only becomes searchable once it's edited again), no chat history — one question in, one answer out. Mobile isn't in this repo yet either.
