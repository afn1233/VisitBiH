from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """App configuration, loaded from environment variables / .env file."""

    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 days
    frontend_origin: str = "http://localhost:5173"

    # n8n link-enrichment integration - both optional so the app still boots
    # without them configured (the enrichment trigger just becomes a no-op)
    n8n_webhook_url: str | None = None
    link_enrichment_api_key: str | None = None

    # "Ask your links" (RAG) - both optional, same degrade-gracefully pattern
    # as the n8n settings above. Unset means embedding/asking is a no-op.
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None

    # ignore="extra" - .env also carries N8N_BASIC_AUTH_USER/PASSWORD, which
    # are for docker-compose.yml's ${...} substitution, not this app; without
    # this, pydantic-settings rejects the whole file over vars it doesn't own.
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
