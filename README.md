# 🧠 Web-Based AI Personal Learning Twin
Web-Based AI Personal Learning Twin is an advanced full-stack AI-powered learning system that creates a personalized digital academic twin for students.
The platform intelligently tracks study habits, predicts weak subjects using machine learning, generates adaptive quizzes and AI-powered notes, and even monitors focus using real-time computer vision.

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [🔑 Environment Variables](#-environment-variables)
- [📡 API Reference](#-api-reference)
- [🧩 Frontend Modules](#-frontend-modules)
- [🤖 ML & AI Engine](#-ml--ai-engine)
- [🗄️ Database Schema](#️-database-schema)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **👤 User Authentication** | Secure JWT-based registration and login system |
| **📊 Study Session Tracker** | Log and monitor study sessions with subject, topic, duration & productivity ratings |
| **🧠 AI Quiz Engine** | Generate adaptive, difficulty-based quizzes on any topic using OpenAI GPT-4o |
| **📝 AI Notes Generator** | Instantly generate concise, structured study notes from any topic |
| **👁️ Webcam Focus Tracker** | Real-time focus detection using computer vision (MediaPipe) via your webcam — no data stored |
| **🎤 Voice AI Tutor** | Have a live spoken conversation with your AI study twin powered by Vapi AI (GPT-4o + 11Labs voice) |
| **📈 Analytics Dashboard** | Visual bar charts of study hours per subject and a weakness probability predictor |
| **🤖 ML Weakness Predictor** | Scikit-learn powered model that predicts subject weaknesses based on your study data |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser (User)                        │
│          React 18 + Vite Frontend (Port 5173)               │
│   Auth │ Dashboard │ Quiz │ Notes │ Focus │ Voice │ Charts  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP / REST API
┌────────────────────────▼────────────────────────────────────┐
│              FastAPI Backend (Port 8000)                     │
│     /auth │ /study │ /quiz │ /notes │ /focus │ /predict     │
└──────┬─────────────────┬───────────────────┬────────────────┘
       │                 │                   │
  ┌────▼────┐     ┌──────▼──────┐     ┌──────▼──────┐
  │ SQLite  │     │  OpenAI     │     │ scikit-learn│
  │  (DB)   │     │  GPT-4o API │     │  ML Model   │
  └─────────┘     └─────────────┘     └─────────────┘
                         │
                  ┌──────▼──────┐
                  │  Vapi AI    │
                  │(Voice + STT)│
                  └─────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework with component-based architecture |
| **Vite** | Lightning-fast development bundler |
| **React Router v6** | Client-side routing with private route guards |
| **Lucide React** | Modern icon library |
| **Recharts** | Charting library for study analytics |
| **@vapi-ai/web** | Voice AI SDK for real-time spoken conversations |

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | High-performance Python web framework |
| **Uvicorn** | ASGI server for FastAPI |
| **SQLAlchemy** | ORM for database interactions |
| **SQLite** | Lightweight relational database |
| **Pydantic** | Data validation and settings management |
| **python-jose** | JWT token generation and verification |
| **passlib (bcrypt)** | Secure password hashing |
| **OpenAI SDK** | GPT-4o integration for quizzes and notes |
| **MediaPipe** | Computer vision for real-time focus tracking |
| **OpenCV** | Image/video frame processing |
| **scikit-learn** | ML model for learning weakness prediction |
| **pandas / numpy** | Data manipulation for ML pipeline |

---

## 📁 Project Structure

```
Web-Based AI Personal Learning Twin/
├── 📄 package.json              # Root scripts (run both frontend & backend)
├── 📄 .env                      # Environment variables (API keys)
│
├── 📂 backend/                  # FastAPI Python Backend
│   ├── main.py                  # App entry point, CORS, router registration
│   ├── database.py              # SQLAlchemy engine & session setup
│   ├── models.py                # ORM models (User, StudySession, QuizResult, WeaknessPrediction)
│   ├── schemas.py               # Pydantic request/response schemas
│   ├── auth.py                  # JWT auth logic & password hashing
│   ├── requirements.txt         # Python dependencies
│   ├── learning_twin.db         # SQLite database file
│   ├── 📂 routes/
│   │   ├── auth.py              # /auth/register, /auth/login
│   │   ├── study.py             # /study/ session CRUD
│   │   ├── ai.py                # /ai/quiz, /ai/notes (OpenAI)
│   │   ├── focus.py             # /focus/detect (MediaPipe focus scoring)
│   │   └── ml.py                # /predict/weakness (scikit-learn)
│   └── 📂 ml/
│       └── predictor.py         # Weakness prediction ML logic
│
├── 📂 frontend/                 # React + Vite Frontend
│   ├── 📂 src/
│   │   ├── App.jsx              # Root router with private route guard
│   │   ├── main.jsx             # React DOM entry point
│   │   ├── 📂 pages/
│   │   │   ├── Auth.jsx         # Login & Register page
│   │   │   └── Dashboard.jsx    # Main app shell with sidebar navigation
│   │   ├── 📂 components/
│   │   │   ├── StudyTimer.jsx   # Pomodoro-style study session tracker
│   │   │   ├── QuizEngine.jsx   # AI-powered quiz generator & player
│   │   │   ├── NotesGenerator.jsx # AI study notes generator
│   │   │   ├── FocusTracker.jsx # Webcam-based real-time focus detection
│   │   │   └── VoiceAssistant.jsx # Voice AI tutor (Vapi integration)
│   │   ├── 📂 charts/
│   │   │   └── StudyBarChart.jsx # Study hours bar chart (Recharts)
│   │   └── 📂 services/
│   │       └── api.js           # Axios API service layer
│   └── package.json             # Frontend dependencies
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** v18+ & npm
- **[Python](https://www.python.org/)** 3.10+
- **[pip](https://pip.pypa.io/)** (Python package installer)
- A **webcam** (for Focus Tracking feature)
- A working **microphone** (for Voice AI Tutor feature)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Web-Based-AI-Personal-Learning-Twin.git
cd Web-Based-AI-Personal-Learning-Twin
```

### 2. Install All Dependencies

Run the following single command to install both frontend and backend dependencies:

```bash
npm run install:all
```

Or install them separately:

```bash
# Install frontend dependencies
npm install --prefix frontend

# Install backend dependencies
pip install -r backend/requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) below).

### 4. Start the Development Servers

Run both frontend and backend concurrently with a single command:

```bash
npm run dev
```

Or start them separately in two terminals:

```bash
# Terminal 1 — Backend (FastAPI)
npm run dev:backend
# Runs at: http://localhost:8000

# Terminal 2 — Frontend (React + Vite)
npm run dev:frontend
# Runs at: http://localhost:5173
```
| Variable | Where to Get |
|---|---|
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `SECRET_KEY` | Generate with: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `VITE_VAPI_PUBLIC_KEY` | [dashboard.vapi.ai](https://dashboard.vapi.ai) |

> **⚠️ Important:** Never commit your `.env` file to Git. It is already listed in `.gitignore`.

---

### Authentication — `/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user account |
| `POST` | `/auth/login` | Login and receive a JWT access token |

### Study Sessions — `/study`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/study/start` | Start a new study session |
| `PUT` | `/study/{id}/end` | End an active study session |
| `GET` | `/study/sessions` | Retrieve all sessions for the logged-in user |

### AI Features — `/ai`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ai/quiz` | Generate a quiz on a given topic & difficulty |
| `POST` | `/ai/notes` | Generate concise study notes for a topic |

### Focus Tracking — `/focus`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/focus/detect` | Submit a webcam frame and receive a focus score |

### ML Predictions — `/predict`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict/weakness` | Predict subject weakness based on user study data |

---

## 🧩 Frontend Modules

### 🔐 Authentication (`Auth.jsx`)
- Toggle between **Login** and **Register** modes
- JWT token stored in `localStorage` for session persistence
- Automatic redirect to Dashboard on successful auth

### 📊 Dashboard (`Dashboard.jsx`)
- Sidebar navigation for all features
- Study statistics overview
- Study hours bar chart powered by **Recharts**
- ML-powered **Weakness Predictor** panel

### ⏱️ Study Timer (`StudyTimer.jsx`)
- Log study sessions by subject and topic
- Track time spent, productivity rating, and focus score
- Syncs with backend to persist session data

### 🧩 Quiz Engine (`QuizEngine.jsx`)
- Select **subject**, **topic**, and **difficulty** (Easy / Medium / Hard)
- AI generates multiple-choice questions via GPT-4o
- Real-time scoring and result display

### 📝 Notes Generator (`NotesGenerator.jsx`)
- Enter any topic to get instant AI-generated study notes
- Structured, concise summaries powered by GPT-4o

### 👁️ Focus Tracker (`FocusTracker.jsx`)
- Accesses the user's webcam (with permission)
- Captures frames every **3 seconds** and sends them to the backend
- Backend analyzes **eye gaze & head pose** via MediaPipe
- Displays a real-time **Focus Score (0–100%)**
- Color-coded: 🟢 Focused (>70%) | 🟡 Moderate (40–70%) | 🔴 Distracted (<40%)
- **No video is stored** — frames are processed in-memory

### 🎤 Voice AI Tutor (`VoiceAssistant.jsx`)
- One-click to start a live voice conversation
- Powered by **Vapi AI** with:
  - **GPT-4o** for understanding and responses
  - **ElevenLabs "Paula" voice** for natural-sounding speech
  - **Deepgram Nova-2** for accurate speech-to-text
- Adaptive explanations based on your questions

---

## 🤖 ML & AI Engine

### Weakness Predictor
The ML model (`backend/ml/predictor.py`) uses **scikit-learn** to analyze three key signals:
1. **Average study time** per subject (from study sessions)
2. **Average quiz score** per subject (from quiz results)
3. **Average focus score** per subject (from focus tracking)

It outputs a **weakness probability** (0.0 – 1.0) and a **confidence score**, helping learners identify which subjects need more attention.

### AI Generation (OpenAI GPT-4o)
- **Quiz Engine**: Prompts GPT-4o to return structured JSON with multiple-choice questions, options, and correct answers
- **Notes Generator**: Prompts GPT-4o to return well-organized markdown study notes for any topic

---

## 🗄️ Database Schema

The application uses **SQLite** managed via **SQLAlchemy ORM**. The database file (`learning_twin.db`) is auto-created on first run.

```
users
├── id (PK)
├── username (unique)
├── email (unique)
├── hashed_password
└── created_at

study_sessions
├── id (PK)
├── user_id (FK → users)
├── subject
├── topic
├── start_time / end_time
├── time_spent (minutes)
├── productivity_rating
├── focus_score
└── date

quiz_results
├── id (PK)
├── user_id (FK → users)
├── subject / topic
├── score / total_questions
├── difficulty
└── created_at

weakness_predictions
├── id (PK)
├── user_id (FK → users)
├── subject
├── weakness_probability
├── confidence_score
└── predicted_at
```
