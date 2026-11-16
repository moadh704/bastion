const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

process.env.JWT_SECRET = process.env.JWT_SECRET || 'light-demo-jwt-secret-bastion';

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many requests, please try again later',
  validate: { trustProxy: false, xForwardedForHeader: false },
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many login attempts, please try again later',
  validate: { trustProxy: false, xForwardedForHeader: false },
});
app.use('/api/auth', authLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'bastion' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
