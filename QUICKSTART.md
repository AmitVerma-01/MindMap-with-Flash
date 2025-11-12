# Quick Start Guide

Get MindMapWithFlash running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use a free tier from Supabase/Vercel)
- Clerk account (free tier available)
- OpenRouter API key

## Step 1: Clone & Install (1 min)
```bash
git clone <your-repo>
cd mindmapwithflash
npm install
```

## Step 2: Environment Setup (2 min)
Create `.env` file:
```bash
cp .env.example .env
```

Fill in your values:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mindmapwithflash"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_key"
CLERK_SECRET_KEY="your_clerk_secret"
OPENROUTER_API_KEY="your_openrouter_key"
OPENROUTER_MODEL_DEEPSEEK="deepseek/deepseek-chat"
```

## Step 3: Database Setup (1 min)
```bash
npx prisma generate
npx prisma db push
```

## Step 4: Run! (1 min)
```bash
npm run dev
```

Visit http://localhost:3000 🎉

## Quick Test Checklist
1. ✅ Homepage loads
2. ✅ Click "Start Creating"
3. ✅ Enter topic: "JavaScript Promises"
4. ✅ Click "Generate Flashcards"
5. ✅ Sign up/Sign in
6. ✅ Click "Save Flashcards"
7. ✅ Go to Dashboard
8. ✅ Click "Study" on your set

## Need Help?

### Database Issues?
```bash
# Use Supabase (free tier)
1. Go to supabase.com
2. Create project
3. Copy connection string
4. Paste in DATABASE_URL
```

### Clerk Issues?
```bash
1. Go to clerk.com
2. Create application
3. Copy API keys
4. Paste in .env
```

### OpenRouter Issues?
```bash
1. Go to openrouter.ai
2. Sign up
3. Add $5 credits
4. Generate API key
5. Paste in .env
```

## What's Next?
- Read [FEATURES.md](FEATURES.md) for full feature list
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- See [IMPROVEMENTS.md](IMPROVEMENTS.md) for future plans

## Common Issues

**Port 3000 already in use?**
```bash
# Use different port
npm run dev -- -p 3001
```

**Prisma errors?**
```bash
# Reset and regenerate
npx prisma generate
npx prisma db push --force-reset
```

**Build errors?**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Support
- Check documentation files
- Review error messages carefully
- Ensure all environment variables are set
- Verify database connection

Happy learning! 📚✨
