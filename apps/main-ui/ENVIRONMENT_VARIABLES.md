# EasyCode Platform - Environment Variables Guide

This guide explains how to configure environment variables for the EasyCode Platform when deploying to Cloudflare Workers.

## 📋 Environment Variables Overview

The EasyCode Platform uses environment variables to configure different aspects of the application across different environments (development, staging, production).

## 🔧 Environment Files

### Development (`.dev.vars`)
- Used for local development with `wrangler dev`
- Contains localhost URLs for services
- Automatically loaded by Wrangler

### Staging (`env.staging`)
- Template for staging environment variables
- Contains staging service URLs
- Use with `setup-env.sh staging` or `setup-env.ps1 staging`

### Production (`env.production`)
- Template for production environment variables
- Contains production service URLs
- Use with `setup-env.sh production` or `setup-env.ps1 production`

## 🚀 Quick Setup

### Automated Setup

#### Windows (PowerShell)
```powershell
# For development (already configured in .dev.vars)
# No additional setup needed

# For staging
.\setup-env.ps1 staging

# For production
.\setup-env.ps1 production
```

#### Linux/macOS (Bash)
```bash
# For development (already configured in .dev.vars)
# No additional setup needed

# For staging
./setup-env.sh staging

# For production
./setup-env.sh production
```

### Manual Setup

1. **Copy environment template**:
   ```bash
   cp env.production env.local
   ```

2. **Edit the file** with your actual values

3. **Set variables manually**:
   ```bash
   # For regular variables
   wrangler secret put NEXT_PUBLIC_APP_NAME
   
   # For secrets
   echo "your-secret-value" | wrangler secret put NEXT_PUBLIC_JWT_SECRET
   ```

## 📝 Environment Variables Reference

### Core Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Node.js environment | `production` | ✅ |
| `NEXTJS_ENV` | Next.js environment | `production` | ✅ |
| `NEXT_PUBLIC_APP_URL` | Main application URL | `https://app.easycode.com` | ✅ |

### API Service Endpoints

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | Base API URL | `https://api.easycode.com` | ✅ |
| `NEXT_PUBLIC_TENANT_SERVICE_URL` | Tenant service URL | `https://tenant-service.easycode.com` | ✅ |
| `NEXT_PUBLIC_USER_SERVICE_URL` | User service URL | `https://user-service.easycode.com` | ✅ |
| `NEXT_PUBLIC_CRM_SERVICE_URL` | CRM service URL | `https://crm-service.easycode.com` | ✅ |
| `NEXT_PUBLIC_FINANCE_SERVICE_URL` | Finance service URL | `https://finance-service.easycode.com` | ✅ |
| `NEXT_PUBLIC_INVENTORY_SERVICE_URL` | Inventory service URL | `https://inventory-service.easycode.com` | ✅ |
| `NEXT_PUBLIC_HR_SERVICE_URL` | HR service URL | `https://hr-service.easycode.com` | ✅ |
| `NEXT_PUBLIC_POS_SERVICE_URL` | POS service URL | `https://pos-service.easycode.com` | ✅ |
| `NEXT_PUBLIC_NOTIFICATION_SERVICE_URL` | Notification service URL | `https://notification-service.easycode.com` | ✅ |

### App Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_APP_NAME` | Application name | `EasyCode Platform` | ✅ |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` | ✅ |
| `NEXT_PUBLIC_MANTINE_COLOR_SCHEME` | UI color scheme | `light` | ✅ |
| `NEXT_PUBLIC_MANTINE_PRIMARY_COLOR` | Primary color | `blue` | ✅ |

### Multi-tenancy Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_ENABLE_TENANT_SWITCHING` | Enable tenant switching | `true` | ✅ |
| `NEXT_PUBLIC_ENABLE_MULTI_TENANCY` | Enable multi-tenancy | `true` | ✅ |
| `NEXT_PUBLIC_DEFAULT_TENANT_ID` | Default tenant ID | `default` | ✅ |
| `NEXT_PUBLIC_TENANT_DOMAIN_SUFFIX` | Tenant domain suffix | `.easycode.com` | ✅ |

### Security & CORS

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_ALLOWED_ORIGINS` | CORS allowed origins | `https://app.easycode.com` | ✅ |

### Secrets (Set via `wrangler secret put`)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_JWT_SECRET` | JWT signing secret | `your-jwt-secret` | ✅ |
| `NEXT_PUBLIC_JWT_EXPIRES_IN` | JWT expiration time | `24h` | ✅ |
| `NEXT_PUBLIC_API_KEY` | API key for external services | `your-api-key` | ❌ |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key | `your-r2-access-key` | ❌ |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret key | `your-r2-secret-key` | ❌ |

## 🔐 Setting Secrets

Secrets are sensitive environment variables that should be set using `wrangler secret put`:

```bash
# Set JWT secret
echo "your-super-secret-jwt-key" | wrangler secret put NEXT_PUBLIC_JWT_SECRET

# Set API key
echo "your-api-key-here" | wrangler secret put NEXT_PUBLIC_API_KEY

# Set R2 credentials
echo "your-r2-access-key" | wrangler secret put R2_ACCESS_KEY_ID
echo "your-r2-secret-key" | wrangler secret put R2_SECRET_ACCESS_KEY
```

## 🌍 Environment-Specific Configurations

### Development Environment
- Uses localhost URLs for all services
- Enables debugging and development features
- Configured in `.dev.vars`

### Staging Environment
- Uses staging service URLs
- Mirrors production configuration
- Used for testing before production deployment

### Production Environment
- Uses production service URLs
- Optimized for performance and security
- Used for live user traffic

## 🔍 Validation

### Check Current Variables
```bash
# List all variables
wrangler secret list

# Check specific variable (if it's a secret)
wrangler secret list | grep NEXT_PUBLIC_JWT_SECRET
```

### Test Environment Variables
```bash
# Test locally
pnpm run preview

# Check worker logs
wrangler tail
```

## 🐛 Troubleshooting

### Common Issues

1. **Missing Environment Variables**:
   - Check if all required variables are set
   - Verify variable names match exactly
   - Ensure secrets are set using `wrangler secret put`

2. **CORS Errors**:
   - Verify `NEXT_PUBLIC_ALLOWED_ORIGINS` includes your domain
   - Check service URLs are accessible

3. **Service Connection Errors**:
   - Verify all service URLs are correct
   - Check if services are running and accessible
   - Ensure proper authentication is configured

### Debug Commands

```bash
# Check worker status
wrangler whoami

# List all secrets
wrangler secret list

# View worker logs
wrangler tail

# Test worker locally
wrangler dev
```

## 📚 Additional Resources

- [Cloudflare Workers Environment Variables](https://developers.cloudflare.com/workers/platform/environment-variables/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [OpenNext Cloudflare Documentation](https://opennext.js.org/cloudflare/get-started)

## 🆘 Support

For environment variable issues:

1. Check this documentation
2. Review the troubleshooting section
3. Check Cloudflare Workers logs
4. Contact the EasyCode Platform team 