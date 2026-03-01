# FunCloud AI Chat Deployment Script
# Deploys Lambda function without creating IAM roles

param(
    [Parameter(Mandatory=$true)]
    [string]$FunctionName,
    
    [Parameter(Mandatory=$false)]
    [string]$Profile = "PowerUserAccess-823766426087",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

$ErrorActionPreference = "Stop"

Write-Host "=== FunCloud AI Chat Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$AmplifyDomain = "https://main.d3qeafj5ul33ss.amplifyapp.com"
$ZipFile = "funcloud-backend.zip"

# Step 1: Read OpenAI API Key from .env
Write-Host "Step 1: Reading OpenAI API key..." -ForegroundColor Yellow
$OpenAIKey = $null

if (Test-Path "backend\.env") {
    $envContent = Get-Content "backend\.env"
    foreach ($line in $envContent) {
        if ($line -match "^OPENAI_API_KEY=(.+)$") {
            $OpenAIKey = $Matches[1].Trim()
            Write-Host "✅ Found API key in backend\.env" -ForegroundColor Green
            break
        }
    }
}

if (-not $OpenAIKey) {
    Write-Host "❌ OPENAI_API_KEY not found in backend\.env" -ForegroundColor Red
    Write-Host "   Create backend\.env with: OPENAI_API_KEY=sk-proj-your-key" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 2: Package Lambda Function
Write-Host "Step 2: Packaging Lambda function..." -ForegroundColor Yellow

# Clean previous build
if (Test-Path "backend\package") { Remove-Item -Recurse -Force "backend\package" }
if (Test-Path $ZipFile) { Remove-Item -Force $ZipFile }

# Create package directory
New-Item -ItemType Directory -Path "backend\package" | Out-Null

# Install dependencies
Write-Host "   Installing dependencies..." -ForegroundColor Gray
pip install -r backend\requirements-lambda.txt -t backend\package --quiet --no-warn-script-location

# Copy Lambda handler
Copy-Item backend\lambda_handler.py backend\package\

# Create zip
Write-Host "   Creating zip file..." -ForegroundColor Gray
Set-Location backend\package
Compress-Archive -Path * -DestinationPath "..\..\$ZipFile" -Force
Set-Location ..\..

# Cleanup
Remove-Item -Recurse -Force backend\package

Write-Host "✅ Package created: $ZipFile" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy to Lambda
Write-Host "Step 3: Deploying to Lambda function: $FunctionName..." -ForegroundColor Yellow

try {
    aws lambda update-function-code `
        --function-name $FunctionName `
        --zip-file fileb://$ZipFile `
        --profile $Profile `
        --region $Region | Out-Null
    
    Write-Host "✅ Lambda code updated" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to update Lambda code" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Gray
    Write-Host "   Make sure function '$FunctionName' exists" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 4: Set Environment Variables
Write-Host "Step 4: Setting environment variables..." -ForegroundColor Yellow

try {
    aws lambda update-function-configuration `
        --function-name $FunctionName `
        --environment "Variables={OPENAI_API_KEY=$OpenAIKey,ALLOWED_ORIGINS=$AmplifyDomain}" `
        --profile $Profile `
        --region $Region | Out-Null
    
    Write-Host "✅ Environment variables set" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Could not set environment variables" -ForegroundColor Yellow
    Write-Host "   Set manually in Lambda Console" -ForegroundColor Gray
}
Write-Host ""

# Step 5: Get/Create Function URL
Write-Host "Step 5: Configuring Function URL..." -ForegroundColor Yellow

$FunctionUrl = $null
try {
    $FunctionUrl = aws lambda get-function-url-config `
        --function-name $FunctionName `
        --profile $Profile `
        --region $Region `
        --query FunctionUrl `
        --output text 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Function URL exists: $FunctionUrl" -ForegroundColor Green
    } else {
        throw "No URL"
    }
} catch {
    Write-Host "   Creating Function URL..." -ForegroundColor Gray
    
    try {
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
    } catch {
        Write-Host "⚠️  Could not create Function URL" -ForegroundColor Yellow
        Write-Host "   Create manually in Lambda Console" -ForegroundColor Gray
    }
}
Write-Host ""

# Step 6: Test Lambda
if ($FunctionUrl) {
    Write-Host "Step 6: Testing Lambda..." -ForegroundColor Yellow
    
    $TestPayload = '{"message":"Hello"}'
    try {
        $TestResponse = Invoke-RestMethod `
            -Uri "${FunctionUrl}api/chat" `
            -Method Post `
            -Body $TestPayload `
            -ContentType "application/json" `
            -TimeoutSec 30
        
        Write-Host "✅ Lambda test successful!" -ForegroundColor Green
        Write-Host "   AI Reply: $($TestResponse.reply.Substring(0, [Math]::Min(80, $TestResponse.reply.Length)))..." -ForegroundColor Gray
    } catch {
        Write-Host "⚠️  Lambda test failed" -ForegroundColor Yellow
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
        Write-Host "   Check CloudWatch Logs for details" -ForegroundColor Gray
    }
    Write-Host ""
}

# Summary
Write-Host "=== Deployment Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Lambda Function URL:" -ForegroundColor Yellow
if ($FunctionUrl) {
    Write-Host "  $FunctionUrl" -ForegroundColor White
} else {
    Write-Host "  (Get from Lambda Console → Configuration → Function URL)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Set Amplify environment variable:" -ForegroundColor White
Write-Host "     FUNCLOUD_API_URL = $FunctionUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Redeploy Amplify frontend:" -ForegroundColor White
Write-Host "     git add ." -ForegroundColor Gray
Write-Host "     git commit -m 'Update AI chat backend'" -ForegroundColor Gray
Write-Host "     git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Test chat:" -ForegroundColor White
Write-Host "     Open: $AmplifyDomain" -ForegroundColor Gray
Write-Host "     Go to Chat tab → Type message → See AI reply" -ForegroundColor Gray
Write-Host ""
Write-Host "Test Lambda directly:" -ForegroundColor Yellow
Write-Host "  curl -X POST ${FunctionUrl}api/chat \" -ForegroundColor Gray
Write-Host "    -H 'Content-Type: application/json' \" -ForegroundColor Gray
Write-Host "    -d '{\"message\":\"Hello\"}'" -ForegroundColor Gray
Write-Host ""
