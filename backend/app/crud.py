from datetime import datetime
from typing import Optional
from pymongo.collection import Collection

from .utils import logger
from .models import ArticleBase, ArticleDB


async def create_articles(db: Collection, article: ArticleBase) -> Optional[ArticleDB]:
    article_dict = article.model_dump()
    now = datetime.now()

    update_data = {
        "$set": {
            **article_dict,
            "updated_at": now
        },
        "$setOnInsert": {
            "created_at": now
        }
    }

    try:
        result = await db.update_one(
            {"link_url": article_dict["link_url"]},
            update_data,
            upsert=True,
        )

        if result.upserted_id:
            article_id = result.upserted_id
        else:
            existing_article = await db.find_one({"link_url": article_dict["link_url"]})
            article_id = existing_article["_id"]

        updated_article = await db.find_one({"_id": article_id})
        if updated_article:
            return ArticleDB(**updated_article)
        return None
    except Exception as e:
        print(f"Error saving article: {e}")
        return None


async def fetch_articles_from_db(
        db: Collection,
        category: str | None = None,
        q: str | None = None
):
    try:
        filter_query = {}
        if category:
            filter_query['category'] = category
        if q:
            filter_query['$or'] = [
                {'title': {'$regex': q, '$options': 'i'}},
                {'content': {'$regex': q, '$options': 'i'}}
            ]
        cursor = db.find(filter_query).sort("created_at", -1)
        articles = await cursor.to_list(length=None)

        return articles
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return []


async def get_distinct_categories(db: Collection):
    try:
        categories = await db.distinct("category", {"category": {"$ne": None}})
        return sorted(filter(None, categories))
    except Exception as e:
        logger.error(f"Error fetching distinct categories: {e}")
        raise