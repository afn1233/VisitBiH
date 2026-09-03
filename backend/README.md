# VisitBiH — Backend

FastAPI + SQLAlchemy + Alembic + PostgreSQL.

## Project structure

```
backend/
  app/
    main.py        # FastAPI app, CORS, router registration
    core/          # settings (config.py) and JWT helpers (security.py)
    db/            # SQLAlchemy engine/session (session.py) and declarative base (base.py)
    models/        # SQLAlchemy ORM models (User, Link)
    schemas/       # Pydantic request/response models
    routers/       # route handlers (auth, links, stats)
    crud/          # plain functions that talk to the DB for each model
    deps.py        # get_current_user - resolves the caller from their Bearer token
  alembic/         # migrations
  requirements.txt
  .env.example
  docker-compose.yml
```

## Setup

1. **Start Postgres:**
   ```
   docker compose up -d
   ```

2. **Create a virtualenv and install dependencies:**
   ```
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```
   copy .env.example .env
   ```
   The defaults in `.env.example` already match `docker-compose.yml`. Change `JWT_SECRET` to a random value for anything beyond local dev.

4. **Run migrations:**
   ```
   alembic upgrade head
   ```

5. **Run the API:**
   ```
   uvicorn app.main:app --reload
   ```

   The API is now at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## Making schema changes later

After editing a model in `app/models/`, generate a new migration and apply it:
```
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
```

## Auth model

Login (`POST /auth/login`) takes just an email. If no user with that email exists, one is created automatically (frictionless signup) - either way, a JWT is returned. Send it back on every other request as `Authorization: Bearer <token>`. The token's subject is the only source of the current user's identity; nothing in the request body or URL is ever trusted for that.

## Link enrichment (n8n)

When a link is created, the API fires a best-effort, fire-and-forget request to an n8n workflow, which checks whether the URL is reachable and, if so, fetches the page's `<title>` (only used if you left the title blank) and its Open Graph preview image. n8n reports back by calling `POST /links/{id}/enrichment` with a shared secret - this is the one endpoint in the app that isn't JWT-authenticated, since n8n has no user identity; it's guarded by the `LINK_ENRICHMENT_API_KEY` header instead.

If `N8N_WEBHOOK_URL` is unset, this is a no-op - links are created normally and just stay `enrichment_status: "pending"` forever. Nothing else in the app depends on enrichment succeeding.

### Setup

1. **Start n8n** (already included in `docker-compose.yml`):
   ```
   docker compose up -d
   ```
   n8n's editor is now at `http://localhost:5678` (login `admin` / whatever you set `N8N_BASIC_AUTH_PASSWORD` to).

2. **Set the shared secret** in `.env` - `LINK_ENRICHMENT_API_KEY` should be a random value both this app and the n8n workflow (step 4 below) use.

3. **Build the workflow** in the n8n editor. Easiest: import `backend/n8n/link-enrichment.workflow.json` directly (Workflows → ⋮ menu → **Import from File**) - it's the complete 6-node workflow described below, ready to go. Or build it by hand:
   1. **Webhook** node (trigger) - `POST`, path `link-check`, "Respond" = `Immediately`. Receives `{ link_id, url }`.
   2. **HTTP Request** node - `GET {{$json.body.url}}` (the Webhook node nests the incoming POST body under `body`, not at the top level - a common gotcha), with **On Error** set to `Continue Using Error Output` (so a dead link/timeout/DNS failure produces a second, distinct output instead of halting the workflow) and a bounded timeout (~10s).
   3. **Reachable branch** (the node's regular/success output): **HTML** node (`extractHtmlContent` operation) pulling `title` (selector `title`) and `meta[property="og:image"]` → `content` attribute, both best-effort - then a **Set** (Edit Fields) node shaping `{ is_reachable: true, title, preview_image_url }`.
   4. **Unreachable branch** (the node's error output): a **Set** node shaping `{ is_reachable: false, title: "", preview_image_url: "" }` directly - no HTML to extract from.
   5. Both branches converge into a final **HTTP Request** node - `POST http://host.docker.internal:8000/links/{{ $('Webhook').first().json.body.link_id }}/enrichment`, header `X-Enrichment-Secret` set from an `$env.LINK_ENRICHMENT_API_KEY` expression (add `LINK_ENRICHMENT_API_KEY` to the `n8n` service's `environment:` in `docker-compose.yml`, matching your `.env` value; also set `N8N_BLOCK_ENV_ACCESS_IN_NODE: "false"` there - recent n8n versions block `$env` in node expressions by default), JSON body `={{ $json }}` (whatever the upstream Set node shaped). (`host.docker.internal` because the backend runs on the host via `uvicorn --reload`, not inside the n8n container's network - `localhost` from inside that container would mean the container itself. Use `.first()` rather than `.item` when referencing the Webhook node from downstream branches - `.item`'s paired-item tracking can silently break through Set/HTML nodes and resolve to nothing.)

4. **Point the backend at the workflow** - set `N8N_WEBHOOK_URL` in `.env` to the Webhook node's URL (n8n shows this in the node's panel, something like `http://localhost:5678/webhook/link-check`).

5. **Publish the workflow** after any node edit - this n8n version has a draft/publish model where the production webhook runs the last *published* version, not unsaved editor changes (the "Publish" button in the top right shows an orange dot when there are unpublished changes).

Test the callback in isolation without n8n:
```
curl -X POST http://localhost:8000/links/<id>/enrichment \
  -H "X-Enrichment-Secret: <value from .env>" \
  -H "Content-Type: application/json" \
  -d '{"is_reachable": true, "title": "Example", "preview_image_url": "https://example.com/img.png"}'
```

## Ask your links (RAG)

A search box on the dashboard: ask a question in plain language, and the API finds your own saved links that are semantically relevant and has Claude write an answer, citing which links it used.

Deliberately minimal - no vector database. Each link's embedding is stored as a plain array column on `links` and compared with the question's embedding via plain-Python cosine similarity at question time, which is fast enough at personal-bookmark scale. No new container, no `docker-compose.yml` changes.

- **Embeddings**: OpenAI `text-embedding-3-small`, computed on every link create/edit (`app/services/embeddings.py`).
- **Answer generation**: Claude Haiku 4.5 via the official `anthropic` SDK, given the question plus the top-matching links as context (`app/services/rag.py`).
- **Endpoint**: `POST /ask` - unlike the n8n callback, this is a normal JWT-authenticated, user-scoped endpoint (`{"question": "..."}` in, `{"answer": "...", "sources": [...]}` out).

### Setup

Set both keys in `.env`:
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```
Leave either blank to disable the feature entirely - links still save normally (just without an embedding), and `/ask` returns a clear 503 instead of crashing. Links saved before the keys were set won't be searchable until edited (which re-embeds them) - there's no backfill step in this minimal version.
