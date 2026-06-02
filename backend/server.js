if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('./src/app');
const pool = require('./src/config/db');
const initDb = require('./src/config/initDb');

const PORT = Number(process.env.PORT || 5000);
const DB_SOURCE = process.env.DATABASE_URL || process.env.MYSQL_URL
  ? 'DATABASE_URL/MYSQL_URL'
  : 'DB_HOST|DB_USER|DB_PASSWORD|DB_NAME (or MYSQLHOST|MYSQLUSER|MYSQLPASSWORD|MYSQLDATABASE)';

async function startServer() {
  try {
    // eslint-disable-next-line no-console
    console.log('DB config source:', DB_SOURCE);

    const conn = await pool.getConnection();
    conn.release();
    // eslint-disable-next-line no-console
    console.log('Database connected successfully.');

    await initDb();

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server.');
    // eslint-disable-next-line no-console
    console.error('Message:', error.message);
    // eslint-disable-next-line no-console
    console.error('Code:', error.code || 'N/A');
    // eslint-disable-next-line no-console
    console.error('Errno:', error.errno || 'N/A');
    // eslint-disable-next-line no-console
    console.error('SQL State:', error.sqlState || 'N/A');
    // eslint-disable-next-line no-console
    console.error('Host:', process.env.DB_HOST || process.env.MYSQLHOST || 'N/A');
    // eslint-disable-next-line no-console
    console.error('Port:', process.env.DB_PORT || process.env.MYSQLPORT || 'N/A');
    if (error.code === 'DB_ENV_MISSING') {
      // eslint-disable-next-line no-console
      console.error('Set Railway MySQL vars or DB_* vars in service Variables.');
    }
    process.exit(1);
  }
}

startServer();