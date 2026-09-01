import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class LinkBase(BaseModel):
    city: str = Field(min_length=1, max_length=200)
    title: str = Field(min_length=1, max_length=300)
    url: str = Field(min_length=1, max_length=2048)
    description: str | None = Field(default=None, max_length=5000)


class LinkCreate(LinkBase):
    pass


class LinkUpdate(LinkBase):
    pass


class LinkOut(LinkBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
