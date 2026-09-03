import uuid

from sqlalchemy import ARRAY, Column, DateTime, Float, ForeignKey, Index, String, Text, func
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class Link(Base):
    __tablename__ = "links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    city = Column(String, nullable=False)
    title = Column(String, nullable=True)  # blank at creation -> filled in by n8n enrichment
    url = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    enrichment_status = Column(String, nullable=False, server_default="pending")
    preview_image_url = Column(String(2048), nullable=True)
    checked_at = Column(DateTime(timezone=True), nullable=True)
    # OpenAI text-embedding-3-small vector, set on create/update; null until an
    # OPENAI_API_KEY is configured. No pgvector - plain array, compared in
    # Python at question time (fast enough at this app's scale).
    embedding = Column(ARRAY(Float), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    __table_args__ = (Index("ix_links_user_id_city", "user_id", "city"),)
