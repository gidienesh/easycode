# EasyCode Platform - Cloudflare Workers Deployment Guide

This guide explains how to deploy the EasyCode Platform main UI to Cloudflare Workers using OpenNext.

## 🚀 Quick Start

### Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install the Cloudflare CLI tool
   ```bash
   npm install -g wrangler
   ```
3. **Authentication**: Login to Cloudflare
   ```bash
   wrangler login
   ```

### Automated Deployment

#### Windows (PowerShell)
```powershell
.\deploy.ps1
```

#### Linux/macOS (Bash)
```bash
./deploy.sh
```

### Manual Deployment

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Build UI library**:
   ```bash
   cd ../../packages/ui-library
   pnpm build
   cd ../../apps/main-ui
   ```

3. **Deploy to Cloudflare Workers**:
   ```bash
   pnpm run deploy
   ```

## 📁 Configuration Files

### `open-next.config.ts`
- Configures OpenNext build settings for Cloudflare Workers
- Enables R2 incremental caching
- Optimizes for edge runtime

### `wrangler.toml`
- Cloudflare Workers project configuration
- Defines bindings for assets and R2 storage
- Configures compatibility flags

### `.dev.vars`
- Local development environment variables
- Sets `NEXTJS_ENV=development`

### `public/_headers`
- Static asset caching configuration
- Optimizes performance for static files

## 🔧 Environment Configuration

### Required Environment Variables

Set these in your Cloudflare Workers dashboard or via Wrangler:

```bash
# Production environment
NODE_ENV=production

# API endpoints (update with your actual service URLs)
NEXT_PUBLIC_API_BASE_URL=https://api.easycode.com
NEXT_PUBLIC_TENANT_SERVICE_URL=https://tenant-service.easycode.com
NEXT_PUBLIC_USER_SERVICE_URL=https://user-service.easycode.com

# Authentication
NEXT_PUBLIC_AUTH_DOMAIN=your-auth-domain.com
NEXT_PUBLIC_AUTH_CLIENT_ID=your-client-id
```

### Setting Environment Variables

#### Via Cloudflare Dashboard
1. Go to Cloudflare Workers dashboard
2. Select your worker
3. Go to Settings > Variables
4. Add your variables

#### Via Wrangler CLI
```bash
# Set production variables
wrangler secret put NODE_ENV

# Set secrets (for sensitive data)
wrangler secret put API_KEY
```

## 🌐 Custom Domain Setup

1. **Add custom domain in Cloudflare Workers**:
   - Go to your worker settings
   - Navigate to Triggers > Custom domains
   - Add your domain (e.g., `app.easycode.com`)

2. **Configure DNS**:
   - Add CNAME record pointing to your worker URL
   - Or use Cloudflare's automatic DNS management

## 🔄 CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Setup pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Build UI library
      run: |
        cd packages/ui-library
        pnpm build
    
    - name: Deploy to Cloudflare Workers
      run: |
        cd apps/main-ui
        pnpm run deploy
      env:
        CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### Required Secrets

Add these to your GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │   OpenNext       │    │   Next.js App   │
│   Workers       │◄───┤   Build          │◄───┤   (main-ui)     │
│                 │    │                  │    │                 │
│ • Edge Runtime  │    │ • Worker Export  │    │ • React App     │
│ • Global CDN    │    │ • API Routes     │    │ • Mantine UI    │
│ • Auto Scaling  │    │ • Optimizations  │    │ • Tenant System │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔍 Performance Optimizations

### Built-in Optimizations

1. **Edge Runtime**: Runs on Cloudflare's edge network
2. **Static Generation**: Pages are pre-built for faster loading
3. **CDN Distribution**: Global content delivery network
4. **R2 Caching**: Incremental static regeneration with R2 storage

### Custom Optimizations

1. **Bundle Analysis**: Enable in `open-next.config.ts`
   ```typescript
   build: {
     analyze: true
   }
   ```

2. **Caching Strategy**: Configure in `public/_headers`
   ```
   /_next/static/*
     Cache-Control: public,max-age=31536000,immutable
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (requires 18+)
   - Ensure all dependencies are installed
   - Verify workspace dependencies are built

2. **Deployment Failures**:
   - Check Wrangler authentication
   - Verify worker name in `wrangler.toml`
   - Ensure environment variables are set

3. **Runtime Errors**:
   - Check browser console for client-side errors
   - Review Cloudflare Workers logs
   - Verify API endpoints are accessible

### Debug Commands

```bash
# Test build locally
pnpm run preview

# Preview deployment
pnpm run preview

# Check deployment status
wrangler deployment list

# Generate types
pnpm run cf-typegen
```

## 📊 Monitoring

### Cloudflare Analytics

- **Web Analytics**: Built-in analytics in Cloudflare dashboard
- **Performance Monitoring**: Real User Monitoring (RUM)
- **Error Tracking**: Automatic error reporting

### Custom Monitoring

Consider integrating with:
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior analytics
- **LogRocket**: Session replay and debugging

## 🔐 Security

### Built-in Security

- **HTTPS**: Automatic SSL/TLS encryption
- **DDoS Protection**: Cloudflare's global DDoS mitigation
- **WAF**: Web Application Firewall protection

### Additional Security

1. **Environment Variables**: Store secrets securely
2. **CORS Configuration**: Configure cross-origin requests
3. **Content Security Policy**: Add CSP headers

## 📚 Additional Resources

- [OpenNext Cloudflare Documentation](https://opennext.js.org/cloudflare/get-started)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🆘 Support

For issues specific to this deployment:

1. Check the troubleshooting section above
2. Review Cloudflare Workers logs
3. Consult the OpenNext documentation
4. Contact the EasyCode Platform team 