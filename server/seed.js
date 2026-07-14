import bcrypt from 'bcryptjs';
import db from './db.js';

const ADMIN_EMAIL = 'admin@vioneta.com';
const ADMIN_PASS = 'Skyline1234@A';
const ADMIN_NAME = 'Admin';

export function seed() {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(ADMIN_EMAIL);
  if (existing) return;

  const hash = bcrypt.hashSync(ADMIN_PASS, 10);
  db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
    ADMIN_EMAIL, hash, ADMIN_NAME, 'admin'
  );
  console.log('Admin account seeded: admin@vioneta.com');
}
