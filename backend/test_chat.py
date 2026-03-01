#!/usr/bin/env python3
"""
Test script for FunCloud AI Chat backend
Run: python test_chat.py
"""

import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Backend URL - change if deployed elsewhere
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

def test_root():
    """Test root endpoint"""
    print("Testing root endpoint...")
    response = requests.get(f"{BACKEND_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_chat():
    """Test chat endpoint"""
    print("Testing chat endpoint...")
    
    payload = {
        "message": "Hello! Tell me a short joke.",
        "history": []
    }
    
    response = requests.post(
        f"{BACKEND_URL}/api/chat",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"AI Reply: {data['reply']}")
        print("✅ Chat is working!")
    else:
        print(f"❌ Error: {response.text}")
    print()

def test_chat_with_history():
    """Test chat with conversation history"""
    print("Testing chat with history...")
    
    payload = {
        "message": "What was my previous question?",
        "history": [
            {"role": "user", "content": "Hello! Tell me a short joke."},
            {"role": "assistant", "content": "Why did the chicken cross the road? To get to the other side!"}
        ]
    }
    
    response = requests.post(
        f"{BACKEND_URL}/api/chat",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"AI Reply: {data['reply']}")
        print("✅ Chat with history is working!")
    else:
        print(f"❌ Error: {response.text}")
    print()

if __name__ == "__main__":
    print("=" * 60)
    print("FunCloud AI Chat Backend Test")
    print("=" * 60)
    print()
    
    try:
        test_root()
        test_chat()
        test_chat_with_history()
        
        print("=" * 60)
        print("All tests completed!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is it running?")
        print(f"   Expected URL: {BACKEND_URL}")
        print("   Run: python backend/main.py")
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
