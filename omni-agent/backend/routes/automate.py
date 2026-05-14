from fastapi import APIRouter
from pydantic import BaseModel
from services import playwright_service

router = APIRouter()


class AutomateRequest(BaseModel):
    task: str


@router.post("/automate")
async def automate(req: AutomateRequest):
    result = await playwright_service.run_task(req.task)
    return {"result": result}
