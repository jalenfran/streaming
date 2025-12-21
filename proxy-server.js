// Simple CORS proxy server
// Run: node proxy-server.js
// Then open simple.html and it will use http://localhost:3000 as proxy

import http from 'http';
import https from 'https';
import { URL } from 'url';

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const targetUrl = req.url.substring(1); // Remove leading /
    
    if (!targetUrl || !targetUrl.startsWith('http')) {
        res.writeHead(400);
        res.end('Invalid URL');
        return;
    }

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

    const proxyReq = client.request(options, (proxyRes) => {
        // Forward status code and headers
        res.writeHead(proxyRes.statusCode, {
            'Content-Type': proxyRes.headers['content-type'] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*'
        });

        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(500);
        res.end('Proxy error: ' + err.message);
    });

    proxyReq.end();
});

server.listen(PORT, () => {
    console.log(`CORS proxy server running on http://localhost:${PORT}`);
    console.log(`Usage: http://localhost:${PORT}/https://gg.poocloud.in/chicagobears/index.m3u8`);
});

