# AI Chat Setup Guide - Complete Fix

## Problem
Chat shows "Unknown error" because backend isn't configured or frontend can't reach it.

## Solution Steps

### Step 1: Configure Backend Locally

1. **Add your OpenAI API key to `.env` file:**
   ```bash
   cd backend
   # Edit .env file and replace with your actual key
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Test backend locally:**
   ```bash
   python main.py
   ```
   
   Backend should start at `http://localhost:8000`

4. **Test chat endpoint:**
   ```bash
   python test_chat.py
   ```
   
   You should see AI responses. If not, check your OpenAI API key.

### Step 2: Deploy Backend to AWS

Choose one option:

#### Option A: AWS Lambda (Recommended)
```bash
cd backend
./deploy-lambda.sh
```

After deployment, note the API Gateway URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com`)

Set environment variables in Lambda Console:
- `OPENAI_API_KEY` = your OpenAI key
- `ALLOWED_ORIGINS` = your Amplify domain

#### Option B: AWS EC2
1. Launch EC2 instance
2. SSH into instance
3. Clone repo and install dependencies
4. Create `.env` file with your keys
5. Run: `python main.py`
6. Note the public IP or domain

### Step 3: Configure Frontend

1. **Update frontend to use your backend URL:**

   Edit `frontend/env-config.js` and replace the fallback URL:
   ```javascript
   window.FUNCLOUD_API_URL = 'https://your-backend-url.com';
   ```

2. **Or set in Amplify Console:**
   - Go to Amplify Console → Your App → Environment Variables
   - Add: `FUNCLOUD_API_URL` = `https://your-backend-url.com`

### Step 4: Update Backend CORS

In your backend `.env` file or Lambda environment variables:
```
ALLOWED_ORIGINS=https://main.d1234abcd.amplifyapp.com,https://yourdomain.com
```

Replace with your actual Amplify domain (find it in Amplify Console).

### Step 5: Test Production

1. Open your Amplify app
2. Go to Chat tab
3. Type a message
4. Should see AI response (not error)

## Troubleshooting

### "Unknown error" persists

**Check browser console (F12):**
- Look for CORS errors → Update `ALLOWED_ORIGINS` in backend
- Look for 404 errors → Frontend has wrong backend URL
- Look for 500 errors → Backend OpenAI key is invalid

**Check backend logs:**
- Lambda: CloudWatch Logs
- EC2: Terminal output or log files

### "OpenAI API key not configured"

Backend `.env` file is missing or not loaded. Verify:
```bash
cd backend
cat .env  # Should show your key
```

### CORS errors

Backend `ALLOWED_ORIGINS` doesn't include your Amplify domain. Update:
```
ALLOWED_ORIGINS=https://main.d1234abcd.amplifyapp.com
```

### Chat works locally but not in production

Frontend is using `http://localhost:8000` instead of production backend URL.

Fix: Set `FUNCLOUD_API_URL` in Amplify environment variables.

## Environment Variables Summary

### Backend (.env file or Lambda/EC2 env vars)
```
OPENAI_API_KEY=sk-proj-your-key-here
ALLOWED_ORIGINS=https://main.d1234abcd.amplifyapp.com
```

### Frontend (Amplify Console → Environment Variables)
```
FUNCLOUD_API_URL=https://your-backend-url.com
```

## Quick Test Commands

```bash
# Test backend locally
cd backend
python test_chat.py

# Test backend in production
curl -X POST https://your-backend-url.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","history":[]}'

# Should return: {"reply":"...","role":"assistant"}
```

## Next Steps

1. ✅ Configure backend `.env` with OpenAI key
2. ✅ Test backend locally with `python test_chat.py`
3. ✅ Deploy backend to AWS (Lambda or EC2)
4. ✅ Set `OPENAI_API_KEY` and `ALLOWED_ORIGINS` in backend environment
5. ✅ Set `FUNCLOUD_API_URL` in Amplify environment variables
6. ✅ Test chat in production

## Files Changed

- `backend/main.py` - Added .env loading and better error handling
- `backend/.env` - Created with environment variables
- `backend/test_chat.py` - Created test script
- `frontend/config.js` - Already has fallback handling
- `frontend/env-config.js` - Already has fallback handling

## Status

✅ Backend code is ready
✅ Frontend code is ready
⏳ You need to: Add your OpenAI API key and deploy backend
