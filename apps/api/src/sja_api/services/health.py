from sqlalchemy import text
from sqlalchemy.orm import Session

from sja_api.core.config import settings
from sja_api.schemas.health import HealthResponse


def get_health(db: Session) -> HealthResponse:
    """Report service status, verifying the database connection round-trips."""
    try:
        db.execute(text("SELECT 1"))
        database = "up"
    except Exception:
        database = "down"

    return HealthResponse(
        status="ok" if database == "up" else "degraded",
        app_name=settings.app_name,
        app_env=settings.app_env,
        database=database,
    )
