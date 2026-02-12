# FunCloud AI Backend Deployment Guide

This guide covers deploying the FastAPI backend to AWS and configuring the Amplify frontend.

## Prerequisites

- AWS Account
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))
- AWS CLI installed and configured
- Docker installed (for ECS deployment)

## Option 1: AWS Lambda + API Gateway (Recommended for Low Traffic)

### Step 1: Prepare Lambda Package

```bash
cd backend
pip install -r requirements-lambda.txt -t package/
cp main.py lambda_handler.py package/
cd package
zip -r ../lambda-deployment.zip .
cd ..
```

### Step 2: Create Lambda Function

1. Go to AWS Lambda Console
2. Click "Create function"
3. Choose "Author from scratch"
4. Function name: `funcloud-ai-backend`
5. Runtime: Python 3.11
6. Architecture: x86_64
7. Click "Create function"

### Step 3: Upload Code

1. In the Lambda function page, go to "Code" tab
2. Click "Upload from" → ".zip file"
3. Upload `lambda-deployment.zip`
4. Handler: `lambda_handler.handler`

### Step 4: Configure Environment Variables

1. Go to "Configuration" → "Environment variables"
2. Add:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-your-openai-api-key`

### Step 5: Increase Timeout and Memory

1. Go to "Configuration" → "General configuration"
2. Edit:
   - Timeout: 30 seconds
   - Memory: 512 MB

### Step 6: Create API Gateway

1. Go to API Gateway Console
2. Create "HTTP API"
3. Add integration: Lambda
4. Select your `funcloud-ai-backend` function
5. API name: `funcloud-api`
6. Configure CORS:
   - Allow origins: `*` (or your Amplify domain)
   - Allow methods: `GET, POST, OPTIONS`
   - Allow headers: `*`
7. Create and deploy

### Step 7: Get API URL

Your API URL will be: `https://your-api-id.execute-api.region.amazonaws.com`

---

## Option 2: AWS ECS Fargate (Recommended for Production)

### Step 1: Build and Push Docker Image

```bash
cd backend

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repository
aws ecr create-repository --repository-name funcloud-backend --region us-east-1

# Build image
docker build -t funcloud-backend .

# Tag image
docker tag funcloud-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/funcloud-backend:latest

# Push image
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/funcloud-backend:latest
```

### Step 2: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name funcloud-cluster --region us-east-1
```

### Step 3: Create Task Definition

Create `task-definition.json`:

```json
{
  "family": "funcloud-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "funcloud-backend",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/funcloud-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "OPENAI_API_KEY",
          "value": "sk-your-openai-api-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/funcloud-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register task:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### Step 4: Create Application Load Balancer

1. Go to EC2 → Load Balancers
2. Create Application Load Balancer
3. Name: `funcloud-alb`
4. Internet-facing
5. Select VPC and subnets (at least 2 AZs)
6. Create target group:
   - Target type: IP
   - Protocol: HTTP
   - Port: 8000
   - Health check path: `/`
7. Configure security group to allow HTTP/HTTPS

### Step 5: Create ECS Service

```bash
aws ecs create-service \
  --cluster funcloud-cluster \
  --service-name funcloud-service \
  --task-definition funcloud-backend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=funcloud-backend,containerPort=8000"
```

Your API URL will be the ALB DNS name: `http://funcloud-alb-xxx.region.elb.amazonaws.com`

---

## Frontend Configuration (AWS Amplify)

### Step 1: Update API URL

In your Amplify app, add environment variable:

1. Go to Amplify Console
2. Select your app
3. Go to "Environment variables"
4. Add:
   - Variable: `FUNCLOUD_API_URL`
   - Value: Your backend URL (Lambda or ALB)

### Step 2: Update Build Settings

Update `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        - echo "FUNCLOUD_API_URL=$FUNCLOUD_API_URL" >> frontend/.env
  artifacts:
    baseDirectory: frontend
    files:
      - '**/*'
  cache:
    paths: []
```

### Step 3: Inject API URL at Runtime

Add to `frontend/index.html` before closing `</head>`:

```html
<script>
  // Set API URL from environment or use default
  window.FUNCLOUD_API_URL = 'YOUR_BACKEND_URL_HERE';
</script>
```

Or use Amplify's environment variable injection in your build.

---

## Testing Locally

### Backend

```bash
cd backend

# Create .env file
echo "OPENAI_API_KEY=sk-your-key" > .env

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

Backend will run at `http://localhost:8000`

### Frontend

```bash
cd frontend

# Update api.js to use localhost
# const API_BASE_URL = "http://localhost:8000";

# Serve with any static server
python -m http.server 8080
```

Frontend will run at `http://localhost:8080`

---

## Testing the API

### Test SEO Analyze

```bash
curl -X POST http://localhost:8000/api/seo/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Test Chat

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me a story", "history": []}'
```

---

## Cost Estimates

### Lambda + API Gateway
- Lambda: ~$0.20 per 1M requests
- API Gateway: ~$1.00 per 1M requests
- OpenAI API (gpt-4o-mini): ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Total for 10K requests/month: ~$2-5**

### ECS Fargate
- Fargate (0.25 vCPU, 0.5 GB): ~$10/month
- ALB: ~$16/month
- OpenAI API: Same as above
- **Total: ~$30-35/month**

---

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Restrict CORS** - Set specific origins in production
3. **Use HTTPS** - Enable SSL/TLS on ALB or API Gateway
4. **Rate limiting** - Add API Gateway throttling or use AWS WAF
5. **Secrets Manager** - Store OpenAI key in AWS Secrets Manager instead of env vars

---

## Troubleshooting

### CORS Errors
- Ensure backend CORS middleware allows your Amplify domain
- Check API Gateway CORS configuration

### Lambda Timeout
- Increase timeout to 30 seconds
- OpenAI API can take 5-15 seconds for responses

### 502 Bad Gateway (ECS)
- Check CloudWatch logs: `/ecs/funcloud-backend`
- Verify security group allows traffic on port 8000
- Check health check configuration

### OpenAI API Errors
- Verify API key is correct
- Check OpenAI account has credits
- Review rate limits on OpenAI dashboard

---

## Next Steps

1. Set up monitoring with CloudWatch
2. Add API key authentication for backend
3. Implement caching for SEO results
4. Add rate limiting per user
5. Set up CI/CD pipeline with GitHub Actions
