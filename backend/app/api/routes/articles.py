from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from fastapi_pagination import Page, add_pagination, paginate
from fastapi_pagination.utils import disable_installed_extensions_check
from typing import List, Optional
from datetime import datetime
import asyncio
from ..deps import get_db
from ...core.scraper import ArticleScrapper
from ...crud import create_articles, fetch_articles_from_db, get_distinct_categories
from ...models import ArticleBase, ArticleDB
from ...utils import logger

router = APIRouter(prefix="/articles", tags=["articles"])


async def _scape_and_store_batch(db, batch_size: int = 5):
    try:
        scrapper = ArticleScrapper()
        articles = await scrapper.scrape_articles(batch_size)

        if not articles:
            logger.warning("No new articles found during background scraping")
            return

        stored_count = 0
        for article in articles:
            try:
                await create_articles(db['articles'], article)
                stored_count += 1
            except Exception as e:
                logger.error(f"Error storing article: {str(e)}")

        logger.info(f"Background task stored {stored_count} new articles")
    except Exception as e:
        logger.error(f"Error during background task: {str(e)}")


@router.post("/", response_model=dict)
async def scrape_and_store_articles(
        background_tasks: BackgroundTasks,
        db=Depends(get_db),
        batch_size: int = Query(5, ge=1, le=20, description="Number of articles per batch"),
        run_in_background: bool = Query(False, description="Run the task in the background")
):
    try:
        if run_in_background:
            background_tasks.add_task(_scape_and_store_batch, db, batch_size)
            return {
                "status": "Background task started",
                "message": f"Background task started to scrape and store",
                "batch_size": batch_size,
                "timestamp": datetime.now().isoformat()
            }

        scrapper = ArticleScrapper()
        articles = await scrapper.scrape_articles(batch_size=batch_size)

        if not articles:
            raise HTTPException(status_code=404, detail="No articles found")

        stored_articles = []
        for article in articles:
            stored_article = await create_articles(db['articles'], article)
            stored_articles.append(stored_article)

        return {
            "status": "completed",
            "message": f"Successfully scraped and stored {len(stored_articles)} articles",
            "articles_count": len(stored_articles)
        }
    except Exception as e:
        logger.error(f"Error in scrape_and_store_articles: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=Page[ArticleDB])
async def get_articles(
        db=Depends(get_db),
        category: str | None = None,
        q: str | None = None
):
    try:
        articles = await fetch_articles_from_db(db['articles'], category, q)
        result = [ArticleDB(**article) for article in articles]
        disable_installed_extensions_check()
        return paginate(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories", response_model=list[str])
async def get_categories(db=Depends(get_db)):
    try:
        categories = await get_distinct_categories(db['articles'])
        return categories
    except Exception as e:
        logger.error(f"Error in get_categories endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


add_pagination(router)
