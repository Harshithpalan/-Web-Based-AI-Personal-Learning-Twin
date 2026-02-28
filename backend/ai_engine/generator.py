import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "your-key"))

def generate_notes(topic: str):
    prompt = f"""
    Generate comprehensive study notes for the topic: {topic}.
    Output must be in JSON format with the following keys:
    - summary: A brief overview.
    - key_concepts: List of main points.
    - formulas: Important formulas or equations.
    - examples: 2-3 practical examples.
    - practice_questions: 3 questions for self-assessment.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        # Mock response for demo purposes if API fails
        return {
            "summary": f"Fallback summary for {topic}",
            "key_concepts": ["Concept 1", "Concept 2"],
            "formulas": ["A = B + C"],
            "examples": ["Example 1"],
            "practice_questions": ["Question 1"]
        }

def generate_quiz(topic: str, difficulty: str):
    prompt = f"""
    Generate a quiz for the topic: {topic} at {difficulty} difficulty.
    Include 5 MCQs and 2 descriptive questions.
    Output must be in JSON format:
    {{
        "mcqs": [{{ "question": "", "options": [], "answer": "" }}],
        "descriptive": ["question 1", "question 2"]
    }}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {
            "mcqs": [{"question": "Mock?", "options": ["A", "B"], "answer": "A"}],
            "descriptive": ["Mock question?"]
        }
