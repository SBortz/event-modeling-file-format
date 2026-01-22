import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { InformationFlowModel, ViewMode } from './types.js';
import { renderHtml } from './views/render.js';

export interface ServerOptions {
  filePath: string;
  port: number;
}

export function createServer(options: ServerOptions): {
  start: () => void;
  stop: () => void;
  triggerReload: () => void;
} {
  const { filePath, port } = options;
  const clients = new Set<http.ServerResponse>();
  
  let currentModel: InformationFlowModel | null = null;
  let currentError: string | null = null;
  
  function loadModel(): void {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      currentModel = JSON.parse(content) as InformationFlowModel;
      currentError = null;
    } catch (err) {
      currentError = err instanceof Error ? err.message : String(err);
      // Keep old model for display, just show error
    }
  }
  
  // Initial load
  loadModel();
  
  function triggerReload(): void {
    loadModel();
    for (const client of clients) {
      client.write('data: reload\n\n');
    }
  }
  
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', `http://localhost:${port}`);
    
    // SSE endpoint for live reload
    if (url.pathname === '/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });
      
      clients.add(res);
      
      // Keep-alive ping
      const interval = setInterval(() => {
        res.write(': ping\n\n');
      }, 30000);
      
      req.on('close', () => {
        clearInterval(interval);
        clients.delete(res);
      });
      
      return;
    }
    
    // Main page
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const view = (url.searchParams.get('view') || 'timeline') as ViewMode;
      
      if (!currentModel && currentError) {
        // No model loaded yet, show basic error page
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>Error</title></head>
          <body style="background:#1a1b26;color:#f7768e;padding:2rem;font-family:monospace;">
            <h1>Failed to load model</h1>
            <pre>${currentError}</pre>
            <script>
              const events = new EventSource('/events');
              events.onmessage = () => location.reload();
            </script>
          </body>
          </html>
        `);
        return;
      }
      
      const model = currentModel || {
        name: 'Loading...',
        timeline: [],
      };
      
      const fileName = path.basename(filePath);
      const html = renderHtml(model, view, currentError || undefined, fileName);
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    
    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });
  
  return {
    start: () => {
      server.listen(port, () => {
        const fileName = path.basename(filePath);
        console.log(`\n  🔴 Information Flow Live Preview`);
        console.log(`  ────────────────────────────────`);
        console.log(`  Watching: ${fileName}`);
        console.log(`  Server:   http://localhost:${port}`);
        console.log(`\n  Press Ctrl+C to stop\n`);
      });
    },
    stop: () => {
      for (const client of clients) {
        client.end();
      }
      server.close();
    },
    triggerReload,
  };
}
