from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database import engine, Base
from routes import auth, study, ml, ai, focus

# Initialize Database Tables
# Initialize Database Tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database initialization error: {e}")

app = FastAPI(title="AI Personal Learning Twin API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(auth.router)
app.include_router(study.router)
app.include_router(ml.router)
app.include_router(ai.router)
app.include_router(focus.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Personal Learning Twin API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
