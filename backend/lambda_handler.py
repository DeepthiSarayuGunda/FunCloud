"""
Simple Lambda handler for FunCloud AI Chat
Handles POST requests with OpenAI integration
"""

import json
import os
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

def lambda_handler(event, context):
    """
    Lambda handler for AI chat endpoint
    Expects: POST with JSON body { "message": "user message" }
    Returns: { "reply": "AI response" }
    """
    
    # Enhanced CORS headers
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400'
    }
    
    # Handle OPTIONS preflight
    http_method = event.get('requestContext', {}).get('http', {}).get('method') or event.get('httpMethod', '') or event.get('requestContext', {}).get('httpMethod', '')
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    # Get path - handle both Function URL and API Gateway formats
    path = event.get('rawPath') or event.get('path', '/')
    
    # Accept both root and /api/chat paths
    if path not in ['/', '/api/chat', '/api/chat/']:
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': f'Not found: {path}. Use POST /api/chat'})
        }
    
    try:
        # Parse request body
        body_str = event.get('body', '{}')
        if isinstance(body_str, str):
            body = json.loads(body_str) if body_str else {}
        else:
            body = body_str
        
        message = body.get('message', '').strip()
        
        if not message:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Message is required'})
            }
        
        # Check if OpenAI key is configured
        if not os.environ.get('OPENAI_API_KEY'):
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'OpenAI API key not configured'})
            }
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are FunCloud AI, a friendly and helpful assistant. Be warm, encouraging, and provide helpful responses."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            max_tokens=500,
            temperature=0.8
        )
        
        # Extract reply
        reply = response.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'reply': reply})
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")  # CloudWatch logs
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'AI service error: {str(e)}'})
        }
