from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud import link as link_crud
from app.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.stats import CityCount, StatsOut

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    links = link_crud.get_all_for_user(db, user.id)
    city_counts = Counter(link.city for link in links)
    per_city = [
        CityCount(city=city, count=count)
        for city, count in sorted(city_counts.items(), key=lambda item: item[0].lower())
    ]
    return StatsOut(
        total_links=len(links),
        distinct_cities=len(city_counts),
        per_city=per_city,
    )
