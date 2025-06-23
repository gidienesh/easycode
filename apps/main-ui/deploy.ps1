# EasyCode Platform - Cloudflare Workers Deployment Script (PowerShell)
# This script builds and deploys the main UI to Cloudflare Workers

param(
    [string]$Environment = "production"
)

Write-Host "🚀 Starting EasyCode Platform deployment to Cloudflare Workers..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the apps/main-ui directory." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Build the UI library first
Write-Host "🔨 Building UI library..." -ForegroundColor Yellow
Set-Location ../../packages/ui-library
pnpm build
Set-Location ../../apps/main-ui

# Deploy to Cloudflare Workers
Write-Host "🌐 Deploying to Cloudflare Workers..." -ForegroundColor Yellow
pnpm run deploy

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "📱 Your app should be available at: https://easycode-main-ui.your-subdomain.workers.dev" -ForegroundColor Cyan 