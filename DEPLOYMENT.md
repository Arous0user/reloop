# Deployment Guide

This guide explains how to deploy the MarketPlace e-commerce platform to production with scalability for 200,000 products and 5,000 concurrent listings.

## 🚀 Deployment Architecture

```
Frontend (Vercel/Netlify) ←→ Backend (Render/Railway) ←→ Database (Supabase/Neon)
                                   ↑
                                   |
                            File Storage (AWS S3/Cloudinary)
                                   |
                            Payment Processing (Stripe/Razorpay)
                                   |
                            AI Services (Gemini API)
                                   |
                            Caching (Redis)
```

## 🌐 Frontend Deployment

### Vercel (Recommended)
1. Create an account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`
3. Navigate to the frontend directory: `cd frontend`
4. Deploy: `vercel --prod`

### Netlify
1. Create an account at [netlify.com](https://netlify.com)
2. Install Netlify CLI: `npm install -g netlify-cli`
3. Navigate to the frontend directory: `cd frontend`
4. Deploy: `netlify deploy --prod`

## ☁ Backend Deployment

### Render (Recommended)
1. Create an account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the following environment variables:
   - DATABASE_URL
   - JWT_SECRET
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - STRIPE_SECRET_KEY
   - GEMINI_API_KEY
   - REDIS_HOST
   - REDIS_PORT
5. Set build command: `npm install`
6. Set start command: `npm start`

### Railway
1. Create an account at [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Set the environment variables as above
5. Deploy

## 🗄 Database Deployment

### Supabase (Recommended for PostgreSQL)
1. Create an account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get the database connection string
4. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Neon.tech
1. Create an account at [neon.tech](https://neon.tech)
2. Create a new project
3. Get the connection string
4. Run Prisma migrations as above

## 📦 File Storage

### AWS S3
1. Create an AWS account
2. Create an S3 bucket
3. Create IAM user with S3 permissions
4. Set environment variables:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_REGION
   - AWS_S3_BUCKET_NAME

### Cloudinary
1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Get API credentials
3. Set environment variables:
   - CLOUDINARY_URL

## 💳 Payment Processing

### Stripe
1. Create an account at [stripe.com](https://stripe.com)
2. Get API keys
3. Set environment variables:
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET

### Razorpay (For India)
1. Create an account at [razorpay.com](https://razorpay.com)
2. Get API keys
3. Set environment variables:
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET

## 🤖 AI Services

### Gemini API
1. Get API key from Google AI Studio
2. Set environment variable:
   - GEMINI_API_KEY

## 🗃 Caching with Redis

### Upstash Redis (Recommended)
1. Create an account at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Get the connection details
4. Set environment variables:
   - REDIS_HOST
   - REDIS_PORT
   - REDIS_PASSWORD (if applicable)

### Self-hosted Redis
1. Deploy Redis on your infrastructure
2. Set environment variables:
   - REDIS_HOST
   - REDIS_PORT
   - REDIS_PASSWORD (if applicable)

## 🛡 Environment Variables

Create a `.env.production` file in your backend with:

```env
# Database
DATABASE_URL=your_production_database_url

# JWT
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_secure_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d

# AWS S3 (or Cloudinary)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Stripe (or Razorpay)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Redis for caching
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
# REDIS_PASSWORD=your_redis_password_if_any

# Server
PORT=8080
NODE_ENV=production

# Performance settings
PRISMA_CLIENT_ENGINE_TYPE=dataproxy
```

## 🔧 Post-Deployment Steps

1. Verify all environment variables are set correctly
2. Test user registration and login
3. Test product creation and image upload
4. Test payment processing with test cards
5. Verify AI features are working
6. Set up monitoring and error tracking (e.g., Sentry)
7. Configure custom domain and SSL certificates
8. Set up CI/CD pipelines for automatic deployments
9. Run load tests to verify scalability

## 🔄 CI/CD Setup

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --token $VERCEL_TOKEN --scope $VERCEL_SCOPE --prod

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          # Render deployment via GitHub integration
```

## 📊 Monitoring & Analytics

1. Set up application monitoring with:
   - Sentry for error tracking
   - LogDNA or Papertrail for logs
   - New Relic or DataDog for performance monitoring

2. Set up business analytics with:
   - Google Analytics
   - Mixpanel or Amplitude for user behavior
   - Custom dashboards for sales and revenue

3. Monitor scalability metrics:
   - Response times under load
   - Database query performance
   - Cache hit rates
   - Memory and CPU usage

## 🔒 Security Considerations

1. Use HTTPS for all communications
2. Implement rate limiting
3. Set up proper CORS policies
4. Regularly update dependencies
5. Implement proper input validation
6. Use parameterized queries to prevent SQL injection
7. Store secrets securely
8. Implement proper authentication and authorization
9. Regular security audits
10. DDoS protection for handling traffic spikes

## 📈 Scaling Considerations

For handling 200,000 products and 5,000 concurrent listings:

1. **Database**: Use a managed PostgreSQL service with at least 4GB RAM
2. **Caching**: Implement Redis for caching product data
3. **Load Balancing**: Use a load balancer for distributing traffic
4. **CDN**: Use a CDN for static assets and images
5. **Auto-scaling**: Configure auto-scaling based on CPU/memory usage
6. **Connection Pooling**: Configure database connection pooling
7. **Monitoring**: Implement comprehensive monitoring

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify DATABASE_URL is correct
   - Check firewall settings
   - Ensure database user has proper permissions

2. **File Uploads Not Working**
   - Verify AWS credentials
   - Check S3 bucket permissions
   - Ensure proper CORS configuration

3. **Payments Not Processing**
   - Verify Stripe API keys
   - Check webhook configuration
   - Test with Stripe's test cards

4. **AI Features Not Working**
   - Verify GEMINI_API_KEY
   - Check API quota limits
   - Ensure proper prompt formatting

5. **Caching Issues**
   - Verify Redis connection details
   - Check Redis memory usage
   - Monitor cache hit/miss ratios

6. **Performance Issues**
   - Check database query performance
   - Monitor cache effectiveness
   - Review rate limiting settings

### Support

For issues not covered in this guide:
1. Check the project's GitHub issues
2. Contact the development team
3. Refer to the documentation of individual services (AWS, Stripe, etc.)
4. Review the [SCALING.md](file:///C:/Users/flyin/Desktop/WEBSITE/SCALING.md) documentation for performance optimization details