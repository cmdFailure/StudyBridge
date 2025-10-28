#!/usr/bin/env python3
"""
Backend API Testing for StudyBridge Application
Tests video learning endpoints and existing endpoints for regression
"""

import requests
import json
import sys
import os
import io
import time
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

def test_translation_endpoint():
    """Test the /api/translate-content endpoint thoroughly"""
    print("\n=== Testing Translation API Endpoint ===")
    
    # Test content as specified in the review request
    test_content = "Hello, this is a test document about learning and education."
    
    # Test cases for different languages
    test_cases = [
        {"lang": "zh", "name": "Mandarin"},
        {"lang": "hi", "name": "Hindi"}, 
        {"lang": "ar", "name": "Arabic"}
    ]
    
    results = []
    
    for case in test_cases:
        print(f"\n--- Testing translation to {case['name']} ({case['lang']}) ---")
        
        payload = {
            "content": test_content,
            "target_language": case['lang']
        }
        
        try:
            response = requests.post(f"{API_BASE}/translate-content", 
                                   json=payload, 
                                   timeout=30)
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response keys: {list(data.keys())}")
                
                # Verify required fields
                required_fields = ['translated_text', 'target_language', 'language_name']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    print(f"❌ Missing required fields: {missing_fields}")
                    results.append({"lang": case['lang'], "success": False, "error": f"Missing fields: {missing_fields}"})
                else:
                    print(f"✅ All required fields present")
                    print(f"Target Language: {data['target_language']}")
                    print(f"Language Name: {data['language_name']}")
                    print(f"Translated Text (first 100 chars): {data['translated_text'][:100]}...")
                    
                    # Verify the translation is not empty and different from original
                    if data['translated_text'] and data['translated_text'] != test_content:
                        print(f"✅ Translation successful for {case['name']}")
                        results.append({"lang": case['lang'], "success": True, "data": data})
                    else:
                        print(f"❌ Translation appears to be empty or unchanged")
                        results.append({"lang": case['lang'], "success": False, "error": "Empty or unchanged translation"})
            else:
                print(f"❌ Request failed with status {response.status_code}")
                print(f"Response: {response.text}")
                results.append({"lang": case['lang'], "success": False, "error": f"HTTP {response.status_code}: {response.text}"})
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request error: {str(e)}")
            results.append({"lang": case['lang'], "success": False, "error": f"Request error: {str(e)}"})
    
    return results

def test_error_handling():
    """Test error handling for translation endpoint"""
    print("\n=== Testing Translation Error Handling ===")
    
    error_test_cases = [
        {
            "name": "Empty content",
            "payload": {"content": "", "target_language": "zh"},
            "expected_error": True
        },
        {
            "name": "Invalid language code", 
            "payload": {"content": "Test content", "target_language": "invalid"},
            "expected_error": True
        },
        {
            "name": "Missing content field",
            "payload": {"target_language": "zh"},
            "expected_error": True
        },
        {
            "name": "Missing target_language field",
            "payload": {"content": "Test content"},
            "expected_error": True
        }
    ]
    
    error_results = []
    
    for case in error_test_cases:
        print(f"\n--- Testing: {case['name']} ---")
        
        try:
            response = requests.post(f"{API_BASE}/translate-content", 
                                   json=case['payload'], 
                                   timeout=10)
            
            print(f"Status Code: {response.status_code}")
            
            if case['expected_error']:
                if response.status_code >= 400:
                    print(f"✅ Error handling working correctly")
                    error_results.append({"test": case['name'], "success": True})
                else:
                    print(f"❌ Expected error but got success response")
                    error_results.append({"test": case['name'], "success": False, "error": "Expected error but got success"})
            else:
                if response.status_code == 200:
                    print(f"✅ Request successful as expected")
                    error_results.append({"test": case['name'], "success": True})
                else:
                    print(f"❌ Expected success but got error")
                    error_results.append({"test": case['name'], "success": False, "error": f"Expected success but got {response.status_code}"})
                    
        except requests.exceptions.RequestException as e:
            print(f"❌ Request error: {str(e)}")
            error_results.append({"test": case['name'], "success": False, "error": f"Request error: {str(e)}"})
    
    return error_results

def test_existing_endpoints():
    """Quick regression test of existing endpoints"""
    print("\n=== Testing Existing Endpoints (Regression) ===")
    
    endpoints_to_test = [
        {
            "name": "Root endpoint",
            "url": f"{API_BASE}/",
            "method": "GET",
            "expected_status": 200
        },
        {
            "name": "Simplify content endpoint",
            "url": f"{API_BASE}/simplify-content", 
            "method": "POST",
            "payload": {"content": "This is a test content for simplification.", "reading_level": 8},
            "expected_status": 200
        },
        {
            "name": "Generate study aids endpoint",
            "url": f"{API_BASE}/generate-study-aids",
            "method": "POST", 
            "payload": {"content": "This is test content for study aids.", "aid_type": "summary"},
            "expected_status": 200
        }
    ]
    
    regression_results = []
    
    for endpoint in endpoints_to_test:
        print(f"\n--- Testing: {endpoint['name']} ---")
        
        try:
            if endpoint['method'] == 'GET':
                response = requests.get(endpoint['url'], timeout=10)
            else:
                response = requests.post(endpoint['url'], 
                                       json=endpoint.get('payload', {}), 
                                       timeout=30)
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == endpoint['expected_status']:
                print(f"✅ {endpoint['name']} working correctly")
                regression_results.append({"endpoint": endpoint['name'], "success": True})
            else:
                print(f"❌ {endpoint['name']} failed - Expected {endpoint['expected_status']}, got {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                regression_results.append({"endpoint": endpoint['name'], "success": False, "error": f"HTTP {response.status_code}"})
                
        except requests.exceptions.RequestException as e:
            print(f"❌ {endpoint['name']} - Request error: {str(e)}")
            regression_results.append({"endpoint": endpoint['name'], "success": False, "error": f"Request error: {str(e)}"})
    
    return regression_results

def main():
    """Run all tests and provide summary"""
    print("Starting StudyBridge Backend API Tests")
    print("=" * 50)
    
    # Test translation endpoint
    translation_results = test_translation_endpoint()
    
    # Test error handling
    error_results = test_error_handling()
    
    # Test existing endpoints
    regression_results = test_existing_endpoints()
    
    # Summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    
    # Translation results
    print("\nTranslation Tests:")
    translation_success = 0
    for result in translation_results:
        status = "✅ PASS" if result['success'] else "❌ FAIL"
        print(f"  {result['lang']}: {status}")
        if not result['success']:
            print(f"    Error: {result['error']}")
        else:
            translation_success += 1
    
    # Error handling results
    print("\nError Handling Tests:")
    error_success = 0
    for result in error_results:
        status = "✅ PASS" if result['success'] else "❌ FAIL"
        print(f"  {result['test']}: {status}")
        if not result['success']:
            print(f"    Error: {result['error']}")
        else:
            error_success += 1
    
    # Regression results
    print("\nRegression Tests:")
    regression_success = 0
    for result in regression_results:
        status = "✅ PASS" if result['success'] else "❌ FAIL"
        print(f"  {result['endpoint']}: {status}")
        if not result['success']:
            print(f"    Error: {result['error']}")
        else:
            regression_success += 1
    
    # Overall summary
    total_tests = len(translation_results) + len(error_results) + len(regression_results)
    total_success = translation_success + error_success + regression_success
    
    print(f"\nOVERALL: {total_success}/{total_tests} tests passed")
    
    if total_success == total_tests:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed - see details above")
        return 1

if __name__ == "__main__":
    sys.exit(main())