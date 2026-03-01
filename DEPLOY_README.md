# FunCloud AI Chat - Deployment Guide

## What's Ready

✅ **backend/lambda_handler.py** - Lambda function for AI chat
✅ **backend/requirements-lambda.txt** - Python dependencies
✅ **deploy-funcloud.ps1** - Automated deployment script
✅ **Frontend** - Already configured to call `/api/chat`

## Quick Deploy (3 Commands)

### 1. Create backend/.env

```powershell
# Create backend/.env file with your OpenAI key
echo "OPENAI_API_KEY=sk-proj-your-key-here" > backend\.env
```

### 2. Deploy Lambda

```powershell
.\deploy-funcloud.ps1 -FunctionName funcloud-backend
```

This will:
- Package lambda_handler.py + openai library → funcloud-backend.zip
- Deploy to your existing Lambda function
- Set OPENAI_API_KEY environment variable
- Enable Function URL
- Test the endpoint
- Print the Function URL

### 3. Push to Git (Triggers Amplify Redeploy)

```powershell
git add .
git commit -m "Add AI chat backend"
git push origin main
```

## Set Amplify Environment Variable

After deployment, set in Amplify Console:

1. Go to: https://console.aws.amazon.com/amplify
2. Your app → Environment variables
3. Add: `FUNCLOUD_API_URL` = `<your-lambda-url>`
4. Redeploy (or wait for git push to trigger it)

## How It Works

### Backend (Lambda)
- **Endpoint**: POST /api/chat
- **Input**: `{ "message": "user text" }`
- **Output**: `{ "reply": "AI response" }`
- **Model**: gpt-4o-mini (cheap, fast)
- **CORS**: Enabled for Amplify domain

### Frontend
- Reads `FUNCLOUD_API_URL` from Amplify env vars
- Calls `${FUNCLOUD_API_URL}/api/chat`
- Shows loading state while waiting
- Displays AI reply in chat
- Shows friendly error if fails

## Test

### Test Lambda Directly
```powershell
curl -X POST https://YOUR-LAMBDA-URL/api/chat `
  -H "Content-Type: application/json" `
  -d '{"message":"Hello"}'
```

Expected:
```json
{"reply":"Hi! How can I help you today?"}
```

### Test in Browser
1. Open: https://main.d3qeafj5ul33ss.amplifyapp.com
2. Go to Chat tab
3. Type: "Tell me a joke"
4. Should see AI response

## Files Created

- ✅ `backend/lambda_handler.py` - Lambda function
- ✅ `backend/requirements-lambda.txt` - Dependencies
- ✅ `backend/.env.example` - Environment template
- ✅ `deploy-funcloud.ps1` - Deployment script
- ✅ `funcloud-backend.zip` - Deployable package (created by script)

## Troubleshooting

### "Function not found"
Create Lambda function first:
```powershell
aws lambda create-function `
  --function-name funcloud-backend `
  --runtime python3.11 `
  --role arn:aws:iam::YOUR-ACCOUNT:role/YOUR-EXISTING-ROLE `
  --handler lambda_handler.lambda_handler `
  --zip-file fileb://funcloud-backend.zip `
  --profile PowerUserAccess-823766426087 `
  --region us-east-1
```

### "Unknown error" in chat
- Check Lambda CloudWatch Logs
- Verify OPENAI_API_KEY is set
- Test Lambda directly with curl

### "CORS error"
- Lambda already has CORS headers
- Check browser console for actual error

## Cost Estimate

- **Lambda**: Free tier covers 1M requests/month
- **OpenAI**: ~$0.0001 per message with gpt-4o-mini
- **Total**: < $1/month for moderate usage

## Security Note

⚠️ Never commit `backend/.env` to git (already in .gitignore)
⚠️ Revoke any API keys shared publicly
⚠️ Use environment variables, not hardcoded keys

## Summary

**What I did automatically:**
- ✅ Created Lambda handler
- ✅ Created deployment script
- ✅ Configured frontend to read env vars
- ✅ Added error handling and loading states

**What you need to do:**
1. Create `backend/.env` with your OpenAI key
2. Run `.\deploy-funcloud.ps1 -FunctionName funcloud-backend`
3. Set `FUNCLOUD_API_URL` in Amplify
4. Run `git push origin main`

**That's it!** 🎉
