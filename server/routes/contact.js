import { Router } from 'express';
import { db } from '../db.js';
import { badRequest, isEmail, requireString, sanitizeText } from '../http.js';

export const contactRouter = Router();

const MAX_MESSAGES = 2000;

contactRouter.post('/', (req, res) => {
  const name = requireString(req.body, 'name', { min: 2, max: 60, label: 'Name' });
  const email = requireString(req.body, 'email', { min: 5, max: 120, label: 'Email' });
  const subject = requireString(req.body, 'subject', { min: 3, max: 120, label: 'Subject' });
  const message = requireString(req.body, 'message', { min: 10, max: 2000, label: 'Message' });

  if (!isEmail(email)) throw badRequest('Validation failed', ['A valid e-mail address is required']);

  const count = db.prepare('SELECT COUNT(*) AS count FROM contact_messages').get().count;
  if (count > MAX_MESSAGES) {
    db.prepare('DELETE FROM contact_messages WHERE id IN (SELECT id FROM contact_messages ORDER BY id ASC LIMIT 200)').run();
  }

  const info = db
    .prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)')
    .run(name, email.toLowerCase(), sanitizeText(subject), message);

  const row = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({
    data: {
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      createdAt: row.created_at,
    },
  });
});

contactRouter.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM contact_messages ORDER BY id DESC LIMIT 50').all();
  res.json({
    data: rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      createdAt: row.created_at,
    })),
  });
});
