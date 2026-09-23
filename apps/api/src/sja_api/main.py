from fastapi import FastAPI

from sja_api.core.config import settings
from sja_api.routers import api_router

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url=None,
)

app.include_router(api_router, prefix="/api")
