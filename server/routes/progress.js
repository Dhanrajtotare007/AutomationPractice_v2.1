import { Router } from 'express';
import { db } from '../db.js';
import { badRequest } from '../http.js';

export const progressRouter = Router();

function parseCompleted(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((key) => typeof key === 'string') : [];
  } catch {
    return [];
  }
}

progressRouter.get('/', (_req, res) => {
  const row = db.prepare('SELECT completed, updated_at FROM progress WHERE id = 1').get();
  res.json({ data: { completed: parseCompleted(row?.completed ?? '[]'), updatedAt: row?.updated_at ?? null } });
});

progressRouter.put('/', (req, res) => {
  const completed = req.body?.completed;
  if (!Array.isArray(completed)) throw badRequest('`completed` must be an array of exercise keys');
  if (completed.length > 500) throw badRequest('Too many exercise keys');
  if (!completed.every((key) => typeof key === 'string' && key.length <= 64)) {
    throw badRequest('Every exercise key must be a string of at most 64 characters');
  }
  const unique = [...new Set(completed)].sort();
  db.prepare("UPDATE progress SET completed = ?, updated_at = datetime('now') WHERE id = 1").run(JSON.stringify(unique));
  const row = db.prepare('SELECT updated_at FROM progress WHERE id = 1').get();
  res.json({ data: { completed: unique, updatedAt: row.updated_at } });
});
