import contextlib
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException
from fastapi.routing import APIRoute
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.cors import CORSMiddleware

from .core.database import MongoDB
from .core.config import settings
from .api.main import api_router
from .core.error_handles import (
    ArticleException,
    article_exception_handler,
    http_exception_handler,
    generate_exception_handler
)
from .utils import logger


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    try:
        MongoDB.get_client()
        logger.info("Connected to MongoDB")

        await MongoDB.setup_indexes()

        yield
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to connect to MongoDB")
    finally:
        try:
            MongoDB.close_client()
            logger.info("Disconnected from MongoDB")
        except Exception as e:
            logger.error(f"Failed to disconnect from MongoDB: {e}", exc_info=True)


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    lifespan=lifespan
)

app.add_exception_handler(ArticleException, article_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, generate_exception_handler)

if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request, exc):
    logger.error(f"HTTP error occured: {exc.detail}")
    return await http_exception_handler(request, exc)
