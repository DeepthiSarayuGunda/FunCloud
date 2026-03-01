# Quick Lambda Redeploy Script
param(
    [Parameter(Mandatory=$false)]
    [string]$FunctionName = "funcloud-backend",
    
    [Parameter(Mandatory=$false)]
    [string]$Profile = "PowerUserAccess-823766426087",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

Write-Host "=== Quick Lambda Redeploy ===" -ForegroundColor Cyan
Write-Host ""

# Package
Write-Host "Packaging..." -ForegroundColor Yellow
if (Test-Path "backend\package") { Remove-Item -Recurse -Force "backend\package" }
if (Test-Path "funcloud-backend.zip") { Remove-Item -Force "funcloud-backend.zip" }

New-Item -ItemType Directory -Path "backend\package" | Out-Null
pip install openai==1.12.0 -t backend\package --quiet --no-warn-script-location
Copy-Item backend\lambda_handler.py backend\package\

Set-Location backend\package
Compress-Archive -Path * -DestinationPath "..\..\funcloud-backend.zip" -Force
Set-Location ..\..
Remove-Item -Recurse -Force backend\package

Write-Host "✅ Packaged" -ForegroundColor Green
Write-Host ""

# Deploy
Write-Host "Deploying to $FunctionName..." -ForegroundColor Yellow
aws lambda update-function-code `
    --function-name $FunctionName `
    --zip-file fileb://funcloud-backend.zip `
    --profile $Profile `
    --region $Region | Out-Null

Write-Host "✅ Deployed" -ForegroundColor Green
Write-Host ""

# Get URL
Write-Host "Function URL:" -ForegroundColor Yellow
$url = aws lambda get-function-url-config `
    --function-name $FunctionName `
    --profile $Profile `
    --region $Region `
    --query FunctionUrl `
    --output text

Write-Host "  $url" -ForegroundColor White
Write-Host ""

# Test
Write-Host "Testing..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "${url}api/chat" -Method Post -Body '{"message":"Hello"}' -ContentType "application/json" -TimeoutSec 30
    Write-Host "✅ Test passed!" -ForegroundColor Green
    Write-Host "   Reply: $($response.reply.Substring(0, [Math]::Min(80, $response.reply.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Test failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}
Write-Host ""

Write-Host "Next: Set FUNCLOUD_API_URL = $url in Amplify" -ForegroundColor Yellow
Write-Host ""
