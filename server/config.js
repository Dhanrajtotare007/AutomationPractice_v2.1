import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const serverDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(serverDir, '..');

function loadDotEnv() {
  const file = path.join(rootDir, '.env');
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const index = line.indexOf('=');
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv();

const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT ?? 4000);

const configuredOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

/**
 * Allowed browser origins for the API. The server's own origin is always
 * trusted (the SPA and the API are served from the same place), plus the Vite
 * dev server and anything listed in CORS_ORIGINS.
 */
const corsOrigins = [
  `http://localhost:${port}`,
  `http://127.0.0.1:${port}`,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...configuredOrigins,
];

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  isProduction,
  port,
  host: process.env.HOST ?? '0.0.0.0',
  rootDir,
  clientDist: path.join(rootDir, 'dist'),
  dbFile: process.env.DATABASE_FILE ? path.resolve(rootDir, process.env.DATABASE_FILE) : path.join(rootDir, 'data', 'playground.db'),
  corsOrigins: [...new Set(corsOrigins)],
  version: '1.0.0',
};
