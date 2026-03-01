# Deploy AI Chat - Quick Start

## Your AI Chat is Already Integrated! ✅

The code is ready:
- ✅ Backend has `/api/chat` endpoint with OpenAI integration
- ✅ Frontend sends messages to backend API
- ✅ AI responses are displayed in chat window
- ✅ Conversation history is maintained

## Deploy in 2 Steps

### Step 1: Get Your OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Create a new key
3. Copy it (starts with `sk-proj-...`)

### Step 2: Run Deployment Script

Open PowerShell and run:

```powershell
.\deploy-complete.ps1 -OpenAIKey "sk-proj-YOUR-KEY-HERE"
```

That's it! The script will:
1. ✅ Package backend
2. ✅ Deploy to Lambda
3. ✅ Create Function URL
4. ✅ Set environment variables
5. ✅ Update Amplify
6. ✅ Redeploy frontend
7. ✅ Test everything

## What the Script Does

```
Step 1: Package backend → backend.zip
Step 2: Check/Create IAM role → funcloud-lambda-role
Step 3: Deploy Lambda → funcloud-backend
Step 4: Set env vars → OPENAI_API_KEY, ALLOWED_ORIGINS
Step 5: Create Function URL → https://...lambda-url.us-east-1.on.aws/
Step 6: Test backend → Verify AI responds
Step 7: Find Amplify app → Update FUNCLOUD_API_URL
Step 8: Redeploy Amplify → Trigger new build
```

## After Deployment

You'll see:

```
=== Deployment Complete ===

Lambda Function URL:
  https://abc123.lambda-url.us-east-1.on.aws/

Amplify URL:
  https://main.d3qeafj5ul33ss.amplifyapp.com

Test AI Chat:
  1. Open: https://main.d3qeafj5ul33ss.amplifyapp.com
  2. Go to Chat tab
  3. Type a message
  4. Should see AI response
```

## Test Your Chat

### In Browser
1. Open: https://main.d3qeafj5ul33ss.amplifyapp.com
2. Click "Chat" tab
3. Type: "Tell me a joke"
4. Should see AI response

### Via Command Line
```powershell
curl -X POST https://YOUR-LAMBDA-URL/api/chat `
  -H "Content-Type: application/json" `
  -d '{"message":"Hello","history":[]}'
```

Should return:
```json
{"reply":"Hi! How can I help you today?","role":"assistant"}
```

## Troubleshooting

### "OpenAI API key not configured"
- Check Lambda environment variables in AWS Console
- Verify key starts with `sk-proj-` or `sk-`

### "CORS error"
- Check Lambda CORS settings
- Verify `ALLOWED_ORIGINS` includes your Amplify domain

### "Unknown error"
- Check Lambda CloudWatch Logs
- Verify OpenAI API key is valid
- Check if you have OpenAI API credits

### Script fails with "Access Denied"
- Run: `aws sso login --profile PowerUserAccess-823766426087`
- Verify your AWS profile has Lambda and Amplify permissions

## Manual Deployment (If Script Fails)

If the script doesn't work, follow these manual steps:

### 1. Package Backend
```powershell
cd backend
pip install -r requirements.txt -t deploy
Copy-Item main.py deploy\
cd deploy
Compress-Archive -Path * -DestinationPath ..\backend.zip -Force
cd ..
```

### 2. Deploy to Lambda Console
1. Go to: https://console.aws.amazon.com/lambda
2. Create function: `funcloud-backend`, Python 3.11
3. Upload `backend.zip`
4. Set handler: `main.handler`
5. Add env vars:
   - `OPENAI_API_KEY` = your key
   - `ALLOWED_ORIGINS` = `https://main.d3qeafj5ul33ss.amplifyapp.com`
6. Create Function URL (Auth: NONE)
7. Copy the URL

### 3. Update Amplify
1. Go to: https://console.aws.amazon.com/amplify
2. Your app → Environment variables
3. Add: `FUNCLOUD_API_URL` = your Lambda URL
4. Redeploy

## Cost Estimate

- **Lambda**: Free tier covers 1M requests/month
- **OpenAI API**: ~$0.0001 per message with gpt-4o-mini
- **Amplify**: Free tier covers most usage

Typical cost: **< $1/month** for moderate usage

## Next Steps

After successful deployment:
1. ✅ Test chat works
2. ✅ Share app with users
3. ✅ Monitor Lambda logs
4. ✅ Check OpenAI usage dashboard

## Support

- Lambda logs: CloudWatch Logs
- Frontend errors: Browser console (F12)
- Backend errors: Lambda CloudWatch Logs
- OpenAI errors: https://platform.openai.com/usage

---

**Ready to deploy? Run:**
```powershell
.\deploy-complete.ps1 -OpenAIKey "sk-proj-YOUR-KEY-HERE"
```
