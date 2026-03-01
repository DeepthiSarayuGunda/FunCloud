# Test Lambda Function URL
param(
    [Parameter(Mandatory=$false)]
    [string]$FunctionUrl = "https://pva2pmqt7htmlguww7layzdwji0upfhy.lambda-url.us-east-1.on.aws/"
)

Write-Host "=== Testing Lambda Function ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Function URL: $FunctionUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Root endpoint
Write-Host "Test 1: Testing root endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri $FunctionUrl -Method Post -Body '{"message":"Hello"}' -ContentType "application/json" -TimeoutSec 30
    Write-Host "✅ Root endpoint works!" -ForegroundColor Green
    Write-Host "   Reply: $($response.reply)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Root endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}
Write-Host ""

# Test 2: /api/chat endpoint
Write-Host "Test 2: Testing /api/chat endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "${FunctionUrl}api/chat" -Method Post -Body '{"message":"Hello"}' -ContentType "application/json" -TimeoutSec 30
    Write-Host "✅ /api/chat endpoint works!" -ForegroundColor Green
    Write-Host "   Reply: $($response.reply)" -ForegroundColor Gray
} catch {
    Write-Host "❌ /api/chat endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host "   Response: $($_.ErrorDetails.Message)" -ForegroundColor Gray
}
Write-Host ""

# Test 3: CORS preflight
Write-Host "Test 3: Testing CORS preflight..." -ForegroundColor Yellow
try {
    $headers = @{
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
        "Origin" = "https://main.d3qeafj5ul33ss.amplifyapp.com"
    }
    $response = Invoke-WebRequest -Uri "${FunctionUrl}api/chat" -Method Options -Headers $headers -TimeoutSec 10
    
    if ($response.Headers["Access-Control-Allow-Origin"]) {
        Write-Host "✅ CORS headers present" -ForegroundColor Green
        Write-Host "   Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Gray
        Write-Host "   Allow-Methods: $($response.Headers['Access-Control-Allow-Methods'])" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  CORS headers missing" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  CORS test inconclusive" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "If tests pass, update Amplify:" -ForegroundColor Yellow
Write-Host "  1. Set FUNCLOUD_API_URL = $FunctionUrl" -ForegroundColor Gray
Write-Host "  2. Redeploy Amplify" -ForegroundColor Gray
Write-Host ""
