from fastapi import APIRouter

from .routes import root, articles, scheduler

api_router = APIRouter()

api_router.include_router(root.router)
api_router.include_router(articles.router)
api_router.include_router(scheduler.router)

