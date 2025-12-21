// Vite plugin to handle proxy requests during development
// This makes the proxy "built into" the React app - no separate server needed!

import https from 'https'
import http from 'http'
import { URL } from 'url'

export default function vitePluginProxy() {
  return {
    name: 'vite-plugin-proxy',
    configureServer(server) {
      // Handle /api/proxy requests directly in Vite middleware
      server.middlewares.use('/api/proxy', (req, res, next) => {
        // Enable CORS
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', '*')

        if (req.method === 'OPTIONS') {
          res.writeHead(200)
          res.end()
          return
        }

        // Get target URL from query parameter
        const urlObj = new URL(req.url, `http://${req.headers.host}`)
        const targetUrl = urlObj.searchParams.get('url')
        
        if (!targetUrl || !targetUrl.startsWith('http')) {
          res.writeHead(400)
          res.end('Invalid URL. Use ?url=https://...')
          return
        }

        try {
          const parsedUrl = new URL(targetUrl)
          const client = parsedUrl.protocol === 'https:' ? https : http

          const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            headers: {
              'Referer': 'https://embedsports.top/',
              'Origin': 'https://embedsports.top',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
              'Accept': '*/*'
            }
          }

          const proxyReq = client.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, {
              'Content-Type': proxyRes.headers['content-type'] || 'application/octet-stream',
              'Access-Control-Allow-Origin': '*'
            })
            proxyRes.pipe(res)
          })

          proxyReq.on('error', (err) => {
            console.error('Proxy error:', err)
            res.writeHead(500)
            res.end('Proxy error: ' + err.message)
          })

          proxyReq.end()
        } catch (error) {
          res.writeHead(500)
          res.end('Error: ' + error.message)
        }
      })

      console.log('\n✅ Proxy built into Vite dev server at /api/proxy')
      console.log('   No separate proxy server needed!\n')
    }
  }
}

