import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class LinkBase(BaseModel):
    city: str = Field(min_length=1, max_length=200)
    url: str = Field(min_length=1, max_length=2048)
    description: str | None = Field(default=None, max_length=5000)


class LinkCreate(LinkBase):
    title: str | None = Field(default=None, max_length=300)  # blank -> n8n fills it in


class LinkUpdate(LinkBase):
    title: str = Field(min_length=1, max_length=300)  # still required on user-edit


class LinkOut(LinkBase):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str | None
    enrichment_status: str
    preview_image_url: str | None
    checked_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
