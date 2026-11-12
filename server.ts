import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BROADCAST_URLS: Record<string, string> = {
  aviator1: 'https://www.radar-aviator.com/broadcast.php?casa=BETBRABO&_=1791309160733',
  aviator_vip: 'https://www.radar-aviator.com/broadcast2.php?casa=BETBRABO&_=1791309023315',
  premium: 'https://www.radar-aviator.com/broadcast3.php?casa=BETBRABO&_=1791308160373',
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, serverTime: new Date().toISOString() });
  });

  // Proxy endpoint for radar live broadcasts
  app.get('/api/broadcast', async (req, res) => {
    const serverKey = (req.query.server as string) || 'aviator1';
    const targetUrl = BROADCAST_URLS[serverKey] || (req.query.url as string) || BROADCAST_URLS.aviator1;

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      res.json({ ok: true, source: serverKey, data });
    } catch (error: any) {
      res.status(502).json({
        ok: false,
        source: serverKey,
        error: error.message || 'Falha ao buscar dados do radar ao vivo',
      });
    }
  });

  // Proxy endpoint to fetch all 3 broadcast APIs simultaneously for comparison charts
  app.get('/api/broadcasts-all', async (_req, res) => {
    const fetchServer = async (key: string, url: string) => {
      try {
        const resp = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json, text/plain, */*',
          },
          signal: AbortSignal.timeout(5000),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        return { key, ok: true, data: json };
      } catch (err: any) {
        return { key, ok: false, error: err.message };
      }
    };

    const results = await Promise.all([
      fetchServer('aviator1', BROADCAST_URLS.aviator1),
      fetchServer('aviator_vip', BROADCAST_URLS.aviator_vip),
      fetchServer('premium', BROADCAST_URLS.premium),
    ]);

    const payload: Record<string, any> = {};
    results.forEach((r) => {
      payload[r.key] = r;
    });

    res.json({ ok: true, timestamp: new Date().toISOString(), servers: payload });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Radar Aviator Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
