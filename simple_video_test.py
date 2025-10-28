#!/usr/bin/env python3
"""
Simple Video Endpoint Tests for StudyBridge
"""

import requests
import json
import io
from pathlib import Path

# Get backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = Path("/app/frontend/.env")
    if frontend_env_path.exists():
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

print(f"Testing backend at: {API_BASE}")

def test_video_upload():
    """Test video upload endpoint"""
    print("\n=== Testing Video Upload ===")
    
    try:
        # Create a small mock video file
        mock_video_content = b"fake video content for testing"
        files = {
            'file': ('test_video.mp4', io.BytesIO(mock_video_content), 'video/mp4')
        }
        
        response = requests.post(f"{API_BASE}/upload-video", files=files, timeout=15)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            return data.get('video_id')
        
    except Exception as e:
        print(f"Error: {str(e)}")
    
    return None

def test_youtube_processing():
    """Test YouTube processing endpoint"""
    print("\n=== Testing YouTube Processing ===")
    
    try:
        payload = {
            "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
        
        response = requests.post(f"{API_BASE}/process-youtube", json=payload, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            return data.get('video_id')
        
    except Exception as e:
        print(f"Error: {str(e)}")
    
    return None

def test_video_transcription(video_id):
    """Test video transcription endpoint"""
    print(f"\n=== Testing Video Transcription (video_id: {video_id}) ===")
    
    if not video_id:
        print("No video_id available for transcription test")
        return
    
    try:
        response = requests.post(f"{API_BASE}/transcribe-video?video_id={video_id}", timeout=60)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error: {str(e)}")

def test_video_serving(video_id):
    """Test video file serving endpoint"""
    print(f"\n=== Testing Video File Serving (video_id: {video_id}) ===")
    
    if not video_id:
        print("No video_id available for serving test")
        return
    
    try:
        response = requests.get(f"{API_BASE}/video-file/{video_id}", timeout=15)
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
        print(f"Content-Length: {len(response.content)} bytes")
        
    except Exception as e:
        print(f"Error: {str(e)}")

def main():
    print("Starting Simple Video Endpoint Tests")
    print("=" * 50)
    
    # Test video upload
    video_id = test_video_upload()
    
    # Test YouTube processing
    youtube_video_id = test_youtube_processing()
    
    # Test transcription with uploaded video
    test_video_transcription(video_id)
    
    # Test video serving with uploaded video
    test_video_serving(video_id)
    
    print("\n" + "=" * 50)
    print("Tests completed")

if __name__ == "__main__":
    main()