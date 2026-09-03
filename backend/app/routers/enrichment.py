import secrets
import uuid

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.crud import link as link_crud
from app.db.session import get_db
from app.schemas.enrichment import LinkEnrichmentIn
from app.schemas.link import LinkOut

# Deliberately its own router/file, not folded into links.py: every endpoint there
# depends on get_current_user and pairs get_by_id with an ownership check. This
# endpoint has no user context at all - n8n has no JWT to present - so it's
# authenticated by a shared secret instead, keyed by link id alone. That's a
# narrow, intentional exception to this app's "resolve user from JWT" invariant.
router = APIRouter(prefix="/links", tags=["enrichment"])


def verify_enrichment_secret(x_enrichment_secret: str = Header(...)) -> None:
    if not settings.link_enrichment_api_key or not secrets.compare_digest(
        x_enrichment_secret, settings.link_enrichment_api_key
    ):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid enrichment secret")


@router.post("/{link_id}/enrichment", response_model=LinkOut)
def receive_enrichment(
    link_id: uuid.UUID,
    payload: LinkEnrichmentIn,
    db: Session = Depends(get_db),
    _: None = Depends(verify_enrichment_secret),
):
    link = link_crud.get_by_id(db, link_id)
    if link is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found")
    return link_crud.set_enrichment(db, link, payload)
