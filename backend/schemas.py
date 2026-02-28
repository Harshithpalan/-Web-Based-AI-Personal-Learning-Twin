from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class StudySessionBase(BaseModel):
    subject: str
    topic: str
    start_time: datetime
    end_time: Optional[datetime] = None
    time_spent: Optional[int] = None
    productivity_rating: Optional[int] = None
    focus_score: Optional[float] = None

class StudySessionCreate(StudySessionBase):
    pass

class StudySessionResponse(StudySessionBase):
    id: int
    user_id: int
    date: date

class QuizResultBase(BaseModel):
    subject: str
    topic: str
    score: float
    total_questions: int
    difficulty: str

class QuizResultCreate(QuizResultBase):
    pass

class QuizResultResponse(QuizResultBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class WeaknessPredictionBase(BaseModel):
    subject: str
    weakness_probability: float
    confidence_score: float

class WeaknessPredictionResponse(WeaknessPredictionBase):
    id: int
    predicted_at: datetime

    class Config:
        from_attributes = True
