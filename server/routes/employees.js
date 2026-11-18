import { Router } from 'express';
import { db } from '../db.js';
import { HttpError, badRequest, isEmail, isIsoDate, notFound, requireString, sanitizeText } from '../http.js';

const DEPARTMENTS = ['Engineering', 'Quality Assurance', 'Product', 'Design', 'Marketing', 'Support'];
const STATUSES = ['Active', 'On leave', 'Inactive'];
const SORTABLE = new Set(['name', 'email', 'department', 'role', 'salary', 'status', 'joined', 'id']);
const MAX_PAGE_SIZE = 50;
const MAX_ROWS = 500;

export const employeesRouter = Router();

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    department: row.department,
    role: row.role,
    salary: row.salary,
    status: row.status,
    joined: row.joined,
  };
}

function validateEmployee(body, { partial = false } = {}) {
  const errors = [];
  const output = {};

  const name = typeof body?.name === 'string' ? sanitizeText(body.name) : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const department = typeof body?.department === 'string' ? body.department.trim() : '';
  const role = typeof body?.role === 'string' ? sanitizeText(body.role) : '';
  const status = typeof body?.status === 'string' ? body.status.trim() : 'Active';
  const joined = typeof body?.joined === 'string' ? body.joined.trim() : '';
  const salary = Number(body?.salary);

  if (!partial || body?.name !== undefined) {
    if (name.length < 2) errors.push('Name must be at least 2 characters');
    else if (name.length > 60) errors.push('Name must be at most 60 characters');
    else output.name = name;
  }
  if (!partial || body?.email !== undefined) {
    if (!isEmail(email)) errors.push('A valid e-mail address is required');
    else output.email = email;
  }
  if (!partial || body?.department !== undefined) {
    if (!DEPARTMENTS.includes(department)) errors.push(`Department must be one of: ${DEPARTMENTS.join(', ')}`);
    else output.department = department;
  }
  if (!partial || body?.role !== undefined) {
    if (role.length < 2 || role.length > 60) errors.push('Role must be between 2 and 60 characters');
    else output.role = role;
  }
  if (!partial || body?.salary !== undefined) {
    if (!Number.isFinite(salary) || salary < 0 || salary > 1_000_000) errors.push('Salary must be between 0 and 1,000,000');
    else output.salary = Math.round(salary);
  }
  if (!partial || body?.status !== undefined) {
    if (!STATUSES.includes(status)) errors.push(`Status must be one of: ${STATUSES.join(', ')}`);
    else output.status = status;
  }
  if (!partial || body?.joined !== undefined) {
    if (!isIsoDate(joined)) errors.push('Join date must be a valid ISO date (YYYY-MM-DD)');
    else output.joined = joined;
  }

  if (errors.length) throw badRequest('Validation failed', errors);
  return output;
}

employeesRouter.get('/', (req, res) => {
  const search = sanitizeText(String(req.query.search ?? '')).toLowerCase();
  const sortBy = SORTABLE.has(String(req.query.sortBy)) ? String(req.query.sortBy) : 'id';
  const sortDir = String(req.query.sortDir) === 'desc' ? 'DESC' : 'ASC';
  const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number.parseInt(String(req.query.pageSize ?? '5'), 10) || 5));

  const where = search
    ? 'WHERE LOWER(name) LIKE @like OR LOWER(email) LIKE @like OR LOWER(department) LIKE @like OR LOWER(role) LIKE @like OR LOWER(status) LIKE @like'
    : '';
  const params = search ? { like: `%${search}%` } : {};

  const total = db.prepare(`SELECT COUNT(*) AS count FROM employees ${where}`).get(params).count;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;

  const rows = db
    .prepare(`SELECT * FROM employees ${where} ORDER BY ${sortBy} ${sortDir}, id ASC LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit: pageSize, offset });

  res.json({
    data: {
      items: rows.map(mapRow),
      total,
      page: safePage,
      pageSize,
      totalPages,
      sortBy,
      sortDir: sortDir.toLowerCase(),
    },
  });
});

employeesRouter.post('/', (req, res) => {
  const payload = validateEmployee(req.body);
  const count = db.prepare('SELECT COUNT(*) AS count FROM employees').get().count;
  if (count >= MAX_ROWS) throw badRequest('Employee limit reached for the practice environment');
  const duplicate = db.prepare('SELECT id FROM employees WHERE email = ?').get(payload.email);
  if (duplicate) throw new HttpError(409, 'An employee with this e-mail already exists');
  const info = db
    .prepare('INSERT INTO employees (name, email, department, role, salary, status, joined) VALUES (@name, @email, @department, @role, @salary, @status, @joined)')
    .run(payload);
  const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ data: mapRow(row) });
});

employeesRouter.put('/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) throw badRequest('Invalid employee id');
  const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
  if (!existing) throw notFound('Employee not found');

  const payload = validateEmployee({ ...mapRow(existing), ...req.body }, { partial: false });
  if (payload.email !== existing.email) {
    const duplicate = db.prepare('SELECT id FROM employees WHERE email = ? AND id <> ?').get(payload.email, id);
    if (duplicate) throw new HttpError(409, 'An employee with this e-mail already exists');
  }
  db.prepare(
    'UPDATE employees SET name=@name, email=@email, department=@department, role=@role, salary=@salary, status=@status, joined=@joined WHERE id=@id',
  ).run({ ...payload, id });
  const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
  res.json({ data: mapRow(row) });
});

employeesRouter.delete('/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) throw badRequest('Invalid employee id');
  const info = db.prepare('DELETE FROM employees WHERE id = ?').run(id);
  if (info.changes === 0) throw notFound('Employee not found');
  res.json({ data: { id } });
});

export { requireString };
