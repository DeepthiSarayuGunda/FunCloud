# Quick Fix: AI Chat Not Working

## The Problem
Chat shows "Unknown error" because:
1. Backend isn't running or deployed
2. OpenAI API key not set
3. Frontend can't reach backend

## Quick Fix (5 minutes)

### 1. Add Your OpenAI API Key

Edit `backend/.env`:
```bash
OPENAI_API_KEY=sk-proj-YOUR-ACTUAL-KEY-HERE
ALLOWED_ORIGINS=*
```

### 2. Start Backend Locally

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend runs at `http://localhost:8000`

### 3. Test It Works

Open new terminal:
```bash
cd backend
python test_chat.py
```

Should see: ✅ Chat is working!

### 4. Update Frontend (Temporary Fix)

Edit `frontend/env-config.js`, change line 11:
```javascript
window.ENV.API_BASE_URL = window.FUNCLOUD_API_URL || 'http://localhost:8000';
```

### 5. Open Frontend

Open `frontend/index.html` in browser or run:
```bash
cd frontend
python -m http.server 3000
```

Go to `http://localhost:3000` and test chat.

## For Production

### Deploy Backend to AWS Lambda

```bash
cd backend
# Edit deploy-lambda.sh with your AWS details
./deploy-lambda.sh
```

### Set Amplify Environment Variable

Amplify Console → Environment Variables:
```
FUNCLOUD_API_URL = https://your-lambda-url.execute-api.us-east-1.amazonaws.com
```

### Set Lambda Environment Variables

Lambda Console → Configuration → Environment Variables:
```
OPENAI_API_KEY = sk-proj-your-key
ALLOWED_ORIGINS = https://main.d1234abcd.amplifyapp.com
```

## Done!

Chat should now work both locally and in production.

Check `AI_CHAT_SETUP_GUIDE.md` for detailed instructions.
