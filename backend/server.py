from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone
import PyPDF2
import io
import google.generativeai as genai
import yt_dlp
import tempfile
import shutil

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

class TranslateRequest(BaseModel):
    content: str
    target_language: str  # zh (Mandarin), hi (Hindi), ar (Arabic)

class YouTubeRequest(BaseModel):
    youtube_url: str

class TranscriptSegment(BaseModel):
    timestamp: str
    text: str

class VideoTranscriptResponse(BaseModel):
    transcript: str
    segments: List[TranscriptSegment]
    duration: Optional[float] = None

class ImageDescriptionRequest(BaseModel):
    image_url: str
    context: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    context: Optional[str] = None
    student_level: Optional[str] = "general"

class Note(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    audio_url: Optional[str] = None
    document_id: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    highlights: Optional[List[str]] = []

class ProgressEntry(BaseModel):
    user_id: str
    activity_type: str  # "pdf_read", "video_watched", "quiz_completed"
    content_id: str
    score: Optional[float] = None
    duration_minutes: Optional[int] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Resource(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str  # "education", "job_readiness", "daily_living", "financial"
    difficulty_level: str
    content: str
    accessible_formats: List[str]

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
        
        model = genai.GenerativeModel('gemini-2.0-flash')
        
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
        
        model = genai.GenerativeModel('gemini-2.0-flash')
        
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

@api_router.post("/translate-content")
async def translate_content(request: TranslateRequest):
    """Translate content to specified language using Gemini AI"""
    try:
        if not gemini_key:
            return JSONResponse(
                status_code=400,
                content={"error": "Gemini API key not configured"}
            )
        
        language_names = {
            "zh": "Mandarin Chinese",
            "hi": "Hindi",
            "ar": "Arabic"
        }
        
        target_lang = language_names.get(request.target_language, "English")
        
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""Translate the following text to {target_lang}. Maintain the meaning and context accurately.

Original Text:
{request.content[:3000]}

Provide only the translated text without any additional commentary."""
        
        response = model.generate_content(prompt)
        
        return {
            "translated_text": response.text,
            "target_language": request.target_language,
            "language_name": target_lang
        }
        
    except Exception as e:
        logging.error(f"Translation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error translating content: {str(e)}")

@api_router.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    """Upload and process video file"""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # Create temp directory for video storage
        temp_dir = Path(tempfile.gettempdir()) / "studybridge_videos"
        temp_dir.mkdir(exist_ok=True)
        
        # Generate unique filename
        video_id = str(uuid.uuid4())
        file_extension = Path(file.filename).suffix
        video_path = temp_dir / f"{video_id}{file_extension}"
        
        # Save uploaded file
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logging.info(f"Video uploaded: {video_path}")
        
        return {
            "video_id": video_id,
            "filename": file.filename,
            "path": str(video_path),
            "message": "Video uploaded successfully"
        }
        
    except Exception as e:
        logging.error(f"Video upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error uploading video: {str(e)}")

@api_router.post("/process-youtube")
async def process_youtube(request: YouTubeRequest):
    """Download and process YouTube video"""
    try:
        # Create temp directory
        temp_dir = Path(tempfile.gettempdir()) / "studybridge_videos"
        temp_dir.mkdir(exist_ok=True)
        
        video_id = str(uuid.uuid4())
        output_path = str(temp_dir / f"{video_id}.mp4")
        
        # Download YouTube video
        ydl_opts = {
            'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            'outtmpl': output_path,
            'quiet': True,
            'no_warnings': True,
            'max_filesize': 100 * 1024 * 1024,  # 100MB limit
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.youtube_url, download=True)
            title = info.get('title', 'YouTube Video')
            duration = info.get('duration', 0)
        
        logging.info(f"YouTube video downloaded: {output_path}")
        
        return {
            "video_id": video_id,
            "filename": f"{title}.mp4",
            "path": output_path,
            "duration": duration,
            "message": "YouTube video processed successfully"
        }
        
    except Exception as e:
        logging.error(f"YouTube processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing YouTube video: {str(e)}")

@api_router.post("/transcribe-video")
async def transcribe_video(video_id: str):
    """Transcribe video using Gemini AI"""
    try:
        if not gemini_key:
            return JSONResponse(
                status_code=400,
                content={"error": "Gemini API key not configured"}
            )
        
        # Find video file
        temp_dir = Path(tempfile.gettempdir()) / "studybridge_videos"
        video_files = list(temp_dir.glob(f"{video_id}.*"))
        
        if not video_files:
            raise HTTPException(status_code=404, detail="Video file not found")
        
        video_path = video_files[0]
        
        logging.info(f"Transcribing video: {video_path}")
        
        # Upload video to Gemini Files API
        video_file = genai.upload_file(path=str(video_path))
        
        # Wait for file to be processed
        import time
        while video_file.state.name == "PROCESSING":
            time.sleep(2)
            video_file = genai.get_file(video_file.name)
        
        if video_file.state.name == "FAILED":
            raise Exception("Video processing failed")
        
        # Generate transcript with Gemini
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = """Please transcribe this video completely. Provide:
1. Full transcript with timestamps in format [MM:SS]
2. Clear paragraph breaks for different topics
3. Include all spoken words accurately

Format the output as:
[00:00] transcript text here
[00:30] more transcript text
etc."""
        
        response = model.generate_content([video_file, prompt])
        transcript_text = response.text
        
        # Parse transcript into segments
        segments = []
        lines = transcript_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if line and line.startswith('['):
                # Extract timestamp and text
                try:
                    timestamp_end = line.index(']')
                    timestamp = line[1:timestamp_end]
                    text = line[timestamp_end + 1:].strip()
                    if text:
                        segments.append({
                            "timestamp": timestamp,
                            "text": text
                        })
                except ValueError:
                    # If no proper timestamp, add as continuation
                    if segments:
                        segments[-1]["text"] += " " + line
        
        # Clean up video file after transcription
        try:
            video_path.unlink()
            genai.delete_file(video_file.name)
        except Exception as cleanup_error:
            logging.warning(f"Cleanup error: {cleanup_error}")
        
        return {
            "transcript": transcript_text,
            "segments": segments,
            "message": "Video transcribed successfully"
        }
        
    except Exception as e:
        logging.error(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error transcribing video: {str(e)}")

@api_router.get("/video-file/{video_id}")
async def get_video_file(video_id: str):
    """Serve video file for playback"""
    try:
        temp_dir = Path(tempfile.gettempdir()) / "studybridge_videos"
        video_files = list(temp_dir.glob(f"{video_id}.*"))
        
        if not video_files:
            raise HTTPException(status_code=404, detail="Video file not found")
        
        video_path = video_files[0]
        return FileResponse(video_path, media_type="video/mp4")
        
    except Exception as e:
        logging.error(f"Video file error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving video: {str(e)}")

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