import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { envConfig } from './config/env.config';
import { testConnection, closePool } from './config/neon.config';
import { initializeDatabase } from './database/initDb';
import apiRoutes from './routes';
import logger from './utils/logger';
import { ApiError } from './utils/apiError';
import { ApiResponse } from './utils/apiResponse';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan(envConfig.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(compression());
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

// Health Check & Root Endpoints
app.get('/', (req: Request, res: Response) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        appName: envConfig.app.name,
        version: envConfig.app.version,
        database: 'Neon Serverless Postgres',
        aiEngine: envConfig.ai.provider,
      },
      `${envConfig.app.name} API Server`
    )
  );
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: 'Neon Postgres',
      },
      'Health Check Passed'
    )
  );
});

// Mount Main API Routes
// Mount both /api/v1 and /api for versatile frontend compatibility
app.use(`/api/${envConfig.app.version}`, apiRoutes);
app.use('/api', apiRoutes);

// Diagnostic Crash Logging Endpoint
const latestCrashLogs: any[] = [];
app.post('/api/crash-log', (req: Request, res: Response) => {
  const crashData = {
    receivedAt: new Date().toISOString(),
    ...req.body,
  };
  latestCrashLogs.unshift(crashData);
  if (latestCrashLogs.length > 50) latestCrashLogs.pop();
  logger.error(`[MOBILE_CRASH_REPORT] ${JSON.stringify(crashData)}`);
  res.status(200).json({ success: true, message: 'Crash logged' });
});

app.get('/api/crash-log', (req: Request, res: Response) => {
  res.status(200).json({ success: true, count: latestCrashLogs.length, logs: latestCrashLogs });
});

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
});

// Global Error Handler
app.use((err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    logger.error(err.stack || err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err instanceof ApiError ? err.errors : [],
    ...(envConfig.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Start Server
const startServer = async () => {
  try {
    logger.info(`Starting ${envConfig.app.name} with Neon Postgres backend...`);

    // Verify Neon Postgres connection
    const dbConnected = await testConnection();
    if (dbConnected) {
      try {
        await initializeDatabase();
      } catch (initErr: any) {
        logger.warn(`Database auto-init note: ${initErr.message}`);
      }
    } else {
      logger.info('Neon connection pending or offline. Using resilient fallback responses.');
    }

    const server = app.listen(envConfig.port, () => {
      logger.info(`🚀 Server running on http://localhost:${envConfig.port} in ${envConfig.nodeEnv} mode`);
      logger.info(`📡 API Endpoints available at http://localhost:${envConfig.port}/api/${envConfig.app.version}`);
    });

    // Graceful Shutdown
    const gracefulShutdown = async () => {
      logger.info('Shutting down server gracefully...');
      server.close(async () => {
        await closePool();
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

// Export app for Vercel and serverless environments
export default app;
export { app };

// Only bind port locally when not running in serverless (e.g., Vercel)
if (!process.env.VERCEL) {
  startServer();
}
