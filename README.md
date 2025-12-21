# Sports Stream Viewer

A sleek React app to stream NFL, NBA, and College Football games with live game detection.

## Features

- 🏈 **NFL** - All 32 teams
- 🏀 **NBA** - All 30 teams  
- 🎓 **College Football** - 50+ major FBS teams
- 🔴 **Live Games** - Automatic detection of active games
- 🔍 **Search** - Quick team search
- 🎨 **Sleek Black Theme** - Modern, dark UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the proxy server (required for CORS):
```bash
npm run proxy
# or
node proxy-server.js
```

3. In a new terminal, start the React app:
```bash
npm run dev
```

4. Open your browser to the URL shown (usually http://localhost:5173)

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Quick Deploy

**Option 1: Vercel (Easiest - Everything in One)**
1. Deploy: `vercel`
2. That's it! The `api/proxy.js` serverless function handles the proxy automatically.
3. No environment variables needed - works out of the box.

**Option 2: Separate Frontend + Proxy**
**Frontend (React App):**
1. Build: `npm run build`
2. Deploy `dist/` folder to Netlify, GitHub Pages, or any static host
3. Set environment variable: `VITE_PROXY_URL=https://your-proxy-url.com/`

**Backend (Proxy Server):**
1. Deploy `proxy-server.js` to Railway, Render, Heroku, etc.
2. Get the deployed URL and set it as `VITE_PROXY_URL` in frontend

See `DEPLOY.md` for detailed deployment instructions.

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run proxy` - Start proxy server
- `node build-cfb-ids.js` - Extract team IDs from live games (optional maintenance)

## Important Notes

- The proxy server is **required** - it handles CORS and sets proper headers
- For local development: Run `npm run proxy` in a separate terminal
- For Vercel deployment: The `api/proxy.js` serverless function handles this automatically
- For other platforms: Deploy `proxy-server.js` separately and set `VITE_PROXY_URL`
- College football logos use ESPN team IDs (automatically fetched from live games)
# streaming
