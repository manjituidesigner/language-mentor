import { envConfig } from './env.config';

export const serverConfig = {
  port: envConfig.port,
  corsOrigins: '*',
};
