-- Database Schema for AI Personal Learning Twin

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Study Sessions table
CREATE TABLE study_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER, -- in minutes
    productivity_rating INTEGER, -- 1-5
    focus_score FLOAT, -- 0-100
    date DATE DEFAULT CURRENT_DATE
);

-- Quiz Results table
CREATE TABLE quiz_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    score FLOAT NOT NULL,
    total_questions INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- Easy, Medium, Hard
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Weakness Predictions table
CREATE TABLE weakness_predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subject VARCHAR(100) NOT NULL,
    weakness_probability FLOAT NOT NULL,
    confidence_score FLOAT NOT NULL,
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
