import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const envConfig = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'lumina_ai_mentor_jwt_secret_development_key_2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'lumina_ai_mentor_refresh_secret_key_2026',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  },
  fcmServerKey: process.env.FCM_SERVER_KEY || '',
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
    openAiKey: process.env.OPENAI_API_KEY || '',
    provider: process.env.AI_PROVIDER || 'gemini',
  },
  app: {
    name: process.env.APP_NAME || 'AI Language Mentor',
    version: process.env.API_VERSION || 'v1',
  }
};
