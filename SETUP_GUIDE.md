# FunCloud AI - Complete Setup Guide

This guide will walk you through setting up the AI-powered SEO analysis and chat features end-to-end.

## 🎯 What You're Building

- **SEO Analyzer**: Enter any URL and get AI-powered SEO recommendations
- **AI Chat**: ChatGPT-like conversational interface with context awareness
- **Backend**: FastAPI server with OpenAI integration
- **Frontend**: Static site hosted on AWS Amplify

## 📋 Prerequisites

1. **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
2. **AWS Account** - For hosting backend and frontend
3. **Python 3.11+** - For backend development
4. **Git** - For version control

## 🚀 Quick Start (Local Development)

### Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add $5-10 credits to your account

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo "OPENAI_API_KEY=sk-your-actual-key-here" > .env

# Start the server
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 3: Test Backend

Open a new terminal and run:

```bash
cd backend
python test_api.py
```

You should see all tests pass ✅

Or visit http://localhost:8000/docs for interactive API documentation.

### Step 4: Setup Frontend

```bash
# Navigate to frontend directory
cd frontend

# The frontend is static HTML/JS, so just serve it
# Option 1: Python
python -m http.server 8080

# Option 2: Node.js
npx serve -p 8080

# Option 3: PHP
php -S localhost:8080
```

### Step 5: Configure Frontend API URL

Edit `frontend/api.js` and update line 8:

```javascript
const API_BASE_URL = "http://localhost:8000";
```

### Step 6: Test the Features

1. Open http://localhost:8080 in your browser
2. Navigate to the **Quotes** page (you'll see the purple SEO card at top)
3. Enter a URL (e.g., `https://example.com`) and click **ANALYZE**
4. Navigate to the **Chat** tab
5. Type a message and see AI responses!

## 🌐 Production Deployment

### Option A: AWS Lambda (Best for Low Traffic)

**Pros:**
- Pay per request (~$2-5/month for 10K requests)
- Auto-scaling
- No server management

**Cons:**
- Cold start latency (1-2 seconds)
- 30 second timeout limit

**Steps:**

1. **Package Lambda deployment:**
```bash
cd backend
pip install -r requirements-lambda.txt -t package/
cp main.py lambda_handler.py package/
cd package && zip -r ../lambda-deployment.zip . && cd ..
```

2. **Create Lambda function:**
   - Go to AWS Lambda Console
   - Create function: `funcloud-ai-backend`
   - Runtime: Python 3.11
   - Upload `lambda-deployment.zip`
   - Handler: `lambda_handler.handler`
   - Timeout: 30 seconds
   - Memory: 512 MB
   - Environment variable: `OPENAI_API_KEY=sk-xxx`

3. **Create API Gateway:**
   - Create HTTP API
   - Add Lambda integration
   - Enable CORS (allow `*` or your Amplify domain)
   - Deploy

4. **Get your API URL:**
   - Format: `https://xxx.execute-api.region.amazonaws.com`

### Option B: AWS ECS Fargate (Best for Production)

**Pros:**
- Consistent performance
- No cold starts
- Better for high traffic

**Cons:**
- Fixed cost (~$30/month)
- More complex setup

**Steps:**

1. **Build and push Docker image:**
```bash
cd backend

# Create ECR repository
aws ecr create-repository --repository-name funcloud-backend

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t funcloud-backend .
docker tag funcloud-backend:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/funcloud-backend:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/funcloud-backend:latest
```

2. **Create ECS cluster and service** (see DEPLOYMENT.md for detailed steps)

3. **Get your API URL:**
   - Format: `http://your-alb.region.elb.amazonaws.com`

### Deploy Frontend to AWS Amplify

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Add AI features"
git push origin main
```

2. **Connect to Amplify:**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Select branch: `main`
   - Build settings: Use existing `amplify.yml`

3. **Add environment variable:**
   - In Amplify Console → Environment variables
   - Add: `FUNCLOUD_API_URL` = `your-backend-url`

4. **Update frontend to use environment variable:**

Edit `frontend/index.html`, add before `</head>`:

```html
<script>
  // Set API URL - replace with your actual backend URL
  window.FUNCLOUD_API_URL = 'https://your-api-url-here';
</script>
```

5. **Deploy:**
   - Amplify will auto-deploy on push
   - Your app will be at: `https://main.xxx.amplifyapp.com`

## 🧪 Testing Your Deployment

### Test SEO Analyzer

```bash
curl -X POST https://your-backend-url/api/seo/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Test Chat

```bash
curl -X POST https://your-backend-url/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "history": []}'
```

## 💰 Cost Breakdown

### OpenAI API (gpt-4o-mini)
- Input: $0.15 per 1M tokens (~$0.01 per SEO analysis)
- Output: $0.60 per 1M tokens (~$0.002 per chat message)
- **Estimated: $5-10/month for moderate use**

### AWS Lambda + API Gateway
- Lambda: $0.20 per 1M requests
- API Gateway: $1.00 per 1M requests
- **Estimated: $2-5/month for 10K requests**

### AWS ECS Fargate
- Fargate: $10/month (0.25 vCPU, 0.5 GB)
- ALB: $16/month
- **Estimated: $30-35/month**

### AWS Amplify
- Free tier: 1000 build minutes/month
- Hosting: $0.15/GB served
- **Estimated: $0-5/month**

**Total Monthly Cost:**
- Lambda setup: $10-20/month
- ECS setup: $40-50/month

## 🔒 Security Checklist

- [ ] Never commit `.env` file or API keys
- [ ] Use environment variables for secrets
- [ ] Restrict CORS to your Amplify domain in production
- [ ] Enable HTTPS (API Gateway/ALB handles this)
- [ ] Add rate limiting (API Gateway throttling)
- [ ] Monitor OpenAI usage and set spending limits
- [ ] Use AWS Secrets Manager for API keys (optional)

## 🐛 Troubleshooting

### "OPENAI_API_KEY not set"
- Check `.env` file exists in backend directory
- Verify key starts with `sk-`
- For Lambda: Check environment variables in AWS Console

### "CORS error" in browser
- Backend: Check CORS middleware allows your domain
- API Gateway: Enable CORS in settings
- Check browser console for specific error

### "Connection refused"
- Backend not running: Start with `python main.py`
- Wrong port: Check backend runs on 8000, frontend on 8080
- Firewall: Allow connections on these ports

### "502 Bad Gateway" (Lambda)
- Check CloudWatch logs for errors
- Verify Lambda timeout is 30 seconds
- Check OpenAI API key is valid

### Chat not working
- Check browser console for errors
- Verify API URL is correct in `api.js`
- Test backend directly with curl

### SEO results not showing
- Check browser console for errors
- Verify URL format is correct (include https://)
- Test backend endpoint with curl

## 📚 Next Steps

1. **Add authentication** - Protect your API with API keys
2. **Add caching** - Cache SEO results to reduce costs
3. **Add analytics** - Track usage with CloudWatch
4. **Improve UI** - Add loading spinners, better error messages
5. **Add more features** - Image generation, content writing, etc.

## 🆘 Getting Help

- **Backend issues**: Check `backend/README.md`
- **Deployment issues**: Check `DEPLOYMENT.md`
- **OpenAI issues**: https://platform.openai.com/docs
- **AWS issues**: AWS documentation for Lambda/ECS/Amplify

## 📝 Summary

You now have:
- ✅ FastAPI backend with OpenAI integration
- ✅ SEO analysis endpoint returning structured recommendations
- ✅ Chat endpoint with conversation history
- ✅ Frontend wired to call backend APIs
- ✅ Deployment options for AWS
- ✅ Cost estimates and security best practices

Your Analyze button and Chat tab are now powered by real AI! 🎉
