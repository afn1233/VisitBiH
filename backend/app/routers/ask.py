from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.ask import AskRequest, AskResponse
from app.services.rag import answer_question

router = APIRouter(prefix="/ask", tags=["ask"])


@router.post("", response_model=AskResponse)
def ask(
    payload: AskRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Ask a question about the current user's own saved links. Unlike the
    n8n enrichment callback, this is a normal user-initiated action with a
    real logged-in user - scoped to user.id like every other endpoint here,
    never trusting an id from the request."""
    try:
        answer, sources = answer_question(db, user.id, payload.question)
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))
    return AskResponse(answer=answer, sources=sources)
