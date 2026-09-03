from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import ask, auth, enrichment, links, stats

app = FastAPI(title="VisitBiH API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(links.router)
app.include_router(enrichment.router)
app.include_router(stats.router)
app.include_router(ask.router)


@app.get("/health")
def health():
    return {"status": "ok"}
