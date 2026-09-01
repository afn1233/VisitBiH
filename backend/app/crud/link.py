import uuid

from sqlalchemy.orm import Session

from app.models.link import Link
from app.schemas.link import LinkCreate, LinkUpdate


def get_all_for_user(db: Session, user_id: uuid.UUID) -> list[Link]:
    return (
        db.query(Link)
        .filter(Link.user_id == user_id)
        .order_by(Link.city, Link.created_at.desc())
        .all()
    )


def get_by_id(db: Session, link_id: uuid.UUID) -> Link | None:
    return db.query(Link).filter(Link.id == link_id).first()


def create(db: Session, user_id: uuid.UUID, data: LinkCreate) -> Link:
    link = Link(user_id=user_id, **data.model_dump())
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


def update(db: Session, link: Link, data: LinkUpdate) -> Link:
    for field, value in data.model_dump().items():
        setattr(link, field, value)
    db.commit()
    db.refresh(link)
    return link


def delete(db: Session, link: Link) -> None:
    db.delete(link)
    db.commit()
