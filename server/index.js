import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import path from 'node:path';
import { config } from './config.js';
import { initSchema } from './db.js';
import { HttpError } from './http.js';
import { employeesRouter } from './routes/employees.js';
import { contactRouter } from './routes/contact.js';
import { progressRouter } from './routes/progress.js';

initSchema();

const app = express();
app.disable('x-powered-by');

app.use(compression());

// Security headers on API responses only. The static SPA is served without the
// cross-origin resource policy so that built assets load reliably behind preview
// proxies and on cloud hosts (CSP is applied by the hosting platform).
const apiSecurity = helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
});

/* ─────────────── API ─────────────── */

const api = express.Router();
api.use(apiSecurity);
api.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(new HttpError(403, 'Origin not allowed by CORS policy'));
    },
    credentials: false,
  }),
);
api.use(express.json({ limit: '100kb' }));

api.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: Math.round(process.uptime()), version: config.version, env: config.env });
});

api.use('/employees', employeesRouter);
api.use('/contact', contactRouter);
api.use('/progress', progressRouter);

api.use((_req, _res, next) => next(new HttpError(404, 'API route not found')));

app.use('/api', api);

/* ─────────────── Static client (production build) ─────────────── */

app.use(
  express.static(config.clientDist, {
    index: false,
    dotfiles: 'ignore',
    setHeaders(res, filePath) {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
      else res.setHeader('Cache-Control', 'public, max-age=604800');
    },
  }),
);

// Every other GET is handled by the SPA router.
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  res.sendFile(path.join(config.clientDist, 'index.html'), (error) => {
    if (!error) return;
    next(new HttpError(503, 'Client build not found. Run `npm run build` first, then start the server with `npm start`.'));
  });
});

/* ─────────────── Centralised error handling ─────────────── */

app.use((err, req, res, _next) => {
  const status = err instanceof HttpError ? err.status : err.status && Number.isInteger(err.status) ? err.status : 500;
  if (status >= 500) console.error('[api] unhandled error:', err);
  if (res.headersSent) return;
  res.status(status).json({
    status,
    message: status >= 500 ? 'Internal server error' : err.message,
    ...(err.details ? { details: err.details } : {}),
    ...(config.isProduction ? {} : { path: req.originalUrl }),
  });
});

const server = app.listen(config.port, config.host, () => {
  console.log(`[api] Automation Practice listening on http://localhost:${config.port} (${config.env})`);
});

function shutdown(signal) {
  console.log(`[api] ${signal} received - shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export { app, server };
