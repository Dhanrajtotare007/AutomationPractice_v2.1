import { Router } from 'express';
import { db } from '../db.js';
import { badRequest, isEmail, notFound, sanitizeText } from '../http.js';

export const eventsRouter = Router();

const EVENT_IDS = new Set(['meetup-locators', 'workshop-cicd', 'summit-2027']);

eventsRouter.post('/:eventId/registrations', (req, res) => {
  const { eventId } = req.params;
  if (!EVENT_IDS.has(eventId)) throw notFound('Event not found');

  const name = sanitizeText(String(req.body?.name ?? ''));
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const errors = [];
  if (name.length < 2 || name.length > 60) errors.push('Name must be between 2 and 60 characters');
  if (!isEmail(email)) errors.push('A valid e-mail address is required');
  if (errors.length) throw badRequest('Validation failed', errors);

  const duplicate = db.prepare('SELECT id FROM event_registrations WHERE event_id = ? AND email = ?').get(eventId, email);
  if (duplicate) {
    res.status(200).json({ data: { id: duplicate.id, eventId, name, email, alreadyRegistered: true } });
    return;
  }

  const info = db
    .prepare('INSERT INTO event_registrations (event_id, name, email) VALUES (?, ?, ?)')
    .run(eventId, name, email);
  res.status(201).json({ data: { id: info.lastInsertRowid, eventId, name, email, alreadyRegistered: false } });
});
