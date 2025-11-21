# Deployment Guide: Timeless Wealth

This guide will walk you through deploying your Timeless Wealth app to GitHub and Vercel.

## Prerequisites

- Node.js installed (v18 or higher recommended)
- A GitHub account
- A Vercel account (free tier works great)
- A Gemini API key from Google AI Studio

---

## Step 1: Initialize Git Repository

If you haven't already, initialize a git repository in your project:

```bash
cd /Users/devang/Documents/timeless-wealth
git init
```

## Step 2: Create .env.local File (Local Development)

Create a `.env.local` file in the root directory with your Gemini API key:

```bash
GEMINI_API_KEY=your_api_key_here
```

**Important**: This file is already in `.gitignore` and will NOT be committed to GitHub.

## Step 3: Stage and Commit Your Code

```bash
# Add all files (except those in .gitignore)
git add .

# Create your first commit
git commit -m "Initial commit: Timeless Wealth app"
```

## Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it `timeless-wealth` (or any name you prefer)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 5: Connect Local Repository to GitHub

GitHub will show you commands. Run these in your terminal:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/timeless-wealth.git

# Rename your branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Step 6: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended for first time)

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub to sign in for easier integration)
2. Click "Add New..." → "Project"
3. Import your GitHub repository (`timeless-wealth`)
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
5. **Environment Variables**: 
   - Click "Environment Variables"
   - Add: `GEMINI_API_KEY` = `your_api_key_here`
   - Make sure it's available for Production, Preview, and Development
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from your project directory)
vercel

# Follow the prompts:
# - Link to existing project? No (first time)
# - Project name: timeless-wealth
# - Directory: ./
# - Override settings? No

# Set environment variable
vercel env add GEMINI_API_KEY

# Redeploy with environment variable
vercel --prod
```

## Step 7: Verify Deployment

1. After deployment, Vercel will provide you with a URL (e.g., `https://timeless-wealth.vercel.app`)
2. Visit the URL and test your app
3. Check that the Gemini API calls are working

## Step 8: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

---

## Important Notes

### Environment Variables
- **Never commit** `.env.local` or `.env` files to GitHub
- Always add environment variables in Vercel dashboard for production
- Vercel automatically injects environment variables during build and runtime

### Build Configuration
- Vercel should auto-detect Vite configuration
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

### API Key Security
- Your Gemini API key is stored securely in Vercel
- It's only accessible during build/runtime, not exposed in client-side code
- The API calls happen server-side (if you set up API routes) or client-side (current setup)

---

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)
- Check build logs in Vercel dashboard

### API Key Not Working
- Verify `GEMINI_API_KEY` is set in Vercel environment variables
- Make sure it's available for the correct environment (Production/Preview)
- Check that the variable name matches exactly: `GEMINI_API_KEY`

### Environment Variables Not Loading
- Vercel uses `process.env.GEMINI_API_KEY` in serverless functions
- For client-side, you may need to use Vite's `import.meta.env.VITE_GEMINI_API_KEY`
- Current setup uses `process.env.GEMINI_API_KEY` which works with Vite's define config

---

## Future Updates

To deploy updates:

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically detect the push and redeploy your app!

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Documentation](https://docs.github.com)

