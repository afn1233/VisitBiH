import logging
import uuid

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


def trigger_enrichment(link_id: uuid.UUID, url: str) -> None:
    """Fire-and-forget notify n8n that a new link needs checking. Best-effort only -
    a down or unconfigured n8n instance must never turn link creation into a 500;
    the link just stays `enrichment_status = "pending"` until (if ever) n8n calls
    back to POST /links/{id}/enrichment."""
    if not settings.n8n_webhook_url:
        return
    try:
        httpx.post(
            settings.n8n_webhook_url,
            json={"link_id": str(link_id), "url": url},
            timeout=3.0,
        )
    except httpx.HTTPError:
        logger.warning("n8n enrichment trigger failed for link %s", link_id, exc_info=True)
