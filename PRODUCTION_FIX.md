# Production API Configuration Fix

## What Changed

Updated `frontend/config.js` to read API URL from environment variables instead of hardcoded placeholder.

## Configuration Steps

### 1. Local Development

Create `frontend/env-config.js` (already exists):
```javascript
window.ENV = {
  API_BASE_URL: 'http://localhost:8000'
};
```

Or just run backend on port 8000 - it auto-detects localhost.

### 2. AWS Amplify Production

**Step A: Set Environment Variable**

1. Go to AWS Amplify Console
2. Select your app (ai1stseo.com)
3. Go to **Environment variables** (left sidebar)
4. Click **Manage variables**
5. Add new variable:
   - **Variable name**: `API_BASE_URL`
   - **Value**: Your backend URL (e.g., `https://your-api.execute-api.us-east-1.amazonaws.com`)
6. Click **Save**

**Step B: Redeploy**

1. Go to **Hosting** → **Build settings**
2. Click **Redeploy this version** or push new commit
3. Wait for build to complete

The `amplify.yml` build script will inject the environment variable into `env-config.js`.

## Verify Configuration

### Check in Browser DevTools

1. Open https://ai1stseo.com
2. Press **F12** (open DevTools)
3. Go to **Console** tab
4. Look for: `FunCloud Config loaded: {apiUrl: "https://..."}`
5. Verify `apiUrl` is NOT null or placeholder

### Test API Call

1. Enter a URL in the input field
2. Click **ANALYZE**
3. Go to **Network** tab in DevTools
4. Look for request to `/api/seo/analyze`
5. Check:
   - **Request URL**: Should be your backend URL
   - **Status**: Should be 200 (or 500 if backend issue)
   - **Response**: Should have JSON data

### Debug Failed Requests

If you see errors:

**"API_BASE_URL not configured"** in console:
- Environment variable not set in Amplify
- Rebuild after setting variable

**Network error / CORS**:
- Backend not deployed
- Backend CORS not allowing your domain
- Check backend logs in CloudWatch

**404 Not Found**:
- Wrong backend URL
- API Gateway not configured correctly

**502 Bad Gateway**:
- Lambda timeout or error
- Check CloudWatch logs

## Quick Test Commands

```bash
# Test backend directly
curl -X POST https://your-backend-url/api/seo/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Should return JSON with recommendations
```

## Rollback

If issues occur, you can temporarily hardcode in `config.js`:
```javascript
API_BASE_URL: 'https://your-backend-url-here'
```

But use environment variables for production.
