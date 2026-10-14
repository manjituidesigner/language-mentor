import { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg';
import { envConfig } from './env.config';
import logger from '../utils/logger';

// Determine SSL requirement: Neon Postgres requires SSL
const isNeon = envConfig.databaseUrl.includes('neon.tech');
const isProduction = envConfig.nodeEnv === 'production';

const poolConfig: PoolConfig = {
  connectionString: envConfig.databaseUrl || undefined,
  max: 20, // Max clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: (isNeon || isProduction)
    ? { rejectUnauthorized: false }
    : undefined,
};

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  logger.error(`Unexpected error on idle Neon Postgres client: ${err.message}`);
});

export const query = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      logger.warn(`Slow Neon query (${duration}ms): ${text.substring(0, 80)}...`);
    }
    return res;
  } catch (error: any) {
    logger.error(`Neon query error: ${error.message} - Query: ${text}`);
    throw error;
  }
};

export const testConnection = async (): Promise<boolean> => {
  if (!envConfig.databaseUrl) {
    logger.warn('DATABASE_URL is not set. Neon Postgres features will run in offline demo mode.');
    return false;
  }

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time, version() as version;');
    client.release();
    logger.info(`Neon Postgres connected successfully at ${res.rows[0].current_time}`);
    return true;
  } catch (error: any) {
    logger.warn(`Could not establish live Neon Postgres connection (${error.message}). Server running with resilience.`);
    return false;
  }
};

export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    logger.info('Neon Postgres connection pool closed.');
  } catch (error: any) {
    logger.error(`Error closing Neon pool: ${error.message}`);
  }
};
