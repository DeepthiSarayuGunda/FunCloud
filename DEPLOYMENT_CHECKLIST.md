# Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## 📋 Pre-Deployment

### OpenAI Setup
- [ ] Created OpenAI account
- [ ] Generated API key (starts with `sk-`)
- [ ] Added credits to account ($5-10 minimum)
- [ ] Tested API key locally
- [ ] Set usage limits on OpenAI dashboard

### Local Testing
- [ ] Backend runs successfully (`python main.py`)
- [ ] All tests pass (`python test_api.py`)
- [ ] Frontend connects to backend
- [ ] SEO Analyze button works
- [ ] Chat functionality works
- [ ] No errors in browser console

### Code Review
- [ ] No API keys in code
- [ ] `.env` file in `.gitignore`
- [ ] CORS origins configured correctly
- [ ] Error handling implemented
- [ ] Input validation working

## 🚀 Backend Deployment

### Option A: AWS Lambda

#### Preparation
- [ ] Installed AWS CLI
- [ ] Configured AWS credentials (`aws configure`)
- [ ] Created Lambda deployment package
- [ ] Package size < 50MB (unzipped)

#### Lambda Function
- [ ] Created Lambda function
- [ ] Uploaded deployment package
- [ ] Set handler to `lambda_handler.handler`
- [ ] Set runtime to Python 3.11
- [ ] Set timeout to 30 seconds
- [ ] Set memory to 512 MB
- [ ] Added `OPENAI_API_KEY` environment variable
- [ ] Tested function with test event

#### API Gateway
- [ ] Created HTTP API
- [ ] Added Lambda integration
- [ ] Configured CORS (allow origins)
- [ ] Deployed to stage (e.g., `prod`)
- [ ] Noted API URL
- [ ] Tested endpoints with curl

### Option B: AWS ECS Fargate

#### Container Setup
- [ ] Created ECR repository
- [ ] Built Docker image
- [ ] Pushed image to ECR
- [ ] Image size optimized

#### ECS Configuration
- [ ] Created ECS cluster
- [ ] Created task definition
- [ ] Set CPU/Memory (256/512)
- [ ] Added `OPENAI_API_KEY` environment variable
- [ ] Configured CloudWatch logs

#### Load Balancer
- [ ] Created Application Load Balancer
- [ ] Created target group (port 8000)
- [ ] Configured health checks
- [ ] Set up security groups
- [ ] Noted ALB DNS name

#### ECS Service
- [ ] Created ECS service
- [ ] Linked to ALB target group
- [ ] Set desired count (1+)
- [ ] Configured auto-scaling (optional)
- [ ] Service running successfully

## 🌐 Frontend Deployment

### Amplify Setup
- [ ] Pushed code to GitHub
- [ ] Connected Amplify to repository
- [ ] Selected correct branch
- [ ] Reviewed build settings
- [ ] Added `FUNCLOUD_API_URL` environment variable

### Frontend Configuration
- [ ] Updated `window.FUNCLOUD_API_URL` in `index.html`
- [ ] Verified API URL is correct
- [ ] Tested build locally
- [ ] No hardcoded localhost URLs

### Deployment
- [ ] Triggered Amplify build
- [ ] Build completed successfully
- [ ] Noted Amplify URL
- [ ] Visited deployed site

## ✅ Post-Deployment Testing

### Backend Tests
- [ ] Health check works (`GET /`)
- [ ] SEO endpoint works (`POST /api/seo/analyze`)
- [ ] Chat endpoint works (`POST /api/chat`)
- [ ] CORS headers present
- [ ] Response times acceptable (<10s)

### Frontend Tests
- [ ] Site loads correctly
- [ ] No console errors
- [ ] SEO Analyze button works
  - [ ] Enter URL
  - [ ] Click Analyze
  - [ ] Results display correctly
  - [ ] Recommendations formatted properly
- [ ] Chat functionality works
  - [ ] Send message
  - [ ] Receive AI response
  - [ ] History maintained
  - [ ] Typing indicator shows
- [ ] Error handling works
  - [ ] Invalid URL shows error
  - [ ] Network errors handled gracefully

### Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## 🔒 Security Verification

### API Keys
- [ ] No API keys in frontend code
- [ ] No API keys in Git history
- [ ] Environment variables used correctly
- [ ] `.env` file not committed

### CORS
- [ ] CORS configured for production domain
- [ ] Wildcard (`*`) removed in production
- [ ] Preflight requests working

### HTTPS
- [ ] All traffic uses HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificate valid

### Rate Limiting
- [ ] API Gateway throttling configured (optional)
- [ ] OpenAI rate limits understood
- [ ] Monitoring in place

## 📊 Monitoring Setup

### CloudWatch
- [ ] Lambda/ECS logs visible
- [ ] Created log groups
- [ ] Set log retention period
- [ ] Created alarms for errors

### OpenAI Dashboard
- [ ] Usage tracking enabled
- [ ] Spending limits set
- [ ] Email alerts configured

### Amplify
- [ ] Build notifications enabled
- [ ] Monitoring dashboard reviewed

## 💰 Cost Management

### OpenAI
- [ ] Set spending limit ($10-50/month)
- [ ] Enabled email alerts
- [ ] Reviewed pricing tiers

### AWS
- [ ] Reviewed cost estimates
- [ ] Set up billing alerts
- [ ] Enabled Cost Explorer
- [ ] Tagged resources appropriately

## 📝 Documentation

### Internal Docs
- [ ] Documented API endpoints
- [ ] Noted all URLs (backend, frontend)
- [ ] Saved credentials securely
- [ ] Created runbook for common issues

### User Docs
- [ ] Updated README if needed
- [ ] Documented new features
- [ ] Created user guide (optional)

## 🎯 Go-Live Checklist

### Final Checks
- [ ] All tests passing
- [ ] No critical errors in logs
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Monitoring active
- [ ] Backup plan ready

### Communication
- [ ] Stakeholders notified
- [ ] Support team briefed
- [ ] Rollback plan documented

### Launch
- [ ] Deployed to production
- [ ] Verified functionality
- [ ] Monitored for 1 hour
- [ ] No critical issues

## 🐛 Troubleshooting Reference

### Common Issues

**"OPENAI_API_KEY not set"**
- Check Lambda/ECS environment variables
- Verify key format (starts with `sk-`)

**"CORS error"**
- Update backend CORS origins
- Check API Gateway CORS settings
- Verify frontend URL matches allowed origin

**"502 Bad Gateway"**
- Check CloudWatch logs
- Verify Lambda timeout (30s)
- Check ECS task health

**"Chat not working"**
- Verify API URL in frontend
- Check browser console
- Test backend directly with curl

**"High costs"**
- Review OpenAI usage dashboard
- Check for infinite loops
- Verify rate limiting

## 📞 Support Contacts

- **OpenAI Support**: https://help.openai.com
- **AWS Support**: https://console.aws.amazon.com/support
- **Internal Team**: [Add your team contacts]

## 🎉 Success Criteria

- [ ] SEO Analyze button returns real AI recommendations
- [ ] Chat provides intelligent, context-aware responses
- [ ] No errors in production logs
- [ ] Response times < 10 seconds
- [ ] Costs within budget
- [ ] Users can access all features
- [ ] Monitoring shows healthy metrics

---

## Next Steps After Deployment

1. Monitor for 24 hours
2. Gather user feedback
3. Review costs and usage
4. Plan next iteration
5. Document lessons learned

**Congratulations on your deployment! 🚀**
