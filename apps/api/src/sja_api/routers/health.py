from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from sja_api.core.database import get_db
from sja_api.schemas.health import HealthResponse
from sja_api.services import health as health_service

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def read_health(db: Session = Depends(get_db)) -> HealthResponse:
    return health_service.get_health(db)
