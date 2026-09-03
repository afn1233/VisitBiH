from pydantic import BaseModel, Field


class LinkEnrichmentIn(BaseModel):
    """Callback payload n8n posts back after checking a link. Not a CRUD shape -
    `is_reachable` is used to derive `enrichment_status`, not stored as its own column."""

    is_reachable: bool
    title: str | None = Field(default=None, max_length=300)
    preview_image_url: str | None = Field(default=None, max_length=2048)
