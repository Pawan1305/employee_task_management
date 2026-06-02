require('dotenv').config();

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
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();