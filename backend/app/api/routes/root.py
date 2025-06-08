from fastapi import APIRouter
from ...core.scheduler import article_scheduler

router = APIRouter(prefix="/health",tags=["root"])

@router.get("/")
async def health():
    return {
        "message": "Article Scraper API",
        "version": "1.0.0",
        "scheduler_status": article_scheduler.get_scheduler_status(),
        "docs_url": "/docs",
        "health_check": "/api/v1/health"
    }