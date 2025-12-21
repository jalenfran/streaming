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

2. Start the development server:
```bash
npm run dev
```

The proxy is built into the Vite dev server - no separate process needed!

3. Open your browser to the URL shown (usually http://localhost:5173)

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. **That's it!** The `api/proxy.js` serverless function handles the proxy automatically.

See `DEPLOY.md` for detailed deployment instructions.

## Development Scripts

- `npm run dev` - Start development server (proxy built-in via Vite plugin)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `node build-cfb-ids.js` - Extract team IDs from live games (optional maintenance)

## Important Notes

- **Local Development**: Proxy is built into Vite dev server - just run `npm run dev`!
- **Vercel Deployment**: The `api/proxy.js` serverless function handles proxying automatically
- College football logos use ESPN team IDs (automatically fetched from live games)
# streaming
