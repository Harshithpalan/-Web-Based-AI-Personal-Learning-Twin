from fastapi import APIRouter, Depends, HTTPException
from ai_engine.generator import generate_notes, generate_quiz
from auth import get_current_user
from models import User

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/generate-notes")
def get_notes(topic: str, current_user: User = Depends(get_current_user)):
    return generate_notes(topic)

@router.post("/generate-quiz")
def get_quiz(topic: str, difficulty: str = "Medium", current_user: User = Depends(get_current_user)):
    return generate_quiz(topic, difficulty)
