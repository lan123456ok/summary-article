from datetime import datetime
from typing import Optional, Annotated
from bson import ObjectId
from pydantic import BaseModel, HttpUrl, Field, ConfigDict, BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(lambda x: str(x) if isinstance(x, ObjectId) else x)]


class ArticleBase(BaseModel):
    title: str
    link_url: HttpUrl | str
    location: Optional[str] = None
    datetime: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[HttpUrl | str] = None
    category: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None


class ArticleDB(ArticleBase):
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "title": "Sample Article",
                "link_url": "https://example.com/article",
                "created_at": "2025-01-08T10:00:00",
                "updated_at": "2025-01-08T10:00:00"
            }
        }
    )

    id: PyObjectId = Field(default=None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default_factory=datetime.now)


class SchedulerConfig(BaseModel):
    interval_minutes: int = Field(
        default=30,
        ge=5,
        le=1440,
        description="Interval between scraping runs in minutes"
    )


class SchedulerStatus(BaseModel):
    is_running: bool
    last_run_time: Optional[str]
    last_run_status: Optional[str]
    next_run_time: Optional[str]
    total_articles_scraped: int
    active_jobs: int
