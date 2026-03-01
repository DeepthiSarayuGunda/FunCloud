# AWS MCP Connection Diagnostic Script
Write-Host "=== AWS MCP Connection Diagnostics ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if uvx is available
Write-Host "Test 1: Checking uvx..." -ForegroundColor Yellow
$uvxPath = "C:\Users\gunda\AppData\Local\Microsoft\WinGet\Packages\astral-sh.uv_Microsoft.Winget.Source_8wekyb3d8bbwe\uvx.exe"
if (Test-Path $uvxPath) {
    Write-Host "✅ uvx found at: $uvxPath" -ForegroundColor Green
} else {
    Write-Host "❌ uvx not found at expected path" -ForegroundColor Red
    Write-Host "   Try: uv --version" -ForegroundColor Gray
}
Write-Host ""

# Test 2: Check AWS CLI
Write-Host "Test 2: Checking AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version 2>&1
    Write-Host "✅ AWS CLI installed: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not found" -ForegroundColor Red
}
Write-Host ""

# Test 3: List AWS profiles
Write-Host "Test 3: Checking AWS profiles..." -ForegroundColor Yellow
try {
    $profiles = aws configure list-profiles 2>&1
    Write-Host "Available profiles:" -ForegroundColor Green
    $profiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
} catch {
    Write-Host "❌ Cannot list profiles" -ForegroundColor Red
}
Write-Host ""

# Test 4: Check specific profile
Write-Host "Test 4: Testing PowerUserAccess-823766426087 profile..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --profile PowerUserAccess-823766426087 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Profile works! Identity:" -ForegroundColor Green
        Write-Host $identity -ForegroundColor White
    } else {
        Write-Host "❌ Profile authentication failed" -ForegroundColor Red
        Write-Host $identity -ForegroundColor Gray
        Write-Host ""
        Write-Host "Try running: aws sso login --profile PowerUserAccess-823766426087" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error testing profile: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Check network connectivity to AWS MCP endpoint
Write-Host "Test 5: Testing AWS MCP endpoint connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://aws-mcp.us-east-1.api.aws" -Method Head -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Can reach AWS MCP endpoint" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot reach AWS MCP endpoint" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host "   This might be a firewall or network issue" -ForegroundColor Yellow
}
Write-Host ""

# Test 6: Check if mcp-proxy-for-aws is installed
Write-Host "Test 6: Checking mcp-proxy-for-aws..." -ForegroundColor Yellow
try {
    & $uvxPath --version 2>&1 | Out-Null
    Write-Host "✅ uvx can execute" -ForegroundColor Green
    Write-Host "   Note: mcp-proxy-for-aws will be downloaded on first use" -ForegroundColor Gray
} catch {
    Write-Host "❌ Cannot execute uvx" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Diagnosis Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Recommendations:" -ForegroundColor Yellow
Write-Host "1. If profile authentication failed, run:" -ForegroundColor White
Write-Host "   aws sso login --profile PowerUserAccess-823766426087" -ForegroundColor Gray
Write-Host ""
Write-Host "2. If MCP endpoint unreachable, check firewall/VPN" -ForegroundColor White
Write-Host ""
Write-Host "3. Alternative: Deploy using AWS CLI directly (see AWS_CONNECTION_GUIDE.md)" -ForegroundColor White
