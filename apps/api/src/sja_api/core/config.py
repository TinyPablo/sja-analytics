from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration, sourced from environment variables / .env."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "SJA Analytics API"
    app_env: str = "dev"
    database_url: str = "sqlite:///./data/sja.db"


settings = Settings()
