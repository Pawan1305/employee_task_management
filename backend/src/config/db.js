const mysql = require('mysql2/promise');

const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
const isProd = process.env.NODE_ENV === 'production';

function readDbConfig() {
  const host = process.env.DB_HOST || process.env.MYSQLHOST;
  const port = Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306);
  const user = process.env.DB_USER || process.env.MYSQLUSER;
  const password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD;
  const database = process.env.DB_NAME || process.env.MYSQLDATABASE;

  if (isProd && !dbUrl) {
    const missing = [];
    if (!host) missing.push('DB_HOST/MYSQLHOST');
    if (!user) missing.push('DB_USER/MYSQLUSER');
    if (!password) missing.push('DB_PASSWORD/MYSQLPASSWORD');
    if (!database) missing.push('DB_NAME/MYSQLDATABASE');

    if (missing.length > 0) {
      const error = new Error(
        `Missing database environment variables in production: ${missing.join(', ')}`
      );
      error.code = 'DB_ENV_MISSING';
      throw error;
    }
  }

  return {
    host: host || 'localhost',
    port,
    user: user || 'root',
    password: password || '',
    database: database || 'employee_task_tracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

const pool = dbUrl
  ? mysql.createPool(dbUrl)
  : mysql.createPool(readDbConfig());

module.exports = pool;