import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const envConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  },
  fcmServerKey: process.env.FCM_SERVER_KEY || '',
  ai: {
    openAiKey: process.env.OPENAI_API_KEY || '',
    provider: process.env.AI_PROVIDER || 'openai',
  },
  app: {
    name: process.env.APP_NAME || 'AI Language Mentor',
    version: process.env.API_VERSION || 'v1',
  }
};
