import math
import uuid

from anthropic import Anthropic
from sqlalchemy.orm import Session

from app.core.config import settings
from app.crud import link as link_crud
from app.models.link import Link
from app.services.embeddings import embed_text

_ANSWER_MODEL = "claude-haiku-4-5-20251001"
_TOP_K = 5
_MIN_SIMILARITY = 0.15  # below this, nothing saved is actually relevant
_NO_MATCH_ANSWER = "I couldn't find anything in your saved links that answers this."


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    """Plain Python, no numpy - one less dependency, and fast enough for the
    handful-of-links-per-question comparisons this app ever does."""
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def _top_matches(question_embedding: list[float], candidates: list[Link]) -> list[Link]:
    scored = [(link, _cosine_similarity(question_embedding, link.embedding)) for link in candidates]
    scored.sort(key=lambda pair: pair[1], reverse=True)
    return [link for link, score in scored[:_TOP_K] if score >= _MIN_SIMILARITY]


def _build_prompt(question: str, links: list[Link]) -> str:
    context = "\n\n".join(
        f"- {link.title or link.url} ({link.city}): {link.description or 'no description'} [{link.url}]"
        for link in links
    )
    return (
        "Answer the question using ONLY the saved links below. If none of them "
        "actually answer it, say so plainly rather than guessing.\n\n"
        f"Saved links:\n{context}\n\nQuestion: {question}"
    )


def answer_question(db: Session, user_id: uuid.UUID, question: str) -> tuple[str, list[Link]]:
    """Returns (answer, sources). Raises RuntimeError if OPENAI_API_KEY /
    ANTHROPIC_API_KEY aren't configured - the router turns that into a clear
    error response rather than a crash."""
    if not settings.openai_api_key or not settings.anthropic_api_key:
        raise RuntimeError(
            "Ask your links isn't configured - set OPENAI_API_KEY and ANTHROPIC_API_KEY."
        )

    question_embedding = embed_text(question)
    candidates = link_crud.get_embedded_for_user(db, user_id)
    matches = _top_matches(question_embedding, candidates)

    if not matches:
        return _NO_MATCH_ANSWER, []

    client = Anthropic(api_key=settings.anthropic_api_key)
    response = client.messages.create(
        model=_ANSWER_MODEL,
        max_tokens=1024,
        messages=[{"role": "user", "content": _build_prompt(question, matches)}],
    )
    answer = "".join(block.text for block in response.content if block.type == "text")
    return answer, matches
