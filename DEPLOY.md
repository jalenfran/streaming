# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended - Frontend + Proxy in One)

Vercel can run both the frontend and proxy server as serverless functions!

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. **No environment variable needed!** The app will automatically use `/api/proxy` when deployed to Vercel.

The `api/proxy.js` serverless function handles CORS proxying automatically. Everything runs on Vercel - no separate proxy server needed!

### Option 2: Netlify

1. Build the app: `npm run build`
2. Deploy the `dist/` folder to Netlify
3. Set environment variable: `VITE_PROXY_URL=https://your-proxy-server.com/`

### Option 3: GitHub Pages

1. Update `vite.config.js` to set `base: '/your-repo-name/'`
2. Build: `npm run build`
3. Deploy `dist/` folder to GitHub Pages
4. Set environment variable in your CI/CD pipeline

## Proxy Server Deployment (If NOT using Vercel)

If you're deploying to Netlify, GitHub Pages, or another static host, you'll need to deploy the proxy server separately. Options:

### Railway
1. Connect your repo
2. Set start command: `node proxy-server.js`
3. Get the deployed URL
4. Update `VITE_PROXY_URL` in your frontend deployment

### Render
1. Create a new Web Service
2. Set build command: (none)
3. Set start command: `node proxy-server.js`
4. Get the deployed URL

### Heroku
1. Create `Procfile`: `web: node proxy-server.js`
2. Deploy: `git push heroku main`
3. Get the deployed URL

## Environment Variables

Create a `.env` file (or set in your hosting platform):

```
VITE_PROXY_URL=https://your-proxy-server.railway.app/
```

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Start proxy server
npm run proxy
```

