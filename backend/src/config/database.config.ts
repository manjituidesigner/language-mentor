// Re-export Neon Postgres pool and helpers for backwards compatibility
export { pool, query, testConnection as connectDatabase, closePool as closeDatabase } from './neon.config';
