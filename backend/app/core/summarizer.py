import asyncio
import random
import time
from typing import Optional
import google.generativeai as genai
from .config import settings
from ..utils import logger


class ArticleSummarizer:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.last_request_time = 0
        self.min_delay = settings.RATE_LIMIT_DELAY * 2
        self.max_retries = 3
        self.backoff_factor = 2

    async def _wait_for_rate_limit(self):
        current_time = time.time()
        elapsed = current_time - self.last_request_time

        if elapsed < self.min_delay:
            wait_time = self.min_delay - elapsed
            logger.debug(f"Rate limiting: waiting {wait_time:.2f}s before API call")
            await asyncio.sleep(wait_time)

        self.last_request_time = time.time()

    async def generate_summary_with_retry(self, article_content: str, title: str) -> Optional[str]:
        for attempt in range(self.max_retries):
            try:
                await self._wait_for_rate_limit()

                prompt = f"""
                Tóm gôn nội dung chính của nội dung sau(3-5 dòng): {article_content}
                """

                loop = asyncio.get_running_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda: self.model.generate_content(prompt)
                )

                if response and hasattr(response, 'text'):
                    logger.info(f"Generated summary for {title}")
                    return response.text.strip()
                return None
            except Exception as e:
                is_rate_limit = "429" in str(e) or "quota" in str(e).lower()

                retry_seconds = 0
                if "retry_delay" in str(e) and "seconds:" in str(e):
                    # Try to extract retry delay from error message
                    retry_info = str(e).split("seconds:")[1].strip()
                    try:
                        retry_seconds = int(retry_info.split("}")[0].strip())
                    except ValueError:
                        pass

                if retry_seconds == 0:
                    retry_seconds = (self.backoff_factor ** attempt) * self.min_delay
                    retry_seconds = retry_seconds * (0.5 + random.random())

                logger.warning(
                    f"Attempt {attempt + 1}/{self.max_retries} failed to generate summary: {str(e)}. "
                    f"{'Rate limit exceeded' if is_rate_limit else 'API error'}. "
                    f"Retrying in {retry_seconds:.1f}s"
                )

                if attempt < self.max_retries - 1:
                    await asyncio.sleep(retry_seconds)
                else:
                    logger.error(f"All {self.max_retries} attempts to generate summary failed")
                    return None

    async def generate_summary(self, article_content: str, title: str) -> str | None:
        if not article_content or len(article_content) < 100:
            logger.warning("Article content is too short to summarize: " + title)
            return None

        api_summary = await self.generate_summary_with_retry(article_content, title)

        if api_summary:
            return api_summary

        logger.info(f"Using fallback summarization for: {title}")
        return await self.generate_fallback_summary(article_content, title)

    async def generate_fallback_summary(self, article_content: str, title: str) -> str | None:
        logger.info(f"Generating fallback summary for: {title}")
        sentences = article_content.split('.')

        max_sentences = min(3, len(sentences))
        summary = '. '.join(sentences[:max_sentences]).strip() + '.'

        return summary