from ..core.database import MongoDB
from ..core.config import settings


async def get_db():
    client = MongoDB.get_client()
    db = client[settings.MONGODB_DB_NAME]
    try:
        yield db
    finally:
        pass
