import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

MODEL_PATH = "ml_model.joblib"

def train_model(data: pd.DataFrame):
    # Features: study_hours, quiz_score, focus_score
    X = data[['study_hours', 'quiz_score', 'focus_score']]
    y = data['is_weak']
    
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X, y)
    
    joblib.dump(model, MODEL_PATH)
    return model

def predict_weakness(study_hours, quiz_score, focus_score):
    if not os.path.exists(MODEL_PATH):
        # Return a mock prediction if model doesn't exist
        prob = np.random.uniform(0.1, 0.9)
        conf = 0.85
        return prob, conf
        
    model = joblib.load(MODEL_PATH)
    X = np.array([[study_hours, quiz_score, focus_score]])
    prob = model.predict_proba(X)[0][1] # Probability of class 1 (weak)
    return prob, 0.95 # Mock confidence for now
