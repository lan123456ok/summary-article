from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING, DESCENDING, TEXT
from .config import settings
from ..utils import logger


class MongoDB:
    _client: AsyncIOMotorClient = None

    @classmethod
    def get_client(cls) -> AsyncIOMotorClient:
        if cls._client is None:
            cls._client = AsyncIOMotorClient(settings.MONGODB_URI)
            print("Connected to MongoDB")
        return cls._client

    @classmethod
    def close_client(cls):
        if cls._client is not None:
            cls._client.close()
            print("Disconnected from MongoDB")

    @classmethod
    async def setup_indexes(cls):
        try:
            db = cls.get_client()[settings.MONGODB_DB_NAME]

            link_url_index = IndexModel(
                [("link_url", ASCENDING)],
                unique=True,
                name="link_url_index"
            )

            category_index = IndexModel(
                [("category", ASCENDING)],
                name="category_lookup"
            )

            text_search_index = IndexModel(
                [("title", TEXT), ("content", TEXT)],
                name="text_search"
            )

            created_at_index = IndexModel(
                [("created_at", DESCENDING)],
                name="created_at_sort"
            )

            await db.articles.create_indexes(
                [link_url_index,
                category_index,
                text_search_index,
                created_at_index
            ])

            logger.info("Indexes created successfully")
        except Exception as e:
            logger.error(f"Error creating indexes: {e}")
            pass
