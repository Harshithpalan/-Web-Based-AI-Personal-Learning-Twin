from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas import StudySessionCreate, StudySessionResponse, QuizResultCreate, QuizResultResponse
from auth import get_current_user
from models import StudySession, User, QuizResult

router = APIRouter(prefix="/study", tags=["study"])

@router.post("/sessions", response_model=StudySessionResponse)
def create_session(session: StudySessionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_session = StudySession(
        **session.dict(),
        user_id=current_user.id
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/sessions", response_model=List[StudySessionResponse])
def get_sessions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(StudySession).filter(StudySession.user_id == current_user.id).all()

@router.post("/quiz/results", response_model=QuizResultResponse)
def save_quiz_result(result: QuizResultCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_result = QuizResult(
        **result.dict(),
        user_id=current_user.id
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

@router.get("/quiz/results", response_model=List[QuizResultResponse])
def get_quiz_results(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(QuizResult).filter(QuizResult.user_id == current_user.id).all()
