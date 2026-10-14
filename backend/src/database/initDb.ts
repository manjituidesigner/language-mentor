import fs from 'fs';
import path from 'path';
import { pool, testConnection } from '../config/neon.config';
import logger from '../utils/logger';

export const initializeDatabase = async (): Promise<boolean> => {
  logger.info('Initializing Neon Postgres database schema...');

  const isConnected = await testConnection();
  if (!isConnected) {
    logger.warn('Skipping schema migration because Neon Postgres is not connected.');
    return false;
  }

  const client = await pool.connect();
  try {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await client.query('BEGIN');
    await client.query(schemaSql);
    await client.query('COMMIT');

    logger.info('Neon Postgres database schema initialized and seeded successfully.');
    return true;
  } catch (error: any) {
    await client.query('ROLLBACK');
    logger.error(`Database initialization failed: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
};

// If run directly via command line
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      logger.info('Database migration script completed.');
      process.exit(0);
    })
    .catch((err) => {
      logger.error(`Error during manual DB migration: ${err}`);
      process.exit(1);
    });
}
