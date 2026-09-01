from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.crud.user import get_or_create
from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Log in by email, auto-registering a new user on first sign-in."""
    email = payload.email.lower()
    user, _created = get_or_create(db, email)
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token, user=user)
