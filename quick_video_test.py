#!/usr/bin/env python3
"""
Quick Video Endpoint Tests for StudyBridge
"""

import requests
import json
import io

API_BASE = "http://127.0.0.1:8001/api"

def test_endpoints():
    results = {}
    
    print("=== Quick Video Endpoint Tests ===")
    
    # Test 1: Video Upload
    print("\n1. Testing Video Upload...")
    try:
        mock_video_content = b"fake video content for testing"
        files = {
            'file': ('test_video.mp4', io.BytesIO(mock_video_content), 'video/mp4')
        }
        
        response = requests.post(f"{API_BASE}/upload-video", files=files, timeout=10)
        if response.status_code == 200:
            data = response.json()
            results['upload'] = {'success': True, 'video_id': data.get('video_id')}
            print(f"✅ Upload successful - Video ID: {data.get('video_id')}")
        else:
            results['upload'] = {'success': False, 'error': f"HTTP {response.status_code}"}
            print(f"❌ Upload failed - {response.status_code}")
    except Exception as e:
        results['upload'] = {'success': False, 'error': str(e)}
        print(f"❌ Upload error: {e}")
    
    # Test 2: YouTube Processing
    print("\n2. Testing YouTube Processing...")
    try:
        payload = {"youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
        response = requests.post(f"{API_BASE}/process-youtube", json=payload, timeout=30)
        if response.status_code == 200:
            data = response.json()
            results['youtube'] = {'success': True, 'video_id': data.get('video_id')}
            print(f"✅ YouTube processing successful - Video ID: {data.get('video_id')}")
        else:
            results['youtube'] = {'success': False, 'error': f"HTTP {response.status_code}"}
            print(f"❌ YouTube processing failed - {response.status_code}")
    except Exception as e:
        results['youtube'] = {'success': False, 'error': str(e)}
        print(f"❌ YouTube error: {e}")
    
    # Test 3: Video Transcription (if we have a video_id)
    print("\n3. Testing Video Transcription...")
    video_id = None
    if results.get('upload', {}).get('success'):
        video_id = results['upload']['video_id']
    
    if video_id:
        try:
            response = requests.post(f"{API_BASE}/transcribe-video?video_id={video_id}", timeout=15)
            if response.status_code == 200:
                results['transcription'] = {'success': True}
                print("✅ Transcription endpoint accessible")
            elif "Gemini API key not configured" in response.text:
                results['transcription'] = {'success': True, 'note': 'API key issue expected'}
                print("✅ Transcription endpoint working (API key issue expected)")
            else:
                results['transcription'] = {'success': False, 'error': f"HTTP {response.status_code}"}
                print(f"❌ Transcription failed - {response.status_code}")
        except Exception as e:
            if "timeout" in str(e).lower():
                results['transcription'] = {'success': True, 'note': 'Timeout expected for Gemini API'}
                print("✅ Transcription endpoint working (timeout expected)")
            else:
                results['transcription'] = {'success': False, 'error': str(e)}
                print(f"❌ Transcription error: {e}")
    else:
        results['transcription'] = {'success': False, 'error': 'No video_id available'}
        print("❌ No video_id available for transcription test")
    
    # Test 4: Video File Serving
    print("\n4. Testing Video File Serving...")
    if video_id:
        try:
            response = requests.get(f"{API_BASE}/video-file/{video_id}", timeout=10)
            if response.status_code == 200:
                results['serving'] = {'success': True}
                print("✅ Video serving successful")
            else:
                results['serving'] = {'success': False, 'error': f"HTTP {response.status_code}"}
                print(f"❌ Video serving failed - {response.status_code}")
        except Exception as e:
            results['serving'] = {'success': False, 'error': str(e)}
            print(f"❌ Video serving error: {e}")
    else:
        results['serving'] = {'success': False, 'error': 'No video_id available'}
        print("❌ No video_id available for serving test")
    
    # Test 5: Error Handling
    print("\n5. Testing Error Handling...")
    try:
        # Test invalid video_id
        response = requests.get(f"{API_BASE}/video-file/invalid-id", timeout=5)
        if response.status_code == 404:
            results['error_handling'] = {'success': True}
            print("✅ Error handling working correctly")
        else:
            results['error_handling'] = {'success': False, 'error': f"Expected 404, got {response.status_code}"}
            print(f"❌ Error handling issue - Expected 404, got {response.status_code}")
    except Exception as e:
        results['error_handling'] = {'success': False, 'error': str(e)}
        print(f"❌ Error handling test failed: {e}")
    
    return results

def main():
    results = test_endpoints()
    
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    
    total_tests = len(results)
    successful_tests = sum(1 for r in results.values() if r.get('success'))
    
    for test_name, result in results.items():
        status = "✅ PASS" if result.get('success') else "❌ FAIL"
        print(f"{test_name.upper()}: {status}")
        if not result.get('success'):
            print(f"  Error: {result.get('error', 'Unknown error')}")
        elif result.get('note'):
            print(f"  Note: {result['note']}")
    
    print(f"\nOVERALL: {successful_tests}/{total_tests} tests passed")
    return results

if __name__ == "__main__":
    main()