"""link enrichment - reachability status, preview image, checked_at; title now optional

Revision ID: 0002
Revises: 0001
Create Date: 2026-09-03

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "links",
        sa.Column("enrichment_status", sa.String(), nullable=False, server_default="pending"),
    )
    op.add_column("links", sa.Column("preview_image_url", sa.String(length=2048), nullable=True))
    op.add_column("links", sa.Column("checked_at", sa.DateTime(timezone=True), nullable=True))
    op.alter_column("links", "title", existing_type=sa.String(), nullable=True)


def downgrade() -> None:
    # Reverting title to NOT NULL is lossy if any rows still have a blank title
    # (still pending, or n8n never resolved a title) - only safe if none do.
    op.alter_column("links", "title", existing_type=sa.String(), nullable=False)
    op.drop_column("links", "checked_at")
    op.drop_column("links", "preview_image_url")
    op.drop_column("links", "enrichment_status")
