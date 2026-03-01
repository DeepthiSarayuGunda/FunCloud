# AWS Connection Guide for Kiro

## Current Issue
Your MCP configuration has profile name "poweruser" but you mentioned "PowerUserAccess-823766426087". Let's fix this.

## Step 1: Verify Your AWS Profile

Open PowerShell and run:
```powershell
aws configure list-profiles
```

This will show all your AWS profiles. Find the correct one.

## Step 2: Test AWS Connection

```powershell
aws sts get-caller-identity --profile PowerUserAccess-823766426087
```

If this works, you're connected to AWS. If not, you need to login:

```powershell
aws sso login --profile PowerUserAccess-823766426087
```

## Step 3: Fix MCP Configuration

The mcp.json needs the correct profile name. Based on your info, it should be:

```json
{
  "mcpServers": {
    "aws": {
      "command": "C:\\Users\\gunda\\AppData\\Local\\Microsoft\\WinGet\\Packages\\astral-sh.uv_Microsoft.Winget.Source_8wekyb3d8bbwe\\uvx.exe",
      "args": [
        "mcp-proxy-for-aws@latest",
        "https://aws-mcp.us-east-1.api.aws/mcp",
        "--profile",
        "PowerUserAccess-823766426087",
        "--metadata",
        "AWS_REGION=us-east-1"
      ]
    }
  }
}
```

## Step 4: Reconnect MCP

After updating mcp.json:
1. Open Command Palette (Ctrl+Shift+P)
2. Type "MCP: Reconnect Server"
3. Select "aws"

Or restart Kiro completely.

## Alternative: Use AWS CLI Directly

If MCP connection keeps failing, you can deploy using AWS CLI commands directly:

### Deploy Backend to Lambda

```powershell
# 1. Package backend
cd backend
pip install -r requirements.txt -t deploy
Copy-Item main.py deploy\
cd deploy
Compress-Archive -Path * -DestinationPath ..\backend.zip -Force
cd ..

# 2. Create IAM role (if not exists)
aws iam create-role `
  --role-name lambda-execution-role `
  --assume-role-policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"lambda.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}' `
  --profile PowerUserAccess-823766426087

aws iam attach-role-policy `
  --role-name lambda-execution-role `
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole `
  --profile PowerUserAccess-823766426087

# 3. Create Lambda function
aws lambda create-function `
  --function-name funcloud-backend `
  --runtime python3.11 `
  --role arn:aws:iam::823766426087:role/lambda-execution-role `
  --handler main.handler `
  --zip-file fileb://backend.zip `
  --timeout 30 `
  --memory-size 512 `
  --profile PowerUserAccess-823766426087 `
  --region us-east-1

# 4. Set environment variables
aws lambda update-function-configuration `
  --function-name funcloud-backend `
  --environment "Variables={OPENAI_API_KEY=sk-proj-your-key,ALLOWED_ORIGINS=https://main.d3qeafj5ul33ss.amplifyapp.com}" `
  --profile PowerUserAccess-823766426087 `
  --region us-east-1

# 5. Create Function URL
aws lambda create-function-url-config `
  --function-name funcloud-backend `
  --auth-type NONE `
  --cors "AllowOrigins=https://main.d3qeafj5ul33ss.amplifyapp.com,AllowMethods=*,AllowHeaders=*,MaxAge=86400" `
  --profile PowerUserAccess-823766426087 `
  --region us-east-1

# 6. Add permissions for Function URL
aws lambda add-permission `
  --function-name funcloud-backend `
  --statement-id FunctionURLAllowPublicAccess `
  --action lambda:InvokeFunctionUrl `
  --principal "*" `
  --function-url-auth-type NONE `
  --profile PowerUserAccess-823766426087 `
  --region us-east-1

# 7. Get Function URL
aws lambda get-function-url-config `
  --function-name funcloud-backend `
  --profile PowerUserAccess-823766426087 `
  --region us-east-1
```

The last command will output your Function URL. Copy it.

### Configure Amplify

```powershell
# Get your Amplify App ID
aws amplify list-apps --profile PowerUserAccess-823766426087 --region us-east-1

# Set environment variable (replace APP_ID with your actual app ID)
aws amplify update-app `
  --app-id YOUR_APP_ID `
  --environment-variables FUNCLOUD_API_URL=YOUR_LAMBDA_FUNCTION_URL `
  --profile PowerUserAccess-823766426087 `
  --region us-east-1

# Trigger redeploy
aws amplify start-job `
  --app-id YOUR_APP_ID `
  --branch-name main `
  --job-type RELEASE `
  --profile PowerUserAccess-823766426087 `
  --region us-east-1
```

## Troubleshooting

### "Profile not found"
Run: `aws configure list-profiles` to see available profiles

### "SSO session expired"
Run: `aws sso login --profile PowerUserAccess-823766426087`

### "Access denied"
Your PowerUserAccess role might not have Lambda permissions. Check IAM permissions.

### MCP timeout
The MCP proxy service might be slow or unavailable. Use AWS CLI directly instead.

## Quick Test

After deployment, test your backend:
```powershell
curl -X POST YOUR_LAMBDA_FUNCTION_URL/api/chat `
  -H "Content-Type: application/json" `
  -d '{\"message\":\"Hello\",\"history\":[]}'
```

Should return: `{"reply":"...","role":"assistant"}`

## Summary

1. ✅ Verify AWS profile name
2. ✅ Login with `aws sso login`
3. ✅ Update mcp.json with correct profile
4. ✅ Or use AWS CLI commands directly to deploy
5. ✅ Set Amplify environment variable
6. ✅ Test chat works

Choose either MCP connection OR AWS CLI - both work!
