from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from ..utils import logger


class ArticleException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class ArticleNotFoundError(ArticleException):
    def __init__(self, message: str = 'Article not found'):
        super().__init__(message, status_code=404)


class ArticleScrapingError(ArticleException):
    def __init__(self, message: str = 'Error scraping article'):
        super().__init__(message, status_code=500)


async def article_exception_handler(request: Request, exc: ArticleException):
    logger.error(f"Article error: {exc.message}", exc_info=True)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTP error {exc.status_code}: {exc.detail}", exc_info=True)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


async def generate_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
