# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL database running
- [ ] Clerk account created
- [ ] OpenRouter API key obtained

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From Clerk dashboard
- `CLERK_SECRET_KEY` - From Clerk dashboard
- `OPENROUTER_API_KEY` - From OpenRouter
- `OPENROUTER_MODEL_DEEPSEEK` - Model name (default: deepseek/deepseek-chat)

### 3. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Ensure database exists

### Clerk Authentication Issues
- Verify API keys are correct
- Check sign-in/sign-up URLs match your routes
- Ensure middleware is configured properly

### OpenRouter API Issues
- Verify API key is valid
- Check you have credits/quota
- Ensure model name is correct

## Next Steps

1. Test flashcard generation at `/pages/flashcards`
2. Implement save functionality (see IMPROVEMENTS.md)
3. Set up database migrations for production
4. Configure deployment on Vercel

## Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database commands
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create migration
npx prisma generate        # Generate client
npx prisma db push         # Push schema changes
```
