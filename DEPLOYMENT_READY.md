# Backend Deployment Ready

## What I've Done

✅ Updated `backend/main.py` with Lambda handler support
✅ Added `mangum` to `requirements.txt` for Lambda
✅ Configured CORS for your Amplify domain: `https://main.d3qeafj5ul33ss.amplifyapp.com`
✅ Created deployment scripts and instructions

## What You Need to Do

### Quick Deploy (Choose One)

#### Option A: AWS Lambda Function URL (Easiest)

1. **Create deployment package:**
   ```bash
   cd backend
   pip install -r requirements.txt -t deploy
   cp main.py deploy/
   cd deploy
   zip -r ../backend.zip .
   cd ..
   ```

2. **Deploy to Lambda:**
   - Go to: https://console.aws.amazon.com/lambda
   - Create function: `funcloud-backend`, Python 3.11
   - Upload `backend.zip`
   - Set handler: `main.handler`
   - Add env vars:
     - `OPENAI_API_KEY` = your OpenAI key
     - `ALLOWED_ORIGINS` = `https://main.d3qeafj5ul33ss.amplifyapp.com`
   - Create Function URL (Auth: NONE)
   - Copy the Function URL

3. **Configure Amplify:**
   - Go to: https://console.aws.amazon.com/amplify
   - Your app → Environment variables
   - Add: `FUNCLOUD_API_URL` = your Lambda Function URL
   - Redeploy

#### Option B: Use Existing Backend

If you already have a backend running somewhere:

1. **Update CORS:**
   Add `https://main.d3qeafj5ul33ss.amplifyapp.com` to allowed origins

2. **Configure Amplify:**
   - Go to Amplify Console
   - Add env var: `FUNCLOUD_API_URL` = your backend URL
   - Redeploy

## Files Ready for Deployment

- ✅ `backend/main.py` - Lambda-ready with handler
- ✅ `backend/requirements.txt` - Includes mangum for Lambda
- ✅ `backend/.env` - Configured with your Amplify domain
- ✅ `backend/deploy-simple.sh` - Deployment script
- ✅ `DEPLOY_INSTRUCTIONS.md` - Detailed step-by-step guide

## Test After Deployment

```bash
# Replace with your actual backend URL
curl -X POST https://YOUR-BACKEND-URL/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","history":[]}'
```

Should return:
```json
{"reply":"Hi! How can I help you today?","role":"assistant"}
```

## Why I Can't Deploy Automatically

I don't have:
- AWS credentials to create Lambda functions
- Access to your Amplify Console to set environment variables
- Your OpenAI API key to configure the backend

But I've prepared everything so you can deploy in ~5 minutes following `DEPLOY_INSTRUCTIONS.md`.

## Summary

**Backend is ready to deploy** - Just need to:
1. Add your OpenAI API key to backend
2. Deploy to AWS Lambda (or use existing backend)
3. Set `FUNCLOUD_API_URL` in Amplify
4. Redeploy Amplify

Check `DEPLOY_INSTRUCTIONS.md` for detailed steps.
