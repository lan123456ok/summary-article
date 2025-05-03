from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="./.env",
        env_ignore_empty=True,
        extra="ignore",
        env_file_encoding="utf-8"
    )
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: list[str] = []

    @property
    def all_cors_origins(self) -> list[str]:
        return self.BACKEND_CORS_ORIGINS

    GEMINI_API_KEY: str
    MAX_API_RETRIES: int = 3
    RATE_LIMIT_DELAY: float = 3.0

    MAX_ARTICLES_PER_BATCH: int = 5
    BATCH_DELAY_SECOND: int = 10

    USE_FALLBACK_SUMMARY: bool = True

    BASE_URL: str = "https://vnexpress.net/tin-tuc-24h"
    REQUEST_TIMEOUT: int = 15

    MONGODB_URI: str
    MONGODB_DB_NAME: str = "article_db"

    PROJECT_NAME: str


settings = Settings()
