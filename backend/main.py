from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
import os
from openai import OpenAI

app = FastAPI(title="FunCloud AI Backend")

# CORS configuration for Amplify frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your Amplify domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = "gpt-4o-mini"  # Low-cost model


# Request/Response models
class SEOAnalyzeRequest(BaseModel):
    url: HttpUrl


class SEORecommendation(BaseModel):
    category: str
    priority: str
    recommendation: str
    impact: str


class SEOAnalyzeResponse(BaseModel):
    url: str
    summary: str
    recommendations: List[SEORecommendation]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    reply: str
    role: str = "assistant"


@app.get("/")
async def root():
    return {"status": "ok", "service": "FunCloud AI Backend"}


@app.post("/api/seo/analyze", response_model=SEOAnalyzeResponse)
async def analyze_seo(request: SEOAnalyzeRequest):
    """
    Analyze a website URL for SEO optimization using OpenAI.
    Returns structured recommendations.
    """
    try:
        prompt = f"""Analyze this website for AI-first SEO optimization: {request.url}

Provide a structured analysis with:
1. A brief summary (2-3 sentences)
2. 5-7 specific recommendations

Format your response as JSON with this structure:
{{
  "summary": "Brief overview of SEO status",
  "recommendations": [
    {{
      "category": "Technical SEO|Content|Performance|Mobile|Accessibility",
      "priority": "High|Medium|Low",
      "recommendation": "Specific actionable recommendation",
      "impact": "Expected impact description"
    }}
  ]
}}

Focus on: meta tags, content quality, mobile optimization, page speed, structured data, and AI discoverability."""

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are an expert SEO analyst. Provide actionable, specific recommendations in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        result = response.choices[0].message.content
        
        # Parse the JSON response
        import json
        data = json.loads(result)
        
        return SEOAnalyzeResponse(
            url=str(request.url),
            summary=data.get("summary", "Analysis complete"),
            recommendations=[
                SEORecommendation(**rec) for rec in data.get("recommendations", [])
            ]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SEO analysis failed: {str(e)}")


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint that provides AI responses like ChatGPT.
    Maintains conversation history.
    """
    try:
        # Build messages array with history
        messages = [
            {"role": "system", "content": "You are FunCloud AI, a friendly and helpful assistant for a family-friendly app. Be warm, encouraging, and provide helpful responses about stories, learning, parties, quotes, and general questions."}
        ]
        
        # Add conversation history
        for msg in request.history[-10:]:  # Keep last 10 messages for context
            messages.append({"role": msg.role, "content": msg.content})
        
        # Add current message
        messages.append({"role": "user", "content": request.message})

        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.8,
            max_tokens=500
        )

        reply = response.choices[0].message.content

        return ChatResponse(reply=reply)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
