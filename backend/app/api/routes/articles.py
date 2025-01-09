from fastapi import APIRouter, Depends, HTTPException
from fastapi_pagination import Page, add_pagination, paginate
from fastapi_pagination.utils import disable_installed_extensions_check
from ..deps import get_db
from ...core.scraper import ArticleScrapper
from ...crud import create_articles, fetch_articles_from_db, get_distinct_categories
from ...models import ArticleBase, ArticleDB
from ...utils import logger

router = APIRouter(prefix="/articles", tags=["articles"])


@router.post("/", response_model=list[ArticleDB])
async def scrape_and_store_articles(db=Depends(get_db)):
    try:
        scrapper = ArticleScrapper()
        articles = await scrapper.scrape_articles()

        if not articles:
            raise HTTPException(status_code=404, detail="No articles found")

        stored_articles = []
        for article in articles:
            stored_article = await create_articles(db['articles'], article)
            stored_articles.append(stored_article)

        return stored_articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=Page[ArticleBase])
async def get_articles(
        db=Depends(get_db),
        category: str | None = None,
        q: str | None = None
):
    try:
        articles = await fetch_articles_from_db(db['articles'], category, q)
        result = [ArticleBase(**article) for article in articles]
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

