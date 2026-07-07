import { envConfig } from './env.config';

export const loggerConfig = {
  level: envConfig.nodeEnv === 'development' ? 'debug' : 'info',
  format: 'json'
};
