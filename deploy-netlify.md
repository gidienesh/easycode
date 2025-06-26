# Deploy EasyCode to Netlify

## Quick Deployment Steps

### Option 1: Git Integration (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Netlify configuration"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign in with your GitHub account
   - Click "New site from Git"
   - Choose "GitHub" and authorize Netlify
   - Select your repository: `gidienesh/easycode`

3. **Configure Build Settings**:
   - **Base directory**: `apps/main-ui`
   - **Build command**: `cd ../../ && pnpm install && cd apps/main-ui && cp next.config.netlify.js next.config.js && pnpm run build`
   - **Publish directory**: `apps/main-ui/out`

4. **Environment Variables**:
   - Add `NETLIFY=true`
   - Add `NODE_VERSION=18`
   - Add `PNPM_VERSION=8`

5. **Deploy**: Click "Deploy site"

### Option 2: Manual Deploy

1. **Build locally**:
   ```bash
   cd apps/main-ui
   cp next.config.netlify.js next.config.js
   pnpm install
   pnpm run build
   ```

2. **Upload the `out` folder** to Netlify manually

## Features Included

✅ **Complete Finance Module**:
- Payments tracking
- Income Statement
- Balance Sheet
- Cash Flow Statement
- Trial Balance
- Bank Reconciliation
- Invoices management

✅ **Professional UI/UX**:
- Mantine UI components
- Responsive design
- KES currency formatting
- Search and filtering
- Modal forms with validation

✅ **Static Export Optimized**:
- No server-side dependencies
- Fast loading times
- CDN-friendly assets

## Post-Deployment

After deployment, your EasyCode app will be available at:
`https://[your-site-name].netlify.app`

You can access the finance module at:
`https://[your-site-name].netlify.app/finance/`

## Troubleshooting

- If build fails, check the build logs in Netlify dashboard
- Ensure all dependencies are properly installed
- Verify the base directory is set to `apps/main-ui`
- Check that the publish directory points to `apps/main-ui/out` 