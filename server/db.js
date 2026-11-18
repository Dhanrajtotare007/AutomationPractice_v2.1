import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { config } from './config.js';

fs.mkdirSync(path.dirname(config.dbFile), { recursive: true });

export const db = new Database(config.dbFile);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const SEED_EMPLOYEES = [
  ['Aarav Sharma', 'aarav.sharma@qaautomationlabs.com', 'Engineering', 'SDET', 78000, 'Active', '2023-03-14'],
  ['Priya Raman', 'priya.raman@qaautomationlabs.com', 'Quality Assurance', 'QA Engineer', 72000, 'Active', '2022-11-02'],
  ['Marco Silva', 'marco.silva@qaautomationlabs.com', 'Engineering', 'Frontend Developer', 85000, 'On leave', '2021-06-21'],
  ['Aditi Verma', 'aditi.verma@qaautomationlabs.com', 'Quality Assurance', 'SDET', 81000, 'Active', '2023-01-09'],
  ['Daniel Okafor', 'daniel.okafor@qaautomationlabs.com', 'Product', 'Product Manager', 96000, 'Active', '2020-09-30'],
  ['Lena Fischer', 'lena.fischer@qaautomationlabs.com', 'Design', 'UX Designer', 74000, 'Active', '2024-02-05'],
  ['Hiro Tanaka', 'hiro.tanaka@qaautomationlabs.com', 'Engineering', 'Backend Developer', 88000, 'Inactive', '2019-07-17'],
  ['Sofia Rossi', 'sofia.rossi@qaautomationlabs.com', 'Marketing', 'Product Manager', 69000, 'Active', '2022-04-11'],
  ['Rahul Nair', 'rahul.nair@qaautomationlabs.com', 'Quality Assurance', 'QA Engineer', 67000, 'On leave', '2024-08-19'],
  ['Emma Johnson', 'emma.johnson@qaautomationlabs.com', 'Support', 'Support Specialist', 58000, 'Active', '2023-10-23'],
  ['Chen Wei', 'chen.wei@qaautomationlabs.com', 'Engineering', 'SDET', 90000, 'Active', '2021-12-01'],
  ['Fatima Al-Sayed', 'fatima.alsayed@qaautomationlabs.com', 'Design', 'UX Designer', 71000, 'Active', '2024-05-06'],
];

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      department TEXT NOT NULL,
      role TEXT NOT NULL,
      salary REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Active',
      joined TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      completed TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS event_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const count = db.prepare('SELECT COUNT(*) AS count FROM employees').get().count;
  if (count === 0) {
    const insert = db.prepare(
      'INSERT INTO employees (name, email, department, role, salary, status, joined) VALUES (?, ?, ?, ?, ?, ?, ?)',
    );
    const seed = db.transaction(() => {
      for (const row of SEED_EMPLOYEES) insert.run(...row);
    });
    seed();
  }

  db.prepare("INSERT OR IGNORE INTO progress (id, completed, updated_at) VALUES (1, '[]', datetime('now'))").run();
}

export function closeDatabase() {
  if (db.open) db.close();
}
