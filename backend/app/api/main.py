from fastapi import APIRouter

from .routes import root, articles

api_router = APIRouter()

api_router.include_router(root.router)
api_router.include_router(articles.router)

