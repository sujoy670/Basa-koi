import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { globalRateLimiter } from './middleware/rateLimiter';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Global rate limiting
app.use('/api', globalRateLimiter);

// API Routes
app.use('/api/v1', apiRoutes);

// Centralized error handler
app.use(errorHandler);

if (env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`🚀 Basa-koi API Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

export default app;

