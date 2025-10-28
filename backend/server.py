from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any
import uuid
from datetime import datetime, timezone
import PyPDF2
import io
import google.generativeai as genai

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Gemini AI setup
gemini_key = os.environ.get('GEMINI_API_KEY', '')
if gemini_key:
    genai.configure(api_key=gemini_key)

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class SimplifyRequest(BaseModel):
    content: str
    reading_level: int = 8
    disability_type: str = "general"

class StudyAidsRequest(BaseModel):
    content: str
    aid_type: str = "flashcards"  # flashcards, summary, keyterms, quiz

class TextResponse(BaseModel):
    text: str
    reading_score: float = 0.0

# Routes
@api_router.get("/")
async def root():
    return {"message": "StudyBridge API"}

@api_router.post("/extract-pdf")
async def extract_pdf(file: UploadFile = File(...)):
    """Extract text from PDF file"""
    try:
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        
        # Extract text using PyPDF2
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n\n"
        
        if not text.strip():
            return JSONResponse(
                status_code=400,
                content={"error": "No text found in PDF. File may be image-based or empty."}
            )
        
        # Calculate basic readability score (simplified Flesch)
        words = len(text.split())
        sentences = text.count('.') + text.count('!') + text.count('?')
        sentences = max(sentences, 1)
        
        avg_sentence_length = words / sentences
        reading_score = 206.835 - (1.015 * avg_sentence_length)
        reading_score = max(0, min(100, reading_score))
        
        return {
            "text": text,
            "word_count": words,
            "reading_score": round(reading_score, 2),
            "pages": len(pdf_reader.pages)
        }
        
    except Exception as e:
        logging.error(f"PDF extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@api_router.post("/simplify-content")
async def simplify_content(request: SimplifyRequest):
    """Simplify content using Gemini AI"""
    try:
        if not gemini_key:
            return JSONResponse(
                status_code=400,
                content={"error": "Gemini API key not configured. Please set GEMINI_API_KEY."}
            )
        
        model = genai.GenerativeModel('gemini-pro')
        
        # Build disability-specific prompt
        disability_guidance = {
            "dyslexia": "Use simple sentence structure, short paragraphs, and clear formatting. Avoid complex words.",
            "adhd": "Break into small chunks, use bullet points, highlight key information, keep it concise.",
            "autism": "Be literal and specific, avoid idioms and metaphors, use clear structure and predictable patterns.",
            "intellectual": "Use very simple language, short sentences, concrete examples, and repetition of key concepts.",
            "general": "Use clear and simple language appropriate for the reading level."
        }
        
        guidance = disability_guidance.get(request.disability_type.lower(), disability_guidance["general"])
        
        prompt = f"""You are an accessibility expert helping students with disabilities understand educational content.

Original Content:
{request.content[:3000]}

Task: Simplify this content for a student with {request.disability_type} at grade {request.reading_level} reading level.

Guidelines: {guidance}

Provide simplified version that maintains all key information but is more accessible:"""
        
        response = model.generate_content(prompt)
        simplified_text = response.text
        
        # Calculate new reading score
        words = len(simplified_text.split())
        sentences = simplified_text.count('.') + simplified_text.count('!') + simplified_text.count('?')
        sentences = max(sentences, 1)
        reading_score = 206.835 - (1.015 * (words / sentences))
        
        return {
            "simplified_text": simplified_text,
            "reading_score": round(max(0, min(100, reading_score)), 2)
        }
        
    except Exception as e:
        logging.error(f"Simplification error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error simplifying content: {str(e)}")

@api_router.post("/generate-study-aids")
async def generate_study_aids(request: StudyAidsRequest):
    """Generate study aids using Gemini AI"""
    try:
        if not gemini_key:
            return JSONResponse(
                status_code=400,
                content={"error": "Gemini API key not configured"}
            )
        
        model = genai.GenerativeModel('gemini-pro')
        
        prompts = {
            "flashcards": f"""Create 5-7 flashcards from this content. Format as JSON array with 'front' and 'back' keys.

Content: {request.content[:2000]}

Return only valid JSON array like: [{{"front": "question", "back": "answer"}}]""",
            
            "summary": f"""Create a concise summary of this content in 3-4 bullet points:

Content: {request.content[:2000]}""",
            
            "keyterms": f"""Extract 5-7 key terms with definitions from this content. Format as JSON array.

Content: {request.content[:2000]}

Return only valid JSON array like: [{{"term": "word", "definition": "meaning"}}]""",
            
            "quiz": f"""Create 5 multiple choice questions from this content. Format as JSON array.

Content: {request.content[:2000]}

Return only valid JSON array like: [{{"question": "...", "options": ["A", "B", "C", "D"], "correct": 0}}]"""
        }
        
        prompt = prompts.get(request.aid_type, prompts["summary"])
        response = model.generate_content(prompt)
        
        return {
            "type": request.aid_type,
            "content": response.text
        }
        
    except Exception as e:
        logging.error(f"Study aids generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating study aids: {str(e)}")

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()