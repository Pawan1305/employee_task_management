const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

const clientUrls = (process.env.CLIENT_URL || process.env.CORS_ORIGINS || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...clientUrls,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174',
]);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without Origin header (e.g., curl/postman/server-to-server).
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost with any port for local frontend runs.
      if (/^https?:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }

      // Allow common hosted frontend preview domains.
      if (origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app')) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use(errorMiddleware);

module.exports = app;