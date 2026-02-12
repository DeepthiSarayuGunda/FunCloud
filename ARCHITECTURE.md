# FunCloud AI Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              FunCloud Frontend (Static)                 │ │
│  │                                                          │ │
│  │  • index.html (UI)                                      │ │
│  │  • app.js (Logic)                                       │ │
│  │  • api.js (API Client) ◄─── NEW                        │ │
│  │                                                          │ │
│  │  Features:                                              │ │
│  │  ├─ SEO Analyzer (Analyze Button)                      │ │
│  │  └─ AI Chat (Chat Tab)                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      AWS AMPLIFY                             │
│                   (Static Hosting + CDN)                     │
│                                                              │
│  • Serves frontend files                                    │
│  • HTTPS/SSL automatic                                      │
│  • Global CDN                                               │
│  • Auto-deploy from Git                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND OPTIONS                           │
│                                                              │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   Option 1: Lambda   │      │   Option 2: ECS      │    │
│  │   + API Gateway      │      │   + Fargate + ALB    │    │
│  │                      │      │                      │    │
│  │  • Pay per request   │      │  • Always running    │    │
│  │  • Auto-scaling      │      │  • No cold starts    │    │
│  │  • $2-5/month        │      │  • $30-35/month      │    │
│  └──────────────────────┘      └──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Both run same FastAPI app
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND                             │
│                    (main.py)                                 │
│                                                              │
│  Endpoints:                                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ POST /api/seo/analyze                                   │ │
│  │  • Receives: { url: "https://example.com" }            │ │
│  │  • Returns: SEO recommendations (structured JSON)       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ POST /api/chat                                          │ │
│  │  • Receives: { message: "...", history: [...] }        │ │
│  │  • Returns: AI reply with context awareness             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      OPENAI API                              │
│                   (gpt-4o-mini model)                        │
│                                                              │
│  • SEO Analysis: Structured recommendations                 │
│  • Chat: Conversational AI with context                     │
│  • Cost: ~$0.01/analysis, ~$0.002/message                   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### SEO Analysis Flow

```
User enters URL
    │
    ▼
Frontend (app.js)
    │ analyzeSEO(url)
    ▼
API Client (api.js)
    │ POST /api/seo/analyze
    ▼
Backend (main.py)
    │ Build prompt
    ▼
OpenAI API
    │ gpt-4o-mini generates analysis
    ▼
Backend (main.py)
    │ Parse JSON response
    │ Structure recommendations
    ▼
Frontend (app.js)
    │ Render results with colors
    ▼
User sees recommendations
```

### Chat Flow

```
User types message
    │
    ▼
Frontend (app.js)
    │ sendChatMessage(msg, history)
    ▼
API Client (api.js)
    │ POST /api/chat
    ▼
Backend (main.py)
    │ Build conversation context
    │ Include last 10 messages
    ▼
OpenAI API
    │ gpt-4o-mini generates reply
    ▼
Backend (main.py)
    │ Return reply
    ▼
Frontend (app.js)
    │ Add to chat history
    │ Save to localStorage
    ▼
User sees AI response
```

## Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (existing styles)
- **Vanilla JavaScript** - Logic (ES6 modules)
- **Fetch API** - HTTP requests

### Backend
- **Python 3.11** - Runtime
- **FastAPI** - Web framework
- **Pydantic** - Data validation
- **OpenAI SDK** - AI integration
- **Uvicorn** - ASGI server

### Infrastructure
- **AWS Amplify** - Frontend hosting
- **AWS Lambda** - Serverless compute (Option 1)
- **AWS API Gateway** - HTTP API (Option 1)
- **AWS ECS Fargate** - Container hosting (Option 2)
- **AWS ALB** - Load balancer (Option 2)
- **AWS ECR** - Container registry (Option 2)

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                         │
│                                                              │
│  1. HTTPS/TLS                                               │
│     └─ All traffic encrypted (Amplify + AWS)               │
│                                                              │
│  2. CORS Protection                                         │
│     └─ Backend only accepts requests from allowed origins   │
│                                                              │
│  3. Environment Variables                                   │
│     └─ API keys never in code or frontend                   │
│                                                              │
│  4. Input Validation                                        │
│     └─ Pydantic models validate all inputs                  │
│                                                              │
│  5. Rate Limiting (Optional)                                │
│     └─ API Gateway throttling                               │
│                                                              │
│  6. Error Handling                                          │
│     └─ No sensitive data in error messages                  │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architectures

### Option 1: Lambda (Serverless)

```
Internet
    │
    ▼
CloudFront (Amplify CDN)
    │
    ├─► Static Files (Frontend)
    │
    └─► API Gateway
            │
            ▼
        Lambda Function
            │
            ▼
        OpenAI API
```

**Pros:**
- Pay per request
- Auto-scaling
- No server management
- Low cost for low traffic

**Cons:**
- Cold start latency (1-2s)
- 30 second timeout
- More complex debugging

### Option 2: ECS Fargate (Containerized)

```
Internet
    │
    ▼
CloudFront (Amplify CDN)
    │
    ├─► Static Files (Frontend)
    │
    └─► Application Load Balancer
            │
            ▼
        ECS Service (Fargate)
            │
            ├─► Task 1 (Container)
            ├─► Task 2 (Container)
            └─► Task N (Container)
                    │
                    ▼
                OpenAI API
```

**Pros:**
- Consistent performance
- No cold starts
- Better for high traffic
- Easier debugging

**Cons:**
- Fixed cost (~$30/month)
- More complex setup
- Need to manage scaling

## Cost Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      COST BREAKDOWN                          │
│                                                              │
│  OpenAI API (gpt-4o-mini)                                   │
│  ├─ Input: $0.15 per 1M tokens                             │
│  ├─ Output: $0.60 per 1M tokens                            │
│  └─ Typical: $5-10/month                                    │
│                                                              │
│  AWS Lambda Setup                                           │
│  ├─ Lambda: $0.20 per 1M requests                          │
│  ├─ API Gateway: $1.00 per 1M requests                     │
│  ├─ Amplify: $0-5/month                                    │
│  └─ Total: $10-20/month                                     │
│                                                              │
│  AWS ECS Setup                                              │
│  ├─ Fargate: $10/month                                     │
│  ├─ ALB: $16/month                                         │
│  ├─ Amplify: $0-5/month                                    │
│  └─ Total: $40-50/month                                     │
└─────────────────────────────────────────────────────────────┘
```

## Scalability

### Current Capacity
- **Lambda**: Unlimited concurrent requests (AWS handles scaling)
- **ECS**: 1-100+ tasks (configure auto-scaling)
- **OpenAI**: Rate limits based on tier (check dashboard)

### Bottlenecks
1. **OpenAI API** - Rate limits (60 requests/min on free tier)
2. **Lambda Cold Starts** - First request takes 1-2s
3. **Database** - None currently (stateless)

### Scaling Strategy
1. Start with Lambda (low cost)
2. Monitor usage and costs
3. Switch to ECS if:
   - High traffic (>100K requests/month)
   - Need consistent performance
   - Cold starts are problematic

## Monitoring

### Key Metrics to Track
- **Request count** - Total API calls
- **Response time** - P50, P95, P99
- **Error rate** - 4xx and 5xx errors
- **OpenAI cost** - Token usage
- **Lambda cold starts** - Frequency and duration

### Tools
- **CloudWatch** - AWS metrics and logs
- **OpenAI Dashboard** - Usage and costs
- **Amplify Console** - Frontend metrics
- **X-Ray** (optional) - Distributed tracing

## Future Enhancements

### Phase 1 (Short Term)
- Add caching layer (Redis/ElastiCache)
- Implement rate limiting per user
- Add authentication (Cognito)

### Phase 2 (Medium Term)
- Store chat history in DynamoDB
- Add WebSocket support for streaming
- Implement A/B testing

### Phase 3 (Long Term)
- Multi-region deployment
- Custom AI models
- Real-time analytics dashboard
