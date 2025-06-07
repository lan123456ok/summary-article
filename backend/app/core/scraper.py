import asyncio
from typing import Optional, Dict, Any, List
import time
from bs4 import BeautifulSoup
import requests

from ..models import ArticleBase
from .config import settings
from ..utils import logger
from .error_handles import ArticleScrapingError
from .summarizer import ArticleSummarizer


class ArticleScrapper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (compatible; ArticleScraper/1.0;)'
        })

    async def get_article_content(self, article_url: str) -> Optional[Dict[str, str]]:
        try:
            result = self.session.get(
                article_url,
                timeout=settings.REQUEST_TIMEOUT
            )
            result.raise_for_status()
            article_soup = BeautifulSoup(result.text, 'html5lib')

            article = article_soup.find('article', class_="fck_detail")

            if not article:
                logger.warning(f"No article found for URL: {article_url}")
                return {
                    'content': '',
                    'category': ''
                }

            content_paragraphs = article_soup.find_all('p', class_='Normal')
            content = [p.get_text(strip=True) for p in content_paragraphs]
            full_text = ' '.join(content)

            ul = article_soup.find('ul', class_='breadcrumb')
            category_tag = ul.find('a', {'data-medium': True}) if ul else None
            category = category_tag.get_text(strip=True) if category_tag else None

            logger.info(f"Successfully extracted content from: {article_url}")
            return {
                'content': full_text,
                'category': category
            }

        except Exception as e:
            logger.error(f"Error extracting content: {e}")
            return None

    async def extract_article_info(self, article: Any) -> Optional[ArticleBase]:
        try:
            title_tag = article.find('h3', class_='title-news')
            if not title_tag:
                logger.warning("No title found in article")
                return None

            title_tag_next = title_tag.find('a')
            if not title_tag_next:
                logger.warning("No link found in article title")
                return None

            article_data = {
                'title': title_tag.get_text(strip=True),
                'link_url': title_tag_next['href'],
                'location': None,
                'datetime': None,
                'description': None,
                'image_url': None,
                'category': None,
                'content': None,
                'summary': None
            }

            location_tag = article.find('span', class_='location-stamp')
            if location_tag:
                article_data['location'] = location_tag.get_text(strip=True)

            time_tag = article.find('span', class_='time-ago')
            if time_tag and 'datetime' in time_tag.attrs:
                datetime_str = str(time_tag['datetime'])
                article_data['datetime'] = datetime_str

            description_tag = article.find('p', class_='description')
            if description_tag:
                description_link = description_tag.find('a')
                if description_link:
                    article_data['description'] = description_link.get_text(strip=True)

            image_tag = article.find('div', class_='thumb-art')
            if image_tag:
                img = image_tag.find('img')
                if img:
                    article_data['image_url'] = img.get('data-src') or img.get('src')

            content_data = await self.get_article_content(article_data['link_url'])
            if content_data:
                article_data['content'] = content_data['content']
                article_data['category'] = content_data['category']

                if article_data['content'] and len(article_data['content']) > 100:
                    try:
                        summarizer = ArticleSummarizer()

                        article_data['summary'] = await summarizer.generate_summary(
                            article_data['content'],
                            article_data['title']
                        )
                    except Exception as e:
                        logger.error(f"Error generating summary: {str(e)}")
                        pass

            logger.info(f"Successfully extracted article info: {article_data['title']}")
            return ArticleBase(**article_data)

        except Exception as e:
            logger.error(f"Error extracting article info: {str(e)}")
            return None

    async def scrape_articles(self, batch_size: int = 5) -> list[ArticleBase]:
        articles_data = []

        try:
            logger.info(f"Scraping articles from {settings.BASE_URL}")
            result = self.session.get(
                settings.BASE_URL,
                timeout=settings.REQUEST_TIMEOUT
            )
            result.raise_for_status()

            result.encoding = 'utf-8'

            soup = BeautifulSoup(result.text, "html5lib")
            articles = soup.find_all("article", class_="thumb-left")

            logger.info(f"Found {len(articles)} articles to process")

            for i, article in enumerate(articles):
                if article.find('ins', class_='adsbyeclick') or article.find('script'):
                    continue

                if article.find('h3', class_='title-news'):
                    article_info = await self.extract_article_info(article)
                    if article_info:
                        articles_data.append(article_info)

                        await asyncio.sleep(settings.RATE_LIMIT_DELAY)

                        if len(articles_data) % batch_size == 0:
                            logger.info(f"Processed {len(articles_data)} articles. Taking a batch delay...")
                            await asyncio.sleep(settings.RATE_LIMIT_DELAY * 3)

            logger.info(f"Successfully scraped {len(articles_data)} articles")
            return articles_data
        except requests.RequestException as e:
            logger.error(f"Failed to fetch main page: {str(e)}")
            raise ArticleScrapingError(f"Failed to fetch main page: {str(e)}")
        except Exception as e:
            logger.error(f"Error during article scraping: {str(e)}")
            raise ArticleScrapingError(f"Error during article scraping: {str(e)}")
