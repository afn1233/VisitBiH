from sqlalchemy.orm import Session

from app.models.user import User


def get_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_by_id(db: Session, user_id: str) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def create(db: Session, email: str) -> User:
    user = User(email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_or_create(db: Session, email: str) -> tuple[User, bool]:
    """Return (user, created) - looks up by email, creating one if none exists."""
    user = get_by_email(db, email)
    if user:
        return user, False
    return create(db, email), True
