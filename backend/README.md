# FunCloud AI Backend

FastAPI backend providing AI-powered SEO analysis and chat functionality using OpenAI.

## Features

- **SEO Analysis**: Analyze any website URL for SEO optimization recommendations
- **AI Chat**: ChatGPT-like conversational interface with context awareness
- **OpenAI Integration**: Uses `gpt-4o-mini` for cost-effective AI responses
- **CORS Enabled**: Ready for frontend integration

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set OpenAI API Key

Create a `.env` file:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Run the Server

```bash
python main.py
```

Server runs at: `http://localhost:8000`

### 4. Test the API

Visit `http://localhost:8000/docs` for interactive API documentation.

## API Endpoints

### GET /
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "FunCloud AI Backend"
}
```

### POST /api/seo/analyze
Analyze a website for SEO optimization.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "summary": "Brief SEO analysis summary",
  "recommendations": [
    {
      "category": "Technical SEO",
      "priority": "High",
      "recommendation": "Add meta description tags",
      "impact": "Improves click-through rates from search results"
    }
  ]
}
```

### POST /api/chat
Send a chat message and get AI response.

**Request:**
```json
{
  "message": "Tell me a story",
  "history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you?"
    }
  ]
}
```

**Response:**
```json
{
  "reply": "Once upon a time...",
  "role": "assistant"
}
```

## Development

### Run with Auto-Reload

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Run Tests

```bash
pytest
```

### Docker

Build:
```bash
docker build -t funcloud-backend .
```

Run:
```bash
docker run -p 8000:8000 -e OPENAI_API_KEY=sk-xxx funcloud-backend
```

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for AWS deployment instructions.

## Environment Variables

- `OPENAI_API_KEY` (required): Your OpenAI API key

## Cost Optimization

Using `gpt-4o-mini` model:
- Input: ~$0.15 per 1M tokens
- Output: ~$0.60 per 1M tokens

Typical costs:
- SEO analysis: ~$0.01-0.02 per request
- Chat message: ~$0.001-0.005 per message

## Security Notes

- Never commit `.env` file
- Use environment variables for secrets
- Restrict CORS origins in production
- Add rate limiting for production use
- Consider API key authentication

## License

MIT
