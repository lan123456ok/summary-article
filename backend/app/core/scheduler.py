import asyncio
from datetime import datetime
from typing import Optional
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.executors.asyncio import AsyncIOExecutor

from .config import settings
from .database import MongoDB
from .scraper import ArticleScrapper
from ..crud import create_articles
from ..utils import logger


class ArticleScheduler:
    def __init__(self):
        job_stores = {
            'default': MemoryJobStore()
        }
        executors = {
            'default': AsyncIOExecutor()
        }
        job_defaults = {
            'coalesce': False,
            'max_instances': 1,
            'misfire_grace_time': 300
        }

        self.scheduler = AsyncIOScheduler(
            jobstores=job_stores,
            executors=executors,
            job_defaults=job_defaults,
            timezone='Asia/Ho_Chi_Minh'
        )

        self.is_running = False
        self.last_run_time = None
        self.last_run_status = None
        self.articles_scraped_count = 0

    async def scrape_and_store_job(self):
        job_start_time = datetime.now()
        logger.info("🤖 Scheduled article scraping started")

        try:
            client = MongoDB.get_client()
            db = client[settings.MONGODB_DB_NAME]

            scaper = ArticleScrapper()

            articles = await scaper.scrape_articles(batch_size=settings.MAX_ARTICLES_PER_BATCH)

            if not articles:
                logger.warning("No new articles found during scheduled scraping")
                self.last_run_status = "no_articles"
                return

            stored_count = 0
            skipped_count = 0

            for article in articles:
                try:
                    stored_article = await create_articles(db["articles"], article)
                    if stored_article:
                        stored_count += 1
                    else:
                        skipped_count += 1
                except Exception as e:
                    logger.error(f"Error storing article: {str(e)}")
                    skipped_count += 1

            self.articles_scraped_count += stored_count
            self.last_run_time = job_start_time
            self.last_run_status = "success"

            duration = (datetime.now() - job_start_time).total_seconds()

        except Exception as e:
            self.last_run_status = "error"
            self.last_run_time = job_start_time
            logger.error(f"❌ Scheduled scraping failed: {str(e)}", exc_info=True)

    async def start_scheduler(self, interval_minutes: int = 30):
        if self.is_running:
            logger.warning("Scheduler is already running")
            return False

        try:
            self.scheduler.add_job(
                func=self.scrape_and_store_job,
                trigger=IntervalTrigger(minutes=interval_minutes),
                id="scrape_and_store_job",
                name="Automatic Article Scraping",
                replace_existing=True
            )

            self.scheduler.start()
            self.is_running = True

            logger.info(f"🚀 Article scheduler started - will run every {interval_minutes} minutes")
            return True

        except Exception as e:
            logger.error(f"Failed to start scheduler: {str(e)}")
            return False

    async def stop_scheduler(self):
        if not self.is_running:
            logger.warning("Scheduler is not running")
            return False

        try:
            self.scheduler.shutdown(wait=True)
            self.is_running = False
            logger.info("🛑 Article scheduler stopped")
            return True

        except Exception as e:
            logger.error(f"Failed to stop scheduler: {str(e)}")
            return False

    async def trigger_immediate_run(self):
        try:
            await self.scrape_and_store_job()
            return True
        except Exception as e:
            logger.error(f"Failed to trigger immediate run: {str(e)}")
            return False

    def get_scheduler_status(self) -> dict:
        next_run_time = None
        if self.is_running and self.scheduler.get_jobs():
            job = self.scheduler.get_job("article_scraping_job")
            if job:
                next_run_time = job.next_run_time

        return {
            "is_running": self.is_running,
            "last_run_time": self.last_run_time.isoformat() if self.last_run_time else None,
            "last_run_status": self.last_run_status,
            "next_run_time": next_run_time.isoformat() if next_run_time else None,
            "total_articles_scraped": self.articles_scraped_count,
            "active_jobs": len(self.scheduler.get_jobs()) if self.is_running else 0
        }

    async def update_schedule(self, interval_minutes: int):
        if not self.is_running:
            return await self.start_scheduler(interval_minutes)

        try:
            self.scheduler.remove_job('article_scraping_job')

            self.scheduler.add_job(
                func=self.scrape_and_store_job,
                trigger=IntervalTrigger(minutes=interval_minutes),
                id="article_scraping_job",
                name="Automatic Article Scraping",
                replace_existing=True
            )

            logger.info(f"📅 Scheduler updated - new interval: {interval_minutes} minutes")
            return True

        except Exception as e:
            logger.error(f"Failed to update scheduler: {str(e)}")
            return False


article_scheduler = ArticleScheduler()
