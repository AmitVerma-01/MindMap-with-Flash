# Deployment Checklist

## Pre-Deployment Steps

### 1. Database Setup
- [ ] Create PostgreSQL database (Vercel Postgres, Supabase, or Railway)
- [ ] Get DATABASE_URL connection string
- [ ] Run Prisma migrations:
  ```bash
  npx prisma generate
  npx prisma db push
  ```

### 2. Environment Variables
Set up these variables in your deployment platform:

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/signin"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/signup"

# OpenRouter AI
OPENROUTER_API_KEY="sk-or-..."
OPENROUTER_MODEL_DEEPSEEK="deepseek/deepseek-chat"
```

### 3. Clerk Configuration
- [ ] Create Clerk application at https://clerk.com
- [ ] Configure sign-in/sign-up pages
- [ ] Add production domain to allowed origins
- [ ] Enable email/password authentication
- [ ] Copy API keys to environment variables

### 4. OpenRouter Setup
- [ ] Sign up at https://openrouter.ai
- [ ] Add credits to account
- [ ] Generate API key
- [ ] Test API key with a sample request

## Vercel Deployment

### Quick Deploy
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Detailed Steps
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add OPENROUTER_API_KEY
vercel env add OPENROUTER_MODEL_DEEPSEEK

# Deploy to production
vercel --prod
```

## Post-Deployment

### 1. Test Core Features
- [ ] Homepage loads correctly
- [ ] Sign up/Sign in works
- [ ] Generate flashcards works
- [ ] Save flashcards works
- [ ] Dashboard displays saved sets
- [ ] Study mode works
- [ ] Delete flashcard sets works

### 2. Database Verification
```bash
# Open Prisma Studio to verify data
npx prisma studio
```

### 3. Monitor Errors
- Check Vercel logs for errors
- Monitor Clerk dashboard for auth issues
- Check OpenRouter usage and errors

### 4. Performance Check
- [ ] Lighthouse score > 90
- [ ] Page load time < 3s
- [ ] API response time < 1s
- [ ] No console errors

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset
```

### Clerk Authentication Issues
- Verify API keys are correct
- Check allowed domains in Clerk dashboard
- Ensure sign-in/sign-up URLs match

### OpenRouter API Issues
- Verify API key is valid
- Check account has credits
- Test with curl:
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Monitoring

### Set Up Monitoring
1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider Sentry integration
3. **Uptime Monitoring**: Use UptimeRobot or similar
4. **Database Monitoring**: Check connection pool usage

### Key Metrics to Track
- API response times
- Error rates
- User sign-ups
- Flashcard generation success rate
- Database query performance

## Scaling Considerations

### Database
- Monitor connection pool usage
- Consider read replicas for heavy traffic
- Implement caching (Redis) if needed

### API Rate Limiting
- Implement rate limiting for API routes
- Monitor OpenRouter usage and costs
- Consider caching AI responses

### CDN & Caching
- Vercel automatically handles this
- Configure cache headers if needed
- Use ISR for static content

## Security Checklist

- [ ] Environment variables are secure
- [ ] API routes validate authentication
- [ ] Database queries use parameterized statements
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CSRF protection enabled

## Backup Strategy

### Database Backups
```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

### Automated Backups
- Enable automatic backups in your database provider
- Test restore process regularly
- Keep backups for at least 30 days

## Rollback Plan

If deployment fails:
1. Revert to previous Vercel deployment
2. Check error logs
3. Fix issues locally
4. Test thoroughly
5. Redeploy

## Cost Estimation

### Monthly Costs (Approximate)
- **Vercel**: Free tier (Hobby) or $20/month (Pro)
- **Database**: $5-25/month (depending on provider)
- **Clerk**: Free tier (10,000 MAU) or $25/month
- **OpenRouter**: Pay-per-use (~$0.001 per flashcard set)

**Total**: ~$0-70/month depending on usage

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Clerk Docs**: https://clerk.com/docs
- **OpenRouter Docs**: https://openrouter.ai/docs
