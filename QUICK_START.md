# Quick Start Guide - 5 Minutes to AI Features

## 🎯 Goal
Get your Analyze button and Chat working with real AI in 5 minutes.

## ⚡ Steps

### 1. Get OpenAI API Key (2 min)
1. Go to https://platform.openai.com/api-keys
2. Sign up/login
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### 2. Start Backend (1 min)
```bash
cd backend
pip install -r requirements.txt
echo "OPENAI_API_KEY=sk-your-key-here" > .env
python main.py
```

### 3. Start Frontend (1 min)
```bash
cd frontend
python -m http.server 8080
```

### 4. Test It! (1 min)
1. Open http://localhost:8080
2. Go to Quotes page → Enter URL → Click ANALYZE
3. Go to Chat tab → Type message → See AI response!

## 🎉 Done!

Your app now has real AI features!

## 📖 Next Steps

- **Deploy to AWS**: See `DEPLOYMENT.md`
- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **API Details**: See `backend/README.md`

## 💡 Tips

- **Cost**: ~$0.01 per SEO analysis, ~$0.002 per chat
- **Model**: Using gpt-4o-mini (fast & cheap)
- **Security**: Never commit your `.env` file!

## 🐛 Troubleshooting

**Backend won't start?**
```bash
# Check Python version (need 3.11+)
python --version

# Install dependencies again
pip install -r requirements.txt --upgrade
```

**Frontend can't connect?**
- Make sure backend is running on port 8000
- Check `frontend/api.js` has correct URL

**OpenAI errors?**
- Verify API key is correct
- Check you have credits: https://platform.openai.com/usage

## 📞 Need Help?

- Check `SETUP_GUIDE.md` for detailed instructions
- Run `python backend/test_api.py` to test backend
- Check browser console for frontend errors
