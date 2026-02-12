#!/bin/bash
# Script to package and prepare Lambda deployment

set -e

echo "🚀 Packaging Lambda deployment..."

# Clean up old package
rm -rf package lambda-deployment.zip

# Create package directory
mkdir -p package

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements-lambda.txt -t package/

# Copy application files
echo "📋 Copying application files..."
cp main.py package/
cp lambda_handler.py package/

# Create zip file
echo "🗜️  Creating deployment package..."
cd package
zip -r ../lambda-deployment.zip . -q
cd ..

# Get package size
SIZE=$(du -h lambda-deployment.zip | cut -f1)
echo "✅ Package created: lambda-deployment.zip ($SIZE)"

echo ""
echo "Next steps:"
echo "1. Go to AWS Lambda Console"
echo "2. Create or update function 'funcloud-ai-backend'"
echo "3. Upload lambda-deployment.zip"
echo "4. Set handler to: lambda_handler.handler"
echo "5. Add environment variable: OPENAI_API_KEY"
echo "6. Set timeout to 30 seconds"
echo "7. Set memory to 512 MB"
echo ""
echo "Or use AWS CLI:"
echo "aws lambda update-function-code --function-name funcloud-ai-backend --zip-file fileb://lambda-deployment.zip"
