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
