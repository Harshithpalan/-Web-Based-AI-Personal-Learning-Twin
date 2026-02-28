from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ml.focus_detector import detect_focus
from auth import get_current_user
from models import User

router = APIRouter(prefix="/focus", tags=["focus"])

class FrameData(BaseModel):
    image: str # Base64 encoded frame

@router.post("/detect")
def get_focus_score(data: FrameData, current_user: User = Depends(get_current_user)):
    score = detect_focus(data.image)
    return {"focus_score": score}
