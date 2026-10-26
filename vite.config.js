import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite plugin to run serverless API functions locally during development
function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next();

        const urlPath = req.url.split('?')[0];
        const apiName = urlPath.replace('/api/', '');

        const validApis = ['verify-pin', 'rsvp', 'admin-rsvps', 'test-sheets', 'retry-sync'];
        if (!validApis.includes(apiName)) return next();

        try {
          const { pathToFileURL } = await import('url');
          const path = await import('path');
          const filePath = path.resolve(`./api/${apiName}.js`);
          const fileUrl = `${pathToFileURL(filePath).href}?t=${Date.now()}`;
          const handlerModule = await import(fileUrl);

          if (handlerModule && handlerModule.default) {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                req.body = body ? JSON.parse(body) : {};
              } catch {
                req.body = body;
              }

              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };

              await handlerModule.default(req, res);
            });
            return;
          }
        } catch (e) {
          console.error('API dev handler error:', e);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: e.message }));
          return;
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), apiDevMiddleware()],
  server: {
    port: 3000,
    host: true
  }
})
