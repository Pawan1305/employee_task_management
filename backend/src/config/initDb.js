const path = require('path');
const fs = require('fs');
const pool = require('./db');

/**
 * Reads database/schema.sql, strips statements that are unsafe to replay
 * (DROP TABLE, CREATE DATABASE, USE), rewrites CREATE TABLE to
 * CREATE TABLE IF NOT EXISTS, then executes each statement against the
 * connected pool.  Safe to call on every startup — tables that already
 * exist are left untouched.
 */
async function initDb() {
  // Resolve schema.sql relative to the repo root regardless of cwd.
  const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at: ${schemaPath}`);
  }

  const raw = fs.readFileSync(schemaPath, 'utf8');

  // Split on semicolons, trim whitespace, drop empty strings and comments.
  const statements = raw
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'))
    .map((s) => {
      // Skip DROP TABLE — we never want to destroy data on startup.
      if (/^DROP\s+TABLE/i.test(s)) return null;

      // Skip CREATE DATABASE / USE — Railway already provisions the DB.
      if (/^CREATE\s+DATABASE/i.test(s)) return null;
      if (/^USE\s+/i.test(s)) return null;

      // Upgrade CREATE TABLE → CREATE TABLE IF NOT EXISTS so re-runs are safe.
      return s.replace(
        /^CREATE\s+TABLE\s+(?!IF\s+NOT\s+EXISTS)/i,
        'CREATE TABLE IF NOT EXISTS '
      );
    })
    .filter(Boolean);

  const conn = await pool.getConnection();
  try {
    for (const statement of statements) {
      // eslint-disable-next-line no-await-in-loop
      await conn.query(statement);
    }
    // eslint-disable-next-line no-console
    console.log('Database schema initialised successfully.');
  } finally {
    conn.release();
  }
}

module.exports = initDb;
