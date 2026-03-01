#!/bin/bash
# Simple deployment script for FunCloud backend
# This creates a deployment package but you need to upload it to AWS

set -e

echo "Creating deployment package..."

# Create deployment directory
rm -rf deploy
mkdir -p deploy

# Copy application files
cp main.py deploy/
cp requirements.txt deploy/
cp .env deploy/ 2>/dev/null || echo "No .env file found"

# Install dependencies
cd deploy
pip install -r requirements.txt -t .

# Create zip file
zip -r ../backend-deploy.zip .

cd ..
rm -rf deploy

echo "✅ Deployment package created: backend-deploy.zip"
echo ""
echo "Next steps:"
echo "1. Go to AWS Lambda Console"
echo "2. Create new function (Python 3.11)"
echo "3. Upload backend-deploy.zip"
echo "4. Set handler to: main.app"
echo "5. Add environment variables:"
echo "   OPENAI_API_KEY=sk-proj-your-key"
echo "   ALLOWED_ORIGINS=https://main.d3qeafj5ul33ss.amplifyapp.com"
echo "6. Create API Gateway HTTP API"
echo "7. Copy the API Gateway URL"
