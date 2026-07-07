import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { envConfig } from './config/env.config';
import { connectDatabase, closeDatabase } from './config/database.config';
import { initializeFirebase } from './config/firebase.config';
import logger from './utils/logger';
import { ApiError } from './utils/apiError';
import { ApiResponse } from './utils/apiResponse';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan(envConfig.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(compression());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Initialize external services
initializeFirebase();

// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, null, `${envConfig.app.name} API Server`));
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, { status: 'UP', timestamp: new Date() }, 'Health Check Passed'));
});

app.get(`/api/${envConfig.app.version}`, (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, null, `Welcome to ${envConfig.app.name} API ${envConfig.app.version}`));
});

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Route not found'));
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
    ...(envConfig.nodeEnv === 'development' && { stack: err.stack })
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDatabase();
    
    const server = app.listen(envConfig.port, () => {
      logger.info(`Server running in ${envConfig.nodeEnv} mode on port ${envConfig.port}`);
    });

    // Graceful Shutdown
    const gracefulShutdown = async () => {
      logger.info('Shutting down gracefully...');
      server.close(async () => {
        await closeDatabase();
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

startServer();
