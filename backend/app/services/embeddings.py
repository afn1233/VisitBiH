from openai import OpenAI

from app.core.config import settings

_EMBEDDING_MODEL = "text-embedding-3-small"


def embed_text(text: str) -> list[float] | None:
    """Embed a string for similarity search. Returns None if OPENAI_API_KEY
    isn't configured - callers should skip storing/searching silently, same
    degrade-gracefully pattern as the n8n enrichment trigger."""
    if not settings.openai_api_key:
        return None
    client = OpenAI(api_key=settings.openai_api_key)
    response = client.embeddings.create(model=_EMBEDDING_MODEL, input=text)
    return response.data[0].embedding


def link_embedding_text(city: str, title: str | None, url: str, description: str | None) -> str:
    """Build the text a link is embedded from - kept as one place so
    create/update and any future re-embedding stay consistent."""
    parts = [title or url, f"in {city}"]
    if description:
        parts.append(description)
    return ". ".join(parts)
