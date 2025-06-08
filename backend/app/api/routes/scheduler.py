from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

from ...core.scheduler import article_scheduler
from ...utils import logger
from ...models import SchedulerConfig, SchedulerStatus

router = APIRouter(prefix="/scheduler", tags=["scheduler"])


@router.post("/start", response_model=dict)
async def start_scheduler(
        config: SchedulerConfig = SchedulerConfig()
):
    try:
        success = await article_scheduler.start_scheduler(config.interval_minutes)

        if success:
            return {
                "status": "success",
                "message": f"Scheduler started successfully with {config.interval_minutes} minute interval",
                "interval_minutes": config.interval_minutes,
                "started_at": datetime.now().isoformat()
            }
        else:
            raise HTTPException(
                status_code=400,
                detail="Failed to start scheduler - it may already be running"
            )

    except Exception as e:
        logger.error(f"Error starting scheduler: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stop", response_model=dict)
async def stop_scheduler():
    try:
        success = await article_scheduler.stop_scheduler()

        if success:
            return {
                "status": "success",
                "message": "Scheduler stopped successfully",
                "stopped_at": datetime.now().isoformat()
            }
        else:
            raise HTTPException(
                status_code=400,
                detail="Failed to stop scheduler - it may not be running"
            )

    except Exception as e:
        logger.error(f"Error stopping scheduler: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status", response_model=SchedulerStatus)
async def get_scheduler_status():
    try:
        status = article_scheduler.get_scheduler_status()
        return SchedulerStatus(**status)
    except Exception as e:
        logger.error(f"Error getting scheduler status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/trigger", response_model=dict)
async def trigger_immediate_scraping():
    try:
        success = await article_scheduler.trigger_immediate_run()

        if success:
            return {
                "status": "success",
                "message": "Immediate scraping completed successfully",
                "triggered_at": datetime.now().isoformat()
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to complete immediate scraping"
            )

    except Exception as e:
        logger.error(f"Error triggering immediate scraping: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/update", response_model=dict)
async def update_scheduler_interval(
        config: SchedulerConfig
):
    try:
        success = await article_scheduler.update_schedule(config.interval_minutes)

        if success:
            return {
                "status": "success",
                "message": f"Scheduler interval updated to {config.interval_minutes} minutes",
                "new_interval_minutes": config.interval_minutes,
                "updated_at": datetime.now().isoformat()
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to update scheduler interval"
            )

    except Exception as e:
        logger.error(f"Error updating scheduler: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/restart", response_model=dict)
async def restart_scheduler(
        config: SchedulerConfig = SchedulerConfig()
):
    try:
        # Stop if running
        await article_scheduler.stop_scheduler()

        # Start with new config
        success = await article_scheduler.start_scheduler(config.interval_minutes)

        if success:
            return {
                "status": "success",
                "message": f"Scheduler restarted successfully with {config.interval_minutes} minute interval",
                "interval_minutes": config.interval_minutes,
                "restarted_at": datetime.now().isoformat()
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to restart scheduler"
            )

    except Exception as e:
        logger.error(f"Error restarting scheduler: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
