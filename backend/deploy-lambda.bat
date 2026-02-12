@echo off
REM Script to package and prepare Lambda deployment for Windows

echo 🚀 Packaging Lambda deployment...

REM Clean up old package
if exist package rmdir /s /q package
if exist lambda-deployment.zip del lambda-deployment.zip

REM Create package directory
mkdir package

REM Install dependencies
echo 📦 Installing dependencies...
pip install -r requirements-lambda.txt -t package

REM Copy application files
echo 📋 Copying application files...
copy main.py package\
copy lambda_handler.py package\

REM Create zip file (requires PowerShell)
echo 🗜️  Creating deployment package...
powershell -Command "Compress-Archive -Path package\* -DestinationPath lambda-deployment.zip -Force"

echo ✅ Package created: lambda-deployment.zip

echo.
echo Next steps:
echo 1. Go to AWS Lambda Console
echo 2. Create or update function 'funcloud-ai-backend'
echo 3. Upload lambda-deployment.zip
echo 4. Set handler to: lambda_handler.handler
echo 5. Add environment variable: OPENAI_API_KEY
echo 6. Set timeout to 30 seconds
echo 7. Set memory to 512 MB
echo.
echo Or use AWS CLI:
echo aws lambda update-function-code --function-name funcloud-ai-backend --zip-file fileb://lambda-deployment.zip

pause
