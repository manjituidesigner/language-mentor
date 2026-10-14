import { loggerConfig } from '../config/logger.config';

const getTimestamp = () => new Date().toISOString();

const logger = {
  info: (message: string) => {
    console.log(`[INFO] ${getTimestamp()} - ${message}`);
  },
  error: (message: string) => {
    console.error(`[ERROR] ${getTimestamp()} - ${message}`);
  },
  warn: (message: string) => {
    console.warn(`[WARN] ${getTimestamp()} - ${message}`);
  },
  debug: (message: string) => {
    if (loggerConfig.level === 'debug') {
      console.debug(`[DEBUG] ${getTimestamp()} - ${message}`);
    }
  },
};

export default logger;
