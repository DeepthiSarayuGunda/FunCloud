"""
Simple test script to verify the API endpoints work correctly.
Run this after starting the server with: python main.py
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health check endpoint"""
    print("\n🔍 Testing health check...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    print("✅ Health check passed!")

def test_seo_analyze():
    """Test the SEO analysis endpoint"""
    print("\n🔍 Testing SEO analysis...")
    data = {"url": "https://example.com"}
    response = requests.post(
        f"{BASE_URL}/api/seo/analyze",
        json=data,
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"URL: {result.get('url')}")
    print(f"Summary: {result.get('summary')}")
    print(f"Recommendations: {len(result.get('recommendations', []))} items")
    
    if result.get('recommendations'):
        print("\nFirst recommendation:")
        rec = result['recommendations'][0]
        print(f"  Category: {rec.get('category')}")
        print(f"  Priority: {rec.get('priority')}")
        print(f"  Recommendation: {rec.get('recommendation')}")
    
    assert response.status_code == 200
    assert 'recommendations' in result
    print("✅ SEO analysis passed!")

def test_chat():
    """Test the chat endpoint"""
    print("\n🔍 Testing chat...")
    data = {
        "message": "Tell me a short joke",
        "history": []
    }
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json=data,
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Reply: {result.get('reply')}")
    
    assert response.status_code == 200
    assert 'reply' in result
    print("✅ Chat passed!")

def test_chat_with_history():
    """Test chat with conversation history"""
    print("\n🔍 Testing chat with history...")
    data = {
        "message": "What did I just ask you?",
        "history": [
            {"role": "user", "content": "Tell me a short joke"},
            {"role": "assistant", "content": "Why did the chicken cross the road? To get to the other side!"}
        ]
    }
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json=data,
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Reply: {result.get('reply')}")
    
    assert response.status_code == 200
    print("✅ Chat with history passed!")

if __name__ == "__main__":
    print("=" * 60)
    print("FunCloud AI Backend API Tests")
    print("=" * 60)
    print("\nMake sure the server is running: python main.py")
    print("And OPENAI_API_KEY is set in .env file")
    
    try:
        test_health()
        test_seo_analyze()
        test_chat()
        test_chat_with_history()
        
        print("\n" + "=" * 60)
        print("✅ All tests passed!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to server.")
        print("Make sure the server is running: python main.py")
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
