from fastapi import APIRouter

router = APIRouter(prefix="/health",tags=["root"])

@router.get("/")
async def health():
    return {"status": "ok"}