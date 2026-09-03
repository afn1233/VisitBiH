"""link embedding column for ask-your-links (RAG)

Revision ID: 0003
Revises: 0002
Create Date: 2026-09-03

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "links",
        sa.Column("embedding", postgresql.ARRAY(sa.Float()), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("links", "embedding")
