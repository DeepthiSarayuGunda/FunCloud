# Complete Deployment Script for FunCloud AI Chat
# This script deploys backend to Lambda and updates Amplify

param(
    [Parameter(Mandatory=$true)]
    [string]$OpenAIKey,
    
    [Parameter(Mandatory=$false)]
    [string]$Profile = "PowerUserAccess-823766426087",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

Write-Host "=== FunCloud AI Chat Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$FunctionName = "funcloud-backend"
$AmplifyDomain = "https://main.d3qeafj5ul33ss.amplifyapp.com"
$RoleName = "funcloud-lambda-role"

# Step 1: Package Backend
Write-Host "Step 1: Packaging backend..." -ForegroundColor Yellow
Set-Location backend

# Clean previous build
if (Test-Path deploy) { Remove-Item -Recurse -Force deploy }
if (Test-Path backend.zip) { Remove-Item -Force backend.zip }

# Create deployment package
New-Item -ItemType Directory -Path deploy | Out-Null
pip install -r requirements.txt -t deploy --quiet
Copy-Item main.py deploy\

# Create zip
Set-Location deploy
Compress-Archive -Path * -DestinationPath ..\backend.zip -Force
Set-Location ..

Write-Host "✅ Backend packaged: backend.zip" -ForegroundColor Green
Write-Host ""

# Step 2: Create IAM Role (if doesn't exist)
Write-Host "Step 2: Checking IAM role..." -ForegroundColor Yellow
try {
    aws iam get-role --role-name $RoleName --profile $Profile --region $Region 2>&1 | Out-Null
    Write-Host "✅ IAM role exists" -ForegroundColor Green
} catch {
    Write-Host "Creating IAM role..." -ForegroundColor Gray
    
    $trustPolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
"@
    
    $trustPolicy | Out-File -FilePath trust-policy.json -Encoding utf8
    
    aws iam create-role `
        --role-name $RoleName `
        --assume-role-policy-document file://trust-policy.json `
        --profile $Profile `
        --region $Region
    
    aws iam attach-role-policy `
        --role-name $RoleName `
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole `
        --profile $Profile `
        --region $Region
    
    Remove-Item trust-policy.json
    Write-Host "✅ IAM role created" -ForegroundColor Green
    Start-Sleep -Seconds 10  # Wait for role to propagate
}
Write-Host ""

# Get account ID
$AccountId = (aws sts get-caller-identity --profile $Profile --query Account --output text)
$RoleArn = "arn:aws:iam::${AccountId}:role/${RoleName}"

# Step 3: Deploy Lambda
Write-Host "Step 3: Deploying Lambda function..." -ForegroundColor Yellow
try {
    # Check if function exists
    aws lambda get-function --function-name $FunctionName --profile $Profile --region $Region 2>&1 | Out-Null
    
    # Update existing function
    Write-Host "Updating existing function..." -ForegroundColor Gray
    aws lambda update-function-code `
        --function-name $FunctionName `
        --zip-file fileb://backend.zip `
        --profile $Profile `
        --region $Region | Out-Null
    
    Write-Host "✅ Lambda function updated" -ForegroundColor Green
} catch {
    # Create new function
    Write-Host "Creating new function..." -ForegroundColor Gray
    aws lambda create-function `
        --function-name $FunctionName `
        --runtime python3.11 `
        --role $RoleArn `
        --handler main.handler `
        --zip-file fileb://backend.zip `
        --timeout 30 `
        --memory-size 512 `
        --profile $Profile `
        --region $Region | Out-Null
    
    Write-Host "✅ Lambda function created" -ForegroundColor Green
}
Write-Host ""

# Step 4: Set Environment Variables
Write-Host "Step 4: Setting environment variables..." -ForegroundColor Yellow
aws lambda update-function-configuration `
    --function-name $FunctionName `
    --environment "Variables={OPENAI_API_KEY=$OpenAIKey,ALLOWED_ORIGINS=$AmplifyDomain}" `
    --profile $Profile `
    --region $Region | Out-Null

Write-Host "✅ Environment variables set" -ForegroundColor Green
Write-Host ""

# Step 5: Create/Update Function URL
Write-Host "Step 5: Configuring Function URL..." -ForegroundColor Yellow
try {
    # Try to get existing URL
    $FunctionUrl = aws lambda get-function-url-config `
        --function-name $FunctionName `
        --profile $Profile `
        --region $Region `
        --query FunctionUrl `
        --output text 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        throw "No URL exists"
    }
    
    Write-Host "✅ Function URL exists: $FunctionUrl" -ForegroundColor Green
} catch {
    # Create new Function URL
    Write-Host "Creating Function URL..." -ForegroundColor Gray
    
    aws lambda create-function-url-config `
        --function-name $FunctionName `
        --auth-type NONE `
        --cors "AllowOrigins=$AmplifyDomain,AllowMethods=*,AllowHeaders=*,MaxAge=86400" `
        --profile $Profile `
        --region $Region | Out-Null
    
    # Add permission
    aws lambda add-permission `
        --function-name $FunctionName `
        --statement-id FunctionURLAllowPublicAccess `
        --action lambda:InvokeFunctionUrl `
        --principal "*" `
        --function-url-auth-type NONE `
        --profile $Profile `
        --region $Region 2>&1 | Out-Null
    
    $FunctionUrl = aws lambda get-function-url-config `
        --function-name $FunctionName `
        --profile $Profile `
        --region $Region `
        --query FunctionUrl `
        --output text
    
    Write-Host "✅ Function URL created: $FunctionUrl" -ForegroundColor Green
}
Write-Host ""

# Step 6: Test Backend
Write-Host "Step 6: Testing backend..." -ForegroundColor Yellow
$TestPayload = '{"message":"Hello","history":[]}'
try {
    $TestResponse = Invoke-RestMethod -Uri "${FunctionUrl}api/chat" -Method Post -Body $TestPayload -ContentType "application/json" -TimeoutSec 30
    Write-Host "✅ Backend test successful!" -ForegroundColor Green
    Write-Host "   AI Reply: $($TestResponse.reply.Substring(0, [Math]::Min(100, $TestResponse.reply.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Backend test failed (might need OpenAI key)" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}
Write-Host ""

# Step 7: Get Amplify App
Write-Host "Step 7: Finding Amplify app..." -ForegroundColor Yellow
$AmplifyApps = aws amplify list-apps --profile $Profile --region $Region --query "apps[?defaultDomain=='d3qeafj5ul33ss.amplifyapp.com'].appId" --output text

if ($AmplifyApps) {
    $AppId = $AmplifyApps
    Write-Host "✅ Found Amplify app: $AppId" -ForegroundColor Green
    
    # Update environment variable
    Write-Host "Updating Amplify environment variable..." -ForegroundColor Gray
    aws amplify update-app `
        --app-id $AppId `
        --environment-variables "FUNCLOUD_API_URL=$FunctionUrl" `
        --profile $Profile `
        --region $Region | Out-Null
    
    Write-Host "✅ Amplify environment variable updated" -ForegroundColor Green
    Write-Host ""
    
    # Trigger redeploy
    Write-Host "Step 8: Redeploying Amplify..." -ForegroundColor Yellow
    aws amplify start-job `
        --app-id $AppId `
        --branch-name main `
        --job-type RELEASE `
        --profile $Profile `
        --region $Region | Out-Null
    
    Write-Host "✅ Amplify redeploy triggered" -ForegroundColor Green
} else {
    Write-Host "⚠️  Amplify app not found - update manually" -ForegroundColor Yellow
}
Write-Host ""

# Cleanup
Set-Location ..
Remove-Item backend\deploy -Recurse -Force -ErrorAction SilentlyContinue

# Summary
Write-Host "=== Deployment Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Lambda Function URL:" -ForegroundColor Yellow
Write-Host "  $FunctionUrl" -ForegroundColor White
Write-Host ""
Write-Host "Amplify URL:" -ForegroundColor Yellow
Write-Host "  $AmplifyDomain" -ForegroundColor White
Write-Host ""
Write-Host "Test AI Chat:" -ForegroundColor Yellow
Write-Host "  1. Open: $AmplifyDomain" -ForegroundColor White
Write-Host "  2. Go to Chat tab" -ForegroundColor White
Write-Host "  3. Type a message" -ForegroundColor White
Write-Host "  4. Should see AI response" -ForegroundColor White
Write-Host ""
Write-Host "Test Backend Directly:" -ForegroundColor Yellow
Write-Host "  curl -X POST ${FunctionUrl}api/chat \" -ForegroundColor White
Write-Host "    -H 'Content-Type: application/json' \" -ForegroundColor White
Write-Host "    -d '{\"message\":\"Hello\",\"history\":[]}'" -ForegroundColor White
Write-Host ""
