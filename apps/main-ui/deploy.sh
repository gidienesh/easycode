#!/bin/bash

# EasyCode Platform - Cloudflare Workers Deployment Script
# This script builds and deploys the main UI to Cloudflare Workers

set -e

echo "🚀 Starting EasyCode Platform deployment to Cloudflare Workers..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the apps/main-ui directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the UI library first
echo "🔨 Building UI library..."
cd ../../packages/ui-library
pnpm build
cd ../../apps/main-ui

# Deploy to Cloudflare Workers
echo "🌐 Deploying to Cloudflare Workers..."
pnpm run deploy

echo "🎉 Deployment completed successfully!"
echo "📱 Your app should be available at: https://easycode-main-ui.your-subdomain.workers.dev"

npx wrangler dev 