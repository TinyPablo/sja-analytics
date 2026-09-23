from fastapi import APIRouter

from sja_api.routers import health

api_router = APIRouter()
api_router.include_router(health.router)
