# Deploy Backend to AWS - Step by Step

## Prerequisites
- AWS Account
- OpenAI API Key
- AWS CLI configured (optional but recommended)

## Option 1: AWS Lambda (Recommended - Free Tier)

### Step 1: Prepare Deployment Package

**Windows:**
```bash
cd backend
pip install -r requirements.txt -t deploy
copy main.py deploy\
cd deploy
tar -a -c -f ..\backend-deploy.zip *
cd ..
```

**Mac/Linux:**
```bash
cd backend
chmod +x deploy-simple.sh
./deploy-simple.sh
```

### Step 2: Create Lambda Function

1. Go to AWS Lambda Console: https://console.aws.amazon.com/lambda
2. Click "Create function"
3. Choose "Author from scratch"
4. Function name: `funcloud-backend`
5. Runtime: Python 3.11
6. Click "Create function"

### Step 3: Upload Code

1. In the function page, go to "Code" tab
2. Click "Upload from" → ".zip file"
3. Upload `backend-deploy.zip`
4. Click "Save"

### Step 4: Configure Handler

1. Go to "Code" tab
2. Scroll down to "Runtime settings"
3. Click "Edit"
4. Change Handler to: `main.handler`
5. Click "Save"

### Step 5: Add Environment Variables

1. Go to "Configuration" tab
2. Click "Environment variables"
3. Click "Edit"
4. Add variables:
   - Key: `OPENAI_API_KEY`, Value: `sk-proj-your-actual-key`
   - Key: `ALLOWED_ORIGINS`, Value: `https://main.d3qeafj5ul33ss.amplifyapp.com`
5. Click "Save"

### Step 6: Create API Gateway

1. Go to "Configuration" tab → "Function URL"
2. Click "Create function URL"
3. Auth type: NONE
4. Configure CORS:
   - Allow origins: `https://main.d3qeafj5ul33ss.amplifyapp.com`
   - Allow methods: `*`
   - Allow headers: `*`
5. Click "Save"
6. **Copy the Function URL** (e.g., `https://abc123.lambda-url.us-east-1.on.aws/`)

### Step 7: Test Backend

```bash
curl -X POST https://YOUR-FUNCTION-URL/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","history":[]}'
```

Should return: `{"reply":"...","role":"assistant"}`

## Option 2: AWS App Runner (Easier but Costs Money)

### Step 1: Create Dockerfile

Already exists in `backend/Dockerfile`

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Add backend deployment"
git push origin main
```

### Step 3: Create App Runner Service

1. Go to AWS App Runner Console
2. Click "Create service"
3. Source: GitHub
4. Connect your repository
5. Branch: main
6. Build settings:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`
7. Environment variables:
   - `OPENAI_API_KEY`: your key
   - `ALLOWED_ORIGINS`: `https://main.d3qeafj5ul33ss.amplifyapp.com`
8. Click "Create & deploy"
9. **Copy the App Runner URL**

## Configure Amplify

### Step 1: Set Environment Variable

1. Go to Amplify Console: https://console.aws.amazon.com/amplify
2. Select your app
3. Go to "Environment variables" (left sidebar)
4. Click "Manage variables"
5. Add variable:
   - Key: `FUNCLOUD_API_URL`
   - Value: Your Lambda Function URL or App Runner URL
6. Click "Save"

### Step 2: Redeploy

1. Go to "Hosting" → "main" branch
2. Click "Redeploy this version"
3. Wait for deployment to complete

## Test Chat

1. Open your Amplify app: https://main.d3qeafj5ul33ss.amplifyapp.com
2. Go to Chat tab
3. Type a message
4. Should see AI response (not error)

## Troubleshooting

### Lambda handler error
Change handler to `main.handler` and add this to `main.py`:
```python
from mangum import Mangum
handler = Mangum(app)
```

Then add `mangum` to requirements.txt and redeploy.

### CORS error
Make sure `ALLOWED_ORIGINS` includes your Amplify domain exactly.

### "Unknown error"
Check Lambda CloudWatch Logs for actual error message.

## Estimated Costs

- **Lambda**: Free tier covers 1M requests/month
- **App Runner**: ~$5-10/month minimum
- **OpenAI API**: ~$0.0001 per message with gpt-4o-mini

## Need Help?

Check the logs:
- Lambda: CloudWatch Logs
- App Runner: Service logs in console
- Frontend: Browser console (F12)
