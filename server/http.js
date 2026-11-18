/** HTTP helpers shared by every route. */

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const badRequest = (message, details) => new HttpError(400, message, details);
export const notFound = (message = 'Resource not found') => new HttpError(404, message);

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value);
export const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

export function requireString(body, field, { min = 1, max = 500, label = field } = {}) {
  const errors = [];
  const value = body?.[field];
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push(`${label} is required`);
  } else if (value.trim().length < min) {
    errors.push(`${label} must be at least ${min} characters`);
  } else if (value.trim().length > max) {
    errors.push(`${label} must be at most ${max} characters`);
  }
  if (errors.length) throw badRequest('Validation failed', errors);
  return value.trim();
}

export const sanitizeText = (value) => String(value).replace(/[\u0000-\u001f\u007f]/g, '').trim();
