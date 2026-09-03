import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import link as link_crud
from app.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.link import LinkCreate, LinkOut, LinkUpdate
from app.services.enrichment import trigger_enrichment

router = APIRouter(prefix="/links", tags=["links"])


def _get_owned_link_or_404(db: Session, link_id: uuid.UUID, user: User):
    link = link_crud.get_by_id(db, link_id)
    if link is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found")
    if link.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your link")
    return link


@router.get("", response_model=list[LinkOut])
def list_links(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return link_crud.get_all_for_user(db, user.id)


@router.post("", response_model=LinkOut, status_code=status.HTTP_201_CREATED)
def create_link(
    payload: LinkCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    link = link_crud.create(db, user.id, payload)
    background_tasks.add_task(trigger_enrichment, link.id, link.url)
    return link


@router.put("/{link_id}", response_model=LinkOut)
def update_link(
    link_id: uuid.UUID,
    payload: LinkUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    link = _get_owned_link_or_404(db, link_id, user)
    return link_crud.update(db, link, payload)


@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_link(
    link_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    link = _get_owned_link_or_404(db, link_id, user)
    link_crud.delete(db, link)
