# FunCloud AI Chat - Quick Start

## 3 Commands to Deploy

### 1. Create .env with your OpenAI key
```powershell
echo "OPENAI_API_KEY=sk-proj-your-actual-key" > backend\.env
```

### 2. Deploy Lambda
```powershell
.\deploy-funcloud.ps1 -FunctionName funcloud-backend
```

### 3. Push to Git
```powershell
git add .
git commit -m "Deploy AI chat"
git push origin main
```

## Then Set Amplify Env Var

Go to Amplify Console and add:
- Key: `FUNCLOUD_API_URL`
- Value: `<Lambda URL from step 2>`

## Test

Open: https://main.d3qeafj5ul33ss.amplifyapp.com
Go to Chat → Type message → See AI reply

---

**That's it!** Check `DEPLOY_README.md` for details.
