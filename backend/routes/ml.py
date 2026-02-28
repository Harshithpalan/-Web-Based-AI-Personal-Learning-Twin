from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, QuizResult, StudySession
from auth import get_current_user
from ml.predictor import predict_weakness
from sqlalchemy import func

router = APIRouter(prefix="/predict", tags=["ml"])

@router.post("/weakness")
def get_prediction(subject: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Aggregating user data for prediction
    sessions = db.query(StudySession).filter(
        StudySession.user_id == current_user.id,
        StudySession.subject == subject
    ).all()
    
    quizzes = db.query(QuizResult).filter(
        QuizResult.user_id == current_user.id,
        QuizResult.subject == subject
    ).all()
    
    if not sessions or not quizzes:
        # Not enough data, return mock or error
        prob, conf = predict_weakness(0, 0, 0)
        return {"subject": subject, "weakness_probability": prob, "confidence_score": conf, "message": "Insufficient data, providing estimation."}

    avg_study_time = sum([s.time_spent or 0 for s in sessions]) / len(sessions)
    avg_quiz_score = sum([q.score for q in quizzes]) / len(quizzes)
    avg_focus = sum([s.focus_score or 0 for s in sessions]) / len(sessions)
    
    prob, conf = predict_weakness(avg_study_time, avg_quiz_score, avg_focus)
    
    return {
        "subject": subject,
        "weakness_probability": prob,
        "confidence_score": conf
    }
