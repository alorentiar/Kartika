import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// Serve static assets with cache headers
app.use(express.static(DIST_DIR, {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Health check endpoint for Docker & Container Orchestrator probes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    app: 'KARTIKA',
    timestamp: new Date().toISOString(),
  });
});

// Single Page Application (SPA) fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[KARTIKA] Production server listening on http://0.0.0.0:${PORT}`);
});
