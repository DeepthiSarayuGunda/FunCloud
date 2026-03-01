# Amplify Environment Variables Setup

## Frontend (Amplify Console)

Go to: **Amplify Console → Your App → Environment Variables**

Add this variable:

```
FUNCLOUD_API_URL = https://your-backend-url.com
```

Example:
```
FUNCLOUD_API_URL = https://abc123.execute-api.us-east-1.amazonaws.com
```

## Backend (Lambda/ECS/EC2)

Set these environment variables in your backend hosting:

```
OPENAI_API_KEY = sk-proj-your-key-here
ALLOWED_ORIGINS = https://main.d1234abcd.amplifyapp.com,https://yourdomain.com
```

### For Lambda:
- Go to Lambda Console → Your Function → Configuration → Environment Variables
- Add both variables

### For ECS/Fargate:
- Go to Task Definition → Environment Variables
- Add both variables

### For EC2:
Create `.env` file in backend folder:
```
OPENAI_API_KEY=sk-proj-your-key-here
ALLOWED_ORIGINS=https://main.d1234abcd.amplifyapp.com
```

## How It Works

1. **Frontend** reads `window.FUNCLOUD_API_URL` from Amplify env var
2. **Backend** allows requests from domains in `ALLOWED_ORIGINS`
3. **Chat** calls `/api/chat` and receives `{reply: "text"}`

## Testing

After setting variables:
1. Redeploy frontend in Amplify
2. Restart backend service
3. Test chat in production
4. Check browser console for API URL
5. Check Network tab for CORS errors
