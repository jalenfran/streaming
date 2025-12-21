// Vercel serverless function for CORS proxy
// Usage: /api/proxy?url=https://gg.poocloud.in/chicagobears/index.m3u8

import http from 'http';
import https from 'https';
import { URL } from 'url';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get target URL from query parameter
  const targetUrl = req.query.url;
  
  if (!targetUrl || !targetUrl.startsWith('http')) {
    res.status(400).json({ error: 'Invalid URL. Use ?url=https://...' });
    return;
  }

  try {
    const parsedUrl = new URL(targetUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;

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
    };

    return new Promise((resolve, reject) => {
      const proxyReq = client.request(options, (proxyRes) => {
        // Forward status code and headers
        res.status(proxyRes.statusCode);
        res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/octet-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        proxyRes.pipe(res);
        proxyRes.on('end', () => resolve());
      });

      proxyReq.on('error', (err) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy error: ' + err.message });
        resolve();
      });

      proxyReq.end();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

