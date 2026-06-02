const mysql = require('mysql2/promise');

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

function readDbConfig() {
  const host = process.env.DB_HOST || process.env.MYSQLHOST;
  const port = Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306);
  const user = process.env.DB_USER || process.env.MYSQLUSER;
  const password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD;
  const database = process.env.DB_NAME || process.env.MYSQLDATABASE;

  // Always validate — connecting to localhost when env vars are missing causes
  // ECONNREFUSED in containerised environments like Railway.
  const missing = [];
  if (!host) missing.push('DB_HOST (or MYSQLHOST)');
  if (!user) missing.push('DB_USER (or MYSQLUSER)');
  if (!password) missing.push('DB_PASSWORD (or MYSQLPASSWORD)');
  if (!database) missing.push('DB_NAME (or MYSQLDATABASE)');

  if (missing.length > 0) {
    const error = new Error(
      `Missing required database environment variables: ${missing.join(', ')}. ` +
      'Set these in your Railway service Variables (or link the MySQL service to inject MYSQL* vars automatically).'
    );
    error.code = 'DB_ENV_MISSING';
    throw error;
  }

  return {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

const pool = dbUrl
  ? mysql.createPool(dbUrl)
  : mysql.createPool(readDbConfig());

module.exports = pool;