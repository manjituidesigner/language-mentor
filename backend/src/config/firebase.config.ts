import * as admin from 'firebase-admin';
import { envConfig } from './env.config';
import logger from '../utils/logger';

export const initializeFirebase = () => {
  try {
    if (!admin.apps.length && envConfig.firebase.projectId && envConfig.firebase.clientEmail) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: envConfig.firebase.projectId,
          clientEmail: envConfig.firebase.clientEmail,
          privateKey: envConfig.firebase.privateKey,
        }),
        storageBucket: envConfig.firebase.storageBucket,
      });
      logger.info('Firebase Admin SDK initialized successfully.');
    }
  } catch (error: any) {
    logger.warn(`Firebase Admin SDK initialization note: ${error.message}`);
  }
};

export const getFirestore = () => admin.firestore();
export const getAuth = () => admin.auth();
export const getStorage = () => admin.storage();
export const getMessaging = () => admin.messaging();
