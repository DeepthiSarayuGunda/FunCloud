# Fix Lambda Function URL Permission (403 Error)

## Problem
The Lambda Function URL returns 403 Forbidden because it lacks public invoke permission.

## Solution
Run this single command to allow public access:

```powershell
aws lambda add-permission `
  --function-name funcloud-backend `
  --statement-id FunctionURLAllowPublicAccess `
  --action lambda:InvokeFunctionUrl `
  --principal "*" `
  --function-url-auth-type NONE `
  --profile PowerUserAccess-823766426087 `
  --region us-east-1
```

## Then Update Amplify

1. Go to Amplify Console: https://console.aws.amazon.com/amplify/
2. Select your app: `funcloud`
3. Go to: Environment variables
4. Add/Update:
   - Key: `FUNCLOUD_API_URL`
   - Value: `https://pva2pmqt7htmlguww7layzdwji0upfhy.lambda-url.us-east-1.on.aws`
5. Click "Save"
6. Redeploy: Actions → Redeploy this version

## Test
After redeployment, open your Amplify URL and test the AI Chat:
- Amplify URL: https://main.d3qeafj5ul33ss.amplifyapp.com
- Go to Chat tab
- Send a message
- Should receive AI response

## Security Note
Your OpenAI API key was exposed in the conversation. Please:
1. Go to https://platform.openai.com/api-keys
2. Revoke the exposed keys
3. Create a new key
4. Update Lambda environment variable `OPENAI_API_KEY` with the new key
