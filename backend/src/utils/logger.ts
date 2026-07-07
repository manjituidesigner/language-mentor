import { loggerConfig } from '../config/logger.config';

const logger = {
  info: (message: string) => console.log([INFO]  - ),
  error: (message: string) => console.error([ERROR]  - ),
  warn: (message: string) => console.warn([WARN]  - ),
  debug: (message: string) => {
    if (loggerConfig.level === 'debug') console.debug([DEBUG]  - )
  },
};

export default logger;
