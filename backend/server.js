if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    const conn = await pool.getConnection();
    conn.release();
    // eslint-disable-next-line no-console
    console.log('Database connected successfully.');

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
    process.exit(1);
  }
}

startServer();